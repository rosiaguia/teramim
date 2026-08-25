import { createContext, useContext, useEffect, useState } from 'react'
import { loadContent, saveContent, mergeContent } from './contentStore.js'
import { getAdminPin } from './store.js'

const Ctx = createContext(null)

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null)

  useEffect(() => {
    loadContent().then(setContent)
  }, [])

  async function update(patch) {
    const next = mergeContent(patch)
    setContent(next)
    const ok = await saveContent(patch, getAdminPin())
    return ok
  }

  return <Ctx.Provider value={{ content, update }}>{children}</Ctx.Provider>
}

export function useContent() {
  return useContext(Ctx)
}
