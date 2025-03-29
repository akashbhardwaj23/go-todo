package routes

import (
	"fmt"
	"log"
	"todo/src/mydb"
	"todo/src/mystructs"

	"github.com/gofiber/fiber/v3"
	"github.com/jmoiron/sqlx"
)

func CreateUser(c fiber.Ctx, db *sqlx.DB, cred *mystructs.UserCredentials) error {
	id, err := mydb.InsertDataToUsers(db, cred.Email, cred.Name, cred.Password)

	if err != nil {
		log.Print("Error while Inserting data ", err)
		return c.Status(fiber.ErrBadRequest.Code).JSON(fiber.Map{
			"message": "User is Already Present",
			"error":   err,
		})
	}

	return c.JSON(fiber.Map{
		"message": "User Created Successfully",
		"id":      id,
	})
}

func GetUserByEmail(c fiber.Ctx, db *sqlx.DB, email string, password string) error {
	var user mystructs.User
	getQuery := `SELECT id, email, name, password, createdAt FROM users WHERE email = $1`

	log.Print("Here")

	err := db.Get(&user, getQuery, email)

	log.Print("Error is ", err)

	if err != nil {
		return fmt.Errorf("error while getting user %v", err)
	}

	if user.Password != password {
		return c.Status(fiber.ErrBadRequest.Code).JSON(fiber.Map{
			"message": "Incorrect Password",
		})
	}

	return c.JSON(fiber.Map{
		"id":        user.Id,
		"email":     user.Email,
		"name":      user.Name,
		"createdAt": user.CreatedAt,
	})
}

func GetUserById(c fiber.Ctx, db *sqlx.DB, userId string) error {
	var user mystructs.User
	query := `SELECT id, email, createdAt FROM users WHERE userId = $1`

	err := db.Get(&user, query, userId)

	if err != nil {
		return fmt.Errorf("error while getting the user %v", err)
	}

	return c.JSON(fiber.Map{
		"id":        user.Id,
		"email":     user.Email,
		"name":      user.Name,
		"createdAt": user.CreatedAt,
	})
}

func GetTodosByUserId(c fiber.Ctx, db *sqlx.DB, userId string) error {
	var todos []mystructs.Todo
	query := `SELECT id, userId, text, isDone, isDeleted, createdAt, updateAt FROM todos WHERE userId = $1 AND isDeleted = FALSE`

	err := db.Select(&todos, query, userId)

	if err != nil {
		return fmt.Errorf("Error While Getting Todos %w", err)
	}

	return c.JSON(todos)
}
