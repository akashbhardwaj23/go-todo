import { useCallback, useEffect, useState } from "react";
import axios from "axios"
import { BACKEND_URL } from "@/config";




interface TodoInterface {
    id: string;
    text: string;
    userId : string
    isDone: boolean;
    isDeleted: boolean;
    createdAt : Date;
    updatedAt : Date
  }
  

export function useTodos(){
    const [todos, setTodos] = useState<TodoInterface[]>([]);
    const [loading, setLoading] = useState(false);

   

    const fetchTodos = useCallback(async () => {
        const userId = localStorage.getItem("userId");

        if(!userId){
            console.log("User Id is Not Present")
            return 
        }
        const response = await axios.get(`${BACKEND_URL}/api/getTodos`, {
            headers : {
                "userId": userId
            }
        })

        const data = response.data
        setTodos(data)
    }, [todos])

    useEffect(() => {
        fetchTodos()
    }, [])

    return {
        todos,
        setTodos,
        loading
    }
}
