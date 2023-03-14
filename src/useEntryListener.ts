import { useRef, useEffect, RefObject } from 'react'

import { createMasterObserver, createIndividualObserver, useDeepMemo, runWhenReady } from './util'


type Listener = (entry: IntersectionObserverEntry) => void

type Opts = {
  observerProps?: IntersectionObserverInit
  once?: boolean
}

type Result = [
  RefObject<any>,
  () => void
]

const useEntryListener = (listener: Listener, opts: Opts = {}): Result => {
  const ref = useRef()

  const listenerRef = useRef(listener)
  const unobserveRef = useRef(() => {})

  // to fix reinitialization on listener change
  listenerRef.current = listener

  const { once, observerProps } = opts
  // ATTN this is important to prevent infinity updates
  const observerOptions = useDeepMemo(() => observerProps, [ observerProps ])

  useEffect(() => {
    const node = ref.current

    if (!node) {
      return
    }

    const timeoutId = runWhenReady(() => {
      const observer = observerOptions ? createIndividualObserver(observerOptions) : createMasterObserver()

      // we can't call it twice
      unobserveRef.current = () => {
        observer.unobserve(node)
        unobserveRef.current = () => {}
      }

      observer.observe(node, (entry) => {
        if (once) {
          // setEntry called once when target become visible in viewport
          if (entry.isIntersecting) {
            listenerRef.current(entry)
            unobserveRef.current()
          }
        }
        else {
          listenerRef.current(entry)
        }
      })
    })

    return () => {
      unobserveRef.current()
      clearTimeout(timeoutId)
    }
  }, [ once, observerOptions ])

  return [ ref, unobserveRef.current ]
}


export default useEntryListener
