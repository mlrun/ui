const getStorageValue = (key, defaultValue) => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key)
    return saved !== null ? JSON.parse(saved) : defaultValue
  }
}

const setStorageValue = (key, defaultValue) => {
  localStorage.setItem(key, defaultValue)
}

const localStorageService = {
  getStorageValue,
  setStorageValue
}

export default localStorageService
