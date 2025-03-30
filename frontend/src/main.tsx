import { createRoot } from 'react-dom/client'
import './index.css'
import { createRootRoute, createRoute, createRouter, Outlet, redirect, RouterProvider } from '@tanstack/react-router'
import Navbar from './components/navbar.tsx'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { TodoComponent } from './Todo.tsx'
import AuthPage from './components/Auth.tsx'



const RootRoute = createRootRoute({
    component : () => (
        <>
         {/* Here the childrens will render */}
        <Outlet />
        <TanStackRouterDevtools />
        </>
    ),
    notFoundComponent : () => (
        <div className='bg-background text-foreground flex justify-center items-center m-10'>
            404 Not Found
        </div>
    )
})

const indexRoute = createRoute({
    getParentRoute : () => RootRoute,
    path : "/",
    beforeLoad : ({location}) => {
        console.log(location)
        const userId = localStorage.getItem("userId");
        if(!userId){
            throw redirect({to : '/auth'})
        }

    },
    component : () => (
        <>
              <Navbar />
              <TodoComponent />
        </>
    )
})

const signinRoute = createRoute({
    // here the parent is used to render the component in outlet and for navigation
    getParentRoute : () => RootRoute,
      path : "/auth",
    beforeLoad : () => {
        const userId = localStorage.getItem("userId");
        if(userId){
            throw redirect({to : "/"})
        }

    },
    component : AuthPage
})

const routeTree = RootRoute.addChildren([indexRoute, signinRoute]);

const router = createRouter({routeTree});

declare module '@tanstack/react-router' {
    interface Register {
        router : typeof router
    }
}


createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}/>
)
