declare module 'vue3-smooth-dnd' {
  import { DefineComponent } from 'vue'

  export interface DropResult {
    removedIndex: number | null
    addedIndex: number | null
    payload?: any
  }

  export const Container: DefineComponent<{
    orientation?: 'horizontal' | 'vertical'
    behaviour?: 'move' | 'copy' | 'drop-zone'
    dragHandleSelector?: string
    nonDragAreaSelector?: string
    dragBeginDelay?: number
    animationDuration?: number
    autoScrollEnabled?: boolean
    lockAxis?: 'x' | 'y'
    dragClass?: string
    dropClass?: string
    dragStartThreshold?: number
    onDrop?: (dropResult: DropResult) => void
    onDragStart?: (dragResult: { isSource: boolean; payload: any; willAcceptDrop: boolean }) => void
    onDragEnd?: (dragResult: { isSource: boolean; payload: any; willAcceptDrop: boolean }) => void
    getChildPayload?: (index: number) => any
    shouldAnimateDrop?: (sourceContainerOptions: any, payload: any) => boolean
    shouldAcceptDrop?: (sourceContainerOptions: any, payload: any) => boolean
    tag?: string
  }>

  export const Draggable: DefineComponent<{
    tag?: string
  }>
} 