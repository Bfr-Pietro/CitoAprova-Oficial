'use client'

import { useMemo } from 'react'
import type { MinigameConfig, Phase } from '@/lib/minigame-types'
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
import { CytoWordleGame } from '@/components/minigames/cyto-wordle-game'
import { CellBuilderGame } from '@/components/minigames/cell-builder-game'
import { OrganelleQuizGame } from '@/components/minigames/organelle-quiz-game'
import { CellMemoryGame } from '@/components/minigames/cell-memory-game'
import { FunctionMatchGame } from '@/components/minigames/function-match-game'
import { BioWordSearchGame } from '@/components/minigames/bio-word-search-game'

interface MinigameRunnerProps {
  phase: Phase
  minigame: MinigameConfig
  minigameIndex: number
  onComplete: (success: boolean, score: number) => void
  onClose: () => void
  difficulty?: 'facil' | 'normal' | 'dificil'
}

// Funcao para ajustar config baseado na dificuldade
const adjustConfigForDifficulty = (config: MinigameConfig, difficulty: 'facil' | 'normal' | 'dificil'): MinigameConfig => {
  let timeMultiplier = 1
  let scoreMultiplier = 1

  switch (difficulty) {
    case 'facil':
      timeMultiplier = 1.2 // +20% tempo
      scoreMultiplier = 0.8 // -20% pontos necessarios
      break
    case 'dificil':
      timeMultiplier = 0.8 // -20% tempo
      scoreMultiplier = 1.3 // +30% pontos necessarios
      break
    default:
      break
  }

  return {
    ...config,
    timeLimit: Math.round(config.timeLimit * timeMultiplier),
    targetScore: Math.round(config.targetScore * scoreMultiplier)
  }
}

// Dados completos para os minigames baseados em cada tema
const getMinigameData = (phase: Phase, minigame: MinigameConfig, minigameIndex: number) => {
  const theme = phase.theme.toLowerCase()

  // Dados baseados no tema da fase
  const themeData: Record<string, any> = {
    // BLOCO 1 - Descoberta da Célula
    hooke: {
      memoryPairs: [
        { id: '1', item1: 'Robert Hooke', item2: 'Nomeou as células' },
        { id: '2', item1: 'Cortiça', item2: 'Tecido observado' },
        { id: '3', item1: '1665', item2: 'Ano da descoberta' },
        { id: '4', item1: 'Micrographia', item2: 'Livro publicado' },
        { id: '5', item1: 'Microscópio', item2: 'Instrumento usado' },
        { id: '6', item1: 'Inglaterra', item2: 'País de origem' }
      ],
      tapItems: [
        { content: 'Célula', isCorrect: true },
        { content: 'Cortiça', isCorrect: true },
        { content: 'Microscópio', isCorrect: true },
        { content: 'Telefone', isCorrect: false },
        { content: 'Hooke', isCorrect: true },
        { content: 'Avião', isCorrect: false },
        { content: 'Micrographia', isCorrect: true },
        { content: 'Televisão', isCorrect: false }
      ],
      quizQuestions: [
        { question: 'O que Robert Hooke observou em 1665?', options: ['Células de cortiça', 'Bactérias', 'Vírus', 'Sangue'], correctIndex: 0 },
        { question: 'Por que Hooke usou o termo "célula"?', options: ['Parecia pequenos quartos', 'Era redondo', 'Era verde', 'Era grande'], correctIndex: 0 },
        { question: 'Qual livro Hooke publicou?', options: ['Biologia', 'Micrographia', 'Células', 'Natureza'], correctIndex: 1 },
        { question: 'As células de cortiça estavam:', options: ['Vivas', 'Mortas', 'Coloridas', 'Nadando'], correctIndex: 1 },
        { question: 'Hooke usou qual instrumento?', options: ['Telescópio', 'Lupa', 'Microscópio', 'Óculos'], correctIndex: 2 }
      ]
    },
    leeuwenhoek: {
      memoryPairs: [
        { id: '1', item1: 'Leeuwenhoek', item2: 'Pai da microbiologia' },
        { id: '2', item1: 'Animálculos', item2: 'Nome dado aos micróbios' },
        { id: '3', item1: 'Holanda', item2: 'País de origem' },
        { id: '4', item1: 'Bactérias', item2: 'Primeiro a observar' },
        { id: '5', item1: '300x', item2: 'Ampliação das lentes' },
        { id: '6', item1: 'Comerciante', item2: 'Profissão original' }
      ],
      tapItems: [
        { content: 'Bactéria', isCorrect: true },
        { content: 'Protozoário', isCorrect: true },
        { content: 'Animálculo', isCorrect: true },
        { content: 'Elefante', isCorrect: false },
        { content: 'Espermatozoide', isCorrect: true },
        { content: 'Carro', isCorrect: false },
        { content: 'Microorganismo', isCorrect: true },
        { content: 'Prédio', isCorrect: false }
      ],
      quizQuestions: [
        { question: 'Qual era a profissão original de Leeuwenhoek?', options: ['Médico', 'Professor', 'Comerciante de tecidos', 'Cientista'], correctIndex: 2 },
        { question: 'O que Leeuwenhoek chamou de "animálculos"?', options: ['Células vegetais', 'Microorganismos', 'Insetos', 'Peixes'], correctIndex: 1 },
        { question: 'Qual foi a grande descoberta de Leeuwenhoek?', options: ['Células mortas', 'Seres unicelulares vivos', 'Vírus', 'Átomos'], correctIndex: 1 },
        { question: 'Leeuwenhoek era de qual país?', options: ['Inglaterra', 'França', 'Holanda', 'Alemanha'], correctIndex: 2 },
        { question: 'Até quantas vezes suas lentes ampliavam?', options: ['10 vezes', '50 vezes', '100 vezes', '300 vezes'], correctIndex: 3 }
      ]
    },
    teoria: {
      memoryPairs: [
        { id: '1', item1: 'Schleiden', item2: 'Estudou plantas' },
        { id: '2', item1: 'Schwann', item2: 'Estudou animais' },
        { id: '3', item1: 'Virchow', item2: 'Célula vem de célula' },
        { id: '4', item1: '1838-1839', item2: 'Teoria Celular' },
        { id: '5', item1: 'Célula', item2: 'Unidade da vida' },
        { id: '6', item1: 'Divisão', item2: 'Origem das células' }
      ],
      sequenceItems: [
        { content: 'Robert Hooke observa células (1665)', order: 0 },
        { content: 'Leeuwenhoek descobre microorganismos (1674)', order: 1 },
        { content: 'Schleiden estuda células vegetais (1838)', order: 2 },
        { content: 'Schwann estuda células animais (1839)', order: 3 },
        { content: 'Virchow: toda célula vem de outra (1855)', order: 4 }
      ],
      quizQuestions: [
        { question: 'Quem formulou a Teoria Celular?', options: ['Hooke e Leeuwenhoek', 'Schleiden e Schwann', 'Darwin e Mendel', 'Newton e Einstein'], correctIndex: 1 },
        { question: 'O que diz a Teoria Celular?', options: ['Átomo é a menor unidade', 'Todos os seres vivos são feitos de células', 'Plantas são diferentes de animais', 'Células são inertes'], correctIndex: 1 },
        { question: 'O que Virchow contribuiu?', options: ['Descobriu o núcleo', 'Células vêm de células pré-existentes', 'Inventou o microscópio', 'Descobriu bactérias'], correctIndex: 1 },
        { question: 'Qual ciência estuda células?', options: ['Astronomia', 'Citologia', 'Geologia', 'Meteorologia'], correctIndex: 1 },
        { question: '"Omnis cellula e cellula" significa:', options: ['A célula é grande', 'Toda célula vem de outra célula', 'Células são inertes', 'Células são redondas'], correctIndex: 1 }
      ]
    },
    // BLOCO 2 - Tipos de Célula
    procariontes: {
      memoryPairs: [
        { id: '1', item1: 'Procarionte', item2: 'Sem núcleo definido' },
        { id: '2', item1: 'Bactéria', item2: 'Exemplo de procarionte' },
        { id: '3', item1: 'Nucleoide', item2: 'Região do DNA' },
        { id: '4', item1: 'Arqueia', item2: 'Outro grupo procarionte' },
        { id: '5', item1: 'Ribossomo', item2: 'Faz proteínas' },
        { id: '6', item1: 'Parede celular', item2: 'Proteção externa' }
      ],
      tapItems: [
        { content: 'Bactéria', isCorrect: true },
        { content: 'Arqueia', isCorrect: true },
        { content: 'Fungo', isCorrect: false },
        { content: 'E. coli', isCorrect: true },
        { content: 'Planta', isCorrect: false },
        { content: 'Cianobactéria', isCorrect: true },
        { content: 'Animal', isCorrect: false },
        { content: 'Salmonela', isCorrect: true }
      ],
      quizQuestions: [
        { question: 'O que significa "procarionte"?', options: ['Com núcleo', 'Antes do núcleo', 'Depois do núcleo', 'Núcleo grande'], correctIndex: 1 },
        { question: 'Procariontes possuem:', options: ['Núcleo definido', 'Mitocôndrias', 'DNA no nucleoide', 'Cloroplastos'], correctIndex: 2 },
        { question: 'Qual é um exemplo de procarionte?', options: ['Cogumelo', 'Ameba', 'Bactéria', 'Célula humana'], correctIndex: 2 },
        { question: 'Procariontes surgiram há:', options: ['100 mil anos', '1 milhão de anos', '3,5 bilhões de anos', '100 anos'], correctIndex: 2 },
        { question: 'Onde fica o DNA dos procariontes?', options: ['No núcleo', 'No nucleoide', 'Na mitocôndria', 'No Golgi'], correctIndex: 1 }
      ]
    },
    eucariontes: {
      memoryPairs: [
        { id: '1', item1: 'Eucarionte', item2: 'Núcleo verdadeiro' },
        { id: '2', item1: 'Carioteca', item2: 'Membrana nuclear' },
        { id: '3', item1: 'Mitocôndria', item2: 'Energia (ATP)' },
        { id: '4', item1: 'Golgi', item2: 'Empacotamento' },
        { id: '5', item1: 'Retículo', item2: 'Transporte interno' },
        { id: '6', item1: 'Lisossomo', item2: 'Digestão celular' }
      ],
      collectItems: [
        { content: 'Núcleo', isCorrect: true },
        { content: 'Mitocôndria', isCorrect: true },
        { content: 'Ribossomo', isCorrect: true },
        { content: 'Nucleoide', isCorrect: false },
        { content: 'Golgi', isCorrect: true },
        { content: 'Parede de peptidoglicano', isCorrect: false },
        { content: 'Retículo', isCorrect: true },
        { content: 'Flagelo bacteriano', isCorrect: false }
      ],
      quizQuestions: [
        { question: 'O que significa "eucarionte"?', options: ['Sem núcleo', 'Núcleo pequeno', 'Núcleo verdadeiro', 'Núcleo antigo'], correctIndex: 2 },
        { question: 'A carioteca é:', options: ['Membrana do núcleo', 'Parede celular', 'Membrana da mitocôndria', 'Parte do Golgi'], correctIndex: 0 },
        { question: 'Quais organismos são eucariontes?', options: ['Só bactérias', 'Só plantas', 'Animais, plantas, fungos', 'Só animais'], correctIndex: 2 },
        { question: 'Eucariontes possuem:', options: ['Nucleoide', 'Organelas membranosas', 'Parede de peptidoglicano', 'Apenas ribossomos'], correctIndex: 1 },
        { question: 'O que protege o DNA dos eucariontes?', options: ['Nada', 'Carioteca', 'Citoplasma', 'Ribossomo'], correctIndex: 1 }
      ]
    },
    comparacao: {
      memoryPairs: [
        { id: '1', item1: 'Procarionte', item2: 'Menor e mais simples' },
        { id: '2', item1: 'Eucarionte', item2: 'Maior e complexo' },
        { id: '3', item1: 'Bactéria', item2: 'Procarionte' },
        { id: '4', item1: 'Fungo', item2: 'Eucarionte' },
        { id: '5', item1: 'Sem carioteca', item2: 'Procarionte' },
        { id: '6', item1: 'Com organelas', item2: 'Eucarionte' }
      ],
      tapItems: [
        { content: 'Bactéria', isCorrect: true },
        { content: 'Arqueia', isCorrect: true },
        { content: 'Fungo', isCorrect: false },
        { content: 'Planta', isCorrect: false },
        { content: 'Cianobactéria', isCorrect: true },
        { content: 'Protozoário', isCorrect: false },
        { content: 'E. coli', isCorrect: true },
        { content: 'Animal', isCorrect: false }
      ],
      quizQuestions: [
        { question: 'Qual a principal diferença entre pro e eucariontes?', options: ['Tamanho', 'Presença de núcleo definido', 'Cor', 'Forma'], correctIndex: 1 },
        { question: 'Procariontes são geralmente:', options: ['Maiores', 'Menores', 'Iguais', 'Coloridos'], correctIndex: 1 },
        { question: 'O que eucariontes têm que procariontes não têm?', options: ['DNA', 'Ribossomos', 'Organelas membranosas', 'Citoplasma'], correctIndex: 2 },
        { question: 'Qual surgiu primeiro na Terra?', options: ['Eucariontes', 'Procariontes', 'Vírus', 'Plantas'], correctIndex: 1 },
        { question: 'Compartimentalização é característica de:', options: ['Procariontes', 'Eucariontes', 'Ambos', 'Nenhum'], correctIndex: 1 }
      ]
    },
    // BLOCO 3 - Organelas
    mitocondria: {
      memoryPairs: [
        { id: '1', item1: 'Mitocôndria', item2: 'Usina de energia' },
        { id: '2', item1: 'ATP', item2: 'Moeda energética' },
        { id: '3', item1: 'Respiração celular', item2: 'Produção de ATP' },
        { id: '4', item1: 'Cristas', item2: 'Dobras internas' },
        { id: '5', item1: 'DNA mitocondrial', item2: 'Genética própria' },
        { id: '6', item1: 'Dupla membrana', item2: 'Estrutura externa' }
      ],
      clickerTheme: 'energy' as const,
      quizQuestions: [
        { question: 'Qual a função principal da mitocôndria?', options: ['Digestão', 'Produção de ATP', 'Fotossíntese', 'Armazenamento'], correctIndex: 1 },
        { question: 'ATP significa:', options: ['Ácido total proteico', 'Adenosina trifosfato', 'Átomo tri-polar', 'Água tri-pura'], correctIndex: 1 },
        { question: 'A mitocôndria possui:', options: ['Uma membrana', 'Duas membranas', 'Três membranas', 'Nenhuma membrana'], correctIndex: 1 },
        { question: 'O que ocorre na mitocôndria?', options: ['Fotossíntese', 'Respiração celular', 'Digestão', 'Síntese de DNA'], correctIndex: 1 },
        { question: 'Por que a mitocôndria tem DNA próprio?', options: ['É um erro', 'Foi uma bactéria engolida', 'Para se proteger', 'Não tem DNA'], correctIndex: 1 }
      ]
    },
    lisossomo: {
      memoryPairs: [
        { id: '1', item1: 'Lisossomo', item2: 'Digestão celular' },
        { id: '2', item1: 'Enzimas', item2: 'Quebram moléculas' },
        { id: '3', item1: 'Autofagia', item2: 'Digestão de organelas' },
        { id: '4', item1: 'Fagocitose', item2: 'Engloba partículas' },
        { id: '5', item1: 'pH ácido', item2: 'Ambiente interno' },
        { id: '6', item1: 'Reciclagem', item2: 'Reaproveitamento' }
      ],
      tapItems: [
        { content: 'Resíduo celular', isCorrect: true },
        { content: 'Proteína danificada', isCorrect: true },
        { content: 'Organela velha', isCorrect: true },
        { content: 'Núcleo', isCorrect: false },
        { content: 'Bactéria invasora', isCorrect: true },
        { content: 'Mitocôndria saudável', isCorrect: false },
        { content: 'Lixo metabólico', isCorrect: true },
        { content: 'DNA nuclear', isCorrect: false }
      ],
      quizQuestions: [
        { question: 'Qual a função do lisossomo?', options: ['Energia', 'Digestão celular', 'Fotossíntese', 'Transporte'], correctIndex: 1 },
        { question: 'O que os lisossomos contêm?', options: ['ATP', 'Enzimas digestivas', 'Clorofila', 'DNA'], correctIndex: 1 },
        { question: 'O pH interno do lisossomo é:', options: ['Neutro', 'Básico', 'Ácido', 'Variável'], correctIndex: 2 },
        { question: 'Autofagia significa:', options: ['Comer outras células', 'Digerir partes da própria célula', 'Produzir energia', 'Fazer fotossíntese'], correctIndex: 1 },
        { question: 'De onde vêm os lisossomos?', options: ['Núcleo', 'Mitocôndria', 'Complexo de Golgi', 'Membrana plasmática'], correctIndex: 2 }
      ]
    },
    cloroplasto: {
      memoryPairs: [
        { id: '1', item1: 'Cloroplasto', item2: 'Fotossíntese' },
        { id: '2', item1: 'Clorofila', item2: 'Pigmento verde' },
        { id: '3', item1: 'Luz solar', item2: 'Energia usada' },
        { id: '4', item1: 'Glicose', item2: 'Açúcar produzido' },
        { id: '5', item1: 'CO2', item2: 'Gás absorvido' },
        { id: '6', item1: 'O2', item2: 'Gás liberado' }
      ],
      collectItems: [
        { content: 'Luz solar', isCorrect: true },
        { content: 'Fóton', isCorrect: true },
        { content: 'CO2', isCorrect: true },
        { content: 'Escuridão', isCorrect: false },
        { content: 'H2O', isCorrect: true },
        { content: 'Poluição', isCorrect: false },
        { content: 'Clorofila', isCorrect: true },
        { content: 'Fogo', isCorrect: false }
      ],
      quizQuestions: [
        { question: 'Qual a função do cloroplasto?', options: ['Respiração', 'Fotossíntese', 'Digestão', 'Transporte'], correctIndex: 1 },
        { question: 'A clorofila é de qual cor?', options: ['Vermelha', 'Azul', 'Verde', 'Amarela'], correctIndex: 2 },
        { question: 'O que o cloroplasto usa?', options: ['Oxigênio e glicose', 'Luz, CO2 e água', 'Proteínas', 'ATP apenas'], correctIndex: 1 },
        { question: 'Cloroplastos existem em:', options: ['Todas as células', 'Só animais', 'Só plantas e algas', 'Bactérias apenas'], correctIndex: 2 },
        { question: 'O que a fotossíntese libera?', options: ['CO2', 'Nitrogênio', 'Oxigênio', 'Metano'], correctIndex: 2 }
      ]
    },
    // BLOCO 4 - Animal vs Vegetal
    animal: {
      memoryPairs: [
        { id: '1', item1: 'Célula animal', item2: 'Sem parede celular' },
        { id: '2', item1: 'Centríolo', item2: 'Divisão celular' },
        { id: '3', item1: 'Lisossomo', item2: 'Digestão' },
        { id: '4', item1: 'Vacúolo pequeno', item2: 'Armazenamento' },
        { id: '5', item1: 'Forma variada', item2: 'Sem parede rígida' },
        { id: '6', item1: 'Glicogênio', item2: 'Reserva de energia' }
      ],
      tapItems: [
        { content: 'Centríolo', isCorrect: true },
        { content: 'Lisossomo', isCorrect: true },
        { content: 'Vacúolo pequeno', isCorrect: true },
        { content: 'Parede celular', isCorrect: false },
        { content: 'Glicogênio', isCorrect: true },
        { content: 'Cloroplasto', isCorrect: false },
        { content: 'Mitocôndria', isCorrect: true },
        { content: 'Vacúolo central grande', isCorrect: false }
      ],
      quizQuestions: [
        { question: 'Células animais possuem:', options: ['Parede celular', 'Cloroplastos', 'Centríolos', 'Vacúolo central grande'], correctIndex: 2 },
        { question: 'A reserva de energia em animais é:', options: ['Amido', 'Glicogênio', 'Celulose', 'Clorofila'], correctIndex: 1 },
        { question: 'Células animais NÃO possuem:', options: ['Núcleo', 'Mitocôndria', 'Parede celular', 'Membrana'], correctIndex: 2 },
        { question: 'Por que células animais têm forma variada?', options: ['Por causa do núcleo', 'Não têm parede rígida', 'Têm cloroplastos', 'São menores'], correctIndex: 1 },
        { question: 'Centríolos participam da:', options: ['Fotossíntese', 'Digestão', 'Divisão celular', 'Respiração'], correctIndex: 2 }
      ]
    },
    vegetal: {
      memoryPairs: [
        { id: '1', item1: 'Célula vegetal', item2: 'Com parede celular' },
        { id: '2', item1: 'Cloroplasto', item2: 'Fotossíntese' },
        { id: '3', item1: 'Vacúolo central', item2: 'Grande reservatório' },
        { id: '4', item1: 'Parede de celulose', item2: 'Proteção e sustentação' },
        { id: '5', item1: 'Amido', item2: 'Reserva de energia' },
        { id: '6', item1: 'Plasmodesmos', item2: 'Conexão entre células' }
      ],
      tapItems: [
        { content: 'Parede celular', isCorrect: true },
        { content: 'Cloroplasto', isCorrect: true },
        { content: 'Vacúolo central', isCorrect: true },
        { content: 'Centríolo', isCorrect: false },
        { content: 'Amido', isCorrect: true },
        { content: 'Glicogenio', isCorrect: false },
        { content: 'Plasmodermo', isCorrect: true },
        { content: 'Lisossomo', isCorrect: false }
      ],
      quizQuestions: [
        { question: 'Células vegetais possuem:', options: ['Centríolos', 'Cloroplastos', 'Glicogênio', 'Forma variada'], correctIndex: 1 },
        { question: 'A parede celular é feita de:', options: ['Proteína', 'Celulose', 'Gordura', 'Açúcar'], correctIndex: 1 },
        { question: 'O vacúolo central é:', options: ['Pequeno', 'Ausente', 'Grande', 'Fora da célula'], correctIndex: 2 },
        { question: 'A reserva de energia em plantas é:', options: ['Glicogênio', 'Amido', 'ATP', 'Gordura'], correctIndex: 1 },
        { question: 'O que dá cor verde às plantas?', options: ['Vacúolo', 'Núcleo', 'Clorofila', 'Celulose'], correctIndex: 2 }
      ]
    },
    // BLOCO 5 - Membrana Plasmática
    estrutura: {
      memoryPairs: [
        { id: '1', item1: 'Membrana plasmática', item2: 'Bicamada lipídica' },
        { id: '2', item1: 'Fosfolipídio', item2: 'Componente principal' },
        { id: '3', item1: 'Proteína integral', item2: 'Atravessa a membrana' },
        { id: '4', item1: 'Proteína periférica', item2: 'Na superfície' },
        { id: '5', item1: 'Mosaico fluido', item2: 'Modelo da membrana' },
        { id: '6', item1: 'Colesterol', item2: 'Fluidez da membrana' }
      ],
      quizQuestions: [
        { question: 'A membrana plasmática é formada por:', options: ['Proteínas apenas', 'Bicamada lipídica', 'Celulose', 'Açúcares'], correctIndex: 1 },
        { question: 'O modelo mosaico fluido descreve:', options: ['O núcleo', 'A membrana plasmática', 'O ribossomo', 'A mitocôndria'], correctIndex: 1 },
        { question: 'Fosfolipídios têm:', options: ['Cabeça hidrofílica e cauda hidrofóbica', 'Tudo hidrofílico', 'Tudo hidrofóbico', 'Nenhuma parte especial'], correctIndex: 0 },
        { question: 'Proteínas integrais:', options: ['Ficam fora da membrana', 'Atravessam a membrana', 'Não existem', 'São carboidratos'], correctIndex: 1 },
        { question: 'O colesterol na membrana serve para:', options: ['Nutrição', 'Cor', 'Regular fluidez', 'Energia'], correctIndex: 2 }
      ]
    },
    funcoes: {
      memoryPairs: [
        { id: '1', item1: 'Permeabilidade seletiva', item2: 'Controla passagem' },
        { id: '2', item1: 'Receptores', item2: 'Captam sinais' },
        { id: '3', item1: 'Homeostase', item2: 'Equilíbrio interno' },
        { id: '4', item1: 'Transporte', item2: 'Entrada e saída' },
        { id: '5', item1: 'Reconhecimento', item2: 'Identifica células' },
        { id: '6', item1: 'Comunicação', item2: 'Troca de informações' }
      ],
      quizQuestions: [
        { question: 'Permeabilidade seletiva significa:', options: ['Deixa tudo passar', 'Não deixa nada passar', 'Seleciona o que passa', 'É impermeável'], correctIndex: 2 },
        { question: 'Receptores de membrana servem para:', options: ['Captar sinais externos', 'Produzir energia', 'Digerir', 'Armazenar'], correctIndex: 0 },
        { question: 'Homeostase é:', options: ['Desequilíbrio', 'Equilíbrio interno', 'Morte celular', 'Divisão'], correctIndex: 1 },
        { question: 'O glicocálix é formado por:', options: ['Proteínas', 'Lipídios', 'Carboidratos', 'DNA'], correctIndex: 2 },
        { question: 'A comunicação celular ocorre através de:', options: ['Divisão', 'Receptores e sinais', 'Fotossíntese', 'Digestão'], correctIndex: 1 }
      ]
    },
    especializacoes: {
      memoryPairs: [
        { id: '1', item1: 'Microvilosidades', item2: 'Aumentam absorção' },
        { id: '2', item1: 'Desmossomos', item2: 'Unem células' },
        { id: '3', item1: 'Junções comunicantes', item2: 'Permitem troca' },
        { id: '4', item1: 'Interdigitações', item2: 'Aumentam contato' },
        { id: '5', item1: 'Cílios', item2: 'Movimento' },
        { id: '6', item1: 'Flagelo', item2: 'Locomoção' }
      ],
      quizQuestions: [
        { question: 'Microvilosidades servem para:', options: ['Locomoção', 'Aumentar absorção', 'Divisão', 'Secreção'], correctIndex: 1 },
        { question: 'Desmossomos são estruturas que:', options: ['Separam células', 'Unem células', 'Destroem células', 'Criam células'], correctIndex: 1 },
        { question: 'Onde encontramos microvilosidades?', options: ['Músculo', 'Intestino', 'Osso', 'Cérebro'], correctIndex: 1 },
        { question: 'Junções comunicantes permitem:', options: ['Separação total', 'Troca de íons e pequenas moléculas', 'Nada passar', 'Só água passar'], correctIndex: 1 },
        { question: 'Flagelos são usados para:', options: ['Absorção', 'Locomoção', 'Digestão', 'Respiração'], correctIndex: 1 }
      ]
    },
    desafio: {
      quizQuestions: [
        { question: 'A membrana plasmática é semipermeável porque:', options: ['É sólida', 'Seleciona o que entra e sai', 'É impermeável', 'É líquida'], correctIndex: 1 },
        { question: 'Proteínas transportadoras:', options: ['Bloqueiam passagem', 'Facilitam transporte de substâncias', 'Produzem energia', 'Fazem fotossíntese'], correctIndex: 1 },
        { question: 'O modelo mosaico fluido foi proposto por:', options: ['Hooke', 'Singer e Nicolson', 'Schleiden', 'Darwin'], correctIndex: 1 },
        { question: 'Canais iônicos transportam:', options: ['Proteínas', 'Íons', 'Carboidratos', 'Lipídios'], correctIndex: 1 },
        { question: 'A fluidez da membrana depende de:', options: ['DNA', 'Ribossomos', 'Composição de lipídios', 'Tamanho da célula'], correctIndex: 2 }
      ]
    },
    // BLOCO 6 - Transporte Celular
    difusao: {
      memoryPairs: [
        { id: '1', item1: 'Difusão', item2: 'Transporte passivo' },
        { id: '2', item1: 'Alta concentração', item2: 'Para baixa' },
        { id: '3', item1: 'Sem energia', item2: 'Não gasta ATP' },
        { id: '4', item1: 'Oxigênio', item2: 'Difusão simples' },
        { id: '5', item1: 'Gradiente', item2: 'Diferença de concentração' },
        { id: '6', item1: 'Equilíbrio', item2: 'Concentrações iguais' }
      ],
      quizQuestions: [
        { question: 'Difusão é um transporte:', options: ['Ativo', 'Passivo', 'Nuclear', 'Impossível'], correctIndex: 1 },
        { question: 'Na difusão, moléculas vão de:', options: ['Baixa para alta concentração', 'Alta para baixa concentração', 'Ficam paradas', 'Qualquer direção'], correctIndex: 1 },
        { question: 'A difusão gasta ATP?', options: ['Sim, muito', 'Sim, pouco', 'Não', 'Às vezes'], correctIndex: 2 },
        { question: 'Qual gás entra por difusão simples?', options: ['Nitrogênio', 'Oxigênio', 'Metano', 'Hélio'], correctIndex: 1 },
        { question: 'Gradiente de concentração significa:', options: ['Concentração igual', 'Diferença de concentração', 'Sem moléculas', 'Muita energia'], correctIndex: 1 }
      ]
    },
    osmose: {
      memoryPairs: [
        { id: '1', item1: 'Osmose', item2: 'Transporte de água' },
        { id: '2', item1: 'Hipotônico', item2: 'Menos soluto' },
        { id: '3', item1: 'Hipertônico', item2: 'Mais soluto' },
        { id: '4', item1: 'Isotônico', item2: 'Soluto igual' },
        { id: '5', item1: 'Turgescência', item2: 'Célula inchada' },
        { id: '6', item1: 'Plasmólise', item2: 'Célula murcha' }
      ],
      quizQuestions: [
        { question: 'Osmose é o transporte de:', options: ['Proteínas', 'Água', 'Lipídios', 'DNA'], correctIndex: 1 },
        { question: 'Na osmose, a água vai para o meio:', options: ['Hipotônico', 'Hipertônico', 'Qualquer', 'Ácido'], correctIndex: 1 },
        { question: 'Uma célula em meio hipotônico:', options: ['Murcha', 'Incha', 'Fica igual', 'Morre'], correctIndex: 1 },
        { question: 'Plasmólise ocorre quando:', options: ['Célula incha', 'Célula murcha', 'Célula se divide', 'Célula cresce'], correctIndex: 1 },
        { question: 'Meio isotônico significa:', options: ['Mais concentrado', 'Menos concentrado', 'Mesma concentração', 'Sem água'], correctIndex: 2 }
      ]
    },
    ativo: {
      memoryPairs: [
        { id: '1', item1: 'Transporte ativo', item2: 'Gasta ATP' },
        { id: '2', item1: 'Contra gradiente', item2: 'Baixa para alta' },
        { id: '3', item1: 'Bomba Na+/K+', item2: 'Sódio e potássio' },
        { id: '4', item1: 'Proteína carreadora', item2: 'Faz o transporte' },
        { id: '5', item1: 'Endocitose', item2: 'Engloba partículas' },
        { id: '6', item1: 'Exocitose', item2: 'Libera substâncias' }
      ],
      quizQuestions: [
        { question: 'Transporte ativo gasta:', options: ['Nada', 'ATP', 'Água', 'Luz'], correctIndex: 1 },
        { question: 'No transporte ativo, moléculas vão:', options: ['A favor do gradiente', 'Contra o gradiente', 'Ficam paradas', 'Para fora sempre'], correctIndex: 1 },
        { question: 'A bomba de sódio-potássio transporta:', options: ['Água', 'Na+ para fora e K+ para dentro', 'Proteínas', 'Lipídios'], correctIndex: 1 },
        { question: 'Endocitose é:', options: ['Saída de substâncias', 'Entrada de substâncias por englobamento', 'Divisão celular', 'Morte celular'], correctIndex: 1 },
        { question: 'Exocitose é usada para:', options: ['Absorver nutrientes', 'Liberar secreções', 'Respirar', 'Dividir'], correctIndex: 1 }
      ]
    },
    revisao: {
      quizQuestions: [
        { question: 'Transporte passivo inclui:', options: ['Apenas difusão', 'Difusão e osmose', 'Apenas transporte ativo', 'Endocitose'], correctIndex: 1 },
        { question: 'O que difere transporte ativo do passivo?', options: ['Velocidade', 'Gasto de ATP', 'Tipo de molécula', 'Local'], correctIndex: 1 },
        { question: 'Fagocitose é um tipo de:', options: ['Difusão', 'Osmose', 'Endocitose', 'Exocitose'], correctIndex: 2 },
        { question: 'Pinocitose engloba:', options: ['Sólidos', 'Líquidos', 'Gases', 'Nada'], correctIndex: 1 },
        { question: 'Canais iônicos fazem transporte:', options: ['Ativo', 'Passivo facilitado', 'Endocitose', 'Exocitose'], correctIndex: 1 }
      ]
    },
    // BLOCO 7 - Síntese de Proteínas
    transcricao: {
      memoryPairs: [
        { id: '1', item1: 'Transcrição', item2: 'DNA para RNA' },
        { id: '2', item1: 'RNA polimerase', item2: 'Enzima principal' },
        { id: '3', item1: 'Núcleo', item2: 'Local do processo' },
        { id: '4', item1: 'mRNA', item2: 'RNA mensageiro' },
        { id: '5', item1: 'Fita molde', item2: 'DNA copiado' },
        { id: '6', item1: 'Bases nitrogenadas', item2: 'A, U, C, G no RNA' }
      ],
      sequenceItems: [
        { content: 'RNA polimerase liga ao DNA', order: 0 },
        { content: 'DNA se abre (desnatura)', order: 1 },
        { content: 'Nucleotídeos de RNA são adicionados', order: 2 },
        { content: 'mRNA é formado', order: 3 },
        { content: 'mRNA sai do núcleo', order: 4 }
      ],
      quizQuestions: [
        { question: 'Transcrição produz:', options: ['DNA', 'RNA', 'Proteína', 'Lipídio'], correctIndex: 1 },
        { question: 'A transcrição ocorre no:', options: ['Citoplasma', 'Núcleo', 'Ribossomo', 'Golgi'], correctIndex: 1 },
        { question: 'Qual enzima faz a transcrição?', options: ['DNA polimerase', 'RNA polimerase', 'Lipase', 'Amilase'], correctIndex: 1 },
        { question: 'No RNA, a base que substitui a Timina é:', options: ['Adenina', 'Citosina', 'Guanina', 'Uracila'], correctIndex: 3 },
        { question: 'O que é transcrito durante a transcrição?', options: ['Proteína', 'Um gene', 'Lipídio', 'Carboidrato'], correctIndex: 1 }
      ]
    },
    traducao: {
      memoryPairs: [
        { id: '1', item1: 'Tradução', item2: 'RNA para proteína' },
        { id: '2', item1: 'Ribossomo', item2: 'Local do processo' },
        { id: '3', item1: 'Códon', item2: '3 bases do mRNA' },
        { id: '4', item1: 'Anticódon', item2: '3 bases do tRNA' },
        { id: '5', item1: 'tRNA', item2: 'Transporta aminoácidos' },
        { id: '6', item1: 'Aminoácido', item2: 'Unidade da proteína' }
      ],
      quizQuestions: [
        { question: 'Tradução produz:', options: ['DNA', 'RNA', 'Proteínas', 'Lipídios'], correctIndex: 2 },
        { question: 'A tradução ocorre no:', options: ['Núcleo', 'Ribossomo', 'Golgi', 'Lisossomo'], correctIndex: 1 },
        { question: 'Um códon é formado por:', options: ['1 base', '2 bases', '3 bases', '4 bases'], correctIndex: 2 },
        { question: 'O tRNA transporta:', options: ['DNA', 'RNA', 'Aminoácidos', 'Lipídios'], correctIndex: 2 },
        { question: 'O códon AUG codifica:', options: ['Parada', 'Metionina (início)', 'Glicina', 'Alanina'], correctIndex: 1 }
      ]
    },
    processamento: {
      memoryPairs: [
        { id: '1', item1: 'Retículo rugoso', item2: 'Síntese de proteínas' },
        { id: '2', item1: 'Golgi', item2: 'Modifica e empacota' },
        { id: '3', item1: 'Vesícula', item2: 'Transporta proteínas' },
        { id: '4', item1: 'Glicosilação', item2: 'Adição de açúcar' },
        { id: '5', item1: 'Secreção', item2: 'Liberação para fora' },
        { id: '6', item1: 'Endereçamento', item2: 'Destino da proteína' }
      ],
      quizQuestions: [
        { question: 'O Retículo Rugoso tem:', options: ['Lipídios', 'Ribossomos', 'DNA', 'Cloroplastos'], correctIndex: 1 },
        { question: 'O Golgi serve para:', options: ['Digestão', 'Modificar e empacotar proteínas', 'Energia', 'Fotossíntese'], correctIndex: 1 },
        { question: 'Vesículas transportam:', options: ['Genes', 'Proteínas', 'Células', 'Órgãos'], correctIndex: 1 },
        { question: 'Glicosilação é a adição de:', options: ['Proteínas', 'Lipídios', 'Açúcares', 'DNA'], correctIndex: 2 },
        { question: 'Proteínas de secreção passam por:', options: ['Núcleo apenas', 'Retículo e Golgi', 'Mitocôndria', 'Lisossomo'], correctIndex: 1 }
      ]
    },
    fluxo: {
      sequenceItems: [
        { content: 'DNA no núcleo', order: 0 },
        { content: 'Transcrição: DNA para mRNA', order: 1 },
        { content: 'mRNA vai ao citoplasma', order: 2 },
        { content: 'Tradução no ribossomo', order: 3 },
        { content: 'Proteína formada', order: 4 }
      ],
      quizQuestions: [
        { question: 'O dogma central da biologia é:', options: ['Proteína > RNA > DNA', 'DNA > RNA > Proteína', 'RNA > DNA > Proteína', 'DNA > Proteína > RNA'], correctIndex: 1 },
        { question: 'A informação genética flui de:', options: ['Proteína para DNA', 'DNA para RNA para Proteína', 'RNA para DNA', 'Proteína para RNA'], correctIndex: 1 },
        { question: 'Onde começa a expressão gênica?', options: ['Ribossomo', 'Núcleo', 'Golgi', 'Citoplasma'], correctIndex: 1 },
        { question: 'O que carrega a informação do núcleo ao ribossomo?', options: ['tRNA', 'mRNA', 'rRNA', 'DNA'], correctIndex: 1 },
        { question: 'Proteínas são feitas de:', options: ['Nucleotídeos', 'Aminoácidos', 'Lipídios', 'Açúcares'], correctIndex: 1 }
      ]
    },
    // BLOCO 8 - Energia Celular
    glicolise: {
      memoryPairs: [
        { id: '1', item1: 'Glicólise', item2: 'Quebra da glicose' },
        { id: '2', item1: 'Citoplasma', item2: 'Local do processo' },
        { id: '3', item1: 'Piruvato', item2: 'Produto final' },
        { id: '4', item1: '2 ATP', item2: 'Saldo energético' },
        { id: '5', item1: 'Anaeróbico', item2: 'Sem oxigênio' },
        { id: '6', item1: 'NADH', item2: 'Carregador de elétrons' }
      ],
      clickerTheme: 'energy' as const,
      quizQuestions: [
        { question: 'A glicólise ocorre no:', options: ['Núcleo', 'Mitocôndria', 'Citoplasma', 'Golgi'], correctIndex: 2 },
        { question: 'A glicólise quebra:', options: ['Proteínas', 'Glicose', 'Lipídios', 'DNA'], correctIndex: 1 },
        { question: 'O produto final da glicólise é:', options: ['Glicose', 'Piruvato', 'Água', 'CO2'], correctIndex: 1 },
        { question: 'Quantos ATPs são produzidos (saldo)?', options: ['1', '2', '4', '36'], correctIndex: 1 },
        { question: 'A glicólise precisa de oxigênio?', options: ['Sim', 'Não', 'Às vezes', 'Depende'], correctIndex: 1 }
      ]
    },
    krebs: {
      memoryPairs: [
        { id: '1', item1: 'Ciclo de Krebs', item2: 'Matriz mitocondrial' },
        { id: '2', item1: 'Acetil-CoA', item2: 'Entra no ciclo' },
        { id: '3', item1: 'CO2', item2: 'Liberado no ciclo' },
        { id: '4', item1: 'NADH e FADH2', item2: 'Carregadores produzidos' },
        { id: '5', item1: 'Ácido cítrico', item2: 'Primeiro composto' },
        { id: '6', item1: '2 ATP', item2: 'Produzidos por ciclo' }
      ],
      sequenceItems: [
        { content: 'Acetil-CoA entra no ciclo', order: 0 },
        { content: 'Forma-se ácido cítrico', order: 1 },
        { content: 'CO2 é liberado', order: 2 },
        { content: 'NADH e FADH2 são produzidos', order: 3 },
        { content: 'Oxaloacetato regenerado', order: 4 }
      ],
      quizQuestions: [
        { question: 'O Ciclo de Krebs ocorre na:', options: ['Membrana', 'Matriz mitocondrial', 'Citoplasma', 'Núcleo'], correctIndex: 1 },
        { question: 'O que entra no Ciclo de Krebs?', options: ['Glicose', 'Acetil-CoA', 'Proteína', 'DNA'], correctIndex: 1 },
        { question: 'O que é liberado no ciclo?', options: ['O2', 'N2', 'CO2', 'H2'], correctIndex: 2 },
        { question: 'Quantas voltas o ciclo dá por glicose?', options: ['1', '2', '3', '4'], correctIndex: 1 },
        { question: 'NADH e FADH2 carregam:', options: ['Proteínas', 'Elétrons', 'Lipídios', 'Açúcares'], correctIndex: 1 }
      ]
    },
    cadeia: {
      memoryPairs: [
        { id: '1', item1: 'Cadeia respiratória', item2: 'Cristas mitocondriais' },
        { id: '2', item1: 'NADH e FADH2', item2: 'Doam elétrons' },
        { id: '3', item1: 'O2', item2: 'Aceptor final' },
        { id: '4', item1: '34 ATP', item2: 'Máximo produzido' },
        { id: '5', item1: 'Água', item2: 'Produto final' },
        { id: '6', item1: 'Fosforilação oxidativa', item2: 'Produção de ATP' }
      ],
      quizQuestions: [
        { question: 'A cadeia respiratória ocorre nas:', options: ['Cristas mitocondriais', 'Matriz', 'Citoplasma', 'Núcleo'], correctIndex: 0 },
        { question: 'O aceptor final de elétrons é:', options: ['CO2', 'N2', 'O2', 'H2'], correctIndex: 2 },
        { question: 'Quantos ATPs a cadeia pode produzir?', options: ['2', '4', '10', 'Até 34'], correctIndex: 3 },
        { question: 'O que se forma no final?', options: ['CO2', 'O2', 'Água', 'Glicose'], correctIndex: 2 },
        { question: 'NADH doa elétrons para:', options: ['O ciclo de Krebs', 'A cadeia respiratória', 'A glicólise', 'O núcleo'], correctIndex: 1 }
      ]
    },
    // BLOCO 9 - Desafio Final e Boss
    revisao_geral: {
      quizQuestions: [
        { question: 'A célula é a unidade:', options: ['Do átomo', 'Da vida', 'Do universo', 'Da química'], correctIndex: 1 },
        { question: 'Procariontes não possuem:', options: ['DNA', 'Ribossomos', 'Núcleo definido', 'Citoplasma'], correctIndex: 2 },
        { question: 'A mitocôndria produz:', options: ['DNA', 'ATP', 'Proteínas', 'Lipídios'], correctIndex: 1 },
        { question: 'A fotossíntese ocorre no:', options: ['Núcleo', 'Mitocôndria', 'Cloroplasto', 'Ribossomo'], correctIndex: 2 },
        { question: 'Quem nomeou as células?', options: ['Leeuwenhoek', 'Schwann', 'Hooke', 'Virchow'], correctIndex: 2 }
      ]
    },
    maratona: {
      quizQuestions: [
        { question: 'Onde ocorre a transcrição?', options: ['Citoplasma', 'Núcleo', 'Ribossomo', 'Golgi'], correctIndex: 1 },
        { question: 'A osmose transporta:', options: ['Proteínas', 'Água', 'DNA', 'ATP'], correctIndex: 1 },
        { question: 'O lisossomo faz:', options: ['Energia', 'Digestão', 'Fotossíntese', 'Transporte'], correctIndex: 1 },
        { question: 'A glicólise ocorre no:', options: ['Núcleo', 'Mitocôndria', 'Citoplasma', 'Golgi'], correctIndex: 2 },
        { question: 'Células vegetais têm:', options: ['Centríolos', 'Cloroplastos', 'Glicogênio', 'Lisossomos grandes'], correctIndex: 1 }
      ]
    },
    boss: {
      bossAttacks: [
        { question: 'Qual organela produz energia (ATP)?', options: ['Mitocôndria', 'Núcleo', 'Ribossomo', 'Golgi'], correctIndex: 0, damage: 12 },
        { question: 'Células sem núcleo definido são:', options: ['Eucariontes', 'Procariontes', 'Vegetais', 'Animais'], correctIndex: 1, damage: 12 },
        { question: 'A fotossíntese ocorre no:', options: ['Núcleo', 'Mitocôndria', 'Cloroplasto', 'Lisossomo'], correctIndex: 2, damage: 12 },
        { question: 'Quem observou células em 1665?', options: ['Leeuwenhoek', 'Schwann', 'Hooke', 'Virchow'], correctIndex: 2, damage: 12 },
        { question: 'O Golgi faz:', options: ['Digestão', 'Empacotamento de proteínas', 'Fotossíntese', 'Respiração'], correctIndex: 1, damage: 12 },
        { question: 'A membrana é formada por:', options: ['Celulose', 'Bicamada lipídica', 'Proteínas apenas', 'Açúcares'], correctIndex: 1, damage: 12 },
        { question: 'A tradução ocorre no:', options: ['Núcleo', 'Ribossomo', 'Golgi', 'Lisossomo'], correctIndex: 1, damage: 12 },
        { question: 'Transporte ativo gasta:', options: ['Nada', 'ATP', 'Água', 'Luz'], correctIndex: 1, damage: 12 },
        { question: 'O DNA fica no:', options: ['Citoplasma', 'Núcleo', 'Ribossomo', 'Golgi'], correctIndex: 1, damage: 12 },
        { question: 'Lisossomos fazem:', options: ['Energia', 'Digestão', 'Fotossíntese', 'Transporte ativo'], correctIndex: 1, damage: 12 }
      ]
    },
    // Dados globais para novos minigames
    _wordScramble: {
      hooke: [
        { word: 'CÉLULA', hint: 'Unidade básica da vida, nomeada por Hooke' },
        { word: 'CORTIÇA', hint: 'Tecido vegetal observado por Hooke' },
        { word: 'MICROSCÓPIO', hint: 'Instrumento usado para observação' },
        { word: 'MICROGRAPHIA', hint: 'Livro publicado por Hooke' }
      ],
      leeuwenhoek: [
        { word: 'BACTÉRIA', hint: 'Microorganismo unicelular procarionte' },
        { word: 'ANIMÁLCULO', hint: 'Nome dado aos micróbios por Leeuwenhoek' },
        { word: 'PROTOZOÁRIO', hint: 'Organismo unicelular eucarionte' },
        { word: 'LENTE', hint: 'Componente do microscópio que amplia imagens' }
      ],
      procariontes: [
        { word: 'NUCLEOIDE', hint: 'Região do DNA nos procariontes' },
        { word: 'RIBOSSOMO', hint: 'Organela que produz proteínas' },
        { word: 'PLASMÍDEO', hint: 'DNA circular extra em bactérias' },
        { word: 'FLAGELO', hint: 'Estrutura de locomoção bacteriana' }
      ],
      eucariontes: [
        { word: 'CARIOTECA', hint: 'Membrana que envolve o núcleo' },
        { word: 'MITOCÔNDRIA', hint: 'Organela que produz ATP' },
        { word: 'RETÍCULO', hint: 'Sistema de membranas interno' },
        { word: 'LISOSSOMO', hint: 'Organela de digestão celular' }
      ],
      mitocondria: [
        { word: 'CRISTA', hint: 'Dobras internas da mitocôndria' },
        { word: 'MATRIZ', hint: 'Parte interna da mitocôndria' },
        { word: 'RESPIRAÇÃO', hint: 'Processo que produz ATP' },
        { word: 'ADENOSINA', hint: 'Parte do nome ATP' }
      ],
      cloroplasto: [
        { word: 'CLOROFILA', hint: 'Pigmento verde das plantas' },
        { word: 'TILACOIDE', hint: 'Estrutura onde ocorre fase clara' },
        { word: 'ESTROMA', hint: 'Matriz do cloroplasto' },
        { word: 'GLICOSE', hint: 'Açúcar produzido na fotossíntese' }
      ]
    },
    _typingWords: {
      hooke: [
        { word: 'célula', definition: 'A menor unidade funcional dos seres vivos' },
        { word: 'cortiça', definition: 'Tecido morto observado por Hooke' },
        { word: 'microscópio', definition: 'Instrumento de ampliação óptica' },
        { word: 'citologia', definition: 'Ciência que estuda as células' }
      ],
      teoria: [
        { word: 'schleiden', definition: 'Cientista que estudou células vegetais' },
        { word: 'schwann', definition: 'Cientista que estudou células animais' },
        { word: 'virchow', definition: 'Afirmou que toda célula vem de outra' },
        { word: 'biogênese', definition: 'Origem dos seres vivos a partir de outros' }
      ],
      procariontes: [
        { word: 'bactéria', definition: 'Procarionte mais conhecido' },
        { word: 'arqueia', definition: 'Procarionte de ambientes extremos' },
        { word: 'cianobactéria', definition: 'Bactéria que faz fotossíntese' },
        { word: 'nucleoide', definition: 'Região onde fica o DNA bacteriano' }
      ],
      eucariontes: [
        { word: 'organela', definition: 'Estrutura com função específica na célula' },
        { word: 'carioteca', definition: 'Envelope que protege o núcleo' },
        { word: 'citoplasma', definition: 'Região entre membrana e núcleo' },
        { word: 'cromossomo', definition: 'Estrutura que contém os genes' }
      ]
    },
    _pathConnectPairs: {
      hooke: [
        { id: '1', left: 'Robert Hooke', right: 'Nomeou as células' },
        { id: '2', left: '1665', right: 'Ano da descoberta' },
        { id: '3', left: 'Cortiça', right: 'Tecido observado' },
        { id: '4', left: 'Micrographia', right: 'Livro publicado' },
        { id: '5', left: 'Microscópio', right: 'Instrumento usado' }
      ],
      teoria: [
        { id: '1', left: 'Schleiden', right: 'Células vegetais' },
        { id: '2', left: 'Schwann', right: 'Células animais' },
        { id: '3', left: 'Virchow', right: 'Omnis cellula e cellula' },
        { id: '4', left: 'Teoria Celular', right: 'Todos são feitos de células' },
        { id: '5', left: 'Citologia', right: 'Estudo das células' }
      ],
      comparacao: [
        { id: '1', left: 'Procarionte', right: 'Sem núcleo definido' },
        { id: '2', left: 'Eucarionte', right: 'Com núcleo definido' },
        { id: '3', left: 'Bactéria', right: 'Exemplo de procarionte' },
        { id: '4', left: 'Fungo', right: 'Exemplo de eucarionte' },
        { id: '5', left: 'Carioteca', right: 'Membrana nuclear' }
      ],
      animal: [
        { id: '1', left: 'Centríolo', right: 'Divisão celular' },
        { id: '2', left: 'Lisossomo', right: 'Digestão celular' },
        { id: '3', left: 'Glicogênio', right: 'Reserva energética' },
        { id: '4', left: 'Vacúolo pequeno', right: 'Armazenamento' },
        { id: '5', left: 'Sem parede', right: 'Forma irregular' }
      ],
      vegetal: [
        { id: '1', left: 'Cloroplasto', right: 'Fotossíntese' },
        { id: '2', left: 'Parede celular', right: 'Celulose' },
        { id: '3', left: 'Vacúolo central', right: 'Grande reservatório' },
        { id: '4', left: 'Amido', right: 'Reserva energética' },
        { id: '5', left: 'Plasmodesmos', right: 'Conexão entre células' }
      ]
    },
    _swipeItems: {
      procariontes: {
        items: [
          { content: 'Bactéria', category: 'left' as const, categoryLabel: 'Procarionte' },
          { content: 'Fungo', category: 'right' as const, categoryLabel: 'Eucarionte' },
          { content: 'Arqueia', category: 'left' as const, categoryLabel: 'Procarionte' },
          { content: 'Protozoário', category: 'right' as const, categoryLabel: 'Eucarionte' },
          { content: 'Cianobactéria', category: 'left' as const, categoryLabel: 'Procarionte' },
          { content: 'Planta', category: 'right' as const, categoryLabel: 'Eucarionte' }
        ],
        categories: { left: 'Procarionte', right: 'Eucarionte' }
      },
      animal: {
        items: [
          { content: 'Centríolo', category: 'left' as const, categoryLabel: 'Animal' },
          { content: 'Cloroplasto', category: 'right' as const, categoryLabel: 'Vegetal' },
          { content: 'Lisossomo grande', category: 'left' as const, categoryLabel: 'Animal' },
          { content: 'Parede celular', category: 'right' as const, categoryLabel: 'Vegetal' },
          { content: 'Glicogênio', category: 'left' as const, categoryLabel: 'Animal' },
          { content: 'Vacúolo central', category: 'right' as const, categoryLabel: 'Vegetal' }
        ],
        categories: { left: 'Célula Animal', right: 'Célula Vegetal' }
      },
      transporte: {
        items: [
          { content: 'Difusão', category: 'left' as const, categoryLabel: 'Passivo' },
          { content: 'Bomba Na+/K+', category: 'right' as const, categoryLabel: 'Ativo' },
          { content: 'Osmose', category: 'left' as const, categoryLabel: 'Passivo' },
          { content: 'Endocitose', category: 'right' as const, categoryLabel: 'Ativo' },
          { content: 'Difusão facilitada', category: 'left' as const, categoryLabel: 'Passivo' },
          { content: 'Exocitose', category: 'right' as const, categoryLabel: 'Ativo' }
        ],
        categories: { left: 'Transporte Passivo', right: 'Transporte Ativo' }
      }
    },
    _bubblePopItems: {
      hooke: [
        { content: 'Célula', isCorrect: true },
        { content: 'Cortiça', isCorrect: true },
        { content: 'Micrographia', isCorrect: true },
        { content: 'Televisão', isCorrect: false },
        { content: '1665', isCorrect: true },
        { content: 'Avião', isCorrect: false },
        { content: 'Microscópio', isCorrect: true },
        { content: 'Computador', isCorrect: false }
      ],
      eucariontes: [
        { content: 'Núcleo', isCorrect: true },
        { content: 'Mitocôndria', isCorrect: true },
        { content: 'Golgi', isCorrect: true },
        { content: 'Nucleoide', isCorrect: false },
        { content: 'Carioteca', isCorrect: true },
        { content: 'Parede de peptidoglicano', isCorrect: false },
        { content: 'Retículo', isCorrect: true },
        { content: 'Plasmídeo', isCorrect: false }
      ],
      mitocondria: [
        { content: 'ATP', isCorrect: true },
        { content: 'Cristas', isCorrect: true },
        { content: 'Respiração', isCorrect: true },
        { content: 'Clorofila', isCorrect: false },
        { content: 'Matriz', isCorrect: true },
        { content: 'Fotossíntese', isCorrect: false },
        { content: 'Energia', isCorrect: true },
        { content: 'Glicose', isCorrect: false }
      ]
    },
    _targetShooterItems: {
      lisossomo: [
        { content: 'Resíduo', isCorrect: true },
        { content: 'Toxina', isCorrect: true },
        { content: 'Núcleo', isCorrect: false },
        { content: 'Bactéria', isCorrect: true },
        { content: 'DNA', isCorrect: false },
        { content: 'Lixo', isCorrect: true },
        { content: 'Mitocôndria', isCorrect: false },
        { content: 'Vírus', isCorrect: true }
      ],
      membrana: [
        { content: 'Fosfolipídio', isCorrect: true },
        { content: 'Colesterol', isCorrect: true },
        { content: 'DNA', isCorrect: false },
        { content: 'Proteína', isCorrect: true },
        { content: 'Ribossomo', isCorrect: false },
        { content: 'Glicocálix', isCorrect: true },
        { content: 'Cromossomo', isCorrect: false },
        { content: 'Canal iônico', isCorrect: true }
      ]
    }
  }

  // Selecionar dados baseado no tema
  const data = themeData[theme] || {}
  
  // Selecionar perguntas diferentes baseado no indice do minigame
  if (data.quizQuestions && minigameIndex > 0) {
    // Embaralhar perguntas para cada minigame ser diferente
    const shuffled = [...data.quizQuestions].sort(() => Math.random() - 0.5)
    data.quizQuestions = shuffled.slice(0, 5)
  }

  return { ...data, themeData }
}

export function MinigameRunner({ phase, minigame, minigameIndex, onComplete, onClose, difficulty = 'normal' }: MinigameRunnerProps) {
  const data = useMemo(() => getMinigameData(phase, minigame, minigameIndex), [phase, minigame, minigameIndex])
  const theme = phase.theme.toLowerCase()
  
  // Ajustar config baseado na dificuldade do jogo
  const adjustedConfig = useMemo(() => adjustConfigForDifficulty(minigame, difficulty), [minigame, difficulty])

// Renderizar o minigame correto baseado no tipo
  switch (minigame.type) {
  case 'memory':
  return (
  <MemoryGame
  config={adjustedConfig}
          pairs={data.memoryPairs || [
            { id: '1', item1: 'Célula', item2: 'Unidade da vida' },
            { id: '2', item1: 'Núcleo', item2: 'Guarda o DNA' },
            { id: '3', item1: 'Mitocôndria', item2: 'Produz energia' },
            { id: '4', item1: 'Ribossomo', item2: 'Faz proteínas' },
            { id: '5', item1: 'Golgi', item2: 'Empacota proteínas' },
            { id: '6', item1: 'Lisossomo', item2: 'Faz digestão' }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

case 'tap-correct':
  case 'avoid-wrong':
  case 'reflex':
  case 'catch-items':
  case 'destroy-trash':
  return (
  <TapGame
  config={adjustedConfig}
          items={data.tapItems || [
            { content: 'Celula', isCorrect: true },
            { content: 'Pedra', isCorrect: false },
            { content: 'Nucleo', isCorrect: true },
            { content: 'Carro', isCorrect: false },
            { content: 'Mitocondria', isCorrect: true },
            { content: 'Mesa', isCorrect: false }
          ]}
          avoidMode={false}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'avoid-wrong':
    case 'destroy-trash':
      return (
        <TapGame
          config={minigame}
          items={data.tapItems || [
            { content: 'Residuo celular', isCorrect: true },
            { content: 'Nucleo', isCorrect: false },
            { content: 'Proteina danificada', isCorrect: true },
            { content: 'Mitocondria saudavel', isCorrect: false },
            { content: 'Lixo metabolico', isCorrect: true },
            { content: 'DNA intacto', isCorrect: false }
          ]}
          avoidMode={true}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'catch-items':
case 'collect-falling':
  case 'match-pairs':
  case 'build-cell':
  case 'drag-category':
  return (
  <CollectGame
  config={adjustedConfig}
          items={data.collectItems || data.tapItems || [
            { content: 'Nutriente', isCorrect: true },
            { content: 'Toxina', isCorrect: false },
            { content: 'Vitamina', isCorrect: true },
            { content: 'Veneno', isCorrect: false },
            { content: 'Proteina', isCorrect: true },
            { content: 'Lixo', isCorrect: false }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'timeline':
    case 'sequence':
      return (
        <SequenceGame
          config={adjustedConfig}
          items={data.sequenceItems || [
            { content: 'Primeira etapa do processo', order: 0 },
            { content: 'Segunda etapa do processo', order: 1 },
            { content: 'Terceira etapa do processo', order: 2 },
            { content: 'Quarta etapa do processo', order: 3 },
            { content: 'Etapa final', order: 4 }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'clicker':
    case 'combo':
    case 'energy-bar':
      return (
        <ClickerGame
          config={adjustedConfig}
          theme={data.clickerTheme || 'energy'}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'quiz-arcade':
    case 'speed-combo':
    case 'timer-challenge':
      return (
        <QuizArcade
          config={adjustedConfig}
          questions={data.quizQuestions || [
            { question: 'Qual a unidade basica da vida?', options: ['Atomo', 'Celula', 'Tecido', 'Orgao'], correctIndex: 1 },
            { question: 'Mitocondrias produzem:', options: ['Proteinas', 'ATP', 'Lipidios', 'DNA'], correctIndex: 1 },
            { question: 'Onde fica o DNA?', options: ['Citoplasma', 'Nucleo', 'Ribossomo', 'Golgi'], correctIndex: 1 },
            { question: 'Ribossomos fazem:', options: ['Energia', 'Proteinas', 'Lipidios', 'Acucares'], correctIndex: 1 },
            { question: 'A fotossintese ocorre no:', options: ['Nucleo', 'Mitocondria', 'Cloroplasto', 'Lisossomo'], correctIndex: 2 }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'boss-battle':
      return (
        <BossBattle
          config={adjustedConfig}
          bossName="Fragmento"
          attacks={data.bossAttacks || data.themeData?.boss?.bossAttacks || [
            { question: 'O que e uma celula?', options: ['Unidade da vida', 'Uma pedra', 'Um carro', 'Uma casa'], correctIndex: 0, damage: 15 },
            { question: 'Quem produz ATP?', options: ['Nucleo', 'Mitocondria', 'Golgi', 'Lisossomo'], correctIndex: 1, damage: 15 },
            { question: 'Onde fica o DNA?', options: ['Citoplasma', 'Nucleo', 'Membrana', 'Fora da celula'], correctIndex: 1, damage: 15 }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    // Novos minigames
    case 'word-scramble':
      return (
        <WordScrambleGame
          config={adjustedConfig}
          words={data.themeData?._wordScramble?.[theme] || [
            { word: 'CÉLULA', hint: 'Unidade básica da vida' },
            { word: 'NÚCLEO', hint: 'Guarda o DNA da célula' },
            { word: 'MITOCÔNDRIA', hint: 'Produz energia (ATP)' },
            { word: 'RIBOSSOMO', hint: 'Fabrica proteínas' }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'reaction-time':
      return (
        <ReactionGame
          config={adjustedConfig}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'bubble-pop':
    case 'who-am-i':
    case 'spot-difference':
      return (
        <BubblePopGame
          config={adjustedConfig}
          items={data.themeData?._bubblePopItems?.[theme] || data.tapItems || [
            { content: 'Célula', isCorrect: true },
            { content: 'Núcleo', isCorrect: true },
            { content: 'Pedra', isCorrect: false },
            { content: 'Mitocôndria', isCorrect: true },
            { content: 'Carro', isCorrect: false },
            { content: 'Ribossomo', isCorrect: true },
            { content: 'Mesa', isCorrect: false },
            { content: 'Golgi', isCorrect: true }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'simon-says':
    case 'survival':
      return (
        <SimonSaysGame
          config={adjustedConfig}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'target-shooter':
    case 'target-moving':
      return (
        <TargetShooterGame
          config={adjustedConfig}
          targets={data.themeData?._targetShooterItems?.[theme] || data.tapItems || [
            { content: 'Célula', isCorrect: true },
            { content: 'Vírus', isCorrect: false },
            { content: 'Núcleo', isCorrect: true },
            { content: 'Toxina', isCorrect: false },
            { content: 'ATP', isCorrect: true },
            { content: 'Lixo', isCorrect: false }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'typing-speed':
    case 'zoom-match':
      return (
        <TypingGame
          config={adjustedConfig}
          words={data.themeData?._typingWords?.[theme] || [
            { word: 'célula', definition: 'Unidade básica dos seres vivos' },
            { word: 'núcleo', definition: 'Estrutura que guarda o DNA' },
            { word: 'mitocôndria', definition: 'Organela que produz ATP' },
            { word: 'ribossomo', definition: 'Estrutura que faz proteínas' }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'swipe-category':
    case 'direction':
    case 'path-choice':
      return (
        <SwipeGame
          config={adjustedConfig}
          items={data.themeData?._swipeItems?.[theme]?.items || [
            { content: 'Bactéria', category: 'left' as const, categoryLabel: 'Procarionte' },
            { content: 'Fungo', category: 'right' as const, categoryLabel: 'Eucarionte' },
            { content: 'Arqueia', category: 'left' as const, categoryLabel: 'Procarionte' },
            { content: 'Protozoário', category: 'right' as const, categoryLabel: 'Eucarionte' },
            { content: 'E. coli', category: 'left' as const, categoryLabel: 'Procarionte' },
            { content: 'Ameba', category: 'right' as const, categoryLabel: 'Eucarionte' }
          ]}
          categories={data.themeData?._swipeItems?.[theme]?.categories || { left: 'Procarionte', right: 'Eucarionte' }}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'path-connect':
    case 'puzzle':
      return (
        <PathConnectGame
          config={adjustedConfig}
          pairs={data.themeData?._pathConnectPairs?.[theme] || data.memoryPairs?.map((p: { id: string; item1: string; item2: string }) => ({ id: p.id, left: p.item1, right: p.item2 })) || [
            { id: '1', left: 'Célula', right: 'Unidade da vida' },
            { id: '2', left: 'Núcleo', right: 'Guarda o DNA' },
            { id: '3', left: 'Mitocôndria', right: 'Produz ATP' },
            { id: '4', left: 'Ribossomo', right: 'Faz proteínas' },
            { id: '5', left: 'Golgi', right: 'Empacota proteínas' }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'catch-sequence':
    case 'timeline':
      return (
        <CatchSequenceGame
          config={adjustedConfig}
          items={[
            { content: 'DNA no núcleo', order: 1 },
            { content: 'Transcrição', order: 2 },
            { content: 'mRNA formado', order: 3 },
            { content: 'mRNA sai do núcleo', order: 4 },
            { content: 'Tradução no ribossomo', order: 5 },
            { content: 'Proteína formada', order: 6 }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'true-false-rush':
    case 'speed-combo':
    case 'combo':
      return (
        <TrueFalseRushGame
          config={adjustedConfig}
          statements={[
            { text: 'A mitocôndria produz ATP.', isTrue: true, explanation: 'A mitocôndria é conhecida como a "usina de energia" da célula.' },
            { text: 'Células procariontes têm núcleo definido.', isTrue: false, explanation: 'Procariontes não possuem carioteca (membrana nuclear).' },
            { text: 'O Complexo de Golgi empacota proteínas.', isTrue: true, explanation: 'O Golgi modifica e empacota proteínas para exportação.' },
            { text: 'Lisossomos fazem fotossíntese.', isTrue: false, explanation: 'Lisossomos fazem digestão celular. Cloroplastos fazem fotossíntese.' },
            { text: 'O DNA fica no núcleo em eucariontes.', isTrue: true, explanation: 'Em células eucariontes, o DNA é protegido pela carioteca.' },
            { text: 'Ribossomos produzem energia.', isTrue: false, explanation: 'Ribossomos produzem proteínas. Mitocôndrias produzem energia.' },
            { text: 'A membrana plasmática é semipermeável.', isTrue: true, explanation: 'A membrana controla a entrada e saída de substâncias.' },
            { text: 'Bactérias são eucariontes.', isTrue: false, explanation: 'Bactérias são procariontes - não têm núcleo definido.' },
            { text: 'O retículo endoplasmático rugoso tem ribossomos.', isTrue: true, explanation: 'Os ribossomos dão a aparência "rugosa" ao RER.' },
            { text: 'Células vegetais não têm mitocôndrias.', isTrue: false, explanation: 'Células vegetais têm mitocôndrias E cloroplastos.' }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'falling-letters':
      return (
        <FallingLettersGame
          config={adjustedConfig}
          words={[
            { word: 'CÉLULA', hint: 'Unidade básica da vida' },
            { word: 'NÚCLEO', hint: 'Guarda o material genético' },
            { word: 'MITOCÔNDRIA', hint: 'Produz energia (ATP)' },
            { word: 'RIBOSSOMO', hint: 'Fabrica proteínas' },
            { word: 'GOLGI', hint: 'Empacota substâncias' },
            { word: 'LISOSSOMO', hint: 'Digestão celular' }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'color-match':
      return (
        <ColorMatchGame
          config={adjustedConfig}
          items={[
            { content: 'Bactéria', category: 'Procarionte' },
            { content: 'Fungo', category: 'Eucarionte' },
            { content: 'Arqueia', category: 'Procarionte' },
            { content: 'Protozoário', category: 'Eucarionte' },
            { content: 'Cianobactéria', category: 'Procarionte' },
            { content: 'Ameba', category: 'Eucarionte' },
            { content: 'E. coli', category: 'Procarionte' },
            { content: 'Célula vegetal', category: 'Eucarionte' }
          ]}
          categories={[
            { name: 'Procarionte', color: 'red' },
            { name: 'Eucarionte', color: 'blue' }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'whack-a-mole':
      return (
        <WhackAMoleGame
          config={adjustedConfig}
          items={data.tapItems || [
            { content: 'Célula', isCorrect: true },
            { content: 'Pedra', isCorrect: false },
            { content: 'Núcleo', isCorrect: true },
            { content: 'Carro', isCorrect: false },
            { content: 'Mitocôndria', isCorrect: true },
            { content: 'Mesa', isCorrect: false },
            { content: 'Ribossomo', isCorrect: true },
            { content: 'Televisão', isCorrect: false }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'slider-puzzle':
      return (
        <SliderPuzzleGame
          config={adjustedConfig}
          concepts={[
            { term: 'CÉLULA', definition: 'Unidade básica da vida' },
            { term: 'ATP', definition: 'Moeda energética da célula' },
            { term: 'DNA', definition: 'Material genético' },
            { term: 'RNA', definition: 'Copia a informação do DNA' },
            { term: 'GOLGI', definition: 'Empacota e distribui' }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'rhythm-tap':
      return (
        <RhythmTapGame
          config={adjustedConfig}
          questions={[
            { question: 'Organela que produz ATP:', answer: 'MITOCONDRIA' },
            { question: 'Estrutura que guarda o DNA:', answer: 'NUCLEO' },
            { question: 'Unidade básica da vida:', answer: 'CELULA' },
            { question: 'Faz a digestão celular:', answer: 'LISOSSOMO' },
            { question: 'Fabrica proteínas:', answer: 'RIBOSSOMO' }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    // Novos minigames tematicos de citologia
    case 'cyto-wordle':
      return (
        <CytoWordleGame
          config={adjustedConfig}
          words={data.cytoWordleWords || [
            { word: 'CELULA', hint: 'Unidade basica da vida', category: 'Conceitos' },
            { word: 'NUCLEO', hint: 'Onde fica o DNA', category: 'Organelas' },
            { word: 'GOLGI', hint: 'Empacota proteinas', category: 'Organelas' },
            { word: 'CRISTA', hint: 'Dobra da mitocondria', category: 'Estruturas' },
            { word: 'LISOSSOMO', hint: 'Digestao celular', category: 'Organelas' }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'cell-builder':
      return (
        <CellBuilderGame
          config={adjustedConfig}
          cellType={data.cellType || 'animal'}
          organelles={data.cellOrganelles || [
            { id: '1', name: 'Nucleo', description: 'Centro de comando da celula', correctZone: 'centro' },
            { id: '2', name: 'Mitocondria', description: 'Produz energia (ATP)', correctZone: 'citoplasma' },
            { id: '3', name: 'Ribossomo', description: 'Fabrica proteinas', correctZone: 'reticulo' },
            { id: '4', name: 'Golgi', description: 'Empacota substancias', correctZone: 'periferia' },
            { id: '5', name: 'Lisossomo', description: 'Digestao celular', correctZone: 'citoplasma' },
            { id: '6', name: 'Reticulo', description: 'Transporte interno', correctZone: 'ao-redor-nucleo' }
          ]}
          dropZones={data.cellDropZones || [
            { id: 'centro', label: 'Centro', description: 'Regiao central', x: 50, y: 50, width: 25, height: 25 },
            { id: 'citoplasma', label: 'Citoplasma', description: 'Regiao citoplasmática', x: 30, y: 35, width: 20, height: 20 },
            { id: 'reticulo', label: 'Reticulo', description: 'Proximo ao nucleo', x: 70, y: 40, width: 18, height: 18 },
            { id: 'periferia', label: 'Periferia', description: 'Proximo a membrana', x: 25, y: 70, width: 20, height: 18 },
            { id: 'ao-redor-nucleo', label: 'Ao redor do nucleo', description: 'Envolve o nucleo', x: 65, y: 65, width: 20, height: 18 }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'organelle-quiz':
      return (
        <OrganelleQuizGame
          config={adjustedConfig}
          questions={data.organelleQuizQuestions || [
            { question: 'Qual organela e conhecida como a "usina de energia" da celula?', options: ['Nucleo', 'Mitocondria', 'Ribossomo', 'Golgi'], correctIndex: 1, explanation: 'A mitocondria realiza a respiracao celular e produz ATP.', category: 'Energia' },
            { question: 'O que a carioteca protege?', options: ['Citoplasma', 'Material genetico', 'Proteinas', 'Lipidios'], correctIndex: 1, explanation: 'A carioteca e a membrana nuclear que protege o DNA.', category: 'Nucleo' },
            { question: 'Qual organela faz a digestao celular?', options: ['Ribossomo', 'Golgi', 'Lisossomo', 'Reticulo'], correctIndex: 2, explanation: 'Lisossomos contem enzimas que digerem materiais.', category: 'Digestao' },
            { question: 'Onde ocorre a fotossintese?', options: ['Mitocondria', 'Nucleo', 'Cloroplasto', 'Vacuolo'], correctIndex: 2, explanation: 'Cloroplastos captam luz e fazem fotossintese.', category: 'Plantas' },
            { question: 'O que os ribossomos produzem?', options: ['ATP', 'Proteinas', 'Lipidios', 'Carboidratos'], correctIndex: 1, explanation: 'Ribossomos traduzem mRNA em proteinas.', category: 'Sintese' }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'cell-memory':
      return (
        <CellMemoryGame
          config={adjustedConfig}
          pairs={data.cellMemoryPairs || [
            { id: '1', term: 'Mitocondria', match: 'Produz ATP', category: 'Energia' },
            { id: '2', term: 'Nucleo', match: 'Guarda o DNA', category: 'Genetica' },
            { id: '3', term: 'Ribossomo', match: 'Faz proteinas', category: 'Sintese' },
            { id: '4', term: 'Golgi', match: 'Empacota substancias', category: 'Transporte' },
            { id: '5', term: 'Lisossomo', match: 'Digestao celular', category: 'Digestao' },
            { id: '6', term: 'Cloroplasto', match: 'Fotossintese', category: 'Plantas' }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'function-match':
      return (
        <FunctionMatchGame
          config={adjustedConfig}
          pairs={data.functionMatchPairs || [
            { id: '1', organelle: 'Mitocondria', function: 'Respiracao celular', category: 'Energia' },
            { id: '2', organelle: 'Nucleo', function: 'Armazenar DNA', category: 'Genetica' },
            { id: '3', organelle: 'Ribossomo', function: 'Sintese de proteinas', category: 'Sintese' },
            { id: '4', organelle: 'Lisossomo', function: 'Digestao intracelular', category: 'Digestao' },
            { id: '5', organelle: 'Golgi', function: 'Modificar e empacotar', category: 'Transporte' },
            { id: '6', organelle: 'Reticulo liso', function: 'Sintese de lipidios', category: 'Sintese' }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    case 'bio-word-search':
      return (
        <BioWordSearchGame
          config={adjustedConfig}
          words={data.bioWordSearchWords || [
            { word: 'CELULA', hint: 'Unidade basica da vida', category: 'Conceitos' },
            { word: 'NUCLEO', hint: 'Onde fica o DNA', category: 'Organelas' },
            { word: 'ATP', hint: 'Moeda energetica', category: 'Moleculas' },
            { word: 'GOLGI', hint: 'Empacota proteinas', category: 'Organelas' },
            { word: 'DNA', hint: 'Material genetico', category: 'Moleculas' },
            { word: 'RNA', hint: 'Copia do DNA', category: 'Moleculas' }
          ]}
          gridSize={10}
          onComplete={onComplete}
          onClose={onClose}
        />
      )

    default:
      // Fallback para quiz arcade
      return (
        <QuizArcade
          config={adjustedConfig}
          questions={data.quizQuestions || [
            { question: 'Qual a unidade basica da vida?', options: ['Atomo', 'Celula', 'Tecido', 'Orgao'], correctIndex: 1 },
            { question: 'Mitocondrias produzem:', options: ['Proteinas', 'ATP', 'Lipidios', 'DNA'], correctIndex: 1 },
            { question: 'Onde fica o DNA?', options: ['Citoplasma', 'Nucleo', 'Ribossomo', 'Golgi'], correctIndex: 1 },
            { question: 'Ribossomos fazem:', options: ['Energia', 'Proteinas', 'Lipidios', 'Acucares'], correctIndex: 1 },
            { question: 'A fotossintese ocorre no:', options: ['Nucleo', 'Mitocondria', 'Cloroplasto', 'Lisossomo'], correctIndex: 2 }
          ]}
          onComplete={onComplete}
          onClose={onClose}
        />
      )
  }
}
