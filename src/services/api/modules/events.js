import { mockResponse } from '../mock'

const MOCK_EVENTS = [
  {
    id: 1001,
    title: '2026 봄 채용 박람회',
    startDate: '2026-05-10',
    endDate: '2026-05-12',
    status: 'OPEN',
  },
  {
    id: 1002,
    title: '현장 기업 설명회',
    startDate: '2026-05-20',
    endDate: '2026-05-21',
    status: 'READY',
  },
]

export function fetchEventList() {
  return mockResponse({
    data: MOCK_EVENTS,
    total: MOCK_EVENTS.length,
  })
}

export function fetchEventDetail(eventId) {
  const event = MOCK_EVENTS.find((item) => item.id === Number(eventId)) || null
  return mockResponse({ data: event })
}

export function registerEvent(payload) {
  return mockResponse({
    success: true,
    data: {
      id: 1099,
      ...payload,
    },
  })
}
