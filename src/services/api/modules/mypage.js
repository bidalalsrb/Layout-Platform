import { cancelUserReservation, getUserReservations } from '../mock-db'
import { mockResponse } from '../mock'

let tempReservations = [
  {
    reservationId: 'temp-r-1001',
    eventId: 1001,
    eventTitle: '2026 봄 채용 박람회',
    eventPeriod: '2026-05-10 ~ 2026-05-12',
    eventEndDate: '2026-05-12',
    counselorName: '홍길동 상담사',
    slotTime: '10:00',
    status: 'APPLIED',
    createdAt: '2026-04-10T09:00:00.000Z',
  },
  {
    reservationId: 'temp-r-1002',
    eventId: 1002,
    eventTitle: '현장 기업 설명회',
    eventPeriod: '2026-05-20 ~ 2026-05-21',
    eventEndDate: '2026-05-21',
    counselorName: '김담당 상담사',
    slotTime: '14:00',
    status: 'APPLIED',
    createdAt: '2026-04-11T04:30:00.000Z',
  },
]

function resolveReservations(userId) {
  const rows = getUserReservations(userId)
  if (rows.length) return rows
  return tempReservations
}

function toAttendanceStatusLabel(item) {
  const today = new Date().toISOString().slice(0, 10)
  if (!item.eventEndDate) return '신청완료'
  if (item.eventEndDate < today) return '참석완료'
  return '참석예정'
}

export function fetchMyAttendance(userId) {
  const rows = resolveReservations(userId).map((item) => ({
    reservationId: item.reservationId,
    eventId: item.eventId,
    eventTitle: item.eventTitle,
    eventPeriod: item.eventPeriod,
    slotTime: item.slotTime,
    counselorName: item.counselorName,
    statusLabel: item.status === 'CANCELED' ? '신청취소' : toAttendanceStatusLabel(item),
    createdAt: item.createdAt,
  }))

  const summary = {
    total: rows.length,
    upcoming: rows.filter((item) => item.statusLabel === '참석예정').length,
    completed: rows.filter((item) => item.statusLabel === '참석완료').length,
  }

  return mockResponse({
    data: rows,
    summary,
  })
}

export function fetchMyApplications(userId) {
  const rows = resolveReservations(userId).map((item) => ({
    reservationId: item.reservationId,
    eventId: item.eventId,
    eventTitle: item.eventTitle,
    eventPeriod: item.eventPeriod,
    counselorName: item.counselorName,
    slotTime: item.slotTime,
    status: item.status,
    statusLabel: item.status === 'APPLIED' ? '신청중' : item.status === 'CANCELED' ? '신청취소' : item.status,
    appliedAt: item.createdAt,
  }))

  return mockResponse({
    data: rows,
    total: rows.length,
  })
}

export function cancelMyApplication({ reservationId, userId }) {
  const targetUserId = String(userId || '').trim()
  const targetReservationId = String(reservationId || '').trim()

  if (targetUserId === 'TEMP_USER') {
    const target = tempReservations.find((item) => item.reservationId === targetReservationId)
    if (!target) {
      return mockResponse({
        success: false,
        reason: '신청 내역을 찾을 수 없습니다.',
      })
    }

    if (target.status === 'CANCELED') {
      return mockResponse({
        success: false,
        reason: '이미 취소된 신청입니다.',
      })
    }

    target.status = 'CANCELED'
    return mockResponse({
      success: true,
    })
  }

  const result = cancelUserReservation({
    reservationId: targetReservationId,
    userId: targetUserId,
  })

  if (!result.ok) {
    return mockResponse({
      success: false,
      reason: result.reason,
    })
  }

  return mockResponse({
    success: true,
  })
}
