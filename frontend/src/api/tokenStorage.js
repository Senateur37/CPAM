const REMEMBER_KEY = 'remember_me'

function activeStorage() {
  return localStorage.getItem(REMEMBER_KEY) === 'false' ? sessionStorage : localStorage
}

export const tokenStorage = {
  get(key) {
    return activeStorage().getItem(key)
  },
  set(key, value) {
    activeStorage().setItem(key, value)
  },
  remove(key) {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  },
  setRemember(remember) {
    localStorage.setItem(REMEMBER_KEY, remember ? 'true' : 'false')
  },
}
