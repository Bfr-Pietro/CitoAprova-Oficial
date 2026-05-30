import type { Phase, Block } from './minigame-types'

export const BLOCKS: Block[] = [
  {
    id: 1,
    name: 'Descoberta da Célula',
    theme: 'historia',
    description: 'A jornada dos cientistas que descobriram o mundo microscópico',
    icon: 'microscope',
    color: 'from-emerald-500 to-teal-500',
    phases: [1, 2, 3]
  },
  {
    id: 2,
    name: 'Tipos de Célula',
    theme: 'tipos',
    description: 'Procariontes vs Eucariontes - as diferenças fundamentais',
    icon: 'cells',
    color: 'from-blue-500 to-cyan-500',
    phases: [4, 5, 6]
  },
  {
    id: 3,
    name: 'Organelas',
    theme: 'organelas',
    description: 'As pequenas fábricas dentro das células',
    icon: 'factory',
    color: 'from-purple-500 to-pink-500',
    phases: [7, 8, 9]
  },
  {
    id: 4,
    name: 'Animal vs Vegetal',
    theme: 'comparacao',
    description: 'As diferenças entre células animais e vegetais',
    icon: 'leaf',
    color: 'from-green-500 to-lime-500',
    phases: [10, 11, 12]
  },
  {
    id: 5,
    name: 'Membrana Plasmática',
    theme: 'membrana',
    description: 'A barreira que protege a célula',
    icon: 'shield',
    color: 'from-amber-500 to-orange-500',
    phases: [13, 14, 15, 16]
  },
  {
    id: 6,
    name: 'Transporte Celular',
    theme: 'transporte',
    description: 'Como as substâncias entram e saem das células',
    icon: 'truck',
    color: 'from-indigo-500 to-violet-500',
    phases: [17, 18, 19, 20]
  },
  {
    id: 7,
    name: 'Síntese de Proteínas',
    theme: 'sintese',
    description: 'A fábrica de proteínas da célula',
    icon: 'factory',
    color: 'from-rose-500 to-red-500',
    phases: [21, 22, 23, 24]
  },
  {
    id: 8,
    name: 'Energia Celular',
    theme: 'energia',
    description: 'Respiração celular e produção de ATP',
    icon: 'zap',
    color: 'from-yellow-500 to-amber-500',
    phases: [25, 26, 27]
  },
  {
    id: 9,
    name: 'Desafio Final',
    theme: 'boss',
    description: 'Enfrente o Fragmento e salve a célula!',
    icon: 'skull',
    color: 'from-slate-600 to-slate-800',
    phases: [28, 29, 30]
  }
]

export const PHASES: Phase[] = [
  // BLOCO 1 - Descoberta da Célula
  {
    id: 1,
    blockId: 1,
    blockName: 'Descoberta da Célula',
    title: 'Robert Hooke',
    theme: 'Hooke',
    description: 'O cientista que nomeou as células',
    icon: 'microscope',
    color: 'from-emerald-400 to-emerald-600',
    isUnlocked: true,
    educationalContent: {
      title: 'Robert Hooke (1665)',
      facts: [
        'Observou células de cortiça ao microscópio',
        'Foi o primeiro a usar o termo "célula"',
        'Publicou suas descobertas no livro Micrographia'
      ]
    },
    minigames: [
      { type: 'memory', title: 'Memória Científica', description: 'Combine cientistas com suas descobertas', timeLimit: 70, targetScore: 100, difficulty: 1 },
      { type: 'word-scramble', title: 'Embaralha Ciência', description: 'Descubra as palavras embaralhadas', timeLimit: 60, targetScore: 80, difficulty: 1 },
      { type: 'bubble-pop', title: 'Bolhas do Conhecimento', description: 'Estoure as bolhas com termos corretos!', timeLimit: 45, targetScore: 90, difficulty: 1 }
    ]
  },
  {
    id: 2,
    blockId: 1,
    blockName: 'Descoberta da Célula',
    title: 'Leeuwenhoek',
    theme: 'Leeuwenhoek',
    description: 'O pai da microbiologia',
    icon: 'eye',
    color: 'from-teal-400 to-teal-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Anton van Leeuwenhoek (1674)',
      facts: [
        'Construiu microscópios com lentes de alta qualidade',
        'Descobriu microorganismos que chamou de "animálculos"',
        'Primeiro a observar bactérias e protozoários'
      ]
    },
    minigames: [
      { type: 'reaction-time', title: 'Reflexos de Cientista', description: 'Teste seus reflexos como um pesquisador!', timeLimit: 50, targetScore: 100, difficulty: 1 },
      { type: 'typing-speed', title: 'Digitação Científica', description: 'Digite os termos científicos rapidamente', timeLimit: 45, targetScore: 80, difficulty: 1 },
      { type: 'tap-correct', title: 'Caça ao Micróbio', description: 'Capture os microorganismos que aparecem', timeLimit: 40, targetScore: 100, difficulty: 1 }
    ]
  },
  {
    id: 3,
    blockId: 1,
    blockName: 'Descoberta da Célula',
    title: 'Teoria Celular',
    theme: 'Teoria',
    description: 'Os três pilares da teoria celular',
    icon: 'book',
    color: 'from-cyan-400 to-cyan-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Teoria Celular',
      facts: [
        'Todos os seres vivos são formados por células',
        'A célula é a unidade básica da vida',
        'Toda célula se origina de outra célula pré-existente'
      ]
    },
    minigames: [
      { type: 'sequence', title: 'Linha do Tempo', description: 'Organize os eventos na ordem correta', timeLimit: 60, targetScore: 100, difficulty: 1 },
      { type: 'path-connect', title: 'Conecte os Fatos', description: 'Ligue os cientistas às suas descobertas', timeLimit: 50, targetScore: 90, difficulty: 1 },
      { type: 'quiz-arcade', title: 'Quiz da Teoria', description: 'Responda rápido sobre a teoria celular!', timeLimit: 45, targetScore: 120, difficulty: 2 }
    ]
  },
  
  // BLOCO 2 - Tipos de Célula
  {
    id: 4,
    blockId: 2,
    blockName: 'Tipos de Célula',
    title: 'Procariontes',
    theme: 'Procariontes',
    description: 'Células simples sem núcleo definido',
    icon: 'circle',
    color: 'from-blue-400 to-blue-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Células Procariontes',
      facts: [
        'Não possuem núcleo organizado',
        'Material genético no citoplasma',
        'Bactérias e arqueias são procariontes'
      ]
    },
    minigames: [
      { type: 'swipe-category', title: 'Deslize e Classifique', description: 'Deslize para a categoria correta!', timeLimit: 50, targetScore: 100, difficulty: 2 },
      { type: 'word-scramble', title: 'Palavras Bacterianas', description: 'Desembaralhe termos sobre procariontes', timeLimit: 55, targetScore: 90, difficulty: 2 },
      { type: 'target-shooter', title: 'Caça às Bactérias', description: 'Mire e acerte os procariontes!', timeLimit: 45, targetScore: 100, difficulty: 2 }
    ]
  },
  {
    id: 5,
    blockId: 2,
    blockName: 'Tipos de Célula',
    title: 'Eucariontes',
    theme: 'Eucariontes',
    description: 'Células complexas com núcleo definido',
    icon: 'target',
    color: 'from-indigo-400 to-indigo-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Células Eucariontes',
      facts: [
        'Possuem núcleo organizado com membrana',
        'Têm diversas organelas membranosas',
        'Animais, plantas, fungos e protistas'
      ]
    },
    minigames: [
      { type: 'bubble-pop', title: 'Bolhas Eucariontes', description: 'Estoure as bolhas com organelas corretas!', timeLimit: 45, targetScore: 100, difficulty: 2 },
      { type: 'simon-says', title: 'Simon Diz: Organelas', description: 'Repita a sequência de cores!', timeLimit: 60, targetScore: 120, difficulty: 2 },
      { type: 'collect-falling', title: 'Colete Organelas', description: 'Pegue as organelas que caem', timeLimit: 45, targetScore: 110, difficulty: 2 }
    ]
  },
  {
    id: 6,
    blockId: 2,
    blockName: 'Tipos de Célula',
    title: 'Diferenças',
    theme: 'Comparacao',
    description: 'Comparando procariontes e eucariontes',
    icon: 'split',
    color: 'from-violet-400 to-violet-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Diferenças Principais',
      facts: [
        'Tamanho: eucariontes são maiores',
        'Complexidade: eucariontes têm mais organelas',
        'Núcleo: ausente em procariontes'
      ]
    },
    minigames: [
      { type: 'path-connect', title: 'Conecte as Diferenças', description: 'Ligue cada tipo às suas características', timeLimit: 50, targetScore: 100, difficulty: 2 },
      { type: 'reaction-time', title: 'Reflexo Celular', description: 'Reaja rápido às comparações!', timeLimit: 45, targetScore: 110, difficulty: 2 },
      { type: 'swipe-category', title: 'Pro ou Eu?', description: 'Classifique rapidamente cada célula!', timeLimit: 40, targetScore: 130, difficulty: 2 }
    ]
  },
  
  // BLOCO 3 - Organelas
  {
    id: 7,
    blockId: 3,
    blockName: 'Organelas',
    title: 'Mitocôndria',
    theme: 'Mitocondria',
    description: 'A usina de energia da célula',
    icon: 'battery',
    color: 'from-orange-400 to-orange-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Mitocôndria',
      facts: [
        'Produz energia na forma de ATP',
        'Realiza a respiração celular',
        'Possui DNA próprio'
      ]
    },
    minigames: [
      { type: 'clicker', title: 'Gerador de ATP', description: 'Clique freneticamente para gerar energia!', timeLimit: 35, targetScore: 200, difficulty: 2 },
      { type: 'word-scramble', title: 'Energia em Palavras', description: 'Desembaralhe termos energéticos', timeLimit: 50, targetScore: 90, difficulty: 2 },
      { type: 'bubble-pop', title: 'Bolhas de Energia', description: 'Estoure as bolhas de ATP!', timeLimit: 40, targetScore: 120, difficulty: 2 }
    ]
  },
  {
    id: 8,
    blockId: 3,
    blockName: 'Organelas',
    title: 'Lisossomo',
    theme: 'Lisossomo',
    description: 'O sistema de reciclagem celular',
    icon: 'trash',
    color: 'from-red-400 to-red-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Lisossomo',
      facts: [
        'Contém enzimas digestivas',
        'Degrada moléculas e organelas danificadas',
        'Atua na defesa da célula'
      ]
    },
    minigames: [
      { type: 'target-shooter', title: 'Destrua Resíduos', description: 'Mire e destrua os "lixos" celulares!', timeLimit: 40, targetScore: 120, difficulty: 2 },
      { type: 'reaction-time', title: 'Reflexo Digestivo', description: 'Reaja rápido para digerir!', timeLimit: 45, targetScore: 100, difficulty: 2 },
      { type: 'simon-says', title: 'Sequência de Digestão', description: 'Siga a ordem das enzimas!', timeLimit: 55, targetScore: 140, difficulty: 2 }
    ]
  },
  {
    id: 9,
    blockId: 3,
    blockName: 'Organelas',
    title: 'Cloroplasto',
    theme: 'Cloroplasto',
    description: 'A fábrica de açúcar das plantas',
    icon: 'sun',
    color: 'from-green-400 to-green-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Cloroplasto',
      facts: [
        'Realiza a fotossíntese',
        'Contém clorofila (pigmento verde)',
        'Transforma luz em energia química'
      ]
    },
    minigames: [
      { type: 'word-scramble', title: 'Palavras Verdes', description: 'Desembaralhe termos da fotossíntese', timeLimit: 55, targetScore: 100, difficulty: 2 },
      { type: 'collect-falling', title: 'Colete Luz Solar', description: 'Pegue os fótons de luz que caem!', timeLimit: 45, targetScore: 130, difficulty: 2 },
      { type: 'typing-speed', title: 'Digitação Vegetal', description: 'Digite termos sobre cloroplasto', timeLimit: 40, targetScore: 100, difficulty: 2 }
    ]
  },
  
  // BLOCO 4 - Animal vs Vegetal
  {
    id: 10,
    blockId: 4,
    blockName: 'Animal vs Vegetal',
    title: 'Célula Animal',
    theme: 'Animal',
    description: 'Estrutura da célula animal',
    icon: 'heart',
    color: 'from-pink-400 to-pink-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Célula Animal',
      facts: [
        'Não possui parede celular',
        'Possui centríolos',
        'Vacúolos pequenos'
      ]
    },
    minigames: [
      { type: 'path-connect', title: 'Conecte Estruturas', description: 'Ligue estruturas às suas funções', timeLimit: 50, targetScore: 100, difficulty: 2 },
      { type: 'bubble-pop', title: 'Bolhas Animais', description: 'Estoure bolhas com estruturas animais!', timeLimit: 40, targetScore: 110, difficulty: 2 },
      { type: 'reaction-time', title: 'Reflexo Animal', description: 'Reaja rápido como uma célula!', timeLimit: 45, targetScore: 120, difficulty: 2 }
    ]
  },
  {
    id: 11,
    blockId: 4,
    blockName: 'Animal vs Vegetal',
    title: 'Célula Vegetal',
    theme: 'Vegetal',
    description: 'Estrutura da célula vegetal',
    icon: 'leaf',
    color: 'from-lime-400 to-lime-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Célula Vegetal',
      facts: [
        'Possui parede celular de celulose',
        'Possui cloroplastos',
        'Vacúolo central grande'
      ]
    },
    minigames: [
      { type: 'path-connect', title: 'Conecte as Partes', description: 'Ligue organelas às funções vegetais', timeLimit: 50, targetScore: 100, difficulty: 2 },
      { type: 'word-scramble', title: 'Palavras Vegetais', description: 'Desembaralhe estruturas vegetais', timeLimit: 55, targetScore: 90, difficulty: 2 },
      { type: 'simon-says', title: 'Sequência Vegetal', description: 'Memorize a ordem das organelas!', timeLimit: 55, targetScore: 120, difficulty: 2 }
    ]
  },
  {
    id: 12,
    blockId: 4,
    blockName: 'Animal vs Vegetal',
    title: 'Comparação Final',
    theme: 'Comparacao',
    description: 'Animal vs Vegetal - duelo final',
    icon: 'swords',
    color: 'from-emerald-400 to-emerald-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Comparação Completa',
      facts: [
        'Ambas são eucariontes',
        'Vegetais: parede, cloroplasto, vacúolo grande',
        'Animais: centríolos, sem parede celular'
      ]
    },
    minigames: [
      { type: 'swipe-category', title: 'Animal ou Vegetal?', description: 'Deslize para a categoria correta!', timeLimit: 45, targetScore: 120, difficulty: 2 },
      { type: 'target-shooter', title: 'Mira Celular', description: 'Acerte as estruturas certas!', timeLimit: 40, targetScore: 130, difficulty: 3 },
      { type: 'quiz-arcade', title: 'Quiz Final', description: 'Teste seu conhecimento total!', timeLimit: 50, targetScore: 180, difficulty: 3 }
    ]
  },
  
  // BLOCO 5 - Membrana Plasmática
  {
    id: 13,
    blockId: 5,
    blockName: 'Membrana Plasmática',
    title: 'Estrutura da Membrana',
    theme: 'Estrutura',
    description: 'Bicamada lipídica e proteínas',
    icon: 'layers',
    color: 'from-amber-400 to-amber-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Estrutura da Membrana',
      facts: [
        'Formada por bicamada de fosfolipídios',
        'Proteínas integrais e periféricas',
        'Modelo mosaico fluido'
      ]
    },
    minigames: [
      { type: 'word-scramble', title: 'Palavras da Membrana', description: 'Desembaralhe termos membranosos', timeLimit: 55, targetScore: 100, difficulty: 2 },
      { type: 'target-shooter', title: 'Acerte na Membrana', description: 'Mire nos componentes corretos!', timeLimit: 45, targetScore: 110, difficulty: 2 },
      { type: 'path-connect', title: 'Conecte a Estrutura', description: 'Ligue partes da membrana!', timeLimit: 50, targetScore: 100, difficulty: 2 }
    ]
  },
  {
    id: 14,
    blockId: 5,
    blockName: 'Membrana Plasmática',
    title: 'Funções da Membrana',
    theme: 'Funcoes',
    description: 'Permeabilidade e comunicação',
    icon: 'radio',
    color: 'from-orange-400 to-orange-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Funções da Membrana',
      facts: [
        'Controla entrada e saída de substâncias',
        'Permite comunicação entre células',
        'Mantém a homeostase celular'
      ]
    },
    minigames: [
      { type: 'typing-speed', title: 'Digite Funções', description: 'Digite rapidamente as funções!', timeLimit: 45, targetScore: 100, difficulty: 2 },
      { type: 'reaction-time', title: 'Reflexo Membranoso', description: 'Reaja às funções da membrana!', timeLimit: 45, targetScore: 110, difficulty: 2 },
      { type: 'simon-says', title: 'Sequência Funcional', description: 'Memorize a ordem das funções!', timeLimit: 55, targetScore: 130, difficulty: 2 }
    ]
  },
  {
    id: 15,
    blockId: 5,
    blockName: 'Membrana Plasmática',
    title: 'Especializações',
    theme: 'Especializacoes',
    description: 'Microvilosidades e desmossomos',
    icon: 'puzzle',
    color: 'from-yellow-400 to-yellow-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Especializações da Membrana',
      facts: [
        'Microvilosidades aumentam absorção',
        'Desmossomos unem células',
        'Junções comunicantes permitem troca'
      ]
    },
    minigames: [
      { type: 'bubble-pop', title: 'Bolhas Especiais', description: 'Estoure as especializações corretas!', timeLimit: 45, targetScore: 110, difficulty: 2 },
      { type: 'swipe-category', title: 'Classifique Junções', description: 'Deslize para o tipo correto!', timeLimit: 45, targetScore: 100, difficulty: 3 },
      { type: 'quiz-arcade', title: 'Quiz Especializado', description: 'Teste suas especializações!', timeLimit: 40, targetScore: 130, difficulty: 3 }
    ]
  },
  {
    id: 16,
    blockId: 5,
    blockName: 'Membrana Plasmática',
    title: 'Desafio Membrana',
    theme: 'Desafio',
    description: 'Teste final sobre membrana',
    icon: 'trophy',
    color: 'from-red-400 to-red-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Revisão Completa',
      facts: [
        'A membrana é semipermeável',
        'Proteínas transportadoras facilitam passagem',
        'O glicocálix protege a célula'
      ]
    },
    minigames: [
      { type: 'target-shooter', title: 'Tiro Rápido', description: 'Acerte alvos em tempo recorde!', timeLimit: 35, targetScore: 140, difficulty: 3 },
      { type: 'simon-says', title: 'Memória Extrema', description: 'Sequência longa - concentre-se!', timeLimit: 50, targetScore: 160, difficulty: 3 },
      { type: 'reaction-time', title: 'Reflexos Finais', description: 'Prove seus reflexos máximos!', timeLimit: 45, targetScore: 150, difficulty: 3 }
    ]
  },
  
  // BLOCO 6 - Transporte Celular
  {
    id: 17,
    blockId: 6,
    blockName: 'Transporte Celular',
    title: 'Difusão',
    theme: 'Difusao',
    description: 'Movimento passivo de moléculas',
    icon: 'move',
    color: 'from-indigo-400 to-indigo-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Difusão',
      facts: [
        'Movimento do mais concentrado para o menos',
        'Não gasta energia',
        'Oxigênio entra por difusão simples'
      ]
    },
    minigames: [
      { type: 'swipe-category', title: 'Direção Molecular', description: 'Deslize para a direção correta!', timeLimit: 45, targetScore: 100, difficulty: 2 },
      { type: 'bubble-pop', title: 'Moléculas Difusoras', description: 'Estoure moléculas que difundem!', timeLimit: 40, targetScore: 110, difficulty: 2 },
      { type: 'typing-speed', title: 'Digitação Molecular', description: 'Digite termos sobre difusão!', timeLimit: 45, targetScore: 100, difficulty: 2 }
    ]
  },
  {
    id: 18,
    blockId: 6,
    blockName: 'Transporte Celular',
    title: 'Osmose',
    theme: 'Osmose',
    description: 'Transporte de água',
    icon: 'droplet',
    color: 'from-cyan-400 to-cyan-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Osmose',
      facts: [
        'Passagem de água pela membrana',
        'De hipotônico para hipertônico',
        'Regula volume da célula'
      ]
    },
    minigames: [
      { type: 'word-scramble', title: 'Palavras Aquáticas', description: 'Desembaralhe termos de osmose!', timeLimit: 55, targetScore: 100, difficulty: 2 },
      { type: 'simon-says', title: 'Sequência Osmótica', description: 'Memorize o fluxo de água!', timeLimit: 55, targetScore: 120, difficulty: 2 },
      { type: 'target-shooter', title: 'Mira Hídrica', description: 'Acerte moléculas de água!', timeLimit: 40, targetScore: 130, difficulty: 2 }
    ]
  },
  {
    id: 19,
    blockId: 6,
    blockName: 'Transporte Celular',
    title: 'Transporte Ativo',
    theme: 'Ativo',
    description: 'Movimento com gasto de energia',
    icon: 'zap',
    color: 'from-purple-400 to-purple-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Transporte Ativo',
      facts: [
        'Gasta energia (ATP)',
        'Contra o gradiente de concentração',
        'Bomba de sódio-potássio'
      ]
    },
    minigames: [
      { type: 'clicker', title: 'Bomba de ATP', description: 'Gere energia clicando freneticamente!', timeLimit: 35, targetScore: 180, difficulty: 3 },
      { type: 'reaction-time', title: 'Reflexo Energético', description: 'Reaja à demanda de energia!', timeLimit: 45, targetScore: 120, difficulty: 3 },
      { type: 'path-connect', title: 'Conecte a Bomba', description: 'Ligue íons ao transporte!', timeLimit: 45, targetScore: 100, difficulty: 3 }
    ]
  },
  {
    id: 20,
    blockId: 6,
    blockName: 'Transporte Celular',
    title: 'Revisão Transporte',
    theme: 'Revisao',
    description: 'Todos os tipos de transporte',
    icon: 'truck',
    color: 'from-violet-400 to-violet-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Revisão de Transporte',
      facts: [
        'Passivo: difusão e osmose (sem ATP)',
        'Ativo: com gasto de ATP',
        'Endocitose e exocitose: transporte em massa'
      ]
    },
    minigames: [
      { type: 'swipe-category', title: 'Passivo ou Ativo?', description: 'Classifique cada tipo rapidamente!', timeLimit: 40, targetScore: 130, difficulty: 3 },
      { type: 'quiz-arcade', title: 'Quiz de Transporte', description: 'Prove seu conhecimento!', timeLimit: 45, targetScore: 150, difficulty: 3 },
      { type: 'simon-says', title: 'Memória de Transporte', description: 'Sequência avançada - concentre-se!', timeLimit: 50, targetScore: 160, difficulty: 3 }
    ]
  },
  
  // BLOCO 7 - Síntese de Proteínas
  {
    id: 21,
    blockId: 7,
    blockName: 'Síntese de Proteínas',
    title: 'Transcrição',
    theme: 'Transcricao',
    description: 'Do DNA ao RNA',
    icon: 'file-text',
    color: 'from-rose-400 to-rose-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Transcrição',
      facts: [
        'Ocorre no núcleo',
        'DNA serve de molde para RNA',
        'RNA polimerase catalisa o processo'
      ]
    },
    minigames: [
      { type: 'sequence', title: 'Ordem da Transcrição', description: 'Organize as etapas corretamente!', timeLimit: 55, targetScore: 100, difficulty: 2 },
      { type: 'word-scramble', title: 'Código Genético', description: 'Desembaralhe termos genéticos!', timeLimit: 50, targetScore: 90, difficulty: 2 },
      { type: 'typing-speed', title: 'Digite o RNA', description: 'Transcreva digitando rapidamente!', timeLimit: 45, targetScore: 100, difficulty: 3 }
    ]
  },
  {
    id: 22,
    blockId: 7,
    blockName: 'Síntese de Proteínas',
    title: 'Tradução',
    theme: 'Traducao',
    description: 'Do RNA à proteína',
    icon: 'repeat',
    color: 'from-pink-400 to-pink-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Tradução',
      facts: [
        'Ocorre nos ribossomos',
        'mRNA é lido em códons (3 bases)',
        'tRNA traz aminoácidos'
      ]
    },
    minigames: [
      { type: 'path-connect', title: 'Códon-Aminoácido', description: 'Conecte códons aos aminoácidos!', timeLimit: 50, targetScore: 100, difficulty: 2 },
      { type: 'bubble-pop', title: 'Bolhas Proteicas', description: 'Estoure aminoácidos corretos!', timeLimit: 45, targetScore: 120, difficulty: 3 },
      { type: 'reaction-time', title: 'Reflexo Ribosomal', description: 'Reaja ao ciclo ribossômico!', timeLimit: 45, targetScore: 130, difficulty: 3 }
    ]
  },
  {
    id: 23,
    blockId: 7,
    blockName: 'Síntese de Proteínas',
    title: 'Golgi e RE',
    theme: 'Processamento',
    description: 'Processamento e empacotamento',
    icon: 'package',
    color: 'from-fuchsia-400 to-fuchsia-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Golgi e Retículo',
      facts: [
        'RE rugoso: síntese de proteínas de exportação',
        'Golgi: modifica, empacota e endereça',
        'Vesículas transportam os produtos'
      ]
    },
    minigames: [
      { type: 'swipe-category', title: 'RE ou Golgi?', description: 'Classifique as funções corretamente!', timeLimit: 45, targetScore: 110, difficulty: 3 },
      { type: 'target-shooter', title: 'Acerte Vesículas', description: 'Mire nas vesículas certas!', timeLimit: 40, targetScore: 130, difficulty: 3 },
      { type: 'simon-says', title: 'Via Secretória', description: 'Memorize a rota das proteínas!', timeLimit: 50, targetScore: 140, difficulty: 3 }
    ]
  },
  {
    id: 24,
    blockId: 7,
    blockName: 'Síntese de Proteínas',
    title: 'Fluxo Completo',
    theme: 'Fluxo',
    description: 'Do gene à proteína final',
    icon: 'git-branch',
    color: 'from-red-400 to-red-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Fluxo de Informação',
      facts: [
        'DNA -> RNA -> Proteína',
        'Dogma central da biologia molecular',
        'Regulação em cada etapa'
      ]
    },
    minigames: [
      { type: 'sequence', title: 'Dogma Central', description: 'Monte o fluxo genético completo!', timeLimit: 55, targetScore: 110, difficulty: 3 },
      { type: 'path-connect', title: 'Conecte o Fluxo', description: 'Ligue todas as etapas!', timeLimit: 50, targetScore: 120, difficulty: 3 },
      { type: 'quiz-arcade', title: 'Quiz do Dogma', description: 'Teste final sobre síntese!', timeLimit: 50, targetScore: 160, difficulty: 3 }
    ]
  },
  
  // BLOCO 8 - Energia Celular
  {
    id: 25,
    blockId: 8,
    blockName: 'Energia Celular',
    title: 'Glicólise',
    theme: 'Glicolise',
    description: 'Primeira etapa da respiração',
    icon: 'flame',
    color: 'from-yellow-400 to-yellow-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Glicólise',
      facts: [
        'Ocorre no citoplasma',
        'Glicose vira piruvato',
        'Produz 2 ATPs e 2 NADHs'
      ]
    },
    minigames: [
      { type: 'clicker', title: 'Usina de Glicose', description: 'Clique para quebrar glicose!', timeLimit: 35, targetScore: 200, difficulty: 2 },
      { type: 'word-scramble', title: 'Palavras Energéticas', description: 'Desembaralhe termos metabólicos!', timeLimit: 50, targetScore: 90, difficulty: 2 },
      { type: 'bubble-pop', title: 'Bolhas de Piruvato', description: 'Estoure os produtos corretos!', timeLimit: 40, targetScore: 120, difficulty: 3 }
    ]
  },
  {
    id: 26,
    blockId: 8,
    blockName: 'Energia Celular',
    title: 'Ciclo de Krebs',
    theme: 'Krebs',
    description: 'O ciclo do ácido cítrico',
    icon: 'refresh-cw',
    color: 'from-amber-400 to-amber-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Ciclo de Krebs',
      facts: [
        'Ocorre na matriz mitocondrial',
        'Libera CO2 e produz NADH e FADH2',
        'Gera 2 ATPs por ciclo completo'
      ]
    },
    minigames: [
      { type: 'sequence', title: 'Monte o Ciclo', description: 'Organize as etapas de Krebs!', timeLimit: 55, targetScore: 100, difficulty: 3 },
      { type: 'typing-speed', title: 'Digite Krebs', description: 'Transcreva os compostos!', timeLimit: 45, targetScore: 100, difficulty: 3 },
      { type: 'reaction-time', title: 'Ciclo Veloz', description: 'Reaja às etapas do ciclo!', timeLimit: 45, targetScore: 130, difficulty: 3 }
    ]
  },
  {
    id: 27,
    blockId: 8,
    blockName: 'Energia Celular',
    title: 'Cadeia Respiratória',
    theme: 'Cadeia',
    description: 'Produção massiva de ATP',
    icon: 'activity',
    color: 'from-orange-400 to-orange-600',
    isUnlocked: false,
    educationalContent: {
      title: 'Cadeia Respiratória',
      facts: [
        'Ocorre nas cristas mitocondriais',
        'Usa NADH e FADH2 para produzir ATP',
        'Gera até 34 ATPs'
      ]
    },
    minigames: [
      { type: 'clicker', title: 'Fábrica de ATP', description: 'Produza ATP freneticamente!', timeLimit: 35, targetScore: 220, difficulty: 3 },
      { type: 'target-shooter', title: 'Elétrons em Movimento', description: 'Acerte os elétrons corretos!', timeLimit: 40, targetScore: 150, difficulty: 3 },
      { type: 'simon-says', title: 'Cadeia de Cores', description: 'Memorize a sequência de complexos!', timeLimit: 50, targetScore: 160, difficulty: 3 }
    ]
  },
  
  // BLOCO 9 - Desafio Final
  {
    id: 28,
    blockId: 9,
    blockName: 'Desafio Final',
    title: 'Revisão Geral',
    theme: 'Revisao',
    description: 'Teste seus conhecimentos',
    icon: 'brain',
    color: 'from-slate-500 to-slate-700',
    isUnlocked: false,
    educationalContent: {
      title: 'Revisão Completa',
      facts: [
        'Célula é a unidade da vida',
        'Procariontes vs Eucariontes',
        'Organelas e suas funções'
      ]
    },
    minigames: [
      { type: 'quiz-arcade', title: 'Quiz Mestre', description: 'Perguntas de todo o conteúdo!', timeLimit: 55, targetScore: 150, difficulty: 3 },
      { type: 'word-scramble', title: 'Embaralha Final', description: 'Palavras de todos os temas!', timeLimit: 50, targetScore: 120, difficulty: 3 },
      { type: 'reaction-time', title: 'Reflexos Supremos', description: 'Teste seus reflexos máximos!', timeLimit: 45, targetScore: 140, difficulty: 3 }
    ]
  },
  {
    id: 29,
    blockId: 9,
    blockName: 'Desafio Final',
    title: 'Maratona',
    theme: 'Maratona',
    description: 'Todos os minigames juntos',
    icon: 'trophy',
    color: 'from-gray-600 to-gray-800',
    isUnlocked: false,
    educationalContent: {
      title: 'Maratona Celular',
      facts: [
        'Teste todos os conhecimentos',
        'Combine habilidades',
        'Prepare-se para o boss!'
      ]
    },
    minigames: [
      { type: 'simon-says', title: 'Memória Suprema', description: 'Sequência mais longa do jogo!', timeLimit: 70, targetScore: 200, difficulty: 3 },
      { type: 'target-shooter', title: 'Tiro ao Alvo Final', description: 'Precisão extrema exigida!', timeLimit: 50, targetScore: 180, difficulty: 3 },
      { type: 'typing-speed', title: 'Digitação Veloz', description: 'Digite todos os termos!', timeLimit: 55, targetScore: 150, difficulty: 3 }
    ]
  },
  {
    id: 30,
    blockId: 9,
    blockName: 'Desafio Final',
    title: 'BOSS: Fragmento',
    theme: 'Boss',
    description: 'Enfrente o vilão final!',
    icon: 'skull',
    color: 'from-red-600 to-red-900',
    isUnlocked: false,
    educationalContent: {
      title: 'Batalha Final',
      facts: [
        'O Fragmento quer destruir a célula',
        'Use seu conhecimento como arma',
        'Cada acerto causa dano ao boss'
      ]
    },
    minigames: [
      { type: 'boss-battle', title: 'Fase 1: Despertar', description: 'O Fragmento desperta!', timeLimit: 120, targetScore: 100, difficulty: 3 },
      { type: 'boss-battle', title: 'Fase 2: Fúria', description: 'Ataques mais rápidos!', timeLimit: 120, targetScore: 150, difficulty: 3 },
      { type: 'boss-battle', title: 'Fase 3: Confronto', description: 'Derrote o Fragmento de vez!', timeLimit: 180, targetScore: 200, difficulty: 3 }
    ]
  }
]

export function getPhaseById(id: number): Phase | undefined {
  return PHASES.find(p => p.id === id)
}

export function getBlockById(id: number): Block | undefined {
  return BLOCKS.find(b => b.id === id)
}

export function getPhasesByBlock(blockId: number): Phase[] {
  return PHASES.filter(p => p.blockId === blockId)
}

export function getNextPhase(currentPhaseId: number): Phase | undefined {
  const currentIndex = PHASES.findIndex(p => p.id === currentPhaseId)
  if (currentIndex >= 0 && currentIndex < PHASES.length - 1) {
    return PHASES[currentIndex + 1]
  }
  return undefined
}
