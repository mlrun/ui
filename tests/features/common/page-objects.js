import { By } from 'selenium-webdriver'

import project from './page-objects/project.po'
import projects from './page-objects/projects.po'
import featureStore from './page-objects/feature-store.po'
import infoPane from './page-objects/info-pane.po'
import interactivePopup from './page-objects/interactive-popup.po'
import sidePanel from './page-objects/side-panel.po'
import jobsAndWorkflows from './page-objects/jobs-and-workflows.po'
import Functions from './page-objects/ml-functions.po'
import projectsSettings from './page-objects/project-settings.po'

module.exports = {
  commonPagesHeader: {
    loader: By.css('div.loader-wrapper div.loader'),
    See_On_Github: By.css('header.header a.header__link'),
    Common_Hint: By.css('div.tip')
  },
  Projects: projects,
  Project: project,
  Create_New_Project: interactivePopup['createNewProject'],
  Archive_Project: interactivePopup['archiveProject'],
  Delete_Project: interactivePopup['deleteProject'],
  Feature_Store_Feature_Sets_Tab: featureStore['featureSetsTab'],
  Feature_Store_Features_Tab: featureStore['featuresTab'],
  Feature_Store_Features_Vectors_Tab: featureStore['featureVectorsTab'],
  Feature_Store_Datasets_Tab: featureStore['datasets'],
  Feature_Sets_Info_Pane: infoPane['featureSetsInfoPane'],
  Features_Info_Pane: infoPane['featuresInfoPane'],
  Transformations_Info_Pane: infoPane['transformationsInfoPane'],
  Preview_Info_Pane: infoPane['previewInfoPane'],
  Statistics_Info_Pane: infoPane['statisticsInfoPane'],
  Analysis_Info_Pane: infoPane['analysisInfoPane'],
  Register_Dataset: interactivePopup['registerDataset'],
  New_Feature_Set: sidePanel['newFeatureSet'],
  Jobs_Monitor_Tab: jobsAndWorkflows['JobsMonitorTab'],
  Create_Feature_Set_Popup_Dialog:
    interactivePopup['createFeatureSetPopupDialog'],
  Create_Job: jobsAndWorkflows['CreateJob'],
  New_JobTemplate_Edit: sidePanel['newJobTemplateEdit'],
  ML_Functions: Functions['mlFunctions'],
  New_Function: sidePanel['newFunction'],
  ML_Function_Info_Pane: infoPane['featuresInfoPane'],
  Delete_Function_Popup: interactivePopup['deleteFunction'],
  Create_ML_Function_Popup: interactivePopup['createMLFunctionPopup'],
  Project_Settings_General_Tab: projectsSettings['generalTab']
}
