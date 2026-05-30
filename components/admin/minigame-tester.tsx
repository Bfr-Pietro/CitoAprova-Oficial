'use client'

import { useState, useCallback } from 'react'
import { Play, Settings, RotateCcw, Check, X, ChevronDown, ChevronUp } from 'lucide-react'
import type { MinigameConfig, MinigameType } from '@/lib/minigame-types'

// Import all minigame components
import { MemoryGame } from '@/components/minigames/memory-game'
import { TapGame } from '@/components/minigames/tap-game'
import { CollectGame } from '@/components/minigames/collect-game'
import { SequenceGame } from '@/components/minigames/sequence-game'
import { ClickerGame } from '@/components/minigames/clicker-game'
import { QuizArcade } from '@/components/minigames/quiz-arcade'
import { BossBattle } from '@/components/minigames/boss-battle'
import { WordScrambleGame } from '@/components/minigames/word-scramble-game'
import { ReactionGame } from '@/components/minigames/reaction-game'
import { BubblePopGame } from '@/components/minigames/bubble-pop-game'
import { SimonSaysGame } from '@/components/minigames/simon-says-game'
import { TargetShooterGame } from '@/components/minigames/target-shooter-game'
import { TypingGame } from '@/components/minigames/typing-game'
import { SwipeGame } from '@/components/minigames/swipe-game'
import { PathConnectGame } from '@/components/minigames/path-connect-game'
import { CatchSequenceGame } from '@/components/minigames/catch-sequence-game'
import { TrueFalseRushGame } from '@/components/minigames/true-false-rush-game'
import { FallingLettersGame } from '@/components/minigames/falling-letters-game'
import { ColorMatchGame } from '@/components/minigames/color-match-game'
import { WhackAMoleGame } from '@/components/minigames/whack-a-mole-game'
import { SliderPuzzleGame } from '@/components/minigames/slider-puzzle-game'
import { RhythmTapGame } from '@/components/minigames/rhythm-tap-game'

// All available minigame types with their display names
const MINIGAME_CATALOG: { type: MinigameType; name: string; description: string }[] = [
  { type: 'memory', name: 'Jogo da Memoria', description: 'Encontre os pares de cartas' },
  { type: 'tap-correct', name: 'Toque Correto', description: 'Clique apenas nos itens corretos' },
  { type: 'collect-falling', name: 'Coletar Itens', description: 'Colete os itens que caem' },
  { type: 'sequence', name: 'Sequencia', description: 'Ordene os elementos na ordem correta' },
  { type: 'clicker', name: 'Clicker Rapido', description: 'Clique rapidamente para ganhar pontos' },
  { type: 'quiz-arcade', name: 'Quiz Arcade', description: 'Responda perguntas rapidamente' },
  { type: 'boss-battle', name: 'Batalha de Boss', description: 'Derrote o chefe com conhecimento' },
  { type: 'word-scramble', name: 'Desembaralhar', description: 'Descubra a palavra embaralhada' },
  { type: 'reaction-time', name: 'Tempo de Reacao', description: 'Teste seus reflexos' },
  { type: 'bubble-pop', name: 'Estourar Bolhas', description: 'Estoure as bolhas corretas' },
  { type: 'simon-says', name: 'Simon Diz', description: 'Repita a sequencia de padroes' },
  { type: 'target-shooter', name: 'Tiro ao Alvo', description: 'Acerte os alvos corretos' },
  { type: 'typing-speed', name: 'Digitacao', description: 'Digite os termos rapidamente' },
  { type: 'swipe-category', name: 'Deslizar Categoria', description: 'Categorize deslizando' },
  { type: 'path-connect', name: 'Conectar Caminhos', description: 'Conecte elementos relacionados' },
  { type: 'catch-sequence', name: 'Capturar Sequencia', description: 'Capture na ordem correta' },
  { type: 'true-false-rush', name: 'Verdadeiro/Falso', description: 'Responda V ou F rapidamente' },
  { type: 'falling-letters', name: 'Letras Caindo', description: 'Forme palavras com letras' },
  { type: 'color-match', name: 'Combinar Cores', description: 'Classifique por categoria' },
  { type: 'whack-a-mole', name: 'Acerte a Toupeira', description: 'Acerte os termos corretos' },
  { type: 'slider-puzzle', name: 'Puzzle Deslizante', description: 'Deslize para formar a resposta' },
  { type: 'rhythm-tap', name: 'Ritmo Musical', description: 'Toque no ritmo correto' },
]

interface MinigameTesterProps {
  phaseId?: number
}

export default function MinigameTester({ phaseId = 1 }: MinigameTesterProps) {
  const [selectedMinigame, setSelectedMinigame] = useState<MinigameType | null>(null)
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(2)
  const [isPlaying, setIsPlaying] = useState(false)
  const [lastResult, setLastResult] = useState<{ success: boolean; score: number } | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>('classic')

  // Group minigames by category
  const categories = {
    classic: ['memory', 'tap-correct', 'collect-falling', 'sequence', 'clicker'],
    quiz: ['quiz-arcade', 'true-false-rush', 'word-scramble'],
    reflex: ['reaction-time', 'bubble-pop', 'whack-a-mole', 'target-shooter'],
    pattern: ['simon-says', 'rhythm-tap', 'path-connect', 'catch-sequence'],
    typing: ['typing-speed', 'falling-letters', 'slider-puzzle'],
    other: ['swipe-category', 'color-match', 'boss-battle'],
  }

  const categoryNames: Record<string, string> = {
    classic: 'Classicos',
    quiz: 'Quiz e Palavras',
    reflex: 'Reflexo e Acao',
    pattern: 'Padroes e Sequencias',
    typing: 'Digitacao e Letras',
    other: 'Outros',
  }

  const handleStartMinigame = () => {
    if (!selectedMinigame) return
    setIsPlaying(true)
    setLastResult(null)
  }

  const handleMinigameComplete = useCallback((success: boolean, score: number) => {
    setLastResult({ success, score })
    setIsPlaying(false)
  }, [])

  const handleRestart = () => {
    setLastResult(null)
    setIsPlaying(true)
  }

  const handleSelectAnother = () => {
    setSelectedMinigame(null)
    setLastResult(null)
    setIsPlaying(false)
  }

  // Create config for selected minigame
  const createConfig = (): MinigameConfig => ({
    type: selectedMinigame!,
    title: MINIGAME_CATALOG.find(m => m.type === selectedMinigame)?.name || 'Minigame',
    description: MINIGAME_CATALOG.find(m => m.type === selectedMinigame)?.description || '',
    timeLimit: difficulty === 1 ? 45 : difficulty === 2 ? 30 : 20,
    targetScore: difficulty === 1 ? 50 : difficulty === 2 ? 75 : 100,
    difficulty,
  })

  // Render the selected minigame
  const renderMinigame = () => {
    if (!selectedMinigame) return null

    const config = createConfig()
    const base = {
      config,
      onComplete: handleMinigameComplete,
      onClose: handleSelectAnother,
    }

    // Sample data used across various minigames
    const sampleItems = [
      { content: 'Mitocondria', isCorrect: true },
      { content: 'Nucleo', isCorrect: true },
      { content: 'Ribossomo', isCorrect: false },
      { content: 'Vacuolo', isCorrect: false },
      { content: 'Cloroplasto', isCorrect: true },
      { content: 'Lisossomo', isCorrect: false },
    ]
    const samplePairs = [
      { id: '1', item1: 'DNA', item2: 'Acido Desoxirribonucleico' },
      { id: '2', item1: 'RNA', item2: 'Acido Ribonucleico' },
      { id: '3', item1: 'ATP', item2: 'Adenosina Trifosfato' },
      { id: '4', item1: 'ADP', item2: 'Adenosina Difosfato' },
    ]
    const sampleSequence = [
      { content: 'Interfase', order: 1 },
      { content: 'Profase', order: 2 },
      { content: 'Metafase', order: 3 },
      { content: 'Anafase', order: 4 },
      { content: 'Telofase', order: 5 },
    ]
    const sampleWords = [
      { word: 'MITOSE', hint: 'Divisao celular somática' },
      { word: 'MEIOSE', hint: 'Divisao celular reprodutiva' },
      { word: 'OSMOSE', hint: 'Transporte de agua pela membrana' },
    ]
    const sampleQuestions = [
      {
        question: 'Qual organela produz energia?',
        options: ['Mitocondria', 'Nucleo', 'Ribossomo', 'Vacuolo'],
        correctIndex: 0,
      },
      {
        question: 'Onde fica o material genetico?',
        options: ['Citoplasma', 'Nucleo', 'Membrana', 'Lisossomo'],
        correctIndex: 1,
      },
    ]

    switch (selectedMinigame) {
      case 'memory':
        return <MemoryGame {...base} pairs={samplePairs} />
      case 'tap-correct':
      case 'avoid-wrong':
        return <TapGame {...base} items={sampleItems} />
      case 'collect-falling':
      case 'catch-items':
        return <CollectGame {...base} items={sampleItems} />
      case 'sequence':
      case 'timeline':
        return <SequenceGame {...base} items={sampleSequence} />
      case 'clicker':
      case 'speed-combo':
        return <ClickerGame {...base} theme="energy" />
      case 'quiz-arcade':
        return <QuizArcade {...base} questions={sampleQuestions} />
      case 'boss-battle':
        return (
          <BossBattle
            {...base}
            bossName="Dr. Virus"
            attacks={[
              { question: 'Qual e a funcao da mitocondria?', options: ['Energia', 'Digestao', 'Sintese', 'Transporte'], correctIndex: 0, damage: 20 },
              { question: 'O que e osmose?', options: ['Difusao de agua', 'Difusao de soluto', 'Transporte ativo', 'Endocitose'], correctIndex: 0, damage: 25 },
            ]}
          />
        )
      case 'word-scramble':
        return <WordScrambleGame {...base} words={sampleWords} />
      case 'reaction-time':
      case 'reflex':
        return <ReactionGame {...base} />
      case 'bubble-pop':
        return <BubblePopGame {...base} items={sampleItems} />
      case 'simon-says':
        return <SimonSaysGame {...base} />
      case 'target-shooter':
      case 'target-moving':
        return <TargetShooterGame {...base} targets={sampleItems} />
      case 'typing-speed':
        return (
          <TypingGame
            {...base}
            words={[
              { word: 'mitocondria', definition: 'Organela responsavel pela producao de energia' },
              { word: 'ribossomo', definition: 'Organela responsavel pela sintese de proteinas' },
              { word: 'nucleo', definition: 'Centro de controle da celula' },
            ]}
          />
        )
      case 'swipe-category':
      case 'drag-category':
        return (
          <SwipeGame
            {...base}
            items={[
              { content: 'Mitocondria', category: 'right' as const, categoryLabel: 'Animal' },
              { content: 'Cloroplasto', category: 'left' as const, categoryLabel: 'Vegetal' },
              { content: 'Nucleo', category: 'right' as const, categoryLabel: 'Animal' },
              { content: 'Parede Celular', category: 'left' as const, categoryLabel: 'Vegetal' },
            ]}
            categories={{ left: 'Vegetal', right: 'Animal' }}
          />
        )
      case 'path-connect':
        return (
          <PathConnectGame
            {...base}
            pairs={[
              { id: '1', left: 'DNA', right: 'Nucleo' },
              { id: '2', left: 'ATP', right: 'Mitocondria' },
              { id: '3', left: 'Proteina', right: 'Ribossomo' },
            ]}
          />
        )
      case 'catch-sequence':
        return <CatchSequenceGame {...base} items={sampleSequence} />
      case 'true-false-rush':
        return (
          <TrueFalseRushGame
            {...base}
            statements={[
              { text: 'A mitocondria produz energia', isTrue: true },
              { text: 'O nucleo fica no citoplasma', isTrue: false, explanation: 'O nucleo e separado do citoplasma pela membrana nuclear.' },
              { text: 'Celulas vegetais possuem cloroplastos', isTrue: true },
            ]}
          />
        )
      case 'falling-letters':
        return <FallingLettersGame {...base} words={sampleWords} />
      case 'color-match':
        return (
          <ColorMatchGame
            {...base}
            items={[
              { content: 'Mitocondria', category: 'Animal' },
              { content: 'Cloroplasto', category: 'Vegetal' },
              { content: 'Parede Celular', category: 'Vegetal' },
              { content: 'Lisossomo', category: 'Animal' },
            ]}
            categories={[
              { name: 'Animal', color: 'blue' },
              { name: 'Vegetal', color: 'green' },
            ]}
          />
        )
      case 'whack-a-mole':
        return <WhackAMoleGame {...base} items={sampleItems} />
      case 'slider-puzzle':
        return (
          <SliderPuzzleGame
            {...base}
            concepts={[
              { term: 'Mitose', definition: 'Divisao celular somatica' },
              { term: 'Meiose', definition: 'Divisao celular reprodutiva' },
            ]}
          />
        )
      case 'rhythm-tap':
        return (
          <RhythmTapGame
            {...base}
            questions={[
              { question: 'Organela que produz energia', answer: 'mitocondria' },
              { question: 'Divisao celular somatica', answer: 'mitose' },
              { question: 'Material genetico', answer: 'DNA' },
            ]}
          />
        )
      default:
        return (
          <div className="flex items-center justify-center h-64 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">Minigame nao implementado: {selectedMinigame}</p>
          </div>
        )
    }
  }

  // Result screen
  if (lastResult) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-card rounded-xl border border-border">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
          lastResult.success ? 'bg-green-500/20' : 'bg-red-500/20'
        }`}>
          {lastResult.success ? (
            <Check className="w-10 h-10 text-green-500" />
          ) : (
            <X className="w-10 h-10 text-red-500" />
          )}
        </div>
        
        <h3 className="text-xl font-bold text-foreground mb-2">
          {lastResult.success ? 'Sucesso!' : 'Tente Novamente'}
        </h3>
        
        <p className="text-muted-foreground mb-6">
          Pontuacao: <span className="font-bold text-foreground">{lastResult.score}</span> pontos
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Jogar Novamente
          </button>
          <button
            onClick={handleSelectAnother}
            className="px-4 py-2 bg-secondary text-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
          >
            Escolher Outro
          </button>
        </div>
      </div>
    )
  }

  // Playing state
  if (isPlaying && selectedMinigame) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground">
            Testando: {MINIGAME_CATALOG.find(m => m.type === selectedMinigame)?.name}
          </h3>
          <button
            onClick={handleSelectAnother}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancelar
          </button>
        </div>
        {renderMinigame()}
      </div>
    )
  }

  // Selection state
  return (
    <div className="space-y-6">
      {/* Difficulty Selection */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-muted-foreground" />
          <span className="font-medium text-foreground">Dificuldade</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { level: 1 as const, name: 'Facil', color: 'bg-green-500/10 border-green-500 text-green-500' },
            { level: 2 as const, name: 'Normal', color: 'bg-amber-500/10 border-amber-500 text-amber-500' },
            { level: 3 as const, name: 'Dificil', color: 'bg-red-500/10 border-red-500 text-red-500' },
          ].map(({ level, name, color }) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`p-3 rounded-lg border-2 transition-all ${
                difficulty === level 
                  ? color 
                  : 'border-transparent bg-secondary hover:bg-secondary/80'
              }`}
            >
              <span className="font-medium">{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Minigame Selection */}
      <div className="space-y-3">
        {Object.entries(categories).map(([category, types]) => (
          <div key={category} className="bg-card border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
              className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
            >
              <span className="font-medium text-foreground">{categoryNames[category]}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{types.length} jogos</span>
                {expandedCategory === category ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </button>
            
            {expandedCategory === category && (
              <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {types.map(type => {
                  const minigame = MINIGAME_CATALOG.find(m => m.type === type)
                  if (!minigame) return null
                  
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedMinigame(type as MinigameType)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        selectedMinigame === type
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background hover:border-primary/50'
                      }`}
                    >
                      <p className="font-medium text-foreground text-sm">{minigame.name}</p>
                      <p className="text-xs text-muted-foreground">{minigame.description}</p>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Start Button */}
      {selectedMinigame && (
        <button
          onClick={handleStartMinigame}
          className="w-full p-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          Iniciar {MINIGAME_CATALOG.find(m => m.type === selectedMinigame)?.name}
        </button>
      )}
    </div>
  )
}
