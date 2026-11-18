/**
 * WhatsApp mark.
 * `solid` = white bubble + dark phone for green FAB (never looks hollow).
 * default = single currentColor path for tinted UI.
 */
export function WhatsAppIcon({
  className = "size-7",
  title,
  solid = false,
}: {
  className?: string;
  title?: string;
  solid?: boolean;
}) {
  if (solid) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        aria-hidden={title ? undefined : true}
        role={title ? "img" : undefined}
      >
        {title ? <title>{title}</title> : null}
        <path
          fill="#ffffff"
          d="M12 2.2C6.7 2.2 2.4 6.4 2.4 11.6c0 1.9.6 3.7 1.6 5.2L2 22l5.4-1.4c1.4.8 3 .12 4.6.12 5.3 0 9.6-4.2 9.6-9.4S17.3 2.2 12 2.2z"
        />
        <path
          fill="#075E54"
          d="M16.2 14.9c-.2.6-1.2 1.1-1.7 1.2-.5.1-1.1.1-1.7-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.5-4-.1-.2-1.1-1.4-1.1-2.7 0-1.3.7-1.9.9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.1.1.3 0 .4l-.3.5c-.1.1-.3.3-.4.5-.1.1-.3.3-.1.5.2.2.7 1.1 1.4 1.7.9.9 1.7 1.1 2 1.2.3.1.4.1.5-.1.2-.2.6-.7.8-1 .2-.2.3-.2.6-.1.2.1 1.4.7 1.6.8.3.1.4.2.5.3.1.1.1.6-.2 1.2z"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path d="M12.04 2C6.7 2 2.4 6.2 2.4 11.4c0 1.9.6 3.6 1.6 5.1L2 21.8l5.3-1.4c1.4.8 3.1 1.2 4.7 1.2h.1c5.2 0 9.5-4.2 9.5-9.4C21.6 6.2 17.3 2 12.04 2zm5.5 13.4c-.2.6-1.3 1.1-1.8 1.2-.5.1-1.1.1-1.7-.1-.4-.1-.9-.3-1.5-.5-2.7-1.2-4.5-3.9-4.6-4.1-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.1.1.3 0 .4l-.2.4c-.1.2-.3.3-.4.5-.1.1-.3.3-.1.5.1.2.7 1.1 1.4 1.7.9.8 1.7 1.1 2 1.2.2.1.4.1.5-.1.1-.2.6-.7.8-.9.2-.3.3-.2.6-.1l1.6.8c.2.1.4.2.4.3.1.1.1.6-.2 1.2z" />
    </svg>
  );
}
