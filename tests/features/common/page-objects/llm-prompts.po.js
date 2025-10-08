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
  generateInputGroup,
  generateDropdownGroup
} from '../../common-tools/common-tools'
import inputGroup from '../components/input-group.component'
import actionMenu from '../components/action-menu.component'

const commonSearchByNameFilterInput = inputGroup(
  generateInputGroup(
    '[data-testid="name-form-field-input"]',
    true,
    false
  )
)

const actionMenuStructure = {
  root: '.actions-menu__container',
  menuElements: {
    open_button: '[data-testid="actions-menu"] button',
    options: '.actions-menu__body .actions-menu__option'
  }
}

const overallTable = {
  root: '.table__content',
  header: {
    root: '.table-header',
    sorters: {
      name: '[data-testid="name"] .data-ellipsis',
      labels: '[data-testid="labels"] .data-ellipsis',
      producer: '[data-testid="producer"] .data-ellipsis',
      owner: '[data-testid="owner"] .data-ellipsis',
      updated: '[data-testid="updated"] .data-ellipsis',
      size: '[data-testid="size"] .data-ellipsis'
    }
  },
  body: {
    root: '.table-body',
    row: {
      root: '.table-row',
      fields: {
        name: '[data-testid="name"] a .link',
        uid:  '.table-body__cell:nth-of-type(1) a .name-wrapper .link',
        labels: {
                  componentType: dropdownComponent,
                  structure: generateDropdownGroup(
                    '.table-body__cell:nth-of-type(3)',
                    '.chip-block span.chips_button',
                    '.chip-block-hidden_visible .data-ellipsis.tooltip-wrapper',
                    false,
                    false
                  )
                },
        producer: '[data-testid="producer"] .data-ellipsis',
        owner: '[data-testid="owner"] .data-ellipsis',
        updated: '[data-testid="updated"] .data-ellipsis',
        size: '[data-testid="size"] .data-ellipsis',
        show_all_versions: '[data-testid="quick-link-show-all-versions"]',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        },
      }
    }
  }
}

export default {
  llmPrompts: {
    Search_By_Name_Filter_Input: commonSearchByNameFilterInput,
    Table_FilterBy_Button: By.css('[data-testid="filter-menu-btn-tooltip-wrapper"]'),
    Refresh_Button: By.css('[data-testid="refresh"] [data-testid="refresh-tooltip-wrapper"]'),
    LLMPrompts_Table: commonTable(overallTable),
    Overlay: By.css('#overlay_container .chip-block-hidden_visible'),
    History_Back_Button: By.css('.history-back-link .history-back-link__icon'),
    Version_History_Title: By.css(
      '.history-back-link .history-back-link__title [data-testid="version-history"]'
    ),
    Version_History_Prompt_Name: By.css(
      '.history-back-link .history-back-link__title .data-ellipsis.tooltip-wrapper'
    )
  }
}
