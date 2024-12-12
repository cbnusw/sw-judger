import React from 'react';

export default function SmallLoading() {
  return (
    <svg
      viewBox="0 0 100 100"
      width="24"
      height="24"
      className="svg-loading-animation"
    >
      <circle
        fill="none"
        stroke="#579cf7"
        strokeWidth="9"
        strokeMiterlimit="10"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        cx="50"
        cy="50"
        r="28"
      ></circle>
      <circle
        fill="none"
        stroke="white"
        strokeWidth="9"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="miter"
        cx="50"
        cy="50"
        r="28"
        strokeDasharray="226.2"
        strokeDashoffset="190"
        className="circle-dash-animation"
      ></circle>
    </svg>
  );
}
