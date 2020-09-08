import React, { useRef, useEffect, useState, useCallback, useMemo } from "react"
import "./App.css"

import * as S from "./styles"

const queryString = require("query-string")

const sleep = (delay) => new Promise((res) => setTimeout(res, delay))

const defaultRows = 2
const defaultColumns = 4

const getCanvasConfig = async () => {
  const { columns, rows } = queryString.parse(window.location.search)

  await sleep(500)
  // throw new Error("error while fetching data")
  return {
    rows: rows * 1 > 0 ? rows : defaultRows,
    columns: columns * 1 > 0 ? columns : defaultColumns,
  }
}

const App = () => {
  // state
  const [rows, setRows] = useState()
  const [columns, setColumns] = useState()
  const [fetched, setFetched] = useState(false)
  const [error, setError] = useState()
  const [mousePos, setMousePos] = useState()
  const [density] = useState(2)
  // state

  // refs
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  // refs

  // handle initial state
  useEffect(() => {
    const handleInitialState = async () => {
      try {
        const { rows, columns } = await getCanvasConfig()

        setRows(rows)
        setColumns(columns)
        setFetched(true)
      } catch (err) {
        setFetched(true)
        setError(`initial state failed`)
      }
    }

    handleInitialState()

    return () => {
      removeCanvas()
    }
  }, [])

  // remove handler
  const removeCanvas = useCallback(() => {
    return ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  }, [ctxRef.current])

  // setup canvas && context
  useEffect(() => {
    if (!fetched) return

    // context
    const ctx = canvasRef.current.getContext("2d")
    ctx.scale(density, density)
    ctxRef.current = ctx

    // canvas
    const canvas = canvasRef.current

    canvas.width = window.innerWidth * density
    canvas.height = window.innerHeight * density

    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`

    handleDraw()
  }, [fetched])

  // handle change color
  useEffect(() => {
    if (!mousePos) return

    const { clientX, clientY } = mousePos

    const clientRect = canvasRef.current.getBoundingClientRect()
    const offsetX = clientRect.left
    const offsetY = clientRect.top

    const mouseX = clientX - offsetX
    const mouseY = clientY - offsetY

    const wrapWidth = ctxRef.current.canvas.offsetWidth
    const wrapHeight = ctxRef.current.canvas.offsetHeight

    const relativeCellWidth = wrapWidth / columns
    const relativeCellHeight = wrapHeight / rows

    const clickedRow = Math.floor(mouseX / relativeCellWidth)
    const clickedColumn = Math.floor(mouseY / relativeCellHeight)

    const contextWidth = ctxRef.current.canvas.style.width.replace("px", "")
    const contextHeight = ctxRef.current.canvas.style.height.replace("px", "")

    const cellWidth = (contextWidth / columns) * density
    const cellHeight = (contextHeight / rows) * density

    ctxRef.current.fillStyle = `rgb(${Math.floor(Math.random() * 256 || 0)}, ${Math.floor(
      (Math.random() * 256) | 0
    )}, ${Math.floor(Math.random() * 256 || 0)})`

    ctxRef.current.fillRect(clickedRow * cellWidth, clickedColumn * cellHeight, cellWidth, cellHeight)
  }, [mousePos])

  // setup cells
  const handleDraw = useCallback(() => {
    if (columns == 0 || rows == 0) {
      return setError("provide value grater than 0")
    } else {
      setError()
    }
    const contextWidth = ctxRef.current.canvas.style.width.replace("px", "")
    const contextHeight = ctxRef.current.canvas.style.height.replace("px", "")

    const cellWidth = (contextWidth / columns) * density
    const cellHeight = (contextHeight / rows) * density

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        ctxRef.current.fillStyle = `rgb(${Math.floor((Math.random() * 256) | 0)}, ${Math.floor(
          Math.random() * 256 || 0
        )}, ${Math.floor(Math.random() * 256 || 0)})`
        ctxRef.current.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight)
      }
    }
  }, [rows, columns])

  const handleValidate = (value) => value * 1 >= 0

  const handleColumns = ({ target: { value } }) => {
    const validValue = handleValidate(value) ? value : defaultColumns
    setColumns(validValue)
  }

  const handleRows = ({ target: { value } }) => {
    const validValue = handleValidate(value) ? value : defaultRows
    setRows(validValue)
  }

  const handleMouseDown = ({ nativeEvent: { clientX, clientY } }) => {
    setMousePos({ clientX, clientY })
  }

  if (!fetched) {
    return "...loading"
  }

  return (
    <>
      {error && <S.Info>{error}</S.Info>}
      <S.Actions>
        <S.Input
          onChange={handleColumns}
          name="columns"
          id="columns"
          value={columns}
          type="text"
          placeholder="Set column quantity"
        />
        <S.Input onChange={handleRows} name="rows" id="rows" value={rows} type="text" placeholder="Set row quantity" />
        <S.Button onClick={handleDraw}>Generate</S.Button>
      </S.Actions>

      <S.Canvas ref={canvasRef} onMouseDown={handleMouseDown} />
    </>
  )
}

export default App
