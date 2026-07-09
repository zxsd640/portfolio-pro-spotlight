/**
 * Custom Arabic language mark: green square with white "ع".
 * Used instead of a country flag emoji so Arabic is language-branded, not country-branded.
 */
export function ArabicFlag({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-grid place-items-center rounded-[4px] font-bold leading-none text-white shadow-[0_1px_2px_rgba(0,0,0,0.35)] ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: "#16a34a",
        fontFamily: '"Cairo", "Tajawal", system-ui, sans-serif',
        fontSize: Math.round(size * 0.72),
        lineHeight: 1,
      }}
    >
      ع
    </span>
  );
}
