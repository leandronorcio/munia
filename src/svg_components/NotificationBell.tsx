import * as React from 'react';
import { SVGProps } from 'react';

function SvgNotificationBell(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 26 24" {...props}>
      <path
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.333 9.014c0-1.86-.772-3.644-2.147-4.96C16.81 2.74 14.945 2 13 2c-1.945 0-3.81.739-5.185 2.054-1.376 1.316-2.148 3.1-2.148 4.96 0 5.934-2.454 8.795-3.803 9.92-.203.168-.07.602.193.602h6.465c.117 0 .219.08.253.191C9 20.453 10 23 13 23c3.001 0 4-2.547 4.225-3.273a.267.267 0 0 1 .253-.19h6.465c.264 0 .395-.435.193-.604-1.349-1.124-3.803-3.985-3.803-9.919Z"
      />
    </svg>
  );
}
export default SvgNotificationBell;
