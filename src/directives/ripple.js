export function isObject(obj) {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj)
}
export const keyCodes = Object.freeze({
  enter: 13,
  tab: 9,
  delete: 46,
  esc: 27,
  space: 32,
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  end: 35,
  home: 36,
  del: 46,
  backspace: 8,
  insert: 45,
  pageup: 33,
  pagedown: 34,
  shift: 16,
})
const stopSymbol = Symbol('rippleStop')

const DELAY_RIPPLE = 80

function transform(el, value) {
  el.style.transform = value
  el.style.webkitTransform = value
}

const isTouchEvent = (e) => e.constructor.name === 'TouchEvent'

const isKeyboardEvent = (e) => e.constructor.name === 'KeyboardEvent'
const isRippleEnabled = (value) => typeof value === 'undefined' || !!value

const calculate = (e, el, value = {}) => {
  let localX = 0
  let localY = 0

  if (!isKeyboardEvent(e)) {
    const offset = el.getBoundingClientRect()
    const target = isTouchEvent(e) ? e.touches[e.touches.length - 1] : e

    localX = target.clientX - offset.left
    localY = target.clientY - offset.top
  }

  let radius = 0
  let scale = 0.3
  if (el._ripple?.circle) {
    scale = 0.15
    radius = el.clientWidth / 2
    radius = value.center
      ? radius
      : radius + Math.sqrt((localX - radius) ** 2 + (localY - radius) ** 2) / 4
  } else {
    radius = Math.sqrt(el.clientWidth ** 2 + el.clientHeight ** 2) / 2
  }

  const centerX = `${(el.clientWidth - radius * 2) / 2}px`
  const centerY = `${(el.clientHeight - radius * 2) / 2}px`

  const x = value.center ? centerX : `${localX - radius}px`
  const y = value.center ? centerY : `${localY - radius}px`

  return { radius, scale, x, y, centerX, centerY }
}

const ripples = {
  show(e, el, value = {}) {
    if (!el?._ripple?.enabled) {
      return
    }

    const container = document.createElement('span')
    const animation = document.createElement('span')

    container.appendChild(animation)
    container.className = 'v-ripple__container'

    if (value.class) {
      container.className += ` ${value.class}`
    }

    const { radius, scale, x, y, centerX, centerY } = calculate(e, el, value)

    const size = `${radius * 2}px`
    animation.className = 'v-ripple__animation'
    animation.style.width = size
    animation.style.height = size

    el.appendChild(container)

    const computed = window.getComputedStyle(el)
    if (computed && computed.position === 'static') {
      el.style.position = 'relative'
      el.dataset.previousPosition = 'static'
    }

    animation.classList.add('v-ripple__animation--enter')
    animation.classList.add('v-ripple__animation--visible')
    transform(
      animation,
      `translate(${x}, ${y}) scale3d(${scale},${scale},${scale})`,
    )
    animation.dataset.activated = String(performance.now())

    setTimeout(() => {
      animation.classList.remove('v-ripple__animation--enter')
      animation.classList.add('v-ripple__animation--in')
      transform(animation, `translate(${centerX}, ${centerY}) scale3d(1,1,1)`)
    }, 0)
  },

  hide(el) {
    if (!el?._ripple?.enabled) return

    const ripples = el.getElementsByClassName('v-ripple__animation')

    if (ripples.length === 0) return
    const animation = ripples[ripples.length - 1]

    if (animation.dataset.isHiding) return
    else animation.dataset.isHiding = 'true'

    const diff = performance.now() - Number(animation.dataset.activated)
    const delay = Math.max(250 - diff, 0)

    setTimeout(() => {
      animation.classList.remove('v-ripple__animation--in')
      animation.classList.add('v-ripple__animation--out')

      setTimeout(() => {
        const ripples = el.getElementsByClassName('v-ripple__animation')
        if (ripples.length === 1 && el.dataset.previousPosition) {
          el.style.position = el.dataset.previousPosition
          delete el.dataset.previousPosition
        }

        if (animation.parentNode?.parentNode === el)
          el.removeChild(animation.parentNode)
      }, 300)
    }, delay)
  },
}

function rippleShow(e) {
  const value = {}
  const element = e.currentTarget

  if (!element?._ripple || element._ripple.touched || e[stopSymbol]) return

  // Don't allow the event to trigger ripples on any other elements
  e[stopSymbol] = true

  if (isTouchEvent(e)) {
    element._ripple.touched = true
    element._ripple.isTouch = true
  } else {
    // It's possible for touch events to fire
    // as mouse events on Android/iOS, this
    // will skip the event call if it has
    // already been registered as touch
    if (element._ripple.isTouch) return
  }

  value.center = element._ripple.centered || isKeyboardEvent(e)
  if (element._ripple.class) {
    value.class = element._ripple.class
  }

  if (isTouchEvent(e)) {
    // already queued that shows or hides the ripple
    if (element._ripple.showTimerCommit) return

    element._ripple.showTimerCommit = () => {
      ripples.show(e, element, value)
    }
    element._ripple.showTimer = window.setTimeout(() => {
      if (element?._ripple?.showTimerCommit) {
        element._ripple.showTimerCommit()
        element._ripple.showTimerCommit = null
      }
    }, DELAY_RIPPLE)
  } else {
    ripples.show(e, element, value)
  }
}

function rippleStop(e) {
  e[stopSymbol] = true
}

function rippleHide(e) {
  const element = e.currentTarget
  if (!element?._ripple) return

  window.clearTimeout(element._ripple.showTimer)

  // The touch interaction occurs before the show timer is triggered.
  // We still want to show ripple effect.
  if (e.type === 'touchend' && element._ripple.showTimerCommit) {
    element._ripple.showTimerCommit()
    element._ripple.showTimerCommit = null

    // re-queue ripple hiding
    element._ripple.showTimer = window.setTimeout(() => {
      rippleHide(e)
    })
    return
  }

  window.setTimeout(() => {
    if (element._ripple) {
      element._ripple.touched = false
    }
  })
  ripples.hide(element)
}

function rippleCancelShow(e) {
  const element = e.currentTarget

  if (!element?._ripple) return

  if (element._ripple.showTimerCommit) {
    element._ripple.showTimerCommit = null
  }

  window.clearTimeout(element._ripple.showTimer)
}

let keyboardRipple = false

function keyboardRippleShow(e) {
  if (
    !keyboardRipple &&
    (e.keyCode === keyCodes.enter || e.keyCode === keyCodes.space)
  ) {
    keyboardRipple = true
    rippleShow(e)
  }
}

function keyboardRippleHide(e) {
  keyboardRipple = false
  rippleHide(e)
}

function focusRippleHide(e) {
  if (keyboardRipple) {
    keyboardRipple = false
    rippleHide(e)
  }
}

function updateRipple(el, binding, wasEnabled) {
  const { value, modifiers } = binding
  const enabled = isRippleEnabled(value)
  if (!enabled) {
    ripples.hide(el)
  }

  el._ripple = el._ripple ?? {}
  el._ripple.enabled = enabled
  el._ripple.centered = modifiers.center
  el._ripple.circle = modifiers.circle
  if (isObject(value) && value.class) {
    el._ripple.class = value.class
  }

  if (enabled && !wasEnabled) {
    if (modifiers.stop) {
      el.addEventListener('touchstart', rippleStop, { passive: true })
      el.addEventListener('mousedown', rippleStop)
      return
    }

    el.addEventListener('touchstart', rippleShow, { passive: true })
    el.addEventListener('touchend', rippleHide, { passive: true })
    el.addEventListener('touchmove', rippleCancelShow, { passive: true })
    el.addEventListener('touchcancel', rippleHide)

    el.addEventListener('mousedown', rippleShow)
    el.addEventListener('mouseup', rippleHide)
    el.addEventListener('mouseleave', rippleHide)

    el.addEventListener('keydown', keyboardRippleShow)
    el.addEventListener('keyup', keyboardRippleHide)

    el.addEventListener('blur', focusRippleHide)

    // Anchor tags can be dragged, causes other hides to fail - #1537
    el.addEventListener('dragstart', rippleHide, { passive: true })
  } else if (!enabled && wasEnabled) {
    removeListeners(el)
  }
}

function removeListeners(el) {
  el.removeEventListener('mousedown', rippleShow)
  el.removeEventListener('touchstart', rippleShow)
  el.removeEventListener('touchend', rippleHide)
  el.removeEventListener('touchmove', rippleCancelShow)
  el.removeEventListener('touchcancel', rippleHide)
  el.removeEventListener('mouseup', rippleHide)
  el.removeEventListener('mouseleave', rippleHide)
  el.removeEventListener('keydown', keyboardRippleShow)
  el.removeEventListener('keyup', keyboardRippleHide)
  el.removeEventListener('dragstart', rippleHide)
  el.removeEventListener('blur', focusRippleHide)
}

function mounted(el, binding) {
  updateRipple(el, binding, false)
}

function unmounted(el) {
  delete el._ripple
  removeListeners(el)
}

function updated(el, binding) {
  if (binding.value === binding.oldValue) {
    return
  }

  const wasEnabled = isRippleEnabled(binding.oldValue)
  updateRipple(el, binding, wasEnabled)
}

export const Ripple = {
  mounted,
  unmounted,
  updated,
}

export default Ripple

const style = document.createElement('style')
style.setAttribute('type', 'text/css')
style.innerHTML = `
  .v-ripple__animation {
    color: inherit;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
    background: currentColor;
    opacity: 0;
    pointer-events: none;
    overflow: hidden;
    will-change: transform, opacity;
  }

  .v-ripple__container {
    color: inherit;
    border-radius: inherit;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    overflow: hidden;
    z-index: 0;
    pointer-events: none;
    contain: strict;
  }

  .v-ripple__animation--enter {
    transition: none;
    opacity: 0;
  }

  .v-ripple__animation--in {
    transition: transform 0.25s cubic-bezier(0.0, 0, 0.2, 1), opacity 0.1s cubic-bezier(0.0, 0, 0.2, 1);
    opacity: calc(.25 * 1);
  }

  .v-ripple__animation--out {
    transition: opacity 0.3s cubic-bezier(0.0, 0, 0.2, 1);
    opacity: 0;
  }
`

document.head.appendChild(style)
