import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-full font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:-translate-y-0.5 active:translate-y-0 shadow-sm';
  
  const variants = {
    primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-600 shadow-md hover:shadow-lg',
    secondary: 'bg-transparent text-gray-900 border-2 border-gray-900 hover:bg-gray-50 focus:ring-gray-900',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  const sizes = {
    sm: 'px-5 py-2 text-sm tracking-wide',
    md: 'px-7 py-3 text-sm tracking-wide',
    lg: 'px-8 py-3.5 text-base tracking-wide',
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  );
}
