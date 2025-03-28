import { BACKEND_URL } from "@/config";
import axios from "axios";


export async function deleteTodo(id : string){
    const userId = localStorage.getItem("userId");

    if(!userId){
        console.log("User Id is Not Present")
        return
    }
    const response = await axios.post(`${BACKEND_URL}/deleteTodo/${id}`, {}, {
        headers : {
            "userId": userId
        }
    })
    
    const data = response.data.todos;
    return data
}

export async function getTodo(userId : string, todoId : string){
    const response = await axios.get(`${BACKEND_URL}/api/getTodo/${todoId}`, {
        headers : {
            "userId": userId
        }
    })

    const data = response.data;

    return data
}

export async function addTodo(input : string){
    const userId = localStorage.getItem("userId");

    if(!userId){
        console.log("User Id is not there")
        return
    }

    const response = await axios.post(`${BACKEND_URL}/api/create`, {
        text : input,
        isDone : false,
        isDeleted : false
    }, {
        headers : {
            "userId" : userId
        }
    })


    const todoId = response.data.id

    const data = await getTodo(userId, todoId)

    console.log(data)

    return data[0]
}