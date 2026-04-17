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
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row"
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
        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none ring-violet-300 transition focus:ring-2"
      />
      <Button type="submit">Buscar</Button>
    </form>
  )
}
