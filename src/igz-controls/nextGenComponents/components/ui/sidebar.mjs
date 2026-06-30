import { jsx as i, jsxs as _ } from "react/jsx-runtime";
import * as r from "react";
import { Slot as N } from "@radix-ui/react-slot";
import { cva as T } from "class-variance-authority";
import { MenuIcon as k, ChevronLeftIcon as E, ChevronRightIcon as A } from "lucide-react";
import { cn as o } from "../../lib/utils";
import { Button as C } from "./button";
import { Input as B } from "./input";
import { Separator as O } from "./separator";
import { TooltipProvider as P, Tooltip as D, TooltipTrigger as L, TooltipContent as G } from "./tooltip";
import H from "../../../images/navbar-closed-icon.svg.mjs";
import K from "../../../images/navbar-opened-icon.svg.mjs";
const F = "sidebar_state", j = 3600 * 24 * 7, V = "15rem", $ = "70px", q = "b", M = r.createContext(null), y = () => {
  const e = r.useContext(M);
  if (!e)
    throw new Error("useSidebar must be used within a SidebarProvider.");
  return e;
}, J = r.forwardRef(
  ({ children: e, className: a, defaultOpen: t = !0, onOpenChange: s, open: n, style: c, ...m }, w) => {
    const [g, v] = r.useState(() => {
      try {
        return JSON.parse(localStorage.getItem("isNavbarPinned") || "false");
      } catch {
        return !1;
      }
    }), [p, d] = r.useState(!1), [S, R] = r.useState(t || g), u = n ?? S, b = r.useCallback(
      (f) => {
        const l = typeof f == "function" ? f(u) : f;
        s ? s(l) : R(l), document.cookie = `${F}=${l}; path=/; max-age=${j}`;
      },
      [s, u]
    ), h = r.useCallback(() => b((f) => !f), [b]), x = r.useCallback(() => {
      v((f) => {
        const l = !f;
        return localStorage.setItem("isNavbarPinned", JSON.stringify(l)), b(l), l;
      });
    }, [b]);
    r.useEffect(() => {
      const f = (l) => {
        l.key === q && (l.metaKey || l.ctrlKey) && (l.preventDefault(), h());
      };
      return window.addEventListener("keydown", f), () => window.removeEventListener("keydown", f);
    }, [h]);
    const I = u ? "expanded" : "collapsed", z = r.useMemo(
      () => ({
        state: I,
        open: u,
        setOpen: b,
        toggleSidebar: h,
        pinned: g,
        togglePin: x,
        hoverLocked: p,
        setHoverLocked: d
      }),
      [I, u, b, h, g, x, p]
    );
    return /* @__PURE__ */ i(M.Provider, { value: z, children: /* @__PURE__ */ i(P, { delayDuration: 0, children: /* @__PURE__ */ i(
      "div",
      {
        style: {
          "--sidebar-width": V,
          "--sidebar-width-icon": $,
          ...c
        },
        className: o(
          "group/sidebar-wrapper flex h-full w-full has-[[data-variant=inset]]:bg-sidebar",
          a
        ),
        ref: w,
        ...m,
        children: e
      }
    ) }) });
  }
);
J.displayName = "SidebarProvider";
const U = r.forwardRef(
  ({
    children: e,
    className: a,
    collapsible: t = "offcanvas",
    side: s = "left",
    variant: n = "sidebar",
    ...c
  }, m) => {
    const [w, g] = r.useState(!1), { hoverLocked: v, open: p, pinned: d, state: S, togglePin: R, setOpen: u } = y(), b = r.useRef(null), h = r.useRef(null);
    return r.useEffect(() => {
      if (!v && !w && !d)
        return h.current = setTimeout(() => u(!1), 200), () => clearTimeout(h.current);
    }, [v, w, d, u]), t === "none" ? /* @__PURE__ */ i(
      "nav",
      {
        className: o(
          "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
          a
        ),
        ref: m,
        ...c,
        children: e
      }
    ) : /* @__PURE__ */ i(
      "nav",
      {
        ref: m,
        className: o(
          "group peer relative shrink-0 self-stretch overflow-visible text-sidebar-foreground",
          "transition-[width] duration-300 ease-linear",
          d && p ? "w-[--sidebar-width]" : "w-[--sidebar-width-icon]"
        ),
        "data-state": S,
        "data-collapsible": S === "collapsed" ? t : "",
        "data-variant": n,
        "data-side": s,
        "data-pinned": d,
        onMouseEnter: () => {
          clearTimeout(h.current), clearTimeout(b.current), g(!0), d || (b.current = setTimeout(() => u(!0), 100));
        },
        onMouseLeave: () => {
          clearTimeout(b.current), g(!1), !d && !v && u(!1);
        },
        onTransitionEnd: (x) => {
          x.target === x.currentTarget && x.propertyName === "width" && window.dispatchEvent(new CustomEvent("mainResize"));
        },
        children: /* @__PURE__ */ i(
          "div",
          {
            className: o(
              "absolute inset-y-0 left-0 z-20 flex flex-col transition-[width] duration-300 ease-linear md:flex",
              s === "left" && d && "group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]",
              s === "right" && d && "group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
              n === "floating" || n === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : o(
                "group-data-[side=left]:border-r group-data-[side=right]:border-l",
                p && !d || d && S === "expanded" ? "w-[--sidebar-width]" : "w-[--sidebar-width-icon]"
              ),
              a
            ),
            ...c,
            children: /* @__PURE__ */ _(
              "div",
              {
                "data-sidebar": "sidebar",
                className: "flex size-full flex-col bg-sidebar shadow-[1px_4px_16px_rgba(0,0,0,0.04)] group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
                children: [
                  e,
                  p && /* @__PURE__ */ i(
                    C,
                    {
                      variant: "outline",
                      tooltip: d ? "Unpin sidebar" : "Pin sidebar",
                      "data-testid": "pin-sidebar-button",
                      side: "right",
                      className: o(
                        "absolute top-2 left-full border bg-[#FAFAFA] border-gray-200 border-solid",
                        "w-fit h-fit rounded-l-none border-l-0 py-2 pr-[3px] pl-[1px]",
                        "transition-opacity hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        d ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      ),
                      onClick: R,
                      children: d ? /* @__PURE__ */ i(H, { "data-testid": "closeed-pin" }) : /* @__PURE__ */ i(K, { "data-testid": "opened-pin" })
                    }
                  )
                ]
              }
            )
          }
        )
      }
    );
  }
);
U.displayName = "Sidebar";
const W = r.forwardRef(
  ({ className: e, icon: a = "menu", onClick: t, ...s }, n) => {
    const { toggleSidebar: c } = y();
    return /* @__PURE__ */ _(
      C,
      {
        ref: n,
        "data-sidebar": "trigger",
        variant: "ghost",
        size: "icon",
        className: o("size-9", e),
        onClick: (m) => {
          t == null || t(m), c();
        },
        ...s,
        children: [
          a === "menu" && /* @__PURE__ */ i(k, { className: "size-4 shrink-0" }),
          a === "chevronLeft" && /* @__PURE__ */ i(E, { className: "size-4 shrink-0" }),
          a === "chevronRight" && /* @__PURE__ */ i(A, { className: "size-4 shrink-0" }),
          /* @__PURE__ */ i("span", { className: "sr-only", children: "Toggle Sidebar" })
        ]
      }
    );
  }
);
W.displayName = "SidebarTrigger";
const X = r.forwardRef(({ className: e, ...a }, t) => {
  const { toggleSidebar: s } = y();
  return /* @__PURE__ */ i(
    "button",
    {
      ref: t,
      "data-sidebar": "rail",
      "aria-label": "Toggle Sidebar",
      tabIndex: -1,
      onClick: s,
      title: "Toggle Sidebar",
      className: o(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        e
      ),
      ...a
    }
  );
});
X.displayName = "SidebarRail";
const Y = r.forwardRef(
  ({ className: e, ...a }, t) => /* @__PURE__ */ i(
    "main",
    {
      ref: t,
      className: o(
        "relative flex min-h-0 flex-1 flex-col bg-background transition-[width] duration-300 ease-linear",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        e
      ),
      ...a
    }
  )
);
Y.displayName = "SidebarInset";
const Q = r.forwardRef(
  ({ className: e, ...a }, t) => /* @__PURE__ */ i(
    B,
    {
      ref: t,
      "data-sidebar": "input",
      className: o(
        "h-9 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        e
      ),
      ...a
    }
  )
);
Q.displayName = "SidebarInput";
const Z = r.forwardRef(
  ({ className: e, ...a }, t) => /* @__PURE__ */ i(
    "div",
    {
      ref: t,
      "data-sidebar": "header",
      className: o("flex gap-2 py-3.5", e),
      ...a
    }
  )
);
Z.displayName = "SidebarHeader";
const ee = r.forwardRef(
  ({ className: e, ...a }, t) => /* @__PURE__ */ i(
    "div",
    {
      ref: t,
      "data-sidebar": "footer",
      className: o("flex flex-col gap-2 p-3", e),
      ...a
    }
  )
);
ee.displayName = "SidebarFooter";
const ae = r.forwardRef(({ className: e, ...a }, t) => /* @__PURE__ */ i(
  O,
  {
    ref: t,
    "data-sidebar": "separator",
    className: o("mx-5 mb-2 w-auto bg-sidebar-border", e),
    ...a
  }
));
ae.displayName = "SidebarSeparator";
const te = r.forwardRef(
  ({ className: e, ...a }, t) => /* @__PURE__ */ i(
    "div",
    {
      ref: t,
      "data-sidebar": "content",
      className: o(
        "flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        e
      ),
      ...a
    }
  )
);
te.displayName = "SidebarContent";
const re = r.forwardRef(
  ({ className: e, ...a }, t) => /* @__PURE__ */ i(
    "div",
    {
      ref: t,
      "data-sidebar": "group",
      className: o("relative flex w-full min-w-0 flex-col p-3", e),
      ...a
    }
  )
);
re.displayName = "SidebarGroup";
const ie = r.forwardRef(
  ({ asChild: e = !1, className: a, ...t }, s) => /* @__PURE__ */ i(
    e ? N : "div",
    {
      ref: s,
      "data-sidebar": "group-label",
      className: o(
        "flex h-9 shrink-0 items-center rounded-md px-2.5 text-sm font-medium outline-none whitespace-nowrap ring-sidebar-ring focus-visible:ring-2 [&>svg]:size-5 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        a
      ),
      ...t
    }
  )
);
ie.displayName = "SidebarGroupLabel";
const oe = r.forwardRef(
  ({ asChild: e = !1, className: a, ...t }, s) => /* @__PURE__ */ i(
    e ? N : "button",
    {
      ref: s,
      "data-sidebar": "group-action",
      className: o(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-5 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        a
      ),
      ...t
    }
  )
);
oe.displayName = "SidebarGroupAction";
const se = r.forwardRef(
  ({ className: e, ...a }, t) => /* @__PURE__ */ i(
    "div",
    {
      ref: t,
      "data-sidebar": "group-content",
      className: o("w-full text-sm", e),
      ...a
    }
  )
);
se.displayName = "SidebarGroupContent";
const ne = r.forwardRef(
  ({ className: e, ...a }, t) => /* @__PURE__ */ i(
    "ul",
    {
      ref: t,
      "data-sidebar": "menu",
      className: o("flex w-full min-w-0 p-0 m-0 flex-col gap-1 items-center", e),
      ...a
    }
  )
);
ne.displayName = "SidebarMenu";
const de = r.forwardRef(
  ({ className: e, ...a }, t) => /* @__PURE__ */ i(
    "li",
    {
      ref: t,
      "data-sidebar": "menu-item",
      className: o("group/menu-item flex relative w-full", e),
      ...a
    }
  )
);
de.displayName = "SidebarMenuItem";
const le = T(
  "peer/menu-button flex flex-1 w-full items-center gap-2 text-inherit overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-active-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-active-accent-foreground [&_svg_path]:fill-current data-[state=open]:hover:bg-sidebar-accent whitespace-nowrap [&>svg]:size-5 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent",
        outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
      },
      size: {
        default: "text-sm",
        sm: "h-8 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!m-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
), ce = r.forwardRef(
  ({
    asChild: e = !1,
    className: a,
    isActive: t = !1,
    size: s = "default",
    tooltip: n,
    variant: c = "default",
    ...m
  }, w) => {
    const g = e ? N : "button", { state: v } = y(), p = /* @__PURE__ */ i(
      g,
      {
        ref: w,
        "data-sidebar": "menu-button",
        "data-size": s,
        "data-active": t,
        className: o(le({ variant: c, size: s }), a),
        ...m
      }
    );
    return n ? /* @__PURE__ */ _(D, { children: [
      /* @__PURE__ */ i(L, { asChild: !0, children: p }),
      /* @__PURE__ */ i(
        G,
        {
          side: "right",
          align: "center",
          hidden: v !== "collapsed",
          ...typeof n == "string" ? { children: n } : n
        }
      )
    ] }) : p;
  }
);
ce.displayName = "SidebarMenuButton";
const ue = r.forwardRef(
  ({ asChild: e = !1, className: a, showOnHover: t = !1, ...s }, n) => /* @__PURE__ */ i(
    e ? N : "button",
    {
      ref: n,
      "data-sidebar": "menu-action",
      className: o(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        t && "hidden group-hocus:flex",
        a
      ),
      ...s
    }
  )
);
ue.displayName = "SidebarMenuAction";
const be = r.forwardRef(
  ({ className: e, ...a }, t) => /* @__PURE__ */ i(
    "span",
    {
      ref: t,
      "data-sidebar": "menu-badge",
      className: o(
        "inline-flex h-5 items-center rounded-full bg-sidebar-accent px-2 py-0.5 text-xs font-medium text-sidebar-accent-foreground",
        e
      ),
      ...a
    }
  )
);
be.displayName = "SidebarMenuBadge";
const fe = r.forwardRef(
  ({ className: e, ...a }, t) => /* @__PURE__ */ i(
    "ul",
    {
      ref: t,
      "data-sidebar": "menu-sub",
      className: o("flex flex-col gap-1 p-0", e),
      ...a
    }
  )
);
fe.displayName = "SidebarMenuSub";
const pe = r.forwardRef(
  ({ className: e, ...a }, t) => /* @__PURE__ */ i(
    "li",
    {
      ref: t,
      "data-sidebar": "menu-sub-item",
      className: o("flex w-full", e),
      ...a
    }
  )
);
pe.displayName = "SidebarMenuSubItem";
const me = r.forwardRef(
  ({ asChild: e = !1, className: a, size: t = "default", ...s }, n) => /* @__PURE__ */ i(
    e ? N : "button",
    {
      ref: n,
      "data-sidebar": "menu-sub-button",
      "data-size": t,
      className: o(
        "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 whitespace-nowrap [&>svg]:size-4 [&>svg]:shrink-0",
        a
      ),
      ...s
    }
  )
);
me.displayName = "SidebarMenuSubButton";
export {
  U as Sidebar,
  te as SidebarContent,
  ee as SidebarFooter,
  re as SidebarGroup,
  oe as SidebarGroupAction,
  se as SidebarGroupContent,
  ie as SidebarGroupLabel,
  Z as SidebarHeader,
  Q as SidebarInput,
  Y as SidebarInset,
  ne as SidebarMenu,
  ue as SidebarMenuAction,
  be as SidebarMenuBadge,
  ce as SidebarMenuButton,
  de as SidebarMenuItem,
  fe as SidebarMenuSub,
  me as SidebarMenuSubButton,
  pe as SidebarMenuSubItem,
  J as SidebarProvider,
  X as SidebarRail,
  ae as SidebarSeparator,
  W as SidebarTrigger,
  y as useSidebar
};
