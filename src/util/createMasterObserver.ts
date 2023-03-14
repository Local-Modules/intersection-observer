const listeners = new WeakMap()
let intersectionObserver: IntersectionObserver


type Listener = (entry: IntersectionObserverEntry) => void

const createMasterObserver = () => {
  // we should postpone IntersectionObserver initialization, because it should be created after polyfill loading
  if (typeof window !== 'undefined' && !intersectionObserver) {
    intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const listener = listeners.get(entry.target)

        if (listener) {
          listener(entry)
        }
      })
    })
  }

  return {
    observe: (node: HTMLElement, listener: Listener) => {
      if (!intersectionObserver) {
        return
      }

      listeners.set(node, listener)
      intersectionObserver.observe(node)
    },
    unobserve: (node: HTMLElement) => {
      if (!intersectionObserver) {
        return
      }

      if (listeners.has(node)) {
        listeners.delete(node)
        intersectionObserver.unobserve(node)
      }
    },
  }
}


export default createMasterObserver
