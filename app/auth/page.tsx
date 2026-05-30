'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Microscope, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import CellCharacters from '@/components/auth/cell-characters'
import MobileCellCharacter from '@/components/auth/mobile-cell-character'
import { useAuth } from '@/contexts/auth-context'

type AuthMode = 'login' | 'register'

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

export default function AuthPage() {
  const router = useRouter()
  const { login, register, loginWithGoogle, resetPassword, isAuthenticated } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [isSendingReset, setIsSendingReset] = useState(false)
  
  // Estados para os personagens
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isNearSubmitButton, setIsNearSubmitButton] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/criar')
    }
  }, [isAuthenticated, router])

  // Verificar se o formulario esta valido
  const isFormValid = useCallback(() => {
    if (mode === 'register') {
      return (
        formData.name.trim().length >= 2 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
        formData.password.length >= 6 &&
        formData.password === formData.confirmPassword
      )
    }
    return (
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.password.length >= 6
    )
  }, [mode, formData])

  // Rastrear posicao do mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      if (submitButtonRef.current) {
        const rect = submitButtonRef.current.getBoundingClientRect()
        const distance = Math.sqrt(
          Math.pow(e.clientX - (rect.left + rect.width / 2), 2) +
          Math.pow(e.clientY - (rect.top + rect.height / 2), 2)
        )
        setIsNearSubmitButton(distance < 100)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
    
    setIsTyping(true)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 500)
  }

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  const validateForm = (): boolean => {
    if (mode === 'register') {
      if (!formData.name.trim()) {
        setError('Por favor, digite seu nome')
        return false
      }
      if (formData.name.trim().length < 2) {
        setError('O nome deve ter pelo menos 2 caracteres')
        return false
      }
    }
    
    if (!formData.email.trim()) {
      setError('Por favor, digite seu email')
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, digite um email valido')
      return false
    }
    
    if (!formData.password) {
      setError('Por favor, digite sua senha')
      return false
    }
    
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return false
    }
    
    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      setError('As senhas nao coincidem')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setError('')
    
    try {
      let result
      
      if (mode === 'login') {
        result = await login(formData.email, formData.password)
      } else {
        result = await register(formData.name, formData.email, formData.password)
      }

      if (!result.success) {
        setError(result.error || 'Ocorreu um erro. Tente novamente.')
        return
      }
      
      router.push('/criar')
      
    } catch {
      setError('Ocorreu um erro. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setError('')

    try {
      const result = await loginWithGoogle()

      if (!result.success) {
        setError(result.error || 'Erro ao fazer login com Google.')
        return
      }

      router.push('/criar')
    } catch {
      setError('Erro ao fazer login com Google. Tente novamente.')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const toggleMode = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setMode(mode === 'login' ? 'register' : 'login')
      setError('')
      setSuccessMessage('')
      setShowForgotPassword(false)
      setFormData({ name: '', email: '', password: '', confirmPassword: '' })
      setTimeout(() => setIsAnimating(false), 50)
    }, 300)
  }

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail.trim()) {
      setError('Por favor, digite seu email')
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(forgotPasswordEmail)) {
      setError('Por favor, digite um email valido')
      return
    }

    setIsSendingReset(true)
    setError('')
    setSuccessMessage('')

    try {
      const result = await resetPassword(forgotPasswordEmail)
      if (result.success) {
        setSuccessMessage('Email de recuperacao enviado! Verifique sua caixa de entrada.')
        setForgotPasswordEmail('')
        setTimeout(() => {
          setShowForgotPassword(false)
          setSuccessMessage('')
        }, 5000)
      } else {
        setError(result.error || 'Erro ao enviar email de recuperacao')
      }
    } catch {
      setError('Erro ao enviar email de recuperacao. Tente novamente.')
    } finally {
      setIsSendingReset(false)
    }
  }

  const isLogin = mode === 'login'
  const isAnyLoading = isLoading || isGoogleLoading || isSendingReset

  // Google Sign In Button Component
  const GoogleSignInButton = ({ className = '' }: { className?: string }) => (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={isAnyLoading}
      className={`w-full py-3 rounded-xl font-medium border-2 border-border bg-card hover:bg-secondary/50 hover:border-primary/50 transition-all flex items-center justify-center gap-3 text-foreground disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${className}`}
    >
      {isGoogleLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-5 h-5 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" aria-hidden="true" />
          <span>Conectando...</span>
        </span>
      ) : (
        <>
          <GoogleIcon />
          <span>Continuar com Google</span>
        </>
      )}
    </button>
  )

  return (
    <main 
      ref={containerRef}
      className="min-h-screen bg-background relative overflow-hidden flex flex-col"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-cell-pattern" aria-hidden="true" />
      <div className="absolute inset-0 bg-grid-cell opacity-30" aria-hidden="true" />

      {/* Skip Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
      >
        Pular para o conteudo principal
      </a>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg p-1"
          aria-label="Voltar para a pagina inicial"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          <span className="hidden sm:inline">Voltar</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center" aria-hidden="true">
            <Microscope className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground">CitoAprova</span>
        </div>
        <div className="w-20" aria-hidden="true" />
      </header>

      {/* Main Content */}
      <div id="main-content" className="relative z-10 flex-1 flex items-center justify-center px-4 md:px-6 py-4 md:py-8">
        <div className="w-full max-w-6xl">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-stretch gap-8 lg:gap-12">
            {/* Lado Esquerdo */}
            <div 
              className={`flex-1 flex items-center justify-center transition-all duration-500 ease-out ${
                isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
              style={{ 
                order: isLogin ? 1 : 2,
              }}
            >
              <div className="w-full max-w-sm lg:max-w-md">
                <CellCharacters
                  mousePosition={mousePosition}
                  isPasswordVisible={showPassword}
                  isNearSubmitButton={isNearSubmitButton}
                  isFormValid={isFormValid()}
                  isTyping={isTyping}
                  isFocused={isFocused}
                />
                
                {/* Texto abaixo dos personagens */}
                <div className="text-center mt-6">
                  <p className="text-muted-foreground text-sm">
                    {isLogin 
                      ? 'Nossos amiguinhos celulares estao ansiosos para te ver!' 
                      : 'Junte-se a nossa comunidade celular!'}
                  </p>
                </div>
              </div>
            </div>

            {/* Lado Direito - Formulario */}
            <div 
              className={`flex-1 flex items-center justify-center transition-all duration-500 ease-out ${
                isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
              style={{ 
                order: isLogin ? 2 : 1,
              }}
            >
              <div className="w-full max-w-md">
                <div className="bg-card/95 backdrop-blur-sm border-2 border-border rounded-3xl p-8 shadow-xl">
                  {/* Header do Card */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4" aria-hidden="true">
                      <Sparkles className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-foreground mb-2">
                      {isLogin ? 'Bem-vindo de volta!' : 'Criar sua conta'}
                    </h1>
                    <p className="text-muted-foreground">
                      {isLogin 
                        ? 'Entre para continuar sua jornada' 
                        : 'Cadastre-se para salvar seu progresso'}
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div 
                      role="alert" 
                      aria-live="polite"
                      className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  )}

                  {/* Google Sign In Button */}
                  <GoogleSignInButton className="mb-6" />

                  {/* Divider */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-border" aria-hidden="true" />
                    <span className="text-sm text-muted-foreground">ou com email</span>
                    <div className="flex-1 h-px bg-border" aria-hidden="true" />
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* Name Field */}
                    {!isLogin && (
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                          Nome completo
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholder="Seu nome"
                            autoComplete="name"
                            disabled={isAnyLoading}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary border-2 border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground disabled:opacity-70"
                          />
                        </div>
                      </div>
                    )}

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          placeholder="seu@email.com"
                          autoComplete="email"
                          disabled={isAnyLoading}
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary border-2 border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground disabled:opacity-70"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                        Senha
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          placeholder="Minimo 6 caracteres"
                          autoComplete={isLogin ? 'current-password' : 'new-password'}
                          disabled={isAnyLoading}
                          className="w-full pl-12 pr-12 py-3 rounded-xl bg-secondary border-2 border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground disabled:opacity-70"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" aria-hidden="true" />
                          ) : (
                            <Eye className="w-5 h-5" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    {!isLogin && (
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                          Confirmar senha
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholder="Digite a senha novamente"
                            autoComplete="new-password"
                            disabled={isAnyLoading}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary border-2 border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground disabled:opacity-70"
                          />
                        </div>
                      </div>
                    )}

                    {/* Forgot Password Link - Desktop */}
                    {isLogin && !showForgotPassword && (
                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-sm text-primary hover:text-primary/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
                        >
                          Esqueceu sua senha?
                        </button>
                      </div>
                    )}

                    {/* Forgot Password Form - Desktop */}
                    {showForgotPassword && (
                      <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">Recuperar senha</h3>
                          <button
                            type="button"
                            onClick={() => {
                              setShowForgotPassword(false)
                              setForgotPasswordEmail('')
                              setError('')
                              setSuccessMessage('')
                            }}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Voltar
                          </button>
                        </div>
                        {successMessage && (
                          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 text-sm">
                            {successMessage}
                          </div>
                        )}
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
                          <input
                            type="email"
                            value={forgotPasswordEmail}
                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                            placeholder="Digite seu email"
                            disabled={isSendingReset}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary border-2 border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground disabled:opacity-70"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          disabled={isSendingReset}
                          className="w-full py-3 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-70"
                        >
                          {isSendingReset ? 'Enviando...' : 'Enviar email de recuperacao'}
                        </button>
                      </div>
                    )}

                    {/* Submit Button */}
                    {!showForgotPassword && (
                      <button
                        ref={submitButtonRef}
                        type="submit"
                        disabled={isAnyLoading}
                        className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        aria-busy={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" aria-hidden="true" />
                            <span>Carregando...</span>
                          </span>
                        ) : (
                          isLogin ? 'Entrar' : 'Criar conta'
                        )}
                      </button>
                    )}
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-border" aria-hidden="true" />
                    <span className="text-sm text-muted-foreground">ou</span>
                    <div className="flex-1 h-px bg-border" aria-hidden="true" />
                  </div>

                  {/* Toggle Mode */}
                  <p className="text-center text-muted-foreground">
                    {isLogin ? 'Ainda nao tem uma conta?' : 'Ja tem uma conta?'}
                    <button
                      type="button"
                      onClick={toggleMode}
                      disabled={isAnimating || isAnyLoading}
                      className="ml-2 font-semibold text-primary hover:text-primary/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded disabled:opacity-50"
                    >
                      {isLogin ? 'Cadastre-se' : 'Entre aqui'}
                    </button>
                  </p>

                  {/* Guest Option */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <Link
                      href="/criar"
                      className="block w-full py-3 rounded-xl font-medium text-center border-2 border-border bg-card hover:border-primary hover:bg-secondary/50 transition-all text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      Continuar sem conta
                    </Link>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Seu progresso nao sera salvo na nuvem
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="w-full max-w-md mx-auto">
              <div className="bg-card/95 backdrop-blur-sm border-2 border-border rounded-3xl p-6 shadow-xl">
                {/* Personagens Mobile */}
                <MobileCellCharacter
                  isPasswordVisible={showPassword}
                  isNearSubmitButton={isNearSubmitButton}
                  isFormValid={isFormValid()}
                  isTyping={isTyping}
                />

                {/* Header do Card */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-black text-foreground mb-2">
                    {isLogin ? 'Bem-vindo de volta!' : 'Criar sua conta'}
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    {isLogin 
                      ? 'Entre para continuar sua jornada' 
                      : 'Cadastre-se para salvar seu progresso'}
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div 
                    role="alert" 
                    aria-live="polite"
                    className="flex items-center gap-3 p-3 mb-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Google Sign In Button */}
                <GoogleSignInButton className="mb-4" />

                {/* Divider */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 h-px bg-border" aria-hidden="true" />
                  <span className="text-xs text-muted-foreground">ou com email</span>
                  <div className="flex-1 h-px bg-border" aria-hidden="true" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Name Field */}
                  {!isLogin && (
                    <div>
                      <label htmlFor="name-mobile" className="block text-sm font-medium text-foreground mb-2">
                        Nome completo
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
                        <input
                          type="text"
                          id="name-mobile"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          placeholder="Seu nome"
                          autoComplete="name"
                          disabled={isAnyLoading}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border-2 border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground disabled:opacity-70"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email-mobile" className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
                      <input
                        type="email"
                        id="email-mobile"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder="seu@email.com"
                        autoComplete="email"
                        disabled={isAnyLoading}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border-2 border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground disabled:opacity-70"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password-mobile" className="block text-sm font-medium text-foreground mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password-mobile"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder="Minimo 6 caracteres"
                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                        disabled={isAnyLoading}
                        className="w-full pl-10 pr-12 py-3 rounded-xl bg-secondary border-2 border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground disabled:opacity-70"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded p-1"
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" aria-hidden="true" />
                        ) : (
                          <Eye className="w-5 h-5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  {!isLogin && (
                    <div>
                      <label htmlFor="confirmPassword-mobile" className="block text-sm font-medium text-foreground mb-2">
                        Confirmar senha
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="confirmPassword-mobile"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          placeholder="Digite a senha novamente"
                          autoComplete="new-password"
                          disabled={isAnyLoading}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border-2 border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground disabled:opacity-70"
                        />
                      </div>
                    </div>
                  )}

                  {/* Forgot Password Link - Mobile */}
                  {isLogin && !showForgotPassword && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-primary hover:text-primary/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
                      >
                        Esqueceu sua senha?
                      </button>
                    </div>
                  )}

                  {/* Forgot Password Form - Mobile */}
                  {showForgotPassword && (
                    <div className="p-3 rounded-xl bg-secondary/50 border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground text-sm">Recuperar senha</h3>
                        <button
                          type="button"
                          onClick={() => {
                            setShowForgotPassword(false)
                            setForgotPasswordEmail('')
                            setError('')
                            setSuccessMessage('')
                          }}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Voltar
                        </button>
                      </div>
                      {successMessage && (
                        <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 text-xs">
                          {successMessage}
                        </div>
                      )}
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
                        <input
                          type="email"
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          placeholder="Digite seu email"
                          disabled={isSendingReset}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border-2 border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground disabled:opacity-70"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={isSendingReset}
                        className="w-full py-2.5 rounded-xl font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-70"
                      >
                        {isSendingReset ? 'Enviando...' : 'Enviar email de recuperacao'}
                      </button>
                    </div>
                  )}

                  {/* Submit Button */}
                  {!showForgotPassword && (
                    <button
                      ref={submitButtonRef}
                      type="submit"
                      disabled={isAnyLoading}
                      className="w-full py-3.5 rounded-xl font-bold text-base bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      aria-busy={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" aria-hidden="true" />
                          <span>Carregando...</span>
                        </span>
                      ) : (
                        isLogin ? 'Entrar' : 'Criar conta'
                      )}
                    </button>
                  )}
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-5">
                  <div className="flex-1 h-px bg-border" aria-hidden="true" />
                  <span className="text-sm text-muted-foreground">ou</span>
                  <div className="flex-1 h-px bg-border" aria-hidden="true" />
                </div>

                {/* Toggle Mode */}
                <p className="text-center text-muted-foreground text-sm">
                  {isLogin ? 'Ainda nao tem uma conta?' : 'Ja tem uma conta?'}
                  <button
                    type="button"
                    onClick={toggleMode}
                    disabled={isAnimating || isAnyLoading}
                    className="ml-2 font-semibold text-primary hover:text-primary/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded disabled:opacity-50"
                  >
                    {isLogin ? 'Cadastre-se' : 'Entre aqui'}
                  </button>
                </p>

                {/* Guest Option */}
                <div className="mt-5 pt-5 border-t border-border">
                  <Link
                    href="/criar"
                    className="block w-full py-3 rounded-xl font-medium text-center border-2 border-border bg-card hover:border-primary hover:bg-secondary/50 transition-all text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 text-sm"
                  >
                    Continuar sem conta
                  </Link>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Seu progresso nao sera salvo na nuvem
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
