import { cutChips } from '../../utils/cutChips'

export const sizeChips = {
  '900px': elements => cutChips(elements, 7),
  '800px': elements => cutChips(elements, 5),
  '700px': elements => cutChips(elements, 4),
  '600px': elements => cutChips(elements, 4),
  '500px': elements => cutChips(elements, 3),
  '400px': elements => cutChips(elements, 2),
  '300px': elements => cutChips(elements, 2),
  '200px': elements => cutChips(elements, 1),
  '100px': elements => cutChips(elements, 0),
  '0px': elements => cutChips(elements, 0)
}
