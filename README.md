# tbd-dnd

Drag and Drop is undoubtedly one of the most popular and user-friendly interactions in software nowadays. There are plenty awesome libraries for DnD in React realm, covering most of the use cases. We tried them all at @productboard, but realized we need something special for complex interfaces we are building. We developed our own solution that satisfied three main requirements we had:

1. Delightful user experience 🤩
2. Great performance even for large datasets 🏎
3. Reusability of already existing code 🔌

Questions? Ideas? Your experience with Drag and Drop?
Reach me out on Twitter: https://twitter.com/vojta_prikryl

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
https://codepen.io/aldredcz/project/editor/ZnNMVg

## Preview ([click for full version](http://data.aldred.cz/pb-roadmap.mp4))
   
[![Preview](http://data.aldred.cz/pb-roadmap-preview.gif)](http://data.aldred.cz/pb-roadmap.mp4)