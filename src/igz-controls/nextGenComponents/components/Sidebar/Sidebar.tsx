/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { ChevronLeftIcon, ChevronRightIcon, MenuIcon } from 'lucide-react'

import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

import SidebarClose from '../../../images/navbar-closed-icon.svg?react'
import SidebarOpen from '../../../images/navbar-opened-icon.svg?react'

import { SidebarProvider } from './SidebarProvider'
import { useSidebar } from './useSidebar'

interface SidebarProps extends React.ComponentProps<'nav'> {
  side?: 'left' | 'right'
  variant?: 'sidebar' | 'floating' | 'inset'
  collapsible?: 'offcanvas' | 'icon' | 'none'
}

function Sidebar({
  children,
  className,
  collapsible = 'offcanvas',
  side = 'left',
  variant = 'sidebar',
  ref,
  ...props
}: SidebarProps) {
  const [isMouseOver, setIsMouseOver] = React.useState(false)
  const { hoverLocked, open, pinned, state, togglePin, setOpen } = useSidebar()
  const openTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    if (!hoverLocked && !isMouseOver && !pinned) {
      closeTimerRef.current = setTimeout(() => setOpen(false), 200)
      return () => clearTimeout(closeTimerRef.current!)
    }
  }, [hoverLocked, isMouseOver, pinned, setOpen])

  if (collapsible === 'none') {
    return (
      <nav
        className={cn(
          'flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground',
          className
        )}
        ref={ref as React.Ref<HTMLElement>}
        {...props}
      >
        {children}
      </nav>
    )
  }

  return (
    <nav
      ref={ref as React.Ref<HTMLElement>}
      className={cn(
        'group peer relative shrink-0 self-stretch overflow-visible text-sidebar-foreground',
        'transition-[width] duration-300 ease-linear',
        pinned && open ? 'w-[--sidebar-width]' : 'w-[--sidebar-width-icon]'
      )}
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
      data-pinned={pinned}
      onMouseEnter={() => {
        clearTimeout(closeTimerRef.current!)
        clearTimeout(openTimerRef.current!)
        setIsMouseOver(true)
        if (!pinned) {
          openTimerRef.current = setTimeout(() => setOpen(true), 100)
        }
      }}
      onMouseLeave={() => {
        clearTimeout(openTimerRef.current!)
        setIsMouseOver(false)
        if (!pinned && !hoverLocked) {
          setOpen(false)
        }
      }}
      onTransitionEnd={(e: React.TransitionEvent<HTMLElement>) => {
        if (e.target === e.currentTarget && e.propertyName === 'width') {
          window.dispatchEvent(new CustomEvent('mainResize'))
        }
      }}
    >
      <div
        className={cn(
          'absolute inset-y-0 left-0 z-20 flex flex-col transition-[width] duration-300 ease-linear md:flex',
          side === 'left' &&
            pinned &&
            'group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]',
          side === 'right' &&
            pinned &&
            'group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]'
            : cn(
                'group-data-[side=left]:border-r group-data-[side=right]:border-l',
                (open && !pinned) || (pinned && state === 'expanded')
                  ? 'w-[--sidebar-width]'
                  : 'w-[--sidebar-width-icon]'
              ),
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className="flex size-full flex-col bg-sidebar shadow-[1px_4px_16px_rgba(0,0,0,0.04)] group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
        >
          {children}
          {open && (
            <Button
              variant="outline"
              tooltip={pinned ? 'Unpin sidebar' : 'Pin sidebar'}
              data-testid="pin-sidebar-button"
              side="right"
              className={cn(
                'absolute top-2 left-full border bg-[#FAFAFA] border-gray-200 border-solid',
                'w-fit h-fit rounded-l-none border-l-0 py-2 pr-[3px] pl-[1px]',
                'transition-opacity hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                pinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )}
              onClick={togglePin}
            >
              {pinned ? (
                <SidebarClose data-testid="closeed-pin" />
              ) : (
                <SidebarOpen data-testid="opened-pin" />
              )}
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
Sidebar.displayName = 'Sidebar'

interface SidebarTriggerProps extends React.ComponentProps<'button'> {
  icon?: 'menu' | 'chevronLeft' | 'chevronRight'
}

function SidebarTrigger({ className, icon = 'menu', onClick, ref, ...props }: SidebarTriggerProps) {
  const { toggleSidebar } = useSidebar()
  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn('size-9', className)}
      onClick={event => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      {icon === 'menu' && <MenuIcon className="size-4 shrink-0" />}
      {icon === 'chevronLeft' && <ChevronLeftIcon className="size-4 shrink-0" />}
      {icon === 'chevronRight' && <ChevronRightIcon className="size-4 shrink-0" />}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}
SidebarTrigger.displayName = 'SidebarTrigger'

function SidebarRail({ className, ref, ...props }: React.ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar()
  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex',
        '[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className
      )}
      {...props}
    />
  )
}
SidebarRail.displayName = 'SidebarRail'

function SidebarInset({ className, ref, ...props }: React.ComponentProps<'main'>) {
  return (
    <main
      ref={ref}
      className={cn(
        'relative flex min-h-0 flex-1 flex-col bg-background transition-[width] duration-300 ease-linear',
        'peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow',
        className
      )}
      {...props}
    />
  )
}
SidebarInset.displayName = 'SidebarInset'

function SidebarInput({ className, ref, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        'h-9 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
        className
      )}
      {...props}
    />
  )
}
SidebarInput.displayName = 'SidebarInput'

function SidebarHeader({ className, ref, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn('flex gap-2 py-3.5', className)}
      {...props}
    />
  )
}
SidebarHeader.displayName = 'SidebarHeader'

function SidebarFooter({ className, ref, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn('flex flex-col gap-2 p-3', className)}
      {...props}
    />
  )
}
SidebarFooter.displayName = 'SidebarFooter'

function SidebarSeparator({ className, ref, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn('mx-5 mb-2 w-auto bg-sidebar-border', className)}
      {...props}
    />
  )
}
SidebarSeparator.displayName = 'SidebarSeparator'

function SidebarContent({ className, ref, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        'flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden',
        className
      )}
      {...props}
    />
  )
}
SidebarContent.displayName = 'SidebarContent'

function SidebarGroup({ className, ref, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn('relative flex w-full min-w-0 flex-col p-3', className)}
      {...props}
    />
  )
}
SidebarGroup.displayName = 'SidebarGroup'

interface SidebarGroupLabelProps extends React.ComponentProps<'div'> {
  asChild?: boolean
}

function SidebarGroupLabel({ asChild = false, className, ref, ...props }: SidebarGroupLabelProps) {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        'flex h-9 shrink-0 items-center rounded-md px-2.5 text-sm font-medium outline-none whitespace-nowrap ring-sidebar-ring focus-visible:ring-2 [&>svg]:size-5 [&>svg]:shrink-0',
        'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
        className
      )}
      {...props}
    />
  )
}
SidebarGroupLabel.displayName = 'SidebarGroupLabel'

interface SidebarGroupActionProps extends React.ComponentProps<'button'> {
  asChild?: boolean
}

function SidebarGroupAction({
  asChild = false,
  className,
  ref,
  ...props
}: SidebarGroupActionProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        'absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-5 [&>svg]:shrink-0',
        'after:absolute after:-inset-2 after:md:hidden',
        'group-data-[collapsible=icon]:hidden',
        className
      )}
      {...props}
    />
  )
}
SidebarGroupAction.displayName = 'SidebarGroupAction'

function SidebarGroupContent({ className, ref, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      data-sidebar="group-content"
      className={cn('w-full text-sm', className)}
      {...props}
    />
  )
}
SidebarGroupContent.displayName = 'SidebarGroupContent'

function SidebarMenu({ className, ref, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      ref={ref}
      data-sidebar="menu"
      className={cn('flex w-full min-w-0 p-0 m-0 flex-col gap-1 items-center', className)}
      {...props}
    />
  )
}
SidebarMenu.displayName = 'SidebarMenu'

function SidebarMenuItem({ className, ref, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      ref={ref}
      data-sidebar="menu-item"
      className={cn('group/menu-item flex relative w-full', className)}
      {...props}
    />
  )
}
SidebarMenuItem.displayName = 'SidebarMenuItem'

const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex flex-1 w-full items-center gap-2 text-inherit overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-active-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-active-accent-foreground [&_svg_path]:fill-current data-[state=open]:hover:bg-sidebar-accent whitespace-nowrap [&>svg]:size-5 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-sidebar-accent',
        outline:
          'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]'
      },
      size: {
        default: 'text-sm',
        sm: 'h-8 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:!m-0'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

interface SidebarMenuButtonProps
  extends React.ComponentProps<'button'>, VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | Record<string, unknown>
}

function SidebarMenuButton({
  asChild = false,
  className,
  isActive = false,
  size = 'default',
  tooltip,
  variant = 'default',
  ref,
  ...props
}: SidebarMenuButtonProps) {
  const Comp = asChild ? Slot : 'button'
  const { state } = useSidebar()

  const button = (
    <Comp
      ref={ref}
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  )

  if (!tooltip) return button
  const tooltipProps = typeof tooltip === 'string' ? { children: tooltip } : tooltip

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== 'collapsed'}
        {...tooltipProps}
      />
    </Tooltip>
  )
}
SidebarMenuButton.displayName = 'SidebarMenuButton'

interface SidebarMenuActionProps extends React.ComponentProps<'button'> {
  asChild?: boolean
  showOnHover?: boolean
}

function SidebarMenuAction({
  asChild = false,
  className,
  showOnHover = false,
  ref,
  ...props
}: SidebarMenuActionProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        'absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0',
        'after:absolute after:-inset-2 after:md:hidden',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        showOnHover && 'hidden group-hocus:flex',
        className
      )}
      {...props}
    />
  )
}
SidebarMenuAction.displayName = 'SidebarMenuAction'

function SidebarMenuBadge({ className, ref, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      ref={ref}
      data-sidebar="menu-badge"
      className={cn(
        'inline-flex h-5 items-center rounded-full bg-sidebar-accent px-2 py-0.5 text-xs font-medium text-sidebar-accent-foreground',
        className
      )}
      {...props}
    />
  )
}
SidebarMenuBadge.displayName = 'SidebarMenuBadge'

function SidebarMenuSub({ className, ref, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      ref={ref}
      data-sidebar="menu-sub"
      className={cn('flex flex-col gap-1 p-0', className)}
      {...props}
    />
  )
}
SidebarMenuSub.displayName = 'SidebarMenuSub'

function SidebarMenuSubItem({ className, ref, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      ref={ref}
      data-sidebar="menu-sub-item"
      className={cn('flex w-full', className)}
      {...props}
    />
  )
}
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem'

interface SidebarMenuSubButtonProps extends React.ComponentProps<'button'> {
  asChild?: boolean
  size?: 'sm' | 'md' | 'default'
  isActive?: boolean
}

function SidebarMenuSubButton({
  asChild = false,
  className,
  size = 'default',
  ref,
  ...props
}: SidebarMenuSubButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      className={cn(
        'flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 whitespace-nowrap [&>svg]:size-4 [&>svg]:shrink-0',
        className
      )}
      {...props}
    />
  )
}
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton'

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger
}
