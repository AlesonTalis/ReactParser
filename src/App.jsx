import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import "./app.css"
import DeepSeek from './pages/deep_seek'

function App() {

  return (
    <BrowserRouter>
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/deepseek">Deep Seek</Link>
          <Link to="/claude">Claude</Link>
          <Link to="/chatgpt">ChatGPT</Link>
        </nav>
        <section>
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/deepseek" element={<DeepSeek />} />
            <Route path="/claude" element={<div>Claude</div>} />
            <Route path="/chatgpt" element={<div>ChatGPT</div>} />
          </Routes>
        </section>
      </div>
    </BrowserRouter>
  )
}

export default App
