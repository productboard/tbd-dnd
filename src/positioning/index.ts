export { default as generatePositioning } from './generatePositioning'

export { default as Box } from './Box'

import { Horizontal, TSectionChildren, Vertical } from './Section'

export const Section = { Horizontal, Vertical }

// cannot use `export { T } from '...'`
// for some reason, it doesn't play well with Webpack
import { TPositioning as _TPositioning } from './generatePositioning' // TYPES => TS migration
import { TBox as _TBox, TBoxParams as _TBoxParams } from './Box' // TYPES => TS migration
import {
  TSection as _TSection,
  TSectionParams as _TSectionParams,
  TSectionChildren as _TSectionChildren,
} from './Section' // TYPES => TS migration

export type TPositioning = _TPositioning
export type TBox = _TBox
export type TBoxParams = _TBoxParams
export type TSection = _TSection
export type TSectionParams = _TSectionParams
export type TSectionChildren = _TSectionChildren
