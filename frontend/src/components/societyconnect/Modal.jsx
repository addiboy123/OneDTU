import React from 'react';

export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-lg p-4">
        <div className="bg-black/80 border border-blue-900 rounded-xl p-2">{children}</div>
      </div>
    </div>
  );
}
