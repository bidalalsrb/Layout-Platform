const STORAGE_KEY = 'layout-platform-mock-db-v1'

function getDefaultLayout() {
  return {
    rows: 3,
    cols: 10,
    cells: Array.from({ length: 30 }, (_, index) => ({
      id: index + 1,
      label: `S-${String(index + 1).padStart(2, '0')}`,
      name: '',
      content: '',
    })),
  }
}

function getDefaultState() {
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
        posterImages: ['sample-poster-1.png', 'sample-poster-2.png'],
        content: '초기 샘플 행사 내용',
        description: '초기 샘플 행사',
        layoutCode: '4821',
        layout: getDefaultLayout(),
      },
      {
        id: 1002,
        title: '현장 기업 설명회',
        startDate: '2026-05-20',
        endDate: '2026-05-21',
        period: '2026-05-20 ~ 2026-05-21',
        manager: '김담당',
        posterImages: [],
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

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const initial = getDefaultState()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  }

  try {
    return JSON.parse(raw)
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
    posterImages: payload?.posterImages || [],
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
    cells: payload?.cells || target.layout.cells,
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
