import { mockResponse } from '../mock'

const MOCK_PARTICIPANTS = [
  { id: 1, name: '김학생', major: '컴퓨터공학과', booth: 'A-01' },
  { id: 2, name: '이학생', major: '경영학과', booth: 'A-02' },
]

const MOCK_LAYOUT = {
  eventId: 1001,
  rows: 5,
  cols: 6,
  cells: Array.from({ length: 30 }, (_, idx) => ({
    id: idx + 1,
    type: 'EMPTY',
  })),
}

export function fetchParticipants() {
  return mockResponse({
    data: MOCK_PARTICIPANTS,
    total: MOCK_PARTICIPANTS.length,
  })
}

export function fetchLayout(eventId) {
  return mockResponse({
    data: {
      ...MOCK_LAYOUT,
      eventId: Number(eventId) || MOCK_LAYOUT.eventId,
    },
  })
}

export function saveLayout(eventId, payload) {
  return mockResponse({
    success: true,
    data: {
      eventId: Number(eventId),
      ...payload,
    },
  })
}

export function downloadExcel(params) {
  return mockResponse({
    success: true,
    fileName: `participants-${params?.eventId || 'all'}.xlsx`,
  })
}
