'use client'

import { askQuestion } from '@/utils/api'
import { useState } from 'react'

const Question = () => {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(false)

  const onChange = (e) => {
    setValue(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const ans = await askQuestion(value)
    setResponse(ans)
    setValue('')
    setLoading(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          disabled={loading}
          onChange={onChange}
          placeholder="Ask a question"
          value={value}
          type="text"
          className="border border-black/20 px-4 py-2 text-lg rounded-lg"
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-blue-800 px-4 py-2 rounded-lg text-lg"
        >
          ASK
        </button>
      </form>
      {loading && <div>...loading</div>}
      {response && <div>{response}</div>}
    </>
  )
}

export default Question
