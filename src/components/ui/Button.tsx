import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // Texto o contenido que se verá dentro del botón.
  children: ReactNode
  // Variante visual para reutilizar el mismo botón en varios contextos.
  variant?: 'primary' | 'secondary' | 'ghost'
}

const baseClasses =
  'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50'

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-violet-600 text-white hover:bg-violet-700',
  secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
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
