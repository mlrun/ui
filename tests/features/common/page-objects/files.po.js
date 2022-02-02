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
  root: '.table-container .table .table__content',
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
      root: '.table-body__row',
      fields: {
        expand_btn: '.table-body__cell:nth-of-type(1) svg.expand-arrow',
        name: '.table-body__cell:nth-of-type(1) a .name-wrapper span',
        type: '.table-body__cell:nth-of-type(2) .data-ellipsis',
        labels: '.table-body__cell:nth-of-type(3)',
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
    Table_Tree_Filter_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '.content .content__action-bar .filters .tag-filter',
        'input',
        '.tag-filter__dropdown .tag-filter__dropdown-item',
        '',
        true
      )
    ),
    Table_Name_Filter_Input: inputGroup(
      generateInputGroup(
        '.content .content__action-bar .filters .input-wrapper:nth-of-type(2)',
        true
      )
    ),
    Table_Label_Filter_Input: inputGroup(
      generateInputGroup(
        '.content .content__action-bar .input-wrapper:nth-of-type(3)',
        true
      )
    ),
    Show_Iterations_Checkbox: checkboxComponent({
      root: '.content .content__action-bar .filters .checkbox',
      elements: {
        checkbox: 'svg[class]',
        name: '',
        icon: ''
      }
    }),
    Table_Refresh_Button: By.css(
      '.content .content__action-bar .actions #refresh'
    ),
    Files_Table: commonTable(filesTable),
    Register_File_Button: By.css('.page-actions-container .btn_register')
  }
}
