import * as React from 'react';
import { SVGProps } from 'react';

function SvgHamburgerMenu(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M1 5h22M1 12h22M1 19h22"
      />
    </svg>
  );
}
export default SvgHamburgerMenu;
