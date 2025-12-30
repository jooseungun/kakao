import React, { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import ProfileView from './components/ProfileView'
import PhotoGallery from './components/PhotoGallery'
import PhotoModal from './components/PhotoModal'
import KakaoLogin from './components/KakaoLogin'
import {
  searchProfile,
  getPhotos,
  getKakaoAccessToken,
  getKakaoUserInfo,
  getAccessToken,
  saveAccessToken,
  removeAccessToken,
} from './utils/api'
import './App.css'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [profile, setProfile] = useState(null)
  const [photos, setPhotos] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 카카오 로그인 콜백 처리
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')

    if (code) {
      handleKakaoCallback(code)
    } else {
      // 저장된 토큰 확인
      const savedToken = getAccessToken()
      if (savedToken) {
        setAccessToken(savedToken)
        setIsLoggedIn(true)
      }
    }
  }, [])

  const handleKakaoCallback = async (code) => {
    try {
      setLoading(true)
      const token = await getKakaoAccessToken(code)
      saveAccessToken(token)
      setAccessToken(token)
      setIsLoggedIn(true)

      // URL에서 code 제거
      window.history.replaceState({}, document.title, window.location.pathname)

      // 사용자 정보 가져오기
      const userInfo = await getKakaoUserInfo(token)
      setProfile(userInfo)
    } catch (err) {
      setError('로그인 처리 중 오류가 발생했습니다.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    removeAccessToken()
    setAccessToken(null)
    setIsLoggedIn(false)
    setProfile(null)
    setPhotos([])
    setSearchQuery('')
  }

  const handleSearch = async (query) => {
    setSearchQuery(query)
    setLoading(true)
    setError(null)

    try {
      const profileData = await searchProfile(query, accessToken)
      const photosData = await getPhotos(query, accessToken)

      setProfile(profileData)
      setPhotos(photosData)
    } catch (err) {
      setError('검색 중 오류가 발생했습니다.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo)
  }

  const handleCloseModal = () => {
    setSelectedPhoto(null)
  }

  const handlePrevPhoto = () => {
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id)
    if (currentIndex > 0) {
      setSelectedPhoto(photos[currentIndex - 1])
    }
  }

  const handleNextPhoto = () => {
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id)
    if (currentIndex < photos.length - 1) {
      setSelectedPhoto(photos[currentIndex + 1])
    }
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>카카오톡 사진 조회</h1>
          <p>카카오 로그인 후 프로필과 사진을 조회하세요</p>
          {isLoggedIn && (
            <button className="logout-button" onClick={handleLogout}>
              로그아웃
            </button>
          )}
        </header>

        {!isLoggedIn ? (
          <KakaoLogin />
        ) : (
          <>
            <SearchBar onSearch={handleSearch} loading={loading} />

            {error && <div className="error-message">{error}</div>}

            {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>검색 중...</p>
              </div>
            )}

            {profile && !loading && (
              <>
                <ProfileView profile={profile} />
                <PhotoGallery photos={photos} onPhotoClick={handlePhotoClick} />
              </>
            )}

            {selectedPhoto && (
              <PhotoModal
                photo={selectedPhoto}
                onClose={handleCloseModal}
                onPrev={handlePrevPhoto}
                onNext={handleNextPhoto}
                hasPrev={photos.findIndex(p => p.id === selectedPhoto.id) > 0}
                hasNext={photos.findIndex(p => p.id === selectedPhoto.id) < photos.length - 1}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App

