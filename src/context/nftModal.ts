import { createContext, useContext } from 'react'

export const NftModalContext = createContext<(index: number) => void>(() => undefined)

export function useNftModal() {
  return useContext(NftModalContext)
}
