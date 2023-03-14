import { useState, RefObject } from 'react'

import useEntryListener from './useEntryListener'


type Opts = {
  observerProps?: IntersectionObserverInit
  once?: boolean
}

type Entry = IntersectionObserverEntry | null

type Result = [
  RefObject<any>,
  Entry,
  () => void
]

const useEntry = (opts: Opts = {}): Result => {
  const [ entry, setEntry ] = useState<Entry>(null)
  const [ ref, unobserve ] = useEntryListener(setEntry, opts)

  return [ ref, entry, unobserve ]
}


export default useEntry
