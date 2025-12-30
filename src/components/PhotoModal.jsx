import React, { useEffect } from 'react'
import './PhotoModal.css'

function PhotoModal({ photo, onClose, onPrev, onNext, hasPrev, hasNext }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const handleArrowKeys = (e) => {
      if (e.key === 'ArrowLeft' && hasPrev) {
        onPrev()
      } else if (e.key === 'ArrowRight' && hasNext) {
        onNext()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', handleArrowKeys)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleArrowKeys)
      document.body.style.overflow = 'unset'
    }
  }, [onClose, onPrev, onNext, hasPrev, hasNext])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="photo-modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        
        {hasPrev && (
          <button className="modal-nav modal-nav-prev" onClick={onPrev}>
            ‹
          </button>
        )}
        
        {hasNext && (
          <button className="modal-nav modal-nav-next" onClick={onNext}>
            ›
          </button>
        )}

        <div className="modal-image-wrapper">
          <img
            src={photo.url}
            alt={`Photo ${photo.id}`}
            className="modal-image"
          />
        </div>

        {photo.date && (
          <div className="modal-info">
            <p className="modal-date">
              {new Date(photo.date).toLocaleString('ko-KR')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PhotoModal

