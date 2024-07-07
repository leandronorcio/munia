import * as React from 'react';
import { SVGProps } from 'react';

function SvgMail(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 26 24" {...props}>
      <path
        stroke={props.stroke}
        strokeLinejoin="round"
        strokeWidth={2}
        d="M1 6a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6Z"
      />
      <path
        stroke={props.stroke}
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.421 5.303C1.917 4.84 2.244 4 2.928 4h20.144c.684 0 1.01.84.507 1.303l-8.552 7.839a3 3 0 0 1-4.054 0L2.42 5.302Z"
      />
    </svg>
  );
}
export default SvgMail;
