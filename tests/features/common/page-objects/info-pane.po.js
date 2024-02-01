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
import actionMenu from '../components/action-menu.component'
import commonTable from '../components/table.component'
import {
  generateInputGroup,
  generateLabelGroup,
  generateTextAreaGroup,
  generateDropdownGroup
} from '../../common-tools/common-tools'
import labelComponent from '../components/label.component'
import inputGroup from '../components/input-group.component'
import graph from '../components/graph.component'
import { By } from 'selenium-webdriver'
import textAreaGroup from '../components/text-area.component'
import dropdownComponent from '../components/dropdown.component'

// TO DO: that is duplicate from Feature Store PO. In feature that should be fixed
const actionMenuStructure = {
  root: '.table__item .item-header__buttons > .actions-menu__container',
  menuElements: {
    open_button: 'button',
    options: '.actions-menu__body .actions-menu__option'
  }
}

const infoPaneTabSelector = {
  root: '.table__item .tabs-slider__tabs',
  header: {},
  body: {
    row: {
      root: 'a',
      fields: {
        key: '',
        hintButton: '.tip-container'
      }
    }
  }
}

const infoPaneOverviewHeaders = {
  root: '.table__item .item-info__details-wrapper:nth-of-type(1)',
  header: {},
  body: {
    row: {
      root: 'li:not(li.details-item_hidden)',
      fields: {
        key: '.details-item__header',
        link: '.details-item__data .link',
        value: '.details-item__data'
      }
    }
  }
}

const infoPaneOverviewProducerHeaders = {
  root: '.table__item .item-info__details-wrapper:nth-of-type(2)',
  header: {},
  body: {
    row: {
      root: '.item-info__details',
      fields: {
        key: '.details-item__header',
        link: '.details-item__data .link',
        value: '.details-item__data'
      }
    }
  }
}

const infoPaneOverviewSourcesHeaders = {
  root: '.table__item .item-info__details-wrapper:nth-of-type(2)',
  header: {},
  body: {
    row: {
      root: '.info-sources',
      fields: {
        key: '.info-sources__table-key',
        value: '.info-sources__table-value'
      }
    }
  }
}
const artifactOverviewTable = {
  root: '.table__item .item-info__details:nth-of-type(1)',
  header: {},
  body: {
    row: {
      root: '',
      fields: {
        hash: '.details-item:nth-of-type(1) .details-item__data',
        key: '.details-item:nth-of-type(2) .details-item__data',
        tag: '.details-item:nth-of-type(3) .details-item__data',
        iter: '.details-item:nth-of-type(4) .details-item__data',
        size: '.details-item:nth-of-type(5) .details-item__data',
        path: '.details-item:nth-of-type(6) .details-item__data',
        uri: '.details-item:nth-of-type(7) .details-item__data',
        uid: '.details-item:nth-of-type(8) .details-item__data',
        updated: '.details-item:nth-of-type(9) .details-item__data',
        labels: '.details-item:nth-of-type(10) .details-item__data'
      }
    }
  }
}

const datasetOverviewTable = {
  root: '.table__item .item-info__details:nth-of-type(1)',
  header: {},
  body: {
    row: {
      root: '',
      fields: {
        hash: '.details-item:nth-of-type(1) .details-item__data',
        key: '.details-item:nth-of-type(2) .details-item__data',
        tag: '.details-item:nth-of-type(3) .details-item__data',
        iter: '.details-item:nth-of-type(4) .details-item__data',
        size: '.details-item:nth-of-type(5) .details-item__data',
        path: '.details-item:nth-of-type(7) .details-item__data',
        uri: '.details-item:nth-of-type(7) .details-item__data',
        uid: '.details-item:nth-of-type(8) .details-item__data',
        updated: '.details-item:nth-of-type(9) .details-item__data',
        labels: '.details-item:nth-of-type(10) .details-item__data'
      }
    }
  }
}

const modelsOverviewTable = {
  root: '.table__item .item-info__details:nth-of-type(1)',
  header: {},
  body: {
    row: {
      root: '',
      fields: {
        hash: '.details-item:nth-of-type(1) .details-item__data',
        key: '.details-item:nth-of-type(2) .details-item__data',
        tag: '.details-item:nth-of-type(3) .details-item__data',
        iter: '.details-item:nth-of-type(4) .details-item__data',
        kind: '.details-item:nth-of-type(5) .details-item__data',
        size: '.details-item:nth-of-type(6) .details-item__data',
        path: '.details-item:nth-of-type(7) .details-item__data',
        uri: '.details-item:nth-of-type(8) .details-item__data',
        model_file: '.details-item:nth-of-type(9) .details-item__data',
        feature_vector: '.details-item:nth-of-type(10) .details-item__data',
        uid: '.details-item:nth-of-type(11) .details-item__data',
        updated: '.details-item:nth-of-type(12) .details-item__data',
        framework: '.details-item:nth-of-type(13) .details-item__data',
        algorithm: '.details-item:nth-of-type(14) .details-item__data',
        labels: '.details-item:nth-of-type(15) .details-item__data',
        metrics: '.details-item:nth-of-type(16) .details-item__data'
      }
    }
  }
}
const functionsOverviewTable = {
  root: '.table__item .item-info__details:nth-of-type(1)',
  header: {},
  body: {
    row: {
      root: '',
      fields: {
        name: '.details-item:nth-of-type(1) .details-item__data',
        kind: '.details-item:nth-of-type(2) .details-item__data',
        hash: '.details-item:nth-of-type(3) .details-item__data',
        code_origin: '.details-item:nth-of-type(4) .details-item__data',
        updated: '.details-item:nth-of-type(5) .details-item__data',
        command: '.details-item:nth-of-type(6) .details-item__data',
        image: '.details-item:nth-of-type(7) .details-item__data',
        description: '.details-item:nth-of-type(8) .details-item__data'
      }
    }
  }
}

const infoPaneDriftHeaders = {
  root: '.table__item .item-info__details-wrapper:nth-of-type(2)',
  header: {},
  body: {
    row: {
      root: 'li:not(li.details-item_hidden)',
      fields: {
        key: '.details-item__header',
        link: '.details-item__data .link',
        value: '.details-item__data'
      }
    }
  }
}

const filesInfoSourcesTable = {
  root: '.info-sources .info-sources-table',
  header: {
    root: '.info-sources-table__header',
    sorters: {
      name: '.info-sources-table__header-item:nth-of-type(1)',
      path: '.info-sources-table__header-item:nth-of-type(2)'
    }
  },
  body: {
    row: {
      root: '.info-sources-table__content',
      fields: {
        name: '.info-sources-table__content-key .data-ellipsis',
        path: '.info-sources-table__content-value'
      }
    }
  }
}

// Features Info Pane Table
const featuresInfoPaneTable = {
  root: '.table__item .details-metadata .details-metadata__table',
  header: {
    root: '.artifact-metadata__table-header',
    sorters: {
      icon: '.metadata-cell_icon .data-ellipsis',
      name: '.metadata-cell_name .data-ellipsis',
      type: '.metadata-cell_type .data-ellipsis',
      description: '.metadata-cell_description .data-ellipsis',
      labels: '.metadata-cell_labels .data-ellipsis',
      validators: '.metadata-cell_validators .data-ellipsis'
    }
  },
  body: {
    root: '.artifact-metadata__table-body',
    row: {
      root: '.artifact-metadata__table-row',
      fields: {
        icon: '.metadata-cell_icon .data-ellipsis svg',
        name: '.metadata-cell_name .data-ellipsis',
        type: '.metadata-cell_type .data-ellipsis',
        description: '.metadata-cell_description .data-ellipsis',
        labels: '.metadata-cell_labels .data-ellipsis',
        validators: '.metadata-cell_validators .data-ellipsis'
      }
    }
  }
}

// preview Info Pane Table
const previewInfoPaneTable = {
  root: '.table__item .preview_container .artifact-preview__table',
  header: {
    root: '.artifact-preview__table-header',
    sorters: {
      department: '.artifact-preview__table-content:nth-of-type(1) .data-ellipsis',
      parent_id: '.artifact-preview__table-content:nth-of-type(2) .data-ellipsis',
      room: '.artifact-preview__table-content:nth-of-type(3) .data-ellipsis',
      bad: '.artifact-preview__table-content:nth-of-type(4) .data-ellipsis',
      gender: '.artifact-preview__table-content:nth-of-type(5) .data-ellipsis',
      age: '.artifact-preview__table-content:nth-of-type(6) .data-ellipsis'
    }
  },
  body: {
    root: '.artifact-preview__table-body',
    row: {
      root: '.artifact-preview__table-row',
      fields: {
        department: '.data-ellipsis:nth-of-type(1)',
        parent_id: '.data-ellipsis:nth-of-type(2)',
        room: '.data-ellipsis:nth-of-type(3)',
        bad: '.data-ellipsis:nth-of-type(4)',
        gender: '.data-ellipsis:nth-of-type(5)',
        age: '.data-ellipsis:nth-of-type(6)'
      }
    }
  }
}

// statistics Info Pane Table
const statisticsInfoPaneTable = {
  root: '.table__item .details-statistics .details-statistics__table',
  header: {
    root: '.details-statistics__table-header',
    sorters: {
      name: '.statistics-cell_name .data-ellipsis',
      count: '.statistics-cell_count .data-ellipsis',
      mean: '.statistics-cell_mean .data-ellipsis',
      std: '.statistics-cell_std .data-ellipsis',
      min: '.statistics-cell_min .data-ellipsis',
      max: '.statistics-cell_max .data-ellipsis',
      unique: '.statistics-cell_unique .data-ellipsis',
      top: '.statistics-cell_top .data-ellipsis',
      Freq: '.statistics-cell_freq .data-ellipsis',
      histogram: '.statistics-cell_histogram .data-ellipsis'
    }
  },
  body: {
    root: '.details-statistics__table-body',
    row: {
      root: '.details-statistics__table-row',
      fields: {
        name: '.statistics-cell_name .data-ellipsis',
        count: '.statistics-cell_count .data-ellipsis',
        mean: '.statistics-cell_mean .data-ellipsis',
        std: '.statistics-cell_std .data-ellipsis',
        min: '.statistics-cell_min .data-ellipsis',
        max: '.statistics-cell_max .data-ellipsis',
        unique: '.statistics-cell_unique .data-ellipsis',
        top: '.statistics-cell_top .data-ellipsis',
        Freq: '.statistics-cell_freq .data-ellipsis',
        histogram: '.statistics-cell_histogram .data-ellipsis'
      }
    }
  }
}

const requestedFeaturesTable = {
  root: '.table__item .item-requested-features .item-requested-features__table',
  header: {
    root: '.item-requested-features__table-header',
    sorters: {
      projectName: '.header_project-name',
      featureSet: '.header_feature-set',
      feature: '.header_feature',
      alias: '.header_alias'
    }
  },
  body: {
    root: '.item-requested-features__table-body',
    row: {
      root: '.item-requested-features__table-row',
      fields: {
        labelIcon: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.item-requested-features__table-cel.cell_icon',
            false,
            false,
            '.tooltip .tooltip__text span'
          )
        },
        projectName: '.cell_project-name',
        featureSet: '.item-requested-features__table-cell:nth-of-type(3)',
        feature: '.cell_feature',
        alias: '.cell_alias',
        add_alias: '.cell_actions .round-icon-cp:nth-of-type(1)',
        edit_alias: '.cell_alias button',
        apply_btn: '.cell_actions-visible .round-icon-cp:nth-of-type(1)',
        discard_btn: '.cell_actions-visible .round-icon-cp:nth-of-type(2)',
        delete_btn: '.cell_actions .round-icon-cp:nth-of-type(2)'
      }
    }
  }
}

const inputsTable = {
  root: '.table__item .item-info .table',
  header: {
    root: '',
    sorters: {}
  },
  body: {
    root: 'ul.table__item_inputs',
    row: {
      root: 'li',
      fields: {
        name: 'div:nth-of-type(1)',
        path: 'div:nth-of-type(2)'
      }
    }
  }
}

const artifactsTable = {
  root: '.table__item .item-artifacts',
  header: {
    root: '.table-header',
    sorters: {
      sorter_icon: '.table-header__cell:nth-of-type(1) svg'
    }
  },
  body: {
    row: {
      root: '.table-row',
      fields: {
        name: '.table-body__cell:nth-of-type(1) span.link',
        path: '.item-artifacts__row-item:nth-of-type(2) .data-ellipsis',
        size: '.item-artifacts__row-item:nth-of-type(3) .data-ellipsis',
        updated: '.item-artifacts__row-item:nth-of-type(4) .data-ellipsis',
        show_details: '.item-artifacts__row-item:nth-of-type(5) .data-ellipsis a',
        download: '.item-artifacts__row-item:nth-of-type(6) .download-container svg'
      }
    }
  }
}

const resultsTable = {
  root: '.table__item .table__item-results',
  header: {
    root: '',
    sorters: {}
  },
  body: {
    root: '.results-table',
    row: {
      root: '.results-table__row',
      fields: {
        key: '.results-table__cell:nth-of-type(1)',
        value: '.results-table__cell:nth-of-type(2)'
      }
    }
  }
}

const featureSetsInfoPaneLabelsTable = {
  root: '.item-info__details .details-item__data-chips',
  header: {},
  body: {
    root: '.chips-wrapper',
    add_row_btn: '.button-add',
    row: {
      root: '.chip-block',
      fields: {
        key_input: 'input.input-label-key',
        value_input: 'input.input-label-value',
        key_verify: '.edit-chip-container input.input-label-key',
        value_verify: '.edit-chip-container input.input-label-value',
        label: '.edit-chip-container input',
        remove_btn: '.edit-chip__icon-close'
      }
    }
  }
}

// Models real time piplines infopane headers
const modelsRealTimeinfoPaneOverviewHeaders = {
  root: '.table-container',
  header: {},
  body: {
    root: '.graph-pane',
    offset: 1,
    row: {
      root: '.graph-pane__row',
      fields: {
        key: '.graph-pane__row-label'
      }
    }
  }
}

const featureSetTransformationGraph = {
  root: '.react-flow',
  elements: {
    workflowGraphNodesTable: {
      componentType: commonTable,
      structure: {
        root: '',
        header: {},
        body: {
          root: '.react-flow__nodes',
          row: {
            root: '.react-flow__node-ml-node',
            fields: {
              name: '.react-flow__node-label .data-ellipsis .data-ellipsis',
              top_handler: '.data-ellipsis .react-flow__handle-top',
              bottom_handler: '.data-ellipsis .react-flow__handle-bottom'
            }
          }
        }
      }
    },
    workflowGraphConnectionsTable: {
      componentType: commonTable,
      structure: {
        root: '',
        header: {},
        body: {
          root: '.react-flow__edges g[transform]',
          row: {
            root: '.react-flow__edge',
            fields: {
              path: '.react-flow__edge-path'
            }
          }
        }
      }
    },
    svg: '.react-flow__edges',
    zoomPane: '.react-flow__nodes'
  }
}

// common components
const header = By.css('.table__item .item-header__data h3')
const updated = By.css('.table__item .item-header__data span')
const cancelButton = By.css(
  '.table__item .item-header__buttons > .data-ellipsis:nth-of-type(1) button'
)
const applyChangesButton = By.css(
  '.table__item .item-header__buttons > .data-ellipsis:nth-of-type(1) button'
)
const applyButton = By.css('.item-info__details .round-icon-cp:nth-of-type(2) button')
const commonActionMenu = actionMenu(actionMenuStructure)
const fullViewButton = By.css('.table__item .item-header__buttons .item-header__navigation-buttons > div > div')
const tabelViewButton = By.css('#main-wrapper .table__item_big .item-header__navigation-buttons')
const crossCloseButton = By.css('.table__item .item-header__buttons a .data-ellipsis')
const commonDownloadButton = By.css('.table__item .item-header__buttons .download-container')
const commonArrowBack = By.css('a.link-back__icon')
const commonInfoPaneTabSelector = commonTable(infoPaneTabSelector)
const commonEditBtnTableView = By.css('[data-testid="detailsPanel"] .details-item__data-btn-edit')
const commonEditBtnFullView = By.css('.table__item_big .details-item__data-btn-edit')
const commonVersionTagInputTableView = By.css('.details-item:nth-of-type(3) .details-item__input-wrapper input')
const commonVersionTagInputPlaceholder = By.css('.details-item:nth-of-type(3) .details-item__data-add-placeholder')
const commonVersionTagInput = inputGroup(
  generateInputGroup(
    '.details-item:nth-of-type(3) .details-item__input-wrapper',
    false,
    false
  )
)
const commonVersionTagInputFullView = By.css('.table__item_big .details-item__input-wrapper input')

module.exports = {
  featureSetsInfoPane: {
    Header: header,
    Updated: updated,
    Cancel_Button: By.css('.table__item .item-header__buttons .btn-normal'),
    Apply_Changes_Button: applyChangesButton,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Overview_General_Headers: commonTable(infoPaneOverviewHeaders),
    Empty_Description_Field: By.css('.item-info__details-wrapper .details-item:nth-of-type(1) .details-item__data-add-placeholder'),
    Full_Description_Field: By.css('.item-info .details-item:nth-of-type(1) .details-item__data > div.data-ellipsis.tooltip-wrapper'),
    Description_Input: textAreaGroup(
      generateTextAreaGroup('.item-info__details-wrapper .details-item:nth-of-type(1) .form-field-textarea')
    ),
    Labels_Field: By.css(
      '.item-info__details .details-item:nth-of-type(2) .button-add-density_dense'
    ),
    Labels_Table: commonTable(featureSetsInfoPaneLabelsTable),
    Apply_Button: By.css('.item-info__details-wrapper .details-item__input-wrapper .round-icon-cp:nth-of-type(2)'),
    Labels_Apply_Button: By.css('.item-info__details-wrapper .details-item .details-item__data-chips .details-item__apply-btn-wrapper'),
    Edit_Button: By.css('.item-info__details-wrapper .details-item__data .details-item__data-btn-edit')
  },
  featuresInfoPane: {
    Header: header,
    Updated: updated,
    Cancel_Button: cancelButton,
    Apply_Changes_Button: applyChangesButton,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Features_Tab_Info_Pane_Table: commonTable(featuresInfoPaneTable)
  },
  featureVectorsInfoPane: {
    Header: header,
    Updated: updated,
    Cancel_Button: By.css('.table__item .item-header__buttons .btn-normal'),
    Apply_Changes_Button: applyChangesButton,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Overview_General_Headers: commonTable(infoPaneOverviewHeaders)
  },
  datasetsInfoPane: {
    Header: header,
    Updated: updated,
    Cancel_Button: cancelButton,
    Apply_Changes_Button: applyChangesButton,
    Apply_Button: applyButton,
    Download_Button: commonDownloadButton,
    Action_Menu: commonActionMenu,
    Full_View_Button: fullViewButton,
    Tabel_View_Button: tabelViewButton,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Pop_Out_Button: By.css('[data-testid="details-preview-tooltip-wrapper"]'),
    Overview_General_Headers: commonTable(infoPaneOverviewHeaders),
    Overview_Producer_Headers: commonTable(infoPaneOverviewProducerHeaders),
    Overview_Sources_Headers: commonTable(infoPaneOverviewSourcesHeaders),
    Train_Button: By.css('[data-testid="detailsPanel"] .item-header__buttons button'),
    Label_column: By.css('.item-info__details .details-item:nth-of-type(6) .details-item__data'),
    Overview_Hash_Header: labelComponent(
      generateLabelGroup(
        '.item-info__details:nth-of-type(1) .details-item:nth-of-type(1) .details-item__header',
        false,
        true
      )
    ),
    Overview_UID_Header: labelComponent(
      generateLabelGroup(
        '.item-info__details:nth-of-type(1) .details-item:nth-of-type(9) .details-item__header',
        false,
        true
      )
    ),
    Expand_Sources: By.css('.details-item .info-sources'),
    Info_Sources_Table: commonTable(filesInfoSourcesTable),
    Overview_Table: commonTable(datasetOverviewTable),
    Edit_btn_table_view: commonEditBtnTableView,
    Edit_btn_full_view: commonEditBtnFullView,
    Version_tag_Input_table_view: commonVersionTagInputTableView,
    Version_tag_Input_full_view: commonVersionTagInputFullView,
    Version_Tag_Input_Placeholder: commonVersionTagInputPlaceholder,
    Version_tag_Input: commonVersionTagInput
  },
  transformationsInfoPane: {
    Header: header,
    Updated: updated,
    Cancel_Button: cancelButton,
    Apply_Changes_Button: applyChangesButton,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Transformation_Graph: graph(featureSetTransformationGraph)
  },
  previewInfoPane: {
    Header: header,
    Updated: updated,
    Cancel_Button: cancelButton,
    Apply_Changes_Button: applyChangesButton,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Preview_Tab_Info_Pane_Table: commonTable(previewInfoPaneTable)
  },
  statisticsInfoPane: {
    Header: header,
    Updated: updated,
    Cancel_Button: cancelButton,
    Apply_Changes_Button: applyChangesButton,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Statistics_Tab_Info_Pane_Table: commonTable(statisticsInfoPaneTable)
  },
  analysisInfoPane: {
    Header: header,
    Updated: updated,
    Cancel_Button: cancelButton,
    Apply_Changes_Button: applyChangesButton,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector
  },
  requestedFeaturesInfoPane: {
    Requested_Features_Table: commonTable(requestedFeaturesTable),
    Alias_Input: inputGroup(generateInputGroup('.cell_alias__input-wrapper', false, false, false))
  },
  mlFunctionInfoPane: {
    Header: header,
    Updated: updated,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Overview_Headers: commonTable(infoPaneOverviewHeaders),
    Overview_Table: commonTable(functionsOverviewTable)
  },
  jobsMonitorTabInfoPane: {
    Arrow_Back: By.css('a.item-header__back-btn'),
    Header: header,
    Updated: updated,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Overview_Headers: commonTable(infoPaneOverviewHeaders),

    // Logs tab.
    Logs_Text_container: By.css('.table__item .table__item_logs-content'),
    Logs_Refresh_Button: By.css('.table__item .logs-refresh')
  },
  workflowsMonitorTabInfoPane: {
    Arrow_Back: commonArrowBack,
    Header: By.css('.workflow-container .link-back__title .data-ellipsis'),
    Updated: updated,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Overview_Headers: commonTable(infoPaneOverviewHeaders),

    // Logs tab.
    Logs_Text_container: By.css('.table__item .table__item_logs-content'),
    Logs_Refresh_Button: By.css('.table__item .logs-refresh')
  },
  inputsInfoPane: {
    Inputs_Table: commonTable(inputsTable)
  },
  artifactsInfoPane: {
    Artifacts_Table: commonTable(artifactsTable),
    Artifact_Preview_Button: By.css('.item-artifacts .artifacts__preview .data-ellipsis svg'),
    Iterations_Dropdown: dropdownComponent(generateDropdownGroup('.item-header__buttons .select'))
  },
  resultsInfoPane: {
    Results_Table: commonTable(resultsTable)
  },
  filesInfoPane: {
    Header: header,
    Updated: updated,
    Download_Button: commonDownloadButton,
    Action_Menu: commonActionMenu,
    Apply_Changes_Button: applyChangesButton,
    Apply_Button: applyButton,
    Cross_Close_Button: crossCloseButton,
    Full_View_Button: fullViewButton,
    Tabel_View_Button: tabelViewButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Pop_Out_Button: By.css('[data-testid="details-preview-tooltip-wrapper"]'),
    Overview_General_Headers: commonTable(infoPaneOverviewHeaders),
    Overview_Producer_Headers: commonTable(infoPaneOverviewProducerHeaders),
    Overview_Sources_Headers: commonTable(infoPaneOverviewSourcesHeaders),
    Overview_Hash_Header: labelComponent(
      generateLabelGroup(
        '.item-info__details:nth-of-type(1) .details-item:nth-of-type(1) .details-item__header',
        false,
        true
      )
    ),
    Overview_UID_Header: labelComponent(
      generateLabelGroup(
        '.item-info__details:nth-of-type(1) .details-item:nth-of-type(8) .details-item__header',
        false,
        true
      )
    ),
    Overview_Table: commonTable(artifactOverviewTable),
    Edit_btn_table_view: commonEditBtnTableView,
    Edit_btn_full_view: commonEditBtnFullView,
    Version_tag_Input_table_view: commonVersionTagInputTableView,
    Version_tag_Input_full_view: commonVersionTagInputFullView,
    Version_Tag_Input_Placeholder: commonVersionTagInputPlaceholder,
    Version_tag_Input: commonVersionTagInput
  },
  modelsInfoPane: {
    Header: header,
    Updated: updated,
    Download_Button: commonDownloadButton,
    Action_Menu: commonActionMenu,
    Apply_Changes_Button: applyChangesButton,
    Cross_Close_Button: crossCloseButton,
    Full_View_Button: fullViewButton,
    Tabel_View_Button: tabelViewButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Pop_Out_Button: By.css('[data-testid="details-preview-tooltip-wrapper"]'),
    Overview_General_Headers: commonTable(infoPaneOverviewHeaders),
    Overview_Drift_Headers: commonTable(infoPaneDriftHeaders),
    Overview_Producer_Headers: commonTable(infoPaneOverviewProducerHeaders),
    Overview_Sources_Headers: commonTable(infoPaneOverviewSourcesHeaders),
    Overview_Hash_Header: labelComponent(
      generateLabelGroup(
        '.item-info__details:nth-of-type(1) .details-item:nth-of-type(1) .details-item__header',
        false,
        true
      )
    ),
    Overview_UID_Header: labelComponent(
      generateLabelGroup(
        '.item-info__details:nth-of-type(1) .details-item:nth-of-type(11) .details-item__header',
        false,
        true
      )
    ),
    Expand_Sources: By.css('.details-item .info-sources'),
    Overview_Table: commonTable(modelsOverviewTable),
    Info_Sources_Table: commonTable(filesInfoSourcesTable),
    Labels_Field: By.css(
      '.item-info__details .details-item:nth-of-type(2) .button-add-density_dense'
    ),
    Labels_Table: commonTable(featureSetsInfoPaneLabelsTable),
    Apply_Button: By.css('.item-info__details .round-icon-cp:nth-of-type(2) button'),
    Edit_btn_table_view: commonEditBtnTableView,
    Edit_btn_full_view: commonEditBtnFullView,
    Version_tag_Input_table_view: commonVersionTagInputTableView,
    Version_tag_Input_full_view: commonVersionTagInputFullView,
    Version_Tag_Input_Placeholder: commonVersionTagInputPlaceholder,
    Version_tag_Input: commonVersionTagInput
  },
  modelsRealTimePipelineInfoPane: {
    Arrow_Back: commonArrowBack,
    Header: By.css('.graph-pane__title span'),
    Cross_Close_Button: By.css('.graph-pane__title .round-icon-cp .round-icon-cp__circle'),
    Overview_Headers: commonTable(modelsRealTimeinfoPaneOverviewHeaders)
  }
}
