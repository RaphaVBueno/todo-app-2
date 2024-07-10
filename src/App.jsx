import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Dia from './pages/Dia'
import Login from './pages/Login'
import Description from './pages/Description'

const router = createBrowserRouter([
  {
    index: true,
    path: '/',
    element: <Login />,
  },
  {
    path: ':date',
    element: <Dia />,
  },
  {
    path: '/dia/:date',
    element: <Dia />,
  },
  {
    path: '/tarefa/:taskTitle', //aqui deve ter o seguinte formato /tarefa/:date/:taskTitle
    element: <Description />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
