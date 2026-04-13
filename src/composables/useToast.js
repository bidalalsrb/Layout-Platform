import { ref } from 'vue'

const messages = ref([])

export function useToast() {
  function pushToast(message, type = 'info') {
    const id = crypto.randomUUID()
    messages.value.push({ id, message, type })

    setTimeout(() => {
      messages.value = messages.value.filter((item) => item.id !== id)
    }, 2400)
  }

  return {
    messages,
    pushToast,
  }
}
