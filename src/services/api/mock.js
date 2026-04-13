export function mockResponse(data, delay = 120) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data }), delay)
  })
}

export function mockError(message, status = 400, delay = 120) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject({
        response: {
          status,
          data: { message },
        },
      })
    }, delay)
  })
}
