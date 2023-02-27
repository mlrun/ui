/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/

/**
 * Finds the latest item in a group by comparing the `updated` property of each item.
 * If `updated` is not a valid date string for any item, the function will return the other item.
 * @param {Array} group - The group of items to search for the latest item.
 * @returns {Object} - The latest item in the group.
 */
const findLatestByUpdated = group => {
  return group.reduce((latest, current) => {
    const latestDate = new Date(latest.updated)
    const currentDate = new Date(current.updated)

    // if either dates is invalid - return the other one
    // if both are valid - return the later one
    return isNaN(latestDate)
      ? current
      : isNaN(currentDate)
      ? latest
      : latestDate.getTime() > currentDate.getTime()
      ? latest
      : current
  })
}

/**
 * Finds the latest item in a group by looking for an item with a `tag` property of `'latest'`.
 * If no such item is found, the function will return the first item in the group.
 * @param {Array} group - The group of items to search for the latest item.
 * @returns {Object} - The latest item in the group.
 */
const findLatestByTag = group => {
  const latestItem = group.find(groupItem => groupItem.tag === 'latest')
  return latestItem ?? group[0]
}

/**
 * Generates a new array of groups where each group has a single latest item,
 * determined by either the updated property or a 'latest' tag property,
 * unless a selectedItem is specified, in which case the latest item will be the
 * item in the group with the same unique identifier as selectedItem.
 *
 * @param {Object} content - The array of groups to process.
 * @param {function} [getIdentifier] - The function used to retrieve the unique identifier
 * of each item, to compare against the selectedItem identifier.
 * @param {Object} [selectedItem] - If specified, the latest item in each group will be
 * the item with the same unique identifier as selectedItem. This item takes precedence
 * over the updated and 'latest' tag properties, if it exists in a group.
 * @returns {Array} - The new array of groups with a single latest item in each group.
 */
export const generateGroupLatestItem = (content, getIdentifier, selectedItem) => {
  const contentArray = Object.values(content)

  return contentArray?.map(group => {
    if (!Array.isArray(group)) {
      return group
    }

    // If a selectedItem is specified, find the item in the group with the same unique identifier
    if (selectedItem && getIdentifier) {
      const selectedGroupItem = group.find(groupItem => {
        return groupItem.ui.identifierUnique === getIdentifier(selectedItem, true)
      })

      if (selectedGroupItem) {
        return selectedGroupItem
      }
    }

    // If the group has an 'updated' property, find the item with the latest value for that property
    if (group[0].updated) {
      return findLatestByUpdated(group)
    } else {
      // Otherwise, find the item with the 'latest' tag property
      return findLatestByTag(group)
    }
  })
}
