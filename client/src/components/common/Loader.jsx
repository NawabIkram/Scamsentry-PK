import React from 'react';

/**
 * Modern cyber-style loading spinner
 * @param {string} size - 'small', 'medium', or 'large'
 */
const Loader = ({ size = 'medium' }) => {
  const sizes = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} rounded-full border-t-cyber-accent border-r-transparent border-b-cyber-accent border-l-transparent animate-spin`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
