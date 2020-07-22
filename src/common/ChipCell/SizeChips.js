import { cutChips } from '../../utils/cutChips'

export const sizeChips = {
  1000: elements => cutChips(elements, 7),
  900: elements => cutChips(elements, 6),
  800: elements => cutChips(elements, 5),
  700: elements => cutChips(elements, 5),
  600: elements => cutChips(elements, 4),
  500: elements => cutChips(elements, 3),
  400: elements => cutChips(elements, 2),
  300: elements => cutChips(elements, 1),
  200: elements => cutChips(elements, 1),
  100: elements => cutChips(elements, 0),
  0: elements => cutChips(elements, 0)
}
