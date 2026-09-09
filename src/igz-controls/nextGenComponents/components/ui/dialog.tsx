import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as React from 'react'

import Close from '../../../images/close.svg?react'
import { Button } from './button'
import { cn } from '../../lib/utils'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

function DialogOverlay({
  className,
  children,
  ref,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      data-testid="dialog-overlay"
      className={cn(
        'fixed flex items-center justify-center inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Overlay>
  )
}
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

function DialogContent({
  className,
  children,
  showCloseButton = true,
  closeOnOutsideClick = false,
  onPointerDownOutside,
  onInteractOutside,
  ref,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
  closeOnOutsideClick?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay>
        <DialogPrimitive.Content
          aria-describedby={undefined}
          ref={ref}
          data-testid="dialog-content"
          className={cn(
            'relative flex flex-col z-50 gap-4 border bg-background p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-lg max-h-[90vh]',
            className
          )}
          {...props}
          onPointerDownOutside={event => {
            onPointerDownOutside?.(event)
            if (!closeOnOutsideClick) event.preventDefault()
          }}
          onInteractOutside={event => {
            onInteractOutside?.(event)
            if (!closeOnOutsideClick) event.preventDefault()
          }}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close asChild data-slot="dialog-close">
              <Button
                variant="rounded"
                size="icon"
                className="absolute top-3.5 right-3"
                aria-label="Close"
                tooltip="Close"
                data-testid="dialog-close-button"
              >
                <Close className="w-6 h-6" />
              </Button>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  )
}
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-testid="dialog-header"
    className={cn(
      'flex flex-col items-start relative space-y-1.5 border-b border-igz-gray-light px-6 py-4',
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-testid="dialog-body"
    className={cn('px-6 my-4 flex-1 flex flex-col gap-4 overflow-hidden', className)}
    {...props}
  />
)
DialogBody.displayName = 'DialogBody'

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-testid="dialog-footer"
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 px-6 pb-3',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

function DialogTitle({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      data-testid="dialog-title"
      className={cn(
        'font-roboto text-xl font-semibold leading-none tracking-tight text-igz-primary',
        className
      )}
      {...props}
    />
  )
}
DialogTitle.displayName = DialogPrimitive.Title.displayName

function DialogDescription({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      data-testid="dialog-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription
}
