'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { GameHeader } from './game-header'
import { useMinigame } from '@/hooks/use-minigame'
import type { MinigameConfig } from '@/lib/minigame-types'
import { Search, Check, RotateCcw, Lightbulb } from 'lucide-react'

interface BioWordSearchGameProps {
  config: MinigameConfig
  words: Array<{
    word: string
    hint: string
    category: string
  }>
  gridSize?: number
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
}

type Direction = 'horizontal' | 'vertical' | 'diagonal' | 'horizontal-reverse' | 'vertical-reverse' | 'diagonal-reverse'

interface PlacedWord {
  word: string
  startRow: number
  startCol: number
  direction: Direction
}

interface Cell {
  letter: string
  isSelected: boolean
  isFound: boolean
  wordIndices: number[] // quais palavras passam por esta celula
}

interface FoundWord {
  word: string
  cells: Array<{ row: number; col: number }>
}

export function BioWordSearchGame({ config, words, gridSize = 10, onComplete, onClose }: BioWordSearchGameProps) {
  const { state, startGame, correctAnswer, wrongAnswer, endGame } = useMinigame({
    config,
    onComplete
  })

  const [grid, setGrid] = useState<Cell[][]>([])
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([])
  const [foundWords, setFoundWords] = useState<FoundWord[]>([])
  const [selectedCells, setSelectedCells] = useState<Array<{ row: number; col: number }>>([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [showHint, setShowHint] = useState<number | null>(null)
  const [hintsUsed, setHintsUsed] = useState(0)
  const gameEndedRef = useRef(false)
  const gridRef = useRef<HTMLDivElement>(null)

  // Gerar grid com palavras
  const generateGrid = useCallback(() => {
    const newGrid: Cell[][] = Array(gridSize).fill(null).map(() =>
      Array(gridSize).fill(null).map(() => ({
        letter: '',
        isSelected: false,
        isFound: false,
        wordIndices: []
      }))
    )

    const placed: PlacedWord[] = []
    const directions: Direction[] = ['horizontal', 'vertical', 'diagonal', 'horizontal-reverse', 'vertical-reverse']

    // Tentar colocar cada palavra
    words.forEach((wordObj, wordIndex) => {
      const word = wordObj.word.toUpperCase().replace(/[^A-Z]/g, '')
      let attempts = 0
      let placed_successfully = false

      while (attempts < 100 && !placed_successfully) {
        const direction = directions[Math.floor(Math.random() * directions.length)]
        const startRow = Math.floor(Math.random() * gridSize)
        const startCol = Math.floor(Math.random() * gridSize)

        if (canPlaceWord(newGrid, word, startRow, startCol, direction, gridSize)) {
          placeWord(newGrid, word, startRow, startCol, direction, wordIndex)
          placed.push({ word, startRow, startCol, direction })
          placed_successfully = true
        }
        attempts++
      }
    })

    // Preencher espacos vazios com letras aleatorias
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (!newGrid[i][j].letter) {
          newGrid[i][j].letter = letters[Math.floor(Math.random() * letters.length)]
        }
      }
    }

    return { grid: newGrid, placedWords: placed }
  }, [words, gridSize])

  // Inicializar jogo
  useEffect(() => {
    gameEndedRef.current = false
    const { grid: newGrid, placedWords: newPlaced } = generateGrid()
    setGrid(newGrid)
    setPlacedWords(newPlaced)
    setFoundWords([])
    setSelectedCells([])
    setIsSelecting(false)
    setShowHint(null)
    setHintsUsed(0)
    startGame()
  }, [generateGrid, startGame])

  const getCellsInDirection = (startRow: number, startCol: number, endRow: number, endCol: number): Array<{ row: number; col: number }> => {
    const cells: Array<{ row: number; col: number }> = []
    const rowDiff = endRow - startRow
    const colDiff = endCol - startCol
    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff))
    
    if (steps === 0) {
      cells.push({ row: startRow, col: startCol })
      return cells
    }

    const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff)
    const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff)

    // Verificar se e uma linha valida (horizontal, vertical ou diagonal)
    if (rowDiff !== 0 && colDiff !== 0 && Math.abs(rowDiff) !== Math.abs(colDiff)) {
      return []
    }

    for (let i = 0; i <= steps; i++) {
      cells.push({ 
        row: startRow + i * rowStep, 
        col: startCol + i * colStep 
      })
    }

    return cells
  }

  const handleCellMouseDown = useCallback((row: number, col: number) => {
    if (!state.isActive) return
    setIsSelecting(true)
    setSelectedCells([{ row, col }])
    setGrid(prev => {
      const newGrid = prev.map(r => r.map(c => ({ ...c, isSelected: false })))
      newGrid[row][col].isSelected = true
      return newGrid
    })
  }, [state.isActive])

  const handleCellMouseEnter = useCallback((row: number, col: number) => {
    if (!isSelecting || !state.isActive || selectedCells.length === 0) return

    const start = selectedCells[0]
    const cells = getCellsInDirection(start.row, start.col, row, col)

    if (cells.length > 0) {
      setSelectedCells(cells)
      setGrid(prev => {
        const newGrid = prev.map(r => r.map(c => ({ ...c, isSelected: false })))
        cells.forEach(cell => {
          if (cell.row >= 0 && cell.row < gridSize && cell.col >= 0 && cell.col < gridSize) {
            newGrid[cell.row][cell.col].isSelected = true
          }
        })
        return newGrid
      })
    }
  }, [isSelecting, state.isActive, selectedCells, gridSize])

  const handleMouseUp = useCallback(() => {
    if (!isSelecting) return
    setIsSelecting(false)

    // Verificar se a selecao forma uma palavra
    const selectedWord = selectedCells
      .map(cell => grid[cell.row]?.[cell.col]?.letter || '')
      .join('')

    const selectedWordReverse = selectedWord.split('').reverse().join('')

    // Verificar se e uma palavra que ainda nao foi encontrada
    const foundIndex = placedWords.findIndex(pw => 
      (pw.word === selectedWord || pw.word === selectedWordReverse) &&
      !foundWords.some(fw => fw.word === pw.word)
    )

    if (foundIndex !== -1) {
      const foundWord = placedWords[foundIndex]
      setFoundWords(prev => [...prev, { word: foundWord.word, cells: [...selectedCells] }])
      
      // Marcar celulas como encontradas
      setGrid(prev => {
        const newGrid = prev.map(r => r.map(c => ({ ...c })))
        selectedCells.forEach(cell => {
          newGrid[cell.row][cell.col].isFound = true
        })
        return newGrid
      })

      // Pontuacao baseada no tamanho da palavra
      const wordPoints = Math.max(10, foundWord.word.length * 5)
      correctAnswer(wordPoints)
    } else if (selectedCells.length > 2) {
      wrongAnswer(2)
    }

    // Limpar selecao
    setSelectedCells([])
    setGrid(prev => prev.map(r => r.map(c => ({ ...c, isSelected: false }))))
  }, [isSelecting, selectedCells, grid, placedWords, foundWords, correctAnswer, wrongAnswer])

  // Verificar se completou
  useEffect(() => {
    if (foundWords.length === placedWords.length && placedWords.length > 0 && state.isActive) {
      if (!gameEndedRef.current) {
        gameEndedRef.current = true
        setTimeout(() => endGame(true), 500)
      }
    }
  }, [foundWords.length, placedWords.length, state.isActive, endGame])

  const handleShowHint = useCallback((index: number) => {
    if (showHint === index) {
      setShowHint(null)
    } else {
      setShowHint(index)
      setHintsUsed(prev => prev + 1)
    }
  }, [showHint])

  const handleReset = useCallback(() => {
    const { grid: newGrid, placedWords: newPlaced } = generateGrid()
    setGrid(newGrid)
    setPlacedWords(newPlaced)
    setFoundWords([])
    setSelectedCells([])
    setIsSelecting(false)
    setShowHint(null)
  }, [generateGrid])

  return (
    <div className="min-h-screen bg-background bg-cell-pattern p-4">
      <div className="max-w-xl mx-auto">
        <GameHeader
          title={config.title}
          score={state.score}
          targetScore={config.targetScore}
          timeRemaining={state.timeRemaining}
          timeLimit={config.timeLimit}
          combo={state.combo}
          onClose={onClose}
        />

        <p className="text-center text-muted-foreground mb-2 text-sm">
          {config.description}
        </p>

        {/* Progresso */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Encontradas: {foundWords.length}/{placedWords.length}
            </span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-sm text-accent-foreground hover:text-primary transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Novo grid
          </button>
        </div>

        {/* Grid de letras */}
        <div 
          ref={gridRef}
          className="glass rounded-2xl p-3 sm:p-4 mb-4 select-none touch-none"
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchEnd={handleMouseUp}
        >
          <div 
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    handleCellMouseDown(rowIndex, colIndex)
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault()
                    const touch = e.touches[0]
                    const element = document.elementFromPoint(touch.clientX, touch.clientY)
                    const cellData = element?.getAttribute('data-cell')
                    if (cellData) {
                      const [r, c] = cellData.split('-').map(Number)
                      handleCellMouseEnter(r, c)
                    }
                  }}
                  data-cell={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "aspect-square flex items-center justify-center",
                    "text-xs sm:text-sm font-bold rounded-md transition-all duration-150",
                    "select-none cursor-pointer",
                    cell.isFound && "bg-primary/30 text-primary",
                    cell.isSelected && !cell.isFound && "bg-accent/50 text-accent-foreground scale-110",
                    !cell.isFound && !cell.isSelected && "bg-card hover:bg-muted"
                  )}
                >
                  {cell.letter}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Lista de palavras */}
        <div className="glass rounded-2xl p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Palavras para encontrar:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {words.map((wordObj, index) => {
              const word = wordObj.word.toUpperCase().replace(/[^A-Z]/g, '')
              const isFound = foundWords.some(fw => fw.word === word)
              return (
                <div key={index} className="space-y-1">
                  <button
                    onClick={() => handleShowHint(index)}
                    disabled={isFound}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg text-left transition-all",
                      "flex items-center gap-2",
                      isFound 
                        ? "bg-primary/20 border border-primary/30" 
                        : "bg-card border border-border hover:border-accent/50"
                    )}
                  >
                    {isFound ? (
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    ) : (
                      <Lightbulb className={cn(
                        "h-4 w-4 flex-shrink-0 transition-colors",
                        showHint === index ? "text-accent" : "text-muted-foreground"
                      )} />
                    )}
                    <span className={cn(
                      "text-sm font-medium",
                      isFound && "line-through text-primary"
                    )}>
                      {wordObj.word}
                    </span>
                  </button>
                  {showHint === index && !isFound && (
                    <div className="px-3 py-1.5 bg-accent/10 rounded-lg text-xs text-accent-foreground animate-slide-up">
                      {wordObj.hint}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Estatisticas */}
        <div className="flex justify-center gap-6 mt-4 text-sm text-muted-foreground">
          <span>Dicas vistas: {hintsUsed}</span>
        </div>
      </div>
    </div>
  )
}

// Funcoes auxiliares para geracao do grid
function canPlaceWord(grid: Cell[][], word: string, startRow: number, startCol: number, direction: Direction, gridSize: number): boolean {
  const { rowDelta, colDelta } = getDeltas(direction)

  for (let i = 0; i < word.length; i++) {
    const row = startRow + i * rowDelta
    const col = startCol + i * colDelta

    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
      return false
    }

    const cell = grid[row][col]
    if (cell.letter && cell.letter !== word[i]) {
      return false
    }
  }

  return true
}

function placeWord(grid: Cell[][], word: string, startRow: number, startCol: number, direction: Direction, wordIndex: number): void {
  const { rowDelta, colDelta } = getDeltas(direction)

  for (let i = 0; i < word.length; i++) {
    const row = startRow + i * rowDelta
    const col = startCol + i * colDelta
    grid[row][col].letter = word[i]
    grid[row][col].wordIndices.push(wordIndex)
  }
}

function getDeltas(direction: Direction): { rowDelta: number; colDelta: number } {
  switch (direction) {
    case 'horizontal':
      return { rowDelta: 0, colDelta: 1 }
    case 'horizontal-reverse':
      return { rowDelta: 0, colDelta: -1 }
    case 'vertical':
      return { rowDelta: 1, colDelta: 0 }
    case 'vertical-reverse':
      return { rowDelta: -1, colDelta: 0 }
    case 'diagonal':
      return { rowDelta: 1, colDelta: 1 }
    case 'diagonal-reverse':
      return { rowDelta: -1, colDelta: -1 }
    default:
      return { rowDelta: 0, colDelta: 1 }
  }
}
