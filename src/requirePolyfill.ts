import { state } from './util'

const requirePolyfill = (callback?: () => void) => {
  if (typeof window === 'undefined') {
    return
  }

  // by default, it's true for case if polyfill isn't required
  state.isReady = false

  const finalize = () => {
    state.isReady = true

    if (typeof callback === 'function') {
      callback()
    }
  }

  const isIntersectionObserverExist = false
  // const isIntersectionObserverExist = (
  //   'IntersectionObserver' in window
  //   && 'IntersectionObserverEntry' in window
  //   && 'intersectionRatio' in window.IntersectionObserverEntry.prototype
  // )

  if (isIntersectionObserverExist) {
    // Minimal polyfill for Edge 15's lack of `isIntersecting` - https://github.com/w3c/IntersectionObserver/issues/211
    if (!(
      'isIntersecting' in window.IntersectionObserverEntry.prototype
    )) {
      Object.defineProperty(
        window.IntersectionObserverEntry.prototype,
        'isIntersecting',
        {
          get() {
            return this.intersectionRatio > 0
          },
        }
      )
    }

    finalize()
  }

  // @ts-ignore
  require.ensure([ './polyfill' ], finalize)
}

export default requirePolyfill
