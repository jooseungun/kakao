import React from 'react'
import './PhotoGallery.css'

function PhotoGallery({ photos, onPhotoClick }) {
  if (!photos || photos.length === 0) {
    return (
      <div className="no-photos">
        <p>표시할 사진이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="photo-gallery">
      <h2 className="gallery-title">사진 앨범 ({photos.length}장)</h2>
      <div className="gallery-grid">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="photo-item"
            onClick={() => onPhotoClick(photo)}
          >
            <img
              src={photo.thumbnail || photo.url}
              alt={`Photo ${photo.id}`}
              className="photo-thumbnail"
              loading="lazy"
            />
            <div className="photo-overlay">
              <span className="photo-icon">🔍</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PhotoGallery

