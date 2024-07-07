import * as React from 'react';
import { SVGProps } from 'react';

function SvgMoreVert(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill={props.fill} viewBox="0 0 24 24" {...props}>
      <path fill={props.fill} d="M14 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM14 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
    </svg>
  );
}
export default SvgMoreVert;
