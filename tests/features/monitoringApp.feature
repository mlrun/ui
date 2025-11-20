Feature: Monitoring app Page

    Testcases that verifies functionality on Monitoring app Page
    
  @MLMA
  @smoke
  Scenario: MLMA001 - Check action bar components on Monitoring app page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    When turn on demo mode with query params "false"
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "default" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Monitoring app" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
    And wait load page
    Then click on breadcrumbs "project" label on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "default" value
    And select "tab" with "Monitoring app" value in breadcrumbs menu
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
    And wait load page
    Then verify "Date_Picker_Filter_Dropdown" element visibility on "Monitoring_App" wizard
    Then verify "Date_Picker_Filter_Dropdown" dropdown on "Monitoring_App" wizard selected option value "Past 24 hours"
    Then verify "Date_Picker_Filter_Dropdown" dropdown element on "Monitoring_App" wizard should contains "Dropdown_Options"."Date_Picker_Filter_Options_Monitoring_App"
    Then verify "Refresh_Button" element visibility on "Monitoring_App" wizard
    Then verify "Refresh_Button" element on "Monitoring_App" wizard should display hover tooltip "Common_Tooltips"."Refresh_Button"
    When select "Past hour" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Monitoring_App" wizard
    And wait load page
    Then verify "Date_Picker_Filter_Dropdown" dropdown on "Monitoring_App" wizard selected option value "Past hour"
    When select "Past week" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Monitoring_App" wizard
    And wait load page
    Then verify "Date_Picker_Filter_Dropdown" dropdown on "Monitoring_App" wizard selected option value "Past week"
    When select "Past month" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Monitoring_App" wizard
    And wait load page
    Then verify "Date_Picker_Filter_Dropdown" dropdown on "Monitoring_App" wizard selected option value "Past month"

  @MLMA
  @smoke
  Scenario: MLMA002 - Check statistics section components on Monitoring app page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    When turn on demo mode with query params "false"
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "default" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Monitoring app" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
    Then verify "Applications_Stats_Title" element visibility on "Monitoring_App" wizard
    Then "Applications_Stats_Title" element on "Monitoring_App" should contains "Applications" value
    Then verify "Applications_Stats_Counter" element visibility on "Monitoring_App" wizard
    Then verify "Apps_Status_Title" element visibility on "Monitoring_App" wizard
    Then "Apps_Status_Title" element on "Monitoring_App" should contains "Apps Status" value
    Then verify "Apps_Status_Running_SubTitle" element visibility on "Monitoring_App" wizard
    Then "Apps_Status_Running_SubTitle" element on "Monitoring_App" should contains "Running" value
    Then verify "Apps_Status_Running_Counter" element visibility on "Monitoring_App" wizard
    Then verify "Apps_Status_Running_Tip" element visibility on "Monitoring_App" wizard
    Then verify "Apps_Status_Running_Tip" element on "Monitoring_App" wizard should display hover tooltip "Common_Tooltips"."Running"
    Then verify "Apps_Status_Failed_SubTitle" element visibility on "Monitoring_App" wizard
    Then "Apps_Status_Failed_SubTitle" element on "Monitoring_App" should contains "Failed" value
    Then verify "Apps_Status_Failed_Counter" element visibility on "Monitoring_App" wizard
    Then verify "Apps_Status_Failed_Tip" element visibility on "Monitoring_App" wizard
    Then verify "Apps_Status_Failed_Tip" element on "Monitoring_App" wizard should display hover tooltip "Common_Tooltips"."Failed_Tip"
    Then verify "Endpoints_Stats_Title" element visibility on "Monitoring_App" wizard
    Then "Endpoints_Stats_Title" element on "Monitoring_App" should contains "Endpoints" value
    Then verify "Endpoints_Batch_SubTitle" element visibility on "Monitoring_App" wizard
    Then "Endpoints_Batch_SubTitle" element on "Monitoring_App" should contains "Batch" value
    Then verify "Endpoints_Batch_Counter" element visibility on "Monitoring_App" wizard
    Then verify "Endpoints_RealTime_SubTitle" element visibility on "Monitoring_App" wizard
    Then "Endpoints_RealTime_SubTitle" element on "Monitoring_App" should contains "Real-time" value
    Then verify "Endpoints_RealTime_Counter" element visibility on "Monitoring_App" wizard
    Then verify "RunningFrequency_Stats_Title" element visibility on "Monitoring_App" wizard
    Then "RunningFrequency_Stats_Title" element on "Monitoring_App" should contains "Running interval" value
    Then verify "RunningFrequency_Value_Title" element visibility on "Monitoring_App" wizard
    Then "RunningFrequency_Value_Title" element on "Monitoring_App" should contains "Every 10 minutes" value

  @MLMA
  @smoke
  Scenario: MLMA003 - Check monitoring-app section components on Monitoring app page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    When turn on demo mode with query params "false"
    And wait load page
    And select "tab" with "Monitoring app" value in breadcrumbs menu
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
    And wait load page
    Then verify "Model_Endpoint_Detections_Title" element visibility on "Monitoring_App" wizard
    Then "Model_Endpoint_Detections_Title" element on "Monitoring_App" should contains "Model Endpoints with suspected/detected issue" value
    Then verify "Model_Endpoint_Detections_Tip" element visibility on "Monitoring_App" wizard
    Then verify "Model_Endpoint_Detections_Tip" element on "Monitoring_App" wizard should display hover hint "Label_Hint"."Model_Endpoint_With_Detections"
    Then verify "Model_Endpoint_Detections_Chart" element visibility on "Monitoring_App" wizard
    Then verify "Operating_Functions_Title" element visibility on "Monitoring_App" wizard
    Then "Operating_Functions_Title" element on "Monitoring_App" should contains "System functions" value
    Then verify "Operating_Functions_Tip" element visibility on "Monitoring_App" wizard
    Then verify "Operating_Functions_Tip" element on "Monitoring_App" wizard should display hover hint "Label_Hint"."Operating_Functions"
    Then verify "Operating_Functions_Table" element visibility on "Monitoring_App" wizard
    Then verify "Operating_Functions_Lag_Tip" element visibility on "Monitoring_App" wizard
    Then verify "Operating_Functions_Lag_Tip" element on "Monitoring_App" wizard should display hover hint "Label_Hint"."Lag"
    Then verify "Operating_Functions_Commited_Offset_Tip" element visibility on "Monitoring_App" wizard
    Then verify "Operating_Functions_Commited_Offset_Tip" element on "Monitoring_App" wizard should display hover hint "Label_Hint"."Commited_Offset"

  @MLMA
  @smoke
  Scenario: MLMA004 - Check All Applications section components on Monitoring app page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    When turn on demo mode with query params "false"
    And wait load page
    And select "tab" with "Monitoring app" value in breadcrumbs menu
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
    And wait load page
    Then verify "All_Applications_Title" element visibility on "Monitoring_App" wizard
    Then "All_Applications_Title" element on "Monitoring_App" should contains "All Applications" value
    Then verify "All_Applications_Table" element visibility on "Monitoring_App" wizard
    Then verify "All_Applications_Lag_Tip" element visibility on "Monitoring_App" wizard
    Then verify "All_Applications_Lag_Tip" element on "Monitoring_App" wizard should display hover hint "Label_Hint"."Lag"
    Then verify "All_Applications_Commited_Offset_Tip" element visibility on "Monitoring_App" wizard
    Then verify "All_Applications_Commited_Offset_Tip" element on "Monitoring_App" wizard should display hover hint "Label_Hint"."Commited_Offset"
    Then verify "open_metrics" option is present on "Monitoring_App" wizard in "All_Applications_Table" table with "monitorAppV1" value in "name" column
    Then verify "open_metrics" option on "Monitoring_App" wizard in "All_Applications_Table" table with "monitorAppV1" value in "name" column should display hover tooltip "Common_Tooltips"."Open_Metrics" with scroll "false"
    Then click on "open_metrics" option on "Monitoring_App" wizard in "All_Applications_Table" table with "monitorAppV1" value in "name" column with scroll "false"
    And wait load page
    Then verify "Application_Monitoring_Button" element visibility on "Application_Metrics" wizard
    Then "Application_Monitoring_Button" element on "Application_Metrics" should contains "Application monitoring" value
    Then navigate back
    And wait load page
    Then click on cell with value "monitorAppV1" in "name" column in "All_Applications_Table" table on "Monitoring_App" wizard
    And wait load page
    Then verify "Application_Metrics_Button" element visibility on "Application_Monitoring" wizard
    Then "Application_Metrics_Button" element on "Application_Monitoring" should contains "Application metrics" value

  @MLMA
  @smoke
  Scenario: MLMA005 - Check action bar components on Application monitoring page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    When turn on demo mode with query params "false"
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Monitoring app" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
    And wait load page
    Then verify "All_Applications_Title" element visibility on "Monitoring_App" wizard
    Then "All_Applications_Title" element on "Monitoring_App" should contains "All Applications" value
    Then click on cell with value "monitorAppV2" in "name" column in "All_Applications_Table" table on "Monitoring_App" wizard
    And wait load page
    Then verify "Back_Button" element visibility on "Application_Monitoring" wizard
    Then verify "Back_Button" element on "Application_Monitoring" wizard should display hover tooltip "Common_Tooltips"."Back_Button"
    Then click on "Back_Button" element on "Application_Monitoring" wizard
    And wait load page
    Then verify "All_Applications_Title" element visibility on "Monitoring_App" wizard
    Then "All_Applications_Title" element on "Monitoring_App" should contains "All Applications" value
    Then click on cell with value "monitorAppV2" in "name" column in "All_Applications_Table" table on "Monitoring_App" wizard
    And wait load page
    Then verify "Application_Name" element visibility on "Application_Monitoring" wizard
    Then "Application_Name" element on "Application_Monitoring" should contains "monitorAppV2" value
    Then verify "Date_Picker_Filter_Dropdown" element visibility on "Application_Monitoring" wizard
    Then verify "Date_Picker_Filter_Dropdown" dropdown on "Application_Monitoring" wizard selected option value "Past 24 hours"
    Then verify "Date_Picker_Filter_Dropdown" dropdown element on "Application_Monitoring" wizard should contains "Dropdown_Options"."Date_Picker_Filter_Options_Monitoring_App"
    When select "Past hour" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Application_Monitoring" wizard
    And wait load page
    Then verify "Date_Picker_Filter_Dropdown" dropdown on "Application_Monitoring" wizard selected option value "Past hour"
    When select "Past week" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Application_Monitoring" wizard
    And wait load page
    Then verify "Date_Picker_Filter_Dropdown" dropdown on "Application_Monitoring" wizard selected option value "Past week"
    When select "Past month" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Application_Monitoring" wizard
    And wait load page
    Then verify "Date_Picker_Filter_Dropdown" dropdown on "Application_Monitoring" wizard selected option value "Past month"
    Then verify "Application_Metrics_Button" element visibility on "Application_Monitoring" wizard
    Then "Application_Metrics_Button" element on "Application_Monitoring" should contains "Application metrics" value
    Then click on "Application_Metrics_Button" element on "Application_Monitoring" wizard
    And wait load page
    Then verify "Application_Monitoring_Button" element visibility on "Application_Metrics" wizard
    Then "Application_Monitoring_Button" element on "Application_Metrics" should contains "Application monitoring" value
    Then click on "Application_Monitoring_Button" element on "Application_Metrics" wizard
    And wait load page
    Then verify "Application_Name" element visibility on "Application_Monitoring" wizard
    Then "Application_Name" element on "Application_Monitoring" should contains "monitorAppV2" value
    And wait load page
    Then verify "Refresh_Button" element visibility on "Application_Monitoring" wizard
    Then verify "Refresh_Button" element on "Application_Monitoring" wizard should display hover tooltip "Common_Tooltips"."Refresh_Button"
    And wait load page
    Then click on "Refresh_Button" element on "Application_Monitoring" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
    Then verify "Back_Button" element visibility on "Application_Monitoring" wizard
    Then "Application_Name" element on "Application_Monitoring" should contains "monitorAppV2" value
    Then "Application_Metrics_Button" element on "Application_Monitoring" should contains "Application metrics" value

  @MLMA
  @smoke
  Scenario: MLMA006 - Check statistics section components on Application monitoring page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    When turn on demo mode with query params "false"
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Monitoring app" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
    And wait load page
    Then verify "All_Applications_Title" element visibility on "Monitoring_App" wizard
    Then "All_Applications_Title" element on "Monitoring_App" should contains "All Applications" value
    Then click on cell with value "monitorAppV1" in "name" column in "All_Applications_Table" table on "Monitoring_App" wizard
    And wait load page
    Then verify "Back_Button" element visibility on "Application_Monitoring" wizard
    Then verify "App_Status_Title" element visibility on "Application_Monitoring" wizard
    Then "App_Status_Title" element on "Application_Monitoring" should contains "App Status" value
    Then verify "App_Status_SubTitle" element visibility on "Application_Monitoring" wizard
    Then "App_Status_SubTitle" element on "Application_Monitoring" should contains "Ready" value
    Then verify "Endpoints_Title" element visibility on "Application_Monitoring" wizard
    Then "Endpoints_Title" element on "Application_Monitoring" should contains "Endpoints" value
    Then verify "Endpoints_Tip" element visibility on "Application_Monitoring" wizard
    Then verify "Endpoints_Tip" element on "Application_Monitoring" wizard should display hover hint "Label_Hint"."Endpoints_Tip"
    Then verify "Endpoints_Counter" element visibility on "Application_Monitoring" wizard
    Then verify "Detections_Title" element visibility on "Application_Monitoring" wizard
    Then "Detections_Title" element on "Application_Monitoring" should contains "Detections" value
    Then verify "Detections_Counter" element visibility on "Application_Monitoring" wizard
    Then verify "Possible_Detections_Title" element visibility on "Application_Monitoring" wizard
    Then "Possible_Detections_Title" element on "Application_Monitoring" should contains "Possible Detections" value
    Then verify "Possible_Detections_Counter" element visibility on "Application_Monitoring" wizard
    Then verify "Lag_Title" element visibility on "Application_Monitoring" wizard
    Then "Lag_Title" element on "Application_Monitoring" should contains "Lag" value
    Then verify "Lag_Tip" element visibility on "Application_Monitoring" wizard
    Then verify "Lag_Tip" element on "Application_Monitoring" wizard should display hover hint "Label_Hint"."Lag"
    Then verify "Lag_Counter" element visibility on "Application_Monitoring" wizard
    Then verify "Commited_Offset_Title" element visibility on "Application_Monitoring" wizard
    Then "Commited_Offset_Title" element on "Application_Monitoring" should contains "Commited Offset" value
    Then verify "Commited_Offset_Tip" element visibility on "Application_Monitoring" wizard
    Then verify "Commited_Offset_Tip" element on "Application_Monitoring" wizard should display hover hint "Label_Hint"."Commited_Offset"
    Then verify "Commited_Offset_Counter" element visibility on "Application_Monitoring" wizard

  @MLMA
  @smoke
  Scenario: MLMA007 - Check Artifacts section components on Application monitoring page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    When turn on demo mode with query params "false"
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Monitoring app" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
    And wait load page
    Then verify "All_Applications_Title" element visibility on "Monitoring_App" wizard
    Then "All_Applications_Title" element on "Monitoring_App" should contains "All Applications" value
    Then click on cell with value "monitorAppV1" in "name" column in "All_Applications_Table" table on "Monitoring_App" wizard
    And wait load page
    Then verify "Artifacts_Title" element visibility on "Application_Monitoring" wizard
    Then "Artifacts_Title" element on "Application_Monitoring" should contains "Artifacts" value
    Then verify "Artifacts_Table" element visibility on "Application_Monitoring" wizard    
    Then verify "See_All_Link" element visibility on "Application_Monitoring" wizard
    Then click on "See_All_Link" element on "Application_Monitoring" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Artifacts" value
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    And wait load page
    Then "Table_Label_Filter_Input" element on "FilterBy_Popup" should contains "mlrun/app-name=monitorAppV1" attribute value
    And wait load page

  @MLMA
  @smoke
  Scenario: MLMA008 - Check Results section components on Application monitoring page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    When turn on demo mode with query params "false"
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Monitoring app" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
    And wait load page
    Then verify "All_Applications_Title" element visibility on "Monitoring_App" wizard
    Then "All_Applications_Title" element on "Monitoring_App" should contains "All Applications" value
    Then click on cell with value "monitorAppV1" in "name" column in "All_Applications_Table" table on "Monitoring_App" wizard
    And wait load page
    Then verify "Results_Title" element visibility on "Application_Monitoring" wizard
    Then "Results_Title" element on "Application_Monitoring" should contains "Results" value
    Then verify "Results_Table" element visibility on "Application_Monitoring" wizard

  @MLMA
  @smoke
  Scenario: MLMA009 - Check Metrics section components on Application monitoring page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    When turn on demo mode with query params "false"
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Monitoring app" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
    And wait load page
    Then verify "All_Applications_Title" element visibility on "Monitoring_App" wizard
    Then "All_Applications_Title" element on "Monitoring_App" should contains "All Applications" value
    Then click on cell with value "monitorAppV1" in "name" column in "All_Applications_Table" table on "Monitoring_App" wizard
    And wait load page
    Then verify "Metrics_Title" element visibility on "Application_Monitoring" wizard
    Then "Metrics_Title" element on "Application_Monitoring" should contains "Metrics" value
    Then verify "Metrics_Tip" element visibility on "Application_Monitoring" wizard
    Then verify "Metrics_Tip" element on "Application_Monitoring" wizard should display hover hint "Label_Hint"."Metrics_Tip"
    Then verify "Metrics_Table" element visibility on "Application_Monitoring" wizard

  @MLMA
  @smoke
  Scenario: MLMA010 - Check Shards/partitions status section components on Application monitoring page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    When turn on demo mode with query params "false"
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Monitoring app" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
    And wait load page
    Then verify "All_Applications_Title" element visibility on "Monitoring_App" wizard
    Then "All_Applications_Title" element on "Monitoring_App" should contains "All Applications" value
    Then click on cell with value "monitorAppV1" in "name" column in "All_Applications_Table" table on "Monitoring_App" wizard
    And wait load page
    When scroll to the "Shards_Partitions_Status_Title" element on "Application_Monitoring" wizard
    Then verify "Shards_Partitions_Status_Title" element visibility on "Application_Monitoring" wizard
    Then "Shards_Partitions_Status_Title" element on "Application_Monitoring" should contains "Shards/partitions status" value
    Then verify "Shards_Partitions_Status_Tip" element visibility on "Application_Monitoring" wizard
    Then verify "Shards_Partitions_Status_Tip" element on "Application_Monitoring" wizard should display hover hint "Label_Hint"."Shards_Partitions_Status_Tip"
    Then verify "Shards_Partitions_Status_Table" element visibility on "Application_Monitoring" wizard
    Then verify "Partitions_Status_Lag_Tip" element visibility on "Application_Monitoring" wizard
    Then verify "Partitions_Status_Lag_Tip" element on "Application_Monitoring" wizard should display hover hint "Label_Hint"."Lag"
    Then verify "Partitions_Status_Commited_Offset_Tip" element visibility on "Application_Monitoring" wizard
    Then verify "Partitions_Status_Commited_Offset_Tip" element on "Application_Monitoring" wizard should display hover hint "Label_Hint"."Commited_Offset"

  @MLMA
  @smoke
  Scenario: MLMA011 - Check action bar components on Applications metrics page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    When turn on demo mode with query params "false"
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Monitoring app" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
    And wait load page
    Then verify "All_Applications_Title" element visibility on "Monitoring_App" wizard
    Then "All_Applications_Title" element on "Monitoring_App" should contains "All Applications" value
    Then click on cell with value "monitorAppV1" in "name" column in "All_Applications_Table" table on "Monitoring_App" wizard
    And wait load page
    Then verify "Application_Metrics_Button" element visibility on "Application_Monitoring" wizard
    Then "Application_Metrics_Button" element on "Application_Monitoring" should contains "Application metrics" value
    Then click on "Application_Metrics_Button" element on "Application_Monitoring" wizard
    And wait load page
    Then verify "Back_Button" element visibility on "Application_Metrics" wizard
    Then verify "Back_Button" element on "Application_Metrics" wizard should display hover tooltip "Common_Tooltips"."Back_Button"
    Then click on "Back_Button" element on "Application_Metrics" wizard
    And wait load page
    Then verify "Back_Button" element visibility on "Application_Monitoring" wizard
    Then click on "Back_Button" element on "Application_Monitoring" wizard
    And wait load page
    Then verify "All_Applications_Title" element visibility on "Monitoring_App" wizard
    Then "All_Applications_Title" element on "Monitoring_App" should contains "All Applications" value
    Then verify "open_metrics" option is present on "Monitoring_App" wizard in "All_Applications_Table" table with "monitorAppV1" value in "name" column
    Then click on "open_metrics" option on "Monitoring_App" wizard in "All_Applications_Table" table with "monitorAppV1" value in "name" column with scroll "false"
    And wait load page
    Then verify "Applications_Metrics_Title" element visibility on "Application_Metrics" wizard
    Then "Applications_Metrics_Title" element on "Application_Metrics" should contains "Applications metrics:" value
    Then verify "Application_Name" element visibility on "Application_Metrics" wizard
    Then "Application_Name" element on "Application_Metrics" should contains "monitorAppV1" value
    Then verify "Application_Monitoring_Button" element visibility on "Application_Metrics" wizard
    Then "Application_Monitoring_Button" element on "Application_Metrics" should contains "Application monitoring" value
    Then verify "Refresh_Button" element visibility on "Application_Metrics" wizard
    Then verify "Refresh_Button" element on "Application_Metrics" wizard should display hover tooltip "Common_Tooltips"."Refresh_Button"
    And wait load page
    Then click on "Refresh_Button" element on "Application_Metrics" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
    Then verify "Back_Button" element visibility on "Application_Metrics" wizard
    Then "Application_Name" element on "Application_Metrics" should contains "monitorAppV1" value
    Then "Application_Monitoring_Button" element on "Application_Metrics" should contains "Application monitoring" value

  @MLMA
  @smoke
  Scenario: MLMA012 - Check Endpoints list section components on Applications metrics page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    When turn on demo mode with query params "false"
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Monitoring app" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
    And wait load page
    Then verify "All_Applications_Title" element visibility on "Monitoring_App" wizard
    Then "All_Applications_Title" element on "Monitoring_App" should contains "All Applications" value
    Then click on cell with value "monitorAppV1" in "name" column in "All_Applications_Table" table on "Monitoring_App" wizard
    And wait load page
    Then verify "Application_Metrics_Button" element visibility on "Application_Monitoring" wizard
    Then "Application_Metrics_Button" element on "Application_Monitoring" should contains "Application metrics" value
    Then click on "Application_Metrics_Button" element on "Application_Monitoring" wizard
    And wait load page
    Then verify "Applications_Metrics_Title" element visibility on "Application_Metrics" wizard
    Then "Applications_Metrics_Title" element on "Application_Metrics" should contains "Applications metrics:" value
    Then verify "Endpoints_List_Section" element visibility on "Application_Metrics" wizard
    Then verify "Search_Endpoints_Counter" element visibility on "Application_Metrics" wizard
    Then "Search_Endpoints_Counter" element on "Application_Metrics" should contains "5 endpoints found" value
    Then verify "Endpoints_List_Table" element visibility on "Application_Metrics" wizard
    Then verify "Search_By_Endpoint_Filter_Input" element visibility on "Application_Metrics" wizard
    Then type value "boo" to "Search_By_Endpoint_Filter_Input" field on "Application_Metrics" wizard
    And wait load page
    Then value in "name" column with "text" in "Endpoints_List_Table" on "Application_Metrics" wizard should contains "GradientBoostingClassifier"
    Then "Search_Endpoints_Counter" element on "Application_Metrics" should contains "2 endpoints found" value
    Then type value "RandomForestClassifier2" to "Search_By_Endpoint_Filter_Input" field on "Application_Metrics" wizard
    And wait load page
    Then value in "name" column with "text" in "Endpoints_List_Table" on "Application_Metrics" wizard should contains "RandomForestClassifier"
    Then "Search_Endpoints_Counter" element on "Application_Metrics" should contains "1 endpoint found" value
    Then type value "qwe" to "Search_By_Endpoint_Filter_Input" field on "Application_Metrics" wizard
    And wait load page
    Then "Search_Endpoints_Counter" element on "Application_Metrics" should contains "0 endpoints found" value

  @MLMA
  @smoke
  Scenario: MLMA013 - Check redirection to Model Endpoints filtering by mode list 
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    When turn on demo mode with query params "false"
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Monitoring app" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
    And wait load page
    Then verify "All_Applications_Title" element visibility on "Monitoring_App" wizard
    Then "All_Applications_Title" element on "Monitoring_App" should contains "All Applications" value
    Then verify "Endpoints_Stats_Title" element visibility on "Monitoring_App" wizard
    Then "Endpoints_Stats_Title" element on "Monitoring_App" should contains "Endpoints" value
    Then verify "Endpoints_Batch_SubTitle" element visibility on "Monitoring_App" wizard
    Then "Endpoints_Batch_SubTitle" element on "Monitoring_App" should contains "Batch" value
    Then verify "Endpoints_Batch_Counter" element visibility on "Monitoring_App" wizard
    Then verify "Endpoints_RealTime_SubTitle" element visibility on "Monitoring_App" wizard
    Then "Endpoints_RealTime_SubTitle" element on "Monitoring_App" should contains "Real-time" value
    Then verify "Endpoints_RealTime_Counter" element visibility on "Monitoring_App" wizard
    And wait load page
    Then click on "Endpoints_Batch_Counter" element on "Monitoring_App" wizard
    And wait load page
    Then verify redirection to "projects/default/models/model-endpoints?me-mode=batch"
    Then verify breadcrumbs "tab" label should be equal "Models" value
    Then verify "Models_Tab_Selector" on "Models" wizard should contains "Models"."Tab_List"
    Then verify "Model Endpoints" tab is active in "Models_Tab_Selector" on "Models" wizard
    Then verify "Table_FilterBy_Button" element visibility on "Model_Endpoints" wizard
    Then verify "Table_FilterBy_Button" element on "Model_Endpoints" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button_1"
    Then click on "Table_FilterBy_Button" element on "Model_Endpoints" wizard
    Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
    Then verify "Mode_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
    Then verify "Mode_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Batch"
    Then verify "Mode_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Endpoint_Mode_Filter_Options"
    And wait load page
    Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
    Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
    Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
    Then verify "Clear_Button" element on "FilterBy_Popup" wizard is enabled
    Then navigate back
    And wait load page
    Then verify redirection to "projects/default/monitoring-app"
    Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
    Then verify "Endpoints_Stats_Title" element visibility on "Monitoring_App" wizard
    Then verify "Endpoints_RealTime_SubTitle" element visibility on "Monitoring_App" wizard
    Then "Endpoints_RealTime_SubTitle" element on "Monitoring_App" should contains "Real-time" value
    Then verify "Endpoints_RealTime_Counter" element visibility on "Monitoring_App" wizard
    And wait load page
    Then click on "Endpoints_RealTime_Counter" element on "Monitoring_App" wizard
    And wait load page
    Then verify redirection to "projects/default/models/model-endpoints?me-mode=realTime"
    Then verify breadcrumbs "tab" label should be equal "Models" value
    Then verify "Models_Tab_Selector" on "Models" wizard should contains "Models"."Tab_List"
    Then verify "Model Endpoints" tab is active in "Models_Tab_Selector" on "Models" wizard
    Then verify "Table_FilterBy_Button" element visibility on "Model_Endpoints" wizard
    Then verify "Table_FilterBy_Button" element on "Model_Endpoints" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button_1"
    Then click on "Table_FilterBy_Button" element on "Model_Endpoints" wizard
    Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
    Then verify "Mode_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
    Then verify "Mode_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Real-time"
    Then verify "Mode_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Endpoint_Mode_Filter_Options"
    And wait load page
    Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
    Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
    Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
    Then verify "Clear_Button" element on "FilterBy_Popup" wizard is enabled
    Then navigate back
    And wait load page
    Then verify redirection to "projects/default/monitoring-app"
    Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Models" value
    And wait load page
    And select "Model Endpoints" tab in "Models_Tab_Selector" on "Models" wizard
    And wait load page
    Then verify "Model Endpoints" tab is active in "Models_Tab_Selector" on "Models" wizard
    Then verify "Table_FilterBy_Button" element visibility on "Model_Endpoints" wizard
    Then verify "Table_FilterBy_Button" element on "Model_Endpoints" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button"
    Then click on "Table_FilterBy_Button" element on "Model_Endpoints" wizard
    Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
    Then verify "Mode_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
    Then verify "Mode_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
    Then verify "Mode_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Endpoint_Mode_Filter_Options"
    And wait load page
    Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
    Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
    Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
    Then verify "Clear_Button" element on "FilterBy_Popup" wizard is disabled
