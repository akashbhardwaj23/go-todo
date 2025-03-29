import { TodoComponent } from "@/Todo"
import { createFileRoute } from "@tanstack/react-router"


// Not working 
export const Route = createFileRoute('/')({
    component: TodoComponent,
})
