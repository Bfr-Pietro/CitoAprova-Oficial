// Sistema de narrativa do jogo CytoQuest
// 3 personagens principais:
// - Detetive (jogador): O protagonista que busca conhecimento
// - Dr. Cell: Mentor que ensina citologia
// - Fragmentado: Vilão que desafia e provoca o jogador

export interface StoryDialogue {
  speaker: 'detetive' | 'drCell' | 'fragmentado' | 'narrador' | 'info'
  text: string
  emotion?: 'neutral' | 'happy' | 'angry' | 'surprised' | 'thinking' | 'worried' | 'evil' | 'determined'
  infoBox?: {
    title: string
    content: string
    type: 'scientist' | 'concept' | 'curiosity' | 'important'
  }
}

export interface PhaseStory {
  phaseId: number
  title: string
  introduction: StoryDialogue[]  // Historia antes dos minigames
  villainChallenge: StoryDialogue[]  // Fragmentado desafiando antes do minigame
  conclusion: StoryDialogue[]  // Apos completar a fase
}

export const PHASE_STORIES: PhaseStory[] = [
  // ========================================
  // BLOCO 1 - DESCOBERTA DA CÉLULA
  // ========================================
  
  // FASE 1 - Robert Hooke
  {
    phaseId: 1,
    title: 'O Início da Jornada',
    introduction: [
      {
        speaker: 'narrador',
        text: 'Em um laboratório misterioso, um jovem detetive acorda sem memória de como chegou ali. Diante dele, um holograma se materializa...'
      },
      {
        speaker: 'drCell',
        text: 'Finalmente acordou, Detetive! Eu sou o Dr. Cell, o maior especialista em citologia do mundo... ou pelo menos eu era, até o Fragmentado roubar minhas memórias científicas.',
        emotion: 'worried'
      },
      {
        speaker: 'detetive',
        text: 'Fragmentado? Quem é esse? E por que eu estou aqui?',
        emotion: 'surprised'
      },
      {
        speaker: 'drCell',
        text: 'O Fragmentado é uma entidade que se alimenta de ignorância. Ele fragmentou todo o conhecimento sobre células e espalhou pelos cantos mais obscuros da ciência.',
        emotion: 'thinking'
      },
      {
        speaker: 'drCell',
        text: 'Você, Detetive, é o único que pode me ajudar a recuperar esse conhecimento. Juntos, vamos reconstruir a história da citologia!',
        emotion: 'determined'
      },
      {
        speaker: 'fragmentado',
        text: 'Hahaha! Vocês acham mesmo que vão conseguir? Eu fragmentei TODO o conhecimento! Nunca conseguirão juntá-lo novamente!',
        emotion: 'evil'
      },
      {
        speaker: 'detetive',
        text: 'Quem está aí?! Essa voz...',
        emotion: 'surprised'
      },
      {
        speaker: 'drCell',
        text: 'É ele, o Fragmentado! Não dê ouvidos a ele, Detetive. Vamos focar no nosso objetivo.',
        emotion: 'determined'
      },
      {
        speaker: 'fragmentado',
        text: 'Foquem, foquem... mas saibam que estarei observando cada passo de vocês. E esperando vocês falharem!',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Vamos começar pelo início de tudo. O ano é 1665, na Inglaterra. Um cientista chamado Robert Hooke estava prestes a fazer uma descoberta que mudaria a ciência para sempre...',
        emotion: 'happy'
      },
      {
        speaker: 'narrador',
        text: 'Robert Hooke era um homem curioso. Ele construiu um microscópio rudimentar e decidiu observar um pedaço fino de cortiça — aquele material marrom usado em rolhas de vinho.'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Robert Hooke (1635–1703)',
          content: 'Cientista inglês que foi um dos maiores inventores de sua época. Além de descobrir as células, Hooke criou a lei de elasticidade (Lei de Hooke) e fez contribuições importantes em áreas como astronomia, arquitetura e física. Seu livro "Micrographia" (1665) contém desenhos detalhados de suas observações microscópicas.',
          type: 'scientist'
        }
      },
      {
        speaker: 'drCell',
        text: 'Ao olhar pelo microscópio, Hooke viu algo incrível: a cortiça era formada por milhares de pequenos compartimentos, como uma colmeia! Ele chamou esses compartimentos de "cellulae".',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Cellulae — A Origem do Nome',
          content: '"Cellulae" é uma palavra em latim que significa "pequenos quartos". Hooke escolheu esse nome porque os compartimentos que viu lembravam os quartos dos monges em mosteiros, chamados de celas. Assim nasceu o termo CÉLULA!',
          type: 'concept'
        }
      },
      {
        speaker: 'drCell',
        text: 'Porém, Detetive, há algo importante que você precisa entender. Hooke não viu células VIVAS. A cortiça é um tecido morto!',
        emotion: 'thinking'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'O Que Hooke Realmente Viu',
          content: 'Hooke observou apenas as PAREDES CELULARES vazias da cortiça. Como a cortiça é um tecido vegetal morto, suas células perderam todo o conteúdo interno (citoplasma, núcleo, organelas). Restaram apenas os "esqueletos" das células — as paredes de celulose e suberina.',
          type: 'important'
        }
      },
      {
        speaker: 'fragmentado',
        text: 'Hmph, informação básica demais! Isso não vai ser suficiente para me derrotar!',
        emotion: 'evil'
      },
      {
        speaker: 'detetive',
        text: 'Veremos, Fragmentado. Estou aprendendo rápido!',
        emotion: 'determined'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Ha ha ha! Então você é o famoso Detetive que vai me derrotar?',
        emotion: 'evil'
      },
      {
        speaker: 'detetive',
        text: 'Fragmentado! O que você quer?',
        emotion: 'angry'
      },
      {
        speaker: 'fragmentado',
        text: 'Eu vim testar se você realmente aprendeu alguma coisa. Hooke descobriu as células, mas será que VOCÊ entendeu o que ele NÃO viu?',
        emotion: 'evil'
      },
      {
        speaker: 'fragmentado',
        text: 'Vamos ver se você consegue passar pelo meu desafio. Se falhar, todo esse conhecimento será meu para sempre!',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Não se deixe intimidar, Detetive! Lembre-se de tudo que aprendemos. Você está pronto!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'Consegui! O primeiro fragmento de conhecimento foi recuperado!',
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'O quê?! Impossível! Você não deveria ter conseguido tão rápido!',
        emotion: 'angry'
      },
      {
        speaker: 'detetive',
        text: 'Surpreso, Fragmentado? Eu disse que ia conseguir!',
        emotion: 'determined'
      },
      {
        speaker: 'drCell',
        text: 'Excelente trabalho, Detetive! Agora entendemos como Robert Hooke descobriu as células em 1665. Este foi o primeiro passo de uma longa jornada científica.',
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'Hmph! Sorte de principiante. Isso foi só o começo! Os próximos desafios serão MUITO mais difíceis. Você vai ver!',
        emotion: 'evil'
      },
      {
        speaker: 'detetive',
        text: 'Estarei esperando, Fragmentado. Cada fragmento de conhecimento que eu recuperar é uma vitória!',
        emotion: 'determined'
      },
      {
        speaker: 'drCell',
        text: 'Esse é o espírito! Vamos em frente! O próximo capítulo da história nos leva à Holanda, onde um comerciante curioso estava prestes a revolucionar a ciência...',
        emotion: 'thinking'
      }
    ]
  },

  // FASE 2 - Leeuwenhoek
  {
    phaseId: 2,
    title: 'O Caçador de Micróbios',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Enquanto Hooke observava células mortas na Inglaterra, do outro lado do mar, na Holanda, algo extraordinário estava acontecendo...',
        emotion: 'happy'
      },
      {
        speaker: 'narrador',
        text: 'Na cidade de Delft, um comerciante de tecidos chamado Antonie van Leeuwenhoek tinha uma paixão peculiar: polir lentes de vidro.'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Antonie van Leeuwenhoek (1632–1723)',
          content: 'Comerciante holandês que se tornou o "pai da microbiologia". Sem formação científica formal, Leeuwenhoek construiu mais de 500 microscópios ao longo da vida. Suas lentes conseguiam ampliar até 300 vezes — muito mais que qualquer outro microscópio da época!',
          type: 'scientist'
        }
      },
      {
        speaker: 'drCell',
        text: 'Leeuwenhoek não era um cientista de formação, mas sua paciência e habilidade eram incomparáveis. Ele podia passar horas polindo uma única lente até atingir a perfeição.',
        emotion: 'thinking'
      },
      {
        speaker: 'detetive',
        text: 'E o que ele descobriu com essas lentes tão poderosas?',
        emotion: 'surprised'
      },
      {
        speaker: 'drCell',
        text: 'Tudo! Ele observou água de lagoa, raspagens de dentes, sangue... E descobriu um mundo invisível cheio de criaturas minúsculas que chamou de "animáculos"!',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Os Animáculos',
          content: '"Animáculos" significa "pequenos animais" em latim. Leeuwenhoek usou esse termo para descrever as criaturas microscópicas que viu. Hoje sabemos que eram bactérias, protozoários e outros micro-organismos UNICELULARES — seres completos formados por uma única célula!',
          type: 'concept'
        }
      },
      {
        speaker: 'drCell',
        text: 'Pense nisso, Detetive: Leeuwenhoek foi o PRIMEIRO ser humano a ver vida microscópica! Bactérias, protozoários, até espermatozoides — um universo inteiro invisível a olho nu.',
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'Haha! Bichínhos microscópicos! Que coisa mais insignificante!',
        emotion: 'evil'
      },
      {
        speaker: 'detetive',
        text: 'Insignificante? Esses "bichínhos" estão em todo lugar, inclusive dentro de você!',
        emotion: 'angry'
      },
      {
        speaker: 'fragmentado',
        text: 'Dentro de MIM? Há! Eu sou feito de pura ignorância, Detetive. Nada de vivo habita em mim!',
        emotion: 'evil'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Organismos Unicelulares',
          content: 'São seres vivos completos formados por apenas UMA célula. Essa única célula faz TUDO: se alimenta, respira, se reproduz e reage ao ambiente. Exemplos: bactérias, amebas, paramécios, euglenas. Existem trilhões deles em seu corpo neste momento!',
          type: 'important'
        }
      },
      {
        speaker: 'drCell',
        text: 'A grande diferença entre Hooke e Leeuwenhoek é que Hooke viu células MORTAS, enquanto Leeuwenhoek viu células VIVAS em ação!',
        emotion: 'determined'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Ah, que tocante! O Detetive está aprendendo sobre microbiozinhos...',
        emotion: 'evil'
      },
      {
        speaker: 'detetive',
        text: 'Você de novo! O que quer desta vez?',
        emotion: 'angry'
      },
      {
        speaker: 'fragmentado',
        text: 'Quero ver se você realmente entendeu a importância de Leeuwenhoek. Qualquer um pode decorar nomes e datas, mas você compreendeu o que ele DESCOBRIU de verdade?',
        emotion: 'evil'
      },
      {
        speaker: 'fragmentado',
        text: 'Prove que não é apenas um papagaio repetindo informações! Mostre que esse conhecimento é SEU!',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Concentre-se, Detetive. Lembre-se: Leeuwenhoek descobriu a VIDA microscópica. Isso é o que importa!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'Mais um fragmento recuperado! Leeuwenhoek abriu nossos olhos para o mundo invisível!',
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'Não... NÃO! De novo?! Você não deveria estar conseguindo isso!',
        emotion: 'angry'
      },
      {
        speaker: 'detetive',
        text: 'Ainda duvida de mim, Fragmentado? Cada vez que aprendo, você fica mais fraco!',
        emotion: 'determined'
      },
      {
        speaker: 'fragmentado',
        text: 'Mais fraco? HÁ! Estou apenas me aquecendo. O verdadeiro desafio ainda está por vir!',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Perfeito, Detetive! Hooke nomeou as células, mas Leeuwenhoek mostrou que elas podem ser seres VIVOS completos. Juntos, eles lançaram as bases para a citologia.',
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'Dois pontos para você. Mas o próximo desafio envolve UNIR todas essas descobertas em uma teoria! Será que você tem capacidade para isso?',
        emotion: 'evil'
      },
      {
        speaker: 'detetive',
        text: 'Pode apostar que sim!',
        emotion: 'determined'
      },
      {
        speaker: 'drCell',
        text: 'Agora precisamos entender como os cientistas conectaram todas essas observações em uma TEORIA unificada. Vamos lá!',
        emotion: 'thinking'
      }
    ]
  },

  // FASE 3 - Teoria Celular
  {
    phaseId: 3,
    title: 'Os Arquitetos da Teoria',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Depois de Hooke e Leeuwenhoek, muitos cientistas observaram células por quase 200 anos. Mas ninguém tinha conseguido CONECTAR todas essas descobertas!',
        emotion: 'thinking'
      },
      {
        speaker: 'detetive',
        text: 'Por que demorou tanto tempo?',
        emotion: 'surprised'
      },
      {
        speaker: 'drCell',
        text: 'Porque faltava alguém para fazer a pergunta certa: será que TODOS os seres vivos são feitos de células?',
        emotion: 'thinking'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'O Que É Uma Teoria Científica?',
          content: 'Uma teoria científica NÃO é um "palpite" ou "opinião". É uma explicação bem testada e comprovada que unifica muitas observações e pode fazer PREVISÕES sobre a natureza. A Teoria Celular é uma das teorias mais importantes da biologia!',
          type: 'concept'
        }
      },
      {
        speaker: 'narrador',
        text: 'Em 1838, na Alemanha, dois cientistas estavam prestes a mudar a história da biologia para sempre...'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Matthias Schleiden (1804–1881)',
          content: 'Botânico alemão que estudava plantas. Em 1838, Schleiden concluiu que TODAS as plantas são formadas por células. Ele foi um dos primeiros a reconhecer a importância do núcleo celular, que chamou de "citoblasto".',
          type: 'scientist'
        }
      },
      {
        speaker: 'drCell',
        text: 'Schleiden era um botânico que adorava observar plantas ao microscópio. Ele percebeu algo incrível: TODAS as plantas que observava eram formadas por células!',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Theodor Schwann (1810–1882)',
          content: 'Zoólogo alemão que estudava animais. Em 1839, Schwann chegou à mesma conclusão de Schleiden, mas para os ANIMAIS: todos os animais também são formados por células. Schwann também descobriu as células de Schwann no sistema nervoso.',
          type: 'scientist'
        }
      },
      {
        speaker: 'drCell',
        text: 'E Schwann, um zoólogo, descobriu a mesma coisa estudando ANIMAIS! Quando os dois se encontraram, perceberam que tinham feito uma descoberta imensa!',
        emotion: 'happy'
      },
      {
        speaker: 'detetive',
        text: 'Então plantas e animais compartilham a mesma base?',
        emotion: 'surprised'
      },
      {
        speaker: 'drCell',
        text: 'EXATAMENTE! Juntos, Schleiden e Schwann formularam a Teoria Celular: TODOS os seres vivos são formados por células!',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Os Pilares da Teoria Celular (1838–1839)',
          content: '1) TODOS os seres vivos são formados por células. 2) A célula é a UNIDADE BÁSICA estrutural e funcional da vida. 3) (Adicionado depois por Virchow) Toda célula se origina de outra célula pré-existente.',
          type: 'important'
        }
      },
      {
        speaker: 'drCell',
        text: 'Isso foi REVOLUCIONÁRIO! Antes, cientistas achavam que plantas e animais eram completamente diferentes. A Teoria Celular mostrou que TODA vida compartilha uma base comum!',
        emotion: 'determined'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Ah, a famosa Teoria Celular... Três "verdades" simples que explicam toda a vida. Parece fácil demais, não acha?',
        emotion: 'evil'
      },
      {
        speaker: 'detetive',
        text: 'Não subestime a simplicidade. As melhores teorias são elegantes e diretas!',
        emotion: 'determined'
      },
      {
        speaker: 'fragmentado',
        text: 'Veremos se você consegue aplicar essa "simplicidade". Qual é o princípio FUNDAMENTAL que conecta TODA a vida na Terra?',
        emotion: 'evil'
      },
      {
        speaker: 'fragmentado',
        text: 'Erre, e todo esse conhecimento sobre a Teoria Celular será meu!',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Você sabe a resposta, Detetive. O que Schleiden e Schwann descobriram em comum? O que une TODOS os seres vivos?',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'A Teoria Celular está completa! Todos os seres vivos são formados por células!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'MAGNÍFICO! Você recuperou um dos fragmentos mais importantes do conhecimento biológico! A Teoria Celular é a base de tudo que estudaremos a partir de agora.',
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'Grrr! Você completou o primeiro bloco, mas a jornada está apenas começando. Os próximos desafios serão sobre os TIPOS de células!',
        emotion: 'angry'
      },
      {
        speaker: 'drCell',
        text: 'Ele tem razão. Agora que sabemos que tudo é feito de células, precisamos entender: existem DIFERENTES tipos de células? Vamos descobrir!',
        emotion: 'thinking'
      },
      {
        speaker: 'narrador',
        text: 'Com o primeiro bloco completo, o Detetive dá seus primeiros passos no mundo da citologia. Mas muitos mistérios ainda aguardam...'
      }
    ]
  },

  // ========================================
  // BLOCO 2 - TIPOS DE CÉLULA
  // ========================================

  // FASE 4 - Procariontes
  {
    phaseId: 4,
    title: 'Os Primordiais',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Bem-vindo ao Setor de Microbiologia, Detetive! Aqui vamos explorar os diferentes TIPOS de células que existem.',
        emotion: 'happy'
      },
      {
        speaker: 'detetive',
        text: 'Diferentes tipos? Eu pensei que células eram todas iguais...',
        emotion: 'surprised'
      },
      {
        speaker: 'drCell',
        text: 'Longe disso! Na verdade, existem dois grandes grupos MUITO diferentes: os PROCARIONTES e os EUCARIONTES.',
        emotion: 'thinking'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'A Origem dos Nomes',
          content: '"Procarionte" vem do grego: "pro" (antes) + "karyon" (núcleo) = ANTES DO NÚCLEO. "Eucarionte" vem de "eu" (verdadeiro) + "karyon" (núcleo) = NÚCLEO VERDADEIRO. Os nomes já revelam a principal diferença entre eles!',
          type: 'concept'
        }
      },
      {
        speaker: 'drCell',
        text: 'Vamos começar pelas células PROCARIONTES — as mais antigas e simples. Elas dominaram a Terra SOZINHAS por quase 2 BILHÕES de anos!',
        emotion: 'happy'
      },
      {
        speaker: 'narrador',
        text: 'Há 3,5 bilhões de anos, a Terra era um lugar muito diferente. Não havia animais, plantas ou fungos. Apenas células simples nadavam nos oceanos primitivos...'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Características dos Procariontes',
          content: '1) NÃO possuem núcleo organizado — o DNA fica solto no citoplasma em uma região chamada NUCLEOIDE. 2) São PEQUENAS (0,2 a 10 micrômetros). 3) NÃO possuem organelas membranosas (mitocôndria, retículo, etc.). 4) Possuem RIBOSSOMOS menores (70S).',
          type: 'important'
        }
      },
      {
        speaker: 'drCell',
        text: 'A característica PRINCIPAL é que procariontes NÃO têm núcleo definido. O material genético (DNA) fica "solto" no citoplasma!',
        emotion: 'determined'
      },
      {
        speaker: 'detetive',
        text: 'E quais seres vivos são procariontes hoje?',
        emotion: 'thinking'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Domínios dos Procariontes',
          content: 'Existem dois domínios de procariontes: 1) BACTERIA — inclui E. coli, Salmonella, bactérias do iogurte, etc. 2) ARCHAEA (Arqueias) — micro-organismos que vivem em ambientes extremos como vulcões, fontes termais e lagos salgados.',
          type: 'concept'
        }
      },
      {
        speaker: 'drCell',
        text: 'Bactérias e Arqueias são os dois grandes grupos de procariontes. Estão em TODO lugar — no solo, na água, no ar, no seu intestino! Existem mais bactérias no seu corpo do que células humanas!',
        emotion: 'happy'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Procariontes, os seres mais antigos da Terra... tão simples, tão primitivos...',
        emotion: 'evil'
      },
      {
        speaker: 'fragmentado',
        text: 'Mas será que você sabe o que DEFINE uma célula procarionte? Qual é a característica que dá nome a elas?',
        emotion: 'evil'
      },
      {
        speaker: 'detetive',
        text: 'Eu sei a resposta! Dr. Cell me explicou tudo!',
        emotion: 'determined'
      },
      {
        speaker: 'fragmentado',
        text: 'Palavras são fáceis. Mostrar é mais difícil. Vamos ver se você REALMENTE entendeu!',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Lembre-se: o nome já dá a dica! "Pro" = antes, "karyon" = núcleo. O que isso significa?',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'Entendi! Procariontes não têm núcleo definido porque são células "antes do núcleo"!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'PERFEITO! Você dominou o conceito de células procariontes. São simples, antigas, mas incrivelmente bem-sucedidas!',
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'Hmph. Mas procariontes são apenas metade da história. Vamos ver como você se sai com as células COMPLEXAS!',
        emotion: 'angry'
      },
      {
        speaker: 'drCell',
        text: 'Ele tem razão. Agora vamos conhecer as células eucariontes — incluindo as SUAS próprias células, Detetive!',
        emotion: 'happy'
      }
    ]
  },

  // FASE 5 - Eucariontes
  {
    phaseId: 5,
    title: 'A Evolução da Complexidade',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Agora vamos conhecer as células EUCARIONTES — as células que formam SEU corpo, Detetive!',
        emotion: 'happy'
      },
      {
        speaker: 'detetive',
        text: 'Minhas células são diferentes das bactérias?',
        emotion: 'surprised'
      },
      {
        speaker: 'drCell',
        text: 'MUITO diferentes! Há cerca de 2 bilhões de anos, algo incrível aconteceu na evolução. Surgiram células muito mais complexas e organizadas.',
        emotion: 'thinking'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'A Grande Transição',
          content: 'Por 1,5 bilhão de anos, só existiam procariontes. Então, há cerca de 2 bilhões de anos, surgiram os EUCARIONTES. Essa transição é considerada uma das mais importantes da história da vida, permitindo o surgimento de organismos multicelulares!',
          type: 'curiosity'
        }
      },
      {
        speaker: 'drCell',
        text: 'A característica PRINCIPAL dos eucariontes é ter um NÚCLEO VERDADEIRO — um compartimento especial que guarda e protege o DNA!',
        emotion: 'determined'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'O Núcleo Celular',
          content: 'O NÚCLEO é como um "cofre" que protege o DNA. É delimitado por uma membrana dupla chamada CARIOTECA (ou envelope nuclear). Dentro dele estão os cromossomos, que contêm toda a informação genética da célula.',
          type: 'important'
        }
      },
      {
        speaker: 'drCell',
        text: 'Mas não para aí! Células eucariontes têm muitos outros compartimentos especializados chamados ORGANELAS!',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Organelas Membranosas',
          content: 'ORGANELAS são como "órgãos" da célula. Cada uma tem uma função específica: MITOCÔNDRIA (energia), RETÍCULO (transporte), GOLGI (empacotamento), LISOSSOMO (digestão), etc. A maioria é envolta por membranas!',
          type: 'concept'
        }
      },
      {
        speaker: 'detetive',
        text: 'Então é como se as células eucariontes fossem mais "organizadas"?',
        emotion: 'thinking'
      },
      {
        speaker: 'drCell',
        text: 'Exatamente! Uma bactéria é como um estúdio simples. Uma célula eucarionte é como um apartamento de luxo com vários cômodos especializados!',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Quem São os Eucariontes?',
          content: 'TODOS os organismos complexos são eucariontes: ANIMAIS, PLANTAS, FUNGOS e PROTISTAS (protozoários, algas). Você é feito de TRILHÕES de células eucariontes trabalhando juntas!',
          type: 'important'
        }
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Eucariontes... células "evoluídas"... Você acha que complexidade é sinônimo de superioridade?',
        emotion: 'evil'
      },
      {
        speaker: 'detetive',
        text: 'Não é questão de superioridade, é de ORGANIZAÇÃO!',
        emotion: 'determined'
      },
      {
        speaker: 'fragmentado',
        text: 'Muito bem. Então me diga: qual é a PRINCIPAL diferença estrutural entre procariontes e eucariontes?',
        emotion: 'evil'
      },
      {
        speaker: 'fragmentado',
        text: 'Essa é a pergunta de 1 milhão de pontos. Erre, e todo esse conhecimento será fragmentado novamente!',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Você sabe! Os nomes dão a resposta: "eu" = verdadeiro, "karyon" = núcleo. O que os eucariontes têm que os procariontes não têm?',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'A presença do NÚCLEO VERDADEIRO! Essa é a principal diferença!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'BRILHANTE! Eucariontes possuem núcleo delimitado pela carioteca, além de diversas organelas membranosas. É a COMPARTIMENTALIZAÇÃO!',
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'Você está ficando bom nisso... Mas ainda falta completar a Teoria Celular. De onde VÊM as células?',
        emotion: 'angry'
      },
      {
        speaker: 'drCell',
        text: 'Ótima pergunta! Na próxima fase, vamos completar a Teoria Celular com uma descoberta crucial sobre a ORIGEM das células!',
        emotion: 'thinking'
      }
    ]
  },

  // FASE 6 - Origem das Células (Virchow)
  {
    phaseId: 6,
    title: 'Toda Célula Vem de Outra Célula',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Detetive, a Teoria Celular de Schleiden e Schwann tinha uma pergunta sem resposta: DE ONDE vêm as novas células?',
        emotion: 'thinking'
      },
      {
        speaker: 'detetive',
        text: 'Boa pergunta! As células surgem do nada?',
        emotion: 'surprised'
      },
      {
        speaker: 'drCell',
        text: 'Na época, muitos acreditavam na "geração espontânea" — a ideia de que seres vivos podiam surgir de matéria não-viva!',
        emotion: 'thinking'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Geração Espontânea',
          content: 'Por séculos, pessoas acreditavam que a vida podia surgir do nada: ratos de trapos sujos, moscas de carne podre, sapos de lama. Essa ideia foi chamada de ABIOGÊNESE ou geração espontânea. Levou muito tempo para ser refutada!',
          type: 'curiosity'
        }
      },
      {
        speaker: 'narrador',
        text: 'Em 1855, um médico alemão chamado Rudolf Virchow estava estudando doenças através de células...'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Rudolf Virchow (1821–1902)',
          content: 'Médico e patologista alemão, considerado o "pai da patologia moderna". Virchow estudava doenças observando células e percebeu que tecidos doentes vinham de células que se dividiam de forma anormal. Foi também um político e reformador social importante.',
          type: 'scientist'
        }
      },
      {
        speaker: 'drCell',
        text: 'Virchow era um patologista — estudava doenças através de células. Ele percebeu que para uma célula doente existir, ela precisava vir de OUTRA célula!',
        emotion: 'thinking'
      },
      {
        speaker: 'drCell',
        text: 'Então Virchow proclamou uma frase que se tornou famosa e completou a Teoria Celular...',
        emotion: 'determined'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Omnis Cellula e Cellula',
          content: 'Esta frase em latim significa "TODA CÉLULA VEM DE OUTRA CÉLULA". Este princípio estabelece que células NÃO surgem do nada — elas só podem nascer através da DIVISÃO de uma célula pré-existente. Isso refutou a geração espontânea!',
          type: 'important'
        }
      },
      {
        speaker: 'detetive',
        text: 'Então células não surgem do nada? Elas sempre vêm de outras células?',
        emotion: 'surprised'
      },
      {
        speaker: 'drCell',
        text: 'EXATAMENTE! A vida vem da vida! Você existe porque uma única célula (o zigoto) se dividiu TRILHÕES de vezes!',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Teoria Celular Completa',
          content: '1) Todos os seres vivos são formados por células. 2) A célula é a unidade básica da vida. 3) Toda célula se origina de outra célula pré-existente. Estes três princípios formam a base de TODA a biologia moderna!',
          type: 'important'
        }
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Omnis cellula e cellula... Palavras antigas em uma língua morta. Mas o significado é eterno, não é?',
        emotion: 'evil'
      },
      {
        speaker: 'detetive',
        text: 'Sim! Toda célula vem de outra célula. A vida continua através da divisão!',
        emotion: 'determined'
      },
      {
        speaker: 'fragmentado',
        text: 'Vamos testar se você REALMENTE internalizou isso. De onde se originam as novas células, segundo Virchow?',
        emotion: 'evil'
      },
      {
        speaker: 'fragmentado',
        text: 'Esta é a última peça do quebra-cabeça da Teoria Celular. Mostre que é digno de prosseguir!',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'A frase em latim já dá a resposta completa, Detetive. Confie no que aprendeu!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'Toda célula se origina de outra célula pré-existente! A Teoria Celular está COMPLETA!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'EXTRAORDINÁRIO! Você recuperou os fundamentos completos da citologia! Hooke, Leeuwenhoek, Schleiden, Schwann e Virchow — todos juntos!',
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'Você completou dois blocos... Impressionante. Mas agora vamos entrar DENTRO das células. Vamos ver se consegue entender as ORGANELAS!',
        emotion: 'angry'
      },
      {
        speaker: 'drCell',
        text: 'O Fragmentado está ficando nervoso! Isso significa que estamos no caminho certo! Vamos explorar as organelas celulares!',
        emotion: 'happy'
      },
      {
        speaker: 'narrador',
        text: 'Com a Teoria Celular completa, o Detetive está pronto para explorar o interior das células. Que segredos as organelas guardam?'
      }
    ]
  },

  // ========================================
  // BLOCO 3 - ORGANELAS
  // ========================================

  // FASE 7 - Mitocôndria
  {
    phaseId: 7,
    title: 'A Usina de Energia',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Bem-vindo à Cidade Celular, Detetive! Aqui vamos explorar as ORGANELAS — as estruturas especializadas dentro das células eucariontes.',
        emotion: 'happy'
      },
      {
        speaker: 'detetive',
        text: 'Como uma cidade com diferentes prédios?',
        emotion: 'thinking'
      },
      {
        speaker: 'drCell',
        text: 'EXATAMENTE! Cada organela é um "prédio" com uma função específica. E toda cidade precisa de ENERGIA para funcionar!',
        emotion: 'happy'
      },
      {
        speaker: 'narrador',
        text: 'No centro da célula, uma organela especial trabalha incansavelmente, produzindo a energia necessária para todas as atividades...'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'A Mitocôndria',
          content: 'A MITOCÔNDRIA é a organela responsável pela produção de energia. Tem formato de feijão ou salsicha, possui DUAS membranas (externa e interna) e, incrivelmente, tem seu PRÓPRIO DNA! Existem centenas a milhares de mitocôndrias em cada célula.',
          type: 'important'
        }
      },
      {
        speaker: 'drCell',
        text: 'A MITOCÔNDRIA é a "usina de força" da célula! Dentro dela ocorre a RESPIRAÇÃO CELULAR — o processo que "queima" glicose para produzir ATP!',
        emotion: 'determined'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'ATP — A Moeda Energética',
          content: 'ATP significa Adenosina TRIfosfato. É como o "dinheiro" da célula — toda atividade que gasta energia usa ATP: contrair músculos, produzir proteínas, transportar substâncias, dividir a célula. Sem ATP, a célula MORRE!',
          type: 'concept'
        }
      },
      {
        speaker: 'detetive',
        text: 'Você disse que a mitocôndria tem DNA próprio? Como assim?',
        emotion: 'surprised'
      },
      {
        speaker: 'drCell',
        text: 'Ótima observação! Isso nos leva a uma das teorias mais fascinantes da biologia...',
        emotion: 'thinking'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Teoria Endossimbiótica',
          content: 'Há cerca de 2 bilhões de anos, uma célula maior "engoliu" uma bactéria que produzia energia. Em vez de digeri-la, as duas passaram a VIVER JUNTAS! A bactéria virou a mitocôndria. Por isso ela tem DNA próprio e se reproduz independentemente!',
          type: 'curiosity'
        }
      },
      {
        speaker: 'drCell',
        text: 'A mitocôndria já foi uma bactéria independente! Por isso ela tem DNA circular próprio, assim como as bactérias!',
        emotion: 'happy'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Energia... ATP... A célula precisa disso para sobreviver. Mas e se eu cortar o fornecimento?',
        emotion: 'evil'
      },
      {
        speaker: 'detetive',
        text: 'Você não pode! A mitocôndria está protegida dentro da célula!',
        emotion: 'angry'
      },
      {
        speaker: 'fragmentado',
        text: 'Posso não, mas posso testar se você sabe qual organela produz toda essa energia. QUAL é a usina da célula?',
        emotion: 'evil'
      },
      {
        speaker: 'fragmentado',
        text: 'Erre isso, e você ficará sem "energia" para continuar!',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Você sabe essa! Qual organela produz ATP através da respiração celular?',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'A MITOCÔNDRIA! Ela é a usina de energia que produz ATP!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'PERFEITO! A mitocôndria é essencial para a vida eucarionte. Sem ela, células complexas não existiriam!',
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'Produzir energia é fácil. Mas e RECICLAR o lixo celular? Vamos ver se você conhece os "faxineiros" da célula!',
        emotion: 'angry'
      },
      {
        speaker: 'drCell',
        text: 'Ele está falando dos LISOSSOMOS! Vamos conhecer o sistema de reciclagem celular!',
        emotion: 'thinking'
      }
    ]
  },

  // FASE 8 - Lisossomo
  {
    phaseId: 8,
    title: 'Os Recicladores',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Detetive, toda cidade precisa de um sistema de coleta de lixo. A célula não é diferente!',
        emotion: 'thinking'
      },
      {
        speaker: 'detetive',
        text: 'A célula produz lixo?',
        emotion: 'surprised'
      },
      {
        speaker: 'drCell',
        text: 'Sim! Organelas danificadas, proteínas velhas, invasores... Tudo isso precisa ser eliminado ou reciclado. E aí entram os LISOSSOMOS!',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Lisossomos',
          content: 'LISOSSOMOS são vesículas esféricas cheias de ENZIMAS DIGESTIVAS. Essas enzimas podem quebrar praticamente qualquer molécula orgânica: proteínas, lipídios, carboidratos e até ácidos nucleicos. São os "estômagos" da célula!',
          type: 'important'
        }
      },
      {
        speaker: 'drCell',
        text: 'O nome "lisossomo" vem do grego: "lysis" (quebra) + "soma" (corpo). São literalmente "corpos que quebram" coisas!',
        emotion: 'thinking'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Funções dos Lisossomos',
          content: '1) DIGESTÃO INTRACELULAR: digerem partículas englobadas pela célula. 2) AUTOFAGIA: "reciclam" organelas velhas ou danificadas. 3) DEFESA: destroem bactérias e vírus invasores. 4) APOPTOSE: participam da morte celular programada.',
          type: 'concept'
        }
      },
      {
        speaker: 'detetive',
        text: 'Então os lisossomos são como o sistema imunológico da célula?',
        emotion: 'thinking'
      },
      {
        speaker: 'drCell',
        text: 'Em parte! Eles ajudam a destruir invasores. Mas também fazem "limpeza interna", reciclando as próprias partes da célula!',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Autofagia — Comendo a Si Mesmo',
          content: 'AUTOFAGIA significa "comer a si mesmo". É um processo onde a célula "recicla" suas próprias organelas danificadas ou desnecessárias. Os lisossomos digerem essas partes e os componentes são reutilizados. É uma forma de sobrevivência em condições de estresse!',
          type: 'curiosity'
        }
      },
      {
        speaker: 'drCell',
        text: 'Sem lisossomos, a célula ficaria entupida de lixo e organelas quebradas. São os heróis silenciosos da limpeza celular!',
        emotion: 'determined'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Lisossomos... cheios de enzimas destrutivas. Você sabia que se eles se rompessem, poderiam digerir a própria célula?',
        emotion: 'evil'
      },
      {
        speaker: 'detetive',
        text: 'Por isso eles estão protegidos por membranas!',
        emotion: 'determined'
      },
      {
        speaker: 'fragmentado',
        text: 'Esperto. Mas será que você sabe o que esses "recicladores" fazem? Qual é a função principal dos lisossomos?',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Lembre-se: lisossomos contêm enzimas que DIGEREM e RECICLAM materiais da célula!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'Os lisossomos fazem a digestão intracelular e reciclam organelas danificadas!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'EXCELENTE! Você entendeu o sistema de reciclagem celular. Lisossomos são essenciais para manter a célula saudável!',
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'Energia e reciclagem... Mas e a PRODUÇÃO de moléculas orgânicas? Vamos ver se você conhece as "fábricas verdes"!',
        emotion: 'angry'
      },
      {
        speaker: 'drCell',
        text: 'Ah, os CLOROPLASTOS! As organelas exclusivas das plantas que fazem fotossíntese! Vamos explorá-los!',
        emotion: 'happy'
      }
    ]
  },

  // FASE 9 - Cloroplasto
  {
    phaseId: 9,
    title: 'A Fábrica Verde',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Detetive, já vimos como a mitocôndria produz energia "queimando" glicose. Mas DE ONDE vem essa glicose?',
        emotion: 'thinking'
      },
      {
        speaker: 'detetive',
        text: 'Da comida que ingerimos?',
        emotion: 'thinking'
      },
      {
        speaker: 'drCell',
        text: 'Sim, mas e a comida, de onde vem? Toda cadeia alimentar começa com organismos que PRODUZEM seu próprio alimento — as PLANTAS!',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Cloroplasto',
          content: 'O CLOROPLASTO é a organela onde ocorre a FOTOSSÍNTESE. Contém um pigmento verde chamado CLOROFILA que captura a luz solar. É EXCLUSIVO de células vegetais e algumas algas. Assim como mitocôndrias, cloroplastos têm DNA próprio!',
          type: 'important'
        }
      },
      {
        speaker: 'drCell',
        text: 'Dentro dos cloroplastos, ocorre a reação mais importante do planeta: a FOTOSSÍNTESE!',
        emotion: 'determined'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Fotossíntese',
          content: 'A equação da fotossíntese: LUZ + CO₂ + H₂O → GLICOSE + O₂. Plantas capturam ENERGIA LUMINOSA e usam para transformar gás carbônico e água em GLICOSE (açúcar) e oxigênio. É literalmente transformar luz em alimento!',
          type: 'concept'
        }
      },
      {
        speaker: 'detetive',
        text: 'Então as plantas produzem o oxigênio que respiramos?',
        emotion: 'surprised'
      },
      {
        speaker: 'drCell',
        text: 'EXATAMENTE! Sem fotossíntese, não haveria oxigênio na atmosfera e a vida complexa não existiria!',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Cloroplasto e Mitocôndria — Uma Parceria',
          content: 'Cloroplastos e mitocôndrias trabalham em PARCERIA: Cloroplastos fazem fotossíntese (luz → glicose + O₂). Mitocôndrias fazem respiração (glicose + O₂ → ATP + CO₂). O oxigênio de um é usado pelo outro, e vice-versa!',
          type: 'curiosity'
        }
      },
      {
        speaker: 'drCell',
        text: 'E assim como a mitocôndria, o cloroplasto também foi uma bactéria que foi "engolida" — uma cianobactéria fotossintética!',
        emotion: 'thinking'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Ah, a fotossíntese... A base de toda a cadeia alimentar. Sem ela, eu poderia dominar um mundo sem vida!',
        emotion: 'evil'
      },
      {
        speaker: 'detetive',
        text: 'Você nunca vai conseguir! As plantas continuarão produzindo vida!',
        emotion: 'angry'
      },
      {
        speaker: 'fragmentado',
        text: 'Veremos. Mas antes, prove que sabe ONDE ocorre a fotossíntese. Qual organela é responsável por transformar luz em alimento?',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'A organela verde, exclusiva de plantas... Você sabe qual é!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'O CLOROPLASTO! Ele contém clorofila e realiza a fotossíntese!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'MAGNÍFICO! Você completou o bloco das organelas principais! Mitocôndria para energia, lisossomo para reciclagem, cloroplasto para produção de alimento!',
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'Três organelas... Muito bem. Mas agora vamos comparar células INTEIRAS! Animal versus Vegetal — vamos ver de que lado você fica!',
        emotion: 'angry'
      },
      {
        speaker: 'drCell',
        text: 'Perfeito! No próximo bloco, vamos comparar células animais e vegetais. Quais são as semelhanças e diferenças?',
        emotion: 'happy'
      },
      {
        speaker: 'narrador',
        text: 'Com três blocos completos, o Detetive domina os fundamentos da citologia. Mas a jornada ainda reserva muitos desafios...'
      }
    ]
  },

  // ========================================
  // BLOCO 4 - ANIMAL VS VEGETAL
  // ========================================

  // FASE 10 - Célula Animal
  {
    phaseId: 10,
    title: 'A Célula que Forma Você',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Detetive, você já conhece as organelas. Agora vamos ver como elas se organizam em diferentes tipos de células!',
        emotion: 'happy'
      },
      {
        speaker: 'detetive',
        text: 'Células animais são diferentes das vegetais?',
        emotion: 'thinking'
      },
      {
        speaker: 'drCell',
        text: 'Ambas são eucariontes, mas têm diferenças importantes! Vamos começar pela célula ANIMAL — a célula que forma SEU corpo!',
        emotion: 'determined'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Célula Animal — Visão Geral',
          content: 'A célula animal é EUCARIONTE, com núcleo definido e organelas membranosas. NÃO possui parede celular (apenas membrana plasmática), NÃO tem cloroplastos e possui CENTRÍOLOS para divisão celular. Seus vacúolos são pequenos e múltiplos.',
          type: 'important'
        }
      },
      {
        speaker: 'drCell',
        text: 'A primeira grande diferença: células animais NÃO têm parede celular! Elas são delimitadas apenas pela membrana plasmática, o que as torna mais FLEXÍVEIS.',
        emotion: 'thinking'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Centríolos',
          content: 'CENTRÍOLOS são estruturas cilíndricas formadas por microtúbulos. São EXCLUSIVOS de células animais e participam da DIVISÃO CELULAR, organizando o fuso mitótico. Também formam cílios e flagelos!',
          type: 'concept'
        }
      },
      {
        speaker: 'detetive',
        text: 'E os centríolos? Eu ouvi dizer que só células animais têm...',
        emotion: 'thinking'
      },
      {
        speaker: 'drCell',
        text: 'CORRETO! Centríolos são exclusivos de células animais. Eles ajudam na divisão celular e formam cílios e flagelos!',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Vacúolos em Células Animais',
          content: 'Células animais possuem vacúolos PEQUENOS e MÚLTIPLOS, usados principalmente para armazenamento temporário e transporte. Diferente das células vegetais, que têm um grande vacúolo central.',
          type: 'curiosity'
        }
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'A célula que forma SEU corpo, Detetive. Frágil, sem parede, sem cloroplastos... Tão vulnerável.',
        emotion: 'evil'
      },
      {
        speaker: 'detetive',
        text: 'Flexível, não frágil! A flexibilidade permite movimento e adaptação!',
        emotion: 'determined'
      },
      {
        speaker: 'fragmentado',
        text: 'Palavras bonitas. Mas você sabe identificar as características EXCLUSIVAS da célula animal?',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Lembre-se: sem parede, com centríolos, sem cloroplastos, vacúolos pequenos!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'Células animais não têm parede celular, mas têm centríolos! Isso eu aprendi!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'ÓTIMO! Você já conhece bem a célula animal. Agora vamos ver a célula VEGETAL e suas estruturas exclusivas!',
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'A célula vegetal tem mais "armadura". Será que você consegue identificar todas as diferenças?',
        emotion: 'angry'
      }
    ]
  },

  // FASE 11 - Célula Vegetal
  {
    phaseId: 11,
    title: 'A Célula das Plantas',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Agora vamos conhecer a célula VEGETAL! Ela tem tudo que a animal tem, MAIS algumas estruturas exclusivas!',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Célula Vegetal — Visão Geral',
          content: 'A célula vegetal é EUCARIONTE com: PAREDE CELULAR de celulose (rígida), CLOROPLASTOS (fotossíntese), VACÚOLO CENTRAL grande (até 90% da célula), PLASMODESMOS (conexões entre células). NÃO possui centríolos.',
          type: 'important'
        }
      },
      {
        speaker: 'detetive',
        text: 'Parede celular? Isso é diferente da membrana?',
        emotion: 'thinking'
      },
      {
        speaker: 'drCell',
        text: 'Sim! A PAREDE CELULAR fica POR FORA da membrana plasmática. É feita de CELULOSE e dá rigidez e proteção à célula!',
        emotion: 'determined'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Parede Celular',
          content: 'A PAREDE CELULAR vegetal é composta principalmente de CELULOSE (um polissacarídeo). Funções: 1) PROTEÇÃO contra patógenos. 2) SUPORTE estrutural (por isso plantas ficam em pé). 3) PREVINE ruptura por excesso de água.',
          type: 'concept'
        }
      },
      {
        speaker: 'drCell',
        text: 'Já os CLOROPLASTOS você já conhece — são as fábricas verdes onde ocorre a fotossíntese!',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Vacúolo Central',
          content: 'O VACÚOLO CENTRAL pode ocupar até 90% do volume da célula vegetal! Funções: 1) Armazena água e nutrientes. 2) Mantém a PRESSÃO DE TURGOR (deixa a planta firme). 3) Armazena pigmentos e toxinas. 4) Digestão (como lisossomos).',
          type: 'important'
        }
      },
      {
        speaker: 'detetive',
        text: 'Então as plantas têm um vacúolo ENORME? Por quê?',
        emotion: 'surprised'
      },
      {
        speaker: 'drCell',
        text: 'Para armazenar água e manter a planta "firme"! Quando uma planta murcha, é porque o vacúolo perdeu água e a célula "desinflou"!',
        emotion: 'thinking'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Parede celular, cloroplastos, vacúolo gigante... Células vegetais parecem bem protegidas.',
        emotion: 'evil'
      },
      {
        speaker: 'fragmentado',
        text: 'Mas será que você consegue identificar TODAS as estruturas EXCLUSIVAS das células vegetais?',
        emotion: 'evil'
      },
      {
        speaker: 'detetive',
        text: 'Claro que consigo! O Dr. Cell me ensinou tudo!',
        emotion: 'determined'
      },
      {
        speaker: 'drCell',
        text: 'Lembre-se: parede de celulose, cloroplastos, vacúolo central grande. Essas são as estrelas!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'Células vegetais têm parede celular, cloroplastos e vacúolo central! Exclusividades que as diferenciam das animais!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'PERFEITO! Você domina as características de ambos os tipos celulares!',
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'Muito bem... Mas vamos ver se você consegue comparar as duas LADO A LADO!',
        emotion: 'angry'
      }
    ]
  },

  // FASE 12 - Comparação Final
  {
    phaseId: 12,
    title: 'O Grande Duelo Celular',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Chegou a hora de colocar tudo junto! Vamos comparar células animais e vegetais lado a lado!',
        emotion: 'determined'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Semelhanças (Ambas São Eucariontes)',
          content: 'AMBAS possuem: Membrana plasmática, Núcleo com carioteca, Mitocôndrias, Retículo endoplasmático, Complexo de Golgi, Ribossomos, Citoesqueleto. A base é a MESMA — são eucariontes!',
          type: 'important'
        }
      },
      {
        speaker: 'drCell',
        text: 'Primeiro, lembre-se: AMBAS são eucariontes! Têm núcleo, mitocôndrias, retículo, Golgi... A base é comum!',
        emotion: 'thinking'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Diferenças — Animal vs. Vegetal',
          content: 'ANIMAL: Sem parede, com centríolos, sem cloroplastos, vacúolos pequenos, forma irregular. VEGETAL: Com parede de celulose, sem centríolos, com cloroplastos, vacúolo central grande, forma mais rígida.',
          type: 'important'
        }
      },
      {
        speaker: 'detetive',
        text: 'Então a principal diferença é: plantas têm parede + cloroplastos + vacúolo grande?',
        emotion: 'thinking'
      },
      {
        speaker: 'drCell',
        text: 'E animais têm centríolos! Essa é a única estrutura que animais têm e plantas não!',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Por Que Essas Diferenças?',
          content: 'PLANTAS: Parede celular para sustentação (não têm ossos), cloroplastos para fazer comida (não se movem para comer), vacúolo grande para armazenar água (não podem ir buscar). ANIMAIS: Centríolos para divisão e movimento, flexibilidade para locomoção.',
          type: 'curiosity'
        }
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Animal ou vegetal? Tantas semelhanças, tantas diferenças... Você consegue classificar corretamente?',
        emotion: 'evil'
      },
      {
        speaker: 'fragmentado',
        text: 'Este é o desafio final do bloco! Mostre que realmente entendeu as diferenças!',
        emotion: 'evil'
      },
      {
        speaker: 'detetive',
        text: 'Eu sei as diferenças de cor! Vamos lá!',
        emotion: 'determined'
      },
      {
        speaker: 'drCell',
        text: 'Concentre-se nas exclusividades de cada tipo. Você consegue!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'BLOCO COMPLETO! Agora sei diferenciar células animais e vegetais perfeitamente!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'ESPETACULAR! Você dominou a comparação celular! Animal e vegetal não têm mais segredos para você!',
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'Quatro blocos... Você está avançando rápido demais. Mas agora vamos para algo mais COMPLEXO: a MEMBRANA PLASMÁTICA!',
        emotion: 'angry'
      },
      {
        speaker: 'drCell',
        text: 'A membrana é a "pele" da célula — controla tudo que entra e sai! Vamos desvendar seus segredos!',
        emotion: 'happy'
      },
      {
        speaker: 'narrador',
        text: 'Quatro blocos conquistados! O Detetive avança cada vez mais na jornada de restaurar o conhecimento roubado pelo Fragmentado...'
      }
    ]
  },

  // ========================================
  // FASES 13-30 (resumidas por limitação de espaço)
  // Seguem o mesmo padrão com conteúdo educacional
  // sobre membrana, transporte, síntese proteica,
  // energia celular e o confronto final
  // ========================================

  // FASE 13 - Estrutura da Membrana
  {
    phaseId: 13,
    title: 'A Barreira Inteligente',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Bem-vindo ao Controle de Fronteira! Aqui vamos estudar a MEMBRANA PLASMÁTICA — a estrutura que separa a célula do mundo exterior!',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Membrana Plasmática',
          content: 'A MEMBRANA PLASMÁTICA é uma barreira seletiva que envolve TODAS as células. É formada por uma BICAMADA DE FOSFOLIPÍDIOS com proteínas inseridas. Controla o que entra e sai da célula!',
          type: 'important'
        }
      },
      {
        speaker: 'drCell',
        text: 'A membrana é formada principalmente por FOSFOLIPÍDIOS — moléculas com uma "cabeça" que gosta de água e uma "cauda" que foge dela!',
        emotion: 'thinking'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Modelo Mosaico Fluido',
          content: 'Em 1972, Singer e Nicolson propuseram o MODELO MOSAICO FLUIDO: a membrana é como um "oceano" de lipídios onde "ilhas" de proteínas flutuam. É chamado de "fluido" porque os componentes se movem lateralmente!',
          type: 'concept'
        }
      },
      {
        speaker: 'detetive',
        text: 'Então a membrana não é rígida? Os componentes se movem?',
        emotion: 'surprised'
      },
      {
        speaker: 'drCell',
        text: 'Exatamente! É por isso que funciona tão bem. É flexível, dinâmica e super inteligente!',
        emotion: 'happy'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'A membrana... tão fina, tão frágil, mas tão importante. Você sabe como ela é formada?',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Bicamada de fosfolipídios com proteínas — o modelo mosaico fluido!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'A membrana é uma bicamada de fosfolipídios com proteínas — o mosaico fluido!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'PERFEITO! Agora vamos estudar as FUNÇÕES dessa membrana incrível!',
        emotion: 'happy'
      }
    ]
  },

  // FASE 14 - Funções da Membrana
  {
    phaseId: 14,
    title: 'A Guardiã Seletiva',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Agora que conhecemos a estrutura, vamos entender as FUNÇÕES da membrana plasmática!',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Permeabilidade Seletiva',
          content: 'A membrana é SELETIVA: permite a passagem de algumas substâncias e bloqueia outras. Moléculas pequenas e apolares (O₂, CO₂) passam facilmente. Moléculas grandes e polares precisam de ajuda das proteínas transportadoras!',
          type: 'important'
        }
      },
      {
        speaker: 'drCell',
        text: 'A membrana controla TUDO que entra e sai da célula. É como um segurança de boate muito rigoroso!',
        emotion: 'thinking'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Comunicação Celular',
          content: 'As proteínas da membrana também funcionam como RECEPTORES. Elas recebem mensagens químicas (hormônios, neurotransmissores) e transmitem informações para dentro da célula. É assim que as células "conversam"!',
          type: 'concept'
        }
      },
      {
        speaker: 'detetive',
        text: 'Então a membrana também é responsável pela comunicação entre células?',
        emotion: 'surprised'
      },
      {
        speaker: 'drCell',
        text: 'Sim! Receptores, adesão celular, reconhecimento... A membrana faz TUDO isso!',
        emotion: 'happy'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Funções, funções... Tantas responsabilidades para uma estrutura tão fina. Você sabe a principal função da membrana?',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Controlar o que entra e sai — permeabilidade seletiva!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'A membrana controla a entrada e saída de substâncias através da permeabilidade seletiva!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'Excelente! Você entendeu as funções fundamentais da membrana!',
        emotion: 'happy'
      }
    ]
  },

  // FASE 15 - Especializações da Membrana
  {
    phaseId: 15,
    title: 'Adaptações Especiais',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Em algumas células, a membrana tem ESPECIALIZAÇÕES — estruturas modificadas para funções específicas!',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Microvilosidades',
          content: 'MICROVILOSIDADES são dobras da membrana que aumentam a superfície de absorção. Encontradas no intestino, aumentam em até 20 vezes a área de absorção de nutrientes!',
          type: 'concept'
        }
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Junções Celulares',
          content: 'DESMOSSOMOS: "botões" que prendem células juntas. JUNÇÕES COMUNICANTES (GAP): canais que conectam células vizinhas. JUNÇÕES OCLUSIVAS (TIGHT): vedam espaços entre células.',
          type: 'important'
        }
      },
      {
        speaker: 'drCell',
        text: 'Essas especializações mostram como as células se adaptam para funções específicas!',
        emotion: 'thinking'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Especializações... Como as células são engenhosas. Mas você conhece todas elas?',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Microvilosidades, desmossomos, junções... Cada uma com sua função!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'Aprendi sobre microvilosidades e junções celulares!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'Ótimo! O bloco da membrana está quase completo!',
        emotion: 'happy'
      }
    ]
  },

  // FASE 16 - Desafio Membrana
  {
    phaseId: 16,
    title: 'Domínio da Membrana',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Esta é a fase final do bloco da Membrana! Vamos revisar tudo que aprendemos!',
        emotion: 'determined'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Revisão da Membrana',
          content: 'ESTRUTURA: Bicamada de fosfolipídios + proteínas (modelo mosaico fluido). FUNÇÕES: Permeabilidade seletiva, comunicação, reconhecimento. ESPECIALIZAÇÕES: Microvilosidades, desmossomos, junções.',
          type: 'important'
        }
      },
      {
        speaker: 'detetive',
        text: 'Estou pronto para o desafio final da membrana!',
        emotion: 'determined'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'O desafio final da membrana! Vamos ver se você REALMENTE dominou esse assunto!',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Use todo o conhecimento que adquiriu! Você consegue!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'BLOCO DA MEMBRANA COMPLETO!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'MAGNÍFICO! Agora vamos estudar como as substâncias ATRAVESSAM essa membrana — o Transporte Celular!',
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'Cinco blocos... Você está avançando, mas o transporte celular é MUITO mais complexo!',
        emotion: 'angry'
      }
    ]
  },

  // FASE 17 - Difusão
  {
    phaseId: 17,
    title: 'O Movimento Livre',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Bem-vindo ao Sistema de Transporte! Agora vamos entender COMO as substâncias entram e saem das células!',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Transporte Passivo',
          content: 'TRANSPORTE PASSIVO não gasta energia (ATP). As moléculas se movem naturalmente do lugar com MAIS concentração para o lugar com MENOS concentração. É como a água descendo uma montanha!',
          type: 'concept'
        }
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Difusão Simples',
          content: 'DIFUSÃO SIMPLES: moléculas PEQUENAS e APOLARES (O₂, CO₂, N₂) passam diretamente pela bicamada lipídica. Não precisam de proteínas transportadoras!',
          type: 'important'
        }
      },
      {
        speaker: 'detetive',
        text: 'Então o oxigênio entra nas células assim, naturalmente?',
        emotion: 'thinking'
      },
      {
        speaker: 'drCell',
        text: 'Exatamente! O O₂ está mais concentrado fora da célula, então ele naturalmente entra. E o CO₂ sai porque está mais concentrado dentro!',
        emotion: 'happy'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Difusão... tão simples, tão natural. Mas você sabe em que direção as moléculas se movem?',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Do mais concentrado para o menos concentrado — a favor do gradiente!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'Na difusão, as moléculas vão do mais concentrado para o menos concentrado, sem gastar energia!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'PERFEITO! Agora vamos estudar um tipo especial de difusão: a OSMOSE!',
        emotion: 'happy'
      }
    ]
  },

  // FASE 18 - Osmose
  {
    phaseId: 18,
    title: 'A Dança da Água',
    introduction: [
      {
        speaker: 'drCell',
        text: 'OSMOSE é a difusão da ÁGUA através de uma membrana semipermeável. É um conceito FUNDAMENTAL!',
        emotion: 'determined'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Osmose',
          content: 'A água se move do meio HIPOTÔNICO (menos soluto, mais água) para o meio HIPERTÔNICO (mais soluto, menos água). A água "segue" os solutos para tentar equilibrar as concentrações!',
          type: 'important'
        }
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Soluções e Células',
          content: 'HIPOTÔNICA: célula incha (entra água). ISOTÔNICA: célula normal (equilíbrio). HIPERTÔNICA: célula murcha (sai água). É por isso que não podemos beber água do mar — é muito hipertônica!',
          type: 'concept'
        }
      },
      {
        speaker: 'detetive',
        text: 'Então se colocarmos uma célula em água pura, ela incha?',
        emotion: 'surprised'
      },
      {
        speaker: 'drCell',
        text: 'Sim! E pode até explodir! Células animais em água pura sofrem LISE. Células vegetais têm parede celular que impede isso!',
        emotion: 'thinking'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Osmose... a água sempre encontra seu caminho. Mas para onde ela vai?',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Do hipotônico para o hipertônico — sempre buscando equilíbrio!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'A água vai do meio hipotônico para o hipertônico por osmose!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'EXCELENTE! Agora vamos ver o transporte que GASTA energia — o Transporte ATIVO!',
        emotion: 'happy'
      }
    ]
  },

  // FASE 19 - Transporte Ativo
  {
    phaseId: 19,
    title: 'Contra a Corrente',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Às vezes a célula precisa transportar substâncias CONTRA o gradiente de concentração. Para isso, ela gasta ENERGIA!',
        emotion: 'thinking'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Transporte Ativo',
          content: 'TRANSPORTE ATIVO gasta ATP para mover substâncias do lugar com MENOS concentração para o lugar com MAIS concentração. É como subir uma montanha — precisa de esforço!',
          type: 'important'
        }
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Bomba de Sódio-Potássio',
          content: 'A BOMBA Na⁺/K⁺ é o exemplo mais famoso. Ela joga 3 sódios para FORA e 2 potássios para DENTRO, gastando 1 ATP. É essencial para células nervosas e musculares!',
          type: 'concept'
        }
      },
      {
        speaker: 'detetive',
        text: 'Então a célula gasta energia para manter as concentrações diferentes dentro e fora?',
        emotion: 'thinking'
      },
      {
        speaker: 'drCell',
        text: 'Exatamente! Essa diferença de concentração é essencial para a vida. Sem ela, neurônios não funcionariam!',
        emotion: 'happy'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Transporte ativo... ir contra a natureza. Qual é a diferença do passivo?',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Gasta ATP e vai contra o gradiente de concentração!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'Transporte ativo gasta ATP para ir contra o gradiente de concentração!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'ÓTIMO! O bloco de transporte está quase completo!',
        emotion: 'happy'
      }
    ]
  },

  // FASE 20 - Revisão Transporte
  {
    phaseId: 20,
    title: 'Mestre do Transporte',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Vamos revisar TODOS os tipos de transporte celular!',
        emotion: 'determined'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Resumo dos Transportes',
          content: 'PASSIVO (sem ATP): Difusão simples, difusão facilitada, osmose. ATIVO (com ATP): Bomba de sódio-potássio, endocitose, exocitose. A diferença fundamental é o GASTO DE ENERGIA!',
          type: 'important'
        }
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Endocitose e Exocitose',
          content: 'ENDOCITOSE: célula "engole" partículas grandes formando vesículas. EXOCITOSE: célula "cospe" substâncias fundindo vesículas com a membrana. São transportes em MASSA!',
          type: 'concept'
        }
      },
      {
        speaker: 'detetive',
        text: 'Estou pronto para o desafio final do transporte!',
        emotion: 'determined'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Todos os tipos de transporte... Você consegue classificá-los corretamente?',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Passivo sem ATP, ativo com ATP. Simples assim!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'BLOCO DE TRANSPORTE CELULAR COMPLETO!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'FANTÁSTICO! Agora vamos para a FÁBRICA DE PROTEÍNAS — a síntese proteica!',
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'Seis blocos completos... Mas a síntese proteica é o tópico mais complexo de todos!',
        emotion: 'angry'
      }
    ]
  },

  // FASE 21 - Transcrição
  {
    phaseId: 21,
    title: 'Do DNA ao RNA',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Bem-vindo à Fábrica de Proteínas! Aqui vamos entender como as informações do DNA se transformam em PROTEÍNAS!',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Dogma Central da Biologia',
          content: 'DNA → RNA → PROTEÍNA. A informação genética flui do DNA para o RNA (transcrição) e do RNA para a proteína (tradução). É o "dogma central" da biologia molecular!',
          type: 'important'
        }
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Transcrição',
          content: 'TRANSCRIÇÃO ocorre no NÚCLEO. A enzima RNA POLIMERASE lê o DNA e cria uma cópia em RNA mensageiro (mRNA). É como copiar uma receita do livro original!',
          type: 'concept'
        }
      },
      {
        speaker: 'detetive',
        text: 'Então o DNA fica protegido no núcleo e manda cópias em RNA para o citoplasma?',
        emotion: 'thinking'
      },
      {
        speaker: 'drCell',
        text: 'EXATAMENTE! O DNA é o original precioso. O RNA é a cópia de trabalho!',
        emotion: 'happy'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Transcrição... transformar DNA em RNA. Onde isso acontece?',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'No núcleo, pela RNA polimerase!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'A transcrição cria RNA a partir do DNA no núcleo!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'PERFEITO! Agora vamos ver como o RNA vira proteína — a TRADUÇÃO!',
        emotion: 'happy'
      }
    ]
  },

  // FASE 22 - Tradução
  {
    phaseId: 22,
    title: 'Do RNA à Proteína',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Agora o mRNA sai do núcleo e vai para os RIBOSSOMOS, onde será "traduzido" em proteína!',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Tradução',
          content: 'TRADUÇÃO ocorre nos RIBOSSOMOS. O mRNA é lido em grupos de 3 bases chamados CÓDONS. Cada códon especifica um AMINOÁCIDO. O tRNA traz os aminoácidos corretos!',
          type: 'important'
        }
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'O Código Genético',
          content: 'Existem 64 códons possíveis (4³ = 64) que codificam 20 aminoácidos. AUG é o códon de INÍCIO (metionina). UAA, UAG e UGA são códons de PARADA. O código é praticamente UNIVERSAL!',
          type: 'concept'
        }
      },
      {
        speaker: 'detetive',
        text: 'Então três letras do RNA significam um aminoácido específico?',
        emotion: 'thinking'
      },
      {
        speaker: 'drCell',
        text: 'Sim! E a sequência de aminoácidos forma a PROTEÍNA. É como seguir uma receita letra por letra!',
        emotion: 'happy'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Tradução... ribossomos, códons, aminoácidos. Onde isso acontece?',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Nos ribossomos, no citoplasma ou no retículo rugoso!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'A tradução transforma mRNA em proteína nos ribossomos!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'EXCELENTE! Mas a proteína ainda precisa ser processada e enviada ao destino!',
        emotion: 'happy'
      }
    ]
  },

  // FASE 23 - Golgi e RE
  {
    phaseId: 23,
    title: 'Processamento e Empacotamento',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Depois de traduzida, muitas proteínas precisam ser MODIFICADAS e EMPACOTADAS antes de irem ao destino final!',
        emotion: 'thinking'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Retículo Endoplasmático Rugoso',
          content: 'O RER tem ribossomos grudados e produz proteínas de EXPORTAÇÃO e de MEMBRANA. As proteínas são dobradas corretamente dentro do RER e enviadas ao Golgi!',
          type: 'concept'
        }
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Complexo de Golgi',
          content: 'O GOLGI modifica, empacota e ENDEREÇA as proteínas. Adiciona açúcares, fosforilações, corta partes... É como um centro de distribuição com controle de qualidade!',
          type: 'important'
        }
      },
      {
        speaker: 'detetive',
        text: 'Então o Golgi é como um correio que prepara e envia os pacotes?',
        emotion: 'thinking'
      },
      {
        speaker: 'drCell',
        text: 'Perfeita analogia! O Golgi empacota em VESÍCULAS e manda para o destino: membrana, lisossomo ou exterior da célula!',
        emotion: 'happy'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Processamento, empacotamento... Qual organela faz isso?',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'O Complexo de Golgi!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'O Golgi modifica e empacota proteínas em vesículas!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'ÓTIMO! Agora vamos ver o fluxo COMPLETO de informação!',
        emotion: 'happy'
      }
    ]
  },

  // FASE 24 - Fluxo Completo
  {
    phaseId: 24,
    title: 'A Fábrica Completa',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Vamos juntar tudo: do gene à proteína funcional!',
        emotion: 'determined'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Fluxo de Informação Genética',
          content: '1) DNA no núcleo (informação). 2) TRANSCRIÇÃO cria mRNA. 3) mRNA vai ao citoplasma. 4) TRADUÇÃO nos ribossomos cria proteína. 5) Proteína vai ao RER/Golgi. 6) Golgi empacota e envia ao destino final.',
          type: 'important'
        }
      },
      {
        speaker: 'detetive',
        text: 'Estou pronto para dominar a síntese proteica!',
        emotion: 'determined'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'O fluxo completo... DNA, RNA, proteína. Você consegue organizar tudo?',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Transcrição no núcleo, tradução no ribossomo, processamento no Golgi!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'BLOCO DE SÍNTESE PROTEICA COMPLETO!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'IMPRESSIONANTE! Agora falta apenas um bloco: a ENERGIA CELULAR!',
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'Sete blocos... Você está mais perto do confronto final. Mas a energia celular é ESSENCIAL!',
        emotion: 'angry'
      }
    ]
  },

  // FASE 25 - Glicólise
  {
    phaseId: 25,
    title: 'Quebrando o Açúcar',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Bem-vindo à Central Energética! Aqui vamos entender como as células produzem ENERGIA!',
        emotion: 'happy'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Respiração Celular',
          content: 'A RESPIRAÇÃO CELULAR transforma GLICOSE em ATP (energia). É formada por 3 etapas: GLICÓLISE (citoplasma), CICLO DE KREBS (matriz mitocondrial), CADEIA RESPIRATÓRIA (cristas mitocondriais).',
          type: 'important'
        }
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Glicólise',
          content: 'GLICÓLISE ocorre no CITOPLASMA. Quebra 1 glicose (6C) em 2 piruvatos (3C). PRODUZ: 2 ATP + 2 NADH. NÃO precisa de oxigênio (pode ser anaeróbica)!',
          type: 'concept'
        }
      },
      {
        speaker: 'detetive',
        text: 'Então a glicólise é a primeira etapa e acontece fora da mitocôndria?',
        emotion: 'thinking'
      },
      {
        speaker: 'drCell',
        text: 'Exatamente! É a parte mais antiga da respiração — existia antes mesmo de haver oxigênio na Terra!',
        emotion: 'happy'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Glicólise... a primeira etapa. Onde ela ocorre?',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'No citoplasma!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'A glicólise ocorre no citoplasma e produz 2 ATP e 2 piruvatos!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'PERFEITO! Agora os piruvatos vão para a mitocôndria para o Ciclo de Krebs!',
        emotion: 'happy'
      }
    ]
  },

  // FASE 26 - Ciclo de Krebs
  {
    phaseId: 26,
    title: 'O Ciclo da Vida',
    introduction: [
      {
        speaker: 'drCell',
        text: 'O piruvato entra na mitocôndria e é transformado em Acetil-CoA para entrar no CICLO DE KREBS!',
        emotion: 'thinking'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Ciclo de Krebs',
          content: 'O CICLO DE KREBS (ou ciclo do ácido cítrico) ocorre na MATRIZ MITOCONDRIAL. O Acetil-CoA é oxidado completamente, liberando CO₂ e produzindo NADH, FADH₂ e 2 ATP (por glicose).',
          type: 'important'
        }
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Produtos do Ciclo de Krebs',
          content: 'Por glicose: 2 ATP, 6 NADH, 2 FADH₂, 4 CO₂. O CO₂ que você expira vem daqui! O NADH e FADH₂ carregam elétrons para a próxima etapa.',
          type: 'concept'
        }
      },
      {
        speaker: 'detetive',
        text: 'Então o CO₂ que respiramos vem do Ciclo de Krebs?',
        emotion: 'surprised'
      },
      {
        speaker: 'drCell',
        text: 'Sim! E os elétrons capturados pelo NADH vão gerar a MAIOR parte do ATP na próxima etapa!',
        emotion: 'happy'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'O ciclo que gira e gira... Onde ele ocorre?',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Na matriz mitocondrial!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'O Ciclo de Krebs ocorre na matriz mitocondrial e libera CO₂!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'ÓTIMO! Agora a grande final: a CADEIA RESPIRATÓRIA!',
        emotion: 'happy'
      }
    ]
  },

  // FASE 27 - Cadeia Respiratória
  {
    phaseId: 27,
    title: 'A Usina Máxima',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Chegamos à etapa que produz a MAIOR parte da energia: a CADEIA RESPIRATÓRIA!',
        emotion: 'determined'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Cadeia Respiratória',
          content: 'A CADEIA RESPIRATÓRIA (ou fosforilação oxidativa) ocorre nas CRISTAS MITOCONDRIAIS. Os elétrons do NADH e FADH₂ passam por proteínas, liberando energia para produzir ATP. O O₂ é o aceptor final!',
          type: 'important'
        }
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Produção Massiva de ATP',
          content: 'A cadeia respiratória produz ATÉ 34 ATP por glicose! É onde o OXIGÊNIO é usado (por isso "respiração"). O saldo total da respiração: 36–38 ATP por glicose!',
          type: 'concept'
        }
      },
      {
        speaker: 'detetive',
        text: 'Então é por isso que precisamos respirar oxigênio — para essa etapa!',
        emotion: 'surprised'
      },
      {
        speaker: 'drCell',
        text: 'EXATAMENTE! Sem O₂, a cadeia para e só produzimos 2 ATP (glicólise). Com O₂, produzimos até 38!',
        emotion: 'happy'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'A última etapa da respiração... Onde ela ocorre?',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Nas cristas mitocondriais!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'BLOCO DE ENERGIA CELULAR COMPLETO! A cadeia respiratória ocorre nas cristas e produz a maior parte do ATP!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'EXTRAORDINÁRIO! Você dominou todos os blocos de conhecimento! Agora só falta... O CONFRONTO FINAL!',
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'OITO BLOCOS! Você ousou chegar até aqui... Mas agora vai me enfrentar PESSOALMENTE!',
        emotion: 'evil'
      },
      {
        speaker: 'narrador',
        text: 'O Detetive está preparado. Todo o conhecimento foi recuperado. Agora é hora do confronto final contra o Fragmentado!'
      }
    ]
  },

  // FASE 28 - Revisão Geral
  {
    phaseId: 28,
    title: 'Preparação para o Confronto',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Detetive, antes do confronto final, vamos revisar TUDO que aprendemos!',
        emotion: 'determined'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Revisão: História da Teoria Celular',
          content: 'HOOKE: nomeou células (1665). LEEUWENHOEK: viu vida microscópica. SCHLEIDEN + SCHWANN: todos os seres vivos são feitos de células. VIRCHOW: toda célula vem de outra célula.',
          type: 'important'
        }
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Revisão: Tipos de Célula',
          content: 'PROCARIONTES: sem núcleo, bactérias e arqueias. EUCARIONTES: com núcleo, animais, plantas, fungos, protistas. Principal diferença: PRESENÇA DO NÚCLEO!',
          type: 'concept'
        }
      },
      {
        speaker: 'detetive',
        text: 'Eu me lembro de tudo! Vamos acabar com o Fragmentado!',
        emotion: 'determined'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Revisão? Você vai precisar de mais do que isso para me derrotar!',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Confie em tudo que aprendeu!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'Revisão completa! Estou preparado!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'Você está pronto, Detetive. A maratona final começa agora!',
        emotion: 'happy'
      }
    ]
  },

  // FASE 29 - Maratona
  {
    phaseId: 29,
    title: 'A Maratona Final',
    introduction: [
      {
        speaker: 'drCell',
        text: 'Esta é a MARATONA — um teste de resistência que vai testar TODO seu conhecimento!',
        emotion: 'determined'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Revisão: Organelas',
          content: 'MITOCÔNDRIA: energia (ATP). CLOROPLASTO: fotossíntese. LISOSSOMO: digestão. RIBOSSOMO: síntese proteica. GOLGI: empacotamento. RER: proteínas de exportação. REL: lipídios.',
          type: 'important'
        }
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'Revisão: Membrana e Transporte',
          content: 'MEMBRANA: bicamada de fosfolipídios + proteínas (mosaico fluido). PASSIVO: sem ATP (difusão, osmose). ATIVO: com ATP (bomba Na⁺/K⁺). ENDO/EXOCITOSE: transporte em massa.',
          type: 'concept'
        }
      },
      {
        speaker: 'detetive',
        text: 'Vou dar tudo de mim nesta maratona!',
        emotion: 'determined'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'Uma maratona de conhecimento... Vamos ver quanto tempo você aguenta!',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Foco, Detetive! Cada acerto te aproxima da vitória!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'MARATONA COMPLETA! Estou pronto para o BOSS!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'INCRÍVEL! Agora só falta o último desafio: DERROTAR O FRAGMENTADO!',
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'CHEGOU A HORA! PREPARE-SE PARA O FIM, DETETIVE!',
        emotion: 'evil'
      }
    ]
  },

  // FASE 30 - BOSS FINAL
  {
    phaseId: 30,
    title: 'O Confronto Final',
    introduction: [
      {
        speaker: 'narrador',
        text: 'Após uma longa jornada, o Detetive finalmente chega ao núcleo central do laboratório, onde o Fragmentado espera...'
      },
      {
        speaker: 'drCell',
        text: 'Detetive... você chegou até aqui. Você recuperou quase todo o conhecimento que o Fragmentado roubou!',
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'HA HA HA! Finalmente nos encontramos, Detetive. Você acha que algumas memórias recuperadas podem me derrotar?',
        emotion: 'evil'
      },
      {
        speaker: 'detetive',
        text: 'Eu aprendi tudo sobre citologia! Das células de Hooke até a produção de ATP! Não tenho medo de você!',
        emotion: 'determined'
      },
      {
        speaker: 'fragmentado',
        text: 'Palavras corajosas... Mas agora você vai enfrentar o TESTE FINAL! Vou usar TODO o meu poder para confundir sua mente!',
        emotion: 'evil'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'A Batalha Final',
          content: 'Neste confronto, você será testado em TODOS os tópicos que aprendeu: História da Teoria Celular, Tipos de Célula, Organelas, Membrana, Transporte, Síntese Proteica e Energia Celular. Use TODO seu conhecimento!',
          type: 'important'
        }
      },
      {
        speaker: 'drCell',
        text: 'Detetive, você aprendeu muito! Use todo esse conhecimento como sua ARMA! Cada resposta correta enfraquece o Fragmentado!',
        emotion: 'determined'
      },
      {
        speaker: 'detetive',
        text: 'Vamos acabar com isso! Pelo Dr. Cell, pela ciência, pela CITOLOGIA!',
        emotion: 'determined'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: 'PREPARE-SE! Este é o fim da linha para você! EU SOU O FRAGMENTADO, a personificação da ignorância!',
        emotion: 'evil'
      },
      {
        speaker: 'fragmentado',
        text: 'Enquanto existir alguém que não conhece as células, EU EXISTIREI! Mas você... você quer destruir tudo que construí!',
        emotion: 'evil'
      },
      {
        speaker: 'detetive',
        text: 'O conhecimento é a luz que dissipa a escuridão da ignorância. É hora de você desaparecer!',
        emotion: 'determined'
      },
      {
        speaker: 'drCell',
        text: 'VAI, DETETIVE! MOSTRE O PODER DO CONHECIMENTO!',
        emotion: 'happy'
      }
    ],
    conclusion: [
      {
        speaker: 'narrador',
        text: 'Com um último acerto brilhante, o Detetive desfere o golpe final no Fragmentado!'
      },
      {
        speaker: 'fragmentado',
        text: 'NÃÃÃÃO! O conhecimento... é forte demais! Eu... estou... desaparecendo...',
        emotion: 'angry'
      },
      {
        speaker: 'drCell',
        text: 'DETETIVE! VOCÊ CONSEGUIU! O Fragmentado foi derrotado! Todo o conhecimento foi restaurado!',
        emotion: 'happy'
      },
      {
        speaker: 'detetive',
        text: 'Nós conseguimos, Dr. Cell! Juntos, reconstruímos todo o conhecimento sobre citologia!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'Você aprendeu sobre Hooke, Leeuwenhoek, a Teoria Celular, procariontes, eucariontes, organelas, membrana, transporte, proteínas, energia...',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: 'Você agora é um verdadeiro ESPECIALISTA em citologia! Use esse conhecimento para iluminar o mundo!',
        emotion: 'happy'
      },
      {
        speaker: 'narrador',
        text: 'E assim, o Detetive completou sua jornada. O conhecimento sobre células foi restaurado, e a ciência triunfou sobre a ignorância. FIM.'
      },
      {
        speaker: 'info',
        text: '',
        infoBox: {
          title: 'PARABÉNS!',
          content: 'Você completou o CytoQuest! Agora você domina: Teoria Celular, Tipos de Célula, Organelas (mitocôndria, lisossomo, cloroplasto), Célula Animal vs. Vegetal, Membrana Plasmática, Transporte Celular, Síntese de Proteínas e Metabolismo Energético. Está pronto para os vestibulares!',
          type: 'important'
        }
      }
    ]
  }
]

// Função para obter a história de uma fase
export function getPhaseStory(phaseId: number): PhaseStory | undefined {
  return PHASE_STORIES.find(s => s.phaseId === phaseId)
}

// Histórias padrão para fases sem história específica
export function getDefaultStory(phaseId: number, phaseName: string, theme: string): PhaseStory {
  return {
    phaseId,
    title: phaseName,
    introduction: [
      {
        speaker: 'drCell',
        text: `Detetive, chegamos a uma nova área de investigação: ${phaseName}!`,
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: `Aqui vamos explorar tudo sobre ${theme}. Preste muita atenção, pois o Fragmentado pode aparecer a qualquer momento!`,
        emotion: 'thinking'
      },
      {
        speaker: 'detetive',
        text: 'Estou pronto, Dr. Cell! Vamos recuperar mais fragmentos do conhecimento!',
        emotion: 'determined'
      }
    ],
    villainChallenge: [
      {
        speaker: 'fragmentado',
        text: `Ha ha ha! Você acha que entende ${theme}? Vamos testar isso!`,
        emotion: 'evil'
      },
      {
        speaker: 'fragmentado',
        text: 'Mostre o que aprendeu... se é que aprendeu alguma coisa!',
        emotion: 'evil'
      },
      {
        speaker: 'drCell',
        text: 'Concentre-se, Detetive! Você sabe a resposta!',
        emotion: 'determined'
      }
    ],
    conclusion: [
      {
        speaker: 'detetive',
        text: 'Mais um fragmento recuperado!',
        emotion: 'happy'
      },
      {
        speaker: 'drCell',
        text: `Excelente! Você dominou ${theme}! Vamos continuar nossa jornada!`,
        emotion: 'happy'
      },
      {
        speaker: 'fragmentado',
        text: 'Isso não acabou, Detetive... Nos veremos novamente!',
        emotion: 'angry'
      }
    ]
  }
}