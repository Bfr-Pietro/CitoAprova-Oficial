'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface CellCharactersProps {
  mousePosition: { x: number; y: number }
  isPasswordVisible: boolean
  isNearSubmitButton: boolean
  isFormValid: boolean
  isTyping: boolean
  isFocused: boolean
}

export function CellCharacters({
  mousePosition,
  isPasswordVisible,
  isNearSubmitButton,
  isFormValid,
  isTyping,
}: CellCharactersProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Container dos personagens em grid 2x2 */}
      <div className="relative w-full max-w-[500px] h-[500px]">
        <Character
          type="red-cell"
          position={{ x: '5%', y: '5%' }}
          mousePosition={mousePosition}
          isPasswordVisible={isPasswordVisible}
          isNearSubmitButton={isNearSubmitButton}
          isFormValid={isFormValid}
          isTyping={isTyping}
          delay={0}
        />
        <Character
          type="white-cell"
          position={{ x: '52%', y: '5%' }}
          mousePosition={mousePosition}
          isPasswordVisible={isPasswordVisible}
          isNearSubmitButton={isNearSubmitButton}
          isFormValid={isFormValid}
          isTyping={isTyping}
          delay={0.1}
        />
        <Character
          type="neuron"
          position={{ x: '5%', y: '52%' }}
          mousePosition={mousePosition}
          isPasswordVisible={isPasswordVisible}
          isNearSubmitButton={isNearSubmitButton}
          isFormValid={isFormValid}
          isTyping={isTyping}
          delay={0.2}
        />
        <Character
          type="bacteria"
          position={{ x: '52%', y: '52%' }}
          mousePosition={mousePosition}
          isPasswordVisible={isPasswordVisible}
          isNearSubmitButton={isNearSubmitButton}
          isFormValid={isFormValid}
          isTyping={isTyping}
          delay={0.3}
        />
      </div>
    </div>
  )
}

interface CharacterProps {
  type: 'red-cell' | 'white-cell' | 'neuron' | 'bacteria'
  position: { x: string; y: string }
  mousePosition: { x: number; y: number }
  isPasswordVisible: boolean
  isNearSubmitButton: boolean
  isFormValid: boolean
  isTyping: boolean
  delay: number
}

function Character({
  type,
  position,
  mousePosition,
  isPasswordVisible,
  isNearSubmitButton,
  isFormValid,
  isTyping,
  delay,
}: CharacterProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })
  const [blink, setBlink] = useState(false)
  const [isHiding, setIsHiding] = useState(false)
  const [bounceY, setBounceY] = useState(0)
  const [squish, setSquish] = useState({ x: 1, y: 1 })
  const animationRef = useRef<number>(undefined)
  const timeRef = useRef(0)

  // Animacao principal dos olhos seguindo o mouse
  const updateEyes = useCallback(() => {
    if (!svgRef.current || isPasswordVisible) return

    const rect = svgRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = mousePosition.x - centerX
    const deltaY = mousePosition.y - centerY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    const maxOffset = 8
    const normalizedX = distance > 0 ? deltaX / distance : 0
    const normalizedY = distance > 0 ? deltaY / distance : 0
    const factor = Math.min(distance / 200, 1)

    const targetX = normalizedX * factor * maxOffset
    const targetY = normalizedY * factor * maxOffset

    setEyeOffset(prev => ({
      x: prev.x + (targetX - prev.x) * 0.15,
      y: prev.y + (targetY - prev.y) * 0.15,
    }))
  }, [mousePosition, isPasswordVisible])

  // Loop de animacao
  useEffect(() => {
    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000
      lastTime = currentTime
      timeRef.current += delta

      updateEyes()

      // Animacao de bounce quando excitado
      if (isNearSubmitButton && isFormValid) {
        const bounce = Math.abs(Math.sin(timeRef.current * 8 + delay * 10)) * 15
        setBounceY(bounce)
        setSquish({
          x: 1 + Math.sin(timeRef.current * 8 + delay * 10) * 0.06,
          y: 1 - Math.sin(timeRef.current * 8 + delay * 10) * 0.06,
        })
      } else {
        setBounceY(prev => prev * 0.9)
        setSquish(prev => ({
          x: prev.x + (1 - prev.x) * 0.1,
          y: prev.y + (1 - prev.y) * 0.1,
        }))
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [updateEyes, isNearSubmitButton, isFormValid, delay])

  // Piscar aleatoriamente
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7 && !isPasswordVisible) {
        setBlink(true)
        setTimeout(() => setBlink(false), 100)
      }
    }, 2500 + Math.random() * 2000)

    return () => clearInterval(blinkInterval)
  }, [isPasswordVisible])

  // Esconder quando senha visivel
  useEffect(() => {
    setIsHiding(isPasswordVisible)
  }, [isPasswordVisible])

  const isExcited = isNearSubmitButton && isFormValid
  const isCurious = isTyping && !isExcited

  const renderCharacter = () => {
    switch (type) {
      case 'red-cell':
        return (
          <RedCellSVG
            eyeOffset={eyeOffset}
            blink={blink}
            isHiding={isHiding}
            isExcited={isExcited}
            isCurious={isCurious}
          />
        )
      case 'white-cell':
        return (
          <WhiteCellSVG
            eyeOffset={eyeOffset}
            blink={blink}
            isHiding={isHiding}
            isExcited={isExcited}
            isCurious={isCurious}
          />
        )
      case 'neuron':
        return (
          <NeuronSVG
            eyeOffset={eyeOffset}
            blink={blink}
            isHiding={isHiding}
            isExcited={isExcited}
            isCurious={isCurious}
          />
        )
      case 'bacteria':
        return (
          <BacteriaSVG
            eyeOffset={eyeOffset}
            blink={blink}
            isHiding={isHiding}
            isExcited={isExcited}
            isCurious={isCurious}
          />
        )
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: '45%',
        height: '45%',
        transform: `translateY(${-bounceY}px) scaleX(${squish.x}) scaleY(${squish.y})`,
        transition: isHiding ? 'transform 0.3s ease' : 'none',
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 200 200"
        className="w-full h-full"
        style={{
          transform: isHiding ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.4s ease-in-out',
          transformStyle: 'preserve-3d',
        }}
      >
        {renderCharacter()}
      </svg>
    </div>
  )
}

interface CellSVGProps {
  eyeOffset: { x: number; y: number }
  blink: boolean
  isHiding: boolean
  isExcited: boolean
  isCurious: boolean
}

// Globulo Vermelho - Design detalhado
function RedCellSVG({ eyeOffset, blink, isHiding, isExcited, isCurious }: CellSVGProps) {
  return (
    <g>
      {/* Sombra */}
      <ellipse cx="100" cy="185" rx="60" ry="12" fill="rgba(0,0,0,0.15)" />

      {/* Corpo principal - formato de disco biconcavo */}
      <defs>
        <radialGradient id="redCellGrad" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#ff8a8a" />
          <stop offset="40%" stopColor="#e74c3c" />
          <stop offset="80%" stopColor="#c0392b" />
          <stop offset="100%" stopColor="#a93226" />
        </radialGradient>
        <radialGradient id="redCellInner" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(192,57,43,0.6)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Corpo */}
      <ellipse cx="100" cy="100" rx="85" ry="80" fill="url(#redCellGrad)" />

      {/* Depressao central caracteristica da hemacia */}
      <ellipse cx="100" cy="100" rx="35" ry="30" fill="url(#redCellInner)" />

      {/* Brilho superior */}
      <ellipse cx="70" cy="55" rx="35" ry="18" fill="rgba(255,255,255,0.4)" />
      <ellipse cx="60" cy="50" rx="20" ry="10" fill="rgba(255,255,255,0.3)" />

      {/* Borda interna 3D */}
      <ellipse cx="100" cy="100" rx="80" ry="75" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />

      {/* Face */}
      {!isHiding && (
        <g>
          {/* Sobrancelhas quando curioso */}
          {isCurious && (
            <>
              <rect x="60" y="68" width="18" height="4" rx="2" fill="#8b4513" transform="rotate(-10 69 70)" />
              <rect x="120" y="68" width="18" height="4" rx="2" fill="#8b4513" transform="rotate(10 129 70)" />
            </>
          )}

          {/* Sobrancelhas felizes */}
          {isExcited && (
            <>
              <path d="M58 72 Q69 65 80 72" stroke="#8b4513" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M120 72 Q131 65 142 72" stroke="#8b4513" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* Olhos */}
          <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
            {/* Olho esquerdo */}
            <ellipse cx="70" cy="90" rx="18" ry={blink ? 3 : 20} fill="white" />
            {!blink && (
              <>
                <circle cx={70 + eyeOffset.x * 0.5} cy={90 + eyeOffset.y * 0.5} r="10" fill="#2c3e50" />
                <circle cx={67 + eyeOffset.x * 0.3} cy={86 + eyeOffset.y * 0.3} r="4" fill="white" />
                <circle cx={73 + eyeOffset.x * 0.3} cy={92 + eyeOffset.y * 0.3} r="2" fill="rgba(255,255,255,0.6)" />
              </>
            )}

            {/* Olho direito */}
            <ellipse cx="130" cy="90" rx="18" ry={blink ? 3 : 20} fill="white" />
            {!blink && (
              <>
                <circle cx={130 + eyeOffset.x * 0.5} cy={90 + eyeOffset.y * 0.5} r="10" fill="#2c3e50" />
                <circle cx={127 + eyeOffset.x * 0.3} cy={86 + eyeOffset.y * 0.3} r="4" fill="white" />
                <circle cx={133 + eyeOffset.x * 0.3} cy={92 + eyeOffset.y * 0.3} r="2" fill="rgba(255,255,255,0.6)" />
              </>
            )}
          </g>

          {/* Bochechas quando excitado */}
          {isExcited && (
            <>
              <ellipse cx="45" cy="110" rx="12" ry="8" fill="rgba(255,182,193,0.7)" />
              <ellipse cx="155" cy="110" rx="12" ry="8" fill="rgba(255,182,193,0.7)" />
            </>
          )}

          {/* Boca */}
          {isExcited ? (
            <g>
              <path d="M80 125 Q100 150 120 125" fill="#c0392b" stroke="#a93226" strokeWidth="2" />
              <ellipse cx="100" cy="138" rx="10" ry="6" fill="#e84393" />
            </g>
          ) : isCurious ? (
            <ellipse cx="100" cy="130" rx="8" ry="10" fill="#c0392b" />
          ) : (
            <path d="M85 128 Q100 138 115 128" fill="none" stroke="#c0392b" strokeWidth="4" strokeLinecap="round" />
          )}
        </g>
      )}

      {/* Costas quando escondendo */}
      {isHiding && (
        <g transform="scale(-1,1) translate(-200,0)">
          <ellipse cx="100" cy="90" rx="20" ry="15" fill="rgba(169,50,38,0.3)" />
          <ellipse cx="100" cy="110" rx="15" ry="10" fill="rgba(169,50,38,0.2)" />
        </g>
      )}
    </g>
  )
}

// Globulo Branco - Design detalhado
function WhiteCellSVG({ eyeOffset, blink, isHiding, isExcited, isCurious }: CellSVGProps) {
  return (
    <g>
      {/* Sombra */}
      <ellipse cx="100" cy="185" rx="65" ry="12" fill="rgba(0,0,0,0.12)" />

      <defs>
        <radialGradient id="whiteCellGrad" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#ecf0f1" />
          <stop offset="70%" stopColor="#bdc3c7" />
          <stop offset="100%" stopColor="#95a5a6" />
        </radialGradient>
        <radialGradient id="nucleusGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#9b59b6" />
          <stop offset="100%" stopColor="#8e44ad" />
        </radialGradient>
      </defs>

      {/* Pseudopodes - extensoes do corpo */}
      <ellipse cx="40" cy="150" rx="25" ry="35" fill="url(#whiteCellGrad)" />
      <ellipse cx="70" cy="160" rx="20" ry="30" fill="url(#whiteCellGrad)" />
      <ellipse cx="130" cy="160" rx="20" ry="30" fill="url(#whiteCellGrad)" />
      <ellipse cx="160" cy="150" rx="25" ry="35" fill="url(#whiteCellGrad)" />

      {/* Corpo principal */}
      <ellipse cx="100" cy="95" rx="80" ry="75" fill="url(#whiteCellGrad)" />

      {/* Nucleo multi-lobulado */}
      <ellipse cx="55" cy="55" rx="20" ry="15" fill="url(#nucleusGrad)" opacity="0.6" />
      <ellipse cx="80" cy="48" rx="18" ry="14" fill="url(#nucleusGrad)" opacity="0.6" />
      <ellipse cx="105" cy="52" rx="16" ry="12" fill="url(#nucleusGrad)" opacity="0.6" />

      {/* Brilhos */}
      <ellipse cx="65" cy="60" rx="30" ry="15" fill="rgba(255,255,255,0.5)" />
      <ellipse cx="55" cy="55" rx="15" ry="8" fill="rgba(255,255,255,0.4)" />

      {/* Granulos internos */}
      <circle cx="140" cy="70" r="6" fill="rgba(149,165,166,0.4)" />
      <circle cx="150" cy="90" r="5" fill="rgba(149,165,166,0.3)" />
      <circle cx="55" cy="100" r="5" fill="rgba(149,165,166,0.3)" />

      {/* Face */}
      {!isHiding && (
        <g>
          {/* Sobrancelhas */}
          {isCurious && (
            <>
              <rect x="58" y="72" width="16" height="4" rx="2" fill="#7f8c8d" transform="rotate(-12 66 74)" />
              <rect x="122" y="72" width="16" height="4" rx="2" fill="#7f8c8d" transform="rotate(12 130 74)" />
            </>
          )}
          {isExcited && (
            <>
              <path d="M56 78 Q66 70 76 78" stroke="#7f8c8d" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M120 78 Q130 70 140 78" stroke="#7f8c8d" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* Olhos */}
          <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
            <ellipse cx="68" cy="95" rx="16" ry={blink ? 3 : 18} fill="white" stroke="#bdc3c7" strokeWidth="1" />
            {!blink && (
              <>
                <circle cx={68 + eyeOffset.x * 0.5} cy={95 + eyeOffset.y * 0.5} r="9" fill="#2c3e50" />
                <circle cx={65 + eyeOffset.x * 0.3} cy={91 + eyeOffset.y * 0.3} r="3.5" fill="white" />
                <circle cx={70 + eyeOffset.x * 0.3} cy={97 + eyeOffset.y * 0.3} r="1.5" fill="rgba(255,255,255,0.6)" />
              </>
            )}

            <ellipse cx="128" cy="95" rx="16" ry={blink ? 3 : 18} fill="white" stroke="#bdc3c7" strokeWidth="1" />
            {!blink && (
              <>
                <circle cx={128 + eyeOffset.x * 0.5} cy={95 + eyeOffset.y * 0.5} r="9" fill="#2c3e50" />
                <circle cx={125 + eyeOffset.x * 0.3} cy={91 + eyeOffset.y * 0.3} r="3.5" fill="white" />
                <circle cx={130 + eyeOffset.x * 0.3} cy={97 + eyeOffset.y * 0.3} r="1.5" fill="rgba(255,255,255,0.6)" />
              </>
            )}
          </g>

          {/* Bochechas */}
          {isExcited && (
            <>
              <ellipse cx="42" cy="108" rx="10" ry="7" fill="rgba(255,182,193,0.6)" />
              <ellipse cx="154" cy="108" rx="10" ry="7" fill="rgba(255,182,193,0.6)" />
            </>
          )}

          {/* Boca */}
          {isExcited ? (
            <g>
              <path d="M80 125 Q98 148 116 125" fill="#95a5a6" stroke="#7f8c8d" strokeWidth="2" />
              <ellipse cx="98" cy="135" rx="8" ry="5" fill="#e84393" />
            </g>
          ) : isCurious ? (
            <ellipse cx="98" cy="128" rx="7" ry="9" fill="#95a5a6" />
          ) : (
            <path d="M85 125 Q98 134 111 125" fill="none" stroke="#95a5a6" strokeWidth="4" strokeLinecap="round" />
          )}
        </g>
      )}

      {isHiding && (
        <g transform="scale(-1,1) translate(-200,0)">
          <ellipse cx="100" cy="90" rx="25" ry="18" fill="rgba(149,165,166,0.3)" />
        </g>
      )}
    </g>
  )
}

// Neuronio - Design detalhado
function NeuronSVG({ eyeOffset, blink, isHiding, isExcited, isCurious }: CellSVGProps) {
  return (
    <g>
      {/* Sombra */}
      <ellipse cx="100" cy="190" rx="55" ry="10" fill="rgba(0,0,0,0.12)" />

      <defs>
        <radialGradient id="neuronGrad" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#d4a5ff" />
          <stop offset="40%" stopColor="#9b59b6" />
          <stop offset="80%" stopColor="#8e44ad" />
          <stop offset="100%" stopColor="#6c3483" />
        </radialGradient>
        <linearGradient id="dendriteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9b59b6" />
          <stop offset="100%" stopColor="#e91e63" />
        </linearGradient>
        <linearGradient id="axonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8e44ad" />
          <stop offset="100%" stopColor="#e91e63" />
        </linearGradient>
      </defs>

      {/* Dendritos - partes superiores ramificadas */}
      <path d="M50 45 Q40 25 30 10" stroke="url(#dendriteGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M45 50 Q30 40 15 35" stroke="url(#dendriteGrad)" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M75 35 Q70 15 60 0" stroke="url(#dendriteGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M100 30 Q100 10 95 -5" stroke="url(#dendriteGrad)" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M125 35 Q130 15 140 0" stroke="url(#dendriteGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M150 45 Q160 25 170 10" stroke="url(#dendriteGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M155 50 Q170 40 185 35" stroke="url(#dendriteGrad)" strokeWidth="5" fill="none" strokeLinecap="round" />

      {/* Corpo celular (soma) */}
      <ellipse cx="100" cy="90" rx="65" ry="60" fill="url(#neuronGrad)" />

      {/* Nucleo */}
      <ellipse cx="100" cy="85" rx="25" ry="22" fill="rgba(108,52,131,0.5)" />
      <ellipse cx="100" cy="82" rx="15" ry="12" fill="rgba(108,52,131,0.3)" />

      {/* Brilhos */}
      <ellipse cx="70" cy="55" rx="25" ry="12" fill="rgba(255,255,255,0.4)" />
      <ellipse cx="60" cy="50" rx="12" ry="6" fill="rgba(255,255,255,0.3)" />

      {/* Axonio - parte inferior */}
      <path d="M100 150 L100 175 Q100 185 95 195" stroke="url(#axonGrad)" strokeWidth="10" fill="none" strokeLinecap="round" />
      
      {/* Terminais do axonio */}
      <circle cx="85" cy="195" r="6" fill="#e91e63" />
      <circle cx="100" cy="198" r="6" fill="#e91e63" />
      <circle cx="115" cy="195" r="6" fill="#e91e63" />

      {/* Face */}
      {!isHiding && (
        <g>
          {isCurious && (
            <>
              <rect x="55" y="62" width="15" height="4" rx="2" fill="#4a235a" transform="rotate(-12 62 64)" />
              <rect x="125" y="62" width="15" height="4" rx="2" fill="#4a235a" transform="rotate(12 132 64)" />
            </>
          )}
          {isExcited && (
            <>
              <path d="M52 70 Q62 62 72 70" stroke="#4a235a" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M123 70 Q133 62 143 70" stroke="#4a235a" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* Olhos */}
          <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
            <ellipse cx="70" cy="85" rx="15" ry={blink ? 3 : 17} fill="white" />
            {!blink && (
              <>
                <circle cx={70 + eyeOffset.x * 0.5} cy={85 + eyeOffset.y * 0.5} r="8" fill="#2c3e50" />
                <circle cx={67 + eyeOffset.x * 0.3} cy={81 + eyeOffset.y * 0.3} r="3" fill="white" />
                <circle cx={72 + eyeOffset.x * 0.3} cy={87 + eyeOffset.y * 0.3} r="1.5" fill="rgba(255,255,255,0.6)" />
              </>
            )}

            <ellipse cx="130" cy="85" rx="15" ry={blink ? 3 : 17} fill="white" />
            {!blink && (
              <>
                <circle cx={130 + eyeOffset.x * 0.5} cy={85 + eyeOffset.y * 0.5} r="8" fill="#2c3e50" />
                <circle cx={127 + eyeOffset.x * 0.3} cy={81 + eyeOffset.y * 0.3} r="3" fill="white" />
                <circle cx={132 + eyeOffset.x * 0.3} cy={87 + eyeOffset.y * 0.3} r="1.5" fill="rgba(255,255,255,0.6)" />
              </>
            )}
          </g>

          {isExcited && (
            <>
              <ellipse cx="42" cy="100" rx="10" ry="7" fill="rgba(255,182,193,0.6)" />
              <ellipse cx="158" cy="100" rx="10" ry="7" fill="rgba(255,182,193,0.6)" />
            </>
          )}

          {isExcited ? (
            <g>
              <path d="M80 115 Q100 138 120 115" fill="#6c3483" stroke="#4a235a" strokeWidth="2" />
              <ellipse cx="100" cy="125" rx="8" ry="5" fill="#e84393" />
            </g>
          ) : isCurious ? (
            <ellipse cx="100" cy="118" rx="7" ry="9" fill="#6c3483" />
          ) : (
            <path d="M85 115 Q100 125 115 115" fill="none" stroke="#6c3483" strokeWidth="4" strokeLinecap="round" />
          )}
        </g>
      )}

      {isHiding && (
        <g transform="scale(-1,1) translate(-200,0)">
          <ellipse cx="100" cy="85" rx="20" ry="15" fill="rgba(108,52,131,0.4)" />
        </g>
      )}
    </g>
  )
}

// Bacteria - Design detalhado
function BacteriaSVG({ eyeOffset, blink, isHiding, isExcited, isCurious }: CellSVGProps) {
  return (
    <g>
      {/* Sombra */}
      <ellipse cx="100" cy="175" rx="70" ry="12" fill="rgba(0,0,0,0.12)" />

      <defs>
        <radialGradient id="bacteriaGrad" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#7dffb3" />
          <stop offset="40%" stopColor="#00b894" />
          <stop offset="80%" stopColor="#00a085" />
          <stop offset="100%" stopColor="#008060" />
        </radialGradient>
        <linearGradient id="flagellaGrad" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#00b894" />
          <stop offset="100%" stopColor="#00cec9" />
        </linearGradient>
      </defs>

      {/* Flagelos (lado esquerdo) - ondulados */}
      <path d="M25 80 Q5 75 -10 90 Q-25 105 -15 120" stroke="url(#flagellaGrad)" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M25 100 Q0 100 -15 110 Q-30 120 -20 135" stroke="url(#flagellaGrad)" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M25 120 Q5 125 -10 115 Q-25 105 -20 95" stroke="url(#flagellaGrad)" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* Corpo principal - forma oval/bastonete */}
      <ellipse cx="100" cy="100" rx="80" ry="55" fill="url(#bacteriaGrad)" />

      {/* Membrana celular - linha interna */}
      <ellipse cx="100" cy="100" rx="72" ry="48" fill="none" stroke="rgba(0,128,96,0.3)" strokeWidth="2" />

      {/* Nucleoide (DNA bacteriano) */}
      <ellipse cx="100" cy="100" rx="30" ry="20" fill="rgba(0,128,96,0.2)" />
      <path d="M80 95 Q90 105 100 95 Q110 85 120 95" stroke="rgba(0,128,96,0.4)" strokeWidth="3" fill="none" />

      {/* Ribossomos */}
      <circle cx="60" cy="85" r="4" fill="rgba(0,160,133,0.5)" />
      <circle cx="140" cy="85" r="4" fill="rgba(0,160,133,0.5)" />
      <circle cx="55" cy="115" r="3" fill="rgba(0,160,133,0.4)" />
      <circle cx="145" cy="115" r="3" fill="rgba(0,160,133,0.4)" />

      {/* Brilhos */}
      <ellipse cx="65" cy="65" rx="30" ry="15" fill="rgba(255,255,255,0.4)" />
      <ellipse cx="55" cy="60" rx="15" ry="8" fill="rgba(255,255,255,0.3)" />

      {/* Pili (lado direito) */}
      <line x1="175" y1="75" x2="195" y2="70" stroke="#00b894" strokeWidth="3" strokeLinecap="round" />
      <line x1="178" y1="90" x2="198" y2="88" stroke="#00b894" strokeWidth="3" strokeLinecap="round" />
      <line x1="178" y1="105" x2="198" y2="107" stroke="#00b894" strokeWidth="3" strokeLinecap="round" />
      <line x1="175" y1="120" x2="195" y2="125" stroke="#00b894" strokeWidth="3" strokeLinecap="round" />

      {/* Face */}
      {!isHiding && (
        <g>
          {isCurious && (
            <>
              <rect x="62" y="70" width="14" height="3" rx="1.5" fill="#006d5b" transform="rotate(-12 69 71)" />
              <rect x="118" y="70" width="14" height="3" rx="1.5" fill="#006d5b" transform="rotate(12 125 71)" />
            </>
          )}
          {isExcited && (
            <>
              <path d="M58 78 Q68 70 78 78" stroke="#006d5b" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M118 78 Q128 70 138 78" stroke="#006d5b" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* Olhos */}
          <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
            <ellipse cx="72" cy="92" rx="14" ry={blink ? 3 : 16} fill="white" />
            {!blink && (
              <>
                <circle cx={72 + eyeOffset.x * 0.5} cy={92 + eyeOffset.y * 0.5} r="8" fill="#2c3e50" />
                <circle cx={69 + eyeOffset.x * 0.3} cy={88 + eyeOffset.y * 0.3} r="3" fill="white" />
                <circle cx={74 + eyeOffset.x * 0.3} cy={94 + eyeOffset.y * 0.3} r="1.5" fill="rgba(255,255,255,0.6)" />
              </>
            )}

            <ellipse cx="128" cy="92" rx="14" ry={blink ? 3 : 16} fill="white" />
            {!blink && (
              <>
                <circle cx={128 + eyeOffset.x * 0.5} cy={92 + eyeOffset.y * 0.5} r="8" fill="#2c3e50" />
                <circle cx={125 + eyeOffset.x * 0.3} cy={88 + eyeOffset.y * 0.3} r="3" fill="white" />
                <circle cx={130 + eyeOffset.x * 0.3} cy={94 + eyeOffset.y * 0.3} r="1.5" fill="rgba(255,255,255,0.6)" />
              </>
            )}
          </g>

          {isExcited && (
            <>
              <ellipse cx="48" cy="105" rx="9" ry="6" fill="rgba(255,182,193,0.6)" />
              <ellipse cx="152" cy="105" rx="9" ry="6" fill="rgba(255,182,193,0.6)" />
            </>
          )}

          {isExcited ? (
            <g>
              <path d="M82 118 Q100 140 118 118" fill="#008060" stroke="#006d5b" strokeWidth="2" />
              <ellipse cx="100" cy="128" rx="7" ry="4" fill="#e84393" />
            </g>
          ) : isCurious ? (
            <ellipse cx="100" cy="120" rx="6" ry="8" fill="#008060" />
          ) : (
            <path d="M88 118 Q100 128 112 118" fill="none" stroke="#008060" strokeWidth="4" strokeLinecap="round" />
          )}
        </g>
      )}

      {isHiding && (
        <g transform="scale(-1,1) translate(-200,0)">
          <ellipse cx="100" cy="95" rx="25" ry="15" fill="rgba(0,128,96,0.3)" />
        </g>
      )}
    </g>
  )
}

export default CellCharacters
