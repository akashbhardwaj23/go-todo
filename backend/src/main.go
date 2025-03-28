package main

import (
	"fmt"
	"log"
	"os"
	"todo/src/mydb"
	"todo/src/mystructs"
	"todo/src/routes"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/joho/godotenv"
)

func Middleware(c fiber.Ctx) error {
	userId := c.Get("userId")
	log.Print("USER ID IS ", userId)
	if userId == "" {
		log.Print("User Id is Not Present")
		return c.Status(fiber.ErrBadGateway.Code).JSON(fiber.Map{
			"message": "UserId is Not Present",
		})
	}
	c.Locals("userId", userId)
	return c.Next()
}

func main() {
	err := godotenv.Load(".env")

	if err != nil {
		log.Print("Error While loading env")
		return
	}

	logFile, err := os.OpenFile("server.log", os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)
	if err != nil {
		fmt.Println("Error creating log file:", err)
		return
	}
	defer logFile.Close()
	log.SetOutput(logFile)
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)

	app := fiber.New()
	app.Use(cors.New())
	app.Use(logger.New())

	db, dberr := mydb.NewConnection()

	if dberr != nil {
		log.Fatal("Error While connecting")
	}

	// Group the request
	api := app.Group("/api")
	api.Use(Middleware)
	defer db.Close()

	api.Get("/getTodos", func(c fiber.Ctx) error {
		userId := c.Locals("userId").(string)

		return routes.GetTodosByUserId(c, db, userId)
	})

	app.Post("/create-user", func(c fiber.Ctx) error {
		cred := new(mystructs.UserCredentials)

		if err := c.Bind().Body(cred); err != nil {
			return c.Status(fiber.ErrBadGateway.Code).JSON(fiber.Map{
				"message": "Can;t get the Body",
				"error":   err,
			})

		}

		return routes.CreateUser(c, db, cred)
	})

	api.Get("/getTodo/:todoId", func(c fiber.Ctx) error {
		userId := c.Locals("userId").(string)
		todoId := c.Params("todoId")

		return routes.GetTodoById(c, db, todoId, userId)
	})

	api.Post("/deleteTodo/:todoId", Middleware, func(c fiber.Ctx) error {
		userId := c.Locals("userId").(string)
		todoId := c.Params("todoId")

		return routes.DeleteTodo(c, db, todoId, userId)
	})

	api.Post("/create", Middleware, func(c fiber.Ctx) error {
		log.Print("What happened")
		userId, ok := c.Locals("userId").(string)

		if !ok {
			log.Print("User Id is Not Found")
			return c.Status(fiber.ErrBadRequest.Code).JSON(fiber.Map{
				"message": "User Id is not Found",
				"error":   ok,
			})
		}
		log.Print("userId in create ", userId)
		cred := new(mystructs.TodoCredentials)

		log.Print("Credentials", cred)

		if err := c.Bind().Body(cred); err != nil {
			return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{
				"error": "Can't Get the Body",
			})
		}

		log.Print("After err")

		log.Print("The value of cread Text is ", cred.Text)
		return routes.CreateTodo(c, db, cred, userId)
	})

	log.Fatal(app.Listen(":3001"))
}
