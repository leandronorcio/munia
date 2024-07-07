import * as React from 'react';
import { SVGProps } from 'react';

function SvgEmojiHappySmile(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <g clipPath="url(#emoji-happy-smile_svg__a)">
        <path
          stroke={props.stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 15s1.714 1.5 4 1.5 4-1.5 4-1.5m7-3c0 6.075-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1s11 4.925 11 11Zm-7-3c0 .552-.224 1-.5 1s-.5-.448-.5-1 .224-1 .5-1 .5.448.5 1ZM9 9c0 .552-.224 1-.5 1S8 9.552 8 9s.224-1 .5-1 .5.448.5 1Z"
        />
      </g>
      <defs>
        <clipPath id="emoji-happy-smile_svg__a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
export default SvgEmojiHappySmile;
