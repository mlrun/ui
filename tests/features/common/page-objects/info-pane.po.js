import actionMenu from '../components/action-menu.component'
import commonTable from '../components/table.component'
import {
  generateInputGroup,
  generateLabelGroup
} from '../../common-tools/common-tools'
import labelComponent from '../components/label.component'
import inputGroup from '../components/input-group.component'
import graph from '../components/graph.component'
import { By } from 'selenium-webdriver'

// TO DO: that is duplicate from Feature Store PO. In feature that should be fixed
const actionMenuStructure = {
  root: '.table__item .item-header__buttons > .actions-menu__container',
  menuElements: {
    open_button: 'button',
    options: '.actions-menu__body .actions-menu__option'
  }
}

const infoPaneTabSelector = {
  root: '.table__item .details-menu__tabs',
  header: {},
  body: {
    row: {
      root: 'a',
      fields: {
        key: '.details-menu__tab'
      }
    }
  }
}

const infoPaneOverviewHeaders = {
  root: '.table__item .item-info__details:nth-of-type(1)',
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
      department:
        '.artifact-preview__table-content:nth-of-type(1) .data-ellipsis',
      parent_id:
        '.artifact-preview__table-content:nth-of-type(2) .data-ellipsis',
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
        projectName: '.cell_project-name',
        featureSet: '.item-requested-features__table-cell:nth-of-type(2)',
        feature: '.cell_feature',
        alias: '.cell_alias',
        delete_btn: '.cell_delete svg'
      }
    }
  }
}

const inputsTable = {
  root: '.table__item .inputs_container',
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
    root: '',
    sorters: {}
  },
  body: {
    row: {
      root: '.item-artifacts__row-wrapper',
      fields: {
        name: '.item-artifacts__row-item:nth-of-type(1) span.link',
        path: '.item-artifacts__row-item:nth-of-type(2) .data-ellipsis',
        size: '.item-artifacts__row-item:nth-of-type(3) .data-ellipsis',
        updated: '.item-artifacts__row-item:nth-of-type(4) .data-ellipsis',
        show_details:
          '.item-artifacts__row-item:nth-of-type(5) .data-ellipsis a',
        download:
          '.item-artifacts__row-item:nth-of-type(6) .download-container svg'
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
        label: '.chip',
        remove_btn: '.item-icon-close'
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
              top_hendler: '.data-ellipsis .react-flow__handle-top',
              bottom_hendler: '.data-ellipsis .react-flow__handle-bottom'
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
  '.table__item .item-header__buttons > .data-ellipsis:nth-of-type(2) button'
)
const commonActionMenu = actionMenu(actionMenuStructure)
const crossCloseButton = By.css(
  '.table__item .item-header__buttons a .data-ellipsis'
)
const commonDownloadButton = By.css(
  '.table__item .item-header__buttons .download-container'
)
const commonInfoPaneTabSelector = commonTable(infoPaneTabSelector)

module.exports = {
  featureSetsInfoPane: {
    Header: header,
    Updated: updated,
    Cancel_Button: cancelButton,
    Apply_Changes_Button: applyChangesButton,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Overview_General_Headers: commonTable(infoPaneOverviewHeaders),
    Description_Field: By.css(
      '.item-info__details .details-item:nth-of-type(1) .data-ellipsis'
    ),
    Description_Input: inputGroup(
      generateInputGroup(
        '.item-info__details .details-item:nth-of-type(1) .input-wrapper',
        true,
        false,
        true
      )
    ),
    Labels_Field: By.css(
      '.item-info__details .details-item:nth-of-type(2) .button-add-density_dense'
    ),
    Labels_Table: commonTable(featureSetsInfoPaneLabelsTable),
    Apply_Button: By.css('.item-info__details .details-item__apply-btn')
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
    Cancel_Button: cancelButton,
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
    Download_Button: commonDownloadButton,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Overview_General_Headers: commonTable(infoPaneOverviewHeaders),
    Overview_Hash_Header: labelComponent(
      generateLabelGroup(
        '.item-info__details:nth-of-type(1) .details-item:nth-of-type(1) .details-item__header',
        false,
        true
      )
    ),
    Overview_UID_Header: labelComponent(
      generateLabelGroup(
        '.item-info__details:nth-of-type(1) .details-item:nth-of-type(7) .details-item__header',
        false,
        true
      )
    ),
    Expand_Sources: By.css('.details-item .info-sources'),
    Info_Sources_Table: commonTable(filesInfoSourcesTable)
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
    Requested_Features_Table: commonTable(requestedFeaturesTable)
  },
  mlFunctionInfoPane: {
    Header: header,
    Updated: updated,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Overview_Headers: commonTable(infoPaneOverviewHeaders)
  },
  jobsMonitorTabInfoPane: {
    Arrow_Back: By.css('.table__item a.item-header__back-btn'),

    Header: header,
    Updated: updated,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Overview_Headers: commonTable(infoPaneOverviewHeaders),

    // Logs tab.
    Logs_Text_container: By.css('.table__item .table__item_logs__content'),
    Logs_Refresh_Button: By.css('.table__item .logs_refresh')
  },
  workflowsMonitorTabInfoPane: {
    Arrow_Back: By.css('.workflow-container a.link-back__icon'),
    Header: By.css('.workflow-container .link-back__title .data-ellipsis'),
    Updated: updated,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Overview_Headers: commonTable(infoPaneOverviewHeaders),

    // Logs tab.
    Logs_Text_container: By.css('.table__item .table__item_logs__content'),
    Logs_Refresh_Button: By.css('.table__item .logs_refresh')
  },
  inputsInfoPane: {
    Inputs_Table: commonTable(inputsTable)
  },
  artifactsInfoPane: {
    Artifacts_Table: commonTable(artifactsTable),
    Artifact_Preview_Button: By.css(
      '.item-artifacts .item-artifacts__preview .data-ellipsis svg'
    )
  },
  resultsInfoPane: {
    Results_Table: commonTable(resultsTable)
  },
  filesInfoPane: {
    Header: header,
    Updated: updated,
    Download_Button: commonDownloadButton,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Overview_General_Headers: commonTable(infoPaneOverviewHeaders),
    Overview_Hash_Header: labelComponent(
      generateLabelGroup(
        '.item-info__details:nth-of-type(1) .details-item:nth-of-type(1) .details-item__header',
        false,
        true
      )
    ),
    Overview_UID_Header: labelComponent(
      generateLabelGroup(
        '.item-info__details:nth-of-type(1) .details-item:nth-of-type(7) .details-item__header',
        false,
        true
      )
    ),
    Expand_Sources: By.css('.details-item .info-sources'),
    Info_Sources_Table: commonTable(filesInfoSourcesTable)
  },
  modelsInfoPane: {
    Header: header,
    Updated: updated,
    Download_Button: commonDownloadButton,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Overview_General_Headers: commonTable(infoPaneOverviewHeaders),
    Overview_Hash_Header: labelComponent(
      generateLabelGroup(
        '.item-info__details:nth-of-type(1) .details-item:nth-of-type(1) .details-item__header',
        false,
        true
      )
    ),
    Overview_UID_Header: labelComponent(
      generateLabelGroup(
        '.item-info__details:nth-of-type(1) .details-item:nth-of-type(10) .details-item__header',
        false,
        true
      )
    ),
    Expand_Sources: By.css('.details-item .info-sources'),
    Info_Sources_Table: commonTable(filesInfoSourcesTable)
  },
  modelsRealTimePiplineInfoPane: {
    Header: By.css('.graph-pane__title span'),
    Cross_Close_Button: By.css(
      '.graph-pane__title .round-icon-cp .round-icon-cp__circle'
    ),
    Overview_Headers: commonTable(modelsRealTimeinfoPaneOverviewHeaders)
  }
}
