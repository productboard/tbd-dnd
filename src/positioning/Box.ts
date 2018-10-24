export type TBoxParams = {
  id: string
  width: number
  height: number
  marginTop?: number
  marginLeft?: number
  marginBottom?: number
  marginRight?: number
  position?: 'relative' | 'fixed'
  top?: number
  left?: number
}

export type TBox = TBoxParams & {
  type: 'BOX'
}

export default function Box(params: TBoxParams): TBox {
  return {
    type: 'BOX',
    ...params,
  }
}
