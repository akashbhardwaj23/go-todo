package main

import (
	"log"
	"todo/src/mydb"
)

func main() {
	conn, err := mydb.NewConnection()

	if err != nil {
		panic(err)
	}

	defer conn.Close()

	log.Print("Connected to Db")

	if err := mydb.CreateSchema(conn); err != nil {
		panic(err)
	}
}
