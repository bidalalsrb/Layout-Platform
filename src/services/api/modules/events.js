import { createEvent, getEventById, getEvents } from '../mock-db'
import { mockResponse } from '../mock'

export function fetchEventList() {
  const events = getEvents().map((event) => ({
    id: event.id,
    title: event.title,
    startDate: event.startDate || '',
    endDate: event.endDate || '',
    period: event.period || (event.startDate && event.endDate ? `${event.startDate} ~ ${event.endDate}` : ''),
    manager: event.manager || '',
    posterImages: event.posterImages || [],
    content: event.content || event.description || '',
    description: event.description || event.content || '',
    layoutCode: event.layoutCode,
    status: event.layoutCode ? 'LAYOUT_READY' : 'LAYOUT_PENDING',
  }))

  return mockResponse({
    data: events,
    total: events.length,
  })
}

export function fetchEventDetail(eventId) {
  return mockResponse({ data: getEventById(eventId) })
}

export function registerEvent(payload) {
  const event = createEvent(payload)
  return mockResponse({
    success: true,
    data: event,
  })
}
