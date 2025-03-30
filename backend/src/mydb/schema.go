package mydb

import (
	"fmt"
	"log"

	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"
)

func CreateSchema(db *sqlx.DB) error {
	var schema = `CREATE TABLE IF NOT EXISTS users (
		id  UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
		email VARCHAR(255),
		name  VARCHAR(255),
		password VARCHAR(255),
		createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		UNIQUE(email)
);
	CREATE TABLE IF NOT EXISTS todos (
		id 	UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		text VARCHAR(255),
		userId UUID NOT NULL,
		isDone BOOLEAN DEFAULT FALSE,
		isDeleted BOOLEAN DEFAULT FALSE,
		createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (userId) REFERENCES users(id)
	);`
	_, err := db.Exec(schema)

	if err != nil {
		return fmt.Errorf("error while inserting data %w", err)
	}
	return nil
}

func InsertDataToTodo(db *sqlx.DB, text string, userId string, isDone bool, isDeleted bool) (string, error) {
	// data := `INSERT INTO todos (text, isDone, isDeleted) VALUES (? , ?, ?) RETURNING id`
	// log.Print("Hi there data ", data)
	// result := db.MustExec(data, text, isDone, isDeleted)
	// log.Print("Result is ", result)

	// return result, nil

	query := `INSERT INTO todos (text, isDone, isDeleted, userId) VALUES ($1, $2, $3, $4) RETURNING id`

	log.Println("SQL Query:", query)

	var id string
	err := db.QueryRowx(query, text, isDone, isDeleted, userId).Scan(&id)
	if err != nil {
		return "", fmt.Errorf("error inserting todo: %w", err)
	}

	log.Printf("Inserted todo with ID: %s", id)
	return id, nil
}

func InsertDataToUsers(db *sqlx.DB, email string, name string, password string) (string, error) {

	query := `INSERT INTO users (email,name, password) VALUES ($1, $2, $3) RETURNING id`

	log.Print("Sql Query ", query)

	hashedPassword, err1 := GenerateHashedPassword(password)

	if err1 != nil {
		return "", fmt.Errorf("error while generating hashed password")
	}

	var id string
	err := db.QueryRow(query, email, name, hashedPassword).Scan(&id)
	if err != nil {
		return "", fmt.Errorf("error while inserting in users %w", err)
	}
	log.Printf("Inserted user with id %s", id)
	return id, nil
}

func GenerateHashedPassword(password string) (string, error) {
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), 12)

	return string(hashedBytes), err
}
