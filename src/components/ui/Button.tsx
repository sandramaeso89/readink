import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // Texto o contenido que se verá dentro del botón.
  children: ReactNode
  // Variante visual para reutilizar el mismo botón en varios contextos.
  variant?: 'primary' | 'secondary' | 'ghost'
}

const baseClasses =
  'inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50'

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  // Botón principal en morado para CTA principal.
  primary: 'bg-brand-500 text-white hover:bg-brand-700',
  // Botón secundario en lila para destacar acciones secundarias.
  secondary: 'bg-brand-accent text-brand-900 hover:bg-brand-100',
  ghost: 'bg-transparent text-brand-200 hover:bg-brand-800/60',
}

export function Button({
  children,
  variant = 'primary',
  className,
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className ?? ''}`}
      {...buttonProps}
    >
      {children}
    </button>
  )
}
