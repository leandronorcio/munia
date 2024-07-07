import * as React from 'react';
import { SVGProps } from 'react';

function SvgGoogle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M16.844 6.549a6.521 6.521 0 0 0-4.604-1.8c-3.13 0-5.79 2.113-6.737 4.957a7.188 7.188 0 0 0 0 4.594h.004c.953 2.84 3.607 4.952 6.738 4.952 1.616 0 3.003-.413 4.078-1.143v-.003a5.555 5.555 0 0 0 2.399-3.647H12.24V9.84H23.56c.141.802.207 1.622.207 2.437 0 3.65-1.304 6.736-3.574 8.826l.003.002C18.206 22.938 15.477 24 12.24 24a12.002 12.002 0 0 1-10.723-6.61 12.01 12.01 0 0 1 0-10.776A11.998 11.998 0 0 1 12.24 0a11.533 11.533 0 0 1 8.03 3.122l-3.426 3.426Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
export default SvgGoogle;
