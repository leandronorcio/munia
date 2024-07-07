import * as React from 'react';
import { SVGProps } from 'react';

function SvgEdit(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 25" {...props}>
      <path
        stroke={props.stroke}
        strokeWidth={props.strokeWidth || 2}
        d="m14.267 4.532 5.387 5.387M17 1.8s2.473-1.126 4.628 1.03c2.155 2.154 1.029 4.628 1.029 4.628l-14.4 14.399-6.428.771L2.6 16.2 16.999 1.8Z"
      />
    </svg>
  );
}
export default SvgEdit;
