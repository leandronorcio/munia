import * as React from 'react';
import { SVGProps } from 'react';

function SvgWeatherMoon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 12 12" {...props}>
      <path
        stroke={props.stroke}
        d="M9.366 8.81c-2.918 0-5.284-2.41-5.284-5.382 0-.873.204-1.698.567-2.428C2.531 1.701 1 3.728 1 6.119 1 9.09 3.366 11.5 6.284 11.5c2.06 0 3.845-1.201 4.716-2.953a5.192 5.192 0 0 1-1.634.262Z"
      />
    </svg>
  );
}
export default SvgWeatherMoon;
