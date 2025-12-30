import React from 'react'
import { loginWithKakao } from '../utils/api'
import './KakaoLogin.css'

function KakaoLogin({ onLoginSuccess }) {
  const handleKakaoLogin = () => {
    loginWithKakao()
  }

  return (
    <div className="kakao-login-container">
      <button className="kakao-login-button" onClick={handleKakaoLogin}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 0C4.477 0 0 3.478 0 7.77c0 2.735 1.792 5.148 4.477 6.534L3.5 20l6.378-3.656c.853.124 1.73.19 2.122.19 5.523 0 10-3.478 10-7.77C21.999 3.478 17.523 0 10 0z"
            fill="#3C1E1E"
          />
        </svg>
        카카오 로그인
      </button>
      <p className="login-notice">
        카카오 로그인을 통해 본인의 프로필과 사진을 조회할 수 있습니다.
      </p>
    </div>
  )
}

export default KakaoLogin

