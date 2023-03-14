import state from './state'


const runWhenReady = (callback: () => any): NodeJS.Timeout | undefined => {
  let timeoutId

  if (state.isReady) {
    callback()
  }
  else {
    timeoutId = setTimeout(() => runWhenReady(callback), 500)
  }

  return timeoutId
}

export default runWhenReady
