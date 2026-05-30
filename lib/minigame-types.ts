// Tipos de minigames disponiveis
export type MinigameType = 
  | 'memory'           // Jogo da memoria (cartas)
  | 'tap-correct'      // Clicar so nos itens corretos
  | 'avoid-wrong'      // Desviar/evitar respostas erradas
  | 'catch-items'      // Caca/pegar itens que aparecem
  | 'zoom-match'       // Identificar imagem ampliada
  | 'reflex'           // Clicar rapido quando aparecer algo
  | 'timeline'         // Arrastar linha do tempo
  | 'sequence'         // Ordenar sequencia correta
  | 'speed-combo'      // Acertos seguidos rapidos
  | 'drag-category'    // Arrastar para categoria
  | 'build-cell'       // Montar celula (drag)
  | 'collect-falling'  // Coletar itens caindo
  | 'match-pairs'      // Combinar pares
  | 'who-am-i'         // Dica aparece, clique rapido
  | 'spot-difference'  // Achar diferencas
  | 'survival'         // Nao errar X seguidos
  | 'clicker'          // Spam click para energia
  | 'target-moving'    // Alvo movel
  | 'combo'            // Acertos em combo
  | 'destroy-trash'    // Destruir residuos
  | 'puzzle'           // Puzzle de montar imagem
  | 'timer-challenge'  // Desafio com tempo limite
  | 'direction'        // Escolher direcao
  | 'energy-bar'       // Gerenciar barra de energia
  | 'path-choice'      // Escolher caminho/rota
  | 'pack-items'       // Empacotar itens
  | 'quiz-arcade'      // Quiz estilo arcade
  | 'boss-battle'      // Batalha contra boss
  // Novos tipos de minigames
  | 'word-scramble'    // Desembaralhar palavras científicas
  | 'reaction-time'    // Teste de reflexo/tempo de reação
  | 'bubble-pop'       // Estourar bolhas com termos corretos
  | 'simon-says'       // Repetir sequência de padrões
  | 'target-shooter'   // Atirar em alvos móveis corretos
  | 'typing-speed'     // Digitar termos científicos rapidamente
  | 'swipe-category'   // Deslizar para categorizar
  | 'path-connect'     // Conectar elementos relacionados
  | 'catch-sequence'   // Capturar itens na ordem correta
  | 'true-false-rush'  // Verdadeiro ou falso veloz
  // Novos minigames adicionais
  | 'falling-letters' // Capturar letras caindo para formar palavras
  | 'color-match'     // Classificar por categoria/cor
  | 'whack-a-mole'    // Acertar os termos corretos que aparecem
  | 'slider-puzzle'   // Puzzle de deslizar letras
  | 'rhythm-tap'      // Jogo de ritmo para formar respostas
  // Novos minigames tematicos de citologia
  | 'cyto-wordle'     // Wordle com termos de citologia
  | 'cell-builder'    // Construir celula arrastando organelas
  | 'organelle-quiz'  // Quiz interativo sobre organelas
  | 'cell-memory'     // Jogo da memoria com estruturas celulares
  | 'function-match'  // Conectar organela com funcao
  | 'bio-word-search' // Caca-palavras biologico

export interface MinigameConfig {
  type: MinigameType
  title: string
  description: string
  timeLimit: number // em segundos
  targetScore: number // pontuacao para passar
  difficulty: 1 | 2 | 3 // 1 = facil, 2 = medio, 3 = dificil
}

export interface Phase {
  id: number
  blockId: number
  blockName: string
  title: string
  theme: string
  description: string
  icon: string
  color: string
  minigames: MinigameConfig[]
  isUnlocked: boolean
  educationalContent: {
    title: string
    facts: string[]
  }
}

export interface Block {
  id: number
  name: string
  theme: string
  description: string
  icon: string
  color: string
  phases: number[] // IDs das fases
}

export interface GameProgress {
  currentPhase: number
  currentMinigame: number
  completedPhases: number[]
  phaseScores: Record<number, number>
  totalScore: number
  lives: number
  unlockedBlocks: number[]
  streak?: number
  lastPlayedDate?: string | null
}

export interface MinigameState {
  isActive: boolean
  score: number
  timeRemaining: number
  combo: number
  maxCombo: number
  correctAnswers: number
  wrongAnswers: number
  items: MinigameItem[]
}

export interface MinigameItem {
  id: string
  type: 'correct' | 'wrong' | 'neutral'
  content: string
  image?: string
  position?: { x: number; y: number }
  isVisible: boolean
  isSelected: boolean
  matchId?: string // para jogos de match
}

// Dados para jogos especificos
export interface MemoryCard {
  id: string
  content: string
  matchId: string
  isFlipped: boolean
  isMatched: boolean
}

export interface DragItem {
  id: string
  content: string
  category?: string
  position: { x: number; y: number }
  isPlaced: boolean
}

export interface DropZone {
  id: string
  category: string
  label: string
  accepts: string[]
  items: string[]
}

export interface FallingItem {
  id: string
  content: string
  type: 'correct' | 'wrong'
  x: number
  y: number
  speed: number
}

export interface TargetItem {
  id: string
  content: string
  isCorrect: boolean
  x: number
  y: number
  size: number
  speed?: { x: number; y: number }
}

export interface BossState {
  health: number
  maxHealth: number
  phase: number
  isAttacking: boolean
  currentAttack: string
}
