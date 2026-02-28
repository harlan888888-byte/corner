import { ref } from 'vue'

export function useVanImagePreview() {
  const vanImageModalShow = ref(false)
  const vanImageCurrentIndex = ref(0)

  const vanImageHandleClick = (idx) => {
    vanImageCurrentIndex.value = idx
    vanImageModalShow.value = true
  }

  const vanImageHandleDblClick = (idx) => {
    vanImageCurrentIndex.value = idx
    vanImageModalShow.value = true
  }

  const vanImageClose = () => {
    vanImageModalShow.value = false
  }

  return {
    vanImageModalShow,
    vanImageCurrentIndex,
    vanImageHandleClick,
    vanImageHandleDblClick,
    vanImageClose
  }
}
