import React from 'react'

export default function PlaceholderSection({ title, children }) {
  return (
    <section className="board">
      <div className="table-card">
        <div className="table-title">{title}</div>
        <div>{children}</div>
      </div>
    </section>
  )
}


