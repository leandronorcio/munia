import * as React from 'react';
import { SVGProps } from 'react';

function SvgLoading(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 12 12" {...props}>
      <path stroke={props.stroke} strokeLinecap="round" strokeLinejoin="round" d="M6 1a5 5 0 1 0 5 5" />
    </svg>
  );
}
export default SvgLoading;
