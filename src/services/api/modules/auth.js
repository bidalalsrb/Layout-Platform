import { mockError, mockResponse } from '../mock'

export function signIn(payload) {
  const { userId, password } = payload || {}

  if (userId === 'admin' && password === '1234') {
    return mockResponse({
      data: 'mock-admin-access-token',
      role: 'ADMIN',
      username: '관리자',
    })
  }

  return mockError('아이디 또는 비밀번호가 올바르지 않습니다.', 401)
}

export function sendPhoneCode(payload) {
  const phoneNum = payload?.phoneNum || ''
  if (!phoneNum) {
    return mockError('휴대폰 번호를 입력해 주세요.')
  }

  return mockResponse({
    success: true,
    message: '인증번호가 발송되었습니다.',
    testCode: '123456',
  })
}

export function verifyPhoneCode(payload) {
  const code = payload?.code || ''
  if (code !== '123456') {
    return mockError('인증번호가 일치하지 않습니다.')
  }

  return mockResponse({
    data: 'mock-signup-uuid',
  })
}

export function signUpStudent(uuid, payload) {
  if (!uuid || !payload?.userId) {
    return mockError('회원가입 요청 데이터가 올바르지 않습니다.')
  }

  return mockResponse({
    success: true,
    userId: payload.userId,
  })
}
