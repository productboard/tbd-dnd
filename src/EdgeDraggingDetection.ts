import { Coordinates } from './types'

type EdgeDraggingDetectionSettings = {
  wrapperEl: Maybe<HTMLElement>
  initialMousePosition: Coordinates
  onEdgeDragging?: Maybe<(delta: Coordinates) => void>
  stopOnESCPress?: boolean
  edgeDraggingAreaPercentage?: number
  edgeDraggingMaxSpeed?: number
}

const EDGE_DRAGGING_MAX_SPEED = 50
const EDGE_DRAGGING_INITIAL_TRESHHOLD = 100
const EDGE_DRAGGING_AREA_PERCENTAGE = 0.1

const calculateEdgeDraggingStep = (
  edgeSize: number,
  distanceToTheEdge: number,
  edgeDraggingMaxSpeed: number,
) => {
  return Math.max(
    Math.min(1 - distanceToTheEdge / edgeSize, 1) * edgeDraggingMaxSpeed,
    0,
  )
}

const isInitialTreshholdReached = (
  initPosition: Coordinates,
  lastPosition: Maybe<Coordinates>,
) => {
  return (
    lastPosition &&
    (Math.abs(initPosition.x - lastPosition.x) >
      EDGE_DRAGGING_INITIAL_TRESHHOLD ||
      Math.abs(initPosition.y - lastPosition.y) >
        EDGE_DRAGGING_INITIAL_TRESHHOLD)
  )
}

const edgeDraggingDetection = (settings: EdgeDraggingDetectionSettings) => {
  let wrapperEl: Maybe<HTMLElement> = null
  let lastMousePosition: Maybe<Coordinates> = null
  let mouseMoveDirection: Maybe<{
    x: 'left' | 'right'
    y: 'top' | 'bottom'
  }> = null
  let edgeDraggingDetectionInterval: Maybe<number> = null
  let edgeDraggingAreaPercentage: number = 0
  let edgeDraggingMaxSpeed: number = 0
  let stopOnESCPress: boolean = false
  let maxScrollHeight: number = 0

  let onKeydown: (ev: KeyboardEvent) => void

  const init = (settings: EdgeDraggingDetectionSettings) => {
    wrapperEl = settings.wrapperEl
    wrapperEl &&
      (maxScrollHeight = wrapperEl.scrollHeight - wrapperEl.clientHeight)
    stopOnESCPress = settings.stopOnESCPress || false
    edgeDraggingAreaPercentage =
      settings.edgeDraggingAreaPercentage || EDGE_DRAGGING_AREA_PERCENTAGE
    edgeDraggingMaxSpeed =
      settings.edgeDraggingMaxSpeed || EDGE_DRAGGING_MAX_SPEED
  }

  const onMouseMove = (ev: MouseEvent) => {
    if (lastMousePosition) {
      const dX = ev.clientX - lastMousePosition.x
      const dY = ev.clientY - lastMousePosition.y
      const lastDirection = mouseMoveDirection || { x: 'left', y: 'top' }

      mouseMoveDirection = {
        x: dX === 0 ? lastDirection.x : dX < 0 ? 'left' : 'right',
        y: dY === 0 ? lastDirection.y : dY < 0 ? 'top' : 'bottom',
      }
    }

    lastMousePosition = { x: ev.clientX, y: ev.clientY }
  }

  const stop = () => {
    if (typeof edgeDraggingDetectionInterval === 'number') {
      clearInterval(edgeDraggingDetectionInterval)
    }
    document.removeEventListener('mousemove', onMouseMove)
    stopOnESCPress && document.removeEventListener('keydown', onKeydown)
    lastMousePosition = null
    mouseMoveDirection = null
  }

  onKeydown = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
      stop()
    }
  }

  const onEdgeDragging = ({ y }: Coordinates) => {
    if (y && wrapperEl && maxScrollHeight) {
      wrapperEl.scrollTop = Math.min(wrapperEl.scrollTop + y, maxScrollHeight)
    }
  }

  const start = (
    initialMousePosition: Coordinates,
    onEdgeDraggingCallback: Maybe<(delta: Coordinates) => void>,
  ) => {
    if (!wrapperEl) return

    const clientRect = wrapperEl && wrapperEl.getBoundingClientRect()
    document.addEventListener('mousemove', onMouseMove)
    stopOnESCPress && document.addEventListener('keydown', onKeydown)
    let initialTreshholdReached = false

    edgeDraggingDetectionInterval = window.setInterval(() => {
      // don't wanna start scrolling immediately when user starts dragging near the edge
      // has to drag it for some distance before autoscroll starts working
      if (
        !initialTreshholdReached &&
        isInitialTreshholdReached(initialMousePosition, lastMousePosition)
      ) {
        initialTreshholdReached = true
      }

      if (
        !initialTreshholdReached ||
        !lastMousePosition ||
        !mouseMoveDirection
      ) {
        return
      }

      const offsets = {
        left: lastMousePosition.x - clientRect.left,
        right: clientRect.right - lastMousePosition.x,
        top: lastMousePosition.y - clientRect.top,
        bottom: clientRect.bottom - lastMousePosition.y,
      }

      const areaPercentage = edgeDraggingAreaPercentage
      const edgeArea = {
        width: clientRect.width * areaPercentage,
        height: clientRect.height * areaPercentage,
      }

      const delta = {
        x: 0,
        y: 0,
      }

      const maxSpeed = edgeDraggingMaxSpeed

      if (mouseMoveDirection.y === 'top' && offsets.top < edgeArea.height) {
        delta.y = -calculateEdgeDraggingStep(
          edgeArea.height,
          offsets.top,
          maxSpeed,
        )
      } else if (
        mouseMoveDirection.y === 'bottom' &&
        offsets.bottom < edgeArea.height
      ) {
        delta.y = calculateEdgeDraggingStep(
          edgeArea.height,
          offsets.bottom,
          maxSpeed,
        )
      }

      if (mouseMoveDirection.x === 'left' && offsets.left < edgeArea.width) {
        delta.x = -calculateEdgeDraggingStep(
          edgeArea.width,
          offsets.left,
          maxSpeed,
        )
      } else if (
        mouseMoveDirection.x === 'right' &&
        offsets.right < edgeArea.width
      ) {
        delta.x = calculateEdgeDraggingStep(
          edgeArea.width,
          offsets.right,
          maxSpeed,
        )
      }

      if (delta.x !== 0 || delta.y !== 0) {
        onEdgeDraggingCallback && typeof onEdgeDraggingCallback === 'function'
          ? onEdgeDraggingCallback(delta)
          : onEdgeDragging(delta)
      }
    }, 17)
  }

  init(settings)
  start(settings.initialMousePosition, settings.onEdgeDragging)

  return stop
}

export default edgeDraggingDetection
