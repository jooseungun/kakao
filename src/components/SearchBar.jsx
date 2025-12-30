import React, { useState } from 'react'
import './SearchBar.css'

function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  const handleChange = (e) => {
    setQuery(e.target.value)
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="전화번호 또는 카카오톡 아이디를 입력하세요"
          value={query}
          onChange={handleChange}
          disabled={loading}
        />
        <button
          type="submit"
          className="search-button"
          disabled={loading || !query.trim()}
        >
          {loading ? '검색 중...' : '검색'}
        </button>
      </div>
    </form>
  )
}

export default SearchBar

