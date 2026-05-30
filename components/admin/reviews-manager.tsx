'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Star,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Eye,
  EyeOff,
  Upload,
  RefreshCw,
  MessageSquare,
  Image as ImageIcon
} from 'lucide-react'
import {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleReviewApproval,
  type ReviewData
} from '@/lib/firebase/firestore-service'
import { cn } from '@/lib/utils'

interface ReviewsManagerProps {
  adminUid: string
  adminEmail: string | null
}

export default function ReviewsManager({ adminUid, adminEmail }: ReviewsManagerProps) {
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  // Form state for new/edit review
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    photoUrl: '',
    rating: 5,
    text: '',
    isApproved: true
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load reviews
  const loadReviews = async () => {
    setIsLoading(true)
    try {
      const data = await getAllReviews(adminUid, adminEmail)
      setReviews(data)
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [adminUid, adminEmail])

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      photoUrl: '',
      rating: 5,
      text: '',
      isApproved: true
    })
    setIsCreating(false)
    setEditingId(null)
  }

  // Handle create
  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.text.trim()) {
      alert('Nome e texto da avaliacao sao obrigatorios')
      return
    }

    setIsSaving(true)
    try {
      const newId = await createReview(adminUid, adminEmail, {
        name: formData.name.trim(),
        role: formData.role.trim() || 'Estudante',
        photoUrl: formData.photoUrl.trim() || undefined,
        rating: formData.rating,
        text: formData.text.trim(),
        isApproved: formData.isApproved
      })

      if (newId) {
        await loadReviews()
        resetForm()
      } else {
        alert('Erro ao criar avaliacao')
      }
    } catch (error) {
      console.error('Error creating review:', error)
      alert('Erro ao criar avaliacao')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle edit
  const startEditing = (review: ReviewData) => {
    setEditingId(review.id || null)
    setFormData({
      name: review.name,
      role: review.role,
      photoUrl: review.photoUrl || '',
      rating: review.rating,
      text: review.text,
      isApproved: review.isApproved
    })
    setIsCreating(false)
  }

  const handleUpdate = async () => {
    if (!editingId) return
    if (!formData.name.trim() || !formData.text.trim()) {
      alert('Nome e texto da avaliacao sao obrigatorios')
      return
    }

    setIsSaving(true)
    try {
      const success = await updateReview(adminUid, adminEmail, editingId, {
        name: formData.name.trim(),
        role: formData.role.trim() || 'Estudante',
        photoUrl: formData.photoUrl.trim() || undefined,
        rating: formData.rating,
        text: formData.text.trim(),
        isApproved: formData.isApproved
      })

      if (success) {
        await loadReviews()
        resetForm()
      } else {
        alert('Erro ao atualizar avaliacao')
      }
    } catch (error) {
      console.error('Error updating review:', error)
      alert('Erro ao atualizar avaliacao')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle delete
  const handleDelete = async (reviewId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta avaliacao?')) return

    try {
      const success = await deleteReview(adminUid, adminEmail, reviewId)
      if (success) {
        await loadReviews()
      } else {
        alert('Erro ao excluir avaliacao')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Erro ao excluir avaliacao')
    }
  }

  // Handle toggle approval
  const handleToggleApproval = async (review: ReviewData) => {
    if (!review.id) return

    try {
      const success = await toggleReviewApproval(adminUid, adminEmail, review.id, !review.isApproved)
      if (success) {
        await loadReviews()
      }
    } catch (error) {
      console.error('Error toggling approval:', error)
    }
  }

  // Handle image URL from file (converts to base64 data URL)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 500000) {
      alert('A imagem deve ter menos de 500KB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, photoUrl: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  // Rating selector component
  const RatingSelector = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-1 hover:scale-110 transition-transform"
        >
          <Star
            className={cn(
              "w-6 h-6 transition-colors",
              star <= value ? "text-amber-500 fill-amber-500" : "text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{reviews.length} avaliacoes</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-lg">
            <Eye className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">
              {reviews.filter(r => r.isApproved).length} aprovadas
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={loadReviews}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
            title="Atualizar lista"
          >
            <RefreshCw className={cn("w-5 h-5", isLoading && "animate-spin")} />
          </button>
          
          {!isCreating && !editingId && (
            <button
              onClick={() => {
                resetForm()
                setIsCreating(true)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nova Avaliacao
            </button>
          )}
        </div>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-bold text-foreground mb-4">
            {isCreating ? 'Nova Avaliacao' : 'Editar Avaliacao'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Nome *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome da pessoa"
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Cargo/Funcao
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                placeholder="Ex: Estudante do 3o ano"
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            {/* Photo URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Foto (URL ou upload)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.photoUrl}
                  onChange={e => setFormData(prev => ({ ...prev, photoUrl: e.target.value }))}
                  placeholder="URL da imagem ou faca upload"
                  className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 bg-secondary border border-border rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              </div>
              {formData.photoUrl && (
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={formData.photoUrl}
                    alt="Preview"
                    className="w-10 h-10 rounded-full object-cover"
                    onError={e => {
                      (e.target as HTMLImageElement).src = ''
                      setFormData(prev => ({ ...prev, photoUrl: '' }))
                    }}
                  />
                  <span className="text-xs text-muted-foreground">Preview da foto</span>
                </div>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Avaliacao (estrelas)
              </label>
              <RatingSelector
                value={formData.rating}
                onChange={v => setFormData(prev => ({ ...prev, rating: v }))}
              />
            </div>

            {/* Approved */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Status
              </label>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isApproved: !prev.isApproved }))}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors",
                  formData.isApproved
                    ? "bg-accent/10 border-accent text-accent"
                    : "bg-secondary border-border text-muted-foreground"
                )}
              >
                {formData.isApproved ? (
                  <>
                    <Eye className="w-4 h-4" />
                    Aprovada (visivel)
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Pendente (oculta)
                  </>
                )}
              </button>
            </div>

            {/* Text */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Texto da avaliacao *
              </label>
              <textarea
                value={formData.text}
                onChange={e => setFormData(prev => ({ ...prev, text: e.target.value }))}
                placeholder="O que a pessoa disse sobre o CitoAprova..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none transition-colors resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border">
            <button
              type="button"
              onClick={resetForm}
              disabled={isSaving}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={isCreating ? handleCreate : handleUpdate}
              disabled={isSaving || !formData.name.trim() || !formData.text.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {isCreating ? 'Criar Avaliacao' : 'Salvar Alteracoes'}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-bold text-foreground">Avaliacoes Cadastradas</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie as avaliacoes que aparecem na pagina inicial
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">Nenhuma avaliacao cadastrada ainda</p>
            <button
              onClick={() => setIsCreating(true)}
              className="mt-4 text-primary hover:underline"
            >
              Criar primeira avaliacao
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {reviews.map(review => (
              <div
                key={review.id}
                className={cn(
                  "p-4 flex items-start gap-4 transition-colors",
                  !review.isApproved && "bg-muted/30"
                )}
              >
                {/* Photo */}
                <div className="flex-shrink-0">
                  {review.photoUrl ? (
                    <img
                      src={review.photoUrl}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">{review.name}</span>
                    <span className="text-sm text-muted-foreground">- {review.role}</span>
                    {!review.isApproved && (
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-xs rounded-full">
                        Pendente
                      </span>
                    )}
                  </div>
                  
                  {/* Rating */}
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={cn(
                          "w-4 h-4",
                          star <= review.rating
                            ? "text-amber-500 fill-amber-500"
                            : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>

                  <p className="text-foreground text-sm line-clamp-2">{review.text}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleToggleApproval(review)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      review.isApproved
                        ? "text-accent hover:bg-accent/10"
                        : "text-muted-foreground hover:bg-secondary"
                    )}
                    title={review.isApproved ? 'Desaprovar' : 'Aprovar'}
                  >
                    {review.isApproved ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => startEditing(review)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    title="Editar"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => review.id && handleDelete(review.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
