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
import checkboxComponent from '../components/checkbox.component'
import commonTable from '../components/table.component'
import actionMenu from '../components/action-menu.component'
import {
  generateCheckboxGroup,
  generateInputGroup,
  generateLabelGroup
} from '../../common-tools/common-tools'
import labelComponent from '../components/label.component'

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
        expand_btn: '.table-body__cell:nth-of-type(1) svg.expand-arrow',
        name: '.table-body__cell:nth-of-type(1) a .name-wrapper .link', 
        tag: '.table-body__cell:nth-of-type(1) a .item-tag span',
        name_expand_btn: '.table-body__cell:nth-of-type(1) a .name-wrapper .item-tag',
        status: '.table-body__cell:nth-of-type(1) .status i',
        kind: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.table-body__cell:nth-of-type(2)',
            '.data-ellipsis',
            true,
            '.tooltip .tooltip__text span' 
          )
        },
        hash: '.table-body__cell:nth-of-type(3) .data-ellipsis span',
        updated: '.table-body__cell:nth-of-type(4) .data-ellipsis',
        command: '.table-body__cell:nth-of-type(5) .data-ellipsis',
        image: '.table-body__cell:nth-of-type(6) .data-ellipsis',
        deploy: '[data-testid="quick-link-deploy"]',
        description: '.table-body__cell:nth-of-type(7) .data-ellipsis',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

module.exports = {
  mlFunctions: {
    Table_Name_Filter_Input: inputGroup(
      generateInputGroup(
        '.content .content__action-bar-wrapper .filters .input-wrapper',
        true,
        false
      )
    ),
    Show_Untagged_Functions_Checkbox: checkboxComponent(
      generateCheckboxGroup(
        '.content .content__action-bar-wrapper .checkbox.filters-checkbox',
        true,
        false,
        false
      )
    ),
    New_Function_Button: By.css('.content .new-function button'),
    Table_Refresh_Button: By.css(
      '.content .content__action-bar-wrapper .actions .data-ellipsis:nth-of-type(1) button'
    ),
    Table_Expand_Rows_Button: By.css(
      '.content .content__action-bar-wrapper .actions .data-ellipsis:nth-of-type(1) button'
    ),
    Functions_Table: commonTable(functionsTable)
  }
}
