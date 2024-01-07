import React, { useState } from 'react'

export default function Tile({format, value, onSquareClick}) {
  return (
    <button className={format} onClick={onSquareClick}>{value}</button>
  )
}
