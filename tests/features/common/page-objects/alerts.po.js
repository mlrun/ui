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
import commonTable from '../components/table.component.js'
import dropdownComponent from '../components/dropdown.component.js'
import labelComponent from '../components/label.component.js'
import {
  generateDropdownGroup,
  generateInputGroup,
  generateLabelGroup
} from '../../common-tools/common-tools.js'
import inputGroup from '../components/input-group.component.js'

const overallTable = {
  root: '.table__content',
  header: {
    root: '.table-head',
    sorters: {
      name: '.table-head__item:nth-of-type(1) .data-ellipsis',
      type: '.table-head__item:nth-of-type(2) .data-ellipsis',
      duration: '.table-head__item:nth-of-type(3) .data-ellipsis',
      owner: '.table-head__item:nth-of-type(4) .data-ellipsis',
      labels: '.table-head__item:nth-of-type(5) .data-ellipsis',
      parameters: '.table-head__item:nth-of-type(6) .data-ellipsis',
      results: '.table-head__item:nth-of-type(7) .data-ellipsis'
    }
  },
  body: {
    root: '.table-body',
    row: {
      root: '.table-row',
      fields: {
        alertName: '[data-testid="alertName"] a .link',
        projectName: '[data-testid="projectName"] .data-ellipsis',
        eventType: '[data-testid="eventType"] .data-ellipsis',
        entityId: '[data-testid="entityId"] .data-ellipsis',
        entityType: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '[data-testid="entityType"]',
            'svg',
            false,
            '.tooltip .tooltip__text span'
          )
        },
        timestamp: '[data-testid="timestamp"] .data-ellipsis',
        severity: '[data-testid="severity"] .data-ellipsis',
        criteriaCount: '[data-testid="criteriaCount"] .data-ellipsis',
        criteriaTime: '[data-testid="criteriaTime"] .data-ellipsis',
        notifications: '[data-testid="notifications"] .data-ellipsis'
      }
    }
  }
}

const commonDatePickerFilter = dropdownComponent(
  generateDropdownGroup(
    '[data-testid="date-picker-container"]',
    '[data-testid="date-picker-input"]',
    '.date-picker__pop-up .select__item',
    '.data-ellipsis .data-ellipsis',
    false
  )
)

const commonSearchByNameFilterInput = inputGroup(
  generateInputGroup('[data-testid="name-form-field-input"]', true, false)
)

export default {
  alerts: {
    Table_FilterBy_Button: '[data-testid="filter-menu-btn-tooltip-wrapper"]',
    Refresh_Button: '[data-testid="refresh"] [data-testid="refresh-tooltip-wrapper"]',
    Search_By_Name_Filter_Input: commonSearchByNameFilterInput,
    Date_Picker_Filter_Dropdown: commonDatePickerFilter,
    Alerts_Table: commonTable(overallTable)
  }
}
