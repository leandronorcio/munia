import * as React from 'react';
import { SVGProps } from 'react';

function SvgPlay(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={props.strokeWidth || 2}
        d="M5 5.655a1.5 1.5 0 0 1 2.274-1.284l10.528 6.344a1.5 1.5 0 0 1 0 2.57L7.274 19.629A1.5 1.5 0 0 1 5 18.345V5.655Z"
      />
    </svg>
  );
}
export default SvgPlay;
