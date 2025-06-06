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
import inputGroup from '../components/input-group.component'
import commonTable from '../components/table.component'
import actionMenu from '../components/action-menu.component'
import {
  generateInputGroup,
  generateLabelGroup,
  generateDropdownGroup
} from '../../common-tools/common-tools'
import labelComponent from '../components/label.component'
import dropdownComponent from '../components/dropdown.component'

const actionMenuStructure = {
  root: '.actions-menu__container',
  menuElements: {
    open_button: '[data-testid="actions-menu-button-tooltip-wrapper"]',
    options: '.actions-menu__body .actions-menu__option'
  }
}

const functionsTable = {
  root: '.table-container .table__flex .table__content',
  header: {
    root: '.table-head',
    sorters: {
      name: '.table-head__item:nth-of-type(1) .data-ellipsis',
      kind: '.table-head__item:nth-of-type(2) .data-ellipsis',
      hash: '.table-head__item:nth-of-type(3) .data-ellipsis',
      updated: '.table-head__item:nth-of-type(4) .data-ellipsis',
      command: '.table-head__item:nth-of-type(5) .data-ellipsis',
      image: '.table-head__item:nth-of-type(6) .data-ellipsis',
      description: '.table-head__item:nth-of-type(7) .data-ellipsis'
    }
  },
  body: {
    root: '.table-body',
    row: {
      root: '.table-row',  
      fields: {
        kind: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.table-body__cell:nth-of-type(2)',
            '.data-ellipsis',
            true,
            '.tooltip .tooltip__text span' 
          )
        },
        expand_btn: '.table-body__cell:nth-of-type(1) svg.expand-arrow',
        name: '.table-body__cell:nth-of-type(1) a .name-wrapper .link', 
        tag: '.table-body__cell:nth-of-type(1) a .item-tag span',
        name_expand_btn: '.table-body__cell:nth-of-type(1) a .name-wrapper .item-tag',
        status: '.table-body__cell:nth-of-type(1) .status i',
        hash: '.table-body__cell:nth-of-type(3) .data-ellipsis span',
        updated: '.table-body__cell:nth-of-type(4) .data-ellipsis',
        command: '.table-body__cell:nth-of-type(5) .data-ellipsis',
        image: '.table-body__cell:nth-of-type(6) .data-ellipsis',
        deploy: '[data-testid="quick-link-deploy"]',
        description: '.table-body__cell:nth-of-type(7) .data-ellipsis',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        },
        show_all_versions: '[data-testid="quick-link-show-all-versions"]'
      }
    }
  }
}

export default {
  mlFunctions: {
    Table_Name_Filter_Input: inputGroup(
      generateInputGroup(
        '.content .content__action-bar-wrapper [data-testid="name-form-field-input"]',
        true,
        false
      )
    ),
    Table_FilterBy_Button: By.css('[data-testid="filter-menu-btn-tooltip-wrapper"]'),
    New_Function_Button: By.css('.content [data-testid="btn"]'),
    Table_Refresh_Button: By.css(
      '.content [data-testid="refresh-tooltip-wrapper"]'
    ),
    Expand_All_Button: By.css('.action-bar [data-testid="toggle-collapse-tooltip-wrapper"]'),
    Table_Expand_Rows_Button: By.css('#main-table-body .table-body__cell.table-cell-name svg'),
    Functions_Table: commonTable(functionsTable),
    Date_Picker_Filter_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '[data-testid="date-picker-container"]',
        '[data-testid="date-picker-input"]',
        '.date-picker__pop-up .select__item',
        '.data-ellipsis .data-ellipsis',
        false
      )
    ),
    History_Back_Button: By.css('.history-back-link .history-back-link__icon'),
    Version_History_Title: By.css(
      '.history-back-link .history-back-link__title [data-testid="version-history"]'
    ),
    Version_History_Model_Name: By.css(
      '.history-back-link .history-back-link__title .data-ellipsis.tooltip-wrapper'
    )
  }
}
