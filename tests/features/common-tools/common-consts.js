module.exports = {
  Feature_Store: {
    Tab_List: ['Feature Sets', 'Features', 'Feature Vectors', 'Datasets']
  },
  Feature_Sets_Info_Pane: {
    Tab_List: [
      'Overview',
      'Features',
      'Transformations',
      'Preview',
      'Statistics',
      'Analysis'
    ]
  },
  New_Feature_Store: {
    Kind_Options: ['HTTP', 'CSV', 'PARQUET'],
    Target_Store_File_Type: [
      'CSV',
      'TSDB',
      'Parquet',
      'NoSql',
      'Dataframe',
      'Custom'
    ]
  },
  Project_Settings: {
    Tab_List: ['General', 'Secrets']
  },
  Input_Hint: {
    Artifact_Names_Unique: 'Artifact names in the same project must be unique',
    Project_Name_Hint:
      '• Valid characters: a-z, 0-9, -\n• Must being and end with: a-z, 0-9\n• Length - max: 63',
    Feature_Set_Name_Hint:
      '• Valid characters: A-Z, a-z, 0-9, -, _, .\n• Must begin and end with: A-Z, a-z, 0-9\n• Length - max: 56',
    Jobs_Name_Hint:
      '• Valid characters: A-Z, a-z, 0-9, -, _, .\n• Must begin and end with: A-Z, a-z, 0-9\n• Length - max: 63',
    Input_Field_Require: 'This field is required',
    Input_Field_Invalid: 'This field is invalid',
    URL_Field_Require: 'URL is required',
    Key_Buckering_Number_Hint:
      'If you partition by key and the number of unique keys is very high it is recommended to use buckets for ' +
      'better performance. In this case the path would be path/bucket-num/year=/month=/day= etc.. In case the ' +
      'value is 0 then no bucketing will be done and your data will be partitioned by key.',
    Function_Name_Hint:
      '• Valid characters: a-z, 0-9, -\n• Must begin and end with: a-z, 0-9\n• Length - max: 63',
    Function_Handler_Hint:
      'Enter the function handler name (e.g. for the default sample function the name should be `handler`)',
    Image_Name_Hint: 'The name of the function‘s container image',
    Resulting_Image_Hint: 'The name of the built container image',
    Base_Image_Hint:
      "The name of a base container image from which to build the function's processor image",
    Limit_Number_Warning:
      'Limit must be bigger than or equal to Request and not be less than 1',
    Limit_Number_Request_Warning:
      'Request must be less than or equal to Limit and not be less than 1',
    GPU_Minimum_Value_Warning: 'The minimum value should be 1',
    Moumt_Path_Hint: 'A mount path for referencing the data from the function',
    Data_Container_Hint:
      'The name of the data container that contains the data',
    DataAccess_Key_Hint: 'A platform data-access key',
    Relative_Directory_Path_Hint:
      'A relative directory path within the data container',
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
      'Volumes that define data paths and the required information for accessing the data from the function'
  },
  Descriptions: {
    Archive_Project:
      "Note that moving a project to archive doesn't stop it from consuming resources. We recommend that before " +
      "setting the project as archive you'll remove scheduled jobs and suspend Nuclio functions.",
    Delete_Project: 'Deleted projects can not be restored.'
  },
  Jobs_And_Workflows: {
    Tab_List: ['Monitor Jobs', 'Monitor Workflows', 'Schedule']
  },
  Jobs_Monitor_Tab: {
    'Any time': 'Any time',
    'Past hour': 3600000,
    'Past 24 hours': 86400000,
    'Past week': 604800000,
    'Past month': { min: 2419200000, max: 2678400000 },
    'Past year': 31536000000
  },
  Date_Time_Picker: {
    Error_Message: '“To” must be later than “From”'
  }
}
