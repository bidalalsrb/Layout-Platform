const STORAGE_KEY = 'layout-platform-mock-db-v1'

function newSlot(time = '', capacity = 1) {
  return {
    id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    time,
    capacity: Number(capacity) || 1,
    reservations: [],
  }
}

function normalizeCell(cell, index = 0) {
  const counselor = cell?.counselor || {}
  const slots = Array.isArray(counselor.slots) ? counselor.slots : []

  return {
    id: cell?.id ?? index + 1,
    label: cell?.label || `S-${String((cell?.id ?? index + 1)).padStart(2, '0')}`,
    name: cell?.name || '',
    content: cell?.content || '',
    counselor: {
      name: counselor.name || '',
      slots: slots.map((slot) => ({
        id: slot.id || `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        time: slot.time || '',
        capacity: Number(slot.capacity) || 1,
        reservations: Array.isArray(slot.reservations) ? slot.reservations : [],
      })),
    },
  }
}

function getDefaultLayout() {
  return {
    rows: 3,
    cols: 10,
    cells: Array.from({ length: 30 }, (_, index) =>
      normalizeCell(
        {
          id: index + 1,
          label: `S-${String(index + 1).padStart(2, '0')}`,
          name: '',
          content: '',
          counselor: {
            name: '',
            slots: [],
          },
        },
        index,
      ),
    ),
  }
}

function getDefaultState() {
  const initial = getDefaultLayout()
  initial.cells[0].counselor.name = '홍길동 상담사'
  initial.cells[0].counselor.slots = [newSlot('10:00', 2), newSlot('11:00', 1)]

  return {
    nextEventId: 1003,
    events: [
      {
        id: 1001,
        title: '2026 봄 채용 박람회',
        startDate: '2026-05-10',
        endDate: '2026-05-12',
        period: '2026-05-10 ~ 2026-05-12',
        manager: '홍길동',
        posterImages: ['sample-poster-1.png', 'sample-poster-2.png', 'sample-poster-3.png'],
        content: '초기 샘플 행사 내용',
        description: '초기 샘플 행사',
        layoutCode: '4821',
        layout: initial,
      },
      {
        id: 1002,
        title: '현장 기업 설명회',
        startDate: '2026-05-20',
        endDate: '2026-05-21',
        period: '2026-05-20 ~ 2026-05-21',
        manager: '김담당',
        posterImages: ['sample-poster-1.png', 'sample-poster-2.png', 'sample-poster-3.png'],
        content: '초기 샘플 행사 내용',
        description: '초기 샘플 행사',
        layoutCode: null,
        layout: getDefaultLayout(),
      },
    ],
  }
}

function clone(data) {
  return JSON.parse(JSON.stringify(data))
}

function normalizeEvent(event) {
  const layout = event.layout || getDefaultLayout()
  const posterImages =
    Array.isArray(event.posterImages) && event.posterImages.length
      ? event.posterImages
      : ['sample-poster-1.png', 'sample-poster-2.png', 'sample-poster-3.png']

  return {
    ...event,
    posterImages,
    layout: {
      rows: layout.rows || 3,
      cols: layout.cols || 10,
      cells: (layout.cells || []).map((cell, index) => normalizeCell(cell, index)),
    },
  }
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const initial = getDefaultState()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  }

  try {
    const parsed = JSON.parse(raw)
    parsed.events = (parsed.events || []).map((event) => normalizeEvent(event))
    return parsed
  } catch {
    const fallback = getDefaultState()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback))
    return fallback
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function generateUniqueCode(events) {
  const used = new Set(events.map((item) => item.layoutCode).filter(Boolean))

  for (let i = 0; i < 200; i += 1) {
    const code = String(Math.floor(1000 + Math.random() * 9000))
    if (!used.has(code)) return code
  }

  let fallback = 1000
  while (used.has(String(fallback))) fallback += 1
  return String(fallback)
}

export function getEvents() {
  const state = loadState()
  return clone(state.events)
}

export function getEventById(eventId) {
  const events = getEvents()
  return events.find((item) => item.id === Number(eventId)) || null
}

export function createEvent(payload) {
  const state = loadState()
  const startDate = payload?.startDate || ''
  const endDate = payload?.endDate || ''
  const period = payload?.period || (startDate && endDate ? `${startDate} ~ ${endDate}` : '')
  const content = payload?.content || payload?.description || ''

  const event = {
    id: state.nextEventId,
    title: payload?.title || '이름 없는 행사',
    startDate,
    endDate,
    period,
    manager: payload?.manager || '',
    posterImages:
      payload?.posterImages && payload.posterImages.length
        ? payload.posterImages
        : ['sample-poster-1.png', 'sample-poster-2.png', 'sample-poster-3.png'],
    content,
    description: content,
    layoutCode: null,
    layout: getDefaultLayout(),
  }

  state.nextEventId += 1
  state.events.unshift(event)
  saveState(state)

  return clone(event)
}

export function saveEventLayout(eventId, payload) {
  const state = loadState()
  const target = state.events.find((item) => item.id === Number(eventId))

  if (!target) return null

  target.layout = {
    rows: payload?.rows || target.layout.rows,
    cols: payload?.cols || target.layout.cols,
    cells: (payload?.cells || target.layout.cells).map((cell, index) => normalizeCell(cell, index)),
  }

  if (!target.layoutCode) {
    target.layoutCode = generateUniqueCode(state.events)
  }

  saveState(state)
  return clone(target)
}

export function getLayoutByCode(layoutCode) {
  const code = String(layoutCode || '').trim()
  if (!code) return null

  const events = getEvents()
  return events.find((item) => item.layoutCode === code) || null
}

export function reserveCounselingSlot({ layoutCode, cellId, slotId, userProfile }) {
  const state = loadState()
  const event = state.events.find((item) => item.layoutCode === String(layoutCode || '').trim())
  if (!event) return { ok: false, reason: '배치 코드가 유효하지 않습니다.' }

  const cell = event.layout.cells.find((item) => item.id === Number(cellId))
  if (!cell) return { ok: false, reason: '셀 정보를 찾을 수 없습니다.' }

  const slot = (cell.counselor?.slots || []).find((item) => item.id === slotId)
  if (!slot) return { ok: false, reason: '상담 시간 정보를 찾을 수 없습니다.' }

  if (!userProfile?.userId || !userProfile?.name || !userProfile?.phone) {
    return { ok: false, reason: '회원가입 후 신청할 수 있습니다.' }
  }

  const duplicated = slot.reservations.some((item) => item.userId === userProfile.userId)
  if (duplicated) {
    return { ok: false, reason: '이미 해당 시간에 신청되어 있습니다.' }
  }

  if (slot.reservations.length >= slot.capacity) {
    return { ok: false, reason: '정원이 마감되었습니다.' }
  }

  slot.reservations.push({
    id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    userId: userProfile.userId,
    name: userProfile.name,
    phone: userProfile.phone,
    status: 'APPLIED',
    createdAt: new Date().toISOString(),
  })

  saveState(state)

  return {
    ok: true,
    reservation: {
      eventId: event.id,
      cellId: cell.id,
      slotId: slot.id,
      time: slot.time,
    },
  }
}

export function getUserReservations(userId) {
  const targetUserId = String(userId || '').trim()
  if (!targetUserId) return []

  const events = getEvents()
  const rows = []

  events.forEach((event) => {
    const cells = event.layout?.cells || []

    cells.forEach((cell) => {
      const slots = cell.counselor?.slots || []

      slots.forEach((slot) => {
        const reservations = slot.reservations || []
        reservations.forEach((reservation) => {
          if (reservation.userId !== targetUserId) return

          rows.push({
            reservationId: reservation.id,
            userId: reservation.userId,
            name: reservation.name,
            phone: reservation.phone,
            status: reservation.status,
            createdAt: reservation.createdAt,
            eventId: event.id,
            eventTitle: event.title,
            eventStartDate: event.startDate || '',
            eventEndDate: event.endDate || '',
            eventPeriod: event.period || '',
            cellId: cell.id,
            cellLabel: cell.label || '',
            counselorName: cell.counselor?.name || '',
            slotId: slot.id,
            slotTime: slot.time || '',
            capacity: slot.capacity || 0,
          })
        })
      })
    })
  })

  return rows.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
}

export function cancelUserReservation({ reservationId, userId }) {
  const targetReservationId = String(reservationId || '').trim()
  const targetUserId = String(userId || '').trim()

  if (!targetReservationId || !targetUserId) {
    return { ok: false, reason: '취소할 신청 정보를 찾을 수 없습니다.' }
  }

  const state = loadState()

  for (const event of state.events) {
    const cells = event.layout?.cells || []
    for (const cell of cells) {
      const slots = cell.counselor?.slots || []
      for (const slot of slots) {
        const reservations = slot.reservations || []
        const target = reservations.find((reservation) => reservation.id === targetReservationId)
        if (!target) continue

        if (target.userId !== targetUserId) {
          return { ok: false, reason: '본인 신청만 취소할 수 있습니다.' }
        }

        if (target.status === 'CANCELED') {
          return { ok: false, reason: '이미 취소된 신청입니다.' }
        }

        target.status = 'CANCELED'
        target.canceledAt = new Date().toISOString()
        saveState(state)
        return { ok: true }
      }
    }
  }

  return { ok: false, reason: '신청 내역을 찾을 수 없습니다.' }
}
