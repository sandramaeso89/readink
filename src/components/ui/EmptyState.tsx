interface EmptyStateProps {
  // Título principal cuando no hay datos.
  title: string
  // Mensaje extra para orientar a la usuaria.
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-brand-accent/70 bg-brand-800/90 p-10 text-center shadow-lg shadow-black/30">
      <h3 className="text-lg font-semibold text-brand-accent">{title}</h3>
      <p className="mt-2 text-sm text-brand-200">{description}</p>
    </div>
  )
}
