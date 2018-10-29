import * as React from 'react'

import { Coordinates } from './types'

export const MOUSE_BUTTON_LEFT = 0

export type Props = {
  width: number | '100%'
  height: number
  x: number
  y: number
  forbidDragging?: boolean
  isDragged?: boolean
  isDropping?: boolean
  onDragStart?: (ev: MouseEvent) => void
  onDrag?: (x: number, y: number) => void
  onDrop?: () => void
  onDropAnimationEnd?: () => void
  preventClickEventAfterDrag?: boolean
  children: React.ReactNode
}

const DRAG_EVENTS = ['mousemove'] // TODO: Add support for touch 'touchmove'
const DROP_EVENTS = ['mouseup', 'touchend', 'touchcancel']

const DROP_ANIMATION_DURATION = 200

function moreThan5pxApart(a: Coordinates, b: Coordinates) {
  return Math.abs(a.x - b.x) > 5 || Math.abs(a.y - b.y) > 5
}

/*
 * DraggableCanvasElement represents a draggable element on the canvas.
 *
 * It needs X and Y coordinates for it's top-left corner and width/height
 * dimensions to render. It positions itself using given coordinates
 * with `translate3d`.
 */
export default class DraggableCanvasElement extends React.Component<Props> {
  static defaultProps = {
    preventClickEventAfterDrag: true,
  }

  draggableEl: Maybe<HTMLDivElement> = null
  initialCursorPosition: Maybe<Coordinates> = null
  lastCursorPosition: Coordinates = { x: 0, y: 0 }
  reachedInitialDraggingThreshold: boolean = false
  dropAnimationEndTimeout: Maybe<number> = null

  componentDidMount() {
    const { draggableEl } = this

    if (draggableEl) {
      draggableEl.addEventListener(
        'click',
        this.checkClickEvent,
        true, // fire in `capture` phase instead of in the `bubbling-up` one
      )
      draggableEl.addEventListener(
        'dragstart',
        this.preventDragStartNativeEvent,
        true, // fire in `capture` phase instead of in the `bubbling-up` one
      )
    }
  }

  componentWillUnmount = () => {
    const { draggableEl } = this

    if (this.dropAnimationEndTimeout)
      window.clearTimeout(this.dropAnimationEndTimeout)
    if (draggableEl) {
      draggableEl.removeEventListener('click', this.checkClickEvent, true)
      draggableEl.removeEventListener(
        'dragstart',
        this.preventDragStartNativeEvent,
        true,
      )
    }
  }

  checkClickEvent = (ev: MouseEvent) => {
    if (
      this.props.preventClickEventAfterDrag &&
      this.reachedInitialDraggingThreshold
    ) {
      ev.preventDefault()
      ev.stopPropagation()
    }
  }

  onDrag = (event: Event) => {
    event.preventDefault()

    if (!(event instanceof MouseEvent)) {
      return
    }

    const { clientX, clientY } = event
    const { onDrag, onDragStart, x, y } = this.props
    const nextX = x + (clientX - this.lastCursorPosition.x)
    const nextY = y + (clientY - this.lastCursorPosition.y)

    this.lastCursorPosition = {
      x: clientX,
      y: clientY,
    }

    if (
      !this.reachedInitialDraggingThreshold &&
      this.initialCursorPosition &&
      moreThan5pxApart(this.lastCursorPosition, this.initialCursorPosition)
    ) {
      this.reachedInitialDraggingThreshold = true
      onDragStart && onDragStart(event)
    }

    if (this.reachedInitialDraggingThreshold && onDrag) onDrag(nextX, nextY)
  }

  preventDragStartNativeEvent = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== MOUSE_BUTTON_LEFT) return

    DRAG_EVENTS.forEach(eventName =>
      document.addEventListener(eventName, this.onDrag),
    )
    DROP_EVENTS.forEach(eventName =>
      document.addEventListener(eventName, this.onDragEnd),
    )

    this.reachedInitialDraggingThreshold = false
    this.initialCursorPosition = this.lastCursorPosition = {
      x: event.clientX,
      y: event.clientY,
    }
  }

  onDragEnd = () => {
    DRAG_EVENTS.forEach(eventName =>
      document.removeEventListener(eventName, this.onDrag),
    )
    DROP_EVENTS.forEach(eventName =>
      document.removeEventListener(eventName, this.onDragEnd),
    )

    if (this.reachedInitialDraggingThreshold) {
      const { onDrop, onDropAnimationEnd } = this.props

      onDrop && onDrop()
      this.dropAnimationEndTimeout = window.setTimeout(() => {
        onDropAnimationEnd && onDropAnimationEnd()
      }, DROP_ANIMATION_DURATION)
    }
  }

  getStyles = () => {
    const { width, height, isDragged, isDropping, x, y } = this.props
    const transform = `translate3d(${x}px, ${y}px, 0)`
    const zIndex = isDragged || isDropping ? 10 : undefined
    const transition = isDragged
      ? 'none'
      : `transform ${DROP_ANIMATION_DURATION / 1000}s ease`

    return {
      transform,
      width,
      height,
      zIndex,
      transition,
      position: 'absolute' as 'absolute',
      top: 0,
      left: 0,
    }
  }

  render() {
    const { forbidDragging } = this.props

    return (
      <div
        ref={c => (this.draggableEl = c)}
        style={this.getStyles()}
        onMouseDown={!forbidDragging ? this.onMouseDown : undefined}
      >
        {this.props.children}
      </div>
    )
  }
}
