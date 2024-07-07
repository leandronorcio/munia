import * as React from 'react';
import { SVGProps } from 'react';

function SvgOther(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke={props.stroke}
        strokeWidth={1.5}
        d="M12 24v-8m0 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-4 4h8m7-19-8 8m8-8h-6m6 0v6M1 1l8 8M1 1h6M1 1v6m7-3L4 8"
      />
    </svg>
  );
}
export default SvgOther;
