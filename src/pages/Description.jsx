import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './Description.css'

function Description() {
  const { taskTitle } = useParams()
  const [input, setInput] = useState('')

  const handleChange = (event) => {
    setInput(event.target.value)
  }

  const addDescription = async (event) => {
    event.preventDefault()
    try {
      const newDescription = {
        title: taskTitle,
        description: input,
        date: '2024/07/10', //formato da data igual na barra de url AAAA-MM-DD
      }

      const response = await axios.post('/add-description', newDescription)

      if (response.status === 200) {
        setInput('')
      } else {
        console.error('Erro ao adicionar tarefa. Verifique o servidor.')
      }
    } catch (error) {
      console.error('Erro ao processar a requisição:', error)
    }
  }

  return (
    <div>
      <h1>{taskTitle} - Descrição</h1>
      <div>
        <form role="group" onSubmit={addDescription}>
          <input
            type="text"
            name="description"
            id="description"
            value={input}
            onChange={handleChange}
            className="input-description"
          />
          <button type="submit">Adicionar Descrição</button>
        </form>{' '}
      </div>
    </div>
  )
}

export default Description
