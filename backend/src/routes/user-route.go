package routes

import (
	"fmt"
	"todo/src/mydb"
	"todo/src/mystructs"

	"github.com/gofiber/fiber/v3"
	"github.com/jmoiron/sqlx"
)

func CreateUser(c fiber.Ctx, db *sqlx.DB, cred *mystructs.UserCredentials) error {
	id, err := mydb.InsertDataToUsers(db, cred.Name, cred.Password)

	if err != nil {
		panic(err)
	}

	return c.JSON(fiber.Map{
		"message": "User Created Successfully",
		"id":      id,
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
