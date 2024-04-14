import { SVGProps } from "react"

export const CircleRightArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    stroke="currentColor"
    color="#000"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m13 9 3 3m0 0-3 3m3-3H8m13 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
    />
  </svg>
)
