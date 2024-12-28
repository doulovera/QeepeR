import type { SVGProps } from 'react'

export const CircleLeftArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    stroke="currentColor"
    color="#000"
    viewBox="0 0 24 24"
    {...props}
  >
    <title>Circle Left arrow</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m11 15-3-3m0 0 3-3m-3 3h8M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0z"
    />
  </svg>
)
