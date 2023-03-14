# intersection-observer

## Features

- Lazy loading of images or other content as the page scrolls.
- Implementation of "infinity scrolling" sites, where new content is loaded and displayed as you scroll.
- Reporting on the visibility of the site's promotional blocks to calculate effectiveness.
- Deciding whether to perform tasks or animations depending on whether the user sees the result.
  
[W3C Documentation](https://www.w3.org/TR/intersection-observer/#intersection-observer-api)

## API

### Polyfill

Library has a polyfill taken from [W3C](https://github.com/w3c/IntersectionObserver) (which was moved and archived in [GoogleChromeLabs/intersection-observer](https://github.com/GoogleChromeLabs/intersection-observer)).

The polyfill isn't included into the bundle. If you need to support old browsers, call `requirePolyfill` on client app initialization to verify if client needs it and require dynamically the polyfill script. **It should be done before App become interactive, use callback for more control.**

```jsx
// client
import { requirePolyfill } from '@locmod/intersection-observer'


requirePolyfill(() => {
  setIntersectionObserverReady(true)
  renderApp()
  whatever()
})

```
Or use polyfill.io instead:
```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver"></script>
```

### `useEntry`

Calls rerender on each change of entry state.

```js
const [ ref, entry, unobserve ] = useEntry(options)
```

### `useEntryListener`

Entry changes call listener callback, it doesn't have a state, so doesn't rerender a component.

```ts
const listener = (entry: IntersectionObserverEntry) => {}

const [ ref, unobserve ] = useEntryListener(listener, options)
```

### `options`

```
{
  // IntersectionObserver options
  observerProps: {
    root: node,
    rootMargin: '10px 10px 10px 10px',
    threshold: [ 0, 0.25, 0.5, 0.75, 1 ],
  },
  // event will be fired once and then unsubscribed from observer
  once: true,
}
```

[Read more](https://www.w3.org/TR/intersection-observer/#dictdef-intersectionobserverinit) about IntersectionObserver options.


## Examples

### Hide an element when footer is in viewport

```jsx
const App = () => {
  const [ ref, entry ] = useEntry()
  
  const isVisible = !entry || !entry.isIntersecting

  return (
    <div>
      <Element isVisible={isVisible} />
      <div ref={ref} />
      <Footer />
    </div>
  )
}
```

### Lazy images

Add `rootMargin: '50%'` to start loading and rendering the image when there
is half the height of the viewport before the image becomes visible,
so when the image appears in the viewport it will not blink.
Add `once: true` because the image should be processed only once.

```jsx
const LazyImage = ({ src }) => {
  const [ ref, entry ] = useEntry({
    observerProps: { rootMargin: '50%' },
    once: true,
  })

  const finalSrc = entry && entry.isIntersecting ? src : 'placeholder.jpg'

  return (
    <img ref={ref} src={finalSrc} />
  )
}

const App = () => (
  <>
    <div style={{ height: '150vh', backgroundColor: '#face8D' }} />
    <LazyImage key={src} src={src} />
  </>
)
```

### Trigger a callback

For example, to trigger an analytical event if a client sees an element (it works for both cases: vertical and horizontal scroll, e.g. carousel of banners)

```jsx
const Component = () => {
  const [ ref ] = useEntryListener(() => {
    track('The element shown')
  }, { once: true })

  return (
    <div ref={ref} />
  )
}
```
