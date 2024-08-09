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
import { By } from 'selenium-webdriver'
import commonTable from '../components/table.component'
import dropdownComponent from '../components/dropdown.component'
import {
  generateDropdownGroup,
  generateInputGroup
} from '../../common-tools/common-tools'
import inputGroup from '../components/input-group.component'


const tabSelector = {
  root: '.content .content-menu',
  header: {},
  body: {
    root: '.content-menu__list',
    row: {
      root: '.content-menu__item',
      fields: {
        key: 'a'
      }
    }
  }
}

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
        name: '.table-body__cell:nth-of-type(1) a .link',
        datetime:
          '.table-body__cell:nth-of-type(1) a .date-uid-row .link-subtext:nth-of-type(1)',
        uid:
          '.table-body__cell:nth-of-type(1) a .date-uid-row .link-subtext:nth-of-type(2)',
        duration: '.table-body__cell:nth-of-type(3) .data-ellipsis',
        owner: '.table-body__cell:nth-of-type(4) .data-ellipsis'
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

module.exports = {
  crossJobsMonitorTab: {
    Cross_Jobs_Tab_Selector: commonTable(tabSelector),
    Table_FilterBy_Button: By.css('[data-testid="filter-menu-btn-tooltip-wrapper"]'),
    Search_By_Name_Filter_Input: inputGroup(
      generateInputGroup(
        '[data-testid="name-form-field-input"]',
        true,
        false
      )
    ),
    Date_Picker_Filter_Dropdown: commonDatePickerFilter,
    Jobs_Table: commonTable(overallTable)
  },
  crossWorkflowsMonitorTab: {
    Cross_Jobs_Tab_Selector: commonTable(tabSelector),
    Table_FilterBy_Button: By.css('[data-testid="filter-menu-btn-tooltip-wrapper"]'),
    Search_By_Name_Filter_Input: inputGroup(
      generateInputGroup(
        '[data-testid="name-form-field-input"]',
        true,
        false
      )
    ),
    Date_Picker_Filter_Dropdown: commonDatePickerFilter,
    Workflows_Table: commonTable(overallTable)
  },
  crossScheduledMonitorTab: {
    Cross_Jobs_Tab_Selector: commonTable(tabSelector),
    Table_FilterBy_Button: By.css('[data-testid="filter-menu-btn-tooltip-wrapper"]'),
    Search_By_Name_Filter_Input: inputGroup(
      generateInputGroup(
        '[data-testid="name-form-field-input"]',
        true,
        false
      )
    ),
    Date_Picker_Filter_Dropdown: commonDatePickerFilter,
    Scheduled_Table: commonTable(overallTable)
  }
}
