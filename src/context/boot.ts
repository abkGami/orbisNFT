import { createContext, useContext } from 'react'

/** True once the intro loader has finished (or was skipped). */
export const BootContext = createContext(false)

export function useBooted(): boolean {
  return useContext(BootContext)
}
