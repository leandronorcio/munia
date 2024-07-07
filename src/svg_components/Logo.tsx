import * as React from 'react';
import { SVGProps } from 'react';

function SvgLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 88 87" {...props}>
      <g filter="url(#logo_svg__a)">
        <path
          stroke="url(#logo_svg__b)"
          strokeWidth={2}
          d="M36.623 48.152h29.51M5.004 77.58l50.588-47.086m-37.94 7.848 29.509-27.467c8.149-7.585 21.36-7.585 29.51 0 8.149 7.585 8.149 19.882 0 27.467l-29.51 27.467-27.402-1.962-2.108-25.505Z"
        />
      </g>
      <defs>
        <linearGradient id="logo_svg__b" x1={5.005} x2={84.478} y1={27.267} y2={34.851} gradientUnits="userSpaceOnUse">
          <stop stopColor="#AE5388" />
          <stop offset={1} stopColor="#3D1052" />
        </linearGradient>
        <filter
          id="logo_svg__a"
          width={94}
          height={88.046}
          x={-3}
          y={0.477}
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse">
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feOffset dy={4} />
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_6871_34055" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_6871_34055" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}
export default SvgLogo;
