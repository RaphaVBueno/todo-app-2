import express from 'express'
import postgres from 'postgres'
import { fileURLToPath } from 'url'
import path from 'path'

const DB = 'postgres://postgres:abc@localhost:5432/todo_app_db'
const sql = postgres(DB)
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, 'dist')))

const port = 3000

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

const updateStatus = async (id, status) => {
  await sql`
    UPDATE tasks SET status = ${status} WHERE id = ${id};
  `
}

const updateDescription = async (id, description) => {
  await sql`
    UPDATE tasks SET description = ${description} WHERE id = ${id};
  `
}
4
const deleteTask = async (id) => {
  await sql`
  DELETE FROM tasks WHERE id = ${id};`
}

app.post('/updateStatus', async (req, res) => {
  const { id, status } = req.body
  await updateStatus(id, status)
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
  res.send(dados)
})

app.post('/add-tarefa', async (req, res) => {
  const { title, date } = req.body
  await uptadeDados(title, date)
  res.json({ message: 'OK' })
})

app.post('/add-description', async (req, res) => {
  const { id, description } = req.body
  await updateDescription(id, description)
  res.json({ message: 'OK' })
})

app.post('/delete-task', async (req, res) => {
  const { id } = req.body
  console.log(id)
  await deleteTask(id)
  res.json({ message: 'OK' })
})

app.get('/id-dados', async (req, res) => {
  const { id } = req.query
  let dados
  dados = await sql`
      SELECT * FROM tasks WHERE id = ${id};
    `
  res.send(dados)
})
