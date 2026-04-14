import Link, { type LinkProps } from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useSitePathname } from "@/contexts/SiteRouterContext";

type NavLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  Pick<LinkProps, "href"> & {
    activeClassName?: string;
    pendingClassName?: string;
  };

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, pendingClassName, href, ...props }, ref) => {
    const pathname = useSitePathname();
    const path = typeof href === "string" ? href : href.pathname ?? "";
    const isActive =
      path === "/"
        ? pathname === "/"
        : pathname === path || pathname.startsWith(`${path}/`);

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, isActive && activeClassName, pendingClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
