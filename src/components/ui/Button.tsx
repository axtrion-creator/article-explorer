import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({ children, style = {}, ...props }) => {
  return (
    <button
      style={{
        padding: '8px 16px',
        borderRadius: '4px',
        fontWeight: '500',
        transition: 'background-color 0.2s',
        cursor: 'pointer',
        border: 'none',
        ...style
      }}
      {...props}
    >
      {children}
    </button>
  );
};