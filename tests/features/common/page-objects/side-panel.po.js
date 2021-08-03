import inputGroup from '../components/input-group.component'
import commonTable from '../components/table.component'
import dropdownComponent from '../components/dropdown.component'
import checkboxComponent from '../components/checkbox.component'
import radiobuttonComponent from '../components/radio-button.component'
import { generateInputGroup } from '../../common-tools/common-tools'
const { By } = require('selenium-webdriver')

const labelsTable = {
  root: 'div.panel-title__labels-container div.panel-title__labels-wrapper',
  header: {},
  body: {
    root: 'div.chips-wrapper',
    add_row_btn: 'button.button-add',
    row: {
      root: 'div.chip-block',
      fields: {
        key_input: 'input.input-label-key',
        value_input: 'input.input-label-value',
        // key_input: {
        //   componentType: inputGroup,
        //   structure: {
        //     root: '',
        //     elements: {
        //       input: 'input.input-label-key'
        //     }
        //   }
        // },
        // value_input: {
        //   componentType: inputGroup,
        //   structure: {
        //     root: '',
        //     elements: {
        //       input: 'input.input-label-value'
        //     }
        //   }
        // },
        label: 'div.chip_short',
        remove_btn: '.item-icon-close'
      }
    }
  }
}

const dataSorceKindDropdown = {
  root:
    'div.feature-set-panel div.accordion__container:nth-of-type(1) div.panel-section__body div.select',
  dropdownElements: {
    open_button: 'div.select__header div.select__value',
    options: 'div.select__body div.select__item',
    option_name: 'div.data-ellipsis > div.data-ellipsis'
  }
}

const dataSorceAttributesTable = {
  root: 'div.data-source__table',
  header: {
    root: 'div.table-row__header',
    sorters: {
      attribute_name: 'div.table-cell__key',
      value: 'div.table-cell__value'
    }
  },
  body: {
    add_row_btn: 'div.table-row button.add-new-item-btn',
    offset: 1,
    row: {
      root: 'div[class*=table-row]:not([class*=table-row__header])',
      fields: {
        attribute_name: 'div.table-cell__key',
        value: 'div.table-cell__value',
        action: 'div.table-cell__actions',
        attribute_name_input: 'div.table-cell__key input',
        value_input: 'div.table-cell__value input',
        add_row_btn: 'button'
      }
    }
  }
}

const partitionGranularityDropdown = {
  root:
    'div.feature-set-panel div.accordion__container:nth-of-type(3) div.panel-section__body div.target-store__item:nth-of-type(2) div.select',
  dropdownElements: {
    open_button: 'div.select__header div.select__value',
    options: 'div.select__body div.select__item',
    option_name: 'div.data-ellipsis > div.data-ellipsis'
  }
}

const fileTypeDropdown = {
  root:
    'div.feature-set-panel div.accordion__container:nth-of-type(3) div.panel-section__body div.target-store__item:nth-of-type(3) div.select',
  dropdownElements: {
    open_button: 'div.select__header div.select__value',
    options: 'div.select__body div.select__item',
    option_name: 'div.data-ellipsis > div.data-ellipsis'
  }
}

module.exports = {
  newFeatureSet: {
    Cross_Close_Button: By.css(
      'div.feature-set-panel button.panel-title__btn_close'
    ),
    Feature_Set_Name_Input: inputGroup(
      generateInputGroup(
        'div.feature-set-panel div.panel-title div.name',
        true,
        true,
        true
      )
    ),
    Version_Input: inputGroup(
      generateInputGroup(
        'div.feature-set-panel div.panel-title div.version',
        true,
        false,
        true
      )
    ),
    Description_Input: inputGroup({
      root: 'div.feature-set-panel div.panel-title div.text-area-wrapper',
      elements: {
        input: 'textarea',
        label: 'label'
      }
    }),
    Labels_Table: commonTable(labelsTable),
    Data_Source_Accordion: {
      Accordion_Header: By.css(
        'div.feature-set-panel div.accordion__container:nth-of-type(1) h5'
      ),
      Collapse_Button: By.css(
        'div.feature-set-panel div.accordion__container:nth-of-type(1) button.new-item-side-panel__expand-icon'
      ),
      URL_Input: inputGroup(
        generateInputGroup(
          'div.feature-set-panel div.accordion__container:nth-of-type(1) div.panel-section__body div.input-wrapper:nth-of-type(2)',
          true,
          false,
          true
        )
      ),
      Key_Input: inputGroup(
        generateInputGroup(
          'div.feature-set-panel div.accordion__container:nth-of-type(1) div.panel-section__body div.input-wrapper:nth-of-type(3)',
          true,
          false,
          false
        )
      ),
      Time_Input: inputGroup(
        generateInputGroup(
          'div.feature-set-panel div.accordion__container:nth-of-type(1) div.panel-section__body div.input-wrapper:nth-of-type(4)',
          true,
          false,
          false
        )
      ),
      Kind_Dropdown: dropdownComponent(dataSorceKindDropdown),
      Attributes_Table: commonTable(dataSorceAttributesTable)
    },
    Schema_Accordion: {
      Accordion_Header: By.css(
        'div.feature-set-panel div.accordion__container:nth-of-type(2) h5'
      ),
      Collapse_Button: By.css(
        'div.feature-set-panel div.accordion__container:nth-of-type(2) button.new-item-side-panel__expand-icon'
      ),
      Entities_Input: By.css(
        'div.feature-set-panel div.accordion__container:nth-of-type(2) div.input-wrapper:nth-of-type(2) input'
      ),
      Timestamp_Input: By.css(
        'div.feature-set-panel div.accordion__container:nth-of-type(2) div.input-wrapper:nth-of-type(2) input'
      )
    },
    Target_Store_Accordion: {
      Accordion_Header: By.css(
        'div.feature-set-panel div.accordion__container:nth-of-type(3) h5'
      ),
      Collapse_Button: By.css(
        'div.feature-set-panel div.accordion__container:nth-of-type(3) button.new-item-side-panel__expand-icon'
      ),
      // online group
      Online_Checkbox: checkboxComponent({
        root:
          'div.feature-set-panel div.accordion__container:nth-of-type(3) div.accordion__body div.target-store__item:nth-of-type(1) span.checkbox',
        elements: {
          checkbox: 'svg[class]',
          name: '',
          icon: 'svg:not([class])'
        }
      }),
      Online_Path_Input: inputGroup(
        generateInputGroup(
          'div.feature-set-panel div.accordion__container:nth-of-type(3) div.panel-section__body div.target-store__item:nth-of-type(1) div.input-wrapper',
          true,
          false,
          true
        )
      ),
      // Offline group
      Offline_Checkbox: checkboxComponent({
        root:
          'div.feature-set-panel div.accordion__container:nth-of-type(3) div.accordion__body div.target-store__item:nth-of-type(2) span.checkbox',
        elements: {
          checkbox: 'svg[class]',
          name: '',
          icon: 'svg:not([class])'
        }
      }),
      Offline_Path_Input: inputGroup(
        generateInputGroup(
          'div.feature-set-panel div.accordion__container:nth-of-type(3) div.panel-section__body div.target-store__item:nth-of-type(2) div.input-wrapper',
          true,
          false,
          true
        )
      ),
      Offline_Partition_Checkbox: checkboxComponent({
        root:
          'div.feature-set-panel div.accordion__container:nth-of-type(3) div.panel-section__body div.target-store__item:nth-of-type(2) div.target-store__inputs-container span.checkbox',
        elements: {
          checkbox: 'svg[class]',
          name: '',
          icon: 'svg:not([class])'
        }
      }),
      Offline_Partition_Key_Buckering_Number_Input: inputGroup(
        generateInputGroup(
          'div.feature-set-panel div.accordion__container:nth-of-type(3) div.panel-section__body div.target-store__item:nth-of-type(2) div.input-wrapper',
          true,
          'div.input__tip svg',
          false
        )
      ),
      Offline_Partition_Columns_Input: inputGroup(
        generateInputGroup(
          'div.feature-set-panel div.accordion__container:nth-of-type(3) div.panel-section__body div.target-store__item:nth-of-type(2) div.target-store__inputs-container > div.partition-cols.input-wrapper',
          true,
          false,
          false
        )
      ),
      Offline_Partition_Granularity_Dropdown: dropdownComponent(
        partitionGranularityDropdown
      ),
      // Other group
      Other_Checkbox: checkboxComponent({
        root:
          'div.feature-set-panel div.accordion__container:nth-of-type(3) div.accordion__body div.target-store__item:nth-of-type(3) span.checkbox',
        elements: {
          checkbox: 'svg[class]',
          name: '',
          icon: 'svg:not([class])'
        }
      }),
      File_Type_Dropdown: dropdownComponent(fileTypeDropdown),
      URL_Input: inputGroup(
        generateInputGroup(
          'div.feature-set-panel div.accordion__container:nth-of-type(3) div.input-wrapper',
          true,
          false,
          false
        )
      )
    },
    No_Transformation_Radiobutton: radiobuttonComponent({
      root:
        'div.feature-set-panel div.radio-buttons div.radio-buttons__content:nth-of-type(1)',
      elements: {
        radiobutton: 'label.radio-button input',
        mark: 'label.radio-button .checkmark',
        name: 'span.radio-button__label',
        description: 'span.radio-button__info'
      }
    }),
    Add_Transformation_Via_API_Radiobutton: radiobuttonComponent({
      root:
        'div.feature-set-panel div.radio-buttons div.radio-buttons__content:nth-of-type(2)',
      elements: {
        radiobutton: 'label.radio-button input',
        mark: 'label.radio-button .checkmark',
        name: 'span.radio-button__label',
        description: 'span.radio-button__info'
      }
    }),
    Cancel_Batton: By.css(
      'div.feature-set-panel div.new-item-side-panel__buttons-container button.pop-up-dialog__btn_cancel'
    ),
    Save_Batton: By.css(
      'div.feature-set-panel div.new-item-side-panel__buttons-container button[class="btn btn-secondary"]'
    ),
    Save_And_Ingest_Button: By.css(
      'div.feature-set-panel div.new-item-side-panel__buttons-container button.btn_start-ingestion'
    )
  }
}
