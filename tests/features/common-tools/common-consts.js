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
module.exports = {
  Project: {
    Create_New_Options: [
      'Batch run',
      //'ML Function', - demo mode
      'Feature Set',
      'Register Artifact',
      //'Register Model', - demo mode
      'Register Dataset'
    ],
    Online_Status: 'online',
    Data_Collection_Description:
      'Register, upload data directly, or define ' +
      'features using the feature store.',
    Development_Description:
      'Define your code in a function and train your ' +
      'models. You can also run any additional code ' +
      'in batch, as well as define and run workflows.',
    Deployment_Description:
      'Deploy online serving models or perform batch ' +
      'inference, as well as define data and model ' +
      'monitoring and notification.'
  },
  Feature_Store: {
    Tab_List: ['Feature Sets', 'Features', 'Feature Vectors']
  },
  Models: {
    Tab_List: ['Models', 'Model Endpoints', 'Real-Time Pipelines'],
    Combobox_Options: [
      'V3IO',
      'S3',
      'HTTP',
      'HTTPS',
      'Azure storage',
      'Google storage',
      'Databricks filesystem'
    ] 
  },
  Real_Time_Pipeline_Pane: {
    Overview_Headers: [
      'Type:',
      'After:',
      'Class name:',
      'Function name:',
      'Handler:',
      'Input path:',
      'Result path:'
    ]
  },
  Feature_Sets_Info_Pane: {
    Tab_List: ['Overview', 'Features', 'Transformations', 'Preview', 'Statistics', 'Analysis'],
    Overview_General_Headers: [
      'Description:',
      'Labels:',
      'Version tag:',
      'Last updated:',
      'Entities:',
      'Engine type:',
      'URI:',
      'Timestamp key:',
      'Label column:',
      'Usage example:'
    ]
  },
  Feature_Vectors_Info_Pane: {
    Tab_List: ['Overview', 'Requested Features', 'Analysis'],
    Overview_General_Headers: [
      'Description:',
      'Labels:',
      'Version tag:',
      'Last updated:',
      'Entities:',
      'URI:',
      'Timestamp key:',
      'Label column:',
      'Usage example:'
    ]
  },
  Common_Lists: {
    Action_Menu_List: ['Add a tag', 'Download', 'Copy URI', 'View YAML', 'Delete'],
    Action_Menu_List_Expanded: ['Add a tag', 'Download', 'Copy URI', 'View YAML', 'Delete all'],
    Handler_List: ['train'],
    Pods_Priority_List: ['Low','Medium', 'High'],
    Ranking_Criteria_List: ['Min','Max']
  },
  Datasets_Info_Pane: {
    Tab_List: ['Overview', 'Preview', 'Metadata', 'Analysis'],
    Overview_General_Headers: [
      'Hash:',
      'Key:',
      'Version tag:',
      'Iter:',
      'Size:',
      'Label column:',
      'Path:',
      'URI:',
      'UID:',
      'Updated:',
      'Labels:'
    ],
    Overview_Producer_Headers: [
      'Name:',
      'Kind:',
      'URI:',
      'Owner:',
      'Workflow:',
      'UID:'
    ],
    Overview_Sources_Headers: [
      'Name:',
      'Path:'
    ]
  },
  ML_Functions_Tab: {
    Common_Action_Menu_Options: ['Edit', 'Delete', 'View YAML'],
    Serving_Action_Menu_Options: ['Edit', 'Delete', 'View YAML']
  },
  ML_Function_Info_Pane: {
    Tab_List: ['Overview', 'Code', 'Build Log'],
    Tab_List_Application_type: ['Overview', 'Build Log'],
    Overview_Headers: [
      'Name:',
      'Kind:',
      'Code entry point:',
      'Image:',
      'Version tag:',
      'Hash:',
      'Code origin:',
      'Updated:',
      'Default handler:',
      'Description:'
    ],
    Overview_Headers_Application_type: [
      'Name:',
      'Kind:',
      'Code entry point:',
      'Internal URL:',
      'Image:',
      'Application image:',
      'Version tag:',
      'Hash:',
      'Internal port:',
      'Code origin:',
      'Updated:',
      'Default handler:',
      'Description:'
    ]
  },
  Files_Info_Pane: {
    Tab_List: ['Overview', 'Preview'],
    Overview_General_Headers: [
      'Hash:',
      'Key:',
      'Version tag:',
      'Iter:',
      'Size:',
      'Path:',
      'URI:',
      'UID:',
      'Updated:',
      'Labels:'
    ],
    Overview_Producer_Headers: [
      'Name:',
      'Kind:',
      'URI:',
      'Owner:',
      'UID:'
    ],
    Overview_Sources_Headers: [
      'Name:',
      'Path:'
    ]
  },
  Models_Info_Pane: {
    Tab_List: ['Overview'],
    Tab_List_Extended: ['Overview', 'Preview', 'Features', 'Statistics'],
    Overview_General_Headers: [
      'Hash:',
      'Key:',
      'Version tag:',
      'Iter:',
      'Kind:',
      'Size:',
      'Label column:',
      'Path:',
      'URI:',
      'Model file:',
      'Feature vector:',
      'UID:',
      'Updated:',
      'Framework:',
      'Algorithm:',
      'Labels:',
      'Metrics:'
    ],
    Overview_Producer_Headers: [
      'Name:',
      'Kind:',
      'URI:',
      'Owner:',
      'Workflow:',
      'UID:'
    ],
    Overview_Sources_Headers: [
      'Name:',
      'Path:'
    ]
  },
  Models_Endpoints_Info_Pane: {
    Tab_List: ['Overview', 'Features Analysis', 'Metrics'],
    Overview_General_Headers: [
      'UID:',
      'Model class:',
      'Model artifact:',
      'Function URI:',
      'Function Tag:',
      'Feature set:',
      'Last prediction:',
      'Error count:',
      'Accuracy:',
      'Stream path:'
    ],
    Overview_Drift_Headers: [
      'Mean TVD:', 
      'Mean Hellinger:', 
      'Mean KLD:', 
      'Drift Actual Value:', 
      'Drift Detected Threshold:',
      'Possible Drift Threshold:'
    ]
  },
  New_Feature_Store: {
    Kind_Options: ['HTTP', 'CSV', 'PARQUET'],
    Combobox_Options: [
      'MLRun store',
      'V3IO',
      'S3',
      'Azure storage',
      'Go-ogle storage',
      'Google storage',
      'Databricks filesystem'
    ],
    Target_Store_File_Type: ['CSV', 'TSDB', 'Parquet', 'NoSql', 'Dataframe', 'Custom'],
    Target_Store_Path_Annotation:
      'Note that in order to keep the feature set versioning you need to keep the {run-id} as part of the path.'
  },
  Create_New_Job: {
    Combobox_Options: [
      'MLRun store',
      'V3IO',
      'S3',
      'HTTP',
      'HTTPS',
      'Azure storage',
      'Google storage'
    ]
  },
  Modal_Wizard_Form:{
    Tab_List: ['Functions', 'Hub'],
    Hub_Filter_Category: [
      'Data Analysis',
      'Data Preparation',
      'Data Validation',
      'ETL',
      'Feature Store',
      'Machine Learning',
      'Model Serving',
      'Model Testing',
      'Model Training',
      'Monitoring',
      'Utilities'
    ],
    Data_Inputs_Table_Header: ['Input name', 'Path'],
    Parameters_Table_Header: ['Name', 'Type', 'Value'],
    Parameters_Table_Header_Hyper: ['Hyper','Name', 'Type', 'Value'],
    Image_Name_Text: 'The image must include all the software packages that are required to run the function. For example, for an XGBoost model, ensure that the image includes the correct XGboost package and version'
  },
  Register_Artifact: {
    Type_Options: ['General', 'Chart', 'Plot', 'Table'],
    Form_Text:
      'Register an artifact in MLRun so it can be used, for example, by functions, jobs, and pipelines.',
    Form_Subtext:
      'Assign it a unique combination of name and tag, and specify its path (for example, s3://mybucket/path).',
    Combobox_Options: [
      'V3IO',
      'S3',
      'HTTP',
      'HTTPS',
      'Azure storage',
      'Google storage',
      'Databricks filesystem'
    ],
    Register_Error_Message: /That combination of name and tag is already in use in an existing (artifact|dataset|plotly|table)\. If you proceed, the existing (artifact|dataset|plotly|table) will be overwritten/  
  },
  Register_Dataset: {
    Type_Options: ['General', 'Chart', 'Plot', 'Table'],
    Form_Text:
      'Register a dataset as an artifact in MLRun so it can be used, for example, by functions, jobs, and pipelines.',
    Form_Subtext:
      'Assign it a unique combination of name and tag, and specify its path (for example, s3://mybucket/path).',
    Combobox_Options: [
      'V3IO',
      'S3',
      'HTTP',
      'HTTPS',
      'Azure storage',
      'Google storage',
      'Databricks filesystem'
    ]  
  },
  Project_Settings: {
    Tab_List: ['General', 'Members', 'Secrets'],
    Secrets_Hint:
      'These secrets are automatically available to all jobs belonging to this project that are not executed locally. See Secrets'
  },
  Input_Hint: {
    Artifact_Names_Unique: 'Artifact names in the same project must be unique',
    Dataset_Names_Unique: 'Dataset names in the same project must be unique',
    Artifact_Name_Hint_Deploy_Model:
      'Valid characters: a–z, A–Z, 0–9, –, _, .\nMust begin and end with: a–z, A–Z, 0–9\nLength – max: 253\n' +
      'This field is required',
    Artifact_Name_Hint:
      'Valid characters: a–z, A–Z, 0–9, –, _, .\nMust begin and end with: a–z, A–Z, 0–9\nLength – max: 253\n' +
      'This field is required',
    Project_Name_Hint:
      'Valid characters: a–z, 0–9, –\nMust begin with: a–z\nMust end with: a–z, 0–9\nLength – max: 63\n' +
      'This field is required',
    Run_Name_Hint:
      'Valid characters: a–z, A–Z, 0–9, –, _, .\nMust begin and end with: a–z, A–Z, 0–9\nLength – max: 63\n' +
      'This field is required',
    Labels_Warning_Key: 'Valid characters: a–z, A–Z, 0–9, –, _, .\nMust begin and end with: a–z, A–Z, 0–9\nLength – max: 75\n' +
    'Key must be unique',
    Projects_Labels_Warning_Key: '[Name] Valid characters : a–z, A–Z, 0–9, –, _, .\n[Name] Must begin and end with: a–z, A–Z, 0–9\n[Name] Max length - 63 characters\n' +
    '[Prefix] Valid characters: a–z, 0–9, –, .\n[Prefix] Must begin and end with: a–z, 0–9\n[Prefix] Max length - 253 characters\n' +
    '[Prefix] Must not start with \'kubernetes.io\', \'k8s.io\'\nSystem-defined labels cannot be modified.\nKey must be unique',
    Projects_Labels_Warning_Value: '[Value] Must begin and end with: a–z, A–Z, 0–9\n[Value] Length – max: 63\n[Value] Valid characters: a–z, A–Z, 0–9, –, _, .',
    Labels_Warning_Value: 'Valid characters: a–z, A–Z, 0–9, –, _, .\nMust begin and end with: a–z, A–Z, 0–9\nLength – max: 56',
    Feature_Set_Name_Hint:
      'Valid characters: a–z, A–Z, 0–9, –, _, .\nMust begin and end with: a–z, A–Z, 0–9\nLength – max: 56\n' +
      'This field is required',
    Feature_Set_Version_Hint:
      'Valid characters: a–z, A–Z, 0–9, –, _\nMust begin and end with: a–z, A–Z, 0–9\nLength – max: 56',
    Jobs_Name_Hint:
      'Valid characters: a–z, A–Z, 0–9, –, _, .\nMust begin and end with: a–z, A–Z, 0–9\nLength – max: 63\n' +
      'This field is required',
    Input_Field_Require: 'This field is required',
    Input_Field_Invalid: 'This field is invalid',
    Input_Field_Unique: 'Name must be unique',
    URL_Field_Require: 'URL is required',
    Key_Bucketing_Number_Hint:
      'If you partition by key and the number of unique keys is very high it is recommended to use buckets for ' +
      'better performance. In this case the path would be path/bucket-num/year=/month=/day= etc.. In case the ' +
      'value is 0 then no bucketing will be done and your data will be partitioned by key.',
    Function_Name_Hint:
      'Valid characters: a–z, 0–9, –, .\nMust begin and end with: a–z, 0–9\nLength – max: 63\n' +
      'This field is required',
    Function_Tag_Hint:
      'Valid characters: a–z, A–Z, 0–9, –, _, .\nMust begin and end with: a–z, A–Z, 0–9\nLength – max: 56',
    Function_Handler_Hint:
      'Enter the function handler name (e.g. for the default sample function the name should be `handler`)',
    Image_Name_Hint: 'The name of the function‘s container image',
    Resulting_Image_Hint: 'The name of the built container image',
    Base_Image_Hint:
      "The name of a base container image from which to build the function's processor image",
    Limit_Number_Warning: 'Limit must be bigger than or equal to Request and not be less than 1',
    Minimum_Value_Warning: 'The minimum value must be 1',
    CPU_Limit_Number_Warning:
      'Limit must be bigger than or equal to Request and not be less than 0.001',
    Request_Number_Warning: 'Request must be less than or equal to Limit and not be less than 1',
    CPU_Request_Number_Warning:
      'Request must be less than or equal to Limit and not be less than 0.001',
    GPU_Minimum_Value_Warning: 'The minimum value must be 1',
    Mount_Path_Hint: 'A mount path for referencing the data from the function',
    Data_Container_Hint: 'The name of the data container that contains the data',
    DataAccess_Key_Hint: 'A platform data-access key',
    Name_Already_Exists: 'Name already exists',
    Volumes_Path_Already_Exists: 'Multiple volumes cannot share the same path',
    Timestamp_Key_Hint: 'Used for specifying the time field when joining by time',
    Timestamp_Key_Warning:
      'Timestamp Key is required for offline target when partitioning by time is enabled - see the Target Store section.',
    Relative_Directory_Path_Hint: 'A relative directory path within the data container',
    Stream_Path_Hint: 'Enables users to store the function error in a V3IO stream',
    Add_Feature_Vector_Hint: 'Add features from the list on the left to this feature vector',
    Deploy_Model_Name_Hint:
      'After the function is deployed, it will have a URL for calling the model that is based upon this name.',
    MLRun_Store_Path_Hint: 'Field must be in "<artifact type>/<project>/<artifact name>:<artifact tag>" or "<artifact type>/<project>/<artifact name>@<artifact uid>" format',
    Jobs_MLRun_Store_Path_Hint:
      'Field must be in "artifacts/my-project/my-artifact:my-tag" or "artifacts/my-project/my-artifact@my-uid" format',
    V3IO_Path_Hint: 'Invalid URL. Field must be in "container-name/file" format',
    V3IO_Path_Hint_Feature_Store: 'Field must be in "container-name/file" format',
    S3_Path_Hint: 'Field must be in "bucket/path" format',
    Azure_Storage_Path_Hint: 'Field must be in "container/path" format',
    Timestamp_Column: 'The field name for filtering the source data.',
    Start_Time_Input: 'Filter data by start date >= value',
    End_Time_Input: 'Filter data by start date <= value',
    Target_Store_Online: 'Store the feature set in a NoSQL database',
    Target_Store_Offline: 'Store the feature set as a Parquet file or a partitioned Parquet directory',
    Target_Store_External_Offline:
      'Store the feature set in a remote object store (e.g. AWS S3 Google or Azure storage)',
    Distinct_Keys: 'The partition is based on key.',
    Source_URL_Input:
      'Source URL is the Git Repo that is associated with the project. When the user pulls the project it will use the source URL to pull from',
    SECRET_INPUT_HINT:
      '• Valid characters: A-Z, a-z, 0-9, -, _, .\n' +
      '• Must begin and end with: A-Z, a-z, 0-9\n' +
      '• No consecutive characters: .., .–, –.\n' +
      '• Max length between two periods: 63\n' +
      '• Length - max: 253',
    VALUE_INPUT_HINT:
      '• Valid characters: A-Z, a-z, 0-9, -, _, .\n' +
      '• Must not start with: ..\n' +
      '• Must not be: ., ..\n' +
      '• Length - max: 253'
  },
  Label_Hint: {
    New_Job_Volumes:
      'Volumes that define data paths and the required information for accessing the data from the function',
    Members_Hint: 'Some of the members might be user groups',
    Overview_Hash: 'Represents hash of the data. when the data changes the hash would change',
    Overview_UID:
      'Unique identifier representing the job or the workflow that generated the artifact',
    Feature_Analysis: 'The statistics are calculated on the last rolling hour of data',
    Feature_Sets_Statistics:
      'Statistics reflect the data for the latest ingestion. \n' +
      ' Note that some values may be empty due to the use of different engines for calculating statistics',
    Models_Statistics: 'Note that some values may be empty due to the use of different engines for calculating statistics'
  },
  Descriptions: {
    Archive_Project:
      'Archived projects continue to consume resources.To stop the project from consuming resources, delete its scheduled jobs and suspend its Nuclio functions.',
    Delete_Project: /You are trying to delete the non-empty project "[^"]+[$"]\. Deleting it will also delete all of its resources, such as jobs, artifacts, and features\./,
    Delete_Function:
      /You try to delete function "[^"]+[$"]\. Deleted functions cannot be restored\./,
    Delete_Scheduled_Job:
      /Are you sure you want to delete the scheduled job "[^"]+[$"]\? Deleted scheduled jobs can not be restored\./,
    Delete_Feature:
      /You try to delete feature "[^"]+[$"] from vector "[^"]+[$"]\. The feature could be added back later./
  },
  Messages: {
    How_To_Create:
    'See how to create a serving function in https://docs.mlrun.org/en/stable/serving/built-in-model-serving.html and https://docs.mlrun.org/en/stable/tutorials/03-model-serving.html'
  },
  Jobs_Monitoring: {
    Tab_List: ['Jobs', 'Workflows', 'Scheduled']
    // Job_Action_Menu_Options: ['Batch re-run', 'Monitoring', 'View YAML', 'Delete'],
    // Job_Overview_Action_Menu_Options: ['View YAML', 'Batch re-run', 'Delete'],
    // Running_Job_Action_Menu_Options: ['Monitoring', 'Abort', 'View YAML'],
    // Workflows_Action_Menu_Options: ['View YAML'],
    // Workflows_Info_Pane_Action_Menu_Options: ['Batch re-run', 'Monitoring', 'View YAML', 'Delete'],
    // Pending_Job_Action_Menu_Options: ['Batch re-run', 'Monitoring', 'Abort', 'View YAML'],
    // Schedule_Action_Menu_Options: ['Run now', 'Edit', 'Delete', 'View YAML']
  },
  Jobs_And_Workflows: {
    Tab_List: ['Monitor Jobs', 'Monitor Workflows', 'Schedule'],
    Job_Action_Menu_Options: ['Batch re-run', 'Monitoring', 'View YAML', 'Delete'],
    Job_Overview_Action_Menu_Options: ['View YAML', 'Batch re-run', 'Delete'],
    Running_Job_Action_Menu_Options: ['Monitoring', 'Abort', 'View YAML'],
    Workflows_Action_Menu_Options: ['View YAML'],
    Workflows_Info_Pane_Action_Menu_Options: ['Batch re-run', 'Monitoring', 'View YAML', 'Delete'],
    Pending_Job_Action_Menu_Options: ['Batch re-run', 'Monitoring', 'Abort', 'View YAML'],
    Schedule_Action_Menu_Options: ['Run now', 'Edit', 'Delete', 'View YAML']
  },
  Jobs_Monitor_Tab_Info_Pane: {
    Tab_List: ['Overview', 'Inputs', 'Artifacts', 'Results', 'Logs', 'Pods'],
    Overview_Headers: [
      'UID:',
      'Start time:',
      'Last Updated:',
      'Run on spot:',
      'Node selector:',
      'Priority:',
      'Parameters:',
      'Function:',
      'Function tag:',
      'Results:',
      'Labels:',
      'Log level:',
      'Output path:',
      'Total iterations:'
    ]
  },
  Jobs_Monitor_Tab: {
    'Any time': 'Any time',
    'Past hour': 3600000,
    'Past 24 hours': 86400000,
    'Past week': 604800000,
    'Past month': { min: 2419200000, max: 2678400000 },
    'Past non-leap year': 31536000000,
    'Past leap year': 31622400000
  },
  Date_Time_Picker: {
    Error_Message: '“To” must be later than “From”'
  },
  Error_Messages: {
    Project_Already_Exists: /A project named "[^"]+[$"] already exists/,
    Projects_Limit_Reached:
      'The system already has the maximum number of projects. An existing project must be deleted before you can create another.',
    Must_Select_One: 'Must select at least one',
    Must_Select_One_Partition: 'Must select at least one partitioning option',
    Already_Scheduled: 'This job is already scheduled',
    One_Day_Option: 'Must select at least one day option'
  },
  Dropdown_Options: {
    Tag_Filer_Options: ['All', 'latest'],
    Status_Filter_Options: ['All', 'Completed', 'Running', 'Pending', 'Error', 'Aborted'],
    Jobs_Status_Filter_Options: ['All', 'Aborted', 'Aborting', 'Completed', 'Error', 'Running', 'Pending'],
    Workflows_Status_Filter_Options: ['All', 'Error', 'Failed', 'Running', 'Completed'],
    Jobs_Type_Filter_Options: ['All', 'Local', 'Dask', 'Databricks', 'Handler', 'Job', 'Horovod', 'Spark'],
    Scheduled_Type_Filter_Options: ['All', 'Jobs', 'Workflows'],
    Group_By_Filter_Options: ['None', 'Name'],
    Start_Time_Filter_Options: [
      'Any time',
      'Past hour',
      'Past 24 hours',
      'Past week',
      'Past month',
      'Past year',
      'Custom range'
    ],
    Date_Picker_Filter_Options: [
      'Any time',
      'Past hour',
      'Past 24 hours',
      'Past week',
      'Past month',
      'Past year',
      'Custom range'
    ],
    Scheduled_Date_Picker_Filter_Options: [
      'Any time',
      'Next hour',
      'Next 24 hours',
      'Next week',
      'Next month',
      'Next year',
      'Custom range'
    ],
    Parameters_Table_Type_Options: ['str', 'int', 'float', 'bool', 'list', 'map'],
    Parameter_Table_Simple_Hyper_Options: ['Simple', 'Hyper'],
    Turning_Strategy_Options: ['List', 'Grid', 'Random'],
    Criteria_Dropdown_Options: ['Max', 'Min'],
    Volume_Mount_Options: ['Auto', 'Manual', 'None'],
    Hyperparameter_Strategy_Options: ['List', 'Grid', 'Random'],
    Memory_Unit_Options: [
      'Bytes',
      'KB',
      'KiB',
      'MB',
      'MiB',
      'GB',
      'GiB',
      'TB',
      'TiB'
    ],
    CPU_Unit_Options: ['cpu', 'millicpu'],
    Time_Unit_Options: ['Minute', 'Hourly', 'Daily', 'Weekly', 'Monthly'],
    Minute_Intervals_Dropdown_Options: ['Every 10', 'Every 15', 'Every 20', 'Every 30'],
    Hour_Intervals_Dropdown_Options: ['Every 1', 'Every 2', 'Every 3', 'Every 4', 'Every 6', 'Every 12'],
    Partition_Granularity_Options: ['Second', 'Minute', 'Hour', 'Day', 'Month', 'Year'],
    Pods_Priority: ['Low', 'Medium', 'High'],
    Schedule_Variants: ['Minute', 'Hourly', 'Daily', 'Weekly', 'Monthly'],
    Schedule_Minutes_Variants: ['10', '15', '20', '30'],
    Schedule_Hours_Variants: ['1', '2', '3', '4', '6', '12']
  },
  No_Data_Message: {
    Common_Message: 'No data matches the filter: "Version Tag: latest, Name: ccccc"',
    Common_Message_Feature: 'No data matches the filter: "Version Tag: latest"',
    Common_Message_Feature_Vector_Tab: 'No data matches the filter: "Tag: latest"',
    Common_Message_Feature_Vector: 'No data matches the filter: "Version Tag: latest"',
    Common_Message_Feature_Sets: 'No data matches the filter: "Version Tag: latest"',
    No_Data: 'No data to show',
    No_Features_Yet: 'No features found.',
    No_Consumer_Group_Yet: 'You haven’t created any consumer group yet',
    No_Datasets_data: 'No data matches the filter: "Version tag: latest, Labels: v3io_user=123, Show best iteration only: true"',
    No_Files_data: 'No data matches the filter: "Version tag: latest, Labels: v3io_user=123, Show best iteration only: true"',
    No_Models_data: 'No data matches the filter: "Version tag: latest, Labels: MY-KEY, Show best iteration only: true"'
  },
  Preview_Pop_Up: {
    Table_Header: ['Name', 'Path', 'Size', 'Updated']
  }
}
