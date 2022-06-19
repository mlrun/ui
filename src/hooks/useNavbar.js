import { useState } from 'react'
import localStorageService from '../utils/localStorageService'

export const useNavbar = () => {
  const [isNavbarPinned, setIsNavbarPinned] = useState(
    localStorageService.getStorageValue('mlrunUi.navbarStatic', true)
  )

  return [isNavbarPinned, setIsNavbarPinned]
}
