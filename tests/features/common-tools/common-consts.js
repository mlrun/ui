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
  Input_Hint: {
    Artifact_Names_Unique: 'Artifact names in the same project must be unique',
    Project_Name_Hint:
      '• Valid characters: a-z, 0-9, -\n• Must being and end with: a-z, 0-9\n• Length - max: 63',
    Feature_Set_Name_Hint:
      '• Valid characters: A-Z, a-z, 0-9, -, _, .\n• Must begin and end with: A-Z, a-z, 0-9\n• Length - max: 63',
    Input_Field_Require: 'This field is required',
    URL_Field_Require: 'URL is required',
    Key_Buckering_Number_Hint:
      'If you partition by key and the number of unique keys is very high it is recommended to use buckets for ' +
      'better performance. In this case the path would be path/bucket-num/year=/month=/day= etc.. In case the ' +
      'value is 0 then no bucketing will be done and your data will be partitioned by key.'
  },
  Descriptions: {
    Archive_Project:
      "Note that moving a project to archive doesn't stop it from consuming resources. We recommend that before " +
      "setting the project as archive you'll remove scheduled jobs and suspend Nuclio functions.",
    Delete_Project: 'Deleted projects can not be restored.'
  },
  Jobs_And_Workflows: {
    Tab_List: ['Monitor', 'Schedule']
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
