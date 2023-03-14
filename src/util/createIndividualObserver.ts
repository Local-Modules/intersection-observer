type Listener = (entry: IntersectionObserverEntry) => void

const createIndividualObserver = (observerProps: IntersectionObserverInit) => {
  let observer: IntersectionObserver | undefined

  return {
    observe: (node: HTMLElement, listener: Listener) => {
      observer = new IntersectionObserver(([ entry ]) => {
        listener(entry)
      }, observerProps)

      observer.observe(node)
    },
    unobserve: (node: HTMLElement) => {
      if (observer) {
        observer.unobserve(node)
        observer = undefined
      }
    },
  }
}


export default createIndividualObserver
