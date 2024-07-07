import * as React from 'react';
import { SVGProps } from 'react';

function SvgActionsPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 16 16" {...props}>
      <path stroke={props.stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 2v12M2 8h12" />
    </svg>
  );
}
export default SvgActionsPlus;
