import * as React from 'react';
import { SVGProps } from 'react';

function SvgForwardArrow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 25 24" {...props}>
      <path
        fill="#FCFCFC"
        d="M15.504 4.308a1 1 0 0 0-1.443 1.384l1.443-1.384ZM21.5 12l.721.692a1 1 0 0 0 0-1.384L21.5 12Zm-7.439 6.308a1 1 0 1 0 1.443 1.384l-1.443-1.384Zm6.172-5.276a1 1 0 1 0 0-2v2Zm-15.733-2a1 1 0 0 0 0 2v-2Zm9.561-5.34 6.717 7 1.443-1.384-6.717-7-1.443 1.384Zm6.717 5.616-6.717 7 1.443 1.384 6.717-7-1.443-1.384Zm-.545-.276H4.5v2h15.733v-2Z"
      />
    </svg>
  );
}
export default SvgForwardArrow;
