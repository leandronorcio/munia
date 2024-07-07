import * as React from 'react';
import { SVGProps } from 'react';

function SvgTwoPeople(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        strokeWidth={2}
        d="M13 20v-2m0 2H1v-2a6 6 0 0 1 12 0m0 2h9v-.5a5.5 5.5 0 0 0-9.463-3.814A5.98 5.98 0 0 1 13 18M10 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm9 2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
      />
    </svg>
  );
}
export default SvgTwoPeople;
