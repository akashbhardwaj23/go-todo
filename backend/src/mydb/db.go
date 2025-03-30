package mydb

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func NewConnection() (*sqlx.DB, error) {
	godotenv.Load(".env")
	log.Print("The env is ", os.Getenv("DATABASE_URL"))
	db, err := sqlx.Connect("postgres", os.Getenv("DATABASE_URL"))

	if err != nil {
		log.Print(err)
		return nil, fmt.Errorf("Error Connecting to Db %v", err)
	}

	if err := db.Ping(); err != nil {
		log.Print("Error While Connecting")
	}

	// set connection pool settings
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	return db, nil
}
