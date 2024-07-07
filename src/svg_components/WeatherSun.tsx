import * as React from 'react';
import { SVGProps } from 'react';

function SvgWeatherSun(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 12 12" {...props}>
      <path
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 .5V1m0 10v.5M2.11 9.89l.354-.354m7.071-7.071.354-.354m-7.778 0 .353.353m7.071 7.071.354.354M.5 6H1m10 0h.5M9 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}
export default SvgWeatherSun;
