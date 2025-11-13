import { SVGProps } from 'react';

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 48 48"
      {...props}
    >
      <path
        fill="currentColor"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M32.272 12.416L39.188 5.5H9.5a4 4 0 0 0-4 4v29a4 4 0 0 0 4 4h29a4 4 0 0 0 4-4V15.834l-3.405 3.406m-6.823-6.824l6.823 6.824l-11.803 11.803l-10.264 3.44l3.44-10.263z"
      ></path>
    </svg>
  );
}
