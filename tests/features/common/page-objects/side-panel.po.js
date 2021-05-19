import inputGroup from '../components/input-group.component'
import commonTable from '../components/table.component'
import dropdownComponent from '../components/dropdown.component'
import checkboxComponent from '../components/checkbox.component'
import radiobuttonComponent from '../components/radio-button.component'
const { By } = require('selenium-webdriver')

function generateInputGroup(
  root,
  label = false,
  hint = false,
  warning = false
) {
  const structure = { elements: {} }
  structure.root = root
  structure.elements.input = 'input'
  if (label) {
    structure.elements.label = 'label'
  }
  // console.log('debug1: ', hint)
  if (hint) {
    // console.log('debug1: ', root, 'div.tip-container svg')
    structure.elements.hint = 'div.tip-container svg'
  }
  if (warning) {
    structure.elements.warningHint = 'div.input__warning svg'
    structure.elements.warningText = 'div.tooltip div.tooltip__text'
  }
  return structure
}

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
  root: 'div.new-item-side-panel__table',
  header: {
    root: 'div.table__header',
    sorters: {
      attribute_name: 'div.table__cell:nth-of-type(1)',
      value: 'div.table__cell:nth-of-type(2)'
    }
  },
  body: {
    add_row_btn: 'div.table__row button.add-input',
    offset: 1,
    row: {
      root: 'div[class^=table__row]',
      fields: {
        attribute_name: 'div.table__cell:nth-of-type(1) div.data-ellipsis',
        value: 'div.table__cell:nth-of-type(2) div.data-ellipsis',
        action: 'div.table__cell:nth-of-type(3)',
        attribute_name_input: 'div.input-wrapper:nth-of-type(1) input',
        value_input: 'div.input-wrapper:nth-of-type(2) input',
        add_row_btn: 'button'
      }
    }
  }
}

const schemaCellTypeDropdown = {
  root: 'div.select ',
  dropdownElements: {
    open_button: 'div.select__header div.select__value',
    options: 'div.select__body div.select__item',
    option_name: 'div.data-ellipsis div.data-ellipsis'
  }
}

const schemaAttributesTable = {
  root:
    'div.feature-set-panel div.accordion__container:nth-of-type(2) div.panel-section__body div.schema__table',
  header: {
    root: 'div.table__header',
    sorters: {
      attribute_name: 'div.table__cell:nth-of-type(1)',
      type: 'div.table__cell:nth-of-type(2)'
    }
  },
  body: {
    offset: 1,
    add_row_btn: 'div.table__row button.add-input',
    row: {
      root: 'div[class^=table__row]',
      fields: {
        entity_name: 'div.table__cell:nth-of-type(1) div.data-ellipsis',
        type: 'div.table__cell:nth-of-type(2) div.data-ellipsis',
        remove_btn:
          'div.table__cell:nth-of-type(3) div.data-ellipsis .btn_delete',
        entity_name_input: 'div.input-wrapper input',
        type_dropdown: {
          componentType: dropdownComponent,
          structure: schemaCellTypeDropdown
        },
        add_row_btn: 'button'
      }
    }
  }
}

const fileTypeDropdown = {
  root:
    'div.feature-set-panel div.accordion__container:nth-of-type(3) .target-store__inputs-container div.select',
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
      Timestamp_Input: By.css(
        'div.feature-set-panel div.accordion__container:nth-of-type(2) div.input-wrapper input'
      ),
      Schema_Attributes_Table: commonTable(schemaAttributesTable)
    },
    Target_Store_Accordion: {
      Accordion_Header: By.css(
        'div.feature-set-panel div.accordion__container:nth-of-type(3) h5'
      ),
      Collapse_Button: By.css(
        'div.feature-set-panel div.accordion__container:nth-of-type(3) button.new-item-side-panel__expand-icon'
      ),
      Online_Checkbox: checkboxComponent({
        root:
          'div.feature-set-panel div.accordion__container:nth-of-type(3) div.accordion__body div.target-store__checkbox-container span.checkbox:nth-of-type(1)',
        elements: {
          checkbox: 'svg[class]',
          name: '',
          icon: 'svg:not([class])'
        }
      }),
      Offline_Checkbox: checkboxComponent({
        root:
          'div.feature-set-panel div.accordion__container:nth-of-type(3) div.accordion__body div.target-store__checkbox-container span.checkbox:nth-of-type(2)',
        elements: {
          checkbox: 'svg[class]',
          name: '',
          icon: 'svg:not([class])'
        }
      }),
      Other_Checkbox: checkboxComponent({
        root:
          'div.feature-set-panel div.accordion__container:nth-of-type(3) div.accordion__body div.target-store__checkbox-container span.checkbox:nth-of-type(3)',
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
