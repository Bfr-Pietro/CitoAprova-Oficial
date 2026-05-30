'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { 
  User, 
  Save, 
  Trash2, 
  RefreshCw, 
  Check, 
  X,
  ImageIcon,
  Smile,
  Angry,
  HelpCircle,
  Frown,
  Skull,
  Zap,
  AlertCircle,
  ExternalLink
} from 'lucide-react'
import { 
  getCharacters, 
  saveCharacter, 
  type CharacterData, 
  type CharacterEmotion,
  DEFAULT_CHARACTERS
} from '@/lib/firebase/firestore-service'

interface CharacterManagerProps {
  adminUid: string
  adminEmail: string | null
}

const EMOTIONS: { key: CharacterEmotion; label: string; icon: React.ReactNode }[] = [
  { key: 'neutral', label: 'Neutro', icon: <User className="w-4 h-4" /> },
  { key: 'happy', label: 'Feliz', icon: <Smile className="w-4 h-4" /> },
  { key: 'angry', label: 'Raiva', icon: <Angry className="w-4 h-4" /> },
  { key: 'surprised', label: 'Surpreso', icon: <HelpCircle className="w-4 h-4" /> },
  { key: 'thinking', label: 'Pensativo', icon: <HelpCircle className="w-4 h-4" /> },
  { key: 'worried', label: 'Preocupado', icon: <Frown className="w-4 h-4" /> },
  { key: 'evil', label: 'Malvado', icon: <Skull className="w-4 h-4" /> },
  { key: 'determined', label: 'Determinado', icon: <Zap className="w-4 h-4" /> },
]

const CHARACTER_COLORS: Record<string, string> = {
  detetive: 'from-blue-500 to-blue-700',
  drCell: 'from-emerald-500 to-emerald-700',
  fragmentado: 'from-purple-600 to-purple-900',
}

export default function CharacterManager({ adminUid, adminEmail }: CharacterManagerProps) {
  const [characters, setCharacters] = useState<CharacterData[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [selectedEmotion, setSelectedEmotion] = useState<CharacterEmotion>('neutral')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [imageUrls, setImageUrls] = useState<Record<string, Record<CharacterEmotion, string>>>({})

  // Load characters
  const loadCharacters = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const data = await getCharacters()
      setCharacters(data)
      
      // Initialize image URLs from loaded data
      const urls: Record<string, Record<CharacterEmotion, string>> = {}
      data.forEach(char => {
        urls[char.id] = { ...char.images } as Record<CharacterEmotion, string>
      })
      setImageUrls(urls)
    } catch (error) {
      console.error('Error loading characters:', error)
      setErrorMessage('Erro ao carregar personagens. Verifique sua conexao.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCharacters()
  }, [loadCharacters])

  // Handle image URL change
  const handleImageUrlChange = (characterId: string, emotion: CharacterEmotion, url: string) => {
    setImageUrls(prev => ({
      ...prev,
      [characterId]: {
        ...prev[characterId],
        [emotion]: url
      }
    }))
    setErrorMessage(null)
  }

  // Save character
  const handleSaveCharacter = async (characterId: string) => {
    setIsSaving(true)
    setSaveStatus('idle')
    setErrorMessage(null)
    
    try {
      const character = characters.find(c => c.id === characterId)
      if (!character) {
        setErrorMessage('Personagem nao encontrado')
        setSaveStatus('error')
        return
      }

      const updatedCharacter: CharacterData = {
        ...character,
        images: imageUrls[characterId] || {}
      }

      const success = await saveCharacter(adminUid, adminEmail, updatedCharacter)
      
      if (success) {
        setSaveStatus('success')
        await loadCharacters()
      } else {
        setErrorMessage('Falha ao salvar. Verifique suas permissoes de administrador.')
        setSaveStatus('error')
      }
    } catch (error) {
      console.error('Error saving character:', error)
      setErrorMessage('Erro ao salvar personagem. Tente novamente.')
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
      setTimeout(() => {
        setSaveStatus('idle')
        setErrorMessage(null)
      }, 5000)
    }
  }

  // Clear image
  const handleClearImage = (characterId: string, emotion: CharacterEmotion) => {
    setImageUrls(prev => ({
      ...prev,
      [characterId]: {
        ...prev[characterId],
        [emotion]: ''
      }
    }))
  }

  const currentCharacter = characters.find(c => c.id === selectedCharacter)
  const currentImageUrl = selectedCharacter ? imageUrls[selectedCharacter]?.[selectedEmotion] || '' : ''

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Info Box - How to get image URLs */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h4 className="font-medium text-blue-400 mb-2 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Como adicionar imagens
        </h4>
        <ol className="text-sm text-blue-300/80 space-y-1 list-decimal list-inside">
          <li>Acesse <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">imgbb.com</a> ou <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">imgur.com</a> (servicos gratuitos)</li>
          <li>Faca upload da imagem do personagem</li>
          <li>Copie o link direto da imagem (termina em .png, .jpg ou .webp)</li>
          <li>Cole o link no campo abaixo e clique em Salvar</li>
        </ol>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-destructive">Erro</p>
            <p className="text-sm text-destructive/80">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Character Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {characters.map(character => (
          <button
            key={character.id}
            onClick={() => setSelectedCharacter(character.id)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedCharacter === character.id
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${CHARACTER_COLORS[character.id]} flex items-center justify-center mb-3`}>
              <span className="text-2xl text-white">
                {character.id === 'detetive' && '?'}
                {character.id === 'drCell' && 'D'}
                {character.id === 'fragmentado' && 'F'}
              </span>
            </div>
            <h3 className="font-bold text-foreground text-center">{character.name}</h3>
            <p className="text-xs text-muted-foreground text-center mt-1">{character.description}</p>
            
            {/* Image count indicator */}
            <div className="mt-3 flex items-center justify-center gap-1">
              <ImageIcon className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {Object.values(imageUrls[character.id] || {}).filter(Boolean).length}/8 imagens
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Character Editor */}
      {selectedCharacter && currentCharacter && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-bold text-foreground">Editar: {currentCharacter.name}</h3>
              <p className="text-sm text-muted-foreground">Configure as imagens para cada emocao</p>
            </div>
            <button
              onClick={() => handleSaveCharacter(selectedCharacter)}
              disabled={isSaving}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                saveStatus === 'success'
                  ? 'bg-green-500 text-white'
                  : saveStatus === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              } disabled:opacity-50`}
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : saveStatus === 'success' ? (
                <Check className="w-4 h-4" />
              ) : saveStatus === 'error' ? (
                <X className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? 'Salvando...' : saveStatus === 'success' ? 'Salvo!' : saveStatus === 'error' ? 'Erro' : 'Salvar'}
            </button>
          </div>

          <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Emotion Selection */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Emocoes</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EMOTIONS.map(emotion => (
                  <button
                    key={emotion.key}
                    onClick={() => setSelectedEmotion(emotion.key)}
                    className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-2 ${
                      selectedEmotion === emotion.key
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                  >
                    {emotion.icon}
                    <span className="text-xs font-medium">{emotion.label}</span>
                    {imageUrls[selectedCharacter]?.[emotion.key] && (
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    )}
                  </button>
                ))}
              </div>

              {/* URL Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  URL da Imagem ({EMOTIONS.find(e => e.key === selectedEmotion)?.label})
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={currentImageUrl}
                    onChange={(e) => handleImageUrlChange(selectedCharacter, selectedEmotion, e.target.value)}
                    placeholder="https://i.imgur.com/exemplo.png"
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {currentImageUrl && (
                    <button
                      onClick={() => handleClearImage(selectedCharacter, selectedEmotion)}
                      className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                      title="Limpar URL"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Cole a URL direta de uma imagem PNG, JPG ou WebP. Recomendado: 512x768px.
                </p>
              </div>

              {/* Quick links */}
              <div className="flex gap-2 flex-wrap">
                <a
                  href="https://imgbb.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  ImgBB
                </a>
                <a
                  href="https://imgur.com/upload"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Imgur
                </a>
                <a
                  href="https://postimages.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  PostImages
                </a>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Preview</h4>
              <div className="relative h-80 bg-gradient-to-b from-secondary to-background rounded-xl border border-border overflow-hidden">
                {currentImageUrl ? (
                  <div className="relative w-full h-full flex items-end justify-center">
                    <div className="relative w-48 h-64">
                      <Image
                        src={currentImageUrl}
                        alt={`${currentCharacter.name} - ${selectedEmotion}`}
                        fill
                        className="object-contain object-bottom"
                        onError={() => {
                          setErrorMessage('Erro ao carregar imagem. Verifique se a URL e valida e acessivel.')
                        }}
                        unoptimized
                      />
                    </div>
                    {/* Emotion badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-background/90 rounded-full border border-border">
                      <span className="text-sm font-medium capitalize">{selectedEmotion}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${CHARACTER_COLORS[selectedCharacter]} flex items-center justify-center mb-4`}>
                      <span className="text-4xl">
                        {selectedCharacter === 'detetive' && '?'}
                        {selectedCharacter === 'drCell' && 'D'}
                        {selectedCharacter === 'fragmentado' && 'F'}
                      </span>
                    </div>
                    <p className="text-sm">Nenhuma imagem definida</p>
                    <p className="text-xs">Cole uma URL acima</p>
                  </div>
                )}
              </div>

              {/* All emotions preview */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-muted-foreground">Todas as emocoes</h5>
                <div className="flex flex-wrap gap-2">
                  {EMOTIONS.map(emotion => {
                    const imgUrl = imageUrls[selectedCharacter]?.[emotion.key]
                    return (
                      <button
                        key={emotion.key}
                        onClick={() => setSelectedEmotion(emotion.key)}
                        className={`w-12 h-12 rounded-lg border overflow-hidden ${
                          selectedEmotion === emotion.key ? 'ring-2 ring-primary' : ''
                        } ${imgUrl ? 'border-border' : 'border-dashed border-muted-foreground/30'}`}
                        title={emotion.label}
                      >
                        {imgUrl ? (
                          <Image
                            src={imgUrl}
                            alt={emotion.label}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                            {emotion.icon}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={loadCharacters}
          disabled={isLoading}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Recarregar Personagens
        </button>
      </div>
    </div>
  )
}
