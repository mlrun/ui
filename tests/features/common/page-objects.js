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
import commonPagesHeader from './page-objects/commonPagesHeader.po'
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
  Add_To_Feature_Vector_Popup: interactivePopup['addToFeatureVectorPopup'],
  Add_To_Feature_Vector_Tab: featureStore['addToFeatureVector'],
  Analysis_Info_Pane: infoPane['analysisInfoPane'],
  Artifact_Preview_Popup: interactivePopup['artifactPreviewPopup'],
  Artifacts_Info_Pane: infoPane['artifactsInfoPane'],
  Artifacts_FilterBy_Popup: interactivePopup['artifactsFilterByPopup'],
  Batch_Run: jobsAndWorkflows['BatchRun'],
  Batch_Run_Edit: sidePanel['batchRunEdit'],
  Batch_Re_Run: sidePanel['batchReRun'],
  Batch_Inference: project['batchInference'],
  Change_Project_Owner_Popup: interactivePopup['changeProjectOwnerPopup'],
  Common_Popup: interactivePopup['commonPopup'],
  Consumer_Groups: project['consumerGroups'],
  Create_Feature_Vector_Popup: interactivePopup['createFeatureVectorPopup'],
  Create_Job: jobsAndWorkflows['CreateJob'],
  Create_ML_Function_Popup: interactivePopup['createMLFunctionPopup'],
  Create_New_Project: interactivePopup['createNewProject'],
  Create_New_Secret_Popup: interactivePopup['createNewSecretPopup'],
  Delete_Confirm_Popup: interactivePopup['deleteConfirmPopup'],
  Datasets: featureStore['datasets'],
  Datasets_Info_Pane: infoPane['datasetsInfoPane'],
  Demo_Project: project['demoProject'],
  Deploy_Model_Popup: interactivePopup['deployModelPopup'],
  Discard_Changes_Popup: interactivePopup['discardChangesPopup'],
  Downloads_Popup: interactivePopup['downloadsPopUp'],
  Feature_Set_Schedule_Popup: interactivePopup['featureSetSchedulePopup'],
  Feature_Sets_Info_Pane: infoPane['featureSetsInfoPane'],
  Feature_Store_Feature_Sets_Tab: featureStore['featureSetsTab'],
  Feature_Store_Features_Tab: featureStore['featuresTab'],
  Feature_Store_Features_Vectors_Tab: featureStore['featureVectorsTab'],
  Feature_Vectors_Info_Pane: infoPane['featureVectorsInfoPane'],
  Features_Info_Pane: infoPane['featuresInfoPane'],
  Files: files['filesTab'],
  Files_Info_Pane: infoPane['filesInfoPane'],
  Inputs_Info_Pane: infoPane['inputsInfoPane'],
  Jobs_Monitor_Tab: jobsAndWorkflows['JobsMonitorTab'],
  Jobs_Monitor_Tab_Info_Pane: infoPane['jobsMonitorTabInfoPane'],
  ML_Function_Info_Pane: infoPane['mlFunctionInfoPane'],
  ML_Functions: Functions['mlFunctions'],
  Model_Endpoints: models['modelEndpoints'],
  Models: models['modelsTab'],
  Models_Info_Pane: infoPane['modelsInfoPane'],
  Modal_Wizard_Form: interactivePopup['modalWizardForm'],
  New_Feature_Set: sidePanel['newFeatureSet'],
  New_Function: sidePanel['newFunction'],
  New_JobTemplate_Edit: sidePanel['newJobTemplateEdit'],
  Notification_Popup: interactivePopup['notificationPopUp'],
  Preview_Info_Pane: infoPane['previewInfoPane'],
  Preview_Popup: interactivePopup['previewPopup'],
  Project: project['project'],
  Project_Members_Popup: interactivePopup['projectMembersPopup'],
  Project_Settings_General_Tab: projectsSettings['generalTab'],
  Projects: projects,
  Projects_Settings_Secret_Tab: projectsSettings['secretsTab'],
  Real_Time_Pipeline_Pane: infoPane['modelsRealTimePipelineInfoPane'],
  Real_Time_Pipelines: models['realTimePipelinesTab'],
  Register_Dataset: interactivePopup['registerDataset'],
  Register_File_Popup: interactivePopup['registerFilePopup'],
  Register_Model_Popup: interactivePopup['RegisterModelModal'],
  Remove_Member_Popup: interactivePopup['removeMemberPopup'],
  Requested_Features_Info_Pane: infoPane['requestedFeaturesInfoPane'],
  Results_Info_Pane: infoPane['resultsInfoPane'],
  Schedule_Monitor_Tab: jobsAndWorkflows['ScheduleMonitorTab'],
  Statistics_Info_Pane: infoPane['statisticsInfoPane'],
  Train_Model: interactivePopup['trainModel'],
  Transformations_Info_Pane: infoPane['transformationsInfoPane'],
  View_YAML: interactivePopup['viewYamlPopup'],
  Workflows_Monitor_Tab: jobsAndWorkflows['WorkflowsMonitorTab'],
  Workflows_Monitor_Tab_Info_Pane: infoPane['workflowsMonitorTabInfoPane'],
  commonPagesHeader: commonPagesHeader
}
