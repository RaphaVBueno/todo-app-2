import express from 'express'
import postgres from 'postgres'
import { fileURLToPath } from 'url'
import path from 'path'

const DB = 'postgres://postgres:123@localhost:5432/todo-app-db'
const sql = postgres(DB)
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, 'dist')))

const port = 3001 //ajustar para porta 3000

app.listen(port, () => {
  console.log('Servidor rodando em http://localhost:' + port)
})

const uptadeDados = async (title, date, user = 'rapha@mail.com') => {
  await sql`
    INSERT INTO tasks (title, status, date, user_email) VALUES (
      ${title},
      FALSE,
      ${date}, -- Usar a data selecionada para inserir a tarefa no banco de dados
      ${user}
    );
  `
}

const updateStatus = async (title, status) => {
  await sql`
    UPDATE tasks SET status = ${status} WHERE title = ${title};
  `
}

app.post('/updateStatus', async (req, res) => {
  const { title, status } = req.body
  await updateStatus(title, status)
  res.json({ message: 'OK' })
})

app.get('/dados', async (req, res) => {
  const { date } = req.query
  let dados

  if (date) {
    dados = await sql`
      SELECT * FROM tasks WHERE date = ${date};
    `
  } else {
    const currentDate = new Date().toISOString().split('T')[0]
    dados = await sql`
      SELECT * FROM tasks WHERE date = ${currentDate};
    `
  }
  console.log(dados)

  res.send(dados)
})

app.post('/add-tarefa', async (req, res) => {
  const { title, date } = req.body
  await uptadeDados(title, date)
  res.json({ message: 'OK' })
})
