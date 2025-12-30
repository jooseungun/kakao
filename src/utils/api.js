import axios from 'axios'

// 카카오 API 설정
// 환경 변수에서 가져오거나 .env 파일에 설정
const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY || ''
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI || `${window.location.origin}/auth/kakao/callback`
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

/**
 * 카카오 로그인 URL 생성
 */
export function getKakaoLoginUrl() {
  const params = new URLSearchParams({
    client_id: KAKAO_REST_API_KEY,
    redirect_uri: KAKAO_REDIRECT_URI,
    response_type: 'code',
  })
  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`
}

/**
 * 카카오 로그인 처리
 */
export function loginWithKakao() {
  window.location.href = getKakaoLoginUrl()
}

/**
 * 카카오 인증 코드로 액세스 토큰 발급
 * @param {string} code - 카카오 인증 코드
 * @returns {Promise<string>} 액세스 토큰
 */
export async function getKakaoAccessToken(code) {
  try {
    // 실제로는 백엔드에서 처리하는 것이 안전합니다
    const response = await axios.post(`${API_BASE_URL}/auth/kakao/token`, {
      code,
      redirect_uri: KAKAO_REDIRECT_URI,
    })
    return response.data.access_token
  } catch (error) {
    console.error('액세스 토큰 발급 오류:', error)
    throw error
  }
}

/**
 * 카카오 사용자 정보 조회 (공식 API)
 * @param {string} accessToken - 카카오 액세스 토큰
 * @returns {Promise} 사용자 정보
 */
export async function getKakaoUserInfo(accessToken) {
  try {
    const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        property_keys: JSON.stringify([
          'kakao_account.profile',
          'kakao_account.email',
          'kakao_account.phone_number',
        ]),
      },
    })
    
    const { kakao_account, id, properties } = response.data
    return {
      id,
      nickname: properties?.nickname || kakao_account?.profile?.nickname,
      profileImage: properties?.profile_image || kakao_account?.profile?.profile_image_url,
      email: kakao_account?.email,
      phoneNumber: kakao_account?.phone_number,
      kakaoId: id.toString(),
    }
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error)
    throw error
  }
}

/**
 * 전화번호 또는 카카오톡 아이디로 프로필 조회
 * @param {string} query - 전화번호 또는 카카오톡 아이디
 * @param {string} accessToken - 카카오 액세스 토큰 (사용자 본인 조회용)
 * @returns {Promise} 프로필 정보
 */
export async function searchProfile(query, accessToken = null) {
  try {
    // 백엔드 API를 통한 조회 (실제 구현 필요)
    // 주의: 다른 사용자의 정보는 동의 없이 조회할 수 없습니다
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      params: { query },
      headers: accessToken ? {
        Authorization: `Bearer ${accessToken}`,
      } : {},
    })
    return response.data
  } catch (error) {
    console.error('프로필 조회 오류:', error)
    
    // 개발/테스트용 목업 데이터
    if (error.response?.status === 404 || !API_BASE_URL) {
      return {
        nickname: '테스트 사용자',
        profileImage: 'https://via.placeholder.com/150',
        phoneNumber: query,
        kakaoId: query,
      }
    }
    throw error
  }
}

/**
 * 사용자의 사진 목록 조회
 * @param {string} userId - 사용자 ID
 * @param {string} accessToken - 카카오 액세스 토큰
 * @returns {Promise} 사진 배열
 */
export async function getPhotos(userId, accessToken = null) {
  try {
    // 백엔드 API를 통한 조회
    // 카카오톡은 공식적으로 메시지/사진 조회 API를 제공하지 않으므로
    // 백엔드에서 처리해야 합니다
    const response = await axios.get(`${API_BASE_URL}/photos`, {
      params: { userId },
      headers: accessToken ? {
        Authorization: `Bearer ${accessToken}`,
      } : {},
    })
    return response.data
  } catch (error) {
    console.error('사진 조회 오류:', error)
    
    // 개발/테스트용 목업 데이터
    if (error.response?.status === 404 || !API_BASE_URL) {
      return Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        url: `https://picsum.photos/400/400?random=${i + 1}`,
        thumbnail: `https://picsum.photos/200/200?random=${i + 1}`,
        date: new Date(Date.now() - i * 86400000).toISOString(),
      }))
    }
    throw error
  }
}

/**
 * 로컬 스토리지에 토큰 저장
 */
export function saveAccessToken(token) {
  localStorage.setItem('kakao_access_token', token)
}

/**
 * 로컬 스토리지에서 토큰 가져오기
 */
export function getAccessToken() {
  return localStorage.getItem('kakao_access_token')
}

/**
 * 로컬 스토리지에서 토큰 제거
 */
export function removeAccessToken() {
  localStorage.removeItem('kakao_access_token')
}

