import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

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

  const formattedDate = formatarData(date)

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

  const handleChange = (event) => {
    setInput(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      // Crie um objeto com os dados da nova tarefa
      const newTask = {
        title: input,
        status: false,
        date: date, //formato da data igual na barra de url AAAA-MM-DD
      }

      // Faça a requisição para o endpoint /addtarefa usando o Axios
      const response = await axios.post('/add-tarefa', newTask)

      if (response.status === 200) {
        // Se a requisição for bem-sucedida, atualize o estado das tarefas
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
              onChange={handleChange}
            />
            <button type="submit">+</button>
          </form>
        </div>
      </article>
    </main>
  )
}

export default Dia
