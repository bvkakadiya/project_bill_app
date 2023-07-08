import { useState } from 'react'
import './App.css'
import CsvParser from './component/CSVParser'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Parse CSV and generate XLS</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      <CsvParser />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
