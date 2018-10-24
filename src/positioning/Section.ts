import { TBox } from './Box'

export type TSectionParams = {
  id: string
  paddingTop?: number
  paddingLeft?: number
  paddingBottom?: number
  paddingRight?: number
  marginTop?: number
  marginLeft?: number
  marginBottom?: number
  marginRight?: number
  minWidth?: number
  minHeight?: number
  position?: 'relative' | 'fixed'
  top?: number
  left?: number
}

export type TSection = TSectionParams & {
  type: 'SECTION'
  direction: 'HORIZONTAL' | 'VERTICAL'
  readonly children: ReadonlyArray<TSection | TBox | null | undefined | false>
}

export type TSectionChildren = TSection['children']

type FnParams = TSectionParams & { children: TSectionChildren }

export function Horizontal(params: FnParams): TSection {
  return { ...params, type: 'SECTION', direction: 'HORIZONTAL' }
}

export function Vertical(params: FnParams): TSection {
  return { ...params, type: 'SECTION', direction: 'VERTICAL' }
}
