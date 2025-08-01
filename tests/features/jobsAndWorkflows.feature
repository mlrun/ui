Feature: Jobs and workflows

    Testcases that verifies functionality on Jobs and Workflows Pages

    @MLJW
    @passive
    @smoke
    Scenario: MLJW001 - Check all mandatory components on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify breadcrumbs "project" label should be equal "default" value
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Jobs and workflows" value
        Then click on breadcrumbs "project" label on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard should contains "Jobs_And_Workflows"."Tab_List"
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown element on "Jobs_Monitor_Tab" wizard should contains "Dropdown_Options"."Date_Picker_Filter_Options"
        Then verify "Table_FilterBy_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitor_Tab" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
        Then verify "Status_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Status_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Jobs_Status_Filter_Options"
        And wait load page
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then "Status_All_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then verify "Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Table_FilterBy_Button" element on "Jobs_Monitor_Tab" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button"
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Type_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Jobs_Type_Filter_Options"
        Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element on "FilterBy_Popup" wizard is disabled
        Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitor_Tab" wizard
        Then verify "Batch_Run_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then "Batch_Run_Button" element on "Jobs_Monitor_Tab" should contains "Batch run" value
        Then verify "Resource_Monitoring_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Auto_Refresh_Checkbox" element visibility on "Jobs_Monitor_Tab" wizard
        Then "Auto_Refresh_Checkbox" element should be unchecked on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard should display hover tooltip "Common_Tooltips"."Refresh_Button"
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitor_Tab" wizard selected option value "Any time"
        Then verify "Jobs_Monitor_Table" element visibility on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        Then wait for 3 seconds
        Then verify "Jobs_Monitor_Table" element visibility on "Jobs_Monitor_Tab" wizard

    @MLJW
    @passive
    @smoke
    Scenario: MLJW002 - Check all mandatory components on Workflows Monitor tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify breadcrumbs "project" label should be equal "churn-project-admin" value
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "tab" with "Project monitoring" value in breadcrumbs menu
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Jobs and workflows" value
        Then verify "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard should contains "Jobs_And_Workflows"."Tab_List"
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Monitor Workflows" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Workflows_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Workflows_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown element on "Workflows_Monitor_Tab" wizard should contains "Dropdown_Options"."Date_Picker_Filter_Options"
        Then verify "Table_FilterBy_Button" element visibility on "Workflows_Monitor_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Workflows_Monitor_Tab" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
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
        Then click on "Table_FilterBy_Button" element on "Workflows_Monitor_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Workflows_Monitor_Tab" wizard
        Then verify "Workflows_Monitor_Table" element visibility on "Workflows_Monitor_Tab" wizard
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Workflows_Monitor_Tab" wizard selected option value "Any time"
        Then verify "Workflows_Monitor_Table" element visibility on "Workflows_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Workflows_Monitor_Tab" wizard
        Then wait for 3 seconds
        Then verify "Workflows_Monitor_Table" element visibility on "Workflows_Monitor_Tab" wizard
        Then verify "Monitor_Workflows_Subtitle" element visibility on "Workflows_Monitor_Tab" wizard
        Then "Monitor_Workflows_Subtitle" element on "Workflows_Monitor_Tab" should contains "View running workflows and previously executed workflows" value
        When turn on demo mode with query params "true"
        And wait load page
        Then click on "Table_FilterBy_Button" element on "Workflows_Monitor_Tab" wizard
        #moved to demo mode ML-7352
        Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard

    @MLJW
    @passive
    @smoke
    Scenario: MLJW003 - Check all mandatory components on Schedule Monitor tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Project monitoring" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        Then verify breadcrumbs "project" label should be equal "churn-project-admin" value
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Jobs and workflows" value
        Then verify "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard should contains "Jobs_And_Workflows"."Tab_List"
        And select "Schedule" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Schedule" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Schedule_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Schedule_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown element on "Schedule_Monitor_Tab" wizard should contains "Dropdown_Options"."Scheduled_Date_Picker_Filter_Options"
        Then verify "Table_FilterBy_Button" element visibility on "Schedule_Monitor_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Schedule_Monitor_Tab" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
        Then verify "Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Type_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Scheduled_Type_Filter_Options"
        Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element on "FilterBy_Popup" wizard is disabled
        Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
        Then click on "Table_FilterBy_Button" element on "Schedule_Monitor_Tab" wizard
        Then verify "Batch_Run_Button" element visibility on "Schedule_Monitor_Tab" wizard
        Then "Batch_Run_Button" element on "Schedule_Monitor_Tab" should contains "Batch run" value
        Then verify "Table_Refresh_Button" element visibility on "Schedule_Monitor_Tab" wizard
        Then verify "Schedule_Monitor_Table" element visibility on "Schedule_Monitor_Tab" wizard
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Schedule_Monitor_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Schedule_Monitor_Tab" wizard selected option value "Any time"
        Then verify "Schedule_Monitor_Table" element visibility on "Schedule_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Schedule_Monitor_Tab" wizard
        Then wait for 3 seconds
        Then verify "Schedule_Monitor_Table" element visibility on "Schedule_Monitor_Tab" wizard

    @MLJW
    @passive
    @smoke
    Scenario: MLJW004 - Check date picker dropdown options on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown element on "Jobs_Monitor_Tab" wizard should contains "Dropdown_Options"."Date_Picker_Filter_Options"
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitor_Tab" wizard selected option value "Past week"
        Then verify "Jobs_Monitor_Table" element visibility on "Jobs_Monitor_Tab" wizard
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitor_Tab" wizard selected option value "Any time"
        Then verify "Jobs_Monitor_Table" element visibility on "Jobs_Monitor_Tab" wizard
        When select "Past hour" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitor_Tab" wizard selected option value "Past hour"
        Then verify "Jobs_Monitor_Table" element visibility on "Jobs_Monitor_Tab" wizard
        When select "Past week" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitor_Tab" wizard selected option value "Past week"
        Then verify "Jobs_Monitor_Table" element visibility on "Jobs_Monitor_Tab" wizard
        When select "Past month" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitor_Tab" wizard selected option value "Past month"
        Then verify "Jobs_Monitor_Table" element visibility on "Jobs_Monitor_Tab" wizard
        When select "Past year" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitor_Tab" wizard selected option value "Past year"
        Then verify "Jobs_Monitor_Table" element visibility on "Jobs_Monitor_Tab" wizard
        When pick up "Custom range" from "10/01/2021 00:00" to "11/30/2021 00:00" in "Date_Time_Picker" via "Date_Picker_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        And wait load page
        And wait load page
        Then verify from "10/01/2021 00:00" to "11/30/2021 00:00" filter band in "Custom_Range_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Jobs_Monitor_Table" element visibility on "Jobs_Monitor_Tab" wizard

    @MLJW
    @passive
    @smoke
    Scenario: MLJW005 - Verify date picker element on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        When pick up "Custom range" from "03/31/2014 10:30" to "03/21/2015 19:15" in "Date_Time_Picker" via "Date_Picker_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify from "03/31/2014 10:30" to "03/21/2015 19:15" filter band in "Custom_Range_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        When pick up "Custom range" from "03/31/2044 10:30" to "03/21/2015 19:15" in "Date_Time_Picker" via "Date_Picker_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify error message in "Date_Time_Picker" on "Jobs_Monitor_Tab" wizard with value "Date_Time_Picker"."Error_Message"
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        When pick up "Custom range" from "03/31/2030 10:30" to "03/31/2030 10:31" in "Date_Time_Picker" via "Date_Picker_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify from "03/31/2030 10:30" to "03/31/2030 10:31" filter band in "Custom_Range_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        When pick up "Custom range" from "03/31/2025 10:31" to "03/21/2025 10:30" in "Date_Time_Picker" via "Date_Picker_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        And wait load page
        And wait load page
        Then verify error message in "Date_Time_Picker" on "Jobs_Monitor_Tab" wizard with value "Date_Time_Picker"."Error_Message"

    @MLJW
    @passive
    @smoke
    Scenario: MLJW006 - Verify filtering by job name on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then type value "test" to "Table_Name_Filter_Input" field on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then value in "name" column with "text" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "test"

    @MLJW
    @passive
    @smoke
    Scenario: MLJW007 - Verify filtering by job name on Schedule Monitor tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Schedule" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Schedule" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then type value "test" to "Table_Name_Filter_Input" field on "Schedule_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Schedule_Monitor_Tab" wizard
        And wait load page
        Then value in "name" column with "text" in "Schedule_Monitor_Table" on "Schedule_Monitor_Tab" wizard should contains "test"

    @MLJW
    @passive
    @smoke
    Scenario: MLJW008 - Verify filtering by name on Workflows Monitor tab
        Given open url
        And wait load page
        And click on row root with value "cat-vs-dog-classification" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Monitor Workflows" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then type value "kfpipeline" to "Table_Name_Filter_Input" field on "Workflows_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then value in "name" column with "text" in "Workflows_Monitor_Table" on "Workflows_Monitor_Tab" wizard should contains "kfpipeline"
        Then type value "main" to "Table_Name_Filter_Input" field on "Workflows_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then value in "name" column with "text" in "Workflows_Monitor_Table" on "Workflows_Monitor_Tab" wizard should contains "main"

    @MLJW
    @passive
    @smoke
    Scenario: MLJW009 - Verify filtering by job label with key on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "cat-vs-dog-classification" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitor_Tab" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
        Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then type value "author" to "Table_Label_Filter_Input" field on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then value in "labels" column with "dropdowns" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "author"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitor_Tab" wizard
        Then type value "mlrun/schedule-name=tf2-serving" to "Table_Label_Filter_Input" field on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then value in "labels" column with "dropdowns" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "mlrun/schedule-name=tf2-serving"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitor_Tab" wizard
        Then type value "123456" to "Table_Label_Filter_Input" field on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard

    @MLJW
    @passive
    @inProgress
    @smoke
    Scenario: MLJW010 - Verify filtering by job label with key on Schedule tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Schedule" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Schedule" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Schedule_Monitor_Tab" wizard
        Then type value "v3io_user" to "Table_Label_Filter_Input" field on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then value in "labels" column with "dropdowns" in "Schedule_Monitor_Table" on "Schedule_Monitor_Tab" wizard should contains "v3io_user"
        Then click on "Table_FilterBy_Button" element on "Schedule_Monitor_Tab" wizard
        Then type value "v3io_user=admin" to "Table_Label_Filter_Input" field on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then value in "labels" column with "dropdowns" in "Schedule_Monitor_Table" on "Schedule_Monitor_Tab" wizard should contains "v3io_user=admin"

    @MLJW
    @passive
    @smoke
    Scenario: MLJW011 - Verify filtering by job status on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        When pick up "Custom range" from "09/03/2021 00:00" to "09/04/2021 00:00" in "Date_Time_Picker" via "Date_Picker_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        Then verify from "09/03/2021 00:00" to "09/04/2021 00:00" filter band in "Custom_Range_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitor_Tab" wizard
        Then select "Completed" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then value in "status" column with "tooltip" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "Completed"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitor_Tab" wizard
        Then select "Completed" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then select "Error" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then value in "status" column with "tooltip" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "Error"
        When pick up "Custom range" from "10/01/2021 00:00" to "11/30/2021 00:00" in "Date_Time_Picker" via "Date_Picker_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        Then verify from "10/01/2021 00:00" to "11/30/2021 00:00" filter band in "Custom_Range_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitor_Tab" wizard
        Then select "Error" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then select "Pending" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then value in "status" column with "tooltip" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "Pending"

    @MLJW
    @passive
    @smoke
    Scenario: MLJW062 - Verify filtering Jobs after opening Batch Re-run wizard
        Given open url
        And wait load page
        And click on row root with value "cat-vs-dog-classification" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then type value "seff" to "Table_Name_Filter_Input" field on "Jobs_Monitor_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitor_Tab" wizard
        Then type value "kind" to "Table_Label_Filter_Input" field on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then select "Batch re-run" option in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table at row with "seff" value in "name" column
        And wait load page
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Re-Run" value
        Then click on "Cross_Close_Button" element on "Modal_Wizard_Form" wizard
        Then value in "name" column with "text" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "seff"
        Then value in "labels" column with "dropdowns" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "kind"

    @MLJW
    @passive
    @inProgress
    @smoke
    Scenario: MLJW064 - Verify filtering by starttime on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify "Auto_Refresh_Checkbox" element visibility on "Jobs_Monitor_Tab" wizard
        Then "Auto_Refresh_Checkbox" element should be unchecked on "Jobs_Monitor_Tab" wizard
        Then check "Auto_Refresh_Checkbox" element on "Jobs_Monitor_Tab" wizard
        Then "Auto_Refresh_Checkbox" element should be checked on "Jobs_Monitor_Tab" wizard
        When pick up "Custom range" from "11/07/2021 17:00" to "11/08/2021 17:00" in "Date_Time_Picker" via "Date_Picker_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify from "11/07/2021 17:00" to "11/08/2021 17:00" filter band in "Custom_Range_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then value in "datetime" column in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should be from "11/07/2021 18:00" to "11/08/2021 18:00"

    @MLJW
    @passive
    @smoke
    Scenario: MLJW058 - Check all mandatory components in Item infopane on Overview tab table on Jobs Monitor Page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        When pick up "Custom range" from "01/01/2021 00:00" to "01/01/2023 00:00" in "Date_Time_Picker" via "Date_Picker_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        Then verify from "01/01/2021 00:00" to "01/01/2023 00:00" filter band in "Custom_Range_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Arrow_Back" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Header" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Updated" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Tab_List"
        Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Overview_Headers" on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Overview_Headers"
        Then click on "Arrow_Back" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitor_Tab" wizard selected option value "Any time"

    @MLJW
    @smoke
    Scenario: MLJW059 - Check Action menu options on Job table and Overview Job tab table on Jobs Monitor Page
        Given open url
        And wait load page
        And click on row root with value "cat-vs-dog-classification" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify options in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table with "Job" value in "type" column should contains "Jobs_And_Workflows"."Job_Action_Menu_Options"
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_FilterBy_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Batch_Run_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Auto_Refresh_Checkbox" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Action_Menu" dropdown element on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "Jobs_And_Workflows"."Job_Overview_Action_Menu_Options"
        Then verify "Arrow_Back" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Header" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Updated" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Tab_List"
        Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Overview_Headers" on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Overview_Headers"

    @MLJW
    @smoke
    Scenario: MLJW061 - Check confirmation message pop-up for Delete Job option in Action menu
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then verify action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table with "test-m_ingest" value in "name" column should contains "Jobs_And_Workflows"."Job_List_Action_Menu_Options" without scroll
        Then select "Delete run" option in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table at row with "test-m_ingest" value in "name" column
        And wait load page
        Then verify if "Confirm_Popup" popup dialog appears
        Then "Title" element on "Confirm_Popup" should contains "Delete job?" value
        Then verify "Cross_Cancel_Button" element visibility on "Confirm_Popup" wizard
        Then verify "Confirm_Dialog_Message" element visibility on "Confirm_Popup" wizard
        Then "Confirm_Dialog_Message" component on "Confirm_Popup" should be equal "Jobs_And_Workflows"."Delete_Run_Message"
        Then verify "Cancel_Button" element visibility on "Confirm_Popup" wizard
        Then "Cancel_Button" element on "Confirm_Popup" should contains "Cancel" value
        Then verify "Delete_Button" element visibility on "Confirm_Popup" wizard
        Then "Delete_Button" element on "Confirm_Popup" should contains "Delete" value
        Then verify "Delete_Button" element on "Confirm_Popup" wizard is enabled
        When click on "Cancel_Button" element on "Confirm_Popup" wizard
        Then select "Delete all runs" option in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table at row with "test-m_ingest" value in "name" column
        And wait load page
        Then verify if "Confirm_Popup" popup dialog appears
        Then "Title" element on "Confirm_Popup" should contains "Delete job?" value
        Then verify "Cross_Cancel_Button" element visibility on "Confirm_Popup" wizard
        Then verify "Confirm_Dialog_Message" element visibility on "Confirm_Popup" wizard
        Then "Confirm_Dialog_Message" component on "Confirm_Popup" should be equal "Jobs_And_Workflows"."Delete_All_Runs_Message"
        Then verify "Cancel_Button" element visibility on "Confirm_Popup" wizard
        Then "Cancel_Button" element on "Confirm_Popup" should contains "Cancel" value
        Then verify "Delete_Button" element visibility on "Confirm_Popup" wizard
        Then verify "Delete_Button" element on "Confirm_Popup" wizard is enabled
        Then "Delete_Button" element on "Confirm_Popup" should contains "Delete" value
        When click on "Cancel_Button" element on "Confirm_Popup" wizard
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify options in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table with "Job" value in "type" column should contains "Jobs_And_Workflows"."Job_Action_Menu_Options"
        Then select "Delete run" option in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table at row with "1b1097f5e1bf439f82b61910f03368ae" value in "name" column
        And wait load page
        Then verify if "Confirm_Popup" popup dialog appears
        Then "Title" element on "Confirm_Popup" should contains "Delete job?" value
        Then verify "Cross_Cancel_Button" element visibility on "Confirm_Popup" wizard
        Then verify "Confirm_Dialog_Message" element visibility on "Confirm_Popup" wizard
        Then "Confirm_Dialog_Message" component on "Confirm_Popup" should be equal "Jobs_And_Workflows"."Delete_Run_Message"
        Then verify "Cancel_Button" element visibility on "Confirm_Popup" wizard
        Then "Cancel_Button" element on "Confirm_Popup" should contains "Cancel" value
        Then verify "Delete_Button" element visibility on "Confirm_Popup" wizard
        Then verify "Delete_Button" element on "Confirm_Popup" wizard is enabled
        Then "Delete_Button" element on "Confirm_Popup" should contains "Delete" value
        When click on "Cancel_Button" element on "Confirm_Popup" wizard
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Action_Menu" dropdown element on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "Jobs_And_Workflows"."Job_Overview_Action_Menu_Options"
        Then select "Delete run" option in action menu on "Jobs_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify if "Confirm_Popup" popup dialog appears
        Then "Title" element on "Confirm_Popup" should contains "Delete job?" value
        Then verify "Cross_Cancel_Button" element visibility on "Confirm_Popup" wizard
        Then verify "Confirm_Dialog_Message" element visibility on "Confirm_Popup" wizard
        Then "Confirm_Dialog_Message" component on "Confirm_Popup" should be equal "Jobs_And_Workflows"."Delete_Run_Message"
        Then verify "Cancel_Button" element visibility on "Confirm_Popup" wizard
        Then "Cancel_Button" element on "Confirm_Popup" should contains "Cancel" value
        Then verify "Delete_Button" element visibility on "Confirm_Popup" wizard
        Then verify "Delete_Button" element on "Confirm_Popup" wizard is enabled
        Then "Delete_Button" element on "Confirm_Popup" should contains "Delete" value
        When click on "Cancel_Button" element on "Confirm_Popup" wizard
        
    @MLJW
    @passive
    @smoke
    Scenario: MLJW063 - Check all mandatory components in Item infopane on Logs tab table on Jobs Monitor Page
        Given open url
        And wait load page
        And click on row root with value "cat-vs-dog-classification" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitor_Tab" wizard
        Then select "Completed" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        And select "Logs" tab in "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Logs" tab is active in "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Logs_Text_container" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Logs_Refresh_Button" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard

    @MLJW
    @passive
    @smoke
    Scenario: MLJW065 - Check all mandatory components in Item infopane on Artifacts tab on Jobs Monitor Page
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And wait load page
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitor_Tab" wizard
        Then select "Completed" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        When click on cell with value "trainer-train" in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        And select "Artifacts" tab in "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify "Artifacts_Table" element visibility on "Artifacts_Info_Pane" wizard
        When click on "sorter_icon" in "Artifacts_Table" table on "Artifacts_Info_Pane" wizard with sorters
        And wait load page
        Then click on cell with row index 1 in "name" column in "Artifacts_Table" table on "Artifacts_Info_Pane" wizard
        Then click on "Artifact_Preview_Button" element on "Artifacts_Info_Pane" wizard
        And wait load page
        Then verify "Preview_Row" element visibility on "Artifact_Preview_Popup" wizard
        Then verify "Cross_Cancel_Button" element visibility on "Artifact_Preview_Popup" wizard
        Then click on "Cross_Cancel_Button" element on "Artifact_Preview_Popup" wizard
        And wait load page
        Then verify "Iterations_Dropdown" element visibility on "Artifacts_Info_Pane" wizard
        Then select "1" option in "Iterations_Dropdown" dropdown on "Artifacts_Info_Pane" wizard
        And wait load page
        Then verify "Artifacts_Table" element visibility on "Artifacts_Info_Pane" wizard
        Then click on cell with row index 1 in "name" column in "Artifacts_Table" table on "Artifacts_Info_Pane" wizard
        Then click on "Artifact_Preview_Button" element on "Artifacts_Info_Pane" wizard
        Then verify "Preview_Row" element visibility on "Artifact_Preview_Popup" wizard
        Then click on "Cross_Cancel_Button" element on "Artifact_Preview_Popup" wizard
        Then select "2" option in "Iterations_Dropdown" dropdown on "Artifacts_Info_Pane" wizard
        And wait load page
        Then verify "Artifacts_Table" element visibility on "Artifacts_Info_Pane" wizard
    
    @MLJM
    @smoke
    Scenario: MLJW090 - Check Pagination info pane on on Jobs Monitor Page
        Given open url
        And wait load page
        And click on row root with value "cat-vs-dog-classification" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And wait load page
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "BE_Pagination_Navigate_Prev" element visibility on "Pagination_Info_Pane" wizard
        Then verify "BE_Pagination_Navigate_Prev" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "BE_Pagination_Navigate_Next" element visibility on "Pagination_Info_Pane" wizard
        Then verify "BE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "FE_Pagination_Navigate_Next" element visibility on "Pagination_Info_Pane" wizard
        Then verify "FE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "FE_Pagination_Navigate_Prev" element visibility on "Pagination_Info_Pane" wizard
        Then verify "FE_Pagination_Navigate_Prev" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "Pagination_Page_Number" element visibility on "Pagination_Info_Pane" wizard
        Then "Pagination_Page_Number" element on "Pagination_Info_Pane" should contains "1" value
        Then verify "Pagination_Count" element visibility on "Pagination_Info_Pane" wizard
        Then "Pagination_Count" element on "Pagination_Info_Pane" should contains "Showing 1 - 5" value
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "BE_Pagination_Navigate_Prev" element visibility on "Pagination_Info_Pane" wizard
        Then verify "BE_Pagination_Navigate_Prev" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "BE_Pagination_Navigate_Next" element visibility on "Pagination_Info_Pane" wizard
        Then verify "BE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "FE_Pagination_Navigate_Next" element visibility on "Pagination_Info_Pane" wizard
        Then verify "FE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "FE_Pagination_Navigate_Prev" element visibility on "Pagination_Info_Pane" wizard
        Then verify "FE_Pagination_Navigate_Prev" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "Pagination_Page_Number" element visibility on "Pagination_Info_Pane" wizard
        Then "Pagination_Page_Number" element on "Pagination_Info_Pane" should contains "1" value
        Then verify "Pagination_Count" element visibility on "Pagination_Info_Pane" wizard
        Then "Pagination_Count" element on "Pagination_Info_Pane" should contains "Showing 1 - 1" value
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "BE_Pagination_Navigate_Prev" element visibility on "Pagination_Info_Pane" wizard
        Then verify "BE_Pagination_Navigate_Prev" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "BE_Pagination_Navigate_Next" element visibility on "Pagination_Info_Pane" wizard
        Then verify "BE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "FE_Pagination_Navigate_Next" element visibility on "Pagination_Info_Pane" wizard
        Then verify "FE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "FE_Pagination_Navigate_Prev" element visibility on "Pagination_Info_Pane" wizard
        Then verify "FE_Pagination_Navigate_Prev" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "Pagination_Page_Number" element visibility on "Pagination_Info_Pane" wizard
        Then "Pagination_Page_Number" element on "Pagination_Info_Pane" should contains "1" value
        Then verify "Pagination_Count" element visibility on "Pagination_Info_Pane" wizard
        Then "Pagination_Count" element on "Pagination_Info_Pane" should contains "Showing 1 - 1" value
        Then click on "Arrow_Back" element on "Jobs_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify "BE_Pagination_Navigate_Prev" element visibility on "Pagination_Info_Pane" wizard
        Then verify "BE_Pagination_Navigate_Prev" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "BE_Pagination_Navigate_Next" element visibility on "Pagination_Info_Pane" wizard
        Then verify "BE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "FE_Pagination_Navigate_Next" element visibility on "Pagination_Info_Pane" wizard
        Then verify "FE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "FE_Pagination_Navigate_Prev" element visibility on "Pagination_Info_Pane" wizard
        Then verify "FE_Pagination_Navigate_Prev" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "Pagination_Page_Number" element visibility on "Pagination_Info_Pane" wizard
        Then "Pagination_Page_Number" element on "Pagination_Info_Pane" should contains "1" value
        Then verify "Pagination_Count" element visibility on "Pagination_Info_Pane" wizard
        Then "Pagination_Count" element on "Pagination_Info_Pane" should contains "Showing 1 - 5" value

    @MLJW
    @passive
    @smoke
    Scenario: MLJW066 - Check all mandatory components in Item infopane on Overview tab table on Schedule Page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Schedule" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Schedule" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 1 in "name" column in "Schedule_Monitor_Table" table on "Schedule_Monitor_Tab" wizard
        And wait load page
        Then verify if "Modal_Transition_Popup" popup dialog appears
        Then verify "Title" element visibility on "Modal_Transition_Popup" wizard
        Then "Title" element on "Modal_Transition_Popup" should contains "aggregate" value
        Then verify "Data_Status" element visibility on "Modal_Transition_Popup" wizard
        Then "Data_Status" element on "Modal_Transition_Popup" should contains "Nov 25, 2021, 05:20:00 PM" value
        Then verify "State_Icon" element visibility on "Modal_Transition_Popup" wizard
        Then verify "State_Icon" element on "Modal_Transition_Popup" wizard should display hover tooltip "ML_Function_Info_Pane"."Initialized_State"
        Then verify "Refresh_Button" element visibility on "Modal_Transition_Popup" wizard
        Then verify "Refresh_Button" element on "Modal_Transition_Popup" wizard should display hover tooltip "Common_Tooltips"."Refresh_Button"
        Then click on "Refresh_Button" element on "Modal_Transition_Popup" wizard
        And wait load page
        Then verify "Refresh_Button" element visibility on "Modal_Transition_Popup" wizard
        Then verify "Action_Menu" element visibility on "Modal_Transition_Popup" wizard
        Then verify "Action_Menu" dropdown element on "Modal_Transition_Popup" wizard should contains "Common_Lists"."Action_Menu_List_Function_Transition_Popup"
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
        When click on cell with row index 1 in "name" column in "Schedule_Monitor_Table" table on "Schedule_Monitor_Tab" wizard
        And wait load page
        Then verify if "Modal_Transition_Popup" popup dialog appears
        Then verify "Tab_Selector" element visibility on "Modal_Transition_Popup" wizard
        Then verify "Tab_Selector" on "Modal_Transition_Popup" wizard should contains "ML_Function_Info_Pane"."Tab_List"
        Then verify "Overview" tab is active in "Tab_Selector" on "Modal_Transition_Popup" wizard
        Then verify "Overview_General_Headers" on "Modal_Transition_Popup" wizard should contains "ML_Function_Info_Pane"."Overview_Headers"
        Then select "Code" tab in "Tab_Selector" on "Modal_Transition_Popup" wizard
        And wait load page
        Then verify "Code" tab is active in "Tab_Selector" on "Modal_Transition_Popup" wizard
        Then verify "Code_Content" element visibility on "Modal_Transition_Popup" wizard
        Then select "Build Log" tab in "Tab_Selector" on "Modal_Transition_Popup" wizard
        And wait load page
        Then verify "Build Log" tab is active in "Tab_Selector" on "Modal_Transition_Popup" wizard
        Then verify "Title_Application_Log_Info" element visibility on "Modal_Transition_Popup" wizard
        Then "Title_Application_Log_Info" element on "Modal_Transition_Popup" should contains "Application" value
        Then verify "Content_Application_Log_Info" element visibility on "Modal_Transition_Popup" wizard
        Then verify "Title_Function_Log_Info" element visibility on "Modal_Transition_Popup" wizard
        Then "Title_Function_Log_Info" element on "Modal_Transition_Popup" should contains "Function" value
        Then verify "Content_Function_Log_Info" element visibility on "Modal_Transition_Popup" wizard

    @MLJW
    @passive
    @smoke
    Scenario: MLJW067 - Verify all mandatory components on Delete existing scheduled job
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Schedule" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Schedule" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then select "Delete" option in action menu on "Schedule_Monitor_Tab" wizard in "Schedule_Monitor_Table" table at row with "clean-data" value in "name" column
        Then verify if "Common_Popup" popup dialog appears
        Then "Description" component on "Common_Popup" should be equal "Descriptions"."Delete_Scheduled_Job"
        Then verify "Cancel_Button" element visibility on "Common_Popup" wizard
        Then "Cancel_Button" element on "Common_Popup" should contains "Cancel" value
        Then verify "Delete_Button" element visibility on "Common_Popup" wizard
        Then "Delete_Button" element on "Common_Popup" should contains "Delete" value
        Then click on "Cancel_Button" element on "Common_Popup" wizard
        And wait load page
        Then select "project" with "cat-vs-dog-classification" value in breadcrumbs menu
        And wait load page
        Then verify breadcrumbs "project" label should be equal "cat-vs-dog-classification" value
        Then verify "Schedule" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then select "Delete" option in action menu on "Schedule_Monitor_Tab" wizard in "Schedule_Monitor_Table" table at row with "tf2-serving" value in "name" column
        Then verify if "Common_Popup" popup dialog appears
        Then click on "Delete_Button" element on "Common_Popup" wizard
        And wait load page
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        And wait load page
        And wait load page
        Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Job is successfully deleted" value
        And wait load page
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
        Then check "tf2-serving" value not in "name" column in "Schedule_Monitor_Table" table on "Schedule_Monitor_Tab" wizard
        When click on cell with row index 1 in "name" column in "Schedule_Monitor_Table" table on "Schedule_Monitor_Tab" wizard
        And wait load page

    @MLJW
    @smoke
    Scenario: MLJW068 - Delete Scheduled Job
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Schedule" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Schedule" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then select "Delete" option in action menu on "Schedule_Monitor_Tab" wizard in "Schedule_Monitor_Table" table at row with "erann-test" value in "name" column
        Then verify if "Common_Popup" popup dialog appears
        Then click on "Delete_Button" element on "Common_Popup" wizard
        And wait load page
        Then check "erann-test" value not in "name" column in "Schedule_Monitor_Table" table on "Schedule_Monitor_Tab" wizard

    @MLJW
    @passive
    @smoke
    Scenario: MLJW060 - Verify View YAML action on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then select "View YAML" option in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table at row with "test-m_ingest" value in "name" column
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
        When click on "Cross_Cancel_Button" element on "View_YAML" wizard
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then select "View YAML" option in action menu on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

    @MLJW
    @passive
    @smoke
    Scenario: MLJW069 - Verify View YAML action on Workflows Monitor tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Monitor Workflows" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then select "View YAML" option in action menu on "Workflows_Monitor_Tab" wizard in "Workflows_Monitor_Table" table at row with "kfpipeline 2021-07-06 11-16-28" value in "name" column
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

    @MLJW
    @passive
    @smoke
    Scenario: MLJW070 - Verify View YAML action on Schedule Monitor tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Schedule" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then select "View YAML" option in action menu on "Schedule_Monitor_Tab" wizard in "Schedule_Monitor_Table" table at row with "clean-data" value in "name" column
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
        When click on "Cross_Cancel_Button" element on "View_YAML" wizard
        When click on cell with row index 1 in "name" column in "Schedule_Monitor_Table" table on "Schedule_Monitor_Tab" wizard
        And wait load page
        Then verify if "Modal_Transition_Popup" popup dialog appears
        Then verify "Title" element visibility on "Modal_Transition_Popup" wizard
        Then "Title" element on "Modal_Transition_Popup" should contains "clean-data" value
        Then verify "Action_Menu" dropdown element on "Modal_Transition_Popup" wizard should contains "Common_Lists"."Action_Menu_List_Function_Transition_Popup"
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
        When click on cell with row index 1 in "name" column in "Schedule_Monitor_Table" table on "Schedule_Monitor_Tab" wizard
        And wait load page
        Then verify if "Modal_Transition_Popup" popup dialog appears

    @MLJW
    @passive
    @smoke
    Scenario: MLJW071 - Check all mandatory components on Workflow List View
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Monitor Workflows" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "Workflows_Monitor_Table" element visibility on "Workflows_Monitor_Tab" wizard
        When click on cell with row index 1 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then verify "Terminate_Button" element visibility on "Workflows_Monitor_Tab" wizard
        Then "Terminate_Button" element on "Workflows_Monitor_Tab" should contains "Terminate" value
        Then verify "Terminate_Button" element on "Workflows_Monitor_Tab" wizard is disabled
        Then verify "Toggle_View_Button" element visibility on "Workflows_Monitor_Tab" wizard
        Then click on "Toggle_View_Button" element on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then verify "Workflow_List_View_Table" element visibility on "Workflows_Monitor_Tab" wizard
        Then verify "Terminate_Button" element visibility on "Workflows_Monitor_Tab" wizard
        Then "Terminate_Button" element on "Workflows_Monitor_Tab" should contains "Terminate" value
        Then verify "Terminate_Button" element on "Workflows_Monitor_Tab" wizard is disabled
        When click on cell with row index 1 in "name" column in "Workflow_List_View_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then verify "Header" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Updated" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Tab_List"
        Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Terminate_Button" element visibility on "Workflows_Monitor_Tab" wizard
        Then "Terminate_Button" element on "Workflows_Monitor_Tab" should contains "Terminate" value
        Then verify "Terminate_Button" element on "Workflows_Monitor_Tab" wizard is disabled
        Then select "project" with "stocks-admin" value in breadcrumbs menu
        And wait load page
        Then verify breadcrumbs "project" label should be equal "stocks-admin" value
        When click on cell with row index 1 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then verify "Terminate_Button" element visibility on "Workflows_Monitor_Tab" wizard
        Then "Terminate_Button" element on "Workflows_Monitor_Tab" should contains "Terminate" value
        Then verify "Terminate_Button" element on "Workflows_Monitor_Tab" wizard is enabled
        Then click on "Terminate_Button" element on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then verify if "Confirm_Popup" popup dialog appears
        Then "Title" element on "Confirm_Popup" should contains "Terminate workflow" value
        Then verify "Cross_Cancel_Button" element visibility on "Confirm_Popup" wizard
        Then verify "Confirm_Dialog_Message" element visibility on "Confirm_Popup" wizard
        Then "Confirm_Dialog_Message" component on "Confirm_Popup" should be equal "Jobs_And_Workflows"."Terminate_Workflow_Message"
        Then verify "Cancel_Button" element visibility on "Confirm_Popup" wizard
        Then "Cancel_Button" element on "Confirm_Popup" should contains "Cancel" value
        Then verify "Delete_Button" element visibility on "Confirm_Popup" wizard
        Then "Delete_Button" element on "Confirm_Popup" should contains "Terminate" value
        When click on "Cancel_Button" element on "Confirm_Popup" wizard
        Then click on "Terminate_Button" element on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then verify if "Confirm_Popup" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "Confirm_Popup" wizard
        When click on "Cross_Cancel_Button" element on "Confirm_Popup" wizard
        Then click on "Terminate_Button" element on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then verify if "Confirm_Popup" popup dialog appears
        Then verify "Delete_Button" element visibility on "Confirm_Popup" wizard
        When click on "Delete_Button" element on "Confirm_Popup" wizard
        And wait load page
        Then verify if "Notification_Popup" popup dialog appears
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        Then "Notification_Pop_Up" component on "Notification_Popup" should contains "Jobs_And_Workflows"."Workflows_Unsuccessful_Terminate_Message"
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
        Then verify "Terminate_Button" element on "Workflows_Monitor_Tab" wizard is enabled
        Then verify "Workflow_List_View_Table" element visibility on "Workflows_Monitor_Tab" wizard
        Then verify "Terminate_Button" element visibility on "Workflows_Monitor_Tab" wizard
        Then "Terminate_Button" element on "Workflows_Monitor_Tab" should contains "Terminate" value
        Then verify "Terminate_Button" element on "Workflows_Monitor_Tab" wizard is enabled
        When click on cell with row index 1 in "name" column in "Workflow_List_View_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then verify "Header" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Updated" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "ML_Function_Info_Pane"."Tab_List"
        Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then click on "Terminate_Button" element on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then verify if "Confirm_Popup" popup dialog appears
        Then "Title" element on "Confirm_Popup" should contains "Terminate workflow" value
        Then verify "Cross_Cancel_Button" element visibility on "Confirm_Popup" wizard
        Then verify "Confirm_Dialog_Message" element visibility on "Confirm_Popup" wizard
        Then "Confirm_Dialog_Message" component on "Confirm_Popup" should be equal "Jobs_And_Workflows"."Terminate_Workflow_Message"
        Then verify "Cancel_Button" element visibility on "Confirm_Popup" wizard
        Then "Cancel_Button" element on "Confirm_Popup" should contains "Cancel" value
        Then verify "Delete_Button" element visibility on "Confirm_Popup" wizard
        Then "Delete_Button" element on "Confirm_Popup" should contains "Terminate" value
        When click on "Cancel_Button" element on "Confirm_Popup" wizard
        Then click on "Terminate_Button" element on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then verify if "Confirm_Popup" popup dialog appears
        Then verify "Delete_Button" element visibility on "Confirm_Popup" wizard
        When click on "Delete_Button" element on "Confirm_Popup" wizard
        And wait load page
        Then verify if "Notification_Popup" popup dialog appears
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        Then "Notification_Pop_Up" component on "Notification_Popup" should contains "Jobs_And_Workflows"."Workflows_Unsuccessful_Terminate_Message"
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard

    @MLJW 
    @passive
    @smoke
    Scenario: MLJW072 - Check all mandatory components on Overview tab Item infopane on Workflow List View Tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then click on "Toggle_View_Button" element on "Workflows_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 2 in "name" column in "Workflow_List_View_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then verify "Arrow_Back" element visibility on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Header" element visibility on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Updated" element visibility on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" element visibility on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Tab_List"
        Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Overview_Headers" on "Workflows_Monitor_Tab_Info_Pane" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Overview_Headers"

    @MLJW
    @passive
    @smoke
    Scenario: MLJW073 - Check all mandatory components on Logs tab Item infopane on Workflow List View Tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then click on "Toggle_View_Button" element on "Workflows_Monitor_Tab" wizard
        When click on cell with row index 2 in "name" column in "Workflow_List_View_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        And select "Logs" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Logs" tab is active in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Logs_Text_container" element visibility on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Logs_Refresh_Button" element visibility on "Workflows_Monitor_Tab_Info_Pane" wizard

    @MLJW
    @passive
    @smoke
    Scenario: MLJW074 - Check all mandatory components on Inputs tab Item infopane on Workflow List View Tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Monitor Workflows" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 1 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then click on "Toggle_View_Button" element on "Workflows_Monitor_Tab" wizard
        When click on cell with row index 2 in "name" column in "Workflow_List_View_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        And select "Inputs" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Inputs_Table" element visibility on "Inputs_Info_Pane" wizard

    @MLJW
    @passive
    @smoke
    Scenario: MLJW075 - Check all mandatory components on Artifacts tab Item infopane on Workflow List View Tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Monitor Workflows" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 1 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then click on "Toggle_View_Button" element on "Workflows_Monitor_Tab" wizard
        When click on cell with row index 2 in "name" column in "Workflow_List_View_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        And select "Artifacts" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Artifacts_Table" element visibility on "Artifacts_Info_Pane" wizard

    @MLJW
    @passive
    @smoke
    Scenario: MLJW076 - Check all mandatory components on Results tab Item infopane on Workflow List View Tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Monitor Workflows" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 1 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then click on "Toggle_View_Button" element on "Workflows_Monitor_Tab" wizard
        When click on cell with row index 4 in "name" column in "Workflow_List_View_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        And select "Results" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Results_Table" element visibility on "Results_Info_Pane" wizard

    @MLJW
    @passive
    @smoke
    Scenario: MLJW080 - Verify visibility of main components on Batch re-run Workflow wizard
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then click on "Toggle_View_Button" element on "Workflows_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Workflow_List_View_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then verify "Action_Menu" dropdown element on "Workflows_Monitor_Tab_Info_Pane" wizard should contains "Jobs_And_Workflows"."Workflows_Info_Pane_Action_Menu_Options"
        Then select "Batch re-run" option in action menu on "Workflows_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify "Title" element visibility on "Modal_Wizard_Form" wizard
        And wait load page
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Re-Run" value
        Then verify "Cross_Close_Button" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Step_1_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_2_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_3_Button" element on "commonPagesHeader" wizard is enabled
        Then "Step_1_Button_text" element on "commonPagesHeader" should contains "Run Details" value
        Then verify "Step_4_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_5_Button" element on "commonPagesHeader" wizard is enabled
        Then "Form_Header_Run_Details" element on "commonPagesHeader" should contains "Run Details" value
        Then "Hyperparameter_Checkbox" element should be unchecked on "Modal_Wizard_Form" wizard
        Then verify "Run_Name_Input" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Handler_Edit_Job" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Handler_Edit_Job" element on "Modal_Wizard_Form" wizard is disabled
        Then verify "Labels_Table" element visibility on "Modal_Wizard_Form" wizard
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then "Form_Header_Data_Inputs" element on "commonPagesHeader" should contains "Data Inputs" value
        Then verify "Data_Inputs_Headers" on "Modal_Wizard_Form" wizard should contains "Modal_Wizard_Form"."Data_Inputs_Table_Header"
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then "Form_Header_Parameters" element on "commonPagesHeader" should contains "Parameters" value
        Then verify "Parameters_Headers" on "Modal_Wizard_Form" wizard should contains "Modal_Wizard_Form"."Parameters_Table_Header"
        Then verify "Parameters_Table" element visibility on "Modal_Wizard_Form" wizard
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then "Form_Header_Resources" element on "commonPagesHeader" should contains "Resources" value
        Then verify "Pods_Priority_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Node_Selection_Subheader" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Resources_Node_Selector_Table" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Request_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Request_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Limit_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Limit_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Request_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."Memory_Unit_Options"
        Then verify "Memory_Limit_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."Memory_Unit_Options"
        Then verify "CPU_Request_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Request_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "GPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Volume_Paths_Table" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then "Form_Header_Advanced" element on "commonPagesHeader" should contains "Advanced" value
        Then "Accordion_Advanced_Subheader" element on "Modal_Wizard_Form" should contains "Environment variables" value
        Then verify "Advanced_Environment_Variables_Table" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Schedule_For_Later_Button" element visibility on "Modal_Wizard_Form" wizard
        Then "Schedule_For_Later_Button" element on "Modal_Wizard_Form" should contains "Schedule for later" value
        Then verify "Save_Button" element visibility on "Modal_Wizard_Form" wizard
        Then "Save_Button" element on "Modal_Wizard_Form" should contains "Run" value

    @MLJW
    @passive
    @smoke
    Scenario: MLJW082 - Check Artifacts preview action on Artifacts tab Item infopane on Workflow List View Tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Monitor Workflows" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 1 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then click on "Toggle_View_Button" element on "Workflows_Monitor_Tab" wizard
        When click on cell with row index 1 in "name" column in "Workflow_List_View_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        And select "Artifacts" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then click on cell with row index 1 in "name" column in "Artifacts_Table" table on "Artifacts_Info_Pane" wizard
        Then click on "Artifact_Preview_Button" element on "Artifacts_Info_Pane" wizard
        And wait load page
        Then verify "Preview_Row" element visibility on "Artifact_Preview_Popup" wizard
        Then verify "Cross_Cancel_Button" element visibility on "Artifact_Preview_Popup" wizard

    @MLJW
    @passive
    @smoke
    Scenario: MLJW057 - Check options in action menu on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "cat-vs-dog-classification" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        When pick up "Custom range" from "09/01/2021 18:00" to "09/03/2021 18:00" in "Date_Time_Picker" via "Date_Picker_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        And wait load page
        And wait load page
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitor_Tab" wizard
        Then select "Error" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify options in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table with "Error. [Errno 2] No such file or directory: \'\'" value in "status" column should contains "Jobs_And_Workflows"."Job_List_Action_Menu_Options"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitor_Tab" wizard
        Then select "Error" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then select "Running" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify options in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table with "Running" value in "status" column should contains "Jobs_And_Workflows"."Running_Job_Action_Menu_Options"
        When pick up "Custom range" from "08/28/2021 18:00" to "09/01/2021 18:00" in "Date_Time_Picker" via "Date_Picker_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitor_Tab" wizard
        Then select "Running" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then select "Completed" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify options in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table with "Completed" value in "status" column should contains "Jobs_And_Workflows"."Job_List_Action_Menu_Options"
        Then select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitor_Tab" wizard
        Then select "Completed" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then select "Pending" option in "Status_Filter_Dropdown" filter dropdown on "FilterBy_Popup" wizard
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then click on "Apply_Button" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify options in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table with "Pending" value in "status" column should contains "Jobs_And_Workflows"."Pending_Job_Action_Menu_Options"

    @MLJW
    @passive
    @smoke
    Scenario: MLJW077 - Check options in action menu on Workflows Monitor tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Monitor Workflows" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify options in action menu on "Workflows_Monitor_Tab" wizard in "Workflows_Monitor_Table" table with "Completed" value in "status" column should contains "Jobs_And_Workflows"."Workflows_Action_Menu_Options"
        Then check that "Terminate" option in action menu on "Workflows_Monitor_Tab" wizard is disabled
        Then select "project" with "stocks-admin" value in breadcrumbs menu
        And wait load page
        Then verify breadcrumbs "project" label should be equal "stocks-admin" value
        Then verify options in action menu on "Workflows_Monitor_Tab" wizard in "Workflows_Monitor_Table" table with "Running" value in "status" column should contains "Jobs_And_Workflows"."Workflows_Running_Action_Menu_Options"
        Then check that "Terminate" option in action menu on "Workflows_Monitor_Tab" wizard is enabled
        Then select "Terminate" option in action menu on "Workflows_Monitor_Tab" wizard in "Workflows_Monitor_Table" table at row with "main 2021-08-30 05-36-35" value in "name" column
        Then verify if "Confirm_Popup" popup dialog appears
        Then "Title" element on "Confirm_Popup" should contains "Terminate workflow" value
        Then verify "Cross_Cancel_Button" element visibility on "Confirm_Popup" wizard
        Then verify "Confirm_Dialog_Message" element visibility on "Confirm_Popup" wizard
        Then "Confirm_Dialog_Message" component on "Confirm_Popup" should be equal "Jobs_And_Workflows"."Terminate_Workflow_Message"
        Then verify "Cancel_Button" element visibility on "Confirm_Popup" wizard
        Then "Cancel_Button" element on "Confirm_Popup" should contains "Cancel" value
        Then verify "Delete_Button" element visibility on "Confirm_Popup" wizard
        Then "Delete_Button" element on "Confirm_Popup" should contains "Terminate" value
        When click on "Cancel_Button" element on "Confirm_Popup" wizard
        Then select "Terminate" option in action menu on "Workflows_Monitor_Tab" wizard in "Workflows_Monitor_Table" table at row with "main 2021-08-30 05-36-35" value in "name" column
        Then verify if "Confirm_Popup" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "Confirm_Popup" wizard
        When click on "Cross_Cancel_Button" element on "Confirm_Popup" wizard
        Then select "Terminate" option in action menu on "Workflows_Monitor_Tab" wizard in "Workflows_Monitor_Table" table at row with "main 2021-08-30 05-36-35" value in "name" column
        Then verify if "Confirm_Popup" popup dialog appears
        Then verify "Delete_Button" element visibility on "Confirm_Popup" wizard
        When click on "Delete_Button" element on "Confirm_Popup" wizard
        And wait load page
        Then verify if "Notification_Popup" popup dialog appears
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        Then "Notification_Pop_Up" component on "Notification_Popup" should contains "Jobs_And_Workflows"."Workflows_Unsuccessful_Terminate_Message"
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard

    @MLJW
    @passive
    @smoke
    Scenario: MLJW078 - Check options in action menu on Schedule tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Schedule" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Schedule" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify action menu on "Schedule_Monitor_Tab" wizard in "Schedule_Monitor_Table" table with "clean-data" value in "name" column should contains "Jobs_And_Workflows"."Schedule_Action_Menu_Options"
        
    @MLJW
    @passive
    @smoke
    Scenario: MLJW079 - Verify visibility of main components on Edit Scheduled Job wizard
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Schedule" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then select "Edit" option in action menu on "Schedule_Monitor_Tab" wizard in "Schedule_Monitor_Table" table at row with "clean-data" value in "name" column
        And wait load page
        Then verify "Title" element visibility on "Modal_Wizard_Form" wizard
        Then "Title" element on "Modal_Wizard_Form" should contains "Edit Job" value
        Then verify "Cross_Close_Button" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Step_1_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_2_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_3_Button" element on "commonPagesHeader" wizard is enabled
        Then "Step_1_Button_text" element on "commonPagesHeader" should contains "Run Details" value
        Then verify "Step_4_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_5_Button" element on "commonPagesHeader" wizard is enabled
        Then "Form_Header_Run_Details" element on "commonPagesHeader" should contains "Run Details" value
        Then "Hyperparameter_Checkbox" element should be unchecked on "Modal_Wizard_Form" wizard
        Then verify "Run_Name_Input" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Handler_Edit_Job" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Handler_Edit_Job" element on "Modal_Wizard_Form" wizard is disabled
        Then verify "Labels_Table" element visibility on "Modal_Wizard_Form" wizard
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then "Form_Header_Data_Inputs" element on "commonPagesHeader" should contains "Data Inputs" value
        Then verify "Data_Inputs_Headers" on "Modal_Wizard_Form" wizard should contains "Modal_Wizard_Form"."Data_Inputs_Table_Header"
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then "Form_Header_Parameters" element on "commonPagesHeader" should contains "Parameters" value
        Then verify "Parameters_Headers" on "Modal_Wizard_Form" wizard should contains "Modal_Wizard_Form"."Parameters_Table_Header"
        Then verify "Parameters_Table" element visibility on "Modal_Wizard_Form" wizard
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then "Form_Header_Resources" element on "commonPagesHeader" should contains "Resources" value
        Then verify "Pods_Priority_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Node_Selection_Subheader" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Resources_Node_Selector_Table" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Request_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Request_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Limit_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Limit_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Request_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."Memory_Unit_Options"
        Then verify "Memory_Limit_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."Memory_Unit_Options"
        Then verify "CPU_Request_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Request_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "GPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Volume_Paths_Table" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then "Form_Header_Advanced" element on "commonPagesHeader" should contains "Advanced" value
        Then "Accordion_Advanced_Subheader" element on "Modal_Wizard_Form" should contains "Environment variables" value
        Then verify "Advanced_Environment_Variables_Table" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Schedule_For_Later_Button" element visibility on "Modal_Wizard_Form" wizard
        Then "Schedule_For_Later_Button" element on "Modal_Wizard_Form" should contains "Schedule for later" value
        Then verify "Save_Button" element visibility on "Modal_Wizard_Form" wizard
        Then "Save_Button" element on "Modal_Wizard_Form" should contains "Save" value

    @MLJW
    #TODO: arrow lines position - y not found
    @passive
    @smoke
    Scenario: MLJW081 - Check visibility of main components on Workflow graph View
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then verify "Workflow_Graph" element visibility on "Workflows_Monitor_Tab" wizard
        # Then verify arrow lines position on "Workflow_Graph" on "Workflows_Monitor_Tab" wizard
        When click on node with index 2 in "Workflow_Graph" graph on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then verify "Header" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Updated" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Tab_List"
        Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Overview_Headers" on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Overview_Headers"
        When click on node with name "deploy-churn-server" in "Workflow_Graph" graph on "Workflows_Monitor_Tab" wizard
        Then verify "Info_Pane_Tab_Selector" on "ML_Function_Info_Pane" wizard should contains "ML_Function_Info_Pane"."Tab_List"

    @MLJW
    @passive
    @links
    @smoke
    Scenario: MLJW030 - Check redirect to project`s Function Infopane from Job Overview
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard       
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        And click on row root with value "test-m_ingest" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "test-m_ingest" value
        And click on "Run_Button" element on "Modal_Wizard_Form" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Project monitoring" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify if "Notification_Popup" popup dialog appears
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        Then "Notification_Pop_Up" element on "Notification_Popup" should contains "The batch run was started" value
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
        When click on cell with value "test-m_ingest" in "name" column in "Jobs_And_Workflows" table on "Project" wizard
        And wait load page
        Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard
        When click on "link" value where option is "Function:" in "Overview_Headers" on "Jobs_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify if "Modal_Transition_Popup" popup dialog appears
        Then verify "Title" element visibility on "Modal_Transition_Popup" wizard
        Then "Title" element on "Modal_Transition_Popup" should contains "test-m_ingest" value
        Then verify "Data_Status" element visibility on "Modal_Transition_Popup" wizard
        Then verify "State_Icon" element visibility on "Modal_Transition_Popup" wizard
        Then verify "State_Icon" element on "Modal_Transition_Popup" wizard should display hover tooltip "ML_Function_Info_Pane"."Initialized_State"
        Then verify "Refresh_Button" element visibility on "Modal_Transition_Popup" wizard
        Then verify "Refresh_Button" element on "Modal_Transition_Popup" wizard should display hover tooltip "Common_Tooltips"."Refresh_Button"
        Then click on "Refresh_Button" element on "Modal_Transition_Popup" wizard
        And wait load page
        Then verify "Refresh_Button" element visibility on "Modal_Transition_Popup" wizard
        Then verify "Action_Menu" element visibility on "Modal_Transition_Popup" wizard
        Then verify "Action_Menu" dropdown element on "Modal_Transition_Popup" wizard should contains "Common_Lists"."Action_Menu_List_Function_Transition_Popup"
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
        When click on "link" value where option is "Function:" in "Overview_Headers" on "Jobs_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify if "Modal_Transition_Popup" popup dialog appears
        Then verify "Tab_Selector" element visibility on "Modal_Transition_Popup" wizard
        Then verify "Tab_Selector" on "Modal_Transition_Popup" wizard should contains "ML_Function_Info_Pane"."Tab_List"
        Then verify "Overview" tab is active in "Tab_Selector" on "Modal_Transition_Popup" wizard
        Then verify "Overview_General_Headers" on "Modal_Transition_Popup" wizard should contains "ML_Function_Info_Pane"."Overview_Headers"
        Then select "Code" tab in "Tab_Selector" on "Modal_Transition_Popup" wizard
        And wait load page
        Then verify "Code" tab is active in "Tab_Selector" on "Modal_Transition_Popup" wizard
        Then verify "Code_Content" element visibility on "Modal_Transition_Popup" wizard
        Then select "Build Log" tab in "Tab_Selector" on "Modal_Transition_Popup" wizard
        And wait load page
        Then verify "Build Log" tab is active in "Tab_Selector" on "Modal_Transition_Popup" wizard
        Then verify "Title_Application_Log_Info" element visibility on "Modal_Transition_Popup" wizard
        Then "Title_Application_Log_Info" element on "Modal_Transition_Popup" should contains "Application" value
        Then verify "Content_Application_Log_Info" element visibility on "Modal_Transition_Popup" wizard
        Then verify "Title_Function_Log_Info" element visibility on "Modal_Transition_Popup" wizard
        Then "Title_Function_Log_Info" element on "Modal_Transition_Popup" should contains "Function" value
        Then verify "Content_Function_Log_Info" element visibility on "Modal_Transition_Popup" wizard
        Then click on "Cross_Close_Button" element on "Modal_Transition_Popup" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        Then select "Delete" option in action menu on "ML_Functions" wizard in "Functions_Table" table at row with "test-m_ingest" value in "name" column
        And wait load page
        Then "Title" element on "Common_Popup" should contains "Delete function?" value
        Then verify "Delete_Button" element visibility on "Common_Popup" wizard
        Then click on "Delete_Button" element on "Common_Popup" wizard
        And wait load page
        Then verify if "Notification_Popup" popup dialog appears
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Function deletion in progress" value
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
        Then wait for 9 seconds
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Function test-m_ingest is successfully deleted" value
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on "Project_Monitoring_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        When click on cell with value "test-m_ingest" in "name" column in "Jobs_And_Workflows" table on "Project" wizard
        And wait load page
        When click on "link" value where option is "Function:" in "Overview_Headers" on "Jobs_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify if "Notification_Popup" popup dialog appears
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        Then "Notification_Pop_Up" element on "Notification_Popup" should contains "This function either does not exist or was deleted" value
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard

    @MLJW
    @smoke
    Scenario: MLJW083 - Check redirection to Last Run Drill-down from Schedules tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And wait load page
        And select "Schedule" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then select "Run now" option in action menu on "Schedule_Monitor_Tab" wizard in "Schedule_Monitor_Table" table at row with "erann-test" value in "name" column
        And wait load page
        Then click on "Table_Refresh_Button" element on "Schedule_Monitor_Tab" wizard
        And wait load page
        Then click on cell with row index 2 in "lastRun" column in "Schedule_Monitor_Table" table on "Schedule_Monitor_Tab" wizard
        And wait load page
        Then verify if "Modal_Transition_Popup" popup dialog appears
        Then verify "Title" element visibility on "Modal_Transition_Popup" wizard
        Then "Title" element on "Modal_Transition_Popup" should contains "erann-test" value
        Then verify "Data_Status" element visibility on "Modal_Transition_Popup" wizard
        Then verify "State_Icon" element visibility on "Modal_Transition_Popup" wizard
        Then verify "State_Icon" element on "Modal_Transition_Popup" wizard should display hover tooltip "Jobs_Monitor_Tab_Info_Pane"."Pending_State"
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
        Then click on cell with row index 2 in "lastRun" column in "Schedule_Monitor_Table" table on "Schedule_Monitor_Tab" wizard
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

    @MLJW
    @smoke
    Scenario: MLJW084 - Check redirection to Function details from Schedules tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And wait load page
        And select "Schedule" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then click on cell with row index 2 in "name" column in "Schedule_Monitor_Table" table on "Schedule_Monitor_Tab" wizard
        And wait load page
        Then verify if "Modal_Transition_Popup" popup dialog appears
        Then verify "Title" element visibility on "Modal_Transition_Popup" wizard
        Then "Title" element on "Modal_Transition_Popup" should contains "erann-test" value
        Then verify "Data_Status" element visibility on "Modal_Transition_Popup" wizard
        Then verify "State_Icon" element visibility on "Modal_Transition_Popup" wizard
        Then verify "State_Icon" element on "Modal_Transition_Popup" wizard should display hover tooltip "ML_Function_Info_Pane"."Initialized_State"
        Then verify "Refresh_Button" element visibility on "Modal_Transition_Popup" wizard
        Then verify "Refresh_Button" element on "Modal_Transition_Popup" wizard should display hover tooltip "Common_Tooltips"."Refresh_Button"
        Then click on "Refresh_Button" element on "Modal_Transition_Popup" wizard
        And wait load page
        Then verify "Refresh_Button" element visibility on "Modal_Transition_Popup" wizard
        Then verify "Action_Menu" element visibility on "Modal_Transition_Popup" wizard
        Then verify "Action_Menu" dropdown element on "Modal_Transition_Popup" wizard should contains "Common_Lists"."Action_Menu_List_Function_Transition_Popup"
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
        Then click on cell with row index 2 in "name" column in "Schedule_Monitor_Table" table on "Schedule_Monitor_Tab" wizard
        And wait load page
        Then verify if "Modal_Transition_Popup" popup dialog appears
        Then verify "Tab_Selector" element visibility on "Modal_Transition_Popup" wizard
        Then verify "Tab_Selector" on "Modal_Transition_Popup" wizard should contains "ML_Function_Info_Pane"."Tab_List"
        Then verify "Overview" tab is active in "Tab_Selector" on "Modal_Transition_Popup" wizard
        Then verify "Overview_General_Headers" on "Modal_Transition_Popup" wizard should contains "ML_Function_Info_Pane"."Overview_Headers"
        Then select "Code" tab in "Tab_Selector" on "Modal_Transition_Popup" wizard
        And wait load page
        Then verify "Code" tab is active in "Tab_Selector" on "Modal_Transition_Popup" wizard
        Then verify "Code_Content" element visibility on "Modal_Transition_Popup" wizard
        Then select "Build Log" tab in "Tab_Selector" on "Modal_Transition_Popup" wizard
        And wait load page
        Then verify "Build Log" tab is active in "Tab_Selector" on "Modal_Transition_Popup" wizard
        Then verify "Title_Application_Log_Info" element visibility on "Modal_Transition_Popup" wizard
        Then "Title_Application_Log_Info" element on "Modal_Transition_Popup" should contains "Application" value
        Then verify "Content_Application_Log_Info" element visibility on "Modal_Transition_Popup" wizard
        Then verify "Title_Function_Log_Info" element visibility on "Modal_Transition_Popup" wizard
        Then "Title_Function_Log_Info" element on "Modal_Transition_Popup" should contains "Function" value
        Then verify "Content_Function_Log_Info" element visibility on "Modal_Transition_Popup" wizard
        Then click on "Cross_Close_Button" element on "Modal_Transition_Popup" wizard
        And wait load page
        Then verify "Schedule_Monitor_Table" element visibility on "Schedule_Monitor_Tab" wizard

    @MLJW
    @smoke
#TODO: check the redirection from projects/default/jobs/monitor-jobs/INVALID/864f4da42773494eb94dce1c8834feb6/overview?dates=anyTime&savedParams=P2JlUGFnZT0xJmZlUGFnZT0xJmRhdGVzPWFueVRpbWU%3D&bePage=1&fePage=1
    Scenario: MLJW085 - Check broken link redirection on Monitor Jobs and Schedules screens
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Jobs and workflows" value in breadcrumbs menu
        And wait load page
        Then verify redirection from "projects/default/jobs/INVALID" to "projects/default/jobs/monitor-jobs?bePage=1&fePage=1"
        Then select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify redirection from "projects/default/jobs/INVALID" to "projects/default/jobs/monitor-jobs?bePage=1&fePage=1"
        Then select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify redirection from "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/INVALID?dates=anyTime&savedParams=P2JlUGFnZT0xJmZlUGFnZT0xJmRhdGVzPWFueVRpbWU%3D&bePage=1&fePage=1" to "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/overview?dates=anyTime&savedParams=P2JlUGFnZT0xJmZlUGFnZT0xJmRhdGVzPWFueVRpbWU%3D&bePage=1&fePage=1"
        And wait load page
        Then select "Inputs" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify redirection from "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/inputsINVALID?dates=anyTime&savedParams=P2JlUGFnZT0xJmZlUGFnZT0xJmRhdGVzPWFueVRpbWU%3D&bePage=1&fePage=1" to "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/overview?dates=anyTime&savedParams=P2JlUGFnZT0xJmZlUGFnZT0xJmRhdGVzPWFueVRpbWU%3D&bePage=1&fePage=1"
        And wait load page
        Then select "Artifacts" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify redirection from "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/artifactsINVALID?dates=anyTime&savedParams=P2JlUGFnZT0xJmZlUGFnZT0xJmRhdGVzPWFueVRpbWU%3D&bePage=1&fePage=1" to "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/overview?dates=anyTime&savedParams=P2JlUGFnZT0xJmZlUGFnZT0xJmRhdGVzPWFueVRpbWU%3D&bePage=1&fePage=1"
        And wait load page
        Then select "Results" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify redirection from "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/resultsINVALID?dates=anyTime&savedParams=P2JlUGFnZT0xJmZlUGFnZT0xJmRhdGVzPWFueVRpbWU%3D&bePage=1&fePage=1" to "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/overview?dates=anyTime&savedParams=P2JlUGFnZT0xJmZlUGFnZT0xJmRhdGVzPWFueVRpbWU%3D&bePage=1&fePage=1"
        And wait load page
        Then select "Logs" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify redirection from "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/logsINVALID?dates=anyTime&savedParams=P2JlUGFnZT0xJmZlUGFnZT0xJmRhdGVzPWFueVRpbWU%3D&bePage=1&fePage=1" to "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/overview?dates=anyTime&savedParams=P2JlUGFnZT0xJmZlUGFnZT0xJmRhdGVzPWFueVRpbWU%3D&bePage=1&fePage=1"
        And wait load page
        Then select "Pods" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify redirection from "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/resultsINVALID?dates=anyTime&savedParams=P2JlUGFnZT0xJmZlUGFnZT0xJmRhdGVzPWFueVRpbWU%3D&bePage=1&fePage=1" to "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/overview?dates=anyTime&savedParams=P2JlUGFnZT0xJmZlUGFnZT0xJmRhdGVzPWFueVRpbWU%3D&bePage=1&fePage=1"
        And wait load page
        Then verify redirection from "projects/default/jobs/monitor-jobs/aggregate-test/INVALID/overview?dates=anyTime&savedParams=P2JlUGFnZT0xJmZlUGFnZT0xJmRhdGVzPWFueVRpbWU%3D&bePage=1&fePage=1" to "projects/default/jobs/monitor-jobs/aggregate-test?dates=anyTime&savedParams=P2JlUGFnZT0xJmZlUGFnZT0xJmRhdGVzPWFueVRpbWU%3D&bePage=1&fePage=1"
        And wait load page
        Then verify if "Notification_Popup" popup dialog appears
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        Then "Notification_Pop_Up" element on "Notification_Popup" should contains "This run either does not exist or was deleted" value
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
        And select "Schedule" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify redirection from "projects/default/jobs/INVALID" to "projects/default/jobs/monitor-jobs?bePage=1&fePage=1"
        Then verify redirection from "projects/default/INVALID/monitor-jobs?bePage=1&fePage=1" to "projects"

    @MLJW
    @smoke
    Scenario: MLJW086 - Check broken link redirection on Monitor Workflows tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Jobs and workflows" value in breadcrumbs menu
        And wait load page
        Then select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify redirection from "projects/churn-project-admin/jobs/INVALID" to "projects/churn-project-admin/jobs/monitor-jobs?bePage=1&fePage=1"
        Then select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then verify redirection from "projects/churn-project-admin/jobs/monitor-workflows/workflow/INVALID" to "projects/churn-project-admin/jobs/monitor-workflows"
        Then verify if "Notification_Popup" popup dialog appears
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Failed to fetch workflow" value
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
        When click on cell with row index 1 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        Then verify redirection from "projects/churn-project-admin/jobs/monitor-workflows/INVALID/eaae138e-439a-47fa-93c6-ba0fe1dc3b79" to "projects/churn-project-admin/jobs/monitor-jobs?bePage=1&fePage=1"
        Then select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        When click on node with name "current-state" in "Workflow_Graph" graph on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then verify redirection from "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/INVALID" to "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/overview"
        And wait load page
        Then select "Inputs" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify redirection from "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/INVALID" to "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/overview"
        And wait load page
        Then select "Artifacts" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify redirection from "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/INVALID" to "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/overview"
        And wait load page
        Then select "Results" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify redirection from "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/INVALID" to "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/overview"
        And wait load page
        Then select "Logs" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify redirection from "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/INVALID" to "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/overview"
        And wait load page
        Then select "Pods" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify redirection from "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/INVALID" to "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/overview"
        And wait load page
        Then verify redirection from "projects/churn-project-admin/jobs/monitor-workflows/workflow/INVALID/07f98fb46a424b2dbee5247b35f37727/overview" to "projects/churn-project-admin/jobs/monitor-workflows"
        And wait load page
        Then verify redirection from "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/INVALID/overview" to "projects/churn-project-admin/jobs/monitor-workflows"
        And wait load page
        Then verify redirection from "projects/INVALID/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/overview" to "projects"
        And wait load page

    @MLJW
    @smoke
    Scenario: MLJW012 - Check all mandatory components on Batch Run wizard - Function selection
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Title" element visibility on "Modal_Wizard_Form" wizard
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Run" value
        Then verify "Cross_Close_Button" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Wizard_Steps_Content" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Form_Header_Function_Selection" element visibility on "commonPagesHeader" wizard
        Then "Form_Header_Function_Selection" element on "commonPagesHeader" should contains "Function selection" value
        Then verify "Function_Selection_Tabs" on "Modal_Wizard_Form" wizard should contains "Modal_Wizard_Form"."Tab_List"
        Then verify "Step_1_Button" element on "commonPagesHeader" wizard is enabled
        Then "Step_1_Button_text" element on "commonPagesHeader" should contains "Function Selection" value
        Then verify "Step_2_Button" element on "commonPagesHeader" wizard is disabled
        Then "Step_2_Button_text" element on "commonPagesHeader" should contains "Run Details" value
        Then verify "Step_3_Button" element on "commonPagesHeader" wizard is disabled
        Then "Step_3_Button_text" element on "commonPagesHeader" should contains "Data Inputs" value
        Then verify "Step_4_Button" element on "commonPagesHeader" wizard is disabled
        Then "Step_4_Button_text" element on "commonPagesHeader" should contains "Parameters" value
        Then verify "Step_5_Button" element on "commonPagesHeader" wizard is disabled
        Then "Step_5_Button_text" element on "commonPagesHeader" should contains "Resources" value
        Then verify "Step_6_Button" element on "commonPagesHeader" wizard is disabled
        Then "Step_6_Button_text" element on "commonPagesHeader" should contains "Advanced" value
        Then verify "Next_Button" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is disabled
        Then "Next_Button" element on "Modal_Wizard_Form" should contains "Next" value
        Then verify "Schedule_For_Later_Button" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Schedule_For_Later_Button" element on "Modal_Wizard_Form" wizard is disabled
        Then "Schedule_For_Later_Button" element on "Modal_Wizard_Form" should contains "Schedule for later" value
        Then verify "Run_Button" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Run_Button" element on "Modal_Wizard_Form" wizard is disabled
        Then "Run_Button" element on "Modal_Wizard_Form" should contains "Run" value
        Then verify "Back_Button" element not exists on "Modal_Wizard_Form" wizard
        Then verify "Search_Input" element visibility on "Modal_Wizard_Form" wizard
        When type searchable fragment "test" into "Search_Input" on "Modal_Wizard_Form" wizard
        Then searchable case "sensitive" fragment "test" should be in every suggested option into "Search_Input" on "Modal_Wizard_Form" wizard
        Then value in "name" column with "text" in "Functions_Table" on "Modal_Wizard_Form" wizard should contains "test" 
        When click on "Form_Header_Function_Selection" element on "commonPagesHeader" wizard
        Then verify "Project_Selector_Dropdown" element visibility on "Modal_Wizard_Form" wizard
        Then select "churn-project-admin" option in "Project_Selector_Dropdown" filter dropdown on "Modal_Wizard_Form" wizard
        Then value in "sub_name" column with "text" in "Functions_Table" on "Modal_Wizard_Form" wizard should contains "churn-project-admin"
        Then select "Current (default)" option in "Project_Selector_Dropdown" filter dropdown on "Modal_Wizard_Form" wizard
        And wait load page
        And click on row root with value "test" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "test" value
        Then select "Hub" tab in "Function_Selection_Tabs" on "Modal_Wizard_Form" wizard
        And wait load page
        Then verify "Filter_Button_Hub_Tab" element visibility on "Modal_Wizard_Form" wizard
        And click on "Filter_Button_Hub_Tab" element on "Modal_Wizard_Form" wizard
        Then verify "Title" element visibility in "Filter_Dropdown" on "Modal_Wizard_Form" wizard
        Then "Title" element in "Filter_Dropdown" on "Modal_Wizard_Form" should contains "Filter by category" value
        And click on "Title" element on "Modal_Wizard_Form" wizard
        Then select "ETL" option in "Category_Selector_Dropdown" filter dropdown on "Modal_Wizard_Form" wizard
        When click on "Apply_Button" element in "Filter_Dropdown" on "Modal_Wizard_Form" wizard
        And wait load page
        And click on "Title" element on "Modal_Wizard_Form" wizard
        Then value in "labels" column with "attribute" in "Functions_Table" on "Modal_Wizard_Form" wizard should contains "ETL"
        And click on "Filter_Button_Hub_Tab" element on "Modal_Wizard_Form" wizard
        When click on "Clear_Button" element in "Filter_Dropdown" on "Modal_Wizard_Form" wizard
        When type searchable fragment "test" into "Search_Input" on "Modal_Wizard_Form" wizard
        Then searchable case "sensitive" fragment "test" should be in every suggested option into "Search_Input" on "Modal_Wizard_Form" wizard
        Then value in "name" column with "text" in "Functions_Table" on "Modal_Wizard_Form" wizard should contains "test"
        And click on "Title" element on "Modal_Wizard_Form" wizard
        Then select "Functions" tab in "Function_Selection_Tabs" on "Modal_Wizard_Form" wizard
        Then select "churn-project-admin" option in "Project_Selector_Dropdown" filter dropdown on "Modal_Wizard_Form" wizard
        And click on row root with value "xgb-test" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        And wait load page
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "xgb-test" value
        Then verify "Back_Button" element not exists on "Modal_Wizard_Form" wizard
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
        Then verify "Step_1_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_2_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_3_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_4_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_5_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_6_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
        Then verify "Schedule_For_Later_Button" element on "Modal_Wizard_Form" wizard is enabled
        Then verify "Run_Button" element on "Modal_Wizard_Form" wizard is enabled
    
    @MLJW
    @smoke
    Scenario: MLJW013 - Verify behaviour of Filter by category on Batch Run wizard - Function selection (Hub tab)
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Function_Selection_Tabs" on "Modal_Wizard_Form" wizard should contains "Modal_Wizard_Form"."Tab_List"
        Then select "Hub" tab in "Function_Selection_Tabs" on "Modal_Wizard_Form" wizard
        And wait load page
        Then verify "Category_Selector_Dropdown" dropdown element on "Modal_Wizard_Form" wizard should contains "Modal_Wizard_Form"."Hub_Filter_Category"
        And click on "Filter_Button_Hub_Tab" element on "Modal_Wizard_Form" wizard
        Then verify "Title" element visibility in "Filter_Dropdown" on "Modal_Wizard_Form" wizard
        Then "Title" element in "Filter_Dropdown" on "Modal_Wizard_Form" should contains "Filter by category" value
        Then verify "Clear_Button" element visibility in "Filter_Dropdown" on "Modal_Wizard_Form" wizard
        Then verify "Apply_Button" element visibility in "Filter_Dropdown" on "Modal_Wizard_Form" wizard
        Then verify "Clear_Button" not input element in "Filter_Dropdown" on "Modal_Wizard_Form" wizard is disabled
        Then verify "Apply_Button" not input element in "Filter_Dropdown" on "Modal_Wizard_Form" wizard is disabled
        And click on "Title" element on "Modal_Wizard_Form" wizard
        Then select "Feature Store" option in "Category_Selector_Dropdown" filter dropdown on "Modal_Wizard_Form" wizard
        When click on "Apply_Button" element in "Filter_Dropdown" on "Modal_Wizard_Form" wizard
        Then select "Data Preparation" option in "Category_Selector_Dropdown" filter dropdown on "Modal_Wizard_Form" wizard
        And wait load page
        Then verify "Clear_Button" not input element in "Filter_Dropdown" on "Modal_Wizard_Form" wizard is enabled
        Then verify "Apply_Button" not input element in "Filter_Dropdown" on "Modal_Wizard_Form" wizard is enabled
        When click on "Clear_Button" element in "Filter_Dropdown" on "Modal_Wizard_Form" wizard
        And click on "Filter_Button_Hub_Tab" element on "Modal_Wizard_Form" wizard
        Then verify "Clear_Button" not input element in "Filter_Dropdown" on "Modal_Wizard_Form" wizard is disabled
        Then verify "Apply_Button" not input element in "Filter_Dropdown" on "Modal_Wizard_Form" wizard is disabled
        And click on "Title" element on "Modal_Wizard_Form" wizard
        Then select "ETL" option in "Category_Selector_Dropdown" filter dropdown on "Modal_Wizard_Form" wizard
        When click on "Apply_Button" element in "Filter_Dropdown" on "Modal_Wizard_Form" wizard
        And wait load page
        And click on "Title" element on "Modal_Wizard_Form" wizard
        Then value in "labels" column with "attribute" in "Functions_Table" on "Modal_Wizard_Form" wizard should contains "ETL"

    @MLJW
    @smoke
    Scenario: MLJW042 - Check all mandatory components on Batch Run wizard - Run Details without Method
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is disabled
        And click on row root with value "test" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "test" value
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then verify "Step_1_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_2_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_3_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_4_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_5_Button" element on "commonPagesHeader" wizard is enabled
        Then "Step_5_Button_text" element on "commonPagesHeader" should contains "Resources" value
        Then verify "Step_6_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Form_Header_Run_Details" element visibility on "commonPagesHeader" wizard
        Then "Form_Header_Run_Details" element on "commonPagesHeader" should contains "Run Details" value
        Then verify "Hyperparameter_Checkbox" element visibility on "Modal_Wizard_Form" wizard
        Then "Hyperparameter_Checkbox" element should be unchecked on "Modal_Wizard_Form" wizard
        Then check "Hyperparameter_Checkbox" element on "Modal_Wizard_Form" wizard
        Then "Hyperparameter_Checkbox" element should be checked on "Modal_Wizard_Form" wizard
        Then "Step_5_Button_text" element on "commonPagesHeader" should contains "Hyperparameter strategy" value
        Then verify "Run_Name_Input" element visibility on "Modal_Wizard_Form" wizard
        Then type value "/" to "Run_Name_Input" field on "Modal_Wizard_Form" wizard
        Then verify "Run_Name_Input" on "Modal_Wizard_Form" wizard should display options "Input_Hint"."Run_Name_Hint"
        Then type value "test" to "Run_Name_Input" field on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "test" value
        Then verify "Version_Dropdown" element visibility on "Modal_Wizard_Form" wizard
        And select "$latest" option in "Version_Dropdown" dropdown on "Modal_Wizard_Form" wizard
        Then verify "Run_Details_Labels_Table" element visibility on "Modal_Wizard_Form" wizard
        When add rows to "Run_Details_Labels_Table" table on "Modal_Wizard_Form" wizard
            | key_input | value_input |
            |    key1   |    value1   |
            |    key2   |    value2   |
            |    key3   |    value3   |
            |    key4   |    value4   |
            |    key5   |    value5   |
        Then verify values in "Run_Details_Labels_Table" table on "Modal_Wizard_Form" wizard with attribute
            | key_verify | value_verify | 
            |    key1    |    value1    |
            |    key2    |    value2    |
            |    key3    |    value3    |
            |    key4    |    value4    |
            |    key5    |    value5    |
        When click on "remove_btn" in "Run_Details_Labels_Table" table on "Modal_Wizard_Form" wizard with attribute
            | key_verify | 
            |    key1    |    
            |    key3    |    
            |    key4    |    
            |    key5    |    
        Then verify values in "Run_Details_Labels_Table" table on "Modal_Wizard_Form" wizard with attribute
            | key_verify | value_verify | 
            |    key2    |    value2    |

    @MLJW
    @smoke
    Scenario: MLJW044 - Check "Max Iterations", "Max errors" inputs field availability according to the strategy type in Hyperparameter strategy
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        And click on row root with value "test" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "test" value
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then check "Hyperparameter_Checkbox" element on "Modal_Wizard_Form" wizard
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then "Form_Header_Hyperparameter_Strategy" element on "commonPagesHeader" should contains "Hyperparameter strategy" value
        Then verify "Strategy_Dropdown" element in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."Hyperparameter_Strategy_Options"
        Then verify "Strategy_Dropdown" dropdown in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard selected option value "List"
        Then verify "Max_Iterations" element in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard is disabled by class name
        Then verify "Max_Errors" element in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard is disabled by class name
        Then select "Grid" option in "Strategy_Dropdown" dropdown on "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Strategy_Dropdown" dropdown in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard selected option value "Grid"
        Then verify "Max_Iterations" element in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard is disabled by class name
        Then verify "Max_Errors" element in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard is disabled by class name
        Then select "Random" option in "Strategy_Dropdown" dropdown on "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Strategy_Dropdown" dropdown in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard selected option value "Random"
        Then verify "Max_Iterations" element in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard is enabled by class name
        Then verify "Max_Errors" element in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard is enabled by class name

    @MLJW
    @smoke
    Scenario: MLJW051 - Check all mandatory components on Batch Run wizard - Run Details with Method
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is disabled
        And click on row root with value "clean-data" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "clean-data" value
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "clean-data" value
        Then verify "Run_Name_Field" on "Modal_Wizard_Form" wizard should contains "clean-data" value
        Then verify "Form_Header_Run_Details" element visibility on "commonPagesHeader" wizard
        Then "Form_Header_Run_Details" element on "commonPagesHeader" should contains "Run Details" value
        Then verify "Hyperparameter_Checkbox" element visibility on "Modal_Wizard_Form" wizard
        Then "Hyperparameter_Checkbox" element should be unchecked on "Modal_Wizard_Form" wizard
        Then verify "Run_Name_Input" element visibility on "Modal_Wizard_Form" wizard
        Then type value "/" to "Run_Name_Input" field on "Modal_Wizard_Form" wizard
        Then verify "Run_Name_Input" on "Modal_Wizard_Form" wizard should display options "Input_Hint"."Run_Name_Hint"
        Then type value "test" to "Run_Name_Input" field on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "test" value
        Then verify "Version_Dropdown" element visibility on "Modal_Wizard_Form" wizard
        And select "$latest" option in "Version_Dropdown" dropdown on "Modal_Wizard_Form" wizard
        Then verify "Method_Dropdown" element visibility on "Modal_Wizard_Form" wizard 
        Then "Method_Dropdown_Label_Select" element on "Modal_Wizard_Form" should contains "Handler" value
        And select "data_clean" option in "Method_Dropdown" dropdown on "Modal_Wizard_Form" wizard 
        Then verify "Run_Details_Labels_Table" element visibility on "Modal_Wizard_Form" wizard
        And click on "Add_Label_Button" element on "Modal_Wizard_Form" wizard
        Then type value "/" to "Run_Details_Labels_Key" field on "Modal_Wizard_Form" wizard
        Then verify labels warning should display options "Input_Hint"."Labels_Warning_Key_Modal_Wizard_Form"
        Then type value "/" to "Run_Details_Labels_Value" field on "Modal_Wizard_Form" wizard without inputgroup
        When click on "Title" element on "Modal_Wizard_Form" wizard
        And click on "Close_Label_Button" element on "Modal_Wizard_Form" wizard   
        When add rows to "Run_Details_Labels_Table" table on "Modal_Wizard_Form" wizard
            | key_input | value_input |
            |    key1   |    value1   |
            |    key2   |    value2   |
            |    key3   |    value3   |
        Then verify values in "Run_Details_Labels_Table" table on "Modal_Wizard_Form" wizard with attribute
            | key_verify | value_verify | 
            |    key1    |    value1    |
            |    key2    |    value2    |
            |    key3    |    value3    |

    @MLJW
    @smoke
    Scenario: MLJW053 - Check changing "Method" after "Hyperparameter" check in Run Details section of Batch Run
        Given open url
	    And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
	    Then verify "Title" element visibility on "Modal_Wizard_Form" wizard
	    Then select "Hub" tab in "Function_Selection_Tabs" on "Modal_Wizard_Form" wizard
        And wait load page
	    And click on row root with value "feature-selection" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
	    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
	    Then verify "Method_Dropdown" element visibility on "Modal_Wizard_Form" wizard 
        And select "plot_stat" option in "Method_Dropdown" dropdown on "Modal_Wizard_Form" wizard
        Then "Method_Dropdown_Option" element on "Modal_Wizard_Form" should contains "plot_stat" value
        And select "show_values_on_bars" option in "Method_Dropdown" dropdown on "Modal_Wizard_Form" wizard
        Then check "Hyperparameter_Checkbox" element on "Modal_Wizard_Form" wizard
        And select "plot_stat" option in "Method_Dropdown" dropdown on "Modal_Wizard_Form" wizard
        Then "Method_Dropdown_Option" element on "Modal_Wizard_Form" should contains "plot_stat" value

    @MLJW
    @smoke
    Scenario: MLJW054 - Check "Image name" field in Run Details section of Batch Run
        Given open url
	    And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
	    Then verify "Title" element visibility on "Modal_Wizard_Form" wizard
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Run" value
	    Then select "Hub" tab in "Function_Selection_Tabs" on "Modal_Wizard_Form" wizard
        And wait load page
	    And click on row root with value "feature-selection" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
	    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then verify "Image_Name_Input_Run_Details" element visibility on "Modal_Wizard_Form" wizard
        Then type value "" to "Image_Name_Input_Run_Details" field on "Modal_Wizard_Form" wizard
        Then verify "Image_Name_Input_Run_Details" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then "Image_Name_Text_Run_Details" component on "Modal_Wizard_Form" should contains "Modal_Wizard_Form"."Image_Name_Text"

    @MLJW
    @smoke
    Scenario: MLJW039 - Check all mandatory components on Batch Run wizard - Data Inputs
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is disabled
        Then select "Hub" tab in "Function_Selection_Tabs" on "Modal_Wizard_Form" wizard
        And wait load page
        And click on row root with value "auto-trainer" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "auto-trainer" value
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
        And click on "Step_3_Button" element on "commonPagesHeader" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "auto-trainer" value
        Then verify "Step_1_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_2_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_3_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_4_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_5_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_6_Button" element on "commonPagesHeader" wizard is enabled
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Run" value
        Then verify "Form_Header_Data_Inputs" element visibility on "commonPagesHeader" wizard
        Then "Form_Header_Data_Inputs" element on "commonPagesHeader" should contains "Data Inputs" value
        Then verify "Data_Inputs_Headers" on "Modal_Wizard_Form" wizard should contains "Modal_Wizard_Form"."Data_Inputs_Table_Header"
        When add data to "Data_Inputs_Table" table on "Modal_Wizard_Form" wizard with a pre-filled table
            | name_input | path_dropdown |      path_input     |
            |    name1   |      V3IO     | container-name/file |
            |    name2   |      V3IO     | container-name/file |
            |    name3   |      V3IO     | container-name/file |
        Then verify data in "Data_Inputs_Table" table on "Modal_Wizard_Form" wizard
            | name_verify |         path_verify         |    
            |   dataset   |                             | 
            | sample_set  |                             | 
            |   test_set  |                             | 
            |    name1    | v3io:///container-name/file | 
            |    name2    | v3io:///container-name/file | 
            |    name3    | v3io:///container-name/file | 
        When click on "delete_btn" with data in "Data_Inputs_Table" table on "Modal_Wizard_Form" wizard with offset "false"
            | name_verify |
            |    name1    |
            |    name3    |
        Then verify data in "Data_Inputs_Table" table on "Modal_Wizard_Form" wizard
            | name_verify |         path_verify         |    
            |   dataset   |                             | 
            | sample_set  |                             | 
            |   test_set  |                             | 
            |    name2    | v3io:///container-name/file |    
        Then edit 4 row in "Data_Inputs_Table" key-value table on "Modal_Wizard_Form" wizard
            | name_input | path_input |
            |   edited   |   edited   |
        Then verify data in "Data_Inputs_Table" table on "Modal_Wizard_Form" wizard
            | name_verify |           path_verify             |    
            |   dataset   |                                   | 
            | sample_set  |                                   | 
            |   test_set  |                                   | 
            | name2edited | v3io:///container-name/fileedited |
    
    @MLJW
    @smoke
    Scenario: MLJW038 - Check all mandatory components on Batch Run wizard - Parameters
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is disabled
        Then select "Hub" tab in "Function_Selection_Tabs" on "Modal_Wizard_Form" wizard
        And wait load page
        And click on row root with value "auto-trainer" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        And wait load page
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "auto-trainer" value
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
        And click on "Step_4_Button" element on "commonPagesHeader" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "auto-trainer" value
        Then verify "Step_1_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_2_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_3_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_4_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_5_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_6_Button" element on "commonPagesHeader" wizard is enabled
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Run" value
        Then verify "Form_Header_Parameters" element visibility on "commonPagesHeader" wizard
        Then "Form_Header_Parameters" element on "commonPagesHeader" should contains "Parameters" value
        Then verify "Parameters_Headers" on "Modal_Wizard_Form" wizard should contains "Modal_Wizard_Form"."Parameters_Table_Header"
        And click on "Add_Custom_Parameter_Button" element on "Modal_Wizard_Form" wizard
        Then verify "Checkbox_Parameters" element visibility on "Modal_Wizard_Form" wizard
        Then "Checkbox_Parameters" element should be checked on "Modal_Wizard_Form" wizard
        Then uncheck "Checkbox_Parameters" element on "Modal_Wizard_Form" wizard
        Then "Checkbox_Parameters" element should be unchecked on "Modal_Wizard_Form" wizard
        And hover "Delete_Button_Parameters" component on "Modal_Wizard_Form" wizard
        And click on "Delete_Button_Parameters" element on "Modal_Wizard_Form" wizard
        When add custom parameters to "Parameters_Table" table on "Modal_Wizard_Form" wizard with a pre-filled table
            | name_input | type_dropdown | value_input |
            |    name1   |      str      |    value1   |
            |    name2   |      int      |      1      |
            |    name3   |      float    |     0.5     | 
        Then verify data in "Parameters_Table" table on "Modal_Wizard_Form" wizard
            | name_verify           |         type_dropdown_verify         | value_verify |
            | model_class           |                str                   |              |
            | label_columns         |  Optional[Union[str, List[str]]]     |              |
            | drop_columns          |              List[str]               |              |
            | model_name            |                str                   |     model    |
            | tag                   |                str                   |              |
            | train_test_split_size |                float                 |              |
            | random_state          |                int                   |              |
            | labels                |                dict                  |              |
            | name1                 |                str                   |    value1    |
            | name2                 |                int                   |      1       |
            | name3                 |               float                  |     0.5      |
        When click on "delete_btn" in "Parameters_Table" table on "Modal_Wizard_Form" wizard with offset "false"
            | name_verify |
            |    name3    |
            |    name1    |
        Then verify data in "Parameters_Table" table on "Modal_Wizard_Form" wizard
            | name_verify           |         type_dropdown_verify         | value_verify |
            | model_class           |                str                   |              |
            | label_columns         |  Optional[Union[str, List[str]]]     |              |
            | drop_columns          |              List[str]               |              |
            | model_name            |                str                   |     model    |
            | tag                   |                str                   |              |
            | train_test_split_size |                float                 |              |
            | random_state          |                int                   |              |
            | labels                |                dict                  |              |
            | name2                 |                int                   |      1       |
        Then edit 9 row in "Parameters_Table" key-value table on "Modal_Wizard_Form" wizard
            |  name_input | value_input |
            |    edited   |     234     |   
        Then verify data in "Parameters_Table" table on "Modal_Wizard_Form" wizard
            | name_verify           |         type_dropdown_verify         | value_verify |
            | model_class           |                str                   |              |
            | label_columns         |  Optional[Union[str, List[str]]]     |              |
            | drop_columns          |              List[str]               |              |
            | model_name            |                str                   |     model    |
            | tag                   |                str                   |              |
            | train_test_split_size |                float                 |              |
            | random_state          |                int                   |              |
            | labels                |                dict                  |              |
            | name2edited           |                int                   |     1234     |      

    @MLJW
    @inProgress
    @smoke
    Scenario: MLJW037 - Check all mandatory components on Batch Run wizard - Step 5 (Resources)
        Given open url
        And wait load page
        Then turn Off MLRun CE mode
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is disabled
        And click on row root with value "test" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "test" value
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
        And click on "Step_5_Button" element on "commonPagesHeader" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "test" value
        Then verify "Step_1_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_2_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_3_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_4_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_5_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_6_Button" element on "commonPagesHeader" wizard is enabled
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Run" value
        Then verify "Form_Header_Resources" element visibility on "commonPagesHeader" wizard
        Then "Form_Header_Resources" element on "commonPagesHeader" should contains "Resources" value
        Then verify "Pods_Priority_Dropdown" dropdown in "Resources_Accordion" on "Modal_Wizard_Form" wizard selected option value "Medium"
        Then select "Low" option in "Pods_Priority_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Pods_Priority_Dropdown" dropdown in "Resources_Accordion" on "Modal_Wizard_Form" wizard selected option value "Low"
        Then select "High" option in "Pods_Priority_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Pods_Priority_Dropdown" dropdown in "Resources_Accordion" on "Modal_Wizard_Form" wizard selected option value "High"
        Then verify "Node_Selection_Subheader" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then "Node_Selection_Subheader" element in "Resources_Accordion" on "Modal_Wizard_Form" should contains "Node selection" value
        Then verify "Resources_Node_Selector_Table" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        When add data rows to "Resources_Node_Selector_Table" key-value table in "Resources_Accordion" on "Modal_Wizard_Form" wizard
            | key_input | value_input |
            | key1      | value1      |
            | key2      | value2      |
            | key3      | value3      |
            | key4      | value4      |
        Then verify data values in "Resources_Node_Selector_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard
            | key  | value  |
            | key1 | value1 |
            | key2 | value2 |
            | key3 | value3 |
            | key4 | value4 |
        When click on "delete_btn" in "Resources_Node_Selector_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard with offset "false"
            | key  |
            | key3 |
            | key1 |
        Then verify data values in "Resources_Node_Selector_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard
            | key  | value  |
            | key2 | value2 |
            | key4 | value4 |
        Then edit 2 row in "Resources_Node_Selector_Table" key-value table in "Resources_Accordion" on "Modal_Wizard_Form" wizard
            | key_input        | value_input      |
            | edited           | edited           |
        Then verify data values in "Resources_Node_Selector_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard
            | key        | value        |
            | key2edited | value2edited |
            | key4       | value4       |
        Then verify "Memory_Request_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Request_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."Memory_Unit_Options"
        Then verify "Memory_Limit_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Limit_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."Memory_Unit_Options"
        Then verify "Memory_Request_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then type value "0" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Minimum_Value_Warning"
        Then type value "1" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then type value "1025" to "Memory_Request_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Limit_Number_Warning"
        Then verify "Memory_Request_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Request_Number_Warning"
        Then type value "2" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then select "KB" option in "Memory_Limit_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Limit_Number_Warning"
        Then verify "Memory_Request_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Request_Number_Warning"
        Then select "KB" option in "Memory_Request_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then type value "" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then type value "2" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then select "GB" option in "Memory_Request_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Limit_Number_Warning"
        Then verify "Memory_Request_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Request_Number_Warning"
        Then verify "CPU_Request_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Request_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."CPU_Unit_Options"
        Then verify "CPU_Limit_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."CPU_Unit_Options"
        Then select "millicpu" option in "CPU_Limit_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then select "millicpu" option in "CPU_Request_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then type value "0" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Minimum_Value_Warning"
        Then type value "1" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then type value "1025" to "CPU_Request_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Limit_Number_Warning" 
        Then verify "CPU_Request_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Request_Number_Warning" 
        Then type value "0" to "GPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "GPU_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."GPU_Minimum_Value_Warning"
        Then verify "Memory_Request_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Request_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."Memory_Unit_Options"
        Then verify "Memory_Request_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then type value "1" to "Memory_Request_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then increase value on 15 points in "Memory_Request_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then decrease value on 15 points in "Memory_Request_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Limit_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Limit_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."Memory_Unit_Options"
        Then verify "Memory_Limit_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then type value "2" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then increase value on 15 points in "Memory_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then decrease value on 15 points in "Memory_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Request_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Request_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."CPU_Unit_Options"
        Then verify "CPU_Request_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then type value "3" to "CPU_Request_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then increase value on 15 points in "CPU_Request_Number_Input" field with "millicpu" on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then decrease value on 15 points in "CPU_Request_Number_Input" field with "millicpu" on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then select "cpu" option in "CPU_Request_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Request_Number_Input" input should contains "0.003" value in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then increase value on 8 points in "CPU_Request_Number_Input" field with "cpu" on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then decrease value on 8 points in "CPU_Request_Number_Input" field with "cpu" on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."CPU_Unit_Options"
        Then verify "CPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then type value "4" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then increase value on 15 points in "CPU_Limit_Number_Input" field with "millicpu" on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then decrease value on 15 points in "CPU_Limit_Number_Input" field with "millicpu" on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then select "cpu" option in "CPU_Limit_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Number_Input" input should contains "0.004" value in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then increase value on 8 points in "CPU_Request_Number_Input" field with "cpu" on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then decrease value on 8 points in "CPU_Request_Number_Input" field with "cpu" on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "GPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then type value "5" to "GPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then increase value on 15 points in "GPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then decrease value on 15 points in "GPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Volumes_Subheader" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Volumes_Subheader" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Label_Hint"."New_Job_Volumes"

    @MLJW
    @smoke
    Scenario: MLJW043 - Check Batch-Run running after edit GPU limit in Resources section
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        And click on row root with value "test" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "test" value
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
        And click on "Step_5_Button" element on "commonPagesHeader" wizard
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Run" value
        Then "Form_Header_Resources" element on "commonPagesHeader" should contains "Resources" value
        Then verify "GPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then type value "5" to "GPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        And click on "Run_Button" element on "Modal_Wizard_Form" wizard
        And wait load page
        Then value in "name" column with "text" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "test"

    @MLJW
    @smoke
    Scenario: MLJW025 - Check Minimum CPU value on Batch Run wizard - Resources
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is disabled
        And click on row root with value "test" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "test" value
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
        And click on "Step_5_Button" element on "commonPagesHeader" wizard
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Run" value
        Then "Form_Header_Resources" element on "commonPagesHeader" should contains "Resources" value
        Then verify "CPU_Request_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Request_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."CPU_Unit_Options"
        Then verify "CPU_Limit_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."CPU_Unit_Options"
        Then select "millicpu" option in "CPU_Limit_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then select "millicpu" option in "CPU_Request_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then type value "0" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Minimum_Value_Warning"
        Then type value "0" to "CPU_Request_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Request_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Minimum_Value_Warning"
        Then type value "-1" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Minimum_Value_Warning"
        Then type value "-1" to "CPU_Request_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Request_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Minimum_Value_Warning"
        Then type value "2" to "CPU_Request_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then decrease value on 3 points in "CPU_Request_Number_Input" field with "millicpu" on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Request_Number_Input" input should contains "1" value in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then type value "2" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then decrease value on 3 points in "CPU_Limit_Number_Input" field with "millicpu" on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Number_Input" input should contains "1" value in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Container_Input | Volume_Paths_Table_Access_Key_Input | Volume_Paths_Table_Resource_Path_Input | Add_New_Row_Button | Delete_New_Row_Button |
            |               V3IO               |            Volume_Name_1             |       /path/to/happines1      |         Container_Input_1          |           Access_Key_1              |            /resource/path_1            |         yes        |                       |
            |               V3IO               |            Volume_Name_2             |       /path/to/happines2      |         Container_Input_2          |           Access_Key_2              |            /resource/path_2            |         yes        |                       |

    @MLJW
    @smoke
    Scenario: MLJW026 - Check tip and warning messages in Volumes section on Batch Run wizard - Resources
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is disabled
        And click on row root with value "test" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Run" value
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "test" value
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
        And click on "Step_5_Button" element on "commonPagesHeader" wizard
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Run" value
        Then "Form_Header_Resources" element on "commonPagesHeader" should contains "Resources" value
        Then verify "Volumes_Subheader" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Volumes_Subheader" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Label_Hint"."New_Job_Volumes"
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Container_Input | Volume_Paths_Table_Access_Key_Input | Volume_Paths_Table_Resource_Path_Input | Add_New_Row_Button |
            |             V3IO                 |                                      |                               |                                    |                                     |                                        |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Access_Key_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Mount_Path_Hint"
        Then verify "Volume_Paths_Table_Container_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Data_Container_Hint"
        Then verify "Volume_Paths_Table_Access_Key_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."DataAccess_Key_Hint"
        Then verify "Volume_Paths_Table_Resource_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Relative_Directory_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Config_Map_Input | Add_New_Row_Button |
            |           Config Map             |                                      |                               |                                     |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Config_Map_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Mount_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Secret_Name_Input | Add_New_Row_Button |
            |             Secret               |                                      |                               |                                      |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Secret_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Mount_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Claime_Name_Input | Add_New_Row_Button |
            |               PVC                |                                      |                               |                                      |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Claime_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Mount_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard

    @MLJW
    @smoke
    Scenario: MLJW031 - Check mandatory of Container and Resource Path fields for V3IO volume - Batch Run - Resources
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is disabled
        And click on row root with value "test" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "test" value
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
        And click on "Step_5_Button" element on "commonPagesHeader" wizard
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Run" value
        Then "Form_Header_Resources" element on "commonPagesHeader" should contains "Resources" value
        Then verify "Volumes_Subheader" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Volumes_Subheader" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Label_Hint"."New_Job_Volumes"
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Container_Input | Volume_Paths_Table_Access_Key_Input | Volume_Paths_Table_Resource_Path_Input | Add_New_Row_Button |
            |             V3IO                 |           Volume_Name_1              |      /path/to/happines1       |                                    |            Access_Key_1             |                                        |         yes        |
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        And click on "Run_Button" element on "Modal_Wizard_Form" wizard
        And wait load page
        Then value in "name" column with "text" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "test"

    @MLJW
    @smoke
    Scenario: MLJW033 - Check autocomplete without tags MLRun Store path for datasets, artifacts, models, feature vectors - Batch Run - Data input
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is disabled
        Then select "Hub" tab in "Function_Selection_Tabs" on "Modal_Wizard_Form" wizard
        And wait load page
        And click on row root with value "auto-trainer" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "auto-trainer" value
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Run" value
        Then "Form_Header_Data_Inputs" element on "commonPagesHeader" should contains "Data Inputs" value
        When add data to "Data_Inputs_Table" table on "Modal_Wizard_Form" wizard with combobox
            |    name_input   | path_dropdown | path_dropdown_autocomplete_artifacts | path_dropdown_autocomplete_project | path_dropdown_autocomplete_item | path_dropdown_autocomplete_tag |
            |     artifacts   |  MLRun store  |               Artifacts              |     default (Current project)      |        download_content         |            #0:latest           |
            |     datasets    |  MLRun store  |               Datasets               |     default (Current project)      |       test_new_structure        |            #0:latest           |
            |      models     |  MLRun store  |                Models                |     default (Current project)      |          model_default          |            #0:latest           |
            | feature vectors |  MLRun store  |           Feature vectors            |     default (Current project)      |             test-i              |            :test-tag           |
            |     data_tag    |  MLRun store  |               Datasets               |     default (Current project)      |             test-i              |            #0:latest           |
        Then verify data in "Data_Inputs_Table" table on "Modal_Wizard_Form" wizard
            |   name_verify   |                       path_verify                    |
            |     dataset     |                                                      | 
            |    sample_set   |                                                      | 
            |     test_set    |                                                      |    
            |    artifacts    | store://artifacts/default/download_content#0:latest  | 
            |     datasets    | store://datasets/default/test_new_structure#0:latest | 
            |      models     |    store://models/default/model_default#0:latest     |
            | feature vectors |   store://feature-vectors/default/test-i:test-tag    |
            |     data_tag    |      store://datasets/default/test-i#0:latest        |

    @MLJW
    @smoke
    Scenario: MLJW034 - Check setting schedule for a job - Batch Run - Schedule for later 
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is disabled
        And click on row root with value "test" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "test" value
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
        Then verify "Schedule_For_Later_Button" element on "Modal_Wizard_Form" wizard is enabled
        And click on "Schedule_For_Later_Button" element on "Modal_Wizard_Form" wizard
        Then verify "Time_unit_Dropdown" element visibility in "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then verify "Time_unit_Dropdown" element in "Schedule_For_Later" on "Schedule_PopUp" wizard should contains "Dropdown_Options"."Time_Unit_Options"
        Then select "Weekly" option in "Time_unit_Dropdown" dropdown on "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then verify "Schedule_Button" not input element in "Schedule_For_Later" on "Schedule_PopUp" wizard is enabled
        Then verify "Schedule_item_Sunday" not input element in "Schedule_For_Later" on "Schedule_PopUp" wizard is NOT active
        Then verify "Schedule_item_Monday" not input element in "Schedule_For_Later" on "Schedule_PopUp" wizard is active
        When click on "Schedule_item_Monday" element in "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then verify "Schedule_item_Monday" not input element in "Schedule_For_Later" on "Schedule_PopUp" wizard is NOT active
        When click on "Schedule_item_Tuesday" element in "Schedule_For_Later" on "Schedule_PopUp" wizard
        When click on "Schedule_item_Wednesday" element in "Schedule_For_Later" on "Schedule_PopUp" wizard
        When click on "Schedule_item_Thursday" element in "Schedule_For_Later" on "Schedule_PopUp" wizard
        When click on "Schedule_item_Friday" element in "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then "Error_Message" component in "Schedule_For_Later" on "Schedule_PopUp" should contains "Error_Messages"."One_Day_Option"
        Then verify "Schedule_Button" not input element in "Schedule_For_Later" on "Schedule_PopUp" wizard is disabled

    @MLJW
    @smoke
    Scenario: MLJW035 - Check environment variables table types components on Batch Run in Advanced section
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is disabled
        And click on row root with value "test" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "test" value
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
        And click on "Step_6_Button" element on "commonPagesHeader" wizard
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Run" value
        Then "Form_Header_Advanced" element on "commonPagesHeader" should contains "Advanced" value
        Then verify "Accordion_Advanced_Subheader" element visibility on "Modal_Wizard_Form" wizard
        Then "Accordion_Advanced_Subheader" element on "Modal_Wizard_Form" should contains "Environment variables" value
        Then verify "Advanced_Environment_Variables_Table" element visibility on "Modal_Wizard_Form" wizard 
        Then verify data in "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard
            |   name_verify   | type_dropdown_verify |            value_verify              |
            |    V3IO_API     |        value         |       http://v3io-webapi:8081        |
            |  V3IO_USERNAME  |        value         |              pipelines               | 
            | V3IO_ACCESS_KEY |        value         | b1410f67-92a9-41fd-9413-6d0015c493fd |
            |  V3IO_FRAMESD   |        value         |         http://framesd:8080          |
        Then edit dropdown field 1 row in "Advanced_Environment_Variables_Table" key-value table on "Modal_Wizard_Form" wizard
            | type_dropdown |  value_input | value_input_key |
            |     Secret    | sectretName1 |   sectretKey1   |
        Then edit dropdown field 3 row in "Advanced_Environment_Variables_Table" key-value table on "Modal_Wizard_Form" wizard
            | type_dropdown |  value_input | value_input_key |
            |     Secret    | sectretName2 |   sectretKey2   |
        Then verify data in "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard
            |   name_verify   | type_dropdown_verify |        value_verify      |
            |    V3IO_API     |        secret        | sectretName1:sectretKey1 |
            |  V3IO_USERNAME  |        value         |         pipelines        | 
            | V3IO_ACCESS_KEY |        secret        | sectretName2:sectretKey2 |
            |  V3IO_FRAMESD   |        value         |    http://framesd:8080   |

    @MLJW
    @smoke
    Scenario: MLJW036 - Check setting schedule for a job - Batch Run - Schedule for later 
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is disabled
        And click on row root with value "test" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "test" value
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
        Then verify "Schedule_For_Later_Button" element on "Modal_Wizard_Form" wizard is enabled
        And click on "Schedule_For_Later_Button" element on "Modal_Wizard_Form" wizard
        Then verify "Time_unit_Dropdown" element visibility in "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then verify "Time_unit_Dropdown" element in "Schedule_For_Later" on "Schedule_PopUp" wizard should contains "Dropdown_Options"."Time_Unit_Options"
        # check weekly options
        Then select "Weekly" option in "Time_unit_Dropdown" dropdown on "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then verify "Schedule_item_Sunday" not input element in "Schedule_For_Later" on "Schedule_PopUp" wizard is NOT active
        When click on "Schedule_item_Sunday" element in "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then verify "Schedule_item_Sunday" not input element in "Schedule_For_Later" on "Schedule_PopUp" wizard is active
        Then verify "Schedule_item_Monday" not input element in "Schedule_For_Later" on "Schedule_PopUp" wizard is active
        When click on "Schedule_item_Monday" element in "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then verify "Schedule_item_Monday" not input element in "Schedule_For_Later" on "Schedule_PopUp" wizard is NOT active
        Then verify "Schedule_item_Tuesday" not input element in "Schedule_For_Later" on "Schedule_PopUp" wizard is active
        When click on "Schedule_item_Tuesday" element in "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then verify "Schedule_item_Tuesday" not input element in "Schedule_For_Later" on "Schedule_PopUp" wizard is NOT active
        Then verify "Schedule_item_Wednesday" not input element in "Schedule_For_Later" on "Schedule_PopUp" wizard is active
        When click on "Schedule_item_Wednesday" element in "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then verify "Schedule_item_Wednesday" not input element in "Schedule_For_Later" on "Schedule_PopUp" wizard is NOT active
        Then verify "Schedule_item_Thursday" not input element in "Schedule_For_Later" on "Schedule_PopUp" wizard is active
        When click on "Schedule_item_Thursday" element in "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then verify "Schedule_item_Thursday" not input element in "Schedule_For_Later" on "Schedule_PopUp" wizard is NOT active
        Then verify "Schedule_item_Friday" not input element in "Schedule_For_Later" on "Schedule_PopUp" wizard is active
        When click on "Schedule_item_Friday" element in "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then verify "Schedule_item_Friday" not input element in "Schedule_For_Later" on "Schedule_PopUp" wizard is NOT active
        Then verify "Schedule_item_Saturday" not input element in "Schedule_For_Later" on "Schedule_PopUp" wizard is NOT active
        When click on "Schedule_item_Saturday" element in "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then verify "Schedule_item_Saturday" not input element in "Schedule_For_Later" on "Schedule_PopUp" wizard is active
        # check minute options
        Then select "Minute" option in "Time_unit_Dropdown" dropdown on "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then verify "Intervals_Dropdown" element visibility in "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then verify "Intervals_Dropdown" element in "Schedule_For_Later" on "Schedule_PopUp" wizard should contains "Dropdown_Options"."Minute_Intervals_Dropdown_Options"
        Then select "Every 30" option in "Intervals_Dropdown" dropdown on "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then select "Every 20" option in "Intervals_Dropdown" dropdown on "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then select "Every 15" option in "Intervals_Dropdown" dropdown on "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then select "Every 10" option in "Intervals_Dropdown" dropdown on "Schedule_For_Later" on "Schedule_PopUp" wizard
        # check hourly options
        Then select "Hourly" option in "Time_unit_Dropdown" dropdown on "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then verify "Intervals_Dropdown" element visibility in "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then verify "Intervals_Dropdown" element in "Schedule_For_Later" on "Schedule_PopUp" wizard should contains "Dropdown_Options"."Hour_Intervals_Dropdown_Options"
        Then select "Every 12" option in "Intervals_Dropdown" dropdown on "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then select "Every 6" option in "Intervals_Dropdown" dropdown on "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then select "Every 4" option in "Intervals_Dropdown" dropdown on "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then select "Every 3" option in "Intervals_Dropdown" dropdown on "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then select "Every 2" option in "Intervals_Dropdown" dropdown on "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then select "Every 1" option in "Intervals_Dropdown" dropdown on "Schedule_For_Later" on "Schedule_PopUp" wizard
        # check daily options
        Then select "Daily" option in "Time_unit_Dropdown" dropdown on "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then verify "At_time_Input" element visibility in "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then type value "23:23" to "At_time_Input" field on "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then type value "15:15" to "At_time_Input" field on "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then type value "01:45" to "At_time_Input" field on "Schedule_For_Later" on "Schedule_PopUp" wizard
        # check monthly options
        Then select "Monthly" option in "Time_unit_Dropdown" dropdown on "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then verify "At_time_Input" element visibility in "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then type value "23:23" to "At_time_Input" field on "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then type value "15:15" to "At_time_Input" field on "Schedule_For_Later" on "Schedule_PopUp" wizard
        Then type value "01:45" to "At_time_Input" field on "Schedule_For_Later" on "Schedule_PopUp" wizard

    @MLJW
    @smoke
    Scenario: MLJW045 - Check back navigation from Job overview to Jobs Monitor tab and forward to Job overview
        Given open url
        And wait load page
        And click on row root with value "cat-vs-dog-classification" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify redirection to "projects/cat-vs-dog-classification/jobs/monitor-jobs/sef/cf842616c89347c7bb7bca2c9e840a21/overview?dates=anyTime&savedParams=P2JlUGFnZT0xJmZlUGFnZT0xJmRhdGVzPWFueVRpbWU%3D&bePage=1&fePage=1"
        Then verify "Info_Pane_Tab_Selector" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Tab_List"
        Then navigate back
        And wait load page
        Then verify redirection to "projects/cat-vs-dog-classification/jobs/monitor-jobs/sef?dates=anyTime&savedParams=P2JlUGFnZT0xJmZlUGFnZT0xJmRhdGVzPWFueVRpbWU%3D&bePage=1&fePage=1"
        Then navigate back
        And wait load page
        Then verify redirection to "projects/cat-vs-dog-classification/jobs/monitor-jobs?bePage=1&fePage=1&dates=anyTime"
        Then navigate forward
        And wait load page
        Then verify redirection to "projects/cat-vs-dog-classification/jobs/monitor-jobs/sef?dates=anyTime&savedParams=P2JlUGFnZT0xJmZlUGFnZT0xJmRhdGVzPWFueVRpbWU%3D&bePage=1&fePage=1"
        Then navigate forward
        And wait load page
        Then verify redirection to "projects/cat-vs-dog-classification/jobs/monitor-jobs/sef/cf842616c89347c7bb7bca2c9e840a21/overview?dates=anyTime&savedParams=P2JlUGFnZT0xJmZlUGFnZT0xJmRhdGVzPWFueVRpbWU%3D&bePage=1&fePage=1"
        Then verify "Info_Pane_Tab_Selector" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Tab_List"

    @MLJW
    @smoke
    Scenario: MLJW046 - Check components in Parameters section on Batch Run wizard with checked Hyper
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then select "Hub" tab in "Function_Selection_Tabs" on "Modal_Wizard_Form" wizard
        And wait load page
        And click on row root with value "auto-trainer" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then check "Hyperparameter_Checkbox" element on "Modal_Wizard_Form" wizard
        And wait load page
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then "Form_Header_Parameters" element on "commonPagesHeader" should contains "Parameters" value
        Then verify "Parameters_Headers" on "Modal_Wizard_Form" wizard should contains "Modal_Wizard_Form"."Parameters_Table_Header_Hyper"
        Then verify "Parameters_From_UI_Radiobutton" element visibility in "Parameters_Accordion" on "Modal_Wizard_Form" wizard
        Then is "Parameters_From_UI_Radiobutton" in "Parameters_Accordion" on "Modal_Wizard_Form" selected
        And click on "Add_Custom_Parameter_Button" element on "Modal_Wizard_Form" wizard
        Then verify "Hyper_Toggle_Switch" element visibility in "Parameters_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Parameters_From_File_Radiobutton" element visibility in "Parameters_Accordion" on "Modal_Wizard_Form" wizard
        Then is not "Parameters_From_File_Radiobutton" in "Parameters_Accordion" on "Modal_Wizard_Form" selected
        Then verify "Parameters_From_File_Input" element visibility in "Parameters_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Parameters_From_File_Input" element in "Parameters_Accordion" on "Modal_Wizard_Form" wizard is disabled by class name
        When select "Parameters_From_File_Radiobutton" in "Parameters_Accordion" on "Modal_Wizard_Form"
        And wait load page
        Then verify "Parameters_From_File_Input" element in "Parameters_Accordion" on "Modal_Wizard_Form" wizard is enabled by class name
        Then verify "Parameters_Headers" on "Modal_Wizard_Form" wizard should contains "Modal_Wizard_Form"."Parameters_Table_Header"
        Then verify "Hyper_Toggle_Switch" element not exists in "Parameters_Accordion" on "Modal_Wizard_Form" wizard
    
    @MLJW
    @smoke
    Scenario: MLJW049 - Check Abort action on Monitor Jobs tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then select "Abort" option in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table at row with "erann-test" value in "name" column
        And wait load page
        Then verify if "Common_Popup" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "Common_Popup" wizard
        Then verify "Title" element visibility on "Common_Popup" wizard
        Then click on "Cross_Cancel_Button" element on "Common_Popup" wizard
        And wait load page
        Then verify "Title" element not exists on "Common_Popup" wizard
        Then select "Abort" option in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table at row with "erann-test" value in "name" column
        And wait load page
        Then verify if "Common_Popup" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "Common_Popup" wizard
        Then verify "Title" element visibility on "Common_Popup" wizard
        Then "Title" element on "Common_Popup" should contains "Abort job?" value
        Then "Description" element on "Common_Popup" should contains "Are you sure you want to abort the job \"erann-test\"?" value
        Then verify "Confirm_Button" element visibility on "Common_Popup" wizard
        Then verify "Confirm_Button" element on "Common_Popup" wizard is enabled
        Then "Confirm_Button" element on "Common_Popup" should contains "Abort" value
        Then verify "Cancel_Button" element visibility on "Common_Popup" wizard
        Then verify "Cancel_Button" element on "Common_Popup" wizard is enabled
        Then "Cancel_Button" element on "Common_Popup" should contains "Cancel" value
        Then click on "Cancel_Button" element on "Common_Popup" wizard
        And wait load page
        Then verify "Title" element not exists on "Common_Popup" wizard
        Then select "Abort" option in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table at row with "erann-test" value in "name" column
        And wait load page
        Then click on "Confirm_Button" element on "Common_Popup" wizard
        And wait load page
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        And wait load page
        Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Job abortion in progress" value
        And wait load page
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
        Then verify "Table_Refresh_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then value in "status" column with "tooltip" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "Aborting"
        Then wait for 10 seconds
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        And wait load page
        Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Job erann-test (...e19ea57) was aborted" value
        And wait load page
        And wait load page
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
        Then verify "Table_Refresh_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then value in "status" column with "tooltip" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "Aborted"
    
    @MLJW
    @passive
    @smoke
    # retry action is using KFP API and so this can’t be implemented in the mock - https://iguazio.atlassian.net/browse/ML-9124
    #TODO: need to add check Retry option for error and running status
    Scenario: MLJW087 - Check Retry option in action menu on Workflows Monitor tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Monitor Workflows" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify options in action menu on "Workflows_Monitor_Tab" wizard in "Workflows_Monitor_Table" table with "Completed" value in "status" column should contains "Jobs_And_Workflows"."Workflows_Action_Menu_Options"
        Then select "Retry" option in action menu on "Workflows_Monitor_Tab" wizard in "Workflows_Monitor_Table" table at row with "kfpipeline 2021-07-06 11-16-28" value in "name" column
        And wait load page
        Then verify if "Notification_Popup" popup dialog appears
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        Then "Notification_Pop_Up" component on "Notification_Popup" should contains "Jobs_And_Workflows"."Workflows_Unsuccessful_Run_Message"
        Then verify "Retry_Button" element visibility on "Notification_Popup" wizard
        Then "Retry_Button" element on "Notification_Popup" should contains "RETRY" value
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard

    @MLJW
    @passive
    @smoke
    Scenario: MLJW088 - Verify filtering by workflows status on Workflows Monitor tab
        Given open url
        And wait load page
        And click on row root with value "cat-vs-dog-classification" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then value in "status" column with "tooltip" in "Workflows_Monitor_Table" on "Workflows_Monitor_Tab" wizard should contains "Completed"
        Then value in "status" column with "tooltip" in "Workflows_Monitor_Table" on "Workflows_Monitor_Tab" wizard should contains "Failed"
        When click on cell with row index 1 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then click on "Toggle_View_Button" element on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then value in "status" column with "tooltip" in "Workflow_List_View_Table" on "Workflows_Monitor_Tab" wizard should contains "Error"
        Then value in "status" column with "tooltip" in "Workflow_List_View_Table" on "Workflows_Monitor_Tab" wizard should contains "Completed"
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        When click on cell with row index 2 in "name" column in "Workflow_List_View_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then verify "State_Icon" element visibility on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "State_Icon" element on "Workflows_Monitor_Tab_Info_Pane" wizard should display hover tooltip "Common_Tooltips"."Error_Content_Workflow"
        Then verify "Error_Content" element visibility on "Workflows_Monitor_Tab_Info_Pane" wizard
    
    @MLJW
    @smoke
    Scenario: MLJW089 - Check Delete run / Delete all runs options in Action menu
        Given open url
        And wait load page
        And click on row root with value "getting-started-tutorial-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then type value "prep_data" to "Table_Name_Filter_Input" field on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then value in "name" column with "text" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "prep_data"
        Then verify action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table with "prep_data" value in "name" column should contains "Jobs_And_Workflows"."Job_List_Action_Menu_Options" without scroll
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify that 3 row elements are displayed in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard
        Then click on "Arrow_Back" element on "Jobs_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then select "Delete run" option in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table at row with "prep_data" value in "name" column
        And wait load page
        Then verify if "Confirm_Popup" popup dialog appears
        Then "Confirm_Dialog_Message" component on "Confirm_Popup" should be equal "Jobs_And_Workflows"."Delete_Run_Message"
        When click on "Delete_Button" element on "Confirm_Popup" wizard
        And wait load page
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        And wait load page
        And wait load page
        Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Job is successfully deleted" value
        And wait load page
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify that 2 row elements are displayed in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard
        Then click on "Arrow_Back" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then select "Delete all runs" option in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table at row with "prep_data" value in "name" column
        And wait load page
        Then verify if "Confirm_Popup" popup dialog appears
        Then "Confirm_Dialog_Message" component on "Confirm_Popup" should be equal "Jobs_And_Workflows"."Delete_All_Runs_Message"
        When click on "Delete_Button" element on "Confirm_Popup" wizard
        And wait load page
        And wait load page
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Job is successfully deleted" value
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
        Then "No_Data_Message" component on "commonPagesHeader" should be equal "No_Data_Message"."Common_Message_Monitor_Jobs_Name"
        Then type value "test" to "Table_Name_Filter_Input" field on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify that 3 row elements are displayed in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Action_Menu" dropdown element on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "Jobs_And_Workflows"."Job_Overview_Action_Menu_Options"
        Then select "Delete run" option in action menu on "Jobs_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify if "Confirm_Popup" popup dialog appears
        Then "Confirm_Dialog_Message" component on "Confirm_Popup" should be equal "Jobs_And_Workflows"."Delete_Run_Message"
        When click on "Delete_Button" element on "Confirm_Popup" wizard
        And wait load page
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        And wait load page
        And wait load page
        Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Job is successfully deleted" value
        And wait load page
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
        Then verify that 2 row elements are displayed in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard

    @MLJW
    @passive
    @smoke
    Scenario: MLJW091 - Check the auto refresh checkbox on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "auto-generated-data" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify breadcrumbs "project" label should be equal "auto-generated-data" value
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Jobs and workflows" value
        Then verify "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard should contains "Jobs_And_Workflows"."Tab_List"
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "Auto_Refresh_Checkbox" element visibility on "Jobs_Monitor_Tab" wizard
        Then "Auto_Refresh_Checkbox" element should be unchecked on "Jobs_Monitor_Tab" wizard
        Then verify "Pagination_Count" element visibility on "Pagination_Info_Pane" wizard
        Then "Pagination_Count" element on "Pagination_Info_Pane" should contains "Showing 1 - 50" value
        Then verify "BE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is enabled
        Then check "Auto_Refresh_Checkbox" element on "Jobs_Monitor_Tab" wizard
        Then "Auto_Refresh_Checkbox" element should be checked on "Jobs_Monitor_Tab" wizard
        Then "Pagination_Count" element on "Pagination_Info_Pane" should contains "Showing 1 - 50" value
        Then verify "BE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "BE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard should display hover tooltip "Common_Tooltips"."Auto_Refresh"
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Auto_Refresh_Checkbox" element visibility on "Jobs_Monitor_Tab" wizard
        Then "Auto_Refresh_Checkbox" element should be unchecked on "Jobs_Monitor_Tab" wizard
        Then check "Auto_Refresh_Checkbox" element on "Jobs_Monitor_Tab" wizard
        Then "Auto_Refresh_Checkbox" element should be checked on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 1 in "uid" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Auto_Refresh_Checkbox" element visibility on "Jobs_Monitor_Tab" wizard
        Then "Auto_Refresh_Checkbox" element should be unchecked on "Jobs_Monitor_Tab" wizard
        Then verify "Auto_Refresh_Checkbox_Element" element on "Jobs_Monitor_Tab" wizard is disabled
        Then click on "Cross_Close_Button" element on "Jobs_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then "Auto_Refresh_Checkbox" element should be checked on "Jobs_Monitor_Tab" wizard
        Then click on "Arrow_Back" element on "Jobs_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then "Auto_Refresh_Checkbox" element should be checked on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then "Auto_Refresh_Checkbox" element should be unchecked on "Jobs_Monitor_Tab" wizard
        Then check "Auto_Refresh_Checkbox" element on "Jobs_Monitor_Tab" wizard
        Then "Auto_Refresh_Checkbox" element should be checked on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "uid" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then "Auto_Refresh_Checkbox" element should be unchecked on "Jobs_Monitor_Tab" wizard
        Then verify "Auto_Refresh_Checkbox_Element" element on "Jobs_Monitor_Tab" wizard is disabled
        Then click on "Arrow_Back" element on "Jobs_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then "Auto_Refresh_Checkbox" element should be checked on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then "Auto_Refresh_Checkbox" element should be unchecked on "Jobs_Monitor_Tab" wizard
        Then click on "Arrow_Back" element on "Jobs_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then uncheck "Auto_Refresh_Checkbox" element on "Jobs_Monitor_Tab" wizard
        Then "Auto_Refresh_Checkbox" element should be unchecked on "Jobs_Monitor_Tab" wizard
        Then verify "BE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is enabled
        Then click on "BE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard
        And wait load page
        Then "Auto_Refresh_Checkbox" element should be unchecked on "Jobs_Monitor_Tab" wizard
        Then click on "BE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard
        And wait load page
        Then "Auto_Refresh_Checkbox" element should be unchecked on "Jobs_Monitor_Tab" wizard
        Then check "Auto_Refresh_Checkbox" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then "Pagination_Count" element on "Pagination_Info_Pane" should contains "Showing 1 - 50" value
        Then verify "BE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is disabled
        Then verify "BE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard should display hover tooltip "Common_Tooltips"."Auto_Refresh"
        