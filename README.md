# tbd-dnd

The library was presented at ReactiveConf 2018, [check it out](https://www.youtube.com/watch?v=81K49MN0dM8&t=396)!

I'd like to point out, that this library might be great help when building complex animated UIs. If you need simple things like sorted lists, I recommend you to use one of these instead:

- [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
- [react-sortable-hoc](https://github.com/clauderic/react-sortable-hoc)

Also, this project is in very early stage of development and the API will most likely change a lot. Main purpose is to demonstrate our use-case and gather feedback, if you wanna achieve something similar. If so, say hi at [vojta@productboard.com](mailto:vojta@productboard.com) / [twitter.com/vojta_prikryl](https://twitter.com/vojta_prikryl)

## Docs
Coming soon.

**DraggableCanvas**

Prop | Type | Description
---|---|---
getWrapperEl? | () => Maybe<HTMLElement> | TODO
detectScrollEvents? | boolean | TODO
detectEdgeDragging? | boolean | TODO
onEdgeDragging? | (delta: Coordinates) => void | TODO
onElementDragStart? | (id: Id, ev: MouseEvent) => void | TODO
onElementDrag? | (id: Id, x: number, y: number) => void | TODO
onElementDrop? | (id: Id) => void | TODO
onElementDropAnimationEnd? | (id: Id) => void | TODO
children | (params: ChildrenFunctionParams<Id>) => React.ReactNode | TODO
 

**DraggableCanvasElement**

Prop | Type | Description 
---|---|---
x | number | TODO 
y | number | TODO 
forbidDragging? | boolean | TODO 
isDragged? | boolean | TODO 
onDragStart? | (ev: MouseEvent) => void | TODO 
onDrag? | (x: number, y: number) => void | TODO 
onDrop? | () => void | TODO 
preventClickEventAfterDrag? | boolean | TODO 
children | React.ReactNode | TODO 


## Example

Basic example demonstrating how to user `DraggableCanvasElement` and `DraggableCanvas` API:
https://codepen.io/aldredcz/project/editor/ZnNMVg

## Preview ([click for full version](http://data.aldred.cz/pb-roadmap.mp4))
   
[![Preview](http://data.aldred.cz/pb-roadmap-preview.gif)](http://data.aldred.cz/pb-roadmap.mp4)