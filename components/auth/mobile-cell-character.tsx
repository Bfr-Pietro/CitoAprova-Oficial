'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

interface MobileCellCharacterProps {
  isPasswordVisible: boolean
  isNearSubmitButton: boolean
  isFormValid: boolean
  isTyping: boolean
}

export default function MobileCellCharacter({
  isPasswordVisible,
  isNearSubmitButton,
  isFormValid,
  isTyping,
}: MobileCellCharacterProps) {
  const timeRef = useRef(0)
  const animationRef = useRef<number>()
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })
  const [blink, setBlink] = useState(false)
  const [bounceY, setBounceY] = useState(0)
  const [squish, setSquish] = useState({ x: 1, y: 1 })
  const [isHiding, setIsHiding] = useState(false)

  const isExcited = isNearSubmitButton && isFormValid
  const isCurious = isTyping && !isExcited

  // Loop de animacao
  useEffect(() => {
    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000
      lastTime = currentTime
      timeRef.current += delta

      // Movimento natural dos olhos
      if (!isPasswordVisible) {
        const targetX = Math.sin(timeRef.current * 0.8) * 6
        const targetY = Math.cos(timeRef.current * 0.6) * 4
        setEyeOffset(prev => ({
          x: prev.x + (targetX - prev.x) * 0.08,
          y: prev.y + (targetY - prev.y) * 0.08,
        }))
      }

      // Bounce quando excitado
      if (isExcited) {
        const bounce = Math.abs(Math.sin(timeRef.current * 8)) * 12
        setBounceY(bounce)
        setSquish({
          x: 1 + Math.sin(timeRef.current * 8) * 0.05,
          y: 1 - Math.sin(timeRef.current * 8) * 0.05,
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
  }, [isPasswordVisible, isExcited])

  // Piscar
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6 && !isPasswordVisible) {
        setBlink(true)
        setTimeout(() => setBlink(false), 100)
      }
    }, 2500 + Math.random() * 2000)
    return () => clearInterval(interval)
  }, [isPasswordVisible])

  // Esconder
  useEffect(() => {
    setIsHiding(isPasswordVisible)
  }, [isPasswordVisible])

  return (
    <div className="relative w-full h-36 flex items-center justify-center overflow-visible">
      {/* Personagens */}
      <div className="relative flex items-center justify-center gap-3">
        {/* Personagem pequeno esquerdo */}
        <SmallCharacter
          type="white-cell"
          eyeOffset={eyeOffset}
          blink={blink}
          isHiding={isHiding}
          isExcited={isExcited}
          bounceY={bounceY * 0.7}
          squish={squish}
          delay={0.2}
          timeRef={timeRef}
        />

        {/* Personagem principal */}
        <div
          style={{
            transform: `translateY(${-bounceY}px) scaleX(${squish.x}) scaleY(${squish.y})`,
          }}
        >
          <svg
            viewBox="0 0 200 200"
            className="w-24 h-24"
            style={{
              transform: isHiding ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.4s ease-in-out',
            }}
          >
            {/* Globulo Vermelho Principal */}
            <defs>
              <radialGradient id="mobileRedGrad" cx="35%" cy="35%">
                <stop offset="0%" stopColor="#ff8a8a" />
                <stop offset="40%" stopColor="#e74c3c" />
                <stop offset="80%" stopColor="#c0392b" />
                <stop offset="100%" stopColor="#a93226" />
              </radialGradient>
            </defs>

            <ellipse cx="100" cy="180" rx="50" ry="10" fill="rgba(0,0,0,0.12)" />
            <ellipse cx="100" cy="100" rx="80" ry="75" fill="url(#mobileRedGrad)" />
            <ellipse cx="100" cy="100" rx="30" ry="25" fill="rgba(192,57,43,0.4)" />
            <ellipse cx="70" cy="55" rx="30" ry="15" fill="rgba(255,255,255,0.35)" />

            {!isHiding && (
              <g>
                {isCurious && (
                  <>
                    <rect x="60" y="68" width="16" height="4" rx="2" fill="#8b4513" transform="rotate(-10 68 70)" />
                    <rect x="122" y="68" width="16" height="4" rx="2" fill="#8b4513" transform="rotate(10 130 70)" />
                  </>
                )}
                {isExcited && (
                  <>
                    <path d="M58 72 Q68 64 78 72" stroke="#8b4513" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M122 72 Q132 64 142 72" stroke="#8b4513" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </>
                )}

                <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
                  <ellipse cx="70" cy="90" rx="16" ry={blink ? 3 : 18} fill="white" />
                  {!blink && (
                    <>
                      <circle cx={70 + eyeOffset.x * 0.5} cy={90 + eyeOffset.y * 0.5} r="9" fill="#2c3e50" />
                      <circle cx={67 + eyeOffset.x * 0.3} cy={86 + eyeOffset.y * 0.3} r="3.5" fill="white" />
                    </>
                  )}

                  <ellipse cx="130" cy="90" rx="16" ry={blink ? 3 : 18} fill="white" />
                  {!blink && (
                    <>
                      <circle cx={130 + eyeOffset.x * 0.5} cy={90 + eyeOffset.y * 0.5} r="9" fill="#2c3e50" />
                      <circle cx={127 + eyeOffset.x * 0.3} cy={86 + eyeOffset.y * 0.3} r="3.5" fill="white" />
                    </>
                  )}
                </g>

                {isExcited && (
                  <>
                    <ellipse cx="45" cy="105" rx="10" ry="7" fill="rgba(255,182,193,0.6)" />
                    <ellipse cx="155" cy="105" rx="10" ry="7" fill="rgba(255,182,193,0.6)" />
                  </>
                )}

                {isExcited ? (
                  <g>
                    <path d="M80 122 Q100 145 120 122" fill="#c0392b" />
                    <ellipse cx="100" cy="132" rx="8" ry="5" fill="#e84393" />
                  </g>
                ) : isCurious ? (
                  <ellipse cx="100" cy="125" rx="7" ry="9" fill="#c0392b" />
                ) : (
                  <path d="M85 125 Q100 135 115 125" fill="none" stroke="#c0392b" strokeWidth="4" strokeLinecap="round" />
                )}
              </g>
            )}

            {isHiding && (
              <g transform="scale(-1,1) translate(-200,0)">
                <ellipse cx="100" cy="90" rx="18" ry="12" fill="rgba(169,50,38,0.25)" />
                <ellipse cx="100" cy="108" rx="12" ry="8" fill="rgba(169,50,38,0.15)" />
              </g>
            )}
          </svg>
        </div>

        {/* Personagem pequeno direito */}
        <SmallCharacter
          type="neuron"
          eyeOffset={eyeOffset}
          blink={blink}
          isHiding={isHiding}
          isExcited={isExcited}
          bounceY={bounceY * 0.8}
          squish={squish}
          delay={0.4}
          timeRef={timeRef}
        />
      </div>

      {/* Texto */}
      <div className="absolute -bottom-1 left-0 right-0 text-center text-xs font-medium text-muted-foreground/60">
        {isHiding ? 'Nao estamos olhando!' : isExcited ? 'Vamos la!' : isTyping ? 'Continue...' : 'Ola!'}
      </div>
    </div>
  )
}

function SmallCharacter({
  type,
  eyeOffset,
  blink,
  isHiding,
  isExcited,
  bounceY,
  squish,
  delay,
  timeRef,
}: {
  type: 'white-cell' | 'neuron'
  eyeOffset: { x: number; y: number }
  blink: boolean
  isHiding: boolean
  isExcited: boolean
  bounceY: number
  squish: { x: number; y: number }
  delay: number
  timeRef: React.RefObject<number>
}) {
  const adjustedBounce = bounceY * Math.sin((timeRef.current ?? 0) * 8 + delay * 10)

  const gradients = {
    'white-cell': {
      main: 'url(#smallWhiteGrad)',
      shadow: 'rgba(116,185,255,0.15)',
    },
    'neuron': {
      main: 'url(#smallNeuronGrad)',
      shadow: 'rgba(155,89,182,0.15)',
    },
  }

  return (
    <div
      style={{
        transform: `translateY(${-Math.abs(adjustedBounce)}px) scaleX(${squish.x}) scaleY(${squish.y})`,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-12 h-12"
        style={{
          transform: isHiding ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.4s ease-in-out',
        }}
      >
        <defs>
          <radialGradient id="smallWhiteGrad" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#dfe6e9" />
            <stop offset="100%" stopColor="#74b9ff" />
          </radialGradient>
          <radialGradient id="smallNeuronGrad" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#d4a5ff" />
            <stop offset="50%" stopColor="#9b59b6" />
            <stop offset="100%" stopColor="#8e44ad" />
          </radialGradient>
        </defs>

        <ellipse cx="50" cy="92" rx="25" ry="5" fill={gradients[type].shadow} />
        <circle cx="50" cy="50" r="40" fill={gradients[type].main} />
        <ellipse cx="38" cy="32" rx="15" ry="8" fill="rgba(255,255,255,0.35)" />

        {!isHiding && (
          <g>
            <g transform={`translate(${eyeOffset.x * 0.6}, ${eyeOffset.y * 0.6})`}>
              <ellipse cx="38" cy="48" rx="8" ry={blink ? 2 : 9} fill="white" />
              {!blink && (
                <>
                  <circle cx={38 + eyeOffset.x * 0.3} cy={48 + eyeOffset.y * 0.3} r="5" fill="#2c3e50" />
                  <circle cx={36 + eyeOffset.x * 0.2} cy={45 + eyeOffset.y * 0.2} r="2" fill="white" />
                </>
              )}

              <ellipse cx="62" cy="48" rx="8" ry={blink ? 2 : 9} fill="white" />
              {!blink && (
                <>
                  <circle cx={62 + eyeOffset.x * 0.3} cy={48 + eyeOffset.y * 0.3} r="5" fill="#2c3e50" />
                  <circle cx={60 + eyeOffset.x * 0.2} cy={45 + eyeOffset.y * 0.2} r="2" fill="white" />
                </>
              )}
            </g>

            {isExcited ? (
              <path d="M42 62 Q50 72 58 62" fill={type === 'white-cell' ? '#74b9ff' : '#8e44ad'} />
            ) : (
              <path d="M44 62 Q50 68 56 62" fill="none" stroke={type === 'white-cell' ? '#74b9ff' : '#8e44ad'} strokeWidth="2" strokeLinecap="round" />
            )}

            {isExcited && (
              <>
                <ellipse cx="25" cy="55" rx="5" ry="4" fill="rgba(255,182,193,0.5)" />
                <ellipse cx="75" cy="55" rx="5" ry="4" fill="rgba(255,182,193,0.5)" />
              </>
            )}
          </g>
        )}
      </svg>
    </div>
  )
}
