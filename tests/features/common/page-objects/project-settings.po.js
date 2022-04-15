import { By } from 'selenium-webdriver'
import commonTable from '../components/table.component'
import inputGroup from '../components/input-group.component'
import { generateInputGroup } from '../../common-tools/common-tools'

const tabSelector = {
  root: '.content-menu',
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

const parametersTable = {
  root: '.key-value-table.settings__params',
  header: {
    root: '.table-row__header ',
    sorters: {
      key: '.table-cell__key',
      value: '.table-cell__value'
    }
  },
  body: {
    root: '.key-value-table__body',
    add_row_btn: '.table-row .add-new-item-btn',
    row: {
      root: '.table-row',
      fields: {
        key: '.table-cell__key',
        value: '.table-cell__value',
        remove_btn: '.table-cell__actions .key-value-table__btn:nth-of-type(2)'
      }
    }
  }
}

const secretsTable = {
  root: '.settings__secrets',
  header: {
    root: '.table-row__header',
    sorters: {
      key: '.table-cell__key',
      value: '.table-cell__value'
    }
  },
  body: {
    add_row_btn: '.add-new-item-btn',
    save_row_btn: '.btn-add',
    row: {
      root: '.table-row:not(.table-row__header)',
      fields: {
        key: '.table-cell__key',
        value: '.table-cell__value',
        key_input: '.table-cell__key input',
        value_input: '.table-cell__value input',
        edit_btn: '.table-cell__actions .key-value-table__btn:nth-of-type(1)',
        remove_btn: '.table-cell__actions .key-value-table__btn:nth-of-type(2)'
      }
    }
  }
}

module.exports = {
  generalTab: {
    Project_Settings_Tab_Selector: commonTable(tabSelector),
    Source_URL_Edit_Button: By.css('.settings__card-content .settings__source'),
    Source_URL_Edit_Input: inputGroup(
      generateInputGroup(
        '.settings__card-content .settings__source .input-wrapper',
        true,
        false,
        true
      )
    ),
    Artifact_Path_Input: inputGroup(
      generateInputGroup(
        '.settings__card-content .settings__artifact-path .input-wrapper',
        true,
        false,
        true
      )
    ),
    Parameters_Table: commonTable(parametersTable),
    Parameters_Table_Key_Input: inputGroup(
      generateInputGroup(
        '.key-value-table.settings__params .table-row__last .table-cell__key .input-wrapper',
        true,
        false,
        true
      )
    ),
    Parameters_Table_Value_Input: inputGroup(
      generateInputGroup(
        '.key-value-table.settings__params .table-row__last .table-cell__value .input-wrapper',
        true,
        false,
        true
      )
    ),
    Parameters_Table_Add_Row_Button: By.css(
      '.key-value-table.settings__params .table-cell__actions .btn-add:nth-of-type(1)'
    ),
    Parameters_Table_Discard_Row_Button: By.css(
      '.key-value-table.settings__params .table-cell__actions .btn-add:nth-of-type(2)'
    )
  },
  secretsTab: {
    Secrets_Table: commonTable(secretsTable),
    Add_Secret_Button: By.css('.table-row__last .add-new-item-btn')
  }
}
