import { SVGProps } from "react";

const LogoutIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={22}
    height={22}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M7 11H21.0001M21.0001 11L17.0001 7M21.0001 11L17.0001 15M7 21V21C10.3137 21 13 18.3137 13 15V7C13 3.68629 10.3137 1 7 1V1C3.68629 1 1 3.68629 1 7V15C1 18.3137 3.68629 21 7 21Z"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LogoutIcon;
