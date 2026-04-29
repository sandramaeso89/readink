import { useEffect, useState } from 'react'

// Este hook reutilizable guarda un estado en localStorage.
// Nos sirve para no perder datos al recargar la pagina.
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Leemos localStorage una sola vez al iniciar.
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key)
      if (storedValue === null) {
        return initialValue
      }
      return JSON.parse(storedValue) as T
    } catch {
      // Si falla (JSON invalido o acceso bloqueado), usamos valor inicial.
      return initialValue
    }
  })

  // Cada vez que cambie el valor, lo guardamos en localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Si no se puede guardar, evitamos romper la app.
    }
  }, [key, value])

  return [value, setValue] as const
}
