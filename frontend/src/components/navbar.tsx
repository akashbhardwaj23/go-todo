import { useNavigate } from "@tanstack/react-router";

export default function Navbar() {
  const navigate = useNavigate()

  const userId = localStorage.getItem("userId");
  const name = localStorage.getItem("name")
  const email = localStorage.getItem("email")

  return (
    <nav className="p-4 pt-6 border-b border-border">
      <div className="flex justify-between items-center m-auto max-w-7xl ">
        <div className="flex items-center text-4xl">
          <h1>Todo App</h1>
        </div>
        {userId ? (
          <div>
          Hi there, 
            <span className="text-xl font-semibold ml-2">
            {name}
            </span>
          </div>
        ) : (<div className="text-xl cursor-pointer" onClick={() => navigate({to : "/auth"})}>
            SignIn
        </div>)}
      </div>
    </nav>
  );
}
