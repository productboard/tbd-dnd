import { TSection } from './Section'
import { TBox } from './Box'

export type TPositioning = {
  x: number
  y: number
  top: number
  left: number
  bottom: number
  right: number
  width: number
  height: number
  position: 'relative' | 'fixed'
}

type TContext = {
  sections: { [key: string]: TPositioning }
  boxes: { [key: string]: TPositioning }
  top: number
  left: number
}

function getPositioningForChild(
  child: TSection | TBox,
  context: TContext,
): TPositioning {
  const result: TPositioning = (() => {
    switch (child.type) {
      case 'SECTION':
        return getPositioningForSection(child, context)
      case 'BOX':
        return getPositioningForBox(child, context)
      default:
        throw Error(
          `libs/positioning: Unknown type '${
            child!.type
          }' provided. 'SECTION' or 'BOX' expected.`,
        )
    }
  })()

  return result
}

export function getPositioningForBox(box: TBox, context: TContext): TPositioning {
  const result = {
    x: NaN, // will be calculated
    y: NaN,
    top: box.top || context.top,
    left: box.left || context.left,
    bottom: NaN,
    right: NaN,
    width: box.width,
    height: box.height,
    position: box.position || 'relative',
  }

  result.x = result.left
  result.y = result.top
  result.bottom = result.top + result.height
  result.right = result.left + result.width

  context.boxes[box.id] = result

  return result
}

function getPositioningForSection(
  section: TSection,
  context: TContext,
): TPositioning {
  const {
    id,
    direction,
    minWidth = 0,
    minHeight = 0,
    paddingLeft = 0,
    paddingRight = 0,
    paddingTop = 0,
    paddingBottom = 0,
    position = 'relative',
  } = section
  const positioning = {
    x: NaN, // will be calculated
    y: NaN,
    top: section.top || context.top,
    left: section.left || context.left,
    bottom: NaN,
    right: NaN,
    width: NaN,
    height: NaN,
    position,
  }
  // @ts-ignore TODO: doesn't want to filter out "undefined"s
  const children: Array<TSection | TBox> = section.children.filter(skipMaybe)

  if (direction === 'HORIZONTAL') {
    let currentLeft = positioning.left + paddingLeft
    let maxHeight = 0
    let previousMarginRight = 0

    children.forEach(child => {
      const {
        marginTop: childMarginTop = 0,
        marginBottom: childMarginBottom = 0,
        marginLeft: childMarginLeft = 0,
        marginRight: childMarginRight = 0,
        position,
      } = child
      const { right, height } = getPositioningForChild(child, {
        ...context,
        top: positioning.top + paddingTop + childMarginTop,
        left: currentLeft + Math.max(previousMarginRight, childMarginLeft),
      })

      if (position === 'fixed') {
        return
      }

      currentLeft = right
      maxHeight = Math.max(
        maxHeight,
        height + childMarginTop + childMarginBottom,
      )
      previousMarginRight = childMarginRight
    })

    positioning.height = Math.max(
      maxHeight + paddingTop + paddingBottom,
      minHeight,
    )
    positioning.width = Math.max(
      currentLeft - positioning.left + paddingRight + previousMarginRight,
      minWidth,
    )
  } else if (direction === 'VERTICAL') {
    let currentTop = positioning.top + paddingTop
    let maxWidth = 0
    let previousMarginBottom = 0

    children.forEach(child => {
      const {
        marginTop: childMarginTop = 0,
        marginBottom: childMarginBottom = 0,
        marginLeft: childMarginLeft = 0,
        marginRight: childMarginRight = 0,
        position,
      } = child
      const { bottom, width } = getPositioningForChild(child, {
        ...context,
        top: currentTop + Math.max(previousMarginBottom, childMarginTop),
        left: positioning.left + paddingLeft + childMarginLeft,
      })

      if (position === 'fixed') {
        return
      }

      currentTop = bottom
      maxWidth = Math.max(maxWidth, width + childMarginLeft + childMarginRight)
      previousMarginBottom = childMarginBottom
    })

    positioning.width = Math.max(
      maxWidth + paddingLeft + paddingRight,
      minWidth,
    )
    positioning.height = Math.max(
      currentTop - positioning.top + paddingBottom + previousMarginBottom,
      minHeight,
    )
  }

  positioning.x = positioning.left
  positioning.y = positioning.top
  positioning.bottom = positioning.top + positioning.height
  positioning.right = positioning.left + positioning.width

  context.sections[id] = positioning

  return positioning
}

export default function generatePositioning(
  hierarchy: TSection,
  initialContext: Partial<TContext> = {},
) {
  const context = {
    boxes: {},
    sections: {},
    top: 0,
    left: 0,
    ...initialContext,
  }

  getPositioningForChild(hierarchy, context)

  return {
    boxes: context.boxes,
    sections: context.sections,
  }
}
