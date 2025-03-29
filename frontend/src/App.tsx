import { BrowserRouter, Routes, Route } from 'react-router'
import './App.css'
import Navbar from './components/navbar'
import { TodoComponent } from './Todo'
import AuthPage  from './components/Auth'



// Not using react-router

function App() {
  
  return (
    <>
    <Navbar />
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<TodoComponent />}/>
        <Route path='/signin' element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
      </>
  )
}

export default App
