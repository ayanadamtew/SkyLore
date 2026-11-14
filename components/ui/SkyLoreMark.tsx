import type { SVGProps } from "react";

export function SkyLoreMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  const classes = ["skylore-mark", className].filter(Boolean).join(" ");

  return (
    <svg
      className={classes}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        className="skylore-mark-moon"
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
      />
      <path
        className="skylore-mark-star"
        d="m18.5 1.9.68 1.72 1.72.68-1.72.68-.68 1.72-.68-1.72-1.72-.68 1.72-.68.68-1.72Z"
      />
    </svg>
  );
}
