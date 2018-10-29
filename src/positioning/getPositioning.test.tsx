import { getPositioningForBox } from './generatePositioning'
import Box from './Box'

test('generating positioning for a Box', () => {
  expect(
    getPositioningForBox(
      Box({
        id: 'test',
        width: 1436,
        height: 40,
        marginTop: 10,
        marginBottom: 10,
      }),
      { left: 0, top: 10, sections: {}, boxes: {} },
    ),
  ).toEqual({
    x: 0,
    y: 10,
    top: 10,
    left: 0,
    bottom: 50,
    right: 1436,
    width: 1436,
    height: 40,
    position: 'relative',
  })
})
