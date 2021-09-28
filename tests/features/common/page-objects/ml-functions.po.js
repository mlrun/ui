import { By } from 'selenium-webdriver'
import inputGroup from '../components/input-group.component'
import checkboxComponent from '../components/checkbox.component'
import commonTable from '../components/table.component'
import actionMenu from '../components/action-menu.component'
import { generateInputGroup } from '../../common-tools/common-tools'

const actionMenuStructure = {
  root: 'div.actions-menu__container',
  menuElements: {
    open_button: 'button',
    options: 'div.actions-menu__body div.actions-menu__option'
  }
}

const functionsTable = {
  root: '.table-container .table .table__content',
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
      root: '.table-body__row',
      fields: {
        expand_btn: '',
        name: '.table-body__cell:nth-of-type(1) a .item-name span',
        tag: '.table-body__cell:nth-of-type(1) a .item-tag span',
        status: '.table-body__cell:nth-of-type(1) .status i',
        kind: '.table-body__cell:nth-of-type(2) svg',
        hash: '.table-body__cell:nth-of-type(3) .data-ellipsis span',
        updated: '.table-body__cell:nth-of-type(4) .data-ellipsis',
        command: '.table-body__cell:nth-of-type(5) .data-ellipsis',
        image: '.table-body__cell:nth-of-type(6) .data-ellipsis',
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
        '.content .content__action-bar .filters .input-wrapper',
        true,
        false
      )
    ),
    Show_Untagged_Functions_Checkbox: checkboxComponent({
      root: '.content .content__action-bar .checkbox.filters-checkbox',
      elements: {
        checkbox: 'svg[class]',
        name: '',
        icon: ''
      }
    }),
    New_Function_Button: By.css('.content .new-function .data-ellipsis button'),
    Table_Refresh_Button: By.css(
      '.content .content__action-bar .actions .data-ellipsis:nth-of-type(1) button'
    ),
    Table_Expand_Rows_Button: By.css(
      '.content .content__action-bar .actions .data-ellipsis:nth-of-type(1) button'
    ),
    Functions_Table: commonTable(functionsTable)
  }
}
