import { By } from 'selenium-webdriver'
import commonTable from '../components/table.component'
import dropdownComponent from '../components/dropdown.component'
import actionMenu from '../components/action-menu.component'
import inputGroup from '../components/input-group.component'
import {
  generateInputGroup,
  generateDropdownGroup
} from '../../common-tools/common-tools'

// Feature Sets
const tabSelector = {
  root: '.content-menu',
  header: {},
  body: {
    root: 'ul.content-menu__list',
    row: {
      root: '.content-menu__item',
      fields: {
        tab: 'a'
      }
    }
  }
}

const actionMenuStructure = {
  root: 'div.actions-menu__container',
  menuElements: {
    open_button: 'button',
    options: 'div.actions-menu__body div.actions-menu__option'
  }
}

const labelsTable = {
  root: 'div.table-body__cell:nth-of-type(3)',
  header: {},
  body: {
    root: 'div.chips-wrapper',
    row: {
      root: 'div.chip-block',
      field: {
        label: 'span.chip > div.chip_short'
      }
    }
  }
}

const labelsDropdown = {
  root: 'div.table-body__cell:nth-of-type(3)',
  dropdownElements: {
    open_button: 'div.chip-block span.chips_button',
    options:
      'div.chip-block div.chip-block-hidden_visible div.data-ellipsis.tooltip-wrapper',
    option_name: 'span.chip > div.chip_short'
  }
}

const featureSetsTable = {
  root: '.content .table-container .table__content',
  header: {
    root: 'div.table-head',
    sorters: {
      name: 'div.table-head__item:nth-of-type(1) div.data-ellipsis',
      description: 'div.table-head__item:nth-of-type(2) div.data-ellipsis',
      labels: 'div.table-head__item:nth-of-type(3) div.data-ellipsis',
      entity: 'div.table-head__item:nth-of-type(4) div.data-ellipsis',
      targets: 'div.table-head__item:nth-of-type(5) div.data-ellipsis'
    }
  },
  body: {
    root: 'div.table-body',
    row: {
      root: 'div.table-body__row',
      fields: {
        expand_btn: 'div.table-body__cell:nth-of-type(1) svg.expand-arrow',
        name:
          'div.table-body__cell:nth-of-type(1) a div.data-ellipsis:nth-of-type(1) span',
        description: 'div.table-body__cell:nth-of-type(2) > div.data-ellipsis',
        labels_table: {
          componentType: commonTable,
          structure: labelsTable
        },
        labels_dropdown: {
          componentType: dropdownComponent,
          structure: labelsDropdown
        },
        entity: 'div.table-body__cell:nth-of-type(4) > div.data-ellipsis',
        targets: 'div.table-body__cell:nth-of-type(5) > div.data-ellipsis',
        copy_uri: 'div.table-body__cell:nth-of-type(6) > button',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

// Features
const featuresTable = {
  root: '.table-container .table .table__content',
  header: {
    root: 'div.table-head',
    sorters: {
      feature_name: 'div.table-head__item:nth-of-type(1) div.data-ellipsis',
      feature_set: 'div.table-head__item:nth-of-type(2) div.data-ellipsis',
      type: 'div.table-head__item:nth-of-type(3) div.data-ellipsis',
      entity: 'div.table-head__item:nth-of-type(4) div.data-ellipsis',
      description: 'div.table-head__item:nth-of-type(5) div.data-ellipsis',
      labels: 'div.table-head__item:nth-of-type(6) div.data-ellipsis',
      targets: 'div.table-head__item:nth-of-type(7) div.data-ellipsis',
      validator: 'div.table-head__item:nth-of-type(8) div.data-ellipsis'
    }
  },
  body: {
    root: 'div.table-body',
    row: {
      root: 'div.table-body__row',
      fields: {
        expand_btn: 'div.table-body__cell:nth-of-type(2) svg.expand-arrow',
        feature_name: 'div.table-body__cell:nth-of-type(1) div.data-ellipsis',
        feature_set: 'div.table-body__cell:nth-of-type(2) div.link',
        type: 'div.table-body__cell:nth-of-type(3) div.data-ellipsis',
        entity: 'div.table-body__cell:nth-of-type(4) div.data-ellipsis',
        description: 'div.table-body__cell:nth-of-type(5) div.data-ellipsis',
        labels: 'div.table-body__cell:nth-of-type(6)',
        targets: 'div.table-body__cell:nth-of-type(7)',
        validator:
          'div.table-body__cell:nth-of-type(8) div.feature-validator div.data-ellipsis',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

// Feature Vectors
const featureVectorTable = {
  root: '.table-container .table .table__content',
  header: {
    root: 'div.table-head',
    sorters: {
      name: 'div.table-head__item:nth-of-type(1) div.data-ellipsis',
      description: 'div.table-head__item:nth-of-type(2) div.data-ellipsis',
      labels: 'div.table-head__item:nth-of-type(3) div.data-ellipsis',
      updated: 'div.table-head__item:nth-of-type(4) div.data-ellipsis'
    }
  },
  body: {
    root: 'div.table-body',
    row: {
      root: 'div.table-body__row',
      fields: {
        expand_btn: 'div.table-body__cell:nth-of-type(1) svg.expand-arrow',
        name: 'div.table-body__cell:nth-of-type(1) a span.link',
        description: 'div.table-body__cell:nth-of-type(2) div.data-ellipsis',
        labels_table: {
          componentType: commonTable,
          structure: labelsTable
        },
        updated: 'div.table-body__cell:nth-of-type(4) div.data-ellipsis',
        copy_uri: 'div.table-body__cell:nth-of-type(6) > button',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

// Datasets
const datasetsTable = {
  root: '.table-container .table .table__content',
  header: {
    root: 'div.table-head',
    sorters: {
      name: 'div.table-head__item:nth-of-type(1) div.data-ellipsis'
    }
  },
  body: {
    root: 'div.table-body',
    row: {
      root: 'div.table-body__row',
      fields: {
        expand_btn: 'div.table-body__cell:nth-of-type(1) svg.expand-arrow',
        name: 'div.table-body__cell:nth-of-type(1) div.data-ellipsis span.link',
        labels: 'div.table-body__cell:nth-of-type(2)',
        producer:
          'div.table-body__cell:nth-of-type(3) div.data-ellipsis a.link',
        owner: 'div.table-body__cell:nth-of-type(4) div.data-ellipsis',
        uploaded: 'div.table-body__cell:nth-of-type(5) div.data-ellipsis',
        size: 'div.table-body__cell:nth-of-type(6) div.data-ellipsis',
        artifact_preview_btn: 'div.table-body__cell:nth-of-type(7) button',
        download_btn:
          'div.table-body__cell:nth-of-type(8) div.download-container',
        copy_uri: 'div.table-body__cell:nth-of-type(9) > button',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

// Common components
const featureStoreTabSelector = commonTable(tabSelector)
const tableRefreshButton = By.css('.content__action-bar .actions #refresh')
const pageHeaderButton = By.css(
  'div.content__header div.page-actions-container button'
)
const commonNameFilterInput = inputGroup(
  generateInputGroup(
    '.content .content__action-bar .input-wrapper:nth-of-type(2)',
    true,
    false,
    true
  )
)
const commonLabelFilterInput = inputGroup(
  generateInputGroup(
    '.content .content__action-bar .input-wrapper:nth-of-type(3)',
    true,
    false,
    true
  )
)
const commonTableTreeFilterDropdown = dropdownComponent(
  generateDropdownGroup(
    '.content .content__action-bar .filters .tag-filter',
    'input',
    '.tag-filter__dropdown .tag-filter__dropdown-item',
    ''
  )
)

module.exports = {
  featureSetsTab: {
    Table_Refresh_Button: tableRefreshButton,
    Create_Set_Button: pageHeaderButton,
    Table_Expand_Rows_Button: By.css(
      'div.feature-store-container div.content__action-bar div.data-ellipsis:nth-of-type(2) button'
    ),
    Table_Tag_Filter_Dropdown: commonTableTreeFilterDropdown,
    Table_Name_Filter_Input: commonNameFilterInput,
    Table_Label_Filter_Input: commonLabelFilterInput,
    Feature_Sets_Table: commonTable(featureSetsTable),
    Feature_Store_Tab_Selector: featureStoreTabSelector
  },
  featuresTab: {
    Feature_Store_Tab_Selector: featureStoreTabSelector,
    Add_To_Feature_Vector_Button: By.css(
      'div.feature-store-container div.content__action-bar div.add-to-feature-vector button'
    ),
    Table_Name_Filter_Input: commonNameFilterInput,
    Table_Label_Filter_Input: commonLabelFilterInput,
    Table_Tag_Filter_Dropdown: commonTableTreeFilterDropdown,
    Table_Refresh_Button: tableRefreshButton,
    Features_Table: commonTable(featuresTable)
  },
  featureVectorsTab: {
    Feature_Store_Tab_Selector: featureStoreTabSelector,
    Create_Vector_Button: pageHeaderButton,
    Table_Name_Filter_Input: commonNameFilterInput,
    Table_Label_Filter_Input: commonLabelFilterInput,
    Table_Tag_Filter_Dropdown: commonTableTreeFilterDropdown,
    Table_Refresh_Button: tableRefreshButton,
    Feature_Vectors_Table: commonTable(featureVectorTable)
  },
  datasets: {
    Feature_Store_Tab_Selector: featureStoreTabSelector,
    Register_Dataset_Button: pageHeaderButton,
    Table_Name_Filter_Input: commonNameFilterInput,
    Table_Label_Filter_Input: commonLabelFilterInput,
    Table_Tree_Filter_Dropdown: commonTableTreeFilterDropdown,
    Table_Refresh_Button: tableRefreshButton,
    Feature_Datasets_Table: commonTable(datasetsTable)
  }
}
