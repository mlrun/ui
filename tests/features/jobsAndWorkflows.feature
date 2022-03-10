Feature: Jobs and workflows

    Testcases that verifies functionality on Jobs and Workflows Pages

    @passive
    Scenario: Check all mandatory components on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify breadcrumbs "project" label should be equal "churn-project-admin" value
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Jobs" value
        Then verify "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard should contains "Jobs_And_Workflows"."Tab_List"
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "New_Job_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then "New_Job_Button" element on "Jobs_Monitor_Tab" should contains "New Job" value
        Then verify "Resource_Monitoring_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Expand_Rows_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Status_Filter_Dropdown" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown element on "Jobs_Monitor_Tab" wizard should contains "Dropdown_Options"."Status_Filter_Options"
        Then verify "Group_By_Name_Filter_Dropdown" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Group_By_Name_Filter_Dropdown" dropdown element on "Jobs_Monitor_Tab" wizard should contains "Dropdown_Options"."Group_By_Filter_Options"
        Then verify "Table_Name_Filter_Input" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Labels_Filter_Input" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Start_Time_Filter_Dropdown" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Start_Time_Filter_Dropdown" dropdown element on "Jobs_Monitor_Tab" wizard should contains "Dropdown_Options"."Start_Time_Filter_Options"
        When select "Past year" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then verify "Jobs_Monitor_Table" element visibility on "Jobs_Monitor_Tab" wizard

    @passive
    Scenario: Check all mandatory components on Workflows Monitor tab
        Given open url
        And turn on demo mode
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
        Then verify breadcrumbs "tab" label should be equal "Jobs" value
        Then verify "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard should contains "Jobs_And_Workflows"."Tab_List"
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Monitor Workflows" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "Workflows_Monitor_Table" element visibility on "Workflows_Monitor_Tab" wizard

    @passive
    Scenario: Check all mandatory components on Schedule Monitor tab
        Given open url
        And turn on demo mode
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
        Then verify breadcrumbs "tab" label should be equal "Jobs" value
        Then verify "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard should contains "Jobs_And_Workflows"."Tab_List"
        And select "Schedule" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Schedule" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Schedule_Monitor_Tab" wizard
        Then verify "Table_Labels_Filter_Input" element visibility on "Schedule_Monitor_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Schedule_Monitor_Tab" wizard
        Then verify "Schedule_Monitor_Table" element visibility on "Schedule_Monitor_Tab" wizard

    @passive
    Scenario: Check date picker dropdown options on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        When select "Past hour" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then verify "Past hour" filter band in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        When select "Past 24 hours" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then verify "Past 24 hours" filter band in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        When select "Past week" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then verify "Past week" filter band in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        When select "Past month" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then verify "Past month" filter band in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        When select "Past year" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then verify "Past year" filter band in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        When select "Custom range" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then verify "Date_Time_Picker" element visibility on "Jobs_Monitor_Tab" wizard

    @passive
    Scenario: verify date picker element on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        When pick up "Custom range" from "03/31/2014 10:30" to "03/21/2015 19:15" in "Date_Time_Picker" via "Start_Time_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        Then verify from "03/31/2014 10:30" to "03/21/2015 19:15" filter band in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        When pick up "Custom range" from "03/31/2044 10:30" to "03/21/2015 19:15" in "Date_Time_Picker" via "Start_Time_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        Then verify error message in "Date_Time_Picker" on "Jobs_Monitor_Tab" wizard with value "Date_Time_Picker"."Error_Message"
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        When pick up "Custom range" from "03/31/2030 10:30" to "03/31/2030 10:31" in "Date_Time_Picker" via "Start_Time_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        Then verify from "03/31/2030 10:30" to "03/31/2030 10:31" filter band in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        When pick up "Custom range" from "03/31/2025 10:31" to "03/21/2025 10:30" in "Date_Time_Picker" via "Start_Time_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        Then verify error message in "Date_Time_Picker" on "Jobs_Monitor_Tab" wizard with value "Date_Time_Picker"."Error_Message"

    @passive
    Scenario: verify filtering by job name on Jobs Monitor tab
        Given open url
        And wait load page
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        When select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then type value "test" to "Table_Name_Filter_Input" field on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then value in "name" column with "text" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "test"

    @passive
    Scenario: verify filtering by job name on Schedule Monitor tab
        Given open url
        And wait load page
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

    @passive
    Scenario: verify filtering by job label with key on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        When select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then type value "author" to "Table_Labels_Filter_Input" field on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then value in "labels" column with "dropdowns" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "author"
        Then type value "host=aggregate-test-ftk8n" to "Table_Labels_Filter_Input" field on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        Then value in "labels" column with "dropdowns" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "host=aggregate-test-ftk8n"

    @passive
    @inProgress
    Scenario: verify filtering by job label with key on Schedule tab
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
        Then type value "v3io_user" to "Table_Labels_Filter_Input" field on "Schedule_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Schedule_Monitor_Tab" wizard
        And wait load page
        Then value in "labels" column with "dropdowns" in "Schedule_Monitor_Table" on "Schedule_Monitor_Tab" wizard should contains "v3io_user"
        Then type value "v3io_user=admin" to "Table_Labels_Filter_Input" field on "Schedule_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Schedule_Monitor_Tab" wizard
        And wait load page
        Then value in "labels" column with "dropdowns" in "Schedule_Monitor_Table" on "Schedule_Monitor_Tab" wizard should contains "v3io_user=admin"

    @passive
    Scenario: verify filtering by job status on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        When select "Past year" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then select "Completed" option in "Status_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then value in "status" column with "tooltip" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "Completed"
        Then select "Error" option in "Status_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then value in "status" column with "tooltip" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "Error"
        Then select "Pending" option in "Status_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then value in "status" column with "tooltip" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "Pending"

    @passive
    Scenario: verify filtering Jobs after re-run action
        Given open url
        And wait load page
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then type value "test" to "Table_Name_Filter_Input" field on "Jobs_Monitor_Tab" wizard
        Then type value "host" to "Table_Labels_Filter_Input" field on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then select "Re-run" option in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table at row with "test" value in "name" column
        Then click on "Cross_Close_Button" element on "New_JobTemplate_Edit" wizard
        Then value in "name" column with "text" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "test"
        Then value in "labels" column with "dropdowns" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "host"

    @passive
    Scenario: verify filtering Jobs after Details panel opened
        Given open url
        And wait load page
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then type value "agg" to "Table_Name_Filter_Input" field on "Jobs_Monitor_Tab" wizard
        Then type value "host" to "Table_Labels_Filter_Input" field on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        Then click on "Arrow_Back" element on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then value in "name" column with "text" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "agg"
        Then value in "labels" column with "dropdowns" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "host"

    @passive
    @inProgress
    Scenario: verify filtering by starttime on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        When pick up "Custom range" from "11/07/2021 00:00" to "11/09/2021 00:00" in "Date_Time_Picker" via "Start_Time_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        Then verify from "11/07/2021 00:00" to "11/09/2021 00:00" filter band in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then value in "datetime" column in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should be from "11/07/2021 00:00" to "11/09/2021 00:00"

    @passive
    Scenario: verify mandatory elements starttime on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Search_Input" element visibility on "Create_Job" wizard
        Then verify "Select_Function_From_Dropdown" element visibility in "Select_Functions_From_Accordion" on "Create_Job" wizard
        Then verify "Collapse_Button" element visibility in "Function_Templates_Accordion" on "Create_Job" wizard

    @passive
    Scenario: verify mandatory elements starttime on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        When type searchable fragment "test" into "Search_Input" on "Create_Job" wizard
        Then searchable case "sensitive" fragment "test" should be in every suggested option into "Search_Input" on "Create_Job" wizard
        Then value in "name" column with "text" in "Selected_Functions_Templates" in "Select_Functions_From_Accordion" on "Create_Job" wizard should contains "test"
        When expand each row in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        Then subtable column "templates_list" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard should contains "test" in "name" column

    @passive
    Scenario: Check all mandatory components in Item infopane on Overview tab table on Jobs Monitor Page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        When select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 1 in "name" column in "Schedule_Monitor_Table" table on "Schedule_Monitor_Tab" wizard
        And wait load page
        Then verify "Arrow_Back" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Header" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Updated" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Tab_List"
        Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Overview_Headers" on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Overview_Headers"

    @passive
    Scenario: Check all mandatory components in Item infopane on Logs tab table on Jobs Monitor Page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        When select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 1 in "name" column in "Schedule_Monitor_Table" table on "Schedule_Monitor_Tab" wizard
        And wait load page
        And select "Logs" tab in "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Logs" tab is active in "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Logs_Text_container" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Logs_Refresh_Button" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then "Logs_Refresh_Button" element on "Jobs_Monitor_Tab_Info_Pane" should contains "Refresh" value

    @passive
    Scenario: Check all mandatory components in Item infopane on Overview tab table on Schedule Page
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
        When click on cell with row index 1 in "name" column in "Schedule_Monitor_Table" table on "Schedule_Monitor_Tab" wizard
        And wait load page
        Then verify "Header" element visibility on "ML_Function_Info_Pane" wizard
        Then verify "Updated" element visibility on "ML_Function_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "ML_Function_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" element visibility on "ML_Function_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "ML_Function_Info_Pane" wizard should contains "ML_Function_Info_Pane"."Tab_List"
        Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "ML_Function_Info_Pane" wizard
        Then verify "Overview_Headers" on "ML_Function_Info_Pane" wizard should contains "ML_Function_Info_Pane"."Overview_Headers"

    @passive
    Scenario: Verify all mandatory components on Delete existing scheduled job
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

    Scenario: Delete Scheduled Job
        * set tear-down property "schedule" created in "automation-test-name01" project with "new-aqa-schedule-01" value
        * set tear-down property "project" created with "automation-test-name01" value
        * create "automation-test-name01" MLRun Project with code 201
        * create "new-aqa-schedule-01" Schedule in "automation-test-name01" project with code 200
        Given open url
        And wait load page
        And click on row root with value "automation-test-name01" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Schedule" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Schedule" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then select "Delete" option in action menu on "Schedule_Monitor_Tab" wizard in "Schedule_Monitor_Table" table at row with "new-aqa-schedule-01" value in "name" column
        Then verify if "Common_Popup" popup dialog appears
        Then click on "Delete_Button" element on "Common_Popup" wizard
        And wait load page
        Then check "new-aqa-schedule-01" value not in "name" column in "Schedule_Monitor_Table" table on "Schedule_Monitor_Tab" wizard

    @passive
    @debug
    Scenario: verify mandatory elements on Create New Jobs side panel except accordions
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        When expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        When select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        Then click on "Name_Edit_Button" element on "New_JobTemplate_Edit" wizard
        Then type value "" to "Job_Name_Input" field on "New_JobTemplate_Edit" wizard
        Then verify "Job_Name_Input" on "New_JobTemplate_Edit" wizard should display options "Input_Hint"."Jobs_Name_Hint"
        Then verify "Job_Name_Input" options rules on "New_JobTemplate_Edit" wizard
        Then type value "demo_Job_00" to "Job_Name_Input" field on "New_JobTemplate_Edit" wizard
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Access_Key_Checkbox" element visibility on "New_JobTemplate_Edit" wizard
        Then uncheck "Access_Key_Checkbox" element on "New_JobTemplate_Edit" wizard
        Then verify "Access_Key_Input" element visibility on "New_JobTemplate_Edit" wizard
        Then type value "  " to "Access_Key_Input" field on "New_JobTemplate_Edit" wizard
        Then verify "Access_Key_Input" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then type value "" to "Access_Key_Input" field on "New_JobTemplate_Edit" wizard
        Then verify "Access_Key_Input" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Schedule_For_Later_Button" element visibility on "New_JobTemplate_Edit" wizard
        Then "Schedule_For_Later_Button" element on "New_JobTemplate_Edit" should contains "Schedule for later" value
        Then verify "Run_Now_Button" element visibility on "New_JobTemplate_Edit" wizard
        Then "Run_Now_Button" element on "New_JobTemplate_Edit" should contains "Run now" value

    @passive
    Scenario: verify mandatory elements in Data Inputs Accordion on Create New Jobs side panel
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        When expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        When select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        Then verify "Default_Input_Path_Input" element visibility in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Default_Artifact_Path_Input" element visibility in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard

    @passive
    Scenario: Verify behaviour of Combobox element on Create New Jobs wizard on Data Inputs Accordion
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        When expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        When select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        Then click on "Add_Input_Button" element in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify options in "URL_Combobox" combobox in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard should contains "Create_New_Job"."Combobox_Options"
        When select "MLRun store" option in "URL_Combobox" combobox on "Data_Inputs_Accordion" accordion on "New_JobTemplate_Edit" wizard
        When select "Artifacts" option in "URL_Combobox" combobox suggestion on "Data_Inputs_Accordion" accordion on "New_JobTemplate_Edit" wizard
        When type searchable fragment "c" into "URL_Combobox" combobox input in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then searchable fragment "c" should be in every suggested option into "URL_Combobox" combobox input in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then select "Current project" option in "URL_Combobox" combobox suggestion on "Data_Inputs_Accordion" accordion on "New_JobTemplate_Edit" wizard
        When type searchable fragment "clean" into "URL_Combobox" combobox input in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then searchable fragment "clean" should be in every suggested option into "URL_Combobox" combobox input in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When type value "  " to "URL_Combobox" field on "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then click on "Accordion_Header" element in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "URL_Combobox" element in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Jobs_MLRun_Store_Path_Hint"
        When type value "artifacts/default" to "URL_Combobox" field on "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then searchable fragment "default" should be in every suggested option into "URL_Combobox" combobox input in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When type value "artifacts/default/train" to "URL_Combobox" field on "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then searchable fragment "train" should be in every suggested option into "URL_Combobox" combobox input in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then select "V3IO" option in "URL_Combobox" combobox on "Data_Inputs_Accordion" accordion on "New_JobTemplate_Edit" wizard
        Then type value "" to "URL_Combobox" field on "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "URL_Combobox" element in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."V3IO_Path_Hint"
        Then select "S3" option in "URL_Combobox" combobox on "Data_Inputs_Accordion" accordion on "New_JobTemplate_Edit" wizard
        Then verify "URL_Combobox" element in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."S3_Path_Hint"
        Then select "Azure storage" option in "URL_Combobox" combobox on "Data_Inputs_Accordion" accordion on "New_JobTemplate_Edit" wizard
        Then verify "URL_Combobox" element in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Azure_Storage_Path_Hint"
        Then select "Google storage" option in "URL_Combobox" combobox on "Data_Inputs_Accordion" accordion on "New_JobTemplate_Edit" wizard
        Then verify "URL_Combobox" element in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."S3_Path_Hint"

    @passive
    Scenario: Verify behaviour of Data Inputs Table in Data Inputs Accordion on create New JobTemplate edit wizard
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        When expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        When select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        Then click on "Add_Input_Button" element in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "name1" to "Data_Inputs_Table_Name_Input" field on "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then select "V3IO" option in "URL_Combobox" combobox on "Data_Inputs_Accordion" accordion on "New_JobTemplate_Edit" wizard
        Then type value "container-name/file" to "URL_Combobox" field on "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then click on "Add_Row_Button" element in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then click on "Add_Input_Button" element in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "name1" to "Data_Inputs_Table_Name_Input" field on "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Data_Inputs_Table_Name_Input" element in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Name_Already_Exists"
        Then type value "name2" to "Data_Inputs_Table_Name_Input" field on "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then select "MLRun store" option in "URL_Combobox" combobox on "Data_Inputs_Accordion" accordion on "New_JobTemplate_Edit" wizard
        Then type value "artifacts/my-project/my-artifact" to "URL_Combobox" field on "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then click on "Add_Row_Button" element in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then click on "Add_Input_Button" element in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "name3" to "Data_Inputs_Table_Name_Input" field on "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then select "S3" option in "URL_Combobox" combobox on "Data_Inputs_Accordion" accordion on "New_JobTemplate_Edit" wizard
        Then type value "bucket/path" to "URL_Combobox" field on "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then click on "Add_Row_Button" element in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify values in "Data_Source_Input_Sources_Table" table in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
            | input_name_label  | path_label                               |
            | name1             | v3io:///container-name/file              |
            | name2             | store://artifacts/my-project/my-artifact |
            | name3             | s3://bucket/path                         |
        When click on "delete_btn" in "Data_Source_Input_Sources_Table" table in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard with offset "false"
            | input_name_label  | path_label                               |
            | name1             | v3io:///container-name/file              |
        Then verify values in "Data_Source_Input_Sources_Table" table in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
            | input_name_label  | path_label                               |
            | name2             | store://artifacts/my-project/my-artifact |
            | name3             | s3://bucket/path                         |

    @passive
    Scenario: verify mandatory elements in Parameters Accordion on Create New Jobs side panel
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        When expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        When select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        And wait load page
        Then verify "Job_Predefined_Parameters_Table" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Job_Custom_Parameters_Table" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Parameters_Additional_Settings_Input" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Result_Input" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Turning_Strategy_Dropdown" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "  " to "Parameters_Additional_Settings_Input" field on "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Turning_Strategy_Dropdown" element in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard should contains "Dropdown_Options"."Turning_Strategy_Options"
        Then verify "Criteria_Dropdown" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Criteria_Dropdown" element in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard should contains "Dropdown_Options"."Criteria_Dropdown_Options"

    @passive
    Scenario: Verify behaviour of Parameters Table in Resources Accordion on create New JobTemplate edit wizard
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        When expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        When select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Job_Custom_Parameters_Table" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When scroll and hover "Add_New_Row_Button" component in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When click on "Add_New_Row_Button" element in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Parameters_Table_Type_Dropdown" element in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard should contains "Dropdown_Options"."Parameters_Table_Type_Options"
        Then verify "Parameter_Table_Simple_Hyper_Dropdown" element in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard should contains "Dropdown_Options"."Parameter_Table_Simple_Hyper_Options"
        Then click on "Discard_New_Row_Button" element in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Job_Custom_Parameters_Table" table in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Parameters_Table_Name_Input | Parameters_Table_Type_Dropdown | Parameter_Table_Simple_Hyper_Dropdown | Parameters_Table_Value_Input | Apply_New_Row_Button |
            | name1                       | str                            | Simple                                | value1                       | yes                |
            | name2                       | int                            | Hyper                                 | value2                       | yes                |
            | name3                       | map                            | Simple                                | value3                       | yes                |
            | name4                       | bool                           | Hyper                                 | value4                       | yes                |
            | name5                       | str                            | Hyper                                 | value5                       | yes                |
            | name6                       | float                          | Simple                                | value6                       | yes                |
            | name7                       | map                            | Hyper                                 | value7                       | yes                |
            | name8                       | list                           | Simple                                | value8                       | yes                |
        Then verify values in "Job_Custom_Parameters_Table" table in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
            | name  | type  | simple_hyper | values  |
            | name1 | str   | Simple       | value1  |
            | name2 | int   | Hyper        | value2  |
            | name3 | map   | Simple       | value3  |
            | name4 | bool  | Hyper        | value4  |
            | name5 | str   | Hyper        | value5  |
            | name6 | float | Simple       | value6  |
            | name7 | map   | Hyper        | value7  |
            | name8 | list  | Simple       | value8  |
        When click on "delete_btn" in "Job_Custom_Parameters_Table" table in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard with offset "false"
            | name  |
            | name2 |
            | name4 |
            | name5 |
            | name8 |
        Then verify values in "Job_Custom_Parameters_Table" table in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
            | name  | type  | simple_hyper | values  |
            | name1 | str   | Simple       | value1  |
            | name3 | map   | Simple       | value3  |
            | name6 | float | Simple       | value6  |
            | name7 | map   | Hyper        | value7  |

    @passive
    Scenario: Verify behaviour of Volume Paths Table in Resources Accordion on create New JobTemplate edit wizard
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        When expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        When select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Container_Input | Volume_Paths_Table_Access_Key_Input | Volume_Paths_Table_Resource_Path_Input | Add_New_Row_Button |
            |             V3IO                 |                                      |                               |                                    |                                     |                                        |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Access_Key_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Input_Hint"."Mount_Path_Hint"
        Then verify "Volume_Paths_Table_Container_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Input_Hint"."Data_Container_Hint"
        Then verify "Volume_Paths_Table_Access_Key_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Input_Hint"."DataAccess_Key_Hint"
        Then verify "Volume_Paths_Table_Resource_Path_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Input_Hint"."Relative_Directory_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Config_Map_Input | Add_New_Row_Button |
            |           Config Map             |                                      |                               |                                     |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Config_Map_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Input_Hint"."Mount_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Secret_Name_Input | Add_New_Row_Button |
            |             Secret               |                                      |                               |                                      |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Config_Map_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Input_Hint"."Mount_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Claime_Name_Input | Add_New_Row_Button |
            |               PVC                |                                      |                               |                                      |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Claime_Name_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Input_Hint"."Mount_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Container_Input | Volume_Paths_Table_Access_Key_Input | Volume_Paths_Table_Resource_Path_Input | Add_New_Row_Button | Delete_New_Row_Button |
            |               V3IO               |            Volume_Name_1             |       /path/to/happines1      |         Container_Input_1          |           Access_Key_1              |            /resource/path_1            |         yes        |                       |
            |               V3IO               |            Volume_Name_2             |       /path/to/happines2      |         Container_Input_2          |           Access_Key_2              |            /resource/path_2            |                    |         yes           |
            |               V3IO               |            Volume_Name_3             |       /path/to/happines3      |         Container_Input_3          |           Access_Key_3              |            /resource/path_3            |         yes        |                       |
            |               V3IO               |            Volume_Name_4             |       /path/to/happines4      |         Container_Input_4          |           Access_Key_4              |            /resource/path_4            |                    |         yes           |
            |               V3IO               |            Volume_Name_5             |       /path/to/happines5      |         Container_Input_5          |           Access_Key_5              |            /resource/path_5            |         yes        |                       |
            |               V3IO               |            Volume_Name_6             |       /path/to/happines6      |         Container_Input_6          |           Access_Key_6              |            /resource/path_6            |                    |         yes           |
            |               V3IO               |            Volume_Name_7             |       /path/to/happines7      |         Container_Input_7          |           Access_Key_7              |            /resource/path_7            |         yes        |                       |
            |               V3IO               |            Volume_Name_8             |       /path/to/happines8      |         Container_Input_8          |           Access_Key_8              |            /resource/path_8            |                    |         yes           |
            |               V3IO               |            Volume_Name_9             |       /path/to/happines9      |         Container_Input_9          |           Access_Key_9              |            /resource/path_9            |                    |         yes           |
            |               V3IO               |            Volume_Name_0             |       /path/to/happines0      |         Container_Input_0          |           Access_Key_0              |            /resource/path_0            |         yes        |                       |
        Then verify values in "Volume_Paths_Table" table in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
            |  volume_name  |        path        |
            | Volume_Name_1 | /path/to/happines1 |
            | Volume_Name_3 | /path/to/happines3 |
            | Volume_Name_5 | /path/to/happines5 |
            | Volume_Name_7 | /path/to/happines7 |
            | Volume_Name_0 | /path/to/happines0 |
        When click on "Remove" in action menu in "Volume_Paths_Table" table in "Resources_Accordion" on "New_JobTemplate_Edit" wizard with offset "false"
            |  volume_name  |
            | Volume_Name_0 |
            | Volume_Name_3 |
        Then verify values in "Volume_Paths_Table" table in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
            |  volume_name  |        path        |
            | Volume_Name_1 | /path/to/happines1 |
            | Volume_Name_5 | /path/to/happines5 |
            | Volume_Name_7 | /path/to/happines7 |

    @passive
    Scenario: Verify behaviour of Node Selector Table in Resources Accordion on create New JobTemplate edit wizard
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        When expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        When select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Resources_Node_Selector_Table" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        When add rows to "Resources_Node_Selector_Table" table in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
            | key_input | value_input |
            | key1      | value1      |
            | key2      | value2      |
            | key3      | value3      |
            | key4      | value4      |
        Then verify values in "Resources_Node_Selector_Table" table in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
            | key  | value  |
            | key1 | value1 |
            | key2 | value2 |
            | key3 | value3 |
            | key4 | value4 |
        When click on "delete_btn" in "Resources_Node_Selector_Table" table in "Resources_Accordion" on "New_JobTemplate_Edit" wizard with offset "false"
            | key  |
            | key1 |
            | key3 |
        Then verify values in "Resources_Node_Selector_Table" table in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
            | key  | value  |
            | key2 | value2 |
            | key4 | value4 |

    @passive
    Scenario: verify mandatory elements in Resources Accordion on Create New Jobs side panel
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        When expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        When select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        And wait load page
        Then verify "Volumes_Subheader" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Volumes_Subheader" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Label_Hint"."New_Job_Volumes"
        Then verify "Volume_Paths_Table" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Unit_Dropdown" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Unit_Dropdown" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should contains "Dropdown_Options"."Memory_Unit_Options"
        Then verify "Memory_Request_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "1" to "Memory_Request_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then increase value on 15 points in "Memory_Request_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then decrease value on 15 points in "Memory_Request_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "2" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then increase value on 15 points in "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then decrease value on 15 points in "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Unit_Dropdown" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Unit_Dropdown" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should contains "Dropdown_Options"."CPU_Unit_Options"
        Then verify "CPU_Request_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "3" to "CPU_Request_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then increase value on 15 points in "CPU_Request_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then decrease value on 15 points in "CPU_Request_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "4" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then increase value on 15 points in "CPU_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then decrease value on 15 points in "CPU_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "GPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "5" to "GPU_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then increase value on 15 points in "GPU_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then decrease value on 15 points in "GPU_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Resources_Node_Selector_Table" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard

    @passive
    Scenario: verify mandatory elements in Advanced Accordion on Create New Jobs side panel
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        When expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        When select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Advanced_Environment_Variables_Table" element visibility in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Advanced_Accordion" on "New_JobTemplate_Edit" wizard

    @passive
    @demo
    Scenario: verify mandatory elements in Advanced Accordion on Create New Jobs side panel in Demo mode
        Given open url
        And wait load page
        And turn on demo mode
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        When expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        When select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Advanced_Environment_Variables_Demo_Table" element visibility in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Advanced_Secrets_Table" element visibility in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Advanced_Accordion" on "New_JobTemplate_Edit" wizard

    @passive
    @inProgress
    Scenario: verify Advanced Environment Variables Table in Advanced Accordion on Create New Jobs side panel
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        And expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Advanced_Environment_Variables_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Environment_Variables_Name_Input | Environment_Variables_Value_Input | Add_Row_Button | Discard_Row_Button |
            |              name0               |              value0               |       yes      |                    |
            |              name1               |              value1               |                |        yes         |
            |              name2               |              value2               |       yes      |                    |
            |              name3               |              value3               |                |        yes         |
            |              name4               |              value4               |       yes      |                    |
            |              name5               |              value5               |       yes      |                    |
            |              name6               |              value6               |                |        yes         |
            |              name7               |              value7               |                |        yes         |
            |              name8               |              value8               |       yes      |                    |
            |              name9               |              value9               |                |        yes         |
        Then verify values in "Advanced_Environment_Variables_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
            | name  |    value    |
            | name0 | value0      |
            | name2 | value2      |
            | name4 | value4      |
            | name5 | value5      |
            | name8 | value8      |
        When click on "delete_btn" in "Advanced_Environment_Variables_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard with offset "false"
            | name  |
            | name2 |
            | name4 |
            | name8 |
        Then verify values in "Advanced_Environment_Variables_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
            | name  |    value    |
            | name0 | value0      |
            | name5 | value5      |

    @passive
    @inProgress
    @demo
    Scenario: verify Advanced Environment Variables Table in Advanced Accordion on Create New Jobs side panel
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And turn on demo mode
        And wait load page
        And click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        And expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Advanced_Environment_Variables_Demo_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Environment_Variables_Demo_Name_Input | Environment_Variables_Type_Dropdown | Environment_Variables_Demo_Value_Input | Add_Row_Button |
            |                                  |               Value                 |                                   |       yes      |
        Then verify "Environment_Variables_Demo_Name_Input" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Environment_Variables_Demo_Value_Input" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        When click on "Discard_Row_Button" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Advanced_Environment_Variables_Demo_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Environment_Variables_Demo_Name_Input | Environment_Variables_Type_Dropdown | Environment_Variables_Seret_Name_Input | Environment_Variables_Seret_Key_Input | Add_Row_Button |
            |                                  |              Secret                 |                                        |                 @#$                   |       yes      |
        Then verify "Environment_Variables_Demo_Name_Input" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Environment_Variables_Seret_Name_Input" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Environment_Variables_Seret_Name_Input" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Input_Hint"."SECRET_INPUT_HINT"
        Then verify "Environment_Variables_Seret_Key_Input" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "Environment_Variables_Seret_Key_Input" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Input_Hint"."VALUE_INPUT_HINT"
        When click on "Discard_Row_Button" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Advanced_Environment_Variables_Demo_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Environment_Variables_Demo_Name_Input | Environment_Variables_Type_Dropdown | Environment_Variables_Demo_Value_Input | Add_Row_Button | Discard_Row_Button |
            |              name0               |                Value                |              value0               |       yes      |                    |
            |              name1               |                Value                |              value1               |                |        yes         |
            |              name2               |                Value                |              value2               |       yes      |                    |
            |              name3               |                Value                |              value3               |                |        yes         |
            |              name4               |                Value                |              value4               |       yes      |                    |
            |              name5               |                Value                |              value5               |       yes      |                    |
            |              name6               |                Value                |              value6               |                |        yes         |
            |              name7               |                Value                |              value7               |                |        yes         |
            |              name8               |                Value                |              value8               |       yes      |                    |
            |              name9               |                Value                |              value9               |                |        yes         |
        When add new volume rows to "Advanced_Environment_Variables_Demo_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Environment_Variables_Demo_Name_Input | Environment_Variables_Type_Dropdown | Environment_Variables_Seret_Name_Input | Environment_Variables_Seret_Key_Input | Add_Row_Button | Discard_Row_Button |
            |            name0                 |             Secret                  |               value0                   |                key0                   |                |        yes         |
            |            name1                 |             Secret                  |               value1                   |                key1                   |       yes      |                    |
            |            name2                 |             Secret                  |               value2                   |                key2                   |                |        yes         |
            |            name3                 |             Secret                  |               value3                   |                key3                   |       yes      |                    |
            |            name4                 |             Secret                  |               value4                   |                key4                   |                |        yes         |
            |            name5                 |             Secret                  |               value5                   |                key5                   |                |        yes         |
            |            name6                 |             Secret                  |               value6                   |                key6                   |       yes      |                    |
            |            name7                 |             Secret                  |               value7                   |                key7                   |       yes      |                    |
            |            name8                 |             Secret                  |               value8                   |                key8                   |                |        yes         |
            |            name9                 |             Secret                  |               value9                   |                key9                   |       yes      |                    |
        Then verify values in "Advanced_Environment_Variables_Demo_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
            | name  |  type  |    value    |
            | name0 | value  | value0      |
            | name2 | value  | value2      |
            | name4 | value  | value4      |
            | name5 | value  | value5      |
            | name8 | value  | value8      |
            | name1 | secret | value1:key1 |
            | name3 | secret | value3:key3 |
            | name6 | secret | value6:key6 |
            | name7 | secret | value7:key7 |
            | name9 | secret | value9:key9 |
        When click on "Remove" in action menu in "Function_Environment_Variables_Demo_Table" table in "Environment_Variables_Accordion" on "New_Function" wizard with offset "false"
            | name  |
            | name2 |
            | name4 |
            | name8 |
            | name1 |
            | name9 |
        Then verify values in "Function_Environment_Variables_Demo_Table" table in "Environment_Variables_Accordion" on "New_Function" wizard
            | name  |  type  |    value    |
            | name0 | value  | value0      |
            | name5 | value  | value5      |
            | name3 | secret | value3:key3 |
            | name6 | secret | value6:key6 |
        When add rows to "Advanced_Secrets_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
            | value_input |
            |    value1   |
            |    value2   |
            |    value3   |
        Then verify values in "Advanced_Secrets_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
            | kind | value  |
            | file | value1 |
            | file | value2 |
            | file | value3 |
        When click on "delete_btn" in "Advanced_Secrets_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard with offset "false"
            | value  |
            | value3 |
            | value1 |
        Then verify values in "Advanced_Secrets_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
            | kind | value  |
            | file | value2 |

    @passive
    @inProgress
    Scenario: verify non-unique value input hint on Create New Jobs side panel
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        And expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Job_Custom_Parameters_Table" table in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Parameters_Table_Name_Input | Parameters_Table_Type_Dropdown | Parameter_Table_Simple_Hyper_Dropdown | Parameters_Table_Value_Input | Apply_New_Row_Button |
            | name1                       | str                            | Simple                                | value1                       | yes                  |
            | name1                       | int                            | Hyper                                 | value2                       | yes                  |
        Then verify "Parameters_Table_Name_Input" element in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Name_Already_Exists"
        When collapse "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Container_Input | Volume_Paths_Table_Access_Key_Input | Volume_Paths_Table_Resource_Path_Input | Add_New_Row_Button | Delete_New_Row_Button |
            |               V3IO               |            Volume_Name_1             |       /path/to/happines1      |         Container_Input_1          |           Access_Key_1              |            /resource/path_1            |         yes        |                       |
            |               V3IO               |            Volume_Name_1             |       /path/to/happines1      |         Container_Input_1          |           Access_Key_1              |            /resource/path_1            |         yes        |                       |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Name_Already_Exists"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Volumes_Path_Already_Exists"
        When collapse "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Advanced_Environment_Variables_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Environment_Variables_Name_Input | Environment_Variables_Value_Input | Add_Row_Button | Discard_Row_Button |
            |              name0               |              value0               |       yes      |                    |
            |              name0               |              value0               |       yes      |                    |
        Then verify "Environment_Variables_Name_Input" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Name_Already_Exists"

    Scenario: Run New Job from template
        * set tear-down property "project" created with "automation-test-name-1100" value
        * create "automation-test-name-1100" MLRun Project with code 201
        Given open url
        And wait load page
        And click on row root with value "automation-test-name-1100" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        And wait load page
        And wait load page
        And expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        Then click on "Name_Edit_Button" element on "New_JobTemplate_Edit" wizard
        Then type value "demo_Job_00" to "Job_Name_Input" field on "New_JobTemplate_Edit" wizard
        When scroll and hover "Run_Now_Button" component on "New_JobTemplate_Edit" wizard
        Then click on "Run_Now_Button" element on "New_JobTemplate_Edit" wizard
        Then check "demo_Job_00" value in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard

    @passive
    Scenario: Verify View YAML action on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then select "View YAML" option in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table at row with "test-m_ingest" value in "name" column
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
        When click on "Cross_Cancel_Button" element on "View_YAML" wizard
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then select "View YAML" option in action menu on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

    @passive
    Scenario: Verify View YAML action on Workflows Monitor tab
        Given open url
        And turn on demo mode
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
        Then select "View YAML" option in action menu on "Workflows_Monitor_Tab" wizard in "Workflows_Monitor_Table" table at row with "churn-project-admin-main 2021-08-29 19-52-08" value in "name" column
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

    @passive
    Scenario: Verify View YAML action on Schedule Monitor tab
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
        Then select "View YAML" option in action menu on "ML_Function_Info_Pane" wizard
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

    @passive
    Scenario: Check all mandatory components on Workflow List View
        Given open url
        And turn on demo mode
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
        Then click on "Toggle_View_Button" element on "Workflows_Monitor_Tab" wizard
        Then verify "Workflow_List_View_Table" element visibility on "Workflows_Monitor_Tab" wizard

    @passive
    Scenario: Check all mandatory components on Overview tab Item infopane on Workflow List View Tab
        Given open url
        And turn on demo mode
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
        When click on cell with row index 1 in "name" column in "Workflow_List_View_Table" table on "Workflows_Monitor_Tab" wizard
        Then verify "Arrow_Back" element visibility on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Header" element visibility on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Updated" element visibility on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" element visibility on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Tab_List"
        Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Overview_Headers" on "Workflows_Monitor_Tab_Info_Pane" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Overview_Headers"

    @passive
    Scenario: Check all mandatory components on Logs tab Item infopane on Workflow List View Tab
        Given open url
        And turn on demo mode
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
        When click on cell with row index 1 in "name" column in "Workflow_List_View_Table" table on "Workflows_Monitor_Tab" wizard
        And select "Logs" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Logs" tab is active in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Logs_Text_container" element visibility on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Logs_Refresh_Button" element visibility on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then "Logs_Refresh_Button" element on "Workflows_Monitor_Tab_Info_Pane" should contains "Refresh" value

    @passive
    Scenario: Check all mandatory components on Inputs tab Item infopane on Workflow List View Tab
        Given open url
        And turn on demo mode
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
        And select "Inputs" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Inputs_Table" element visibility on "Inputs_Info_Pane" wizard

    @passive
    Scenario: Check all mandatory components on Artifacts tab Item infopane on Workflow List View Tab
        Given open url
        And turn on demo mode
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
        And select "Artifacts" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Artifacts_Table" element visibility on "Artifacts_Info_Pane" wizard

    @passive
    Scenario: Check all mandatory components on Results tab Item infopane on Workflow List View Tab
        Given open url
        And turn on demo mode
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
        And select "Results" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Results_Table" element visibility on "Results_Info_Pane" wizard

    @passive
    Scenario: Verify all mandatory component on Re-run Workflow sidebar
        Given open url
        And turn on demo mode
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
        Then select "Re-run" option in action menu on "Workflows_Monitor_Tab" wizard in "Workflow_List_View_Table" table at row with "test-classifier" value in "name" column
        And wait load page
        Then verify "Data_Source_Input_Sources_Table" element visibility in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Default_Input_Path_Input" element visibility in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Default_Artifact_Path_Input" element visibility in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Job_Custom_Parameters_Table" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Parameters_Additional_Settings_Input" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Result_Input" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Turning_Strategy_Dropdown" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Criteria_Dropdown" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Volume_Paths_Table" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Resources_Node_Selector_Table" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Unit_Dropdown" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Request_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Unit_Dropdown" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Request_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "GPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Advanced_Environment_Variables_Demo_Table" element visibility in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Schedule_For_Later_Button" element visibility on "New_JobTemplate_Edit" wizard
        Then "Schedule_For_Later_Button" element on "New_JobTemplate_Edit" should contains "Schedule for later" value
        Then verify "Run_Now_Button" element visibility on "New_JobTemplate_Edit" wizard
        Then "Run_Now_Button" element on "New_JobTemplate_Edit" should contains "Run now" value

    @passive
    Scenario: Check Artifacts preview action on Artifacts tab Item infopane on Workflow List View Tab
        Given open url
        And turn on demo mode
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
        When click on cell with row index 3 in "name" column in "Workflow_List_View_Table" table on "Workflows_Monitor_Tab" wizard
        And select "Artifacts" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then click on cell with row index 1 in "name" column in "Artifacts_Table" table on "Artifacts_Info_Pane" wizard
        Then click on "Artifact_Preview_Button" element on "Artifacts_Info_Pane" wizard
        Then verify "Preview_Header" element visibility on "Artifact_Preview_Popup" wizard
        Then verify "Cross_Cancel_Button" element visibility on "Artifact_Preview_Popup" wizard

    @passive
    Scenario: Check options in action menu on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "cat-vs-dog-classification" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then select "Past year" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then verify options in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table with "Error" value in "status" column should contains "Jobs_And_Workflows"."Job_Action_Menu_Options"
        Then verify options in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table with "Deploying" value in "status" column should contains "Jobs_And_Workflows"."Pending_Job_Action_Menu_Options"
        Then verify options in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table with "Pending" value in "status" column should contains "Jobs_And_Workflows"."Pending_Job_Action_Menu_Options"
        Then verify options in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table with "Completed" value in "status" column should contains "Jobs_And_Workflows"."Job_Action_Menu_Options"

    @passive
    Scenario: Check options in action menu on Workflows Monitor tab
        Given open url
        And turn on demo mode
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
        Then verify options in action menu on "Workflows_Monitor_Tab" wizard in "Workflows_Monitor_Table" table with "Succeeded" value in "status" column should contains "Jobs_And_Workflows"."Workflows_Action_Menu_Options"

    @passive
    Scenario: Check options in action menu on Schedule tab
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
        Then verify options in action menu on "Schedule_Monitor_Tab" wizard in "Schedule_Monitor_Table" table with "Job" value in "type" column should contains "Jobs_And_Workflows"."Schedule_Action_Menu_Options"

    @passive
    Scenario: Verify all mandatory component on Edit Scheduled Job sidebar
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
        Then verify "Data_Source_Input_Sources_Table" element visibility in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Default_Input_Path_Input" element visibility in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Default_Artifact_Path_Input" element visibility in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Job_Custom_Parameters_Table" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Parameters_Additional_Settings_Input" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Result_Input" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Turning_Strategy_Dropdown" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Criteria_Dropdown" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Volume_Paths_Table" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Resources_Node_Selector_Table" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Unit_Dropdown" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Request_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Unit_Dropdown" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Request_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "GPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Advanced_Environment_Variables_Table" element visibility in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Schedule_For_Later_Button" element visibility on "New_JobTemplate_Edit" wizard
        Then "Schedule_For_Later_Button" element on "New_JobTemplate_Edit" should contains "Schedule for later" value
        Then verify "Run_Now_Button" element visibility on "New_JobTemplate_Edit" wizard
        Then "Run_Now_Button" element on "New_JobTemplate_Edit" should contains "Save" value

    @passive
    Scenario: Check all mandatory components on Workflow graph View
        Given open url
        And turn on demo mode
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
        Then verify arrow lines position on "Workflow_Graph" on "Workflows_Monitor_Tab" wizard
        When click on node with index 1 in "Workflow_Graph" graph on "Workflows_Monitor_Tab" wizard
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

    @passive
    @links
    Scenario: Check redirect to project`s Function Infopane from Job Overview
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on cell with value "aggregate-test" in "name" column in "Jobs_And_Workflows" table on "Project" wizard
        And wait load page
        Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard
        And save to context "link" column and "href" attributes row where header "key" is "Function" from "Overview_Headers" table on "Jobs_Monitor_Tab_Info_Pane" wizard
        When click on "link" value where option is "Function" in "Overview_Headers" on "Jobs_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify "key" values "Name,Hash" values from "Overview_Headers" on "ML_Function_Info_Pane" with "cell" context value
        Then compare current browser URL with test "href" context value
