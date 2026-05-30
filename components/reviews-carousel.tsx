'use client'

import { useState, useEffect, useRef } from 'react'
import { Star, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getApprovedReviews, type ReviewData } from '@/lib/firebase/firestore-service'

// Review card component
function ReviewCard({ review, className }: { review: ReviewData; className?: string }) {
  return (
    <article 
      className={cn(
        "flex-shrink-0 w-[320px] sm:w-[380px] p-5 sm:p-6 rounded-2xl",
        "bg-card/80 backdrop-blur-sm border border-border",
        "hover:border-primary/50 hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      {/* Quote icon */}
      <div className="mb-4">
        <Quote className="w-8 h-8 text-primary/30" />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-3" aria-label={`Avaliacao: ${review.rating} de 5 estrelas`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-4 h-4",
              i < review.rating ? "text-chart-3 fill-chart-3" : "text-muted-foreground/30"
            )}
          />
        ))}
      </div>

      {/* Text */}
      <p className="text-foreground text-sm sm:text-base leading-relaxed mb-4 line-clamp-4">
        {review.text}
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-border/50">
        {review.photoUrl ? (
          <img
            src={review.photoUrl}
            alt={review.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
            {review.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold text-foreground text-sm">{review.name}</p>
          <p className="text-xs text-muted-foreground">{review.role}</p>
        </div>
      </div>
    </article>
  )
}

// Infinite scrolling row
function ScrollingRow({ 
  reviews, 
  direction = 'left',
  speed = 30
}: { 
  reviews: ReviewData[]
  direction?: 'left' | 'right'
  speed?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  // Duplicate reviews for seamless loop
  const duplicatedReviews = [...reviews, ...reviews]

  return (
    <div 
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={containerRef}
        className={cn(
          "flex gap-4 sm:gap-6",
          direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'
        )}
        style={{
          animationDuration: `${speed}s`,
          animationPlayState: isPaused ? 'paused' : 'running'
        }}
      >
        {duplicatedReviews.map((review, index) => (
          <ReviewCard key={`${review.id}-${index}`} review={review} />
        ))}
      </div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
    </div>
  )
}

export function ReviewsCarousel() {
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getApprovedReviews()
        setReviews(data)
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReviews()
  }, [])

  // Split reviews into two rows
  const midpoint = Math.ceil(reviews.length / 2)
  const topRowReviews = reviews.slice(0, midpoint)
  const bottomRowReviews = reviews.slice(midpoint)

  // Show placeholder reviews if no reviews yet
  const placeholderReviews: ReviewData[] = [
    {
      id: 'placeholder-1',
      name: 'Maria Silva',
      role: 'Estudante do 3o ano',
      rating: 5,
      text: 'Incrivel! Finalmente consegui entender citologia de verdade. Os minigames tornam o estudo muito mais divertido e as explicacoes sao claras.',
      isApproved: true
    },
    {
      id: 'placeholder-2',
      name: 'Pedro Santos',
      role: 'Vestibulando',
      rating: 5,
      text: 'Estava com muita dificuldade em biologia celular ate encontrar o CitoAprova. Agora me sinto muito mais preparado para o ENEM!',
      isApproved: true
    },
    {
      id: 'placeholder-3',
      name: 'Ana Costa',
      role: 'Estudante do 2o ano',
      rating: 4,
      text: 'Adorei a forma como o conteudo e apresentado. Os jogos sao viciantes e aprendo sem perceber!',
      isApproved: true
    },
    {
      id: 'placeholder-4',
      name: 'Lucas Oliveira',
      role: 'Estudante de Biomedicina',
      rating: 5,
      text: 'Mesmo na faculdade, o CitoAprova me ajudou a revisar conceitos basicos de forma rapida e eficiente.',
      isApproved: true
    },
    {
      id: 'placeholder-5',
      name: 'Julia Ferreira',
      role: 'Professora de Biologia',
      rating: 5,
      text: 'Recomendo para todos os meus alunos! E uma ferramenta excelente para complementar as aulas.',
      isApproved: true
    },
    {
      id: 'placeholder-6',
      name: 'Rafael Lima',
      role: 'Vestibulando - Medicina',
      rating: 5,
      text: 'Os minigames de citologia me ajudaram demais na preparacao. Conteudo de qualidade!',
      isApproved: true
    }
  ]

  const displayReviews = reviews.length > 0 ? reviews : placeholderReviews
  const displayTopRow = displayReviews.slice(0, Math.ceil(displayReviews.length / 2))
  const displayBottomRow = displayReviews.slice(Math.ceil(displayReviews.length / 2))

  if (isLoading) {
    return (
      <section className="py-12 sm:py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-3">
              O Que Dizem Nossos Estudantes
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Milhares de estudantes ja transformaram seu aprendizado
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-pulse flex gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-[320px] h-48 bg-muted rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="depoimentos" className="py-12 sm:py-20 overflow-hidden" aria-labelledby="reviews-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10 sm:mb-12">
        <div className="text-center">
          <h2 id="reviews-title" className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-3">
            O Que Dizem Nossos Estudantes
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Milhares de estudantes ja transformaram seu aprendizado de citologia com o CitoAprova
          </p>
        </div>
      </div>

      {/* Dual carousel rows */}
      <div className="space-y-4 sm:space-y-6">
        {displayTopRow.length > 0 && (
          <ScrollingRow reviews={displayTopRow} direction="left" speed={35} />
        )}
        {displayBottomRow.length > 0 && (
          <ScrollingRow reviews={displayBottomRow} direction="right" speed={40} />
        )}
      </div>
    </section>
  )
}
