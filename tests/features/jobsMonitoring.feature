Feature: Jobs Monitoring Page

    Testcases that verifies functionality on MLRun Jobs Monitoring Page

    @MLJM
    @smoke
    Scenario: MLJM001 - Check components on Jobs tab of Jobs monitoring page
        Given open url
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        When click on "See_All_Link" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/jobs-monitoring/jobs"
        Then verify breadcrumbs "cross" label should be equal "Jobs monitoring" value
        Then verify breadcrumbs "projectsPage" label should be equal "Projects" value
        Then verify "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Jobs_Tab" wizard should contains "Jobs_Monitoring"."Tab_List"
        Then verify "Jobs" tab is active in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Search_By_Name_Filter_Input" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Past 24 hours"
        Then verify "Date_Picker_Filter_Dropdown" dropdown element on "Jobs_Monitoring_Jobs_Tab" wizard should contains "Dropdown_Options"."Date_Picker_Filter_Options"
        Then verify "Table_FilterBy_Button" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Refresh_Button" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on "Refresh_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        And wait load page
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Auto_Refresh_Checkbox" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then "Auto_Refresh_Checkbox" element should be checked on "Jobs_Monitoring_Jobs_Tab" wizard
        Then uncheck "Auto_Refresh_Checkbox" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then "Auto_Refresh_Checkbox" element should be unchecked on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
        Then verify "Table_Project_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Status_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Status_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Jobs_Status_Filter_Options"
        And wait load page
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then "Status_All_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then verify "Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Type_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Jobs_Type_Filter_Options"
        Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element on "FilterBy_Popup" wizard is disabled
        Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
        Then navigate back
        And wait load page
        Then verify "Counter_Running_Status_Number" element visibility in "Monitoring_Jobs_Box" on "Projects" wizard
        When click on "Counter_Running_Status_Number" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then verify "Jobs" tab is active in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Any time"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "3 items selected"
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        And wait load page
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then "Status_All_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Aborting_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Status_Jobs_Running_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Status_Pending_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        Then verify "Counter_Failed_Status_Number" element visibility in "Monitoring_Jobs_Box" on "Projects" wizard
        When click on "Counter_Failed_Status_Number" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then verify "Jobs" tab is active in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Past 24 hours"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Aborted, Error"
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        And wait load page
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then "Status_All_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Aborting_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Jobs_Running_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Pending_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Aborted_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Status_Jobs_Error_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        Then verify "Counter_Completed_Status_Number" element visibility in "Monitoring_Jobs_Box" on "Projects" wizard
        When click on "Counter_Completed_Status_Number" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then verify "Jobs" tab is active in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Past 24 hours"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Completed"
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        And wait load page
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then "Status_All_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Aborting_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Jobs_Running_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Pending_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Aborted_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Jobs_Error_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Jobs_Completed_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        And select "crossTab" with "Jobs monitoring" value in breadcrumbs menu
        Then verify redirection to "projects/*/jobs-monitoring/jobs"
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        When click on "See_All_Link" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Table_Project_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then type value "test" to "Table_Project_Filter_Input" field on "FilterBy_Popup" wizard
        And wait load page
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then "Error_Message" component on "Jobs_Monitoring_Jobs_Tab" should be equal "No_Data_Message"."Common_Message_Jobs_Monitoring"

    @MLJM
    @smoke
    Scenario: MLJM004 - Check search by name, project name, filter by Date picker on Jobs tab of Jobs monitoring page
        Given open url
        And wait load page
        When click on "See_All_Link" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/jobs-monitoring/jobs"
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitoring_Jobs_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Jobs_Tab" wizard selected option value "Any time"
        Then verify "Search_By_Name_Filter_Input" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then type value "test" to "Search_By_Name_Filter_Input" field on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on "Refresh_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        And wait load page
        Then value in "name" column with "text" in "Jobs_Table" on "Jobs_Monitoring_Jobs_Tab" wizard should contains "test"
        And select "Scheduled" tab in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Scheduled_Tab" wizard
        And select "Jobs" tab in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Table_Project_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then type value "cat-vs-dog-classification" to "Table_Project_Filter_Input" field on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then value in "project_name" column with "text" in "Jobs_Table" on "Jobs_Monitoring_Jobs_Tab" wizard should contains "cat-vs-dog-classification"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on "Clear_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Jobs_Tab" wizard selected option value "Past 24 hours"
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify that 7 row elements are displayed in "Jobs_Table" on "Jobs_Monitoring_Jobs_Tab" wizard
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitoring_Jobs_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Jobs_Tab" wizard selected option value "Any time"
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        When select "Past hour" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitoring_Jobs_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Jobs_Tab" wizard selected option value "Past hour"
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify that 1 row elements are displayed in "Jobs_Table" on "Jobs_Monitoring_Jobs_Tab" wizard
        When select "Past week" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitoring_Jobs_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Jobs_Tab" wizard selected option value "Past week"
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify that 7 row elements are displayed in "Jobs_Table" on "Jobs_Monitoring_Jobs_Tab" wizard
        When select "Past month" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitoring_Jobs_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Jobs_Tab" wizard selected option value "Past month"
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify that 7 row elements are displayed in "Jobs_Table" on "Jobs_Monitoring_Jobs_Tab" wizard
        When select "Past year" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitoring_Jobs_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Jobs_Tab" wizard selected option value "Past year"
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify that 7 row elements are displayed in "Jobs_Table" on "Jobs_Monitoring_Jobs_Tab" wizard
        When pick up "Custom range" from "09/03/2024 00:00" to "09/04/2024 00:00" in "Date_Time_Picker" via "Date_Picker_Filter_Dropdown" on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify from "09/03/2024 00:00" to "09/04/2024 00:00" filter band in "Custom_Range_Filter_Dropdown" filter dropdown on "Jobs_Monitoring_Jobs_Tab" wizard
        And wait load page
    
    @MLJM
    @smoke
    Scenario: MLJM007 - Check filter by Statuses and View Yaml action on Jobs tab of Jobs monitoring page
        Given open url
        And wait load page
        When click on "See_All_Link" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/jobs-monitoring/jobs"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        When select "Aborted" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Aborted"
        When select "Aborting" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Aborted, Aborting"
        When select "Completed" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "3 items selected"
        When select "Error" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "4 items selected"
        When select "Running" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "5 items selected"
        When select "Pending" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then select "View YAML" option in action menu on "Jobs_Monitoring_Jobs_Tab" wizard in "Jobs_Table" table at row with "test" value in "name" column
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
    
    @MLJM
    @smoke
    Scenario: MLJM010 - Check filter by Types on Jobs tab of Jobs monitoring page
        Given open url
        And wait load page
        When click on "See_All_Link" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/jobs-monitoring/jobs"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        When select "Job" option in "Type_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Job"
        When select "Nuclio" option in "Type_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Nuclio"
        When select "Application" option in "Type_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
        Then "No_Data_Message" component on "commonPagesHeader" should be equal "No_Data_Message"."Common_Message_Jobs_Monitoring_Type"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Application"
        When select "Serving" option in "Type_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
        Then "No_Data_Message" component on "commonPagesHeader" should be equal "No_Data_Message"."Common_Message_Jobs_Monitoring_Type"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Serving"
        When select "Spark" option in "Type_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
        Then "No_Data_Message" component on "commonPagesHeader" should be equal "No_Data_Message"."Common_Message_Jobs_Monitoring_Type"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Spark"
        When select "Horovod" option in "Type_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Horovod"
        When select "Dask" option in "Type_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
        Then "No_Data_Message" component on "commonPagesHeader" should be equal "No_Data_Message"."Common_Message_Jobs_Monitoring_Type"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Dask"
        When select "Databricks" option in "Type_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
        Then "No_Data_Message" component on "commonPagesHeader" should be equal "No_Data_Message"."Common_Message_Jobs_Monitoring_Type"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Databricks"
        When select "Local" option in "Type_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
        Then "No_Data_Message" component on "commonPagesHeader" should be equal "No_Data_Message"."Common_Message_Jobs_Monitoring_Type"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Local"
        When select "Handler" option in "Type_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Handler"
    
    @MLJM
    @smoke
    Scenario: MLJM011 - Check filter by Labels on Jobs tab of Jobs monitoring page
        Given open url
        And wait load page
        When click on "See_All_Link" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/jobs-monitoring/jobs"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then type value "host" to "Table_Label_Filter_Input" field on "FilterBy_Popup" wizard
        And wait load page
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then value in "labels" column with "dropdowns" in "Jobs_Table" on "Jobs_Monitoring_Jobs_Tab" wizard should contains "host"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then type value "author=yaronh" to "Table_Label_Filter_Input" field on "FilterBy_Popup" wizard
        And wait load page
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then value in "labels" column with "dropdowns" in "Jobs_Table" on "Jobs_Monitoring_Jobs_Tab" wizard should contains "author=yaronh"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then type value " " to "Table_Label_Filter_Input" field on "FilterBy_Popup" wizard
        Then verify "Table_Label_Filter_Input" on "FilterBy_Popup" wizard should display hover warning "Input_Hint"."Input_Field_Invalid"
        And select "Scheduled" tab in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Scheduled_Tab" wizard
        And wait load page
        And select "Jobs" tab in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Jobs_Tab" wizard
        And wait load page
        Then verify options in action menu on "Jobs_Monitoring_Jobs_Tab" wizard in "Jobs_Table" table with "Job" value in "type" column should contains "Jobs_And_Workflows"."Job_Action_Menu_Options"
        Then select "Batch re-run" option in action menu on "Jobs_Monitoring_Jobs_Tab" wizard in "Jobs_Table" table at row with "sef" value in "name" column
        And wait load page
        Then verify "Title" element visibility on "Modal_Wizard_Form" wizard
        And wait load page
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Re-Run" value
        Then verify "Run_Button" element visibility on "Modal_Wizard_Form" wizard
        Then "Run_Button" element on "Modal_Wizard_Form" should contains "Run" value
        And click on "Run_Button" element on "Modal_Wizard_Form" wizard
        Then wait for 5 seconds
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        Then "Notification_Pop_Up" element on "Notification_Popup" should contains "The batch run was started" value
        And wait load page
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
        And wait load page
        Then select "Delete" option in action menu on "Jobs_Monitoring_Jobs_Tab" wizard in "Jobs_Table" table at row with "qwe" value in "name" column
        And wait load page
        Then verify if "Confirm_Popup" popup dialog appears
        Then "Title" element on "Confirm_Popup" should contains "Delete job?" value
        When click on "Delete_Button" element on "Confirm_Popup" wizard
        Then wait for 5 seconds
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Job is successfully deleted" value
        And wait load page
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
        And wait load page
 
    @MLJM
    @smoke
    Scenario: MLJM002 - Check components on Workflows tab of Jobs monitoring page
        Given open url
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Workflows_Box" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Total_Counter_Number" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        When click on "See_All_Link" element in "Monitoring_Workflows_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/jobs-monitoring/workflows"
        Then verify breadcrumbs "cross" label should be equal "Jobs monitoring" value
        Then verify breadcrumbs "projectsPage" label should be equal "Projects" value
        Then verify "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Workflows_Tab" wizard should contains "Jobs_Monitoring"."Tab_List"
        Then verify "Workflows" tab is active in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Workflows_Table" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Search_By_Name_Filter_Input" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Past 24 hours"
        Then verify "Date_Picker_Filter_Dropdown" dropdown element on "Jobs_Monitoring_Workflows_Tab" wizard should contains "Dropdown_Options"."Date_Picker_Filter_Options"
        Then verify "Table_FilterBy_Button" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Refresh_Button" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then click on "Refresh_Button" element on "Jobs_Monitoring_Workflows_Tab" wizard
        And wait load page
        Then verify "Workflows_Table" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Workflows_Tab" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
        Then verify "Table_Project_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Status_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Status_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Workflows_Status_Filter_Options"
        And wait load page
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then "Status_All_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element on "FilterBy_Popup" wizard is disabled
        Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
        Then navigate back
        And wait load page
        Then verify "Counter_Running_Status_Number" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        When click on "Counter_Running_Status_Number" element in "Monitoring_Workflows_Box" on "Projects" wizard
        And wait load page
        Then verify "Workflows" tab is active in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Any time"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Running"
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then "Status_All_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Workflows_Running_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Status_Workflows_Error_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Failed_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Workflows_Completed_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        Then verify "Counter_Failed_Status_Number" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        When click on "Counter_Failed_Status_Number" element in "Monitoring_Workflows_Box" on "Projects" wizard
        And wait load page
        Then verify "Workflows" tab is active in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Past 24 hours"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Error, Failed"
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then "Status_All_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Workflows_Error_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Status_Failed_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Status_Workflows_Running_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Workflows_Completed_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then verify "Workflows_Table" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        Then verify "Counter_Completed_Status_Number" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        When click on "Counter_Completed_Status_Number" element in "Monitoring_Workflows_Box" on "Projects" wizard
        And wait load page
        Then verify "Workflows" tab is active in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Past 24 hours"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Completed"
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then "Status_All_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Workflows_Error_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Failed_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Workflows_Running_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Workflows_Completed_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then verify "Workflows_Table" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        And select "crossTab" with "Jobs monitoring" value in breadcrumbs menu
        Then verify redirection to "projects/*/jobs-monitoring/jobs"
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        When click on "See_All_Link" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Table_Project_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then type value "test" to "Table_Project_Filter_Input" field on "FilterBy_Popup" wizard
        And wait load page
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then "Error_Message" component on "Jobs_Monitoring_Workflows_Tab" should be equal "No_Data_Message"."Common_Message_Jobs_Monitoring"
        And turn on demo mode
        And wait load page
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Workflows_Tab" wizard
        #moved to demo mode ML-7352
        Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
    
    @MLJM
    @smoke
    Scenario: MLJM005 - Check search by name, project name, filter by Date picker on Workflows tab of Jobs monitoring page
        Given open url
        And wait load page
        When click on "See_All_Link" element in "Monitoring_Workflows_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/jobs-monitoring/workflows"
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitoring_Workflows_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Any time"
        Then verify "Search_By_Name_Filter_Input" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then type value "main" to "Search_By_Name_Filter_Input" field on "Jobs_Monitoring_Workflows_Tab" wizard
        Then click on "Refresh_Button" element on "Jobs_Monitoring_Workflows_Tab" wizard
        And wait load page
        Then verify that 1 row elements are displayed in "Workflows_Table" on "Jobs_Monitoring_Workflows_Tab" wizard
        Then value in "name" column with "text" in "Workflows_Table" on "Jobs_Monitoring_Workflows_Tab" wizard should contains "main"
        Then type value "kfpipeline" to "Search_By_Name_Filter_Input" field on "Jobs_Monitoring_Workflows_Tab" wizard
        Then click on "Refresh_Button" element on "Jobs_Monitoring_Workflows_Tab" wizard
        And wait load page
        Then verify that 1 row elements are displayed in "Workflows_Table" on "Jobs_Monitoring_Workflows_Tab" wizard
        Then value in "name" column with "text" in "Workflows_Table" on "Jobs_Monitoring_Workflows_Tab" wizard should contains "kfpipeline"
        And select "Scheduled" tab in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Scheduled_Tab" wizard
        And select "Workflows" tab in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Workflows_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Table_Project_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then type value "cat-vs-dog-classification" to "Table_Project_Filter_Input" field on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then value in "project_name" column with "text" in "Workflows_Table" on "Jobs_Monitoring_Workflows_Tab" wizard should contains "cat-vs-dog-classification"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Workflows_Tab" wizard
        Then click on "Clear_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Past 24 hours"
        Then verify "Workflows_Table" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify that 3 row elements are displayed in "Workflows_Table" on "Jobs_Monitoring_Workflows_Tab" wizard
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitoring_Workflows_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Any time"
        Then verify "Workflows_Table" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        When select "Past hour" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitoring_Workflows_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Past hour"
        Then verify "Workflows_Table" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify that 1 row elements are displayed in "Workflows_Table" on "Jobs_Monitoring_Workflows_Tab" wizard
        When select "Past week" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitoring_Workflows_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Past week"
        Then verify "Workflows_Table" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify that 3 row elements are displayed in "Workflows_Table" on "Jobs_Monitoring_Workflows_Tab" wizard
        When select "Past month" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitoring_Workflows_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Past month"
        Then verify "Workflows_Table" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify that 3 row elements are displayed in "Workflows_Table" on "Jobs_Monitoring_Workflows_Tab" wizard
        When select "Past year" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitoring_Workflows_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Past year"
        Then verify "Workflows_Table" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify that 3 row elements are displayed in "Workflows_Table" on "Jobs_Monitoring_Workflows_Tab" wizard
        When pick up "Custom range" from "09/03/2024 00:00" to "09/04/2024 00:00" in "Date_Time_Picker" via "Date_Picker_Filter_Dropdown" on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify from "09/03/2024 00:00" to "09/04/2024 00:00" filter band in "Custom_Range_Filter_Dropdown" filter dropdown on "Jobs_Monitoring_Workflows_Tab" wizard
        And wait load page
    
    @MLJM
    @smoke
    Scenario: MLJM008 - Check filter by Statuses and View Yaml action on Workflows tab of Jobs monitoring page
        Given open url
        And wait load page
        When click on "See_All_Link" element in "Monitoring_Workflows_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/jobs-monitoring/workflows"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        When select "Error" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
        Then "No_Data_Message" component on "commonPagesHeader" should be equal "No_Data_Message"."Common_Message_Jobs_Monitoring_Status"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Error"
        When select "Failed" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Workflows_Table" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Error, Failed"
        When select "Running" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Workflows_Table" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "3 items selected"
        When select "Completed" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Workflows_Table" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Workflows_Tab" wizard
        Then select "View YAML" option in action menu on "Jobs_Monitoring_Workflows_Tab" wizard in "Workflows_Table" table at row with "kfpipeline 2021-07-06 11-16-28" value in "name" column
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

    @MLJM
    @smoke
    Scenario: MLJM003 - Check components on Scheduled tab of Jobs monitoring page
        Given open url
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Scheduled_Box" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Total_Job_Counter_Title" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        Then "Total_Job_Counter_Title" element in "Monitoring_Scheduled_Box" on "Projects" should contains "Jobs" value
        Then verify "Total_Job_Counter_Number" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        Then verify "Jobs_See_All_Link" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        When click on "Jobs_See_All_Link" element in "Monitoring_Scheduled_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/jobs-monitoring/scheduled"
        Then verify breadcrumbs "cross" label should be equal "Jobs monitoring" value
        Then verify breadcrumbs "projectsPage" label should be equal "Projects" value
        Then verify "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Scheduled_Tab" wizard should contains "Jobs_Monitoring"."Tab_List"
        Then verify "Scheduled" tab is active in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Scheduled_Table" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Search_By_Name_Filter_Input" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Scheduled_Tab" wizard selected option value "Next 24 hours"
        Then verify "Date_Picker_Filter_Dropdown" dropdown element on "Jobs_Monitoring_Scheduled_Tab" wizard should contains "Dropdown_Options"."Scheduled_Date_Picker_Filter_Options"
        Then verify "Table_FilterBy_Button" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Refresh_Button" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then click on "Refresh_Button" element on "Jobs_Monitoring_Scheduled_Tab" wizard
        And wait load page
        Then verify "Scheduled_Table" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
        Then verify "Table_Project_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Jobs"
        Then verify "Type_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Scheduled_Type_Filter_Options"
        Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element on "FilterBy_Popup" wizard is enabled
        Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
        Then navigate back
        And wait load page
        Then verify "Total_Workflows_Counter_Title" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        Then "Total_Workflows_Counter_Title" element in "Monitoring_Scheduled_Box" on "Projects" should contains "Workflows" value
        Then verify "Total_Workflows_Counter_Number" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        Then verify "Workflows_See_All_Link" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        When click on "Workflows_See_All_Link" element in "Monitoring_Scheduled_Box" on "Projects" wizard
        Then verify redirection to "projects/*/jobs-monitoring/scheduled"
        Then verify breadcrumbs "cross" label should be equal "Jobs monitoring" value
        Then verify breadcrumbs "projectsPage" label should be equal "Projects" value
        Then verify "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Scheduled_Tab" wizard should contains "Jobs_Monitoring"."Tab_List"
        Then verify "Scheduled" tab is active in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Scheduled_Table" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Search_By_Name_Filter_Input" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Scheduled_Tab" wizard selected option value "Next 24 hours"
        Then verify "Date_Picker_Filter_Dropdown" dropdown element on "Jobs_Monitoring_Scheduled_Tab" wizard should contains "Dropdown_Options"."Scheduled_Date_Picker_Filter_Options"
        Then verify "Table_FilterBy_Button" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
        Then verify "Table_Project_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Workflows"
        Then verify "Type_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Scheduled_Type_Filter_Options"
        Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element on "FilterBy_Popup" wizard is enabled
        Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
        And select "crossTab" with "Jobs monitoring" value in breadcrumbs menu
        Then verify redirection to "projects/*/jobs-monitoring/jobs"
        And select "Scheduled" tab in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Scheduled_Tab" wizard
        And wait load page
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        Then verify redirection to "projects"
        Then verify "Total_Scheduled_Title" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        Then "Total_Scheduled_Title" element in "Monitoring_Scheduled_Box" on "Projects" should contains "Total" value
        Then verify "Total_Job_Counter_Number" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        Then verify "Total_See_All_Link" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        When click on "Total_See_All_Link" element in "Monitoring_Scheduled_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/jobs-monitoring/scheduled"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Table_Project_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then type value "test" to "Table_Project_Filter_Input" field on "FilterBy_Popup" wizard
        And wait load page
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        And wait load page
        And wait load page
        Then "Error_Message" component on "Jobs_Monitoring_Scheduled_Tab" should be equal "No_Data_Message"."Common_Message_Jobs_Monitoring_Scheduled"

    @MLJM
    @smoke
    Scenario: MLJM006 - Check search by name, project name, filter by Date picker on Scheduled tab of Jobs monitoring page
        Given open url
        And wait load page
        When click on "Total_See_All_Link" element in "Monitoring_Scheduled_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/jobs-monitoring/scheduled"
        Then verify "Scheduled_Table" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify that 8 row elements are displayed in "Scheduled_Table" on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitoring_Scheduled_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Scheduled_Tab" wizard selected option value "Any time"
        Then verify "Search_By_Name_Filter_Input" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then type value "clean" to "Search_By_Name_Filter_Input" field on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then click on "Refresh_Button" element on "Jobs_Monitoring_Scheduled_Tab" wizard
        And wait load page
        Then verify that 2 row elements are displayed in "Scheduled_Table" on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then value in "name" column with "text" in "Scheduled_Table" on "Jobs_Monitoring_Scheduled_Tab" wizard should contains "clean"
        And select "Workflows" tab in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Workflows_Tab" wizard
        And select "Scheduled" tab in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Table_Project_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then type value "default" to "Table_Project_Filter_Input" field on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then value in "project_name" column with "text" in "Scheduled_Table" on "Jobs_Monitoring_Scheduled_Tab" wizard should contains "default"
        Then verify that 2 row elements are displayed in "Scheduled_Table" on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then click on "Clear_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Scheduled_Tab" wizard selected option value "Next 24 hours"
        Then verify "Scheduled_Table" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify that 8 row elements are displayed in "Scheduled_Table" on "Jobs_Monitoring_Scheduled_Tab" wizard
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitoring_Scheduled_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Scheduled_Tab" wizard selected option value "Any time"
        Then verify "Scheduled_Table" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        When select "Next hour" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitoring_Scheduled_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Scheduled_Tab" wizard selected option value "Next hour"
        Then verify "Scheduled_Table" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify that 1 row elements are displayed in "Scheduled_Table" on "Jobs_Monitoring_Scheduled_Tab" wizard
        When select "Next week" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitoring_Scheduled_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Scheduled_Tab" wizard selected option value "Next week"
        Then verify "Scheduled_Table" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify that 8 row elements are displayed in "Scheduled_Table" on "Jobs_Monitoring_Scheduled_Tab" wizard
        When select "Next month" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitoring_Scheduled_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Scheduled_Tab" wizard selected option value "Next month"
        Then verify "Scheduled_Table" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify that 8 row elements are displayed in "Scheduled_Table" on "Jobs_Monitoring_Scheduled_Tab" wizard
        When select "Next year" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitoring_Scheduled_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Scheduled_Tab" wizard selected option value "Next year"
        Then verify "Scheduled_Table" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify that 8 row elements are displayed in "Scheduled_Table" on "Jobs_Monitoring_Scheduled_Tab" wizard
        When pick up "Custom range" from "09/03/2024 00:00" to "09/04/2024 00:00" in "Date_Time_Picker" via "Date_Picker_Filter_Dropdown" on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify from "09/03/2024 00:00" to "09/04/2024 00:00" filter band in "Custom_Range_Filter_Dropdown" filter dropdown on "Jobs_Monitoring_Scheduled_Tab" wizard
        And wait load page
    
    @MLJM
    @smoke
    Scenario: MLJM009 - Check filter by Statuses and View Yaml action on Scheduled tab of Jobs monitoring page
        Given open url
        And wait load page
        When click on "Total_See_All_Link" element in "Monitoring_Scheduled_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/jobs-monitoring/scheduled"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        When select "Jobs" option in "Type_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Scheduled_Table" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then select "View YAML" option in action menu on "Jobs_Monitoring_Scheduled_Tab" wizard in "Scheduled_Table" table at row with "clean-data" value in "name" column
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
        Then click on "Cross_Cancel_Button" element on "View_YAML" wizard
        And wait load page
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Jobs"
        When select "Workflows" option in "Type_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Scheduled_Table" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Workflows"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then select "View YAML" option in action menu on "Jobs_Monitoring_Scheduled_Tab" wizard in "Scheduled_Table" table at row with "main3" value in "name" column
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
    
    @MLJM
    @smoke
    Scenario: MLJM012 - Check jobs/workflows/scheduled count consistency among counter data and Jobs monitoring Tabs
        Given open url
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then "Total_Counter_Number" element in "Monitoring_Jobs_Box" on "Projects" should contains "20" value
        When click on "See_All_Link" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/jobs-monitoring/jobs"
        Then verify "Jobs" tab is active in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify that 7 row elements are displayed in "Jobs_Table" on "Jobs_Monitoring_Jobs_Tab" wizard
        Then navigate back
        And wait load page
        Then verify "Counter_Running_Status_Number" element visibility in "Monitoring_Jobs_Box" on "Projects" wizard
        Then "Counter_Running_Status_Number" element in "Monitoring_Jobs_Box" on "Projects" should contains "16" value
        When click on "Counter_Running_Status_Number" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify that 15 row elements are displayed in "Jobs_Table" on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        Then verify "Counter_Failed_Status_Number" element visibility in "Monitoring_Jobs_Box" on "Projects" wizard
        Then "Counter_Failed_Status_Number" element in "Monitoring_Jobs_Box" on "Projects" should contains "3" value
        When click on "Counter_Failed_Status_Number" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify that 3 row elements are displayed in "Jobs_Table" on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        Then verify "Counter_Completed_Status_Number" element visibility in "Monitoring_Jobs_Box" on "Projects" wizard
        Then "Counter_Completed_Status_Number" element in "Monitoring_Jobs_Box" on "Projects" should contains "1" value
        When click on "Counter_Completed_Status_Number" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify that 1 row elements are displayed in "Jobs_Table" on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        Then verify "Total_Counter_Number" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        Then "Total_Counter_Number" element in "Monitoring_Workflows_Box" on "Projects" should contains "3" value
        When click on "See_All_Link" element in "Monitoring_Workflows_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/jobs-monitoring/workflows"
        Then verify "Workflows_Table" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify that 3 row elements are displayed in "Workflows_Table" on "Jobs_Monitoring_Workflows_Tab" wizard
        Then navigate back
        And wait load page
        Then verify "Counter_Running_Status_Number" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        Then "Counter_Running_Status_Number" element in "Monitoring_Workflows_Box" on "Projects" should contains "0" value
        When click on "Counter_Running_Status_Number" element in "Monitoring_Workflows_Box" on "Projects" wizard
        And wait load page
        Then verify that 0 row elements are displayed in "Workflows_Table" on "Jobs_Monitoring_Workflows_Tab" wizard
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        Then verify "Counter_Failed_Status_Number" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        Then "Counter_Failed_Status_Number" element in "Monitoring_Workflows_Box" on "Projects" should contains "1" value
        When click on "Counter_Failed_Status_Number" element in "Monitoring_Workflows_Box" on "Projects" wizard
        And wait load page
        Then verify "Workflows_Table" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify that 1 row elements are displayed in "Workflows_Table" on "Jobs_Monitoring_Workflows_Tab" wizard
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        Then verify "Counter_Completed_Status_Number" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        Then "Counter_Completed_Status_Number" element in "Monitoring_Workflows_Box" on "Projects" should contains "2" value
        When click on "Counter_Completed_Status_Number" element in "Monitoring_Workflows_Box" on "Projects" wizard
        And wait load page
        Then verify "Workflows_Table" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify that 2 row elements are displayed in "Workflows_Table" on "Jobs_Monitoring_Workflows_Tab" wizard
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        Then "Total_Job_Counter_Number" element in "Monitoring_Scheduled_Box" on "Projects" should contains "7" value
        Then verify "Jobs_See_All_Link" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        When click on "Jobs_See_All_Link" element in "Monitoring_Scheduled_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/jobs-monitoring/scheduled"
        Then verify "Scheduled_Table" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify that 7 row elements are displayed in "Scheduled_Table" on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then navigate back
        And wait load page
        Then "Total_Workflows_Counter_Number" element in "Monitoring_Scheduled_Box" on "Projects" should contains "1" value
        Then verify "Workflows_See_All_Link" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        When click on "Workflows_See_All_Link" element in "Monitoring_Scheduled_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/jobs-monitoring/scheduled"
        Then verify "Scheduled_Table" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify that 1 row elements are displayed in "Scheduled_Table" on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        Then verify redirection to "projects"
        Then "Total_Scheduled_Number" element in "Monitoring_Scheduled_Box" on "Projects" should contains "8" value
        Then verify "Total_See_All_Link" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        When click on "Total_See_All_Link" element in "Monitoring_Scheduled_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/*/jobs-monitoring/scheduled"
        Then verify "Scheduled_Table" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify that 8 row elements are displayed in "Scheduled_Table" on "Jobs_Monitoring_Scheduled_Tab" wizard

