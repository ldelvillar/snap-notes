import { SVGProps } from "react";

export default function Menu(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...props}>
      {" "}
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 12h16M4 6h16M4 18h16"
      ></path>{" "}
    </svg>
  );
}
