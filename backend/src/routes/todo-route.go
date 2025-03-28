package routes

import (
	"fmt"
	"log"
	"todo/src/mydb"
	"todo/src/mystructs"

	"github.com/gofiber/fiber/v3"
	"github.com/jmoiron/sqlx"
)

func CreateTodo(c fiber.Ctx, db *sqlx.DB, cred *mystructs.TodoCredentials, userId string) error {
	log.Print("The value of isDone and isDeleted is ", cred.IsDeleted, " ", cred.IsDone)
	id, err := mydb.InsertDataToTodo(db, cred.Text, userId, cred.IsDone, cred.IsDeleted)

	log.Println("Id is ", id)

	if err != nil {
		log.Print("Failed To Insert IN Db")
		return err
	}

	return c.JSON(fiber.Map{
		"message": "Created success fully",
		"id":      id,
	})
}

func GetTodoById(c fiber.Ctx, db *sqlx.DB, todoId string, userId string) error {
	log.Print("The user and todo id's are ", userId, todoId)
	query := `SELECT * FROM todos WHERE userId = $1 AND id = $2 AND isDeleted = FALSE`

	var todos []mystructs.Todo

	err := db.Select(&todos, query, userId, todoId)

	log.Print("Error is ", err)

	if err != nil {
		return fmt.Errorf("The error is %v", err)
	}

	return c.JSON(todos)

}

func DeleteTodo(c fiber.Ctx, db *sqlx.DB, todoId string, userId string) error {
	log.Print("The user Id is ", userId)
	updateQuery := `UPDATE todos SET isDeleted = TRUE WHERE id = $1 AND userId = $2`

	result, err := db.Exec(updateQuery, todoId, userId)

	if err != nil {
		return fmt.Errorf("error updating todo: %w", err)
	}

	rowsAffected, err := result.RowsAffected()

	if err != nil {
		return fmt.Errorf("Error while getting the rows %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("todo with ID %s not found or user %s does not have permission", todoId, userId)
	}

	query := `SELECT id, userId, text, isDone, isDeleted, createdAt, updateAt FROM todos WHERE userId = $1 AND isDeleted = FALSE`

	var updatedTodos []mystructs.Todo

	selectErr := db.Select(&updatedTodos, query, userId)

	log.Print("Selected Error is ", selectErr)

	if selectErr != nil {
		return fmt.Errorf("error while getting the todos %v", err)
	}

	log.Print(updatedTodos)

	return c.JSON(fiber.Map{
		"todos": updatedTodos,
	})

}
