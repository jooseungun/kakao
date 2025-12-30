import React from 'react'
import './ProfileView.css'

function ProfileView({ profile }) {
  return (
    <div className="profile-view">
      <div className="profile-card">
        <div className="profile-image-wrapper">
          <img
            src={profile.profileImage}
            alt={profile.nickname}
            className="profile-image"
          />
        </div>
        <div className="profile-info">
          <h2 className="profile-nickname">{profile.nickname}</h2>
          <div className="profile-details">
            {profile.phoneNumber && (
              <div className="profile-detail-item">
                <span className="detail-label">전화번호:</span>
                <span className="detail-value">{profile.phoneNumber}</span>
              </div>
            )}
            {profile.kakaoId && (
              <div className="profile-detail-item">
                <span className="detail-label">카카오톡 ID:</span>
                <span className="detail-value">{profile.kakaoId}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileView

