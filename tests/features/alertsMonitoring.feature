Feature: Alerts Monitoring Page

    Testcases that verifies functionality on MLRun Alerts Monitoring Page

    @MLAM
    @smoke
    Scenario: MLAM001 - Check components on Alerts monitoring page
        Given open url
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        When click on "Total_Alerts_Number" element in "Monitoring_Alerts_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/alerts-monitoring?bePage=1&fePage=1"
        Then verify breadcrumbs "cross" label should be equal "Alerts monitoring" value
        Then verify breadcrumbs "projectsPage" label should be equal "Projects" value
        Then verify "Search_By_Name_Filter_Input" element visibility on "Alerts_Monitoring" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Alerts_Monitoring" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Alerts_Monitoring" wizard selected option value "Past 24 hours"
        Then verify "Date_Picker_Filter_Dropdown" dropdown element on "Alerts_Monitoring" wizard should contains "Dropdown_Options"."Date_Picker_Filter_Options"
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Alerts_Table" element visibility on "Alerts_Monitoring" wizard
        Then verify "Table_FilterBy_Button" element visibility on "Alerts_Monitoring" wizard
        Then verify "Table_FilterBy_Button" element on "Alerts_Monitoring" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button"
        Then verify "Refresh_Button" element visibility on "Alerts_Monitoring" wizard
        Then verify "Refresh_Button" element on "Alerts_Monitoring" wizard should display hover tooltip "Common_Tooltips"."Refresh_Button"
        Then click on "Refresh_Button" element on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Alerts_Table" element visibility on "Alerts_Monitoring" wizard
        Then click on "Table_FilterBy_Button" element on "Alerts_Monitoring" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
        Then verify "Project_Name_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Project_Name_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Entity_Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Entity_Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Entity_Type_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Entity_Type_Filter_Options"
        Then click on "Title" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Entity_ID_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Severity_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Severity_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Severity_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Severity_Filter_Options"
        Then click on "Title" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Event_Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Event_Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Event_Type_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Event_Type_Filter_Options"
        Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element on "FilterBy_Popup" wizard is disabled
        Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
        Then navigate back
        And wait load page
        Then verify "Monitoring_Alerts_Box_Title" element visibility in "Monitoring_Alerts_Box" on "Projects" wizard
        
    @MLAM
    @smoke
    Scenario: MLAM002 - Check redirection from Projects page by Endpoint alerts entity type
        Given open url
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Total_Endpoint_Counter_Number" element visibility in "Monitoring_Alerts_Box" on "Projects" wizard
        When click on "Total_Endpoint_Counter_Number" element in "Monitoring_Alerts_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/alerts-monitoring?entity-type=model-endpoint-result&bePage=1&fePage=1"
        Then verify breadcrumbs "cross" label should be equal "Alerts monitoring" value
        Then verify breadcrumbs "projectsPage" label should be equal "Projects" value
        Then verify "Search_By_Name_Filter_Input" element visibility on "Alerts_Monitoring" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Alerts_Monitoring" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Alerts_Monitoring" wizard selected option value "Past 24 hours"
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Alerts_Table" element visibility on "Alerts_Monitoring" wizard
        Then value in "entityType" column with "tooltip" in "Alerts_Table" on "Alerts_Monitoring" wizard should contains "Endpoint"
        Then verify "Table_FilterBy_Button" element visibility on "Alerts_Monitoring" wizard
        Then verify "Table_FilterBy_Button" element on "Alerts_Monitoring" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button_1"
        Then click on "Table_FilterBy_Button" element on "Alerts_Monitoring" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
        Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element on "FilterBy_Popup" wizard is enabled
        Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
        Then verify "Project_Name_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Project_Name_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Entity_Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Entity_Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Endpoint"
        Then verify "Entity_Type_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Entity_Type_Filter_Options"
        Then click on "Title" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Endpoint_Application_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Endpoint_Result_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Severity_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Severity_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Severity_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Severity_Filter_Options"
        Then click on "Title" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Event_Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Event_Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Event_Type_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Event_Type_Endpoint_Filter_Options"
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
    
    @MLAM
    @smoke
    Scenario: MLAM003 - Check redirection from Projects page by Jobs alerts entity type
        Given open url
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Total_Jobs_Counter_Number" element visibility in "Monitoring_Alerts_Box" on "Projects" wizard
        When click on "Total_Jobs_Counter_Number" element in "Monitoring_Alerts_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/alerts-monitoring?entity-type=job&bePage=1&fePage=1"
        Then verify breadcrumbs "cross" label should be equal "Alerts monitoring" value
        Then verify breadcrumbs "projectsPage" label should be equal "Projects" value
        Then verify "Search_By_Name_Filter_Input" element visibility on "Alerts_Monitoring" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Alerts_Monitoring" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Alerts_Monitoring" wizard selected option value "Past 24 hours"
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Alerts_Monitoring" wizard
        When pick up "Custom range" from "12/01/2024 00:00" to "12/31/2024 00:00" in "Date_Time_Picker" via "Date_Picker_Filter_Dropdown" on "Alerts_Monitoring" wizard
        Then verify from "12/01/2024 00:00" to "12/31/2024 00:00" filter band in "Custom_Range_Filter_Dropdown" filter dropdown on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Alerts_Table" element visibility on "Alerts_Monitoring" wizard
        Then value in "entityType" column with "tooltip" in "Alerts_Table" on "Alerts_Monitoring" wizard should contains "Job"
        Then verify "Table_FilterBy_Button" element visibility on "Alerts_Monitoring" wizard
        Then verify "Table_FilterBy_Button" element on "Alerts_Monitoring" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button_1"
        Then click on "Table_FilterBy_Button" element on "Alerts_Monitoring" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
        Then verify "Project_Name_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Project_Name_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Entity_Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Entity_Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Job"
        Then verify "Entity_Type_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Entity_Type_Filter_Options"
        Then click on "Title" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Job_Name_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Severity_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Severity_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Severity_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Severity_Filter_Options"
        Then click on "Title" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Event_Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Event_Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Event_Type_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Event_Type_Job_Filter_Options"
        Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element on "FilterBy_Popup" wizard is enabled
        Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard

    @MLAM
    @smoke
    Scenario: MLAM004 - Check redirection from Projects page by Application alerts entity type
        Given open url
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Total_Application_Counter_Number" element visibility in "Monitoring_Alerts_Box" on "Projects" wizard
        When click on "Total_Application_Counter_Number" element in "Monitoring_Alerts_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/alerts-monitoring?entity-type=model-monitoring-application&bePage=1&fePage=1"
        Then verify breadcrumbs "cross" label should be equal "Alerts monitoring" value
        Then verify breadcrumbs "projectsPage" label should be equal "Projects" value
        Then verify "Search_By_Name_Filter_Input" element visibility on "Alerts_Monitoring" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Alerts_Monitoring" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Alerts_Monitoring" wizard selected option value "Past 24 hours"
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Alerts_Table" element visibility on "Alerts_Monitoring" wizard
        Then value in "entityType" column with "tooltip" in "Alerts_Table" on "Alerts_Monitoring" wizard should contains "Application"
        Then verify "Table_FilterBy_Button" element visibility on "Alerts_Monitoring" wizard
        Then verify "Table_FilterBy_Button" element on "Alerts_Monitoring" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button_1"
        Then click on "Table_FilterBy_Button" element on "Alerts_Monitoring" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
        Then verify "Project_Name_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Project_Name_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Entity_Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Entity_Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Application"
        Then verify "Entity_Type_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Entity_Type_Filter_Options"
        Then click on "Title" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Entity_ID_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Severity_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Severity_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Severity_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Severity_Filter_Options"
        Then click on "Title" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Event_Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Event_Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Event_Type_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Event_Type_Application_Filter_Options"
        Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element on "FilterBy_Popup" wizard is enabled
        Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard

    @MLAM
    @smoke
    Scenario: MLAM005 - Check components on Job alert detail pane
        Given open url
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Total_Jobs_Counter_Number" element visibility in "Monitoring_Alerts_Box" on "Projects" wizard
        When click on "Total_Jobs_Counter_Number" element in "Monitoring_Alerts_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/alerts-monitoring?entity-type=job&bePage=1&fePage=1"
        Then verify breadcrumbs "cross" label should be equal "Alerts monitoring" value
        Then verify breadcrumbs "projectsPage" label should be equal "Projects" value
        Then verify "Search_By_Name_Filter_Input" element visibility on "Alerts_Monitoring" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Alerts_Monitoring" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Alerts_Monitoring" wizard selected option value "Past 24 hours"
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Alerts_Monitoring" wizard
        And wait load page
        When pick up "Custom range" from "12/01/2024 00:00" to "12/31/2024 00:00" in "Date_Time_Picker" via "Date_Picker_Filter_Dropdown" on "Alerts_Monitoring" wizard
        Then verify from "12/01/2024 00:00" to "12/31/2024 00:00" filter band in "Custom_Range_Filter_Dropdown" filter dropdown on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Alerts_Table" element visibility on "Alerts_Monitoring" wizard
        Then value in "entityType" column with "tooltip" in "Alerts_Table" on "Alerts_Monitoring" wizard should contains "Job"
        When click on cell with row index 1 in "alertName" column in "Alerts_Table" table on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Header" element visibility on "Alerts_Jobs_Info_Pane" wizard
        Then "Header" element on "Alerts_Jobs_Info_Pane" should contains "job-failure-alert1" value
        Then verify "Cross_Close_Button" element visibility on "Alerts_Jobs_Info_Pane" wizard
        Then click on "Cross_Close_Button" element on "Alerts_Jobs_Info_Pane" wizard
        Then verify "Header" element not exists on "Alerts_Jobs_Info_Pane" wizard
        When click on cell with row index 1 in "alertName" column in "Alerts_Table" table on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Header" element visibility on "Alerts_Jobs_Info_Pane" wizard
        Then verify "Overview_General_Headers" element visibility on "Alerts_Jobs_Info_Pane" wizard
        Then verify "Overview_General_Headers" on "Alerts_Jobs_Info_Pane" wizard should contains "Alerts_Jobs_Info_Pane"."Overview_General_Headers"
        Then verify "Overview_Trigger_Criteria" element visibility on "Alerts_Jobs_Info_Pane" wizard
        Then verify "Overview_Trigger_Criteria" on "Alerts_Jobs_Info_Pane" wizard should contains "Alerts_Jobs_Info_Pane"."Overview_Trigger_Criteria_Headers"
        Then verify "Notifications_Header" element visibility on "Alerts_Jobs_Info_Pane" wizard
        Then verify "Notifications_Item" element visibility on "Alerts_Jobs_Info_Pane" wizard
        Then verify "Logs_Text_container" element visibility on "Alerts_Jobs_Info_Pane" wizard
        Then verify "Logs_Refresh_Button" element visibility on "Alerts_Jobs_Info_Pane" wizard
        Then click on "Logs_Refresh_Button" element on "Alerts_Jobs_Info_Pane" wizard
        Then verify "Full_View_Logs_Button" element visibility on "Alerts_Jobs_Info_Pane" wizard
        Then click on "Full_View_Logs_Button" element on "Alerts_Jobs_Info_Pane" wizard
        And wait load page
        Then verify if "Job_Logs_YAML" popup dialog appears
        Then verify "Title" element visibility on "Job_Logs_YAML" wizard
        Then verify "Cross_Cancel_Button" element visibility on "Job_Logs_YAML" wizard
        Then verify "Alerts_Logs_Container" element visibility on "Job_Logs_YAML" wizard
        Then click on "Cross_Cancel_Button" element on "Job_Logs_YAML" wizard
        And wait load page
        Then verify "Cross_Close_Button" element visibility on "Alerts_Jobs_Info_Pane" wizard
        Then click on "Cross_Close_Button" element on "Alerts_Jobs_Info_Pane" wizard
        Then verify "Header" element not exists on "Alerts_Jobs_Info_Pane" wizard
        When click on cell with row index 1 in "alertName" column in "Alerts_Table" table on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Header" element visibility on "Alerts_Jobs_Info_Pane" wizard
    
    @MLAM
    @smoke
    # TODO: Add data to the mock to check the following elements (existing job data for details popup)
    Scenario: MLAM006 - Check components in Job detail pop-up on Job alert detail pane
        Given open url
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Total_Jobs_Counter_Number" element visibility in "Monitoring_Alerts_Box" on "Projects" wizard
        When click on "Total_Jobs_Counter_Number" element in "Monitoring_Alerts_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/alerts-monitoring?entity-type=job&bePage=1&fePage=1"
        Then verify breadcrumbs "cross" label should be equal "Alerts monitoring" value
        Then verify breadcrumbs "projectsPage" label should be equal "Projects" value
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Alerts_Monitoring" wizard selected option value "Past 24 hours"
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Alerts_Monitoring" wizard
        And wait load page
        When pick up "Custom range" from "12/01/2024 00:00" to "12/31/2024 00:00" in "Date_Time_Picker" via "Date_Picker_Filter_Dropdown" on "Alerts_Monitoring" wizard
        Then verify from "12/01/2024 00:00" to "12/31/2024 00:00" filter band in "Custom_Range_Filter_Dropdown" filter dropdown on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Alerts_Table" element visibility on "Alerts_Monitoring" wizard
        Then value in "entityType" column with "tooltip" in "Alerts_Table" on "Alerts_Monitoring" wizard should contains "Job"
        When click on cell with row index 1 in "alertName" column in "Alerts_Table" table on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Header" element visibility on "Alerts_Jobs_Info_Pane" wizard
        Then "Header" element on "Alerts_Jobs_Info_Pane" should contains "job-failure-alert1" value
        Then verify "Overview_General_Headers" element visibility on "Alerts_Jobs_Info_Pane" wizard
        Then verify "Overview_General_Headers" on "Alerts_Jobs_Info_Pane" wizard should contains "Alerts_Jobs_Info_Pane"."Overview_General_Headers"
        Then verify "Job_Detail_PopUp_Link" element visibility on "Alerts_Jobs_Info_Pane" wizard
        Then click on "Job_Detail_PopUp_Link" element on "Alerts_Jobs_Info_Pane" wizard
        # Add data to the mock to check the following elements
        Then verify if "Modal_Transition_Popup" popup dialog appears
        Then verify "Title" element visibility on "Modal_Transition_Popup" wizard
        Then "Title" element on "Modal_Transition_Popup" should contains "erann-test" value
        Then verify "Data_Status" element visibility on "Modal_Transition_Popup" wizard
        Then verify "State_Icon" element visibility on "Modal_Transition_Popup" wizard
        Then verify "State_Icon" element on "Modal_Transition_Popup" wizard should display hover tooltip "Jobs_Monitor_Tab_Info_Pane"."Error_State"
        Then verify "Refresh_Button" element visibility on "Modal_Transition_Popup" wizard
        Then verify "Refresh_Button" element on "Modal_Transition_Popup" wizard should display hover tooltip "Common_Tooltips"."Refresh_Button"
        Then click on "Refresh_Button" element on "Modal_Transition_Popup" wizard
        And wait load page
        Then verify "Refresh_Button" element visibility on "Modal_Transition_Popup" wizard
        Then verify "Action_Menu" element visibility on "Modal_Transition_Popup" wizard
        Then verify "Action_Menu" dropdown element on "Modal_Transition_Popup" wizard should contains "Common_Lists"."Action_Menu_List_Run_Transition_Popup"
        Then select "View YAML" option in action menu on "Modal_Transition_Popup" wizard
        And wait load page
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
        Then click on "Cross_Cancel_Button" element on "View_YAML" wizard
        And wait load page
        Then verify "Cross_Close_Button" element visibility on "Modal_Transition_Popup" wizard
        Then click on "Cross_Close_Button" element on "Modal_Transition_Popup" wizard
        And wait load page
        Then click on "Job_Detail_PopUp_Link" element on "Alerts_Jobs_Info_Pane" wizard
        And wait load page
        Then verify if "Modal_Transition_Popup" popup dialog appears
        Then verify "Tab_Selector" element visibility on "Modal_Transition_Popup" wizard
        Then verify "Tab_Selector" on "Modal_Transition_Popup" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Tab_List"
        Then verify "Overview" tab is active in "Tab_Selector" on "Modal_Transition_Popup" wizard
        Then verify "Overview_General_Headers" on "Modal_Transition_Popup" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Overview_Headers"
        And select "Inputs" tab in "Tab_Selector" on "Modal_Transition_Popup" wizard
        And wait load page
        Then verify "Inputs" tab is active in "Tab_Selector" on "Modal_Transition_Popup" wizard
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
        Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."No_Data"
        And select "Artifacts" tab in "Tab_Selector" on "Modal_Transition_Popup" wizard
        And wait load page
        Then verify "Artifacts" tab is active in "Tab_Selector" on "Modal_Transition_Popup" wizard
        And select "Results" tab in "Tab_Selector" on "Modal_Transition_Popup" wizard
        And wait load page
        Then verify "Results" tab is active in "Tab_Selector" on "Modal_Transition_Popup" wizard
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
        Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."No_Data"
        And select "Logs" tab in "Tab_Selector" on "Modal_Transition_Popup" wizard
        And wait load page
        Then verify "Logs" tab is active in "Tab_Selector" on "Modal_Transition_Popup" wizard
        Then verify "Logs_Text_container" element visibility on "Modal_Transition_Popup" wizard
        Then verify "Logs_Refresh_Button" element visibility on "Modal_Transition_Popup" wizard
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
        Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."No_Data"
        And select "Pods" tab in "Tab_Selector" on "Modal_Transition_Popup" wizard
        And wait load page
        Then verify "Pods" tab is active in "Tab_Selector" on "Modal_Transition_Popup" wizard
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
        Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."No_Pods_data"

    @MLAM
    @smoke
    Scenario: MLAM007 - Check components on Endpoints alert detail pane
        Given open url
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Total_Endpoint_Counter_Number" element visibility in "Monitoring_Alerts_Box" on "Projects" wizard
        When click on "Total_Endpoint_Counter_Number" element in "Monitoring_Alerts_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/alerts-monitoring?entity-type=model-endpoint-result&bePage=1&fePage=1"
        Then verify breadcrumbs "cross" label should be equal "Alerts monitoring" value
        Then verify breadcrumbs "projectsPage" label should be equal "Projects" value
        Then verify "Search_By_Name_Filter_Input" element visibility on "Alerts_Monitoring" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Alerts_Monitoring" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Alerts_Monitoring" wizard selected option value "Past 24 hours"
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Alerts_Monitoring" wizard
        And wait load page
        When pick up "Custom range" from "12/01/2024 00:00" to "12/31/2024 00:00" in "Date_Time_Picker" via "Date_Picker_Filter_Dropdown" on "Alerts_Monitoring" wizard
        Then verify from "12/01/2024 00:00" to "12/31/2024 00:00" filter band in "Custom_Range_Filter_Dropdown" filter dropdown on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Alerts_Table" element visibility on "Alerts_Monitoring" wizard
        Then value in "entityType" column with "tooltip" in "Alerts_Table" on "Alerts_Monitoring" wizard should contains "Endpoint"
        When click on cell with row index 1 in "alertName" column in "Alerts_Table" table on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Header" element visibility on "Alerts_Endpoint_Info_Pane" wizard
        Then "Header" element on "Alerts_Endpoint_Info_Pane" should contains "data-drift" value
        Then verify "Cross_Close_Button" element visibility on "Alerts_Endpoint_Info_Pane" wizard
        Then click on "Cross_Close_Button" element on "Alerts_Endpoint_Info_Pane" wizard
        Then verify "Header" element not exists on "Alerts_Endpoint_Info_Pane" wizard
        When click on cell with row index 1 in "alertName" column in "Alerts_Table" table on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Header" element visibility on "Alerts_Endpoint_Info_Pane" wizard
        Then verify "Overview_General_Headers" element visibility on "Alerts_Endpoint_Info_Pane" wizard
        Then verify "Overview_General_Headers" on "Alerts_Endpoint_Info_Pane" wizard should contains "Alerts_Endpoint_Info_Pane"."Overview_General_Headers"
        Then verify "Overview_Trigger_Criteria" element visibility on "Alerts_Endpoint_Info_Pane" wizard
        Then verify "Overview_Trigger_Criteria" on "Alerts_Endpoint_Info_Pane" wizard should contains "Alerts_Jobs_Info_Pane"."Overview_Trigger_Criteria_Headers"
        Then verify "Notifications_Header" element visibility on "Alerts_Endpoint_Info_Pane" wizard
        Then verify "Notifications_Item" element visibility on "Alerts_Endpoint_Info_Pane" wizard
        Then verify "Metrics_Stats_Card_Empty" element visibility on "Alerts_Endpoint_Info_Pane" wizard
        Then "Metrics_Stats_Card_Empty" element on "Alerts_Endpoint_Info_Pane" should contains "Metrics data not found" value
        Then click on "Cross_Close_Button" element on "Alerts_Endpoint_Info_Pane" wizard
        Then verify "Header" element not exists on "Alerts_Endpoint_Info_Pane" wizard
        When click on cell with row index 1 in "alertName" column in "Alerts_Table" table on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Header" element visibility on "Alerts_Endpoint_Info_Pane" wizard
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Alerts_Monitoring" wizard
        And wait load page
        When click on cell with value "alert-name-uqbxb-proj-default" in "alertName" column in "Alerts_Table" table on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Header" element visibility on "Alerts_Endpoint_Info_Pane" wizard
        Then verify "Overview_General_Headers" element visibility on "Alerts_Endpoint_Info_Pane" wizard
        Then verify "Overview_General_Headers" on "Alerts_Endpoint_Info_Pane" wizard should contains "Alerts_Endpoint_Info_Pane"."Overview_General_Headers"
        Then verify "Overview_Trigger_Criteria" element visibility on "Alerts_Endpoint_Info_Pane" wizard
        Then verify "Overview_Trigger_Criteria" on "Alerts_Endpoint_Info_Pane" wizard should contains "Alerts_Jobs_Info_Pane"."Overview_Trigger_Criteria_Headers"
        Then verify "Notifications_Header" element visibility on "Alerts_Endpoint_Info_Pane" wizard
        Then verify "Notifications_Item" element visibility on "Alerts_Endpoint_Info_Pane" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Alerts_Endpoint_Info_Pane" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Alerts_Endpoint_Info_Pane" wizard selected option value "Past 24 hours"
        Then verify "Date_Picker_Filter_Dropdown" dropdown element on "Alerts_Endpoint_Info_Pane" wizard should contains "Dropdown_Options"."Date_Picker_Filter_Options_Endpoint"
        Then click on "Header" element on "Alerts_Endpoint_Info_Pane" wizard
        And wait load page
        Then verify "Metrics_App_Name" element visibility on "Alerts_Endpoint_Info_Pane" wizard
        Then verify "Metrics_Stats_Card" element visibility on "Alerts_Endpoint_Info_Pane" wizard
        Then verify "Metrics_Stats_Card_Metric_Name" element visibility on "Alerts_Endpoint_Info_Pane" wizard
        Then verify "Metrics_Stats_Card_Metric_BodyBar" element visibility on "Alerts_Endpoint_Info_Pane" wizard
        Then verify "Metrics_Stats_Card_Metric_BodyLine" element visibility on "Alerts_Endpoint_Info_Pane" wizard

    @MLAM
    @smoke
    Scenario: MLAM008 - Check components on Application alert detail pane
        Given open url
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Total_Application_Counter_Number" element visibility in "Monitoring_Alerts_Box" on "Projects" wizard
        When click on "Total_Application_Counter_Number" element in "Monitoring_Alerts_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/alerts-monitoring?entity-type=model-monitoring-application&bePage=1&fePage=1"
        Then verify breadcrumbs "cross" label should be equal "Alerts monitoring" value
        Then verify breadcrumbs "projectsPage" label should be equal "Projects" value
        Then verify "Search_By_Name_Filter_Input" element visibility on "Alerts_Monitoring" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Alerts_Monitoring" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Alerts_Monitoring" wizard selected option value "Past 24 hours"
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Alerts_Table" element visibility on "Alerts_Monitoring" wizard
        Then value in "entityType" column with "tooltip" in "Alerts_Table" on "Alerts_Monitoring" wizard should contains "Application"
        When click on cell with row index 1 in "alertName" column in "Alerts_Table" table on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Header" element visibility on "Alerts_Application_Info_Pane" wizard
        Then "Header" element on "Alerts_Application_Info_Pane" should contains "mm-app-failure" value
        Then verify "Cross_Close_Button" element visibility on "Alerts_Application_Info_Pane" wizard
        Then click on "Cross_Close_Button" element on "Alerts_Application_Info_Pane" wizard
        Then verify "Header" element not exists on "Alerts_Application_Info_Pane" wizard
        When click on cell with row index 1 in "alertName" column in "Alerts_Table" table on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Header" element visibility on "Alerts_Application_Info_Pane" wizard
        Then verify "Overview_General_Headers" element visibility on "Alerts_Application_Info_Pane" wizard
        Then verify "Overview_General_Headers" on "Alerts_Application_Info_Pane" wizard should contains "Alerts_Application_Info_Pane"."Overview_General_Headers"
        Then verify "Overview_Trigger_Criteria" element visibility on "Alerts_Application_Info_Pane" wizard
        Then verify "Overview_Trigger_Criteria" on "Alerts_Application_Info_Pane" wizard should contains "Alerts_Jobs_Info_Pane"."Overview_Trigger_Criteria_Headers"
        Then verify "Notifications_Header" element visibility on "Alerts_Application_Info_Pane" wizard
        Then verify "Notifications_Item" element visibility on "Alerts_Application_Info_Pane" wizard
        Then click on "Cross_Close_Button" element on "Alerts_Application_Info_Pane" wizard
        Then verify "Header" element not exists on "Alerts_Application_Info_Pane" wizard
        When click on cell with row index 1 in "alertName" column in "Alerts_Table" table on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Header" element visibility on "Alerts_Application_Info_Pane" wizard
        
    @MLAM
    @smoke
    Scenario: MLAM009 - Check search by name on Alerts monitoring page
        Given open url
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        When click on "Total_Alerts_Number" element in "Monitoring_Alerts_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/alerts-monitoring?bePage=1&fePage=1"
        Then verify breadcrumbs "cross" label should be equal "Alerts monitoring" value
        Then verify breadcrumbs "projectsPage" label should be equal "Projects" value
        Then verify "Search_By_Name_Filter_Input" element visibility on "Alerts_Monitoring" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Alerts_Monitoring" wizard selected option value "Past 24 hours"
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Alerts_Table" element visibility on "Alerts_Monitoring" wizard
        Then type value "job-failure" to "Search_By_Name_Filter_Input" field on "Alerts_Monitoring" wizard
        Then click on "Refresh_Button" element on "Alerts_Monitoring" wizard
        And wait load page
        Then value in "alertName" column with "text" in "Alerts_Table" on "Alerts_Monitoring" wizard should contains "job-failure"
        And wait load page
    
    @MLAM
    @smoke
    Scenario: MLAM010 - Check Pagination info pane on Alerts monitoring page
        Given open url
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        When click on "Total_Alerts_Number" element in "Monitoring_Alerts_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/alerts-monitoring?bePage=1&fePage=1"
        Then verify breadcrumbs "cross" label should be equal "Alerts monitoring" value
        Then verify breadcrumbs "projectsPage" label should be equal "Projects" value
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Alerts_Monitoring" wizard selected option value "Past 24 hours"
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "BE_Pagination_Navigate_Prev" element visibility on "Pagination_Info_Pane" wizard
        Then verify "BE_Pagination_Navigate_Prev" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "BE_Pagination_Navigate_Next" element visibility on "Pagination_Info_Pane" wizard
        Then verify "BE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is enabled
        Then verify "FE_Pagination_Navigate_Next" element visibility on "Pagination_Info_Pane" wizard
        Then verify "FE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is enabled
        Then verify "FE_Pagination_Navigate_Prev" element visibility on "Pagination_Info_Pane" wizard
        Then verify "FE_Pagination_Navigate_Prev" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "Pagination_Page_Number" element visibility on "Pagination_Info_Pane" wizard
        Then "Pagination_Page_Number" element on "Pagination_Info_Pane" should contains "1" value
        Then verify "Pagination_Count" element visibility on "Pagination_Info_Pane" wizard
        Then "Pagination_Count" element on "Pagination_Info_Pane" should contains "Showing 1 - 50" value
        When click on cell with row index 1 in "alertName" column in "Alerts_Table" table on "Alerts_Monitoring" wizard
        And wait load page
        Then verify "Header" element visibility on "Alerts_Endpoint_Info_Pane" wizard
        Then verify "BE_Pagination_Navigate_Prev" element visibility on "Pagination_Info_Pane" wizard
        Then verify "BE_Pagination_Navigate_Prev" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "BE_Pagination_Navigate_Next" element visibility on "Pagination_Info_Pane" wizard
        Then verify "BE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is enabled
        Then verify "FE_Pagination_Navigate_Next" element visibility on "Pagination_Info_Pane" wizard
        Then verify "FE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is enabled
        Then verify "FE_Pagination_Navigate_Prev" element visibility on "Pagination_Info_Pane" wizard
        Then verify "FE_Pagination_Navigate_Prev" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "Pagination_Page_Number" element visibility on "Pagination_Info_Pane" wizard
        Then "Pagination_Page_Number" element on "Pagination_Info_Pane" should contains "1" value
        Then verify "Pagination_Count" element visibility on "Pagination_Info_Pane" wizard
        Then "Pagination_Count" element on "Pagination_Info_Pane" should contains "Showing 1 - 50" value
        Then click on "Cross_Close_Button" element on "Alerts_Endpoint_Info_Pane" wizard
        And wait load page
        Then verify "Header" element not exists on "Alerts_Endpoint_Info_Pane" wizard
        Then verify "BE_Pagination_Navigate_Prev" element visibility on "Pagination_Info_Pane" wizard
        Then verify "BE_Pagination_Navigate_Prev" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "BE_Pagination_Navigate_Next" element visibility on "Pagination_Info_Pane" wizard
        Then verify "BE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is enabled
        Then verify "FE_Pagination_Navigate_Next" element visibility on "Pagination_Info_Pane" wizard
        Then verify "FE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is enabled
        Then verify "FE_Pagination_Navigate_Prev" element visibility on "Pagination_Info_Pane" wizard
        Then verify "FE_Pagination_Navigate_Prev" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "Pagination_Page_Number" element visibility on "Pagination_Info_Pane" wizard
        Then "Pagination_Page_Number" element on "Pagination_Info_Pane" should contains "1" value
        Then verify "Pagination_Count" element visibility on "Pagination_Info_Pane" wizard
        Then "Pagination_Count" element on "Pagination_Info_Pane" should contains "Showing 1 - 50" value
        And wait load page
     