import { Link } from 'react-router-dom'

function Login() {
  const actualDate = new Date()
  const StringDate = actualDate.toISOString().slice(0, 10) // Formato AAAA-MM-DD

  return (
    <div>
      <Link to={`/${StringDate}`}>Login</Link>
    </div>
  )
}

export default Login
