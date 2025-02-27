import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import "./app.css"
import DeepSeek from './pages/deep_seek'
import Claude from './pages/claude'
import ChatGPT from './pages/chatgpt'

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
            <Route path="/claude" element={<Claude />} />
            <Route path="/chatgpt" element={<ChatGPT />} />
          </Routes>
        </section>
      </div>
    </BrowserRouter>
  )
}

export default App
