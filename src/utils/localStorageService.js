const getStorageValue = (key, defaultValue) => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key)
    const initial = saved !== null ? JSON.parse(saved) : defaultValue
    return initial
  }
}

const setStorageValue = (key, defaultValue) => {
  localStorage.setItem(key, defaultValue)
}

export default {
  getStorageValue,
  setStorageValue
}
