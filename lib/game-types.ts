export interface DialogueLine {
  speaker: 'drCell' | 'fragmento' | 'narrative' | 'teaching'
  text: string
}

export interface Question {
  id: number
  roomId: number
  theme: string
  caseTitle: string
  dialogues: DialogueLine[]
  question: string
  expectedAnswer: string
  keywords: string[]
  hint: string
  explanation: string
}

export interface Room {
  id: number
  name: string
  theme: string
  description: string
  icon: string
  casesRange: [number, number]
  isUnlocked: boolean
}

export interface GameProgress {
  currentCase: number
  score: number
  answeredQuestions: number[]
  correctAnswers: number[]
  unlockedRooms: number[]
}

export interface GameState {
  phase: 'intro' | 'map' | 'room' | 'case' | 'question' | 'feedback' | 'complete'
  currentRoom: number | null
  currentQuestion: Question | null
  showNarrative: boolean
  lastAnswer: {
    isCorrect: boolean
    userAnswer: string
  } | null
}
