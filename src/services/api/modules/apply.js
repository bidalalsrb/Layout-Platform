import { mockResponse } from '../mock'

const MOCK_LAYOUT = {
  rows: 3,
  cols: 6,
  seats: Array.from({ length: 18 }, (_, idx) => ({
    id: idx + 1,
    status: idx % 4 === 0 ? 'SELECTED' : 'AVAILABLE',
  })),
}

export function fetchApplyLayout(eventId) {
  return mockResponse({
    data: {
      eventId: Number(eventId),
      ...MOCK_LAYOUT,
    },
  })
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
