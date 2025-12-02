import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

export default function Modal({ open, onClose, children, className = '' }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;
  const root = document.getElementById('modal-root') || document.body;

  return ReactDOM.createPortal(
    <div className={`modal-overlay ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div role="dialog" aria-modal="true" className={`modal-wrapper ${className}`}>
        <div className={`modal-card ${open ? 'focused' : ''}`}>
          <button className="modal-close" aria-label="Cerrar" onClick={onClose}>✕</button>
          {children}
        </div>
      </div>
    </div>,
    root
  );
}
