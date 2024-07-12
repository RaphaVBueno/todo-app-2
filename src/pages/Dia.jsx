import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { format, parseISO } from 'date-fns'
import '../App.css'

function Dia() {
  const [input, setInput] = useState('')
  const [tasks, setTasks] = useState([])
  const { date } = useParams()
  const navigate = useNavigate()

  function formatarData(date) {
    const partes = date.split('-')
    const ano = partes[0]
    const mes = partes[1]
    const dia = partes[2]
    return `${dia}/${mes}/${ano}`
  }

  const formattedDate = format(parseISO(date), 'dd/MM/yyyy')

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const response = await axios.get(`/dados?date=${date}`)
        setTasks(response.data)
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      }
    }

    fetchDados()
  }, [date])

  const routeDescription = (taskId, date) => {
    navigate(`/tarefa/${date}/${taskId}`)
  }

  const handlePrevDay = () => {
    const prevDate = new Date(date)
    prevDate.setDate(prevDate.getDate() - 1)

    navigate(`/dia/${prevDate.toISOString().slice(0, 10)}`)
  }

  const handleNextDay = () => {
    const prevDate = new Date(date)
    prevDate.setDate(prevDate.getDate() + 1)

    navigate(`/dia/${prevDate.toISOString().slice(0, 10)}`)
  }

  function getDayLabel(date) {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    const dateObj = new Date(date)
    dateObj.setDate(dateObj.getDate() + 1)
    console.log(dateObj.getDate())

    if (dateObj.toLocaleDateString() === today.toLocaleDateString()) {
      return 'Hoje'
    } else if (dateObj.toLocaleDateString() === tomorrow.toLocaleDateString()) {
      return 'Amanhã'
    } else if (
      dateObj.toLocaleDateString() === yesterday.toLocaleDateString()
    ) {
      return 'Ontem'
    } else {
      return dateObj.getDate()
    }
  }

  const handleChange = (event, title) => {
    const newStatus = event.target.checked
    updateTaskStatus(title, newStatus)
  }

  const updateTaskStatus = async (title, status) => {
    try {
      await axios.post('/updateStatus', { title, status })
      const updatedTasks = tasks.map((task) =>
        task.title === title ? { ...task, status } : task
      )
      const sortedTasks = updatedTasks.sort((a, b) => a.status - b.status) //
      setTasks(sortedTasks)
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const newTask = {
        title: input,
        status: false,
        date: date, //AAAA-MM-DD
      }

      const response = await axios.post('/add-tarefa', newTask)

      if (response.status === 200) {
        const updatedTasks = [...tasks, newTask]
        setTasks(updatedTasks)
        setInput('')
      } else {
        console.error('Erro ao adicionar tarefa. Verifique o servidor.')
      }
    } catch (error) {
      console.error('Erro ao processar a requisição:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      console.log(id)
      await axios.post('/delete-task', { id })
      const updatedTasks = tasks.filter((task) => task.id !== id)
      setTasks(updatedTasks)
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error)
    }
  }

  return (
    <main className="container">
      <article>
        <header>
          <nav>
            <h1>Tarefas</h1>
            <ul>
              <li>
                <button onClick={handlePrevDay}>{'<'}</button>
              </li>
              <li>
                <hgroup>
                  <h3>{getDayLabel(date)}</h3>
                  <p>{formattedDate}</p>
                </hgroup>
              </li>
              <li>
                <button onClick={handleNextDay}>{'>'}</button>
              </li>
            </ul>
          </nav>
        </header>
        <div className="new-task">
          <form role="group" onSubmit={handleSubmit}>
            <input
              type="text"
              name="tarefa"
              id="tarefa"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button type="submit">+</button>
          </form>
        </div>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <div className="task-item">
                <input
                  type="checkbox"
                  checked={task.status}
                  onChange={(event) => handleChange(event, task.title)}
                />
                <a
                  href="#"
                  onClick={() => routeDescription(task.id, date)}
                  className={task.status ? 'completed-task' : 'incomplete-task'}
                >
                  {task.title}
                </a>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(task.id)}
                >
                  X
                </button>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </main>
  )
}

export default Dia
