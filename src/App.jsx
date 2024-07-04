import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Dia from './pages/Dia'
import Login from './pages/Login'

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
])

function App() {
  return <RouterProvider router={router} />
}

export default App
