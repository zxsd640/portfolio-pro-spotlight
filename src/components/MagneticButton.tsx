import { useRef, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";

/** Primary CTA that gently pulls toward the cursor. */
export function MagneticLink({
  children,
  strength = 18,
  className = "",
  ...rest
}: React.ComponentProps<"a"> & {
  to?: string;
  search?: Record<string, unknown>;
  params?: Record<string, unknown>;
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * strength;
    const y = ((e.clientY - r.top) / r.height - 0.5) * strength;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.03)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate3d(0,0,0) scale(1)";
  };

  const LinkAny = Link as unknown as React.ComponentType<Record<string, unknown>>;

  return (
    <LinkAny
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-flex will-change-transform transition-transform duration-200 ease-out ${className}`}
      {...rest}
    >
      {children}
    </LinkAny>
  );
}


