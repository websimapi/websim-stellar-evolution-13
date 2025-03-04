// ImageModal.js - Modal for displaying generated images
export const ImageModal = ({ imageUrl, onClose }) => {
  // Close modal on ESC key press
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <img 
          src={imageUrl} 
          alt="Stellar scene" 
          style={{ width: '100%', borderRadius: '4px' }} 
        />
      </div>
    </div>
  );
};

