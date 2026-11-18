/**
 * WhatsApp chat glyph for use ON a green circle (bubble + phone only).
 * Avoids the brand mark’s outer ring, which looks hollow on a round FAB.
 */
export function WhatsAppIcon({
  className = "size-7",
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.89.52 3.66 1.44 5.19L2 22l5.05-1.32a9.86 9.86 0 004.99 1.27h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.79 14.05c-.24.68-1.4 1.25-1.93 1.33-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.82-4.21-4.97-4.4-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36h.56c.18 0 .42-.07.65.5.24.58.81 2 .88 2.14.07.14.12.3.02.49-.1.2-.14.32-.29.49-.14.17-.31.38-.44.51-.14.14-.29.29-.12.56.16.27.72 1.19 1.55 1.93 1.07.95 1.97 1.25 2.25 1.39.27.14.43.12.59-.07.16-.2.68-.79.86-1.06.18-.27.36-.22.61-.13.24.09 1.55.73 1.82.86.27.14.45.2.52.31.06.12.06.67-.18 1.35z" />
    </svg>
  );
}
