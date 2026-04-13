import { getLayoutByCode, reserveCounselingSlot } from '../mock-db'
import { mockError, mockResponse } from '../mock'

export function fetchApplyLayoutByCode(layoutCode) {
  const event = getLayoutByCode(layoutCode)

  if (!event) {
    return mockError('일치하는 배치 코드가 없습니다.', 404)
  }

  return mockResponse({
    data: {
      eventId: event.id,
      title: event.title,
      description: event.content || event.description,
      period: event.period,
      layoutCode: event.layoutCode,
      ...event.layout,
    },
  })
}

export function submitCounselingReservation(payload) {
  const result = reserveCounselingSlot(payload)

  if (!result.ok) {
    return mockResponse({
      success: false,
      reason: result.reason,
    })
  }

  return mockResponse({
    success: true,
    data: result.reservation,
  })
}

export function fetchApplyLayout(eventId) {
  return mockError(`eventId(${eventId}) 조회는 현재 비활성화입니다. 배치코드 조회를 사용해 주세요.`, 400)
}

export function submitApply(eventId, payload) {
  return mockResponse({
    success: true,
    data: {
      applyId: 5001,
      eventId: Number(eventId),
      ...payload,
    },
  })
}

export function cancelApply(applyId) {
  return mockResponse({
    success: true,
    data: {
      applyId: Number(applyId),
      canceled: true,
    },
  })
}
