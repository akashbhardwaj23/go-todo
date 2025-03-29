import React, {
  SetStateAction,
  useState,
} from "react";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { Checkbox } from "./components/ui/checkbox";
import { Input } from "./components/ui/input";
import { Check, Edit, Loader2 } from "lucide-react";
import { useTodos } from "./hooks/useTodo";
import { addTodo, checkTodo, deleteTodo, editTodo } from "./server/todo";
import { Toaster, toast } from "sonner"


interface TodoInterface {
  id: string;
  text: string;
  userId: string;
  isDone: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  const [input, setInput] = useState("");

  const name = localStorage.getItem("name");

  if (loading) {
    return <div className="flex justify-center items-center mt-10">Loading...</div>;
  }

  return (
    <div className="flex justify-center py-10 px-8 w-full">
      <Toaster toastOptions={{style : {
        background : "#c3aa83",
        color : "#B91C1C"
      }}} />
      <div className="w-full lg:w-1/2 p-4">
        <div className="flex items-center font-convergence">
          <h1 className="text-2xl mb-2">
            Add Your Todo's <span className="font-semibold">{name}</span>
          </h1>
        </div>
        <div className="flex items-center lg:flex-row gap-4 text-2xl mb-10">
          <Textarea
            value={input}
            className="input-monospace w-full lg:w-3/4 border-[#372A15] bg-[#D4C3AA] text-[#372A15] placeholder:text-[#372A15]/60"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            size={"default"}
            className="text-xl font-semibold px-4 py-5"
            onClick={async () => {
             try {
              const data: TodoInterface = await addTodo(input);
              setTodos((prev) => {
                if (!prev) {
                  return [data];
                }

                return [...prev, data];
              });
             } catch (error) {
              toast.error("Failed to add todo")
              console.log(error)
             }
              setInput("");
            }}
          >
            Add Todo
          </Button>
        </div>

        <div className="p-2">
          <div className="flex items-center text-foreground text-4xl mb-8">
            <h1>Your Todo's</h1>
          </div>

          <div className="flex items-center border-t border-border">
            <div className="w-full mt-4">
              {todos?.map((todo) => (
                <Todo todo={todo} key={todo.id} setTodos={setTodos} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Todo({
  todo,
  setTodos,
}: {
  todo: TodoInterface;
  setTodos: React.Dispatch<SetStateAction<TodoInterface[]>>;
}) {
  const [isTodoEditable, setIsTodoEditable] = useState(false);
  const [todoText, setTodoText] = useState(todo.text);
  const [loading, setLoading] = useState(false)

  const setChecked = async (e: any, id: string) => {
   try {
    const checkedTodo = await checkTodo(id, e);

    setTodos((todos) => {
      if (!checkTodo){
        return todos
      }
      const newTodos = todos?.map((todo) => {
        if (todo.id === checkedTodo.id) {
          todo.isDone = checkedTodo.isDone;
        }
        return todo;
      });

      if (!newTodos) {
        return [];
      }

      return newTodos;
    });
   } catch (error) {
      toast.error("Failed to Update the todo")
      console.log(error)
   }
  };
  const handleTodoEdit = async(id: string, text: string) => {
    setLoading(true)
    setIsTodoEditable(false)
    setTodos((prev) => {
      const newtodos = prev.map((todo) => {
        if (todo.id === id) {
          todo.text = text;
        }
        return todo;
      });

      if (!newtodos) {
        return [];
      }

      return newtodos;
    });

    try {
      const todo = await editTodo(id, text)

      setTodos((prev) => {
        const newTodo = prev.map((prevTodo) => {
          if(prevTodo.id === todo.id){
            return todo
          }
  
          return prevTodo;
        })
  
        if(!newTodo){
          return []
        }
  
        return newTodo;
      })

      setLoading(false)

    } catch (error) {
      setLoading(false)
      toast.error("Failed to edit todo")
      console.log(error)
    }

   
  };

  const deleteTheTodo = async (id: string) => {
    const data = await deleteTodo(id);
    setTodos(data);
  };

  return (
    <div className="flex items-center justify-between gap-4 mb-4" key={todo.id}>
      <div className="flex items-center">
        <Checkbox
          id={todo.id}
          checked={todo.isDone}
          className="data-[state=checked]:bg-[#C7A26B] data-[state=checked]:border-[#372A15]"
          onCheckedChange={(e) => setChecked(e, todo.id)}
        />
      </div>
      <div className={`relative flex-grow`}>
        <Input
          readOnly={!isTodoEditable}
          value={todoText}
          onChange={(e) => {
            setTodoText(e.target.value);
          }}
          className={`input-monospace text-gray-900 ${todo.isDone ? "line-through" : ""} border-none border-[#372A15] bg-[#D4C3AA] placeholder:text-[#372A15]/60`}
        />
        <div className="absolute flex items-center right-2 justify-end w-full top-2.5">
          {loading ? (<Loader2 className="ext-gray-800/80 w-4 h-4 cursor-pointer" />) : (<>
          {isTodoEditable ? (
            <Check className="text-gray-800/80 w-4 h-4 cursor-pointer" onClick={() => {
              handleTodoEdit(todo.id, todoText);
            }} />
          ) : (
            <Edit
              className="text-gray-800/80 w-4 h-4 cursor-pointer"
              onClick={() => {
                if (todo.isDone) {
                  toast.error("This is Not Editable")
                  return;
                };
                setIsTodoEditable(prev => !prev)
              }}
            />
          )}
          </>)}
        </div>
      </div>
      <div className="flex items-center justify-center col-span-2 text-center">
        <Button
          variant={"secondary"}
          className="cursor-pointer"
          onClick={() => deleteTheTodo(todo.id)}
        >
          Delete Todo
        </Button>
      </div>
    </div>
  );
}
