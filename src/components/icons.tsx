import type { SVGProps } from "react";

export function LeafIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c-2.8 2.3-6.4 4.1-9.5 5.5C6 8.5 4 10.5 4 13a4.5 4.5 0 0 0 4.5 4.5c2.22 0 4-1.22 4.5-2.5.46-1.27.2-2.5-1-3.5" />
      <path d="M11 20a7 7 0 0 1 9.8-13.9c-2.4 2.4-5.2 4-8.5 5.5" />
    </svg>
  );
}
