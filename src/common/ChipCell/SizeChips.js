import { cutChips } from '../../utils/cutChips'

export const sizeChips = {
  1000: (elements, delimiter) => cutChips(elements, 8, delimiter),
  900: (elements, delimiter) => cutChips(elements, 7, delimiter),
  800: (elements, delimiter) => cutChips(elements, 6, delimiter),
  700: (elements, delimiter) => cutChips(elements, 6, delimiter),
  600: (elements, delimiter) => cutChips(elements, 5, delimiter),
  500: (elements, delimiter) => cutChips(elements, 4, delimiter),
  400: (elements, delimiter) => cutChips(elements, 3, delimiter),
  300: (elements, delimiter) => cutChips(elements, 2, delimiter),
  200: (elements, delimiter) => cutChips(elements, 1, delimiter),
  100: (elements, delimiter) => cutChips(elements, 0, delimiter),
  0: (elements, delimiter) => cutChips(elements, 0, delimiter)
}
