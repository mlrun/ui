import { By } from 'selenium-webdriver'

import breadcrumbsComponent from './components/breadcrumbs.component'

import project from './page-objects/project.po'
import projects from './page-objects/projects.po'
import featureStore from './page-objects/feature-store.po'
import infoPane from './page-objects/info-pane.po'
import interactivePopup from './page-objects/interactive-popup.po'
import sidePanel from './page-objects/side-panel.po'
import jobsAndWorkflows from './page-objects/jobs-and-workflows.po'
import Functions from './page-objects/ml-functions.po'
import projectsSettings from './page-objects/project-settings.po'
import files from './page-objects/files.po'
import models from './page-objects/models.po'

module.exports = {
  commonPagesHeader: {
    loader: By.css('div.loader-wrapper div.loader'),
    See_On_Github: By.css('header.header a.header__link'),
    Common_Hint: By.css('div.tip'),
    MLRun_Logo: By.css('header.header a.header__logo'),
    Breadcrumbs: breadcrumbsComponent
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
  Add_To_Feature_Vector_Tab: featureStore['addToFeatureVector'],
  Feature_Sets_Info_Pane: infoPane['featureSetsInfoPane'],
  Features_Info_Pane: infoPane['featuresInfoPane'],
  Feature_Vectors_Info_Pane: infoPane['featureVectorsInfoPane'],
  Datasets_Info_Pane: infoPane['datasetsInfoPane'],
  Transformations_Info_Pane: infoPane['transformationsInfoPane'],
  Preview_Info_Pane: infoPane['previewInfoPane'],
  Statistics_Info_Pane: infoPane['statisticsInfoPane'],
  Analysis_Info_Pane: infoPane['analysisInfoPane'],
  Inputs_Info_Pane: infoPane['inputsInfoPane'],
  Artifacts_Info_Pane: infoPane['artifactsInfoPane'],
  Artifact_Preview_Popup: interactivePopup['artifactPreviewPopup'],
  Results_Info_Pane: infoPane['resultsInfoPane'],
  Register_Dataset: interactivePopup['registerDataset'],
  New_Feature_Set: sidePanel['newFeatureSet'],
  Feature_Set_Schedule_Popup: interactivePopup['featureSetSchedulePopup'],
  Jobs_Monitor_Tab: jobsAndWorkflows['JobsMonitorTab'],
  Jobs_Monitor_Tab_Info_Pane: infoPane['jobsMonitorTabInfoPane'],
  Workflows_Monitor_Tab_Info_Pane: infoPane['workflowsMonitorTabInfoPane'],
  Workflows_Monitor_Tab: jobsAndWorkflows['WorkflowsMonitorTab'],
  Schedule_Monitor_Tab: jobsAndWorkflows['ScheduleMonitorTab'],
  Delete_Scheduled_Job_Popup: interactivePopup['deleteScheduledJob'],
  Create_Feature_Set_Popup_Dialog:
    interactivePopup['createFeatureSetPopupDialog'],
  Create_Job: jobsAndWorkflows['CreateJob'],
  New_JobTemplate_Edit: sidePanel['newJobTemplateEdit'],
  ML_Functions: Functions['mlFunctions'],
  New_Function: sidePanel['newFunction'],
  ML_Function_Info_Pane: infoPane['mlFunctionInfoPane'],
  Delete_Function_Popup: interactivePopup['deleteFunction'],
  Create_ML_Function_Popup: interactivePopup['createMLFunctionPopup'],
  Project_Settings_General_Tab: projectsSettings['generalTab'],
  Change_Project_Owner_Popup: interactivePopup['changeProjectOwnerPopup'],
  Project_Members_Popup: interactivePopup['projectMembersPopup'],
  Projects_Settings_Secret_Tab: projectsSettings['secretsTab'],
  Create_New_Secret_Popup: interactivePopup['createNewSecretPopup'],
  Files: files['filesTab'],
  Register_File_Popup: interactivePopup['registerFilePopup'],
  Files_Info_Pane: infoPane['filesInfoPane'],
  Models: models['modelsTab'],
  Models_Info_Pane: infoPane['modelsInfoPane'],
  Deploy_Model_Popup: interactivePopup['deployModelPopup'],
  Register_Model_Popup: interactivePopup['registerModelPopup'],
  View_YAML: interactivePopup['viewYamlPopup'],
  Add_To_Feature_Vector_Popup: interactivePopup['addToFeatureVectorPopup'],
  Create_Feature_Vector_Popup: interactivePopup['createFeatureVectorPopup']
}
