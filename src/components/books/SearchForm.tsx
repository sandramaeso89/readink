import type { FormEvent } from 'react'
import { Button } from '../ui/Button'

interface SearchFormProps {
  // Valor actual del input de búsqueda.
  value: string
  // Función para actualizar el texto al escribir.
  onChange: (value: string) => void
  // Acción al enviar el formulario.
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function SearchForm({ value, onChange, onSubmit }: SearchFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-brand-accent/35 bg-brand-800/80 p-4 shadow-lg shadow-black/30 backdrop-blur-sm md:flex-row md:items-center md:p-5"
    >
      <label htmlFor="search-book" className="sr-only">
        Buscar libro
      </label>
      <input
        id="search-book"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Busca por título o autor"
        className="w-full rounded-xl border border-brand-200/25 bg-brand-900/90 px-4 py-3 text-sm text-brand-200 outline-none ring-brand-accent transition focus:border-brand-accent focus:ring-2 placeholder:text-brand-100"
      />
      <Button type="submit">Buscar</Button>
    </form>
  )
}
