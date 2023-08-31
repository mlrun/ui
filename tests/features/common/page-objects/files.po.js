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
import {
  generateInputGroup,
  generateDropdownGroup
} from '../../common-tools/common-tools'
import dropdownComponent from '../components/dropdown.component'
import checkboxComponent from '../components/checkbox.component'
import commonTable from '../components/table.component'
import actionMenu from '../components/action-menu.component'

const actionMenuStructure = {
  root: '.actions-menu__container',
  menuElements: {
    open_button: 'button',
    options: '.actions-menu__body .actions-menu__option'
  }
}

const filesTable = {
  root: '.table-container .table__flex .table__content',
  header: {
    root: '.table-head',
    sorters: {
      name: '.table-head__item:nth-of-type(1) .data-ellipsis',
      type: '.table-head__item:nth-of-type(2) .data-ellipsis',
      labels: '.table-head__item:nth-of-type(3) .data-ellipsis',
      producer: '.table-head__item:nth-of-type(4) .data-ellipsis',
      owner: '.table-head__item:nth-of-type(5) .data-ellipsis',
      updated: '.table-head__item:nth-of-type(6) .data-ellipsis',
      size: '.table-head__item:nth-of-type(7) .data-ellipsis'
    }
  },
  body: {
    root: '.table-body',
    row: {
      root: '.table-row',
      fields: {
        name: '.table-body__cell:nth-of-type(1) a .name-wrapper .link', 
        name_expand_btn: '.table-body__cell:nth-of-type(1) a .name-wrapper .item-tag',
        expand_btn: '.table-body__cell:nth-of-type(1) svg.expand-arrow',
        type: '.table-body__cell:nth-of-type(2) .data-ellipsis',
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
        producer: '.table-body__cell:nth-of-type(4) .data-ellipsis a',
        owner: '.table-body__cell:nth-of-type(5) .data-ellipsis',
        updated: '.table-body__cell:nth-of-type(6) .data-ellipsis',
        size: '.table-body__cell:nth-of-type(7) .data-ellipsis',
        preview: '.table-body__cell:nth-of-type(8) button .data-ellipsis svg',
        download: '.table-body__cell:nth-of-type(9) button .data-ellipsis svg',
        uri: '.table-body__cell:nth-of-type(10) button .data-ellipsis svg',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

module.exports = {
  filesTab: {
    Table_Name_Filter_Input: inputGroup(
      generateInputGroup(
        '.content .content__action-bar-wrapper .action-bar__filters .name-filter',
        true
      )
    ),
    Table_Refresh_Button: By.css(
      '.content .content__action-bar-wrapper .action-bar__actions #refresh'
    ),
    Files_Table: commonTable(filesTable),
    Register_File_Button: By.css('.page-actions-container .btn_register'),
    Table_FilterBy_Button: By.css('.content .content__action-bar-wrapper .action-bar__filters .filters-button button')
  }
}
