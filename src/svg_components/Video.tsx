import * as React from 'react';
import { SVGProps } from 'react';

function SvgVideo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke={props.stroke}
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 6v12m6.133-12H4.867C3.836 6 3 6.768 3 7.714v8.572C3 17.233 3.836 18 4.867 18h9.266C15.164 18 16 17.233 16 16.286V13.8l5 3.2V7l-5 3.2V7.714C16 6.768 15.164 6 14.133 6Z"
      />
    </svg>
  );
}
export default SvgVideo;
