import { useParams, useNavigate } from 'react-router-dom'

function Dia() {
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
      </article>
    </main>
  )
}

export default Dia
