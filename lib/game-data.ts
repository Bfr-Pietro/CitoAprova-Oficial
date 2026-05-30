import type { Question, Room } from './game-types'

export const rooms: Room[] = [
  {
    id: 1,
    name: 'Arquivo Histórico',
    theme: 'História da Teoria Celular',
    description: 'Descubra as origens da teoria celular e os cientistas pioneiros.',
    icon: 'scroll',
    casesRange: [1, 3],
    isUnlocked: true
  },
  {
    id: 2,
    name: 'Setor de Microbiologia',
    theme: 'Tipos de Célula',
    description: 'Investigue as diferenças entre procariontes e eucariontes.',
    icon: 'microscope',
    casesRange: [4, 6],
    isUnlocked: false
  },
  {
    id: 3,
    name: 'Cidade Celular',
    theme: 'Organelas Celulares',
    description: 'Explore as estruturas internas das células.',
    icon: 'building',
    casesRange: [7, 9],
    isUnlocked: false
  },
  {
    id: 4,
    name: 'Laboratório Botânico',
    theme: 'Célula Animal vs Vegetal',
    description: 'Compare as diferenças estruturais entre células animais e vegetais.',
    icon: 'leaf',
    casesRange: [10, 12],
    isUnlocked: false
  },
  {
    id: 5,
    name: 'Controle de Fronteira',
    theme: 'Membrana Plasmática',
    description: 'Analise a estrutura e funções da membrana celular.',
    icon: 'shield',
    casesRange: [13, 16],
    isUnlocked: false
  },
  {
    id: 6,
    name: 'Sistema de Transporte',
    theme: 'Transporte Celular',
    description: 'Desvende os mecanismos de transporte através da membrana.',
    icon: 'truck',
    casesRange: [17, 20],
    isUnlocked: false
  },
  {
    id: 7,
    name: 'Fábrica Celular',
    theme: 'Organelas Avançadas',
    description: 'Investigue a produção de proteínas e secreção celular.',
    icon: 'factory',
    casesRange: [21, 24],
    isUnlocked: false
  },
  {
    id: 8,
    name: 'Central Energética',
    theme: 'Metabolismo Celular',
    description: 'Descubra como as células produzem e utilizam energia.',
    icon: 'zap',
    casesRange: [25, 27],
    isUnlocked: false
  },
  {
    id: 9,
    name: 'Núcleo Central',
    theme: 'Revisão Final',
    description: 'Restaure completamente a memória do Dr. Cell.',
    icon: 'brain',
    casesRange: [28, 30],
    isUnlocked: false
  }
]

export const questions: Question[] = [
  // CASO 1 - Historia da Teoria Celular
  {
    id: 1,
    roomId: 1,
    theme: 'Historia da Teoria Celular',
    caseTitle: 'O Primeiro Observador',
    dialogues: [
      { speaker: 'drCell', text: 'Detetive, bem-vindo ao Arquivo Historico! Este e o comeco da nossa jornada para restaurar minha memoria.' },
      { speaker: 'drCell', text: 'Antes de comecarmos, deixe-me explicar algo importante: tudo que voce conhece sobre seres vivos... plantas, animais, bacterias, fungos... todos tem algo em comum.' },
      { speaker: 'drCell', text: 'Todos sao formados por CELULAS - pequenas unidades microscopicas que sao os "tijolos" da vida. Mas nem sempre soubemos disso!' },
      { speaker: 'teaching', text: 'A celula e a menor unidade capaz de realizar todas as funcoes de um ser vivo. Ela pode se reproduzir, obter energia, crescer e reagir ao ambiente.' },
      { speaker: 'drCell', text: 'Agora, vamos investigar como tudo comecou. O primeiro caso nos leva ao ano de 1665, na Inglaterra...' },
      { speaker: 'narrative', text: 'Robert Hooke era um cientista curioso que construiu um microscopio primitivo. Ele decidiu observar um pedaco fino de cortica - aquele material marrom que vem da casca de certas arvores e e usado em rolhas.' },
      { speaker: 'narrative', text: 'Ao olhar pelo microscopio, Hooke viu algo incrivel: a cortica era formada por milhares de pequenos compartimentos vazios, como favos de mel!' },
      { speaker: 'narrative', text: 'Ele chamou esses compartimentos de "cellulae" (celulas em latim), que significa "pequenos quartos" - lembravam os quartos de monges em mosteiros.' },
      { speaker: 'teaching', text: 'Importante: Hooke viu apenas as PAREDES dos compartimentos, nao celulas vivas completas. A cortica e um tecido vegetal morto - suas celulas perderam o conteudo interno.' },
      { speaker: 'fragmento', text: 'Ha ha ha! Que interessante... Hooke descobriu celulas, mas sera que ele realmente as entendeu? Sera que voce consegue explicar o que ele NAO viu?' }
    ],
    question: 'Por que Robert Hooke nao observou celulas vivas ao estudar a cortica? O que ele realmente viu?',
    expectedAnswer: 'Porque a cortica e um tecido morto composto apenas por paredes celulares vazias, sem citoplasma ou nucleo.',
    keywords: ['morta', 'mortas', 'morto', 'tecido morto', 'sem vida', 'celulas mortas', 'parede celular', 'vazia', 'vazias', 'paredes'],
    hint: 'Pense: a cortica vem de uma arvore, mas ja nao esta viva. O que resta quando uma celula morre?',
    explanation: 'Robert Hooke observou apenas as PAREDES CELULARES da cortica porque este e um tecido vegetal MORTO. Quando as celulas da cortica morrem, todo o conteudo interno (citoplasma, nucleo, organelas) se decompoe, restando apenas a parede celular rigida feita de celulose e suberina. Por isso Hooke viu "compartimentos vazios" - ele estava vendo os "esqueletos" das celulas, nao celulas completas e vivas!'
  },

  // CASO 2
  {
    id: 2,
    roomId: 1,
    theme: 'Historia da Teoria Celular',
    caseTitle: 'O Cacador de Microbios',
    dialogues: [
      { speaker: 'drCell', text: 'Excelente trabalho no primeiro caso! Agora a historia fica ainda mais interessante.' },
      { speaker: 'drCell', text: 'Enquanto Hooke observava celulas mortas na Inglaterra, um comerciante holandes estava prestes a fazer descobertas ainda mais revolucionarias...' },
      { speaker: 'narrative', text: 'Antonie van Leeuwenhoek (1632-1723) nao era um cientista de formacao - era um vendedor de tecidos em Delft, Holanda. Mas tinha uma paixao: construir lentes.' },
      { speaker: 'narrative', text: 'Com paciencia incrivel, ele polia lentes de vidro ate conseguir ampliacoes de ate 300 vezes! Eram os microscopios mais potentes do mundo na epoca.' },
      { speaker: 'teaching', text: 'Microscopios funcionam usando lentes que desviam a luz para ampliar objetos pequenos. Quanto melhor a lente, maior a ampliacao e mais detalhes podemos ver.' },
      { speaker: 'narrative', text: 'Leeuwenhoek observou tudo que podia: agua de lagoa, raspagens de dentes, sangue... E descobriu um mundo invisivel cheio de criaturas minusculas!' },
      { speaker: 'narrative', text: 'Ele chamou essas criaturas de "animaculos" (pequenos animais). Eram bacterias, protozoarios e outros organismos UNICELULARES - seres formados por uma unica celula!' },
      { speaker: 'teaching', text: 'Organismos unicelulares sao seres vivos completos formados por apenas UMA celula. Essa unica celula faz tudo: se alimenta, se reproduz, reage ao ambiente. Exemplos: bacterias, amebas, paramecio.' },
      { speaker: 'drCell', text: 'Leeuwenhoek foi o primeiro ser humano a ver vida microscopica! Bacterias, protozoarios... um universo inteiro invisivel a olho nu.' },
      { speaker: 'fragmento', text: 'Um simples comerciante revelou segredos que os grandes cientistas nao viram... Voce consegue identificar a grande contribuicao dele?' }
    ],
    question: 'Qual foi a principal contribuicao de Leeuwenhoek para a biologia celular?',
    expectedAnswer: 'Ele foi o primeiro a observar organismos unicelulares vivos, como bacterias e protozoarios.',
    keywords: ['unicelular', 'unicelulares', 'bacteria', 'bacterias', 'protozoario', 'protozoarios', 'vivos', 'vivas', 'microorganismo', 'microorganismos', 'animaculos', 'vida microscopica', 'seres vivos'],
    hint: 'Diferente de Hooke que viu celulas mortas, Leeuwenhoek viu algo muito especial - criaturas que se moviam!',
    explanation: 'Leeuwenhoek foi o PRIMEIRO a observar ORGANISMOS VIVOS UNICELULARES - bacterias, protozoarios, espermatozoides e outros. Enquanto Hooke viu apenas estruturas mortas, Leeuwenhoek descobriu que existem seres VIVOS compostos por uma UNICA celula! Isso revolucionou a ciencia, provando que a vida existe em escalas microscopicas.'
  },

  // CASO 3
  {
    id: 3,
    roomId: 1,
    theme: 'Historia da Teoria Celular',
    caseTitle: 'Os Arquitetos da Teoria',
    dialogues: [
      { speaker: 'drCell', text: 'Maravilha! Voce esta restaurando minha memoria perfeitamente. Agora chegamos a um momento crucial da historia.' },
      { speaker: 'drCell', text: 'Depois de Hooke e Leeuwenhoek, muitos cientistas observaram celulas durante quase 200 anos. Mas ninguem havia conectado todas essas observacoes em uma TEORIA unificada.' },
      { speaker: 'teaching', text: 'Uma teoria cientifica nao e um "palpite". E uma explicacao bem testada que unifica muitas observacoes e pode fazer previsoes sobre a natureza.' },
      { speaker: 'narrative', text: 'Em 1838, o botanico alemao Matthias Schleiden estava estudando plantas. Ele percebeu algo importante: TODAS as plantas que observava eram formadas por celulas.' },
      { speaker: 'narrative', text: 'No ano seguinte, 1839, o zoologo Theodor Schwann chegou a mesma conclusao estudando animais: TODOS os animais tambem eram formados por celulas!' },
      { speaker: 'narrative', text: 'Os dois cientistas se encontraram e perceberam que haviam descoberto algo imenso: tanto plantas quanto animais compartilham a mesma unidade basica - a celula!' },
      { speaker: 'teaching', text: 'Isso foi revolucionario! Antes, cientistas achavam que plantas e animais eram completamente diferentes. A Teoria Celular mostrou que toda vida compartilha uma base comum.' },
      { speaker: 'drCell', text: 'Juntos, Schleiden e Schwann formularam a Teoria Celular, que estabelece um principio fundamental sobre TODOS os seres vivos...' },
      { speaker: 'fragmento', text: 'Dois cientistas, uma verdade universal... Mas voce sabe qual e essa verdade que conecta TODA a vida na Terra?' }
    ],
    question: 'Qual e o principio fundamental estabelecido por Schleiden e Schwann na Teoria Celular?',
    expectedAnswer: 'Todos os seres vivos sao formados por celulas.',
    keywords: ['todos', 'seres vivos', 'formados', 'celulas', 'unidade', 'basica', 'fundamental', 'constituidos', 'compostos'],
    hint: 'Um estudava plantas, outro animais... O que eles descobriram que AMBOS tinham em comum?',
    explanation: 'O principio fundamental da Teoria Celular de Schleiden e Schwann e: TODOS OS SERES VIVOS SAO FORMADOS POR CELULAS. Isso significa que nao importa se e uma baleia, uma bacteria, uma arvore ou um cogumelo - todos sao feitos de celulas! A celula e a unidade estrutural basica de toda forma de vida conhecida.'
  },

  // CASO 4 - Tipos de Celula
  {
    id: 4,
    roomId: 2,
    theme: 'Tipos de Celula',
    caseTitle: 'Celulas Primitivas',
    dialogues: [
      { speaker: 'drCell', text: 'Bem-vindo ao Setor de Microbiologia, Detetive! Aqui vamos explorar os diferentes TIPOS de celulas que existem.' },
      { speaker: 'drCell', text: 'Nem todas as celulas sao iguais. Na verdade, existem dois grandes grupos muito diferentes: PROCARIONTES e EUCARIONTES.' },
      { speaker: 'teaching', text: 'A palavra "procarionte" vem do grego: "pro" (antes) + "karyon" (nucleo). Significa "antes do nucleo". Ja "eucarionte" significa "nucleo verdadeiro" (eu = verdadeiro).' },
      { speaker: 'drCell', text: 'As celulas procariontes sao as mais antigas e simples. Elas dominaram a Terra SOZINHAS por quase 2 bilhoes de anos!' },
      { speaker: 'narrative', text: 'Imagine: ha 3,5 bilhoes de anos, a Terra era um lugar muito diferente. Nao havia animais, plantas ou fungos. Apenas celulas simples, as procariontes, nadavam nos oceanos primitivos.' },
      { speaker: 'narrative', text: 'Essas celulas nao tem um nucleo organizado. Seu material genetico (DNA) fica solto no citoplasma, em uma regiao chamada nucleoide.' },
      { speaker: 'teaching', text: 'O NUCLEO e um compartimento especial que guarda e protege o DNA. Celulas procariontes NAO tem esse compartimento - o DNA fica "solto" dentro da celula.' },
      { speaker: 'narrative', text: 'Hoje, os organismos procariontes ainda existem em grande quantidade: sao as BACTERIAS e as ARQUEAS. Estao em todo lugar - no solo, na agua, no seu intestino!' },
      { speaker: 'fragmento', text: 'Tao simples, tao antigas... mas o que DEFINE uma celula procarionte? Qual e sua caracteristica principal?' }
    ],
    question: 'O que caracteriza uma celula procarionte e quais sao os principais grupos de organismos que possuem esse tipo celular?',
    expectedAnswer: 'Celulas procariontes nao possuem nucleo definido (carioteca) e sao encontradas em bacterias e arqueas.',
    keywords: ['sem nucleo', 'nucleo', 'carioteca', 'bacteria', 'bacterias', 'arquea', 'arqueas', 'membrana nuclear', 'procarionte', 'nucleoide'],
    hint: 'A pista esta no nome: "pro" = antes, "karyon" = nucleo. O que isso sugere sobre essas celulas?',
    explanation: 'Celulas PROCARIONTES se caracterizam pela AUSENCIA DE NUCLEO DEFINIDO. Elas nao tem carioteca (membrana nuclear), entao o DNA fica disperso no citoplasma em uma regiao chamada nucleoide. Os dois grupos de organismos procariontes sao as BACTERIAS e as ARQUEAS. Sao celulas mais simples e antigas, mas extremamente bem-sucedidas!'
  },

  // CASO 5
  {
    id: 5,
    roomId: 2,
    theme: 'Tipos de Celula',
    caseTitle: 'A Evolucao Celular',
    dialogues: [
      { speaker: 'drCell', text: 'Agora vamos conhecer o outro grande grupo: as celulas EUCARIONTES - incluindo as suas proprias celulas!' },
      { speaker: 'drCell', text: 'Ha cerca de 2 bilhoes de anos, algo incrivel aconteceu na evolucao. Surgiram celulas muito mais complexas e organizadas.' },
      { speaker: 'narrative', text: 'As celulas eucariontes desenvolveram algo revolucionario: compartimentos internos separados por membranas. E o mais importante deles e o NUCLEO.' },
      { speaker: 'teaching', text: 'O NUCLEO e como um "cofre" da celula. Ele guarda o DNA (material genetico) protegido por uma membrana dupla chamada CARIOTECA ou envelope nuclear.' },
      { speaker: 'narrative', text: 'Mas nao para ai! Celulas eucariontes tem muitos outros compartimentos especializados, chamados ORGANELAS: mitocondriais para energia, reticulo para transporte, lisossomos para digestao...' },
      { speaker: 'teaching', text: 'ORGANELAS sao como "orgaos" da celula - estruturas especializadas em funcoes especificas. A maioria e envolta por membranas, criando ambientes separados dentro da celula.' },
      { speaker: 'drCell', text: 'Animais, plantas, fungos e protozoarios - todos tem celulas eucariontes. Voce, Detetive, e feito de TRILHOES de celulas eucariontes!' },
      { speaker: 'narrative', text: 'Comparando: uma bacteria (procarionte) e como um estudio simples. Uma celula eucarionte e como um apartamento de luxo com varios comodos especializados!' },
      { speaker: 'fragmento', text: 'Simples versus complexo... Mas qual e a PRINCIPAL diferenca estrutural entre esses dois tipos de celula?' }
    ],
    question: 'Qual e a principal diferenca estrutural entre celulas eucariontes e procariontes?',
    expectedAnswer: 'Celulas eucariontes possuem nucleo definido delimitado por carioteca (membrana nuclear), enquanto procariontes nao.',
    keywords: ['nucleo', 'carioteca', 'membrana nuclear', 'definido', 'delimitado', 'organelas', 'compartimentalizacao'],
    hint: 'Os nomes ja dao a dica: "eu" = verdadeiro, "pro" = antes, "karyon" = nucleo...',
    explanation: 'A PRINCIPAL diferenca e a presenca do NUCLEO VERDADEIRO nas celulas eucariontes! O nucleo e delimitado pela CARIOTECA (membrana nuclear dupla), que protege o material genetico. Alem disso, eucariontes possuem diversas ORGANELAS MEMBRANOSAS (mitocondrias, reticulo, Golgi, etc.) que nao existem em procariontes. E a compartimentalizacao!'
  },

  // CASO 6
  {
    id: 6,
    roomId: 2,
    theme: 'Tipos de Celula',
    caseTitle: 'A Origem das Celulas',
    dialogues: [
      { speaker: 'drCell', text: 'Excelente progresso! Agora vamos completar a Teoria Celular com uma descoberta crucial feita anos depois de Schleiden e Schwann.' },
      { speaker: 'drCell', text: 'Havia uma pergunta importante que a teoria original nao respondia: DE ONDE vem as novas celulas?' },
      { speaker: 'narrative', text: 'Na epoca, muitos acreditavam na "geracao espontanea" - a ideia de que seres vivos podiam surgir do nada, de materia nao-viva.' },
      { speaker: 'narrative', text: 'Em 1855, o medico alemao Rudolf Virchow estudava doencas e percebia que tecidos doentes vinham de celulas que se dividiam de forma anormal.' },
      { speaker: 'teaching', text: 'Virchow era um patologista - estudava doencas atraves de celulas. Ele entendeu que para uma celula doente existir, ela precisava vir de outra celula.' },
      { speaker: 'narrative', text: 'Virchow proclamou uma frase que se tornou famosa: "Omnis cellula e cellula" - do latim, significa "Toda celula vem de outra celula".' },
      { speaker: 'teaching', text: 'Isso significa que celulas nao surgem do nada! Uma celula so pode nascer atraves da DIVISAO de uma celula que ja existia antes dela.' },
      { speaker: 'drCell', text: 'Este principio completou a Teoria Celular e refutou a geracao espontanea. A vida vem da vida!' },
      { speaker: 'fragmento', text: 'Omnis cellula e cellula... Palavras antigas, verdade eterna. Mas voce entendeu o que elas significam?' }
    ],
    question: 'Segundo Virchow, de onde se originam as novas celulas?',
    expectedAnswer: 'Toda celula se origina de outra celula preexistente.',
    keywords: ['outra celula', 'preexistente', 'celula anterior', 'divisao', 'celula mae', 'reproducao celular', 'celulas existentes', 'vem de'],
    hint: 'A frase em latim da a resposta: "Omnis cellula e cellula" = Toda celula vem de...',
    explanation: 'Virchow estabeleceu que TODA CELULA SE ORIGINA DE OUTRA CELULA PREEXISTENTE. Celulas nao surgem do nada - elas nascem atraves da divisao de uma celula-mae. Este principio completou a Teoria Celular e derrubou a ideia de geracao espontanea. Voce existe porque uma celula (o zigoto) se dividiu trilhoes de vezes!'
  },

  // CASO 7 - Organelas Celulares
  {
    id: 7,
    roomId: 3,
    theme: 'Organelas Celulares',
    caseTitle: 'A Usina de Energia',
    dialogues: [
      { speaker: 'drCell', text: 'Bem-vindo a Cidade Celular! Aqui vamos explorar as ORGANELAS - as estruturas especializadas dentro das celulas eucariontes.' },
      { speaker: 'drCell', text: 'Pense na celula como uma cidade. Cada organela e um "predio" com uma funcao especifica. E toda cidade precisa de energia!' },
      { speaker: 'teaching', text: 'Assim como cidades tem usinas eletricas, celulas tem suas proprias "usinas" que produzem a energia necessaria para todas as atividades.' },
      { speaker: 'narrative', text: 'A organela responsavel pela producao de energia e muito especial. Tem formato de feijao ou salsicha, possui DUAS membranas e, incrivelmente, tem seu proprio DNA!' },
      { speaker: 'narrative', text: 'Dentro dela ocorre a RESPIRACAO CELULAR - o processo que "queima" glicose usando oxigenio para produzir ATP, a moeda energetica da celula.' },
      { speaker: 'teaching', text: 'ATP (adenosina trifosfato) e como o "dinheiro" da celula. Toda atividade que gasta energia usa ATP: mover musculos, produzir proteinas, transportar substancias...' },
      { speaker: 'drCell', text: 'Curiosidade incrivel: essa organela provavelmente ja foi uma bacteria independente! Ha bilhoes de anos, ela foi "engolida" por uma celula maior e passou a viver dentro dela.' },
      { speaker: 'teaching', text: 'Isso se chama TEORIA ENDOSSIMBIOTICA. Explica por que mitocondrias tem DNA proprio e se reproduzem independentemente dentro da celula!' },
      { speaker: 'fragmento', text: 'Energia e poder! Mas voce sabe o nome dessa poderosa usina celular?' }
    ],
    question: 'Qual organela e responsavel pela producao de ATP atraves da respiracao celular?',
    expectedAnswer: 'A mitocondria e a organela responsavel pela producao de ATP.',
    keywords: ['mitocondria', 'mitocondrias'],
    hint: 'E uma organela com DNA proprio, duas membranas, e funciona como a "usina de energia" da celula...',
    explanation: 'A MITOCONDRIA e a organela responsavel pela respiracao celular aerobica, processo que converte GLICOSE + OXIGENIO em ATP (energia), agua e gas carbonico. E chamada de "usina energetica" da celula. Possui DNA proprio e dupla membrana, evidencias de que evoluiu de bacterias atraves de endossimbiose!'
  },

  // CASO 8
  {
    id: 8,
    roomId: 3,
    theme: 'Organelas Celulares',
    caseTitle: 'O Sistema de Reciclagem',
    dialogues: [
      { speaker: 'drCell', text: 'Continuando nosso tour pela Cidade Celular! Toda cidade organizada precisa de um sistema de limpeza e reciclagem, certo?' },
      { speaker: 'drCell', text: 'As celulas tambem tem seu proprio "departamento de limpeza" - pequenas bolsas cheias de substancias poderosas.' },
      { speaker: 'narrative', text: 'Imagine uma pequena vesicula (bolsa membranosa) cheia de ENZIMAS DIGESTIVAS. Essas enzimas podem quebrar praticamente qualquer molecula organica!' },
      { speaker: 'teaching', text: 'ENZIMAS sao proteinas especiais que aceleram reacoes quimicas. Enzimas DIGESTIVAS quebram moleculas grandes em pedacos menores.' },
      { speaker: 'narrative', text: 'Essas vesiculas sao como "estômagos" microscopicos. Elas digerem bacterias invasoras que a celula engoliu, organelas velhas e danificadas, e ate partes da propria celula quando necessario.' },
      { speaker: 'teaching', text: 'Quando a celula precisa se "reciclar", essas organelas digerem partes antigas e os materiais sao reaproveitados. Isso se chama AUTOFAGIA (auto = proprio, fagia = comer).' },
      { speaker: 'drCell', text: 'Se essa organela se romper e liberar suas enzimas, pode digerir a propria celula! Por isso, e essencial que ela permaneca intacta.' },
      { speaker: 'narrative', text: 'Doencas como Tay-Sachs e Gaucher acontecem quando essas organelas nao funcionam direito e lixo se acumula nas celulas.' },
      { speaker: 'fragmento', text: 'Digestao e destruicao... O nome dessa organela lembra "dissolver". Voce sabe qual e?' }
    ],
    question: 'Qual organela e responsavel pela digestao intracelular e reciclagem de componentes celulares?',
    expectedAnswer: 'O lisossomo e responsavel pela digestao intracelular.',
    keywords: ['lisossomo', 'lisossomos', 'lisossoma', 'lisossomas'],
    hint: 'O nome vem do grego "lysis" (dissolver) + "soma" (corpo). E uma bolsa cheia de enzimas digestivas...',
    explanation: 'O LISOSSOMO e a organela responsavel pela digestao intracelular. Contem cerca de 50 tipos de enzimas digestivas (hidrolases) que degradam macromoleculas, destroem patogenos englobados por fagocitose e reciclam organelas danificadas (autofagia). Funciona em pH acido e e essencial para a "limpeza" celular!'
  },

  // CASO 9
  {
    id: 9,
    roomId: 3,
    theme: 'Organelas Celulares',
    caseTitle: 'A Fabrica Verde',
    dialogues: [
      { speaker: 'drCell', text: 'Agora vamos conhecer uma organela EXCLUSIVA das celulas vegetais - e uma das mais importantes do planeta!' },
      { speaker: 'drCell', text: 'Voce ja parou para pensar de onde vem o oxigenio que respiramos? Ou de onde vem a energia em toda a comida que comemos?' },
      { speaker: 'teaching', text: 'TODA a energia que sustenta a vida na Terra (exceto algumas bacterias) vem originalmente do SOL. Mas animais nao conseguem usar luz solar diretamente...' },
      { speaker: 'narrative', text: 'Plantas, algas e algumas bacterias tem uma habilidade incrivel: conseguem capturar a luz do sol e transforma-la em alimento! Esse processo se chama FOTOSSINTESE.' },
      { speaker: 'teaching', text: 'FOTOSSINTESE: "foto" = luz, "sintese" = producao. E o processo que usa luz solar + agua + gas carbonico para produzir GLICOSE (acucar) e liberar OXIGENIO.' },
      { speaker: 'narrative', text: 'Nas plantas, a fotossintese acontece dentro de organelas verdes chamadas... bem, voce vai descobrir! Elas contem CLOROFILA, o pigmento verde que captura a luz.' },
      { speaker: 'narrative', text: 'Assim como as mitocondrias, essas organelas tem DNA proprio e provavelmente evoluiram de bacterias fotossintetizantes que foram engolidas por celulas maiores!' },
      { speaker: 'drCell', text: 'Sem essa organela, nao haveria oxigenio na atmosfera e nenhum animal poderia existir. Ela e literalmente a base da vida na Terra!' },
      { speaker: 'fragmento', text: 'Verde como a esperanca, poderoso como o sol... Qual e o nome dessa fabrica de vida?' }
    ],
    question: 'Qual organela realiza a fotossintese nas celulas vegetais?',
    expectedAnswer: 'O cloroplasto e a organela que realiza a fotossintese.',
    keywords: ['cloroplasto', 'cloroplastos', 'plastidio', 'plastidios'],
    hint: 'E verde por causa da clorofila, tem DNA proprio como a mitocondria, e transforma luz em alimento...',
    explanation: 'O CLOROPLASTO e a organela onde ocorre a FOTOSSINTESE! Contem CLOROFILA (pigmento verde) que captura energia luminosa e a usa para transformar CO2 e H2O em glicose e O2. Como a mitocondria, possui DNA proprio e dupla membrana, sugerindo origem endossimbiotica. Esta presente em plantas e algas!'
  },

  // CASO 10 - Celula Animal vs Vegetal
  {
    id: 10,
    roomId: 4,
    theme: 'Celula Animal vs Vegetal',
    caseTitle: 'A Armadura Vegetal',
    dialogues: [
      { speaker: 'drCell', text: 'Bem-vindo ao Laboratorio Botanico! Aqui vamos comparar celulas ANIMAIS e VEGETAIS - ambas eucariontes, mas com diferencas importantes.' },
      { speaker: 'drCell', text: 'Ja notou que plantas conseguem ficar em pe sem ter esqueleto? Como uma arvore de 30 metros fica ereta sem ossos?' },
      { speaker: 'teaching', text: 'A resposta esta em uma estrutura que as celulas vegetais tem e as animais NAO tem - uma "capa" rigida por fora da membrana plasmatica.' },
      { speaker: 'narrative', text: 'Imagine vestir cada celula com uma armadura rigida. Essa estrutura fica do lado de FORA da membrana plasmatica, envolvendo a celula completamente.' },
      { speaker: 'narrative', text: 'Essa estrutura e feita principalmente de CELULOSE - o mesmo material do papel e do algodao! Celulose e um carboidrato muito resistente.' },
      { speaker: 'teaching', text: 'CELULOSE e formada por milhares de moleculas de glicose (acucar) unidas em longas fibras. Essas fibras se entrecruzam formando uma malha muito forte.' },
      { speaker: 'drCell', text: 'Essa estrutura da rigidez e sustentacao a planta. E tambem protege contra ataques de patogenos e pressao excessiva de agua.' },
      { speaker: 'narrative', text: 'Celulas animais NAO tem essa estrutura rigida - por isso animais precisam de esqueletos (internos ou externos) para sustentacao.' },
      { speaker: 'fragmento', text: 'Plantas tem armadura, animais nao... Qual e o nome dessa estrutura que da forca as plantas?' }
    ],
    question: 'Qual estrutura esta presente nas celulas vegetais mas ausente nas celulas animais, conferindo rigidez e sustentacao?',
    expectedAnswer: 'A parede celular, composta principalmente de celulose.',
    keywords: ['parede celular', 'parede', 'celulose', 'parede celulosica'],
    hint: 'Fica FORA da membrana, e feita de celulose, e da sustentacao as plantas como uma "armadura"...',
    explanation: 'A PAREDE CELULAR e uma estrutura RIGIDA que envolve as celulas vegetais por FORA da membrana plasmatica. E composta principalmente de CELULOSE (um carboidrato) e proporciona SUSTENTACAO, PROTECAO e FORMA a celula. Celulas animais NAO tem parede celular - apenas membrana plasmatica!'
  },

  // CASO 11
  {
    id: 11,
    roomId: 4,
    theme: 'Celula Animal vs Vegetal',
    caseTitle: 'O Grande Reservatorio',
    dialogues: [
      { speaker: 'drCell', text: 'Continuando as diferencas! Agora vamos falar de um "tanque" gigante que existe nas celulas vegetais.' },
      { speaker: 'drCell', text: 'Se voce olhar uma celula vegetal ao microscopio, vai notar que a maior parte dela e ocupada por uma estrutura transparente enorme!' },
      { speaker: 'narrative', text: 'Nas celulas vegetais adultas, existe uma organela que pode ocupar ate 90% do volume da celula! E como um balao gigante de agua dentro da celula.' },
      { speaker: 'teaching', text: 'Essa estrutura armazena principalmente AGUA, mas tambem ions, acucares, pigmentos coloridos (como os que dao cor as petalas) e ate substancias toxicas para defesa.' },
      { speaker: 'narrative', text: 'A pressao da agua dentro dessa organela "empurra" a membrana contra a parede celular. Isso deixa a celula firme e turgida (inchada).' },
      { speaker: 'teaching', text: 'TURGENCIA e o estado em que a celula esta cheia de agua e firme. Quando plantas murcham, e porque perderam agua e as celulas ficaram "moles" (plasmolise).' },
      { speaker: 'drCell', text: 'Celulas animais tambem tem estruturas parecidas, mas sao MUITO menores - apenas pequenas vesiculas. Nada comparado ao gigante das plantas!' },
      { speaker: 'narrative', text: 'Essa organela e tao grande que empurra todo o citoplasma e as outras organelas para a periferia da celula vegetal.' },
      { speaker: 'fragmento', text: 'Um oceano dentro de cada celula vegetal... Qual e o nome desse imenso reservatorio?' }
    ],
    question: 'Qual organela ocupa grande parte do volume da celula vegetal e e responsavel pelo armazenamento de agua e substancias?',
    expectedAnswer: 'O vacuolo central e responsavel pelo armazenamento.',
    keywords: ['vacuolo', 'vacuolos', 'vacuolo central'],
    hint: 'Pode ocupar ate 90% da celula vegetal, armazena agua e mantem a planta "turgida" (firme)...',
    explanation: 'O VACUOLO CENTRAL e uma organela ENORME que pode ocupar ate 90% do volume da celula vegetal! Armazena AGUA, ions, acucares, pigmentos e substancias de defesa. A pressao da agua no vacuolo (TURGENCIA) mantem a celula firme. Quando plantas murcham, os vacuolos perderam agua! Celulas animais tem vacuolos muito menores.'
  },

  // CASO 12
  {
    id: 12,
    roomId: 4,
    theme: 'Celula Animal vs Vegetal',
    caseTitle: 'Os Organizadores da Divisao',
    dialogues: [
      { speaker: 'drCell', text: 'Ultima diferenca deste setor! Vamos falar sobre como as celulas se dividem e uma estrutura curiosa que participa desse processo.' },
      { speaker: 'drCell', text: 'Quando uma celula vai se dividir, precisa distribuir seus cromossomos igualmente para as duas celulas-filhas. Isso requer organizacao!' },
      { speaker: 'teaching', text: 'CROMOSSOMOS sao estruturas que contem DNA compactado. Antes da divisao, cada cromossomo e duplicado e precisa ser separado corretamente.' },
      { speaker: 'narrative', text: 'Nas celulas animais, existe uma estrutura que organiza fibras proteicas chamadas FUSO MITOTICO, que puxam os cromossomos para lados opostos.' },
      { speaker: 'narrative', text: 'Essa estrutura e formada por dois cilindros perpendiculares compostos de microtubulos. Normalmente fica perto do nucleo.' },
      { speaker: 'teaching', text: 'Alem de organizar a divisao celular, essa estrutura tambem forma a base de cilios e flagelos - estruturas de movimento de algumas celulas!' },
      { speaker: 'drCell', text: 'Curiosamente, a maioria das plantas SUPERIORES (como arvores e flores) NAO tem essa estrutura. Elas organizam o fuso de outra forma!' },
      { speaker: 'narrative', text: 'Plantas inferiores (como musgos e samambaias) e algas ainda tem essa organela, assim como todos os animais.' },
      { speaker: 'fragmento', text: 'Organizar a divisao e crucial... Qual estrutura as celulas animais usam que a maioria das plantas nao tem?' }
    ],
    question: 'Qual estrutura relacionada a divisao celular esta presente nas celulas animais mas geralmente ausente nas celulas vegetais superiores?',
    expectedAnswer: 'Os centriolos (ou centro celular/centrossomo).',
    keywords: ['centriolo', 'centriolos', 'centrossomo', 'centrossoma', 'centro celular'],
    hint: 'Sao dois cilindros perpendiculares que organizam o fuso durante a divisao celular...',
    explanation: 'Os CENTRIOLOS sao estruturas cilindricas formadas por microtubulos que participam da organizacao do FUSO MITOTICO durante a divisao celular. Estao presentes em celulas ANIMAIS e algumas plantas inferiores, mas AUSENTES na maioria das plantas superiores. Tambem formam a base de cilios e flagelos!'
  },

  // CASO 13 - Membrana Plasmatica
  {
    id: 13,
    roomId: 5,
    theme: 'Membrana Plasmatica',
    caseTitle: 'A Fronteira Celular',
    dialogues: [
      { speaker: 'drCell', text: 'Bem-vindo ao Controle de Fronteira! Aqui vamos estudar a estrutura mais importante para definir o que e "dentro" e "fora" da celula.' },
      { speaker: 'drCell', text: 'Toda celula - procarionte ou eucarionte, animal ou vegetal - tem uma fina camada que a separa do ambiente. Essa e a MEMBRANA PLASMATICA!' },
      { speaker: 'teaching', text: 'A membrana plasmatica e extremamente fina - apenas 7,5 nanometros (7,5 milionesimos de milimetro)! Mas e incrivelmente importante.' },
      { speaker: 'narrative', text: 'Imagine a membrana como a parede de uma cidade murada. Ela nao apenas separa o interior do exterior, mas tambem CONTROLA o que entra e sai.' },
      { speaker: 'narrative', text: 'Algumas substancias passam facilmente, outras precisam de "passaportes" especiais (proteinas transportadoras), e algumas sao completamente barradas!' },
      { speaker: 'teaching', text: 'Isso se chama PERMEABILIDADE SELETIVA - a membrana "seleciona" o que pode atravessa-la. Oxigenio e gas carbonico passam facil, mas ions precisam de ajuda.' },
      { speaker: 'drCell', text: 'A membrana tambem permite que a celula reconheca outras celulas e se comunique com elas. E como um sistema de identificacao e comunicacao!' },
      { speaker: 'narrative', text: 'Sem a membrana plasmatica, a celula perderia seu conteudo e morreria instantaneamente. E a barreira entre a vida e a morte celular!' },
      { speaker: 'fragmento', text: 'Uma fronteira tao fina, mas tao vital... Qual e sua funcao PRINCIPAL?' }
    ],
    question: 'Qual e a principal funcao da membrana plasmatica?',
    expectedAnswer: 'Controlar a entrada e saida de substancias da celula (permeabilidade seletiva).',
    keywords: ['permeabilidade', 'seletiva', 'controlar', 'entrada', 'saida', 'transporte', 'barreira', 'delimitar', 'isolar'],
    hint: 'Pense na membrana como um "guarda de fronteira" que decide o que entra e sai...',
    explanation: 'A funcao principal da membrana plasmatica e a PERMEABILIDADE SELETIVA - controlar o que ENTRA e SAI da celula! Ela permite a passagem de algumas substancias e bloqueia outras, mantendo o ambiente interno da celula estavel. Tambem participa do reconhecimento celular, comunicacao e protecao!'
  },

  // CASO 14
  {
    id: 14,
    roomId: 5,
    theme: 'Membrana Plasmatica',
    caseTitle: 'O Modelo Dinamico',
    dialogues: [
      { speaker: 'drCell', text: 'Agora vamos entender COMO a membrana plasmatica e organizada. Sua estrutura foi um misterio por muito tempo!' },
      { speaker: 'drCell', text: 'Em 1972, dois cientistas americanos propuseram um modelo revolucionario que explicava a estrutura e o comportamento da membrana.' },
      { speaker: 'narrative', text: 'Antes desse modelo, cientistas achavam que a membrana era uma estrutura estatica e rigida. Mas os experimentos mostraram que ela e muito dinamica!' },
      { speaker: 'teaching', text: 'A membrana e formada por uma BICAMADA DE LIPIDIOS - duas camadas de gorduras especiais organizadas lado a lado, com proteinas espalhadas.' },
      { speaker: 'narrative', text: 'O modelo compara a membrana a um mosaico - uma obra de arte feita de varias pecas diferentes (lipidios, proteinas, carboidratos) que se encaixam.' },
      { speaker: 'narrative', text: 'Mas as pecas nao sao fixas! Elas se MOVEM lateralmente o tempo todo, como barcos flutuando em um lago. Por isso o modelo inclui a palavra "fluido".' },
      { speaker: 'teaching', text: 'MOSAICO = variedade de componentes diferentes. FLUIDO = esses componentes tem mobilidade, nao sao estaticos.' },
      { speaker: 'drCell', text: 'As proteinas podem "flutuar" pela membrana, girar, ou ficar mais em certas regioes. Isso e essencial para muitas funcoes da celula!' },
      { speaker: 'fragmento', text: 'Variedade e movimento... Qual e o nome desse famoso modelo da membrana?' }
    ],
    question: 'Qual e o nome do modelo que descreve a estrutura da membrana plasmatica como proteinas flutuando em uma bicamada lipidica?',
    expectedAnswer: 'Modelo do Mosaico Fluido.',
    keywords: ['mosaico fluido', 'mosaico', 'fluido', 'singer', 'nicolson'],
    hint: 'O nome tem duas partes: uma sobre variedade (como uma obra de arte) e outra sobre movimento (como liquido)...',
    explanation: 'O MODELO DO MOSAICO FLUIDO foi proposto por Singer e Nicolson em 1972. Descreve a membrana como uma BICAMADA DE FOSFOLIPIDIOS com proteinas "flutuando" nela. MOSAICO = variedade de componentes. FLUIDO = mobilidade dos componentes. As proteinas podem se mover lateralmente, nao sao fixas!'
  },

  // CASO 15
  {
    id: 15,
    roomId: 5,
    theme: 'Membrana Plasmatica',
    caseTitle: 'Os Tijolos da Membrana',
    dialogues: [
      { speaker: 'drCell', text: 'Vamos conhecer os "tijolos" que constroem a membrana. Sao moleculas muito especiais com uma caracteristica unica!' },
      { speaker: 'drCell', text: 'Essas moleculas tem uma "personalidade dupla" - uma parte delas GOSTA de agua e outra parte FOGE da agua!' },
      { speaker: 'teaching', text: 'HIDROFILICO = que gosta de agua (hidro = agua, filico = que gosta). HIDROFOBICO = que foge da agua (fobico = medo/aversao).' },
      { speaker: 'narrative', text: 'Cada molecula tem uma CABECA hidrofilica (que interage bem com agua) e duas CAUDAS hidrofobicas (que evitam agua a todo custo).' },
      { speaker: 'narrative', text: 'Quando essas moleculas estao em ambiente aquoso, elas se organizam automaticamente: as cabecas ficam voltadas para a agua, as caudas se escondem no meio!' },
      { speaker: 'teaching', text: 'E assim que a BICAMADA se forma: duas camadas de moleculas com as cabecas para fora (contato com agua) e as caudas para dentro (escondidas da agua).' },
      { speaker: 'drCell', text: 'Essa organizacao acontece ESPONTANEAMENTE! As moleculas "sabem" como se organizar devido as suas propriedades quimicas.' },
      { speaker: 'narrative', text: 'A cabeca contem um grupo FOSFATO - por isso essas moleculas tem um nome especifico que indica isso.' },
      { speaker: 'fragmento', text: 'Cabeca que gosta de agua, caudas que fogem... Qual e o nome dessas moleculas essenciais?' }
    ],
    question: 'Quais sao os principais componentes lipidicos da membrana plasmatica?',
    expectedAnswer: 'Fosfolipidios (ou fosfolipides).',
    keywords: ['fosfolipidio', 'fosfolipidios', 'fosfolipide', 'fosfolipides', 'lipidios'],
    hint: 'O nome indica que tem FOSFATO (fosfo) + LIPIDIO (gordura). Tem cabeca hidrofilica e caudas hidrofobicas...',
    explanation: 'Os FOSFOLIPIDIOS sao os principais componentes da membrana! Tem CABECA HIDROFILICA (polar, com grupo fosfato) e CAUDAS HIDROFOBICAS (apolares, de acidos graxos). Se organizam em BICAMADA: cabecas para fora (contato com agua), caudas para dentro. Essa estrutura permite a permeabilidade seletiva!'
  },

  // CASO 16
  {
    id: 16,
    roomId: 5,
    theme: 'Membrana Plasmatica',
    caseTitle: 'Comunicacao Celular',
    dialogues: [
      { speaker: 'drCell', text: 'Ultimo caso do Controle de Fronteira! Vamos falar sobre como celulas se RECONHECEM e COMUNICAM.' },
      { speaker: 'drCell', text: 'Na superficie externa da membrana, existem estruturas que funcionam como "antenas" ou "cartoes de identidade" celulares.' },
      { speaker: 'narrative', text: 'Essas estruturas sao formadas por CARBOIDRATOS (acucares) ligados a proteinas ou lipidios da membrana.' },
      { speaker: 'teaching', text: 'Carboidratos ligados a proteinas = GLICOPROTEINAS. Carboidratos ligados a lipidios = GLICOLIPIDIOS. (Glico = acucar).' },
      { speaker: 'narrative', text: 'Juntos, esses carboidratos formam uma camada "felpuda" na superficie externa da celula, como um tapete de acucares.' },
      { speaker: 'teaching', text: 'Essa camada permite que celulas se reconhecam. Por exemplo, seu sistema imunologico usa isso para identificar celulas do seu corpo versus invasores!' },
      { speaker: 'drCell', text: 'Os grupos sanguineos (A, B, AB, O) sao determinados pelos carboidratos presentes nessa camada das hemacias!' },
      { speaker: 'narrative', text: 'Sem essa camada de reconhecimento, o corpo nao saberia quem e amigo ou inimigo, e transplantes de orgaos seriam impossiveis de controlar.' },
      { speaker: 'fragmento', text: 'Identidade celular na ponta dos acucares... Como se chama essa camada de carboidratos?' }
    ],
    question: 'Como e chamada a camada de carboidratos na superficie externa da membrana plasmatica?',
    expectedAnswer: 'Glicocalice (ou glicocálix).',
    keywords: ['glicocalice', 'glicocálix', 'glicocalis', 'glicocalice', 'glicocalix'],
    hint: 'E uma camada de "glico" (acucar) + "calice/calyx" (cobertura). Fica na parte externa da membrana...',
    explanation: 'O GLICOCALICE e a camada de carboidratos (oligossacarideos) ligados a proteinas (glicoproteinas) e lipidios (glicolipidios) na face EXTERNA da membrana. Funciona como "cartao de identidade" celular, participando do reconhecimento celular, adesao, protecao e determinacao de grupos sanguineos!'
  },

  // CASO 17 - Transporte Celular
  {
    id: 17,
    roomId: 6,
    theme: 'Transporte Celular',
    caseTitle: 'O Fluxo Natural',
    dialogues: [
      { speaker: 'drCell', text: 'Bem-vindo ao Sistema de Transporte! Aqui vamos entender como substancias atravessam a membrana plasmatica.' },
      { speaker: 'drCell', text: 'Existem duas formas principais de transporte: uma que NAO gasta energia e outra que GASTA. Vamos comecar pela mais simples!' },
      { speaker: 'teaching', text: 'Imagine uma sala cheia de pessoas de um lado e vazia do outro. O que acontece quando a porta abre? As pessoas se espalham naturalmente para onde tem mais espaco!' },
      { speaker: 'narrative', text: 'Moleculas fazem a mesma coisa! Elas se movem naturalmente de onde estao mais CONCENTRADAS para onde estao menos concentradas.' },
      { speaker: 'narrative', text: 'Esse movimento acontece AUTOMATICAMENTE, sem a celula gastar nenhuma energia. E como uma bola rolando morro abaixo - segue a tendencia natural.' },
      { speaker: 'teaching', text: 'GRADIENTE DE CONCENTRACAO e a diferenca entre uma regiao com muitas moleculas e outra com poucas. O transporte "a favor" vai do mais para o menos concentrado.' },
      { speaker: 'drCell', text: 'Oxigenio e gas carbonico atravessam a membrana assim - simplesmente passam de onde tem mais para onde tem menos, sem gasto de ATP.' },
      { speaker: 'narrative', text: 'Por nao gastar energia, esse tipo de transporte e chamado de PASSIVO. A celula nao precisa fazer nenhum esforco!' },
      { speaker: 'fragmento', text: 'O caminho facil, sem esforco... Como chamamos esse transporte a favor do gradiente, sem gasto de energia?' }
    ],
    question: 'Como e chamado o transporte de substancias a favor do gradiente de concentracao, sem gasto de energia?',
    expectedAnswer: 'Difusao simples ou transporte passivo.',
    keywords: ['difusao', 'passivo', 'passiva', 'difusao simples'],
    hint: 'Nao gasta energia = PASSIVO. Moleculas se espalham = DIFUSAO. E como perfume se espalhando numa sala...',
    explanation: 'DIFUSAO SIMPLES e um tipo de TRANSPORTE PASSIVO onde moleculas atravessam a membrana A FAVOR do gradiente de concentracao (do mais para o menos concentrado), SEM GASTO DE ATP e sem ajuda de proteinas. Exemplos: O2 e CO2 atravessando a membrana. E um processo natural e espontaneo!'
  },

  // CASO 18
  {
    id: 18,
    roomId: 6,
    theme: 'Transporte Celular',
    caseTitle: 'O Movimento da Agua',
    dialogues: [
      { speaker: 'drCell', text: 'Agora vamos falar de uma molecula muito especial: a AGUA! Ela tem seu proprio tipo de transporte.' },
      { speaker: 'drCell', text: 'A agua e a substancia mais abundante nas celulas - cerca de 70-80% do peso de uma celula e agua!' },
      { speaker: 'teaching', text: 'A membrana plasmatica e SEMIPERMEAVEL - permite a passagem de algumas substancias (como agua) mas bloqueia outras (como solutos grandes).' },
      { speaker: 'narrative', text: 'Imagine duas solucoes separadas por uma membrana: uma com muito sal dissolvido (mais concentrada) e outra com pouco sal (menos concentrada).' },
      { speaker: 'narrative', text: 'A agua vai se mover! Mas para onde? Ela vai da solucao menos concentrada para a mais concentrada, tentando "diluir" o excesso de sal.' },
      { speaker: 'teaching', text: 'Parece estranho, mas faz sentido: a agua vai de onde tem MAIS agua (solucao diluida) para onde tem MENOS agua (solucao concentrada).' },
      { speaker: 'drCell', text: 'Isso e super importante para as celulas! Se uma celula for colocada em agua pura, agua entra e ela pode ESTOURAR!' },
      { speaker: 'narrative', text: 'Esse movimento especifico da agua atraves de membranas semipermeáveis tem um nome proprio, diferente de difusao.' },
      { speaker: 'fragmento', text: 'A agua sempre busca equilibrio... Qual e o nome desse transporte especifico de agua?' }
    ],
    question: 'Como e chamado o transporte de agua atraves de uma membrana semipermeavel?',
    expectedAnswer: 'Osmose.',
    keywords: ['osmose', 'osmotico'],
    hint: 'E a difusao especifica da AGUA atraves de membranas. Acontece do meio hipotonico para o hipertonico...',
    explanation: 'OSMOSE e a difusao da AGUA atraves de uma membrana semipermeavel! A agua se move do meio HIPOTONICO (menos soluto, mais agua) para o meio HIPERTONICO (mais soluto, menos agua). E fundamental para o equilibrio hidrico das celulas. Em agua pura, celulas animais podem estourar (hemolise)!'
  },

  // CASO 19
  {
    id: 19,
    roomId: 6,
    theme: 'Transporte Celular',
    caseTitle: 'Contra a Corrente',
    dialogues: [
      { speaker: 'drCell', text: 'Ate agora vimos transportes "faceis" - a favor do gradiente. Mas as vezes a celula precisa mover substancias CONTRA a corrente!' },
      { speaker: 'drCell', text: 'Imagine nadar contra a correnteza de um rio. Voce consegue, mas gasta muita energia! O mesmo acontece com celulas.' },
      { speaker: 'teaching', text: 'A favor do gradiente = do mais concentrado para o menos (facil, sem energia). Contra o gradiente = do menos para o mais (dificil, gasta energia)!' },
      { speaker: 'narrative', text: 'Por que uma celula faria isso? Porque as vezes ela precisa ACUMULAR certas substancias, mesmo que ja tenha muito!' },
      { speaker: 'narrative', text: 'Por exemplo, celulas nervosas precisam manter muito potassio dentro e muito sodio fora. Sem isso, os impulsos nervosos nao funcionam!' },
      { speaker: 'teaching', text: 'O transporte contra o gradiente requer ENERGIA na forma de ATP. Por isso e chamado de transporte ATIVO - a celula trabalha ativamente.' },
      { speaker: 'drCell', text: 'Proteinas especiais na membrana funcionam como "bombas" que usam ATP para empurrar substancias contra a corrente.' },
      { speaker: 'narrative', text: 'Sem transporte ativo, celulas nao conseguiriam absorver nutrientes, eliminar toxinas ou manter as condicoes ideais para funcionar.' },
      { speaker: 'fragmento', text: 'Gastar energia para nadar contra a corrente... Como se chama esse transporte "trabalhador"?' }
    ],
    question: 'Como e chamado o transporte que ocorre contra o gradiente de concentracao e requer gasto de ATP?',
    expectedAnswer: 'Transporte ativo.',
    keywords: ['ativo', 'ativa', 'transporte ativo', 'com energia', 'gasto de atp', 'contra o gradiente'],
    hint: 'Contra o gradiente = precisa de esforco = gasta energia = a celula participa ATIVAMENTE...',
    explanation: 'TRANSPORTE ATIVO move substancias CONTRA o gradiente de concentracao (do menos para o mais concentrado), usando ENERGIA (ATP). Proteinas transportadoras funcionam como "bombas". E essencial para absorver nutrientes, eliminar toxinas e manter as condicoes ideais da celula!'
  },

  // CASO 20
  {
    id: 20,
    roomId: 6,
    theme: 'Transporte Celular',
    caseTitle: 'A Bomba Vital',
    dialogues: [
      { speaker: 'drCell', text: 'Vamos conhecer a "bomba" mais famosa e importante das celulas animais! Ela trabalha 24 horas por dia, sem parar.' },
      { speaker: 'drCell', text: 'Seus neuronios, musculos e todas as suas celulas dependem dessa bomba para funcionar corretamente!' },
      { speaker: 'teaching', text: 'SODIO (Na+) e POTASSIO (K+) sao ions muito importantes. Celulas precisam manter mais K+ dentro e mais Na+ fora. Isso cria uma "carga eletrica" na membrana.' },
      { speaker: 'narrative', text: 'Essa bomba e uma proteina que fica na membrana. Ela pega 3 ions de sodio de dentro da celula e joga para fora.' },
      { speaker: 'narrative', text: 'Ao mesmo tempo, ela pega 2 ions de potassio de fora e joga para dentro. Tudo isso usando a energia de 1 molecula de ATP!' },
      { speaker: 'teaching', text: '3 Na+ SAEM, 2 K+ ENTRAM, 1 ATP e consumido. Essa proporcao 3:2 cria uma diferenca de cargas que e essencial para a celula.' },
      { speaker: 'drCell', text: 'Essa diferenca de cargas permite que neuronios transmitam impulsos nervosos e que musculos contraiam. Sem ela, voce nao pensaria nem se moveria!' },
      { speaker: 'narrative', text: 'Estima-se que cerca de 25% de toda a energia que voce gasta em repouso e usada so para manter essa bomba funcionando!' },
      { speaker: 'fragmento', text: 'Sodio sai, potassio entra... Qual e o nome dessa bomba essencial para a vida?' }
    ],
    question: 'Qual e o nome da proteina transportadora que bombeia sodio para fora e potassio para dentro da celula?',
    expectedAnswer: 'Bomba de sodio e potassio (ou Na+/K+ ATPase).',
    keywords: ['sodio', 'potassio', 'bomba de sodio', 'na+/k+', 'bomba sodio-potassio', 'sodio e potassio'],
    hint: 'O nome ja diz o que ela faz: bomba de... dois ions muito importantes para neuronios...',
    explanation: 'A BOMBA DE SODIO E POTASSIO (Na+/K+ ATPase) e uma proteina de TRANSPORTE ATIVO que bombeia 3 ions Na+ para FORA e 2 ions K+ para DENTRO da celula, gastando 1 ATP. Mantem o potencial de membrana essencial para impulsos nervosos, contracao muscular e muitas outras funcoes!'
  },

  // CASO 21 - Organelas Avancadas
  {
    id: 21,
    roomId: 7,
    theme: 'Organelas Avancadas',
    caseTitle: 'As Fabricas de Proteinas',
    dialogues: [
      { speaker: 'drCell', text: 'Bem-vindo a Fabrica Celular! Aqui vamos entender como as celulas PRODUZEM as moleculas essenciais para a vida.' },
      { speaker: 'drCell', text: 'Proteinas sao as moleculas que fazem quase TUDO na celula: enzimas, hormônios, anticorpos, estruturas... Mas quem as fabrica?' },
      { speaker: 'teaching', text: 'PROTEINAS sao moleculas formadas por AMINOACIDOS ligados em sequencia. A ordem dos aminoacidos determina qual proteina sera formada.' },
      { speaker: 'narrative', text: 'Existe uma organela pequena, mas extremamente abundante, que e a verdadeira "linha de montagem" das proteinas.' },
      { speaker: 'narrative', text: 'Essas organelas sao tao pequenas que nao tem membrana! Sao formadas por RNA e proteinas, e parecem pequenos graos.' },
      { speaker: 'teaching', text: 'Podem estar LIVRES no citoplasma (produzindo proteinas para uso da propria celula) ou ADERIDAS ao reticulo endoplasmatico (produzindo proteinas para exportacao).' },
      { speaker: 'drCell', text: 'Cada celula humana tem MILHOES dessas organelas trabalhando o tempo todo! E uma producao industrial microscópica.' },
      { speaker: 'narrative', text: 'Antibioticos como a estreptomicina funcionam atacando essas organelas em bacterias, impedindo que produzam proteinas e matando a bacteria!' },
      { speaker: 'fragmento', text: 'Minusculas, sem membrana, mas produzem TODAS as proteinas... Qual e o nome dessas fabricas?' }
    ],
    question: 'Qual organela e responsavel pela sintese de proteinas?',
    expectedAnswer: 'Os ribossomos sao responsaveis pela sintese de proteinas.',
    keywords: ['ribossomo', 'ribossomos', 'ribossoma', 'ribossomas'],
    hint: 'Sao pequenos, sem membrana, feitos de RNA e proteinas. Podem estar livres ou aderidos ao reticulo...',
    explanation: 'Os RIBOSSOMOS sao as organelas responsaveis pela SINTESE DE PROTEINAS (traducao). Sao compostos por RNA ribossomico e proteinas, NAO tem membrana. Podem estar LIVRES no citoplasma ou ADERIDOS ao reticulo endoplasmatico. Sao essenciais para a vida - todas as celulas tem ribossomos!'
  },

  // CASO 22
  {
    id: 22,
    roomId: 7,
    theme: 'Organelas Avancadas',
    caseTitle: 'A Rede de Tuneis',
    dialogues: [
      { speaker: 'drCell', text: 'Continuando na Fabrica Celular! Agora vamos conhecer um sistema de "tuneis" que se espalha por toda a celula.' },
      { speaker: 'drCell', text: 'Imagine uma rede de canais e bolsas membranosas conectadas, como um sistema de metro subterraneo na celula!' },
      { speaker: 'teaching', text: 'Essa rede de membranas se conecta ao nucleo e se espalha pelo citoplasma. Funciona como via de transporte e local de producao.' },
      { speaker: 'narrative', text: 'Existem DOIS tipos dessa rede: um tem a superficie coberta de ribossomos (aspecto "rugoso") e outro nao tem ribossomos (superficie "lisa").' },
      { speaker: 'narrative', text: 'O tipo RUGOSO (com ribossomos) produz proteinas que serao exportadas da celula ou usadas na membrana.' },
      { speaker: 'narrative', text: 'O tipo LISO (sem ribossomos) produz LIPIDIOS, metaboliza carboidratos, desintoxica substancias e armazena calcio em musculos!' },
      { speaker: 'teaching', text: 'RUGOSO = ribossomos aderidos = producao de proteinas de exportacao. LISO = sem ribossomos = producao de lipidios e desintoxicacao.' },
      { speaker: 'drCell', text: 'O figado tem muito do tipo liso porque desintoxica substancias. Celulas que secretam proteinas tem muito do tipo rugoso!' },
      { speaker: 'fragmento', text: 'Rugoso ou liso, uma rede que conecta e produz... Qual e o nome desse sistema de membranas?' }
    ],
    question: 'Qual organela forma uma rede de membranas pelo citoplasma e participa da sintese e transporte de substancias?',
    expectedAnswer: 'Reticulo endoplasmatico (liso e rugoso).',
    keywords: ['reticulo', 'endoplasmatico', 'reticulo endoplasmatico', 're', 'rer', 'rel'],
    hint: 'E uma rede de membranas que pode ser "rugosa" (com ribossomos) ou "lisa" (sem ribossomos)...',
    explanation: 'O RETICULO ENDOPLASMATICO (RE) e uma rede de membranas conectada ao nucleo. O RE RUGOSO (RER) tem ribossomos e produz proteinas de exportacao. O RE LISO (REL) produz lipidios, desintoxica e armazena calcio. Juntos, sao essenciais para producao e transporte de substancias!'
  },

  // CASO 23
  {
    id: 23,
    roomId: 7,
    theme: 'Organelas Avancadas',
    caseTitle: 'O Centro de Distribuicao',
    dialogues: [
      { speaker: 'drCell', text: 'As proteinas foram produzidas no reticulo... e agora? Elas precisam ser processadas, empacotadas e enviadas para seus destinos!' },
      { speaker: 'drCell', text: 'Imagine um centro de distribuicao de uma grande empresa: recebe produtos, adiciona etiquetas, embala e envia para os clientes certos.' },
      { speaker: 'teaching', text: 'Muitas proteinas precisam ser MODIFICADAS antes de funcionar. Por exemplo, adicionar acucares (glicosilacao) ou grupos fosfato (fosforilacao).' },
      { speaker: 'narrative', text: 'Essa organela e formada por sacos membranosos ACHATADOS empilhados como pratos. Tem uma face que RECEBE material e outra que ENVIA.' },
      { speaker: 'narrative', text: 'Proteinas entram de um lado, passam pelos sacos sendo modificadas, e saem do outro lado em vesiculas prontas para entrega!' },
      { speaker: 'teaching', text: 'As vesiculas podem ir para: 1) SECRECAO (saem da celula), 2) MEMBRANA (ficam na membrana), ou 3) LISOSSOMOS (digestao).' },
      { speaker: 'drCell', text: 'Sem essa organela, proteinas chegariam aos lugares errados ou nao funcionariam! E o controle de qualidade e logistica da celula.' },
      { speaker: 'narrative', text: 'Celulas que secretam muito (como as do pancreas que produzem insulina) tem essa organela muito desenvolvida!' },
      { speaker: 'fragmento', text: 'Modificar, empacotar, enviar... Qual e o nome desse centro de processamento e distribuicao?' }
    ],
    question: 'Qual organela e responsavel por modificar, empacotar e secretar proteinas e lipidios?',
    expectedAnswer: 'Complexo de Golgi (ou aparelho de Golgi).',
    keywords: ['golgi', 'complexo de golgi', 'aparelho de golgi', 'complexo golgiense', 'dictiossomo'],
    hint: 'Sacos achatados empilhados, recebe do reticulo, processa e envia em vesiculas. Leva o nome de um cientista italiano...',
    explanation: 'O COMPLEXO DE GOLGI e formado por sacos membranosos achatados (cisternas) empilhados. Recebe proteinas do reticulo, as MODIFICA (glicosilacao, etc.), EMPACOTA em vesiculas e as DIRECIONA para secrecao, membrana ou lisossomos. E o centro de processamento e distribuicao da celula!'
  },

  // CASO 24
  {
    id: 24,
    roomId: 7,
    theme: 'Organelas Avancadas',
    caseTitle: 'O Codigo Genetico',
    dialogues: [
      { speaker: 'drCell', text: 'Para finalizar a Fabrica Celular, precisamos entender como a informacao para fazer proteinas chega ate os ribossomos!' },
      { speaker: 'drCell', text: 'A "receita" para cada proteina esta no DNA, dentro do nucleo. Mas os ribossomos estao no CITOPLASMA. Como a mensagem chega la?' },
      { speaker: 'teaching', text: 'O DNA nunca sai do nucleo! Ele e muito precioso e precisa ser protegido. Entao a celula usa um "mensageiro" para levar a informacao.' },
      { speaker: 'narrative', text: 'Esse mensageiro e uma molecula de RNA (acido ribonucleico) que e produzida copiando um trecho do DNA. Esse processo se chama TRANSCRICAO.' },
      { speaker: 'narrative', text: 'O mensageiro sai do nucleo pelos poros da carioteca e viaja ate os ribossomos no citoplasma, carregando as instrucoes.' },
      { speaker: 'teaching', text: 'RNA e parecido com DNA, mas tem algumas diferencas: e fita simples (nao dupla) e usa uracila no lugar de timina.' },
      { speaker: 'drCell', text: 'Os ribossomos "leem" a mensagem e montam a proteina correspondente. Esse processo se chama TRADUCAO!' },
      { speaker: 'narrative', text: 'DNA -> RNA -> Proteina. Esse e o fluxo da informacao genetica, chamado de "Dogma Central da Biologia Molecular"!' },
      { speaker: 'fragmento', text: 'O mensageiro entre DNA e proteina... Qual e o nome dessa molecula que transporta a informacao?' }
    ],
    question: 'Qual molecula transporta a informacao genetica do DNA para os ribossomos?',
    expectedAnswer: 'RNA mensageiro (mRNA ou RNAm).',
    keywords: ['rna', 'rnm', 'mrna', 'rnam', 'mensageiro', 'rna mensageiro'],
    hint: 'E um tipo de RNA que carrega a "mensagem" do DNA para fora do nucleo...',
    explanation: 'O RNA MENSAGEIRO (mRNA ou RNAm) e produzido no nucleo atraves da TRANSCRICAO do DNA. Ele carrega a informacao genetica (na forma de codons) do nucleo para o citoplasma, onde sera "lido" pelos ribossomos durante a TRADUCAO para produzir proteinas. E o "mensageiro" entre DNA e proteinas!'
  },

  // CASO 25 - Metabolismo Celular
  {
    id: 25,
    roomId: 8,
    theme: 'Metabolismo Celular',
    caseTitle: 'A Moeda Energetica',
    dialogues: [
      { speaker: 'drCell', text: 'Bem-vindo a Central Energetica! Aqui vamos entender como a celula armazena e usa ENERGIA.' },
      { speaker: 'drCell', text: 'Tudo na celula precisa de energia: movimento, producao de moleculas, transporte, divisao... Mas como a celula "paga" por tudo isso?' },
      { speaker: 'teaching', text: 'Assim como paises usam dinheiro para comprar coisas, celulas usam uma "moeda" especial para pagar por atividades que gastam energia.' },
      { speaker: 'narrative', text: 'Essa moeda e uma molecula formada por adenina (uma base nitrogenada), ribose (um acucar) e TRES grupos fosfato ligados.' },
      { speaker: 'narrative', text: 'A energia fica armazenada nas ligacoes entre os fosfatos. Quando a celula precisa de energia, ela quebra uma dessas ligacoes!' },
      { speaker: 'teaching', text: 'Quebrar a ligacao do ultimo fosfato libera energia e transforma a molecula de 3 fosfatos em uma de 2 fosfatos (chamada ADP).' },
      { speaker: 'drCell', text: 'E o contrario tambem funciona: quando a celula tem energia sobrando (da comida), ela reconstroi a molecula de 3 fosfatos!' },
      { speaker: 'narrative', text: 'Seu corpo produz e consome o equivalente ao seu peso corporal dessa molecula TODO DIA! E muita energia sendo transacionada!' },
      { speaker: 'fragmento', text: 'A moeda universal da vida celular... Qual e o nome dessa molecula energetica?' }
    ],
    question: 'Qual e a principal molecula utilizada como fonte imediata de energia nas celulas?',
    expectedAnswer: 'ATP (adenosina trifosfato).',
    keywords: ['atp', 'adenosina', 'trifosfato', 'adenosina trifosfato'],
    hint: 'Tem 3 fosfatos (TRI), e feita de adenosina, e a "moeda" energetica universal das celulas...',
    explanation: 'O ATP (ADENOSINA TRIFOSFATO) e a principal "moeda energetica" da celula! A energia esta armazenada nas ligacoes entre os 3 grupos fosfato. Quando a celula precisa de energia, quebra ATP em ADP + fosfato, liberando energia. Essa energia e usada para TODAS as atividades celulares!'
  },

  // CASO 26
  {
    id: 26,
    roomId: 8,
    theme: 'Metabolismo Celular',
    caseTitle: 'A Queima de Combustivel',
    dialogues: [
      { speaker: 'drCell', text: 'Agora vamos entender como o ATP e produzido! A celula precisa de "combustivel" e de oxigenio.' },
      { speaker: 'drCell', text: 'O principal combustivel das celulas e a GLICOSE - o acucar que vem dos alimentos que voce come!' },
      { speaker: 'teaching', text: 'GLICOSE e um acucar simples (C6H12O6). Vem da digestao de carboidratos como pao, arroz, massas e frutas.' },
      { speaker: 'narrative', text: 'Dentro das celulas (principalmente nas mitocondrias), a glicose e "queimada" usando oxigenio. E como uma combustao, mas super controlada!' },
      { speaker: 'narrative', text: 'Esse processo acontece em etapas: primeiro no citoplasma (glicolise), depois dentro da mitocondria (ciclo de Krebs e cadeia respiratoria).' },
      { speaker: 'teaching', text: 'Glicolise = quebra da glicose. Ciclo de Krebs = extrai energia. Cadeia respiratoria = produz a maior parte do ATP!' },
      { speaker: 'drCell', text: 'No final, a glicose e completamente transformada em gas carbonico, agua e ENERGIA na forma de ATP!' },
      { speaker: 'narrative', text: 'Uma unica molecula de glicose pode produzir ate 38 moleculas de ATP! E uma conversao muito eficiente.' },
      { speaker: 'fragmento', text: 'Glicose + oxigenio = energia! Como chamamos esse processo vital?' }
    ],
    question: 'Como e chamado o processo pelo qual a celula produz ATP a partir da glicose usando oxigenio?',
    expectedAnswer: 'Respiracao celular aerobica.',
    keywords: ['respiracao', 'celular', 'aerobica', 'respiracao celular'],
    hint: 'Usa oxigenio (AEROBICO), acontece dentro da CELULA, produz ATP. E diferente de respiracao pulmonar...',
    explanation: 'RESPIRACAO CELULAR AEROBICA e o processo que converte GLICOSE + OXIGENIO em CO2, H2O e ATP (energia)! Acontece em etapas: glicolise (citoplasma) + ciclo de Krebs + cadeia respiratoria (mitocondrias). Produz ate 38 ATPs por glicose! E a principal forma de obtencao de energia nas celulas.'
  },

  // CASO 27
  {
    id: 27,
    roomId: 8,
    theme: 'Metabolismo Celular',
    caseTitle: 'O Balanco Energetico',
    dialogues: [
      { speaker: 'drCell', text: 'Ultimo caso da Central Energetica! Vamos resumir a equacao da respiracao celular.' },
      { speaker: 'drCell', text: 'Na respiracao celular, substancias ENTRAM e outras SAEM. E importante saber quais sao!' },
      { speaker: 'teaching', text: 'REAGENTES (o que entra): glicose e oxigenio. PRODUTOS (o que sai): gas carbonico, agua e ATP (energia).' },
      { speaker: 'narrative', text: 'A equacao simplificada e: C6H12O6 + 6O2 -> 6CO2 + 6H2O + ATP' },
      { speaker: 'narrative', text: 'Traduzindo: uma glicose + seis oxigenios produzem seis gas carbonicos + seis aguas + energia!' },
      { speaker: 'teaching', text: 'Curiosidade: essa equacao e o INVERSO da fotossintese! Na fotossintese: CO2 + H2O + luz -> glicose + O2' },
      { speaker: 'drCell', text: 'Plantas fazem fotossintese (produzem glicose e O2) e respiracao celular (consomem glicose e O2). Animais so fazem respiracao celular!' },
      { speaker: 'narrative', text: 'O CO2 que voce expira e o gas carbonico produzido pela respiracao celular nas suas trilhoes de celulas!' },
      { speaker: 'fragmento', text: 'Entrada e saida, o ciclo da energia... Quais sao os PRODUTOS da respiracao celular?' }
    ],
    question: 'Quais sao os produtos finais da respiracao celular aerobica?',
    expectedAnswer: 'Gas carbonico (CO2), agua (H2O) e ATP (energia).',
    keywords: ['co2', 'gas carbonico', 'dioxido de carbono', 'agua', 'h2o', 'atp', 'energia', 'carbonico'],
    hint: 'O que SAI da respiracao? Um gas que expiramos + um liquido + energia...',
    explanation: 'Os PRODUTOS da respiracao celular sao: GAS CARBONICO (CO2) - eliminado na expiracao, AGUA (H2O) - usada ou eliminada, e ATP (energia) - usado em todas as atividades celulares. A equacao resumida: C6H12O6 + 6O2 -> 6CO2 + 6H2O + ATP!'
  },

  // CASO 28 - Revisao Final
  {
    id: 28,
    roomId: 9,
    theme: 'Revisao Final',
    caseTitle: 'A Celula Completa',
    dialogues: [
      { speaker: 'drCell', text: 'Detetive, chegamos ao Nucleo Central - a ultima etapa da nossa jornada para restaurar minha memoria!' },
      { speaker: 'drCell', text: 'Voce aprendeu muito sobre celulas: historia, tipos, organelas, membrana, transporte, metabolismo... Agora vamos integrar tudo!' },
      { speaker: 'teaching', text: 'Lembre-se: existem dois grandes grupos de celulas - PROCARIONTES (bacterias e arqueas) e EUCARIONTES (animais, plantas, fungos).' },
      { speaker: 'narrative', text: 'A grande diferenca entre elas e a COMPLEXIDADE. Eucariontes sao muito mais organizadas e especializadas.' },
      { speaker: 'narrative', text: 'Imagine a diferenca entre uma tenda de camping (procarionte) e um apartamento moderno (eucarionte). Ambos sao "casas", mas um tem muito mais comodoscos!' },
      { speaker: 'teaching', text: 'Eucariontes tem: nucleo com carioteca, mitocondrias, reticulo, Golgi, lisossomos... Procariontes tem estrutura muito mais simples.' },
      { speaker: 'drCell', text: 'Mas por que eucariontes precisam de toda essa complexidade? Porque sao celulas maiores e fazem mais coisas!' },
      { speaker: 'narrative', text: 'A compartimentalizacao permite que diferentes processos acontecam ao mesmo tempo sem interferir um no outro.' },
      { speaker: 'fragmento', text: 'Simplicidade versus complexidade... Por que eucariontes sao considerados MAIS complexos que procariontes?' }
    ],
    question: 'Por que as celulas eucariontes sao consideradas mais complexas que as procariontes?',
    expectedAnswer: 'Porque possuem nucleo definido e diversas organelas membranosas especializadas.',
    keywords: ['nucleo', 'organelas', 'membranosas', 'compartimentalizacao', 'complexidade', 'especializacao', 'carioteca'],
    hint: 'Pense nas diferencas: eucariontes tem compartimentos separados por membranas, cada um com funcao especifica...',
    explanation: 'Eucariontes sao mais complexos porque possuem COMPARTIMENTALIZACAO: um NUCLEO verdadeiro (com carioteca) que protege o DNA, e diversas ORGANELAS MEMBRANOSAS especializadas (mitocondrias, RE, Golgi, lisossomos, etc.). Cada compartimento tem funcao especifica, aumentando a eficiencia e permitindo celulas maiores!'
  },

  // CASO 29
  {
    id: 29,
    roomId: 9,
    theme: 'Revisao Final',
    caseTitle: 'O Fluxo da Informacao',
    dialogues: [
      { speaker: 'drCell', text: 'Penultimo caso! Vamos revisar como a informacao genetica flui dentro da celula.' },
      { speaker: 'drCell', text: 'O DNA contem as instrucoes para tudo na celula. Mas como essas instrucoes viram acoes concretas?' },
      { speaker: 'teaching', text: 'DNA e como um livro de receitas trancado no cofre (nucleo). RNA e o chef que copia a receita e leva para a cozinha (citoplasma).' },
      { speaker: 'narrative', text: 'Primeiro, um trecho do DNA e copiado em RNA. Esse processo se chama TRANSCRICAO (trans = atraves, scricao = escrita).' },
      { speaker: 'narrative', text: 'O RNA mensageiro viaja para o citoplasma e e lido pelos ribossomos. Eles montam a proteina correspondente. Isso e TRADUCAO!' },
      { speaker: 'teaching', text: 'TRANSCRICAO: DNA -> RNA (no nucleo). TRADUCAO: RNA -> Proteina (nos ribossomos, no citoplasma).' },
      { speaker: 'drCell', text: 'Esse fluxo DNA -> RNA -> Proteina e tao importante que foi chamado de "Dogma Central da Biologia Molecular"!' },
      { speaker: 'narrative', text: 'Todas as caracteristicas que voce tem - cor dos olhos, tipo sanguineo, etc. - resultam desse fluxo de informacao!' },
      { speaker: 'fragmento', text: 'Do DNA ate a proteina, dois passos essenciais... Quais sao eles?' }
    ],
    question: 'Quais sao os dois processos principais que permitem a expressao da informacao genetica do DNA em proteinas?',
    expectedAnswer: 'Transcricao (DNA para RNA) e traducao (RNA para proteina).',
    keywords: ['transcricao', 'traducao', 'transcricao e traducao'],
    hint: 'DNA -> ??? -> RNA -> ??? -> Proteina. Preencha os processos!',
    explanation: 'Os dois processos sao: 1) TRANSCRICAO - o DNA e copiado em RNA mensageiro no nucleo; 2) TRADUCAO - o mRNA e lido pelos ribossomos no citoplasma para sintetizar proteinas. Esse fluxo (DNA -> RNA -> Proteina) e o "Dogma Central da Biologia Molecular" e explica como genes controlam caracteristicas!'
  },

  // CASO 30
  {
    id: 30,
    roomId: 9,
    theme: 'Revisao Final',
    caseTitle: 'Missao Completa',
    dialogues: [
      { speaker: 'drCell', text: 'DETETIVE! Este e o momento final! A pergunta que vai restaurar completamente minha memoria!' },
      { speaker: 'drCell', text: 'Voce me ajudou a lembrar da historia, dos tipos de celulas, das organelas, da membrana, do transporte, do metabolismo...' },
      { speaker: 'teaching', text: 'Tudo comecou com a TEORIA CELULAR - a base de toda a biologia moderna. Formulada por Schleiden, Schwann e completada por Virchow.' },
      { speaker: 'narrative', text: 'Essa teoria tem TRES principios fundamentais que unificam todo o conhecimento sobre a vida.' },
      { speaker: 'narrative', text: 'O primeiro diz que a celula e a UNIDADE ESTRUTURAL de todos os seres vivos - todos sao feitos de celulas.' },
      { speaker: 'narrative', text: 'O segundo diz que a celula e a UNIDADE FUNCIONAL - todas as atividades vitais ocorrem nas celulas.' },
      { speaker: 'narrative', text: 'O terceiro diz que celulas so nascem de OUTRAS CELULAS - nao surgem do nada!' },
      { speaker: 'drCell', text: 'Com esses tres principios, voce entende que toda a vida na Terra e conectada por essa unidade fundamental!' },
      { speaker: 'fragmento', text: 'O grande final... Voce realmente aprendeu? Me diga as TRES premissas da Teoria Celular!' }
    ],
    question: 'Quais sao as tres premissas fundamentais da Teoria Celular?',
    expectedAnswer: '1) Todos os seres vivos sao formados por celulas; 2) A celula e a unidade funcional da vida; 3) Toda celula provem de outra celula preexistente.',
    keywords: ['todos os seres', 'formados por celulas', 'unidade', 'funcional', 'preexistente', 'origem', 'celula anterior', 'basica', 'fundamental'],
    hint: 'Tres ideias: 1) todos sao feitos de celulas, 2) celulas fazem as funcoes vitais, 3) celulas vem de outras celulas...',
    explanation: 'As TRES premissas da TEORIA CELULAR sao: 1) TODOS os seres vivos sao constituidos por celulas (unidade estrutural); 2) A celula e a unidade FUNCIONAL da vida - todas as reacoes vitais ocorrem nelas; 3) Toda celula provem de outra celula PREEXISTENTE (Virchow). Esses principios unificam toda a biologia!'
  }
]
