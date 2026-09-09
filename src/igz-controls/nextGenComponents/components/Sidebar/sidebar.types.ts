export interface SidebarContextValue {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void
  toggleSidebar: () => void
  pinned: boolean
  togglePin: () => void
  hoverLocked: boolean
  setHoverLocked: (locked: boolean) => void
}
