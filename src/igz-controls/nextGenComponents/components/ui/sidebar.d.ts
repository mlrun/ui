import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
interface SidebarContextValue {
    state: 'expanded' | 'collapsed';
    open: boolean;
    setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
    toggleSidebar: () => void;
    pinned: boolean;
    togglePin: () => void;
    hoverLocked: boolean;
    setHoverLocked: (locked: boolean) => void;
}
declare const useSidebar: () => SidebarContextValue;
interface SidebarProviderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
}
declare const SidebarProvider: React.ForwardRefExoticComponent<SidebarProviderProps & React.RefAttributes<HTMLDivElement>>;
interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    side?: 'left' | 'right';
    variant?: 'sidebar' | 'floating' | 'inset';
    collapsible?: 'offcanvas' | 'icon' | 'none';
}
declare const Sidebar: React.ForwardRefExoticComponent<SidebarProps & React.RefAttributes<HTMLElement>>;
interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: 'menu' | 'chevronLeft' | 'chevronRight';
}
declare const SidebarTrigger: React.ForwardRefExoticComponent<SidebarTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const SidebarRail: React.ForwardRefExoticComponent<React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>>;
declare const SidebarInset: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>>;
declare const SidebarInput: React.ForwardRefExoticComponent<Omit<Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref"> & React.RefAttributes<HTMLInputElement>, "ref"> & React.RefAttributes<HTMLInputElement>>;
declare const SidebarHeader: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
declare const SidebarFooter: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
declare const SidebarSeparator: React.ForwardRefExoticComponent<Omit<import("@radix-ui/react-separator").SeparatorProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const SidebarContent: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
declare const SidebarGroup: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
}
declare const SidebarGroupLabel: React.ForwardRefExoticComponent<SidebarGroupLabelProps & React.RefAttributes<HTMLDivElement>>;
interface SidebarGroupActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}
declare const SidebarGroupAction: React.ForwardRefExoticComponent<SidebarGroupActionProps & React.RefAttributes<HTMLButtonElement>>;
declare const SidebarGroupContent: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
declare const SidebarMenu: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLUListElement> & React.RefAttributes<HTMLUListElement>>;
declare const SidebarMenuItem: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLLIElement> & React.RefAttributes<HTMLLIElement>>;
declare const sidebarMenuButtonVariants: (props?: ({
    variant?: "default" | "outline" | null | undefined;
    size?: "sm" | "lg" | "default" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof sidebarMenuButtonVariants> {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | Record<string, unknown>;
}
declare const SidebarMenuButton: React.ForwardRefExoticComponent<SidebarMenuButtonProps & React.RefAttributes<HTMLButtonElement>>;
interface SidebarMenuActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    showOnHover?: boolean;
}
declare const SidebarMenuAction: React.ForwardRefExoticComponent<SidebarMenuActionProps & React.RefAttributes<HTMLButtonElement>>;
declare const SidebarMenuBadge: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLSpanElement> & React.RefAttributes<HTMLSpanElement>>;
declare const SidebarMenuSub: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLUListElement> & React.RefAttributes<HTMLUListElement>>;
declare const SidebarMenuSubItem: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLLIElement> & React.RefAttributes<HTMLLIElement>>;
interface SidebarMenuSubButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    size?: 'sm' | 'md' | 'default';
    isActive?: boolean;
}
declare const SidebarMenuSubButton: React.ForwardRefExoticComponent<SidebarMenuSubButtonProps & React.RefAttributes<HTMLButtonElement>>;
export { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger, useSidebar };
//# sourceMappingURL=sidebar.d.ts.map