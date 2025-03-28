import React , { useState } from "react";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { Checkbox } from "./components/ui/checkbox";
import { Input } from "./components/ui/input";
import { X } from "lucide-react";
import { useTodos } from "./hooks/useTodo";
import { addTodo, deleteTodo } from "./server/todo";

interface TodoInterface {
  id: string;
  text: string;
  userId : string
  isDone: boolean;
  isDeleted: boolean;
  createdAt : Date;
  updatedAt : Date
}

const mockTodos: TodoInterface[] = [
  {
    id: "1",
    text: "Work",
    userId: "user1",
    isDone: false,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    text: "Study",
    userId: "user2",
    isDone: false,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    text: "Shopping",
    userId: "user3",
    isDone: false,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    text: "Exercise",
    userId: "user4",
    isDone: false,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];




export function TodoComponent() {
  const { todos, setTodos, loading } = useTodos();
  const [input, setInput] = useState("")
 

  const setChecked = (id : string) => {
    setTodos((todos => {
          const newTodos = todos?.map((todo) => {
            if(todo.id === id){
              todo.isDone = true;
            }
            return todo
          })

          if(!newTodos){
            return []
          }

          return newTodos;
    }))
  }

  const deleteTheTodo = async(id : string) => {
    const data = await deleteTodo(id);
    setTodos(data)
  }

  if(loading){
    return <div className="flex justify-center min-h-screen">
        Loading
    </div>
  }

  return (
    <div className="flex justify-center py-10 px-8 w-full">
      <div className="w-full lg:w-1/2 p-4">
        <div className="flex items-center">
          <h1 className="text-2xl mb-2">Add Your Todo's</h1>
        </div>
        <div className="flex justify-center items-center lg:flex-row gap-4 text-2xl mb-10">
          <Textarea value={input} className="input-monospace w-full lg:w-3/4 border-[#372A15] bg-[#D4C3AA] text-[#372A15] placeholder:text-[#372A15]/60" onChange={(e) => setInput(e.target.value)} />
          <Button size={"default"} className="text-xl font-semibold px-4 py-5" onClick={async() => {
             const data:TodoInterface = await addTodo(input)
             setTodos(prev => [...prev, data])
             setInput('')
          }}>
            Add Todo
          </Button>
        </div>

        <div className="p-2">
          <div className="flex items-center text-foreground text-4xl mb-10">
            <h1>Your Todo's</h1>
          </div>

          <div className="flex items-center ">
           <div className="w-full">
              {todos?.map((todo) => (
                 <div className="flex items-center justify-between gap-4 mb-8" key={todo.id}>
                  <div className="flex items-center">
                    <Checkbox id={todo.id} className="data-[state=checked]:bg-[#C7A26B] data-[state=checked]:border-[#372A15]" onCheckedChange={() => setChecked(todo.id)} />
                  </div>
                  <div className={`relative flex-grow`}>
                    <Input
                      disabled
                      value={todo.text}
                      className="input-monospace text-gray-900 border-none border-[#372A15] bg-[#D4C3AA] placeholder:text-[#372A15]/60"
                    />
                    <div className="absolute flex items-center right-2 justify-end w-full top-2.5">
                      <X className="text-red-600/80 w-4 h-4 cursor-pointer" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center col-span-2 text-center">
                    <Button variant={"secondary"} className="cursor-pointer" onClick={() => deleteTheTodo(todo.id)}>Delete Todo</Button>
                  </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
