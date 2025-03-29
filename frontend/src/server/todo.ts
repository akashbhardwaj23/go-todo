import { BACKEND_URL } from "@/config";
import axios from "axios";



interface TodoInterface {
    id: string;
    text: string;
    userId : string
    isDone: boolean;
    isDeleted: boolean;
    createdAt : Date;
    updatedAt : Date
  }

export async function deleteTodo(id: string) {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.log("User Id is Not Present");
    return;
  }
  const response = await axios.post(
    `${BACKEND_URL}/deleteTodo/${id}`,
    {},
    {
      headers: {
        userId: userId,
      },
    }
  );

  const data = response.data.todos;
  return data;
}




export async function editTodo(id : string, text : string){
    const userId = localStorage.getItem('userId');

    const response = await axios.post(`${BACKEND_URL}/api/edit/${id}`, {
        text
    }, {
        headers : {
            "userId": userId
        }
    })

    const data = response.data;

    return data
}

export async function checkTodo(todoId: string, value: boolean) {
  const userId = localStorage.getItem("userId");
    console.log(value)
  const response = await axios.post(
    `${BACKEND_URL}/api/change/done/${todoId}`,
    {
      isDone: value,
    },
    {
      headers: {
        userId: userId,
      },
    }
  );

  const data:TodoInterface = response.data;

  return data
}

export async function getTodo(userId: string, todoId: string) {
  const response = await axios.get(`${BACKEND_URL}/api/getTodo/${todoId}`, {
    headers: {
      userId: userId,
    },
  });

  const data = response.data;

  return data;
}

export async function addTodo(input: string) {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.log("User Id is not there");
    return;
  }

  const response = await axios.post(
    `${BACKEND_URL}/api/create`,
    {
      text: input,
      isDone: false,
      isDeleted: false,
    },
    {
      headers: {
        userId: userId,
      },
    }
  );

  const todoId = response.data.id;

  const data = await getTodo(userId, todoId);

  console.log(data);

  return data[0];
}
