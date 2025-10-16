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
export default {
  Project: {
    Quick_Actions_Options: [
      'Register dataset',
      'Register artifact',
      'Batch run',
      'Train model',
      'Batch inference',
      'Create real-time function'
    ],
    Quick_Actions_Options_Demo: [
      'Register dataset',
      'Register artifact',
      'Batch run',
      'Train model',
      'Batch inference',
      'Create real-time function',
      'Register model',
      'ML function',
      'Feature set',
      'Create feature vector'
    ],
    Online_Status: 'online',
    Data_Collection_Description:
      'Register, upload data directly, or define ' + 'features using the feature store.',
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
    Tab_List: ['Feature Sets', 'Features', 'Feature Vectors'],
    Delete_Feature_Vector_Message: /Are you sure you want to delete the feature vector "(.+?)"\?. You cannot restore a feature vector after deleting it./,
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
    Created_State: 'Created',
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
    Action_Menu_List: ['Add a tag', 'Download', 'Copy URI', 'View YAML', 'Delete', 'Delete all versions'],
    Action_Menu_List_LLM_Prompt: ['Add a tag', 'Download', 'Copy URI', 'View YAML'],
    Action_Menu_List_Version_History: ['Add a tag', 'Download', 'Copy URI', 'View YAML', 'Delete'],
    Action_Menu_List_Expanded: ['Add a tag', 'Download', 'Copy URI', 'View YAML', 'Delete all'],
    Action_Menu_List_Dataset_Transition_Popup: ['Download', 'Copy URI', 'View YAML'],
    Action_Menu_List_Function_Transition_Popup: ['View YAML'],
    Action_Menu_List_Run_Transition_Popup: ['Run\'s resource monitoring', 'View YAML'],
    Action_Menu_List_Feature_Set_Transition_Popup: ['View YAML'],
    Handler_List: ['train'],
    Pods_Priority_List: ['Low', 'Medium', 'High'],
    Ranking_Criteria_List: ['Min', 'Max']
  },
  Datasets_Info_Pane: {
    Tab_List: ['Overview', 'Preview', 'Metadata', 'Analysis'],
    Info_Banner_Message: /The dataset is not in the filtered list\. Closing the details panel will return you to the current list\./,
    Overview_General_Headers: [
      'Hash:',
      'Key:',
      'Version tag:',
      'Iter:',
      'Size:',
      'Label column:',
      'Path:',
      'URI:',
      'Updated:',
      'Labels:'
    ],
    Overview_Producer_Headers: ['Name:', 'Kind:', 'URI:', 'Owner:', 'Workflow:', 'UID:'],
    Overview_Sources_Headers: ['Name:', 'Path:']
  },
  Documents_Info_Pane: {
    Tab_List: ['Overview', 'Collections'],
    Overview_General_Headers: [
      'Key:',
      'Hash:',
      'Version tag:',
      'Original source:',
      'Iter:',
      'URI:',
      'Path:',
      'UID:',
      'Updated:',
      'Labels:'
    ],
    Overview_Producer_Headers: ['Name:', 'Kind:', 'Tag:', 'Owner:', 'UID:']
  },
  LLM_Prompts_Info_Pane: {
    Tab_List: ['Overview', 'Prompt Template', 'Generation Configuration'],
    Tab_List_Prompt_Template: ['Prompt', 'Arguments'],
    Info_Banner_Message: /The LLM prompt is not in the filtered list\. Closing the details panel will return you to the current list\./,
    Overview_General_Headers: [
      'Key:',
      'Description:',
      'Model name:',
      'Hash:',
      'Version tag:',
      'Original source:',
      'Iter:',
      'URI:',
      'Path:',
      'UID:',
      'Updated:',
      'Labels:'
    ],
    Overview_Producer_Headers: ['Name:', 'Kind:', 'Tag:', 'Owner:', 'UID:']
  },
  Alerts_Jobs_Info_Pane: {
    Overview_General_Headers: [
      'Project Name:',
      'Job Name:',
      'Type:',
      'Timestamp:',
      'Severity:',
      'Job:'
    ],
    Overview_General_Headers_PerProject: [
      'Job Name:',
      'Type:',
      'Timestamp:',
      'Severity:',
      'Job:'
    ],
    Overview_Trigger_Criteria_Headers: ['Trigger criteria count:', 'Trigger criteria time period:']
  },
  Alerts_Endpoint_Info_Pane: {
    Overview_General_Headers: [
      'Project Name:',
      'Endpoint ID:',
      'Application Name:',
      'Result Name:',
      'Type:',
      'Timestamp:',
      'Severity:'
    ],
    Overview_General_Headers_Per_Project: [
      'Endpoint ID:',
      'Application Name:',
      'Result Name:',
      'Type:',
      'Timestamp:',
      'Severity:'
    ],
    Overview_Trigger_Criteria_Headers: ['Trigger criteria count:', 'Trigger criteria time period:']
  },
  Alerts_Application_Info_Pane: {
    Overview_General_Headers: [
      'Project Name:',
      'Application Name:',
      'Type:',
      'Timestamp:',
      'Severity:'
    ],
    Overview_General_Headers_Per_Project: [
      'Application Name:',
      'Type:',
      'Timestamp:',
      'Severity:'
    ],
    Overview_Trigger_Criteria_Headers: ['Trigger criteria count:', 'Trigger criteria time period:']
  },
  ML_Functions_Tab: {
    Common_Action_Menu_Options: ['Edit', 'View YAML', 'Delete'],
    Common_Action_Menu_Options_Demo: ['Edit', 'View YAML', 'Delete all versions'],
    Serving_Action_Menu_Options: ['Edit', 'View YAML', 'Delete'],
    Serving_Action_Menu_Options_Demo: ['Edit', 'View YAML', 'Delete all versions']
  },
  ML_Function_Info_Pane: {
    Initialized_State: 'Initialized',
    Ready_State: 'Ready',
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
      //'Image:', hidden due to ML-7988, ML-8014
      'Application image:',
      'Version tag:',
      'Hash:',
      'Internal port:',
      // 'Code origin:', hidden due to ML-7988, ML-8014
      'Updated:',
      // 'Default handler:', hidden due to ML-7988, ML-8014
      'Description:'
    ]
  },
  Files_Info_Pane: {
    Tab_List: ['Overview', 'Preview'],
    Info_Banner_Message: /The (.+?) is not in the filtered list\. Closing the details panel will return you to the current list\./,
    Overview_General_Headers: [
      'Hash:',
      'Key:',
      'Version tag:',
      'Iter:',
      'Size:',
      'Path:',
      'URI:',
      'Updated:',
      'Labels:'
    ],
    Overview_Producer_Headers: ['Name:', 'Kind:', 'URI:', 'Owner:', 'UID:'],
    Overview_Sources_Headers: ['Name:', 'Path:']
  },
  Models_Info_Pane: {
    Tab_List: ['Overview'],
    Tab_List_Two_Tabs: ['Overview', 'Preview'],
    Tab_List_Extended: ['Overview', 'Preview', 'Features', 'Statistics'],
    Info_Banner_Message: /The (.+?) is not in the filtered list\. Closing the details panel will return you to the current list\./,
    Overview_General_Headers: [
      'Hash:',
      'Key:',
      'Version tag:',
      'Iter:',
      'Kind:',
      'Size:',
      'Path:',
      'URI:',
      'Model file:',
      'Feature vector:',
      'Updated:',
      'Framework:',
      'Algorithm:',
      'Labels:',
      'Metrics:'
    ],
    Overview_Producer_Headers: ['Name:', 'Kind:', 'URI:', 'Owner:', 'Workflow:', 'UID:'],
    Overview_Sources_Headers: ['Name:', 'Path:']
  },
  Models_Endpoints_Info_Pane: {
    Tab_List: ['Overview', 'Features Analysis', 'Metrics', 'Alerts'],
    Overview_General_Headers: [
      'UID:',
      'Model class:',
      'Model artifact:',
      'Function URI:',
      'Function Tag:',
      'Feature set:',
      'Sampling percentage:',
      'Last prediction:',
      'Error count:'
    ],
    Overview_Drift_Headers: [
      'Mean TVD:',
      'Mean Hellinger:',
      'Mean KLD:',
      'Drift Actual Value:'
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
  Modal_Wizard_Form: {
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
    Parameters_Table_Header_Hyper: ['Hyper', 'Name', 'Type', 'Value'],
    Image_Name_Text:
      'The image must include all the software packages that are required to run the function. For example, for an XGBoost model, ensure that the image includes the correct XGboost package and version'
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
    Register_Error_Message:
      /That combination of name and tag is already in use in an existing (artifact|dataset|plotly|table)\. If you proceed, the existing (artifact|dataset|plotly|table) will be overwritten/
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
  Common_Tooltips: {
    Auto_Refresh: 'Uncheck Auto Refresh to view more results',
    FilterBy_Button: 'Filter',
    FilterBy_Button_1: 'Filter (1)',
    Argument: 'The essence of all things',
    Show_All_Versions: 'Show all versions',
    Open_Metrics: 'Open metrics',
    Refresh_Button: 'Refresh',
    Back_Button: 'Back',
    Expand_All_Button: 'Expand all',
    In_Process_Jobs: 'Aborting, Pending, Pending retry, Running',
    Running_Tip: 'Running, Terminating',
    Failed_Tip: 'Failed',
    Failed_Jobs: 'Aborted, Error',
    Failed_Worflows: 'Error, Failed',
    Succeeded: 'Completed',
    Statistics_Tab_Tip: 'Statistics reflect the data for the latest ingestion. \n Note that some values may be empty due to the use of different engines for calculating statistics',
    Monitoring_Jobs_Box_Title_Tip: 'Number of Job runs, clicking on the counters navigates to jobs screen.',
    Error_Content: 'Error. Columns must be same length as key',
    Error_Content_Workflow:
      "Error. 2021-08-29 20:01:36.582972: W tensorflow/stream_executor/platform/default/dso_loader.cc:60] Could not load dynamic library 'libcudart.so.11.0'; dlerror: libcudart.so.11.0: cannot open shared object file: No such file or directory; LD_LIBRARY_PATH: /usr/local/lib:/usr/local/lib: 2021-08-29 20:01:36.583019: I tensorflow/stream_executor/cuda/cudart_stub.cc:29] Ignore above cudart dlerror if you do not have a GPU set up on your machine. 2021-08-29 20:01:46.470042: I tensorflow/compiler/jit/xla_cpu_device.cc:41] Not creating XLA devices, tf_xla_enable_xla_devices not set 2021-08-29 20:01:46.470263: W tensorflow/stream_executor/platform/default/dso_loader.cc:60] Could not load dynamic library 'libcuda.so.1'; dlerror: libcuda.so.1: cannot open shared object file: No such file or directory; LD_LIBRARY_PATH: /usr/local/lib:/usr/local/lib: 2021-08-29 20:01:46.470283: W tensorflow/stream_executor/cuda/cuda_driver.cc:326] failed call to cuInit: UNKNOWN ERROR (303) 2021-08-29 20:01:46.470306: I tensorflow/stream_executor/cuda/cuda_diagnostics.cc:156] kernel driver does not appear to be running on this host (train-1193bacd-worker-0): /proc/driver/nvidia/version does not exist 2021-08-29 20:01:46.518782: I tensorflow/core/platform/cpu_feature_guard.cc:142] This TensorFlow binary is optimized with oneAPI Deep Neural Network Library (oneDNN) to use the following CPU instructions in performance-critical operations: AVX2 FMA To enable them in other operations, rebuild TensorFlow with the appropriate compiler flags. 2021-08-29 20:01:46.518927: I tensorflow/compiler/jit/xla_gpu_device.cc:99] Not creating XLA devices, tf_xla_enable_xla_devices not set Some callbacks may not have access to the averaged metrics, see https://github.com/horovod/horovod/issues/2440 Traceback (most recent call last): File \"/User/demos/image-classification-with-distributed-training/src-tfv2/horovod-training.py\", line 116, in <module> hvd.callbacks.LearningRateWarmupCallback(warmup_epochs=5, verbose=1), TypeError: __init__() missing 1 required positional argument: 'initial_lr'"
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
    Labels_Warning_Key:
      'Valid characters: a–z, A–Z, 0–9, –, _, .\nMust begin and end with: a–z, A–Z, 0–9\nLength – max: 75\n' +
      'Key must be unique',
    Labels_Warning_Key_Modal_Wizard_Form:
      'Valid characters: a–z, A–Z, 0–9, –, _, .\nMust begin and end with: a–z, A–Z, 0–9\nLength – max: 75\n' +
      'System-defined labels cannot be modified.\nKey must be unique',
    Projects_Labels_Warning_Key:
      '[Name] Valid characters : a–z, A–Z, 0–9, –, _, .\n[Name] Must begin and end with: a–z, A–Z, 0–9\n[Name] Max length - 63 characters\n' +
      '[Prefix] Valid characters: a–z, 0–9, –, .\n[Prefix] Must begin and end with: a–z, 0–9\n[Prefix] Max length - 253 characters\n' +
      "[Prefix] Must not start with 'kubernetes.io', 'k8s.io'\nSystem-defined labels cannot be modified.\nKey must be unique",
    Projects_Labels_Warning_Value:
      '[Value] Must begin and end with: a–z, A–Z, 0–9\n[Value] Length – max: 63\n[Value] Valid characters: a–z, A–Z, 0–9, –, _, .',
    Labels_Warning_Value:
      'Valid characters: a–z, A–Z, 0–9, –, _, .\nMust begin and end with: a–z, A–Z, 0–9\nLength – max: 56',
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
    MLRun_Store_Path_Hint:
      'Field must be in "<artifact type>/<project>/<artifact name>:<artifact tag>" or "<artifact type>/<project>/<artifact name>@<artifact uid>" format',
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
    Target_Store_Offline:
      'Store the feature set as a Parquet file or a partitioned Parquet directory',
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
    Metric_Type_Result: 'Result',
    Metric_Type_Metric: 'Metric',
    Overview_Hash: 'Represents hash of the data. when the data changes the hash would change',
    Overview_UID:
      'Unique identifier representing the job or the workflow that generated the artifact',
    Feature_Analysis: 'The statistics are calculated on the last rolling hour of data',
    Feature_Sets_Statistics:
      'Statistics reflect the data for the latest ingestion. \n' +
      ' Note that some values may be empty due to the use of different engines for calculating statistics',
    Models_Statistics:
      'Note that some values may be empty due to the use of different engines for calculating statistics',
    Model_Stats_Tip:  
      'Each model can have multiple versions, produced by multiple runs and given multiple tags.\n' +
      ' You can browse them in the Models page.',
    FeatureSets_Stats_Tip:  
      'Each feature set can have multiple versions, produced by multiple runs and given multiple tags.\n' +
      ' You can browse them in the Feature store page.',
    Model_Version_Tag: 'Enter a model name to enable field.',
    Artifacts_Stats_Tip:  
      'Each artifact can have multiple versions, produced by multiple runs and given multiple tags.\n' +
      ' You can browse them in the Artifacts page.',
    Model_Endpoint_With_Detections:
      'This chart displays the number of model endpoints that had at least one detected issue, in any monitoring application, in the relevant time period',
    Project_Monitoring_Counters: 'Counters use a caching mechanism, and are not auto-refreshed.',
    Operating_Functions: 'System functions that are used for the monitoring application operation',
    Lag: 'Number of messages currently waiting in the app\'s queue',
    Commited_Offset: 'Total number of messages handled by the app',
    Endpoints_Tip: 'Model endpoints processed by the monitoring app during the selected time frame',
    Metrics_Tip: 'This table displays the values of the last metrics captured by the monitoring application. If there are metrics for more than one model endpoint at the same time, the table displays only one of those.',
    Shards_Partitions_Status_Tip: 'This table displays the current status of each shard',
    Runs_Statistic_Section_Title_Tip: 'Number of Job runs, clicking on the counters navigates to jobs screen.'
  },
  Descriptions: {
    Archive_Project:
      'Archived projects continue to consume resources.To stop the project from consuming resources, delete its scheduled jobs and suspend its Nuclio functions.',
    Delete_Project_Confirm_Message:
      /You are trying to delete the project "[^"]+[$"]\. Deleted projects cannot be restored/,
    Delete_Project:
      /You are trying to delete the non-empty project "[^"]+[$"]\. Deleting it will also delete all of its resources, such as jobs, artifacts, and features\./,
    Delete_Function:
      /You try to delete function "[^"]+[$"]\. Deleted functions cannot be restored\./,
    Delete_Scheduled_Job:
      /Are you sure you want to delete the scheduled job "[^"]+[$"]\? Deleted scheduled jobs can not be restored\./,
    Delete_Feature:
      /You try to delete feature "[^"]+[$"] from vector "[^"]+[$"]\. The feature could be added back later./,
    Add_A_Tag_Overwrite_Message:
      /That combination of name and tag is already in use in an existing (artifact|dataset|plotly|LLM prompt)\. If you proceed, the existing (artifact|dataset|plotly|LLM prompt) will be overwritten/
  },
  Messages: {
    How_To_Create:
      'See how to create a serving function in https://docs.mlrun.org/en/stable/serving/built-in-model-serving.html and https://docs.mlrun.org/en/stable/tutorials/03-model-serving.html',
    Metrics_Empty_Select_Message: 'Choose metrics to view endpoint’s data'
  },
  Jobs_Monitoring: {
    Tab_List: ['Jobs', 'Workflows', 'Scheduled']
  },
  Jobs_And_Workflows: {
    Tab_List: ['Monitor Jobs', 'Monitor Workflows', 'Schedule'],
    Job_Action_Menu_Options: ['Batch re-run', 'Run\'s resource monitoring', 'View YAML', 'Delete run'],
    Job_List_Action_Menu_Options: ['Batch re-run', 'Run\'s resource monitoring', 'View YAML', 'Delete run', 'Delete all runs'],
    Job_Overview_Action_Menu_Options: ['View YAML', 'Run\'s resource monitoring', 'Batch re-run', 'Delete run'],
    Running_Job_Action_Menu_Options: ['Run\'s resource monitoring', 'Abort', 'View YAML'],
    Delete_Run_Message: /Are you sure you want to delete the run with the UID "(.+?)" of the job "(.+?)"\? Deleted runs can not be restored./,
    Delete_All_Runs_Message: /Are you sure you want to delete all runs of the job "(.+?)"\? Deleted runs can not be restored./,
    Terminate_Workflow_Message: /Are you sure you want to terminate the workflow "(.+?)" \(stop its execution\)\? Workflows termination cannot be undone\./,
    Workflows_Action_Menu_Options: ['View YAML', 'Retry', 'Terminate'],
    Workflows_Running_Action_Menu_Options: ['View YAML', 'Terminate'],
    Workflows_Info_Pane_Action_Menu_Options: ['Batch re-run', 'Monitoring', 'View YAML', 'Delete'],
    Pending_Job_Action_Menu_Options: ['Batch re-run', 'Run\'s resource monitoring', 'Abort', 'View YAML'],
    Schedule_Action_Menu_Options: ['Run now', 'Edit', 'Delete', 'View YAML'],
    Workflows_Unsuccessful_Run_Message: 'Workflow did not run successfully\nRETRY',
    Workflows_Successful_Run_Message: 'Workflow run successfully.',
    Workflows_Unsuccessful_Terminate_Message: 'Workflow "stocks-admin-main 2021-08-30 05-36-35 failed to terminate',
    Workflows_Trigger_Termination_Message: 'A request to terminate workflow "stocks-admin-main 2021-08-30 05-36-35" was issued'
  },
  Jobs_Monitor_Tab_Info_Pane: {
    Pending_State: 'Pending',
    Error_State: 'Error',
    Error_State_With_Message: 'Error. This function intentionally fails',
    Tab_List: ['Overview', 'Inputs', 'Artifacts', 'Results', 'Logs', 'Pods'],
    Overview_Headers: [
      'UID:',
      'Start time:',
      'Last Updated:',
      'Run on spot:',
      'Node selector:',
      'Priority:',
      'Handler:',
      'Parameters:',
      'Function:',
      'Function tag:',
      'Results:',
      'Labels:',
      'Log level:',
      'Output path:',
      'Total iterations:',
      'Attempt count:',
      'Maximum attempts:'
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
    MLRunAccessDeniedError:
      "MLRunAccessDeniedError('Not allowed to create/update internal secrets (key starts with mlrun.)')",
    Must_Select_One: 'Must select at least one',
    Must_Select_One_Partition: 'Must select at least one partitioning option',
    Already_Scheduled: 'This job is already scheduled',
    One_Day_Option: 'Must select at least one day option'
  },
  Dropdown_Options: {
    Tag_Filer_Options: ['All tags', 'latest'],
    Tag_Filer_Options_Main_Table: ['latest'],
    Status_Filter_Options: ['All', 'Completed', 'Running', 'Pending', 'Error', 'Aborted'],
    Entity_Type_Filter_Options: ['All', 'Job', 'Endpoint', 'Application'],
    Severity_Filter_Options: ['All', 'High', 'Medium', 'Low'],
    Event_Type_Filter_Options: ['All', 'Job failed', 'Data drift detected', 'Data drift suspected', 'Conc drift detected', 'Conc drift suspected', 'MM performance detected', 'MM performance suspected', 'System performance detected', 'System performance suspected', 'MM app anomaly detected', 'MM app anomaly suspected', 'MM app failed'],
    Event_Type_Endpoint_Filter_Options: ['All', 'Data drift detected', 'Data drift suspected', 'Conc drift detected', 'Conc drift suspected', 'MM performance detected', 'MM performance suspected', 'System performance detected', 'System performance suspected', 'MM app anomaly detected', 'MM app anomaly suspected'],
    Event_Type_Job_Filter_Options: ['All', 'Job failed'],
    Event_Type_Application_Filter_Options: ['All', 'MM app failed'],
    Endpoint_Mode_Filter_Options: ['All', 'Real-time', 'Batch'],
    Jobs_Status_Filter_Options: [
      'All',
      'Aborted',
      'Aborting',
      'Completed',
      'Error',
      'Running',
      'Pending',
      'Pending retry'
    ],
    Workflows_Status_Filter_Options: ['All', 'Error', 'Failed', 'Running', 'Completed', 'Terminating'],
    Jobs_Type_Filter_Options: [
      'All',
      'Job',
      'Spark',
      'Horovod',
      'Dask',
      'Databricks',
      'Local',
      'Handler'
    ],
    Scheduled_Type_Filter_Options: [
      'All',
      'Job',
      'Workflow',
      'Spark',
      'Horovod',
      'Dask',
      'Databricks'
    ],
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
    Date_Picker_Filter_Options_Endpoint: [
      'Past hour',
      'Past 24 hours',
      'Past week',
      'Past month',
      'Custom range'
    ],
    Date_Picker_Filter_Options_Monitoring_App: [
      'Past hour',
      'Past 24 hours',
      'Past week',
      'Past month',
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
    Metrics_Date_Picker_Filter_Options: [
      'Past hour',
      'Past 24 hours',
      'Past week',
      'Past month',
      'Custom range'
    ],
    Parameters_Table_Type_Options: ['str', 'int', 'float', 'bool', 'list', 'map'],
    Parameter_Table_Simple_Hyper_Options: ['Simple', 'Hyper'],
    Turning_Strategy_Options: ['List', 'Grid', 'Random'],
    Criteria_Dropdown_Options: ['Max', 'Min'],
    Volume_Mount_Options: ['Auto', 'Manual', 'None'],
    Hyperparameter_Strategy_Options: ['List', 'Grid', 'Random'],
    Memory_Unit_Options: ['Bytes', 'KB', 'KiB', 'MB', 'MiB', 'GB', 'GiB', 'TB', 'TiB'],
    CPU_Unit_Options: ['cpu', 'millicpu'],
    Time_Unit_Options: ['Minute', 'Hourly', 'Daily', 'Weekly', 'Monthly'],
    Minute_Intervals_Dropdown_Options: ['Every 10', 'Every 15', 'Every 20', 'Every 30'],
    Hour_Intervals_Dropdown_Options: [
      'Every 1',
      'Every 2',
      'Every 3',
      'Every 4',
      'Every 6',
      'Every 12'
    ],
    Partition_Granularity_Options: ['Second', 'Minute', 'Hour', 'Day', 'Month', 'Year'],
    Pods_Priority: ['Low', 'Medium', 'High'],
    Schedule_Variants: ['Minute', 'Hourly', 'Daily', 'Weekly', 'Monthly'],
    Schedule_Minutes_Variants: ['10', '15', '20', '30'],
    Schedule_Hours_Variants: ['1', '2', '3', '4', '6', '12']
  },
  No_Data_Message: {
    Common_Message_Jobs_Monitoring:
      /No data matches the filter: "Start time: \d{2}\/\d{2}\/\d{4} \d{2}:\d{2} - \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}, Project: (.+?)"/,
    Common_Message_Monitor_Jobs_Name: /No data matches the filter: "Name: (.+?)"/,
    Common_Message_LLM_Prompt_Name: /No data matches the filter: "Name: (.+?), LLM prompt version tag: (.+?), Show best iteration only: (.+?)"/,
    Common_Message_LLM_Prompt_Label: /No data matches the filter: "Name: (.+?), LLM prompt version tag: (.+?), Labels: (.+?), Show best iteration only: (.+?)"/,
    Common_Message_LLM_Prompt_Tag: /No data matches the filter: "LLM prompt version tag: (.+?), Show best iteration only: (.+?)"/,
    Common_Message_Artifact_Tag: /No data matches the filter: "Version tag: (.+?), Show best iteration only: (.+?)"/,
    Common_Message_Jobs_Monitoring_Workflow_Project:
      /No data matches the filter: "Created at: \d{2}\/\d{2}\/\d{4} \d{2}:\d{2} - \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}, Project: (.+?)"/,
    Common_Message_Jobs_Monitoring_Status:
      /No data matches the filter: "Created at: \d{2}\/\d{2}\/\d{4} \d{2}:\d{2} - \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}, Status: (.+?)"/,
    Common_Message_Monitoring_Workflow:
      /No data matches the filter: "Created at: \d{2}\/\d{2}\/\d{4} \d{2}:\d{2} - \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}"/,
    Common_Message_Monitoring_Workflow_Status:
      /No data matches the filter: "Status: (.+?)"/,
    Common_Message_Jobs_Monitoring_Type:
      /No data matches the filter: "Start time: \d{2}\/\d{2}\/\d{4} \d{2}:\d{2} - \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}, Type: (.+?)"/,
    Common_Message_Monitor_Jobs:
      /No data matches the filter: "Start time: \d{2}\/\d{2}\/\d{4} \d{2}:\d{2} - \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}"/,
    Common_Message_Jobs_Monitoring_Scheduled:
      /No data matches the filter: "Scheduled at: \d{2}\/\d{2}\/\d{4} \d{2}:\d{2} - \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}, Project: (.+?)"/,
    Common_Message_Scheduled_Type:
      /No data matches the filter: "Scheduled at: \d{2}\/\d{2}\/\d{4} \d{2}:\d{2} - \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}, Type: (.+?)"/,
    Common_Message: 'No data matches the filter: "Version Tag: latest, Name: ccccc"',
    Common_Message_Feature: 'No data matches the filter: "Version Tag: latest"',
    Common_Message_Feature_Vector_Tab:
      'No data matches the filter: "Tag: latest, Project: test-test"',
    Common_Message_Feature_Vector: 'No data matches the filter: "Version Tag: latest"',
    Common_Message_Feature_Sets: 'No data matches the filter: "Version Tag: latest"',
    No_Data: 'No data to show',
    No_Features_Yet: 'No features found.',
    No_Consumer_Group_Yet: 'You haven’t created any consumer group yet',
    No_Datasets_data: 'No data matches the filter: "Version tag: latest, Labels: v3io_user=123, Show best iteration only: true"',
    No_Documents_data: 'No data matches the filter: "Version tag: latest, Show best iteration only: true"',
    No_Files_data: 'No data matches the filter: "Version tag: latest, Labels: v3io_user=123, Show best iteration only: true"',
    No_Models_data: 'No data matches the filter: "Version tag: latest, Labels: MY-KEY, Show best iteration only: true"',
    No_Pods_data: 'Pods not found, it is likely because Kubernetes removed these pods listing',
    No_Pods_data_Completion: 'Pods not found, it is likely because Kubernetes removed these pods listing after their completion'
  }
}
