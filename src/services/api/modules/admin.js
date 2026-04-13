import { getEventById, saveEventLayout } from '../mock-db'
import { mockError, mockResponse } from '../mock'

const MOCK_PARTICIPANTS = [
  { id: 1, name: '김학생', major: '컴퓨터공학과', booth: 'A-01' },
  { id: 2, name: '이학생', major: '경영학과', booth: 'A-02' },
]

export function fetchParticipants() {
  return mockResponse({
    data: MOCK_PARTICIPANTS,
    total: MOCK_PARTICIPANTS.length,
  })
}

export function fetchLayout(eventId) {
  const event = getEventById(eventId)

  if (!event) {
    return mockError('행사를 찾을 수 없습니다.', 404)
  }

  return mockResponse({
    data: {
      eventId: event.id,
      title: event.title,
      layoutCode: event.layoutCode,
      ...event.layout,
    },
  })
}

export function saveLayout(eventId, payload) {
  const updated = saveEventLayout(eventId, payload)

  if (!updated) {
    return mockError('행사를 찾을 수 없습니다.', 404)
  }

  return mockResponse({
    success: true,
    data: {
      eventId: updated.id,
      title: updated.title,
      layoutCode: updated.layoutCode,
      ...updated.layout,
    },
  })
}

export function downloadExcel(params) {
  return mockResponse({
    success: true,
    fileName: `participants-${params?.eventId || 'all'}.xlsx`,
  })
}
