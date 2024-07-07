import * as React from 'react';
import { SVGProps } from 'react';

function SvgMore(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path fill={props.fill} d="M7 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM17 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
    </svg>
  );
}
export default SvgMore;
