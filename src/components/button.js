import React from 'react';

export const Button = ({ children, className, ...props }) => (
  <button className={`button ${className}`} {...props}>
    {children}
  </button>
);