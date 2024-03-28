Feature: Jobs and workflows

    Testcases that verifies functionality on Jobs and Workflows Pages

    @MLJW
    @passive
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
        Then verify "Batch_Run_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then "Batch_Run_Button" element on "Jobs_Monitor_Tab" should contains "Batch Run" value
        Then verify "Resource_Monitoring_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Status_Filter_Dropdown" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown element on "Jobs_Monitor_Tab" wizard should contains "Dropdown_Options"."Status_Filter_Options"
        Then verify "Table_Name_Filter_Input" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Labels_Filter_Input" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Start_Time_Filter_Dropdown" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Start_Time_Filter_Dropdown" dropdown element on "Jobs_Monitor_Tab" wizard should contains "Dropdown_Options"."Start_Time_Filter_Options"
        When select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        And wait load page
        Then verify "Jobs_Monitor_Table" element visibility on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        And wait load page
        And wait load page
        Then verify "Jobs_Monitor_Table" element visibility on "Jobs_Monitor_Tab" wizard

    @MLJW
    @passive
    Scenario: MLJW002 - Check all mandatory components on Workflows Monitor tab
        Given open url
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
        Then verify "Workflows_Monitor_Table" element visibility on "Workflows_Monitor_Tab" wizard

    @MLJW
    @passive
    Scenario: MLJW003 - Check all mandatory components on Schedule Monitor tab
        Given open url
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
        Then verify "Table_Labels_Filter_Input" element visibility on "Schedule_Monitor_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Schedule_Monitor_Tab" wizard
        Then verify "Schedule_Monitor_Table" element visibility on "Schedule_Monitor_Tab" wizard

    @MLJW
    @passive
    Scenario: MLJW004 - Check date picker dropdown options on Jobs Monitor tab
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
        Then verify "Past leap year" filter band in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        When select "Custom range" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then verify "Date_Time_Picker" element visibility on "Jobs_Monitor_Tab" wizard

    @MLJW
    @passive
    Scenario: MLJW005 - Verify date picker element on Jobs Monitor tab
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

    @MLJW
    @passive
    Scenario: MLJW006 - Verify filtering by job name on Jobs Monitor tab
        Given open url
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

    @MLJW
    @passive
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
    Scenario: MLJW009 - Verify filtering by job label with key on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "cat-vs-dog-classification" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        When select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then type value "author" to "Table_Labels_Filter_Input" field on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then value in "labels" column with "dropdowns" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "author"
        Then type value "mlrun/schedule-name=tf2-serving" to "Table_Labels_Filter_Input" field on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then value in "labels" column with "dropdowns" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "mlrun/schedule-name=tf2-serving"
        Then type value "123456" to "Table_Labels_Filter_Input" field on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard

    @MLJW
    @passive
    @inProgress
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
        Then type value "v3io_user" to "Table_Labels_Filter_Input" field on "Schedule_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Schedule_Monitor_Tab" wizard
        And wait load page
        Then value in "labels" column with "dropdowns" in "Schedule_Monitor_Table" on "Schedule_Monitor_Tab" wizard should contains "v3io_user"
        Then type value "v3io_user=admin" to "Table_Labels_Filter_Input" field on "Schedule_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Schedule_Monitor_Tab" wizard
        And wait load page
        Then value in "labels" column with "dropdowns" in "Schedule_Monitor_Table" on "Schedule_Monitor_Tab" wizard should contains "v3io_user=admin"

    @MLJW
    @passive
    Scenario: MLJW011 - Verify filtering by job status on Jobs Monitor tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        When pick up "Custom range" from "09/03/2021 00:00" to "09/04/2021 00:00" in "Date_Time_Picker" via "Start_Time_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        Then verify from "09/03/2021 00:00" to "09/04/2021 00:00" filter band in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then select "Completed" option in "Status_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then value in "status" column with "tooltip" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "Completed"
        Then select "Error" option in "Status_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then value in "status" column with "tooltip" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "Error"
        When pick up "Custom range" from "09/08/2021 00:00" to "09/09/2021 00:00" in "Date_Time_Picker" via "Start_Time_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        Then verify from "09/08/2021 00:00" to "09/09/2021 00:00" filter band in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then select "Pending" option in "Status_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then value in "status" column with "tooltip" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "Pending"

    @MLJW
    @passive
    Scenario: MLJW062 - Verify filtering Jobs after opening Batch Re-run wizard
        Given open url
        And wait load page
        And click on row root with value "cat-vs-dog-classification" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then type value "seff" to "Table_Name_Filter_Input" field on "Jobs_Monitor_Tab" wizard
        Then type value "kind" to "Table_Labels_Filter_Input" field on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
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
        Then "Auto_Refresh_Checkbox" element should be checked on "Jobs_Monitor_Tab" wizard
        Then uncheck "Auto_Refresh_Checkbox" element on "Jobs_Monitor_Tab" wizard
        Then "Auto_Refresh_Checkbox" element should be unchecked on "Jobs_Monitor_Tab" wizard
        When pick up "Custom range" from "11/07/2021 18:00" to "11/08/2021 18:00" in "Date_Time_Picker" via "Start_Time_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        Then verify from "11/07/2021 18:00" to "11/08/2021 18:00" filter band in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then value in "datetime" column in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should be from "11/07/2021 18:00" to "11/08/2021 18:00"

    @oldJobWizard
    Scenario: Prior implementation - verify mandatory elements starttime on Jobs Monitor tab
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

    @oldJobWizard
    Scenario: Prior implementation - verify mandatory elements starttime on Jobs Monitor tab
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

    @MLJW
    @passive
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
        When select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        When pick up "Custom range" from "01/01/2021 00:00" to "01/01/2023 00:00" in "Date_Time_Picker" via "Start_Time_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        Then verify from "01/01/2021 00:00" to "01/01/2023 00:00" filter band in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
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
        Then click on "Arrow_Back" element on "Jobs_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify from "01/01/2021 00:00" to "01/01/2023 00:00" filter band in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then click on "Arrow_Back" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify from "01/01/2021 00:00" to "01/01/2023 00:00" filter band in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard

    @MLJW
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
        When select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify options in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table with "Job" value in "type" column should contains "Jobs_And_Workflows"."Job_Action_Menu_Options"
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
        When select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then select "Delete" option in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table at row with "test-m_ingest" value in "name" column
        And wait load page
        Then verify if "Delete_Confirm_Popup" popup dialog appears
        Then "Title" element on "Delete_Confirm_Popup" should contains "Delete job?" value
        Then verify "Cross_Cancel_Button" element visibility on "Delete_Confirm_Popup" wizard
        Then verify "Confirm_Dialog_Message" element visibility on "Delete_Confirm_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Delete_Confirm_Popup" wizard
        Then "Cancel_Button" element on "Delete_Confirm_Popup" should contains "Cancel" value
        Then verify "Delete_Button" element visibility on "Delete_Confirm_Popup" wizard
        Then "Delete_Button" element on "Delete_Confirm_Popup" should contains "Delete" value
        When click on "Cancel_Button" element on "Delete_Confirm_Popup" wizard
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify options in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table with "Job" value in "type" column should contains "Jobs_And_Workflows"."Job_Action_Menu_Options"
        Then select "Delete" option in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table at row with "1b1097f5e1bf439f82b61910f03368ae" value in "name" column
        And wait load page
        Then verify if "Delete_Confirm_Popup" popup dialog appears
        Then "Title" element on "Delete_Confirm_Popup" should contains "Delete job?" value
        Then verify "Cross_Cancel_Button" element visibility on "Delete_Confirm_Popup" wizard
        Then verify "Confirm_Dialog_Message" element visibility on "Delete_Confirm_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Delete_Confirm_Popup" wizard
        Then "Cancel_Button" element on "Delete_Confirm_Popup" should contains "Cancel" value
        Then verify "Delete_Button" element visibility on "Delete_Confirm_Popup" wizard
        Then "Delete_Button" element on "Delete_Confirm_Popup" should contains "Delete" value
        When click on "Cancel_Button" element on "Delete_Confirm_Popup" wizard
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Action_Menu" dropdown element on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "Jobs_And_Workflows"."Job_Overview_Action_Menu_Options"
        Then select "Delete" option in action menu on "Jobs_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify if "Delete_Confirm_Popup" popup dialog appears
        Then "Title" element on "Delete_Confirm_Popup" should contains "Delete job?" value
        Then verify "Cross_Cancel_Button" element visibility on "Delete_Confirm_Popup" wizard
        Then verify "Confirm_Dialog_Message" element visibility on "Delete_Confirm_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Delete_Confirm_Popup" wizard
        Then "Cancel_Button" element on "Delete_Confirm_Popup" should contains "Cancel" value
        Then verify "Delete_Button" element visibility on "Delete_Confirm_Popup" wizard
        Then "Delete_Button" element on "Delete_Confirm_Popup" should contains "Delete" value
        When click on "Cancel_Button" element on "Delete_Confirm_Popup" wizard
        
    @MLJW
    @passive
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
        When select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then select "Completed" option in "Status_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Schedule_Monitor_Table" table on "Schedule_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        And select "Logs" tab in "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Logs" tab is active in "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Logs_Text_container" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Logs_Refresh_Button" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard

    @MLJW
    @passive
    Scenario: MLJW065 - Check all mandatory components in Item infopane on Artifacts tab on Jobs Monitor Page
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        When select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        When click on cell with value "trainer-train" in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        And select "Artifacts" tab in "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Artifacts_Table" element visibility on "Artifacts_Info_Pane" wizard
        When click on "sorter_icon" in "Artifacts_Table" table on "Artifacts_Info_Pane" wizard with sorters
        And wait load page
        And select "Artifacts" tab in "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then click on cell with row index 1 in "name" column in "Artifacts_Table" table on "Artifacts_Info_Pane" wizard
        Then click on "Artifact_Preview_Button" element on "Artifacts_Info_Pane" wizard
        And wait load page
        Then verify "Preview_Header" element visibility on "Artifact_Preview_Popup" wizard
        Then verify "Cross_Cancel_Button" element visibility on "Artifact_Preview_Popup" wizard
        Then click on "Cross_Cancel_Button" element on "Artifact_Preview_Popup" wizard
        And wait load page
        Then verify "Iterations_Dropdown" element visibility on "Artifacts_Info_Pane" wizard
        Then select "1" option in "Iterations_Dropdown" dropdown on "Artifacts_Info_Pane" wizard
        And wait load page
        Then verify "Artifacts_Table" element visibility on "Artifacts_Info_Pane" wizard
        Then click on cell with row index 1 in "name" column in "Artifacts_Table" table on "Artifacts_Info_Pane" wizard
        Then click on "Artifact_Preview_Button" element on "Artifacts_Info_Pane" wizard
        Then verify "Preview_Header" element visibility on "Artifact_Preview_Popup" wizard
        Then click on "Cross_Cancel_Button" element on "Artifact_Preview_Popup" wizard
        Then select "2" option in "Iterations_Dropdown" dropdown on "Artifacts_Info_Pane" wizard
        And wait load page
        Then verify "Artifacts_Table" element visibility on "Artifacts_Info_Pane" wizard

    @MLJW
    @passive
    Scenario: MLJW066 - Check all mandatory components in Item infopane on Overview tab table on Schedule Page
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

    @MLJW
    @passive
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

    @MLJW
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

    @oldJobWizard
    Scenario: Prior implementation - verify mandatory elements on Create New Jobs side panel except accordions
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
        Then type value " " to "Job_Name_Input" field on "New_JobTemplate_Edit" wizard
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

    @oldJobWizard
    Scenario: Prior implementation - verify mandatory elements in Data Inputs Accordion on Create New Jobs side panel
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

    @oldJobWizard
    Scenario: Prior implementation - verify behaviour of Combobox element on Create New Jobs wizard on Data Inputs Accordion
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
        When type value "artifacts/churn-project-admin/raw-data" to "URL_Combobox" field on "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then searchable fragment "raw-data" should be in every suggested option into "URL_Combobox" combobox input in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then select "V3IO" option in "URL_Combobox" combobox on "Data_Inputs_Accordion" accordion on "New_JobTemplate_Edit" wizard
        Then type value "" to "URL_Combobox" field on "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "URL_Combobox" element in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."V3IO_Path_Hint"
        Then select "S3" option in "URL_Combobox" combobox on "Data_Inputs_Accordion" accordion on "New_JobTemplate_Edit" wizard
        Then verify "URL_Combobox" element in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."S3_Path_Hint"
        Then select "Azure storage" option in "URL_Combobox" combobox on "Data_Inputs_Accordion" accordion on "New_JobTemplate_Edit" wizard
        Then verify "URL_Combobox" element in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Azure_Storage_Path_Hint"
        Then select "Google storage" option in "URL_Combobox" combobox on "Data_Inputs_Accordion" accordion on "New_JobTemplate_Edit" wizard
        Then verify "URL_Combobox" element in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."S3_Path_Hint"

    @oldJobWizard
    Scenario: Prior implementation - verify behaviour of Data Inputs Table in Data Inputs Accordion on create New JobTemplate edit wizard
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
        When click on "input_name_label" in "Data_Source_Input_Sources_Table" table in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard with offset "false"
            | input_name_label  |
            | name2             |
        Then type value "edited_name2" to "Edit_Data_Inputs_Table_Name_Input" field on "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "artifacts/my-project/edited-artifact" to "URL_Combobox" field on "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then click on "Apply_Edit_Button" element in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When click on "input_name_label" in "Data_Source_Input_Sources_Table" table in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard with offset "false"
            | input_name_label  |
            | name3             |
        Then type value "edited_name3" to "Edit_Data_Inputs_Table_Name_Input" field on "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "artifacts/my-project/edited-artifact3" to "URL_Combobox" field on "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then click on "Apply_Edit_Button" element in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify values in "Data_Source_Input_Sources_Table" table in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
            | input_name_label         | path_label                                    |
            | edited_name2             | store://artifacts/my-project/edited-artifact  |
            | edited_name3             | s3://artifacts/my-project/edited-artifact3    |

    @oldJobWizard
    Scenario: Prior implementation - verify mandatory elements in Parameters Accordion on Create New Jobs side panel
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

    @oldJobWizard
    Scenario: Prior implementation - verify behaviour of Parameters Table in Resources Accordion on create New JobTemplate edit wizard
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
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
            #| name7                       | map                            | Hyper                                 | value7                       | yes                |
            | name8                       | list                           | Simple                                | value8                       | yes                |
        Then verify values in "Job_Custom_Parameters_Table" table in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
            | name  | type  | simple_hyper | values  |
            | name1 | str   | Simple       | value1  |
            | name2 | int   | Hyper        | value2  |
            | name3 | map   | Simple       | value3  |
            | name4 | bool  | Hyper        | value4  |
            | name5 | str   | Hyper        | value5  |
            | name6 | float | Simple       | value6  |
            #| name7 | map   | Hyper        | value7  |
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
            #| name7 | map   | Hyper        | value7  |
        When click on "name" in "Job_Custom_Parameters_Table" table in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard with offset "false"
            | name  |
            | name1 |
        Then type value "edited_name1" to "Edit_Parameters_Table_Name_Input" field on "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then select "Hyper" option in "Edit_Parameter_Table_Simple_Hyper_Dropdown" dropdown on "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "editedValue1" to "Edit_Parameters_Table_Value_Input" field on "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then click on "Apply_Edit_Button" element in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When click on "name" in "Job_Custom_Parameters_Table" table in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard with offset "false"
            | name  |
            | name6 |
        Then type value "edited_name6" to "Edit_Parameters_Table_Name_Input" field on "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then select "Simple" option in "Edit_Parameter_Table_Simple_Hyper_Dropdown" dropdown on "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "editedValue6" to "Edit_Parameters_Table_Value_Input" field on "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then click on "Apply_Edit_Button" element in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify values in "Job_Custom_Parameters_Table" table in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
            | name         | type  | simple_hyper | values        |
            | edited_name1 | str   | Hyper        | editedValue1  |
            | name3        | map   | Simple       | value3        |
            #| name6        | float | Simple       | value6        |
            | edited_name6 | float   | Simple       | editedValue6  |

    @oldJobWizard
    Scenario: Prior implementation - verify behaviour of Volume Paths Table in Resources Accordion on create New JobTemplate edit wizard
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
        When click on "Edit" in action menu in "Volume_Paths_Table" table in "Resources_Accordion" on "New_JobTemplate_Edit" wizard with offset "false"
            |  volume_name  |
            | Volume_Name_1 |
        Then type value "Edited_Name_1" to "Edit_Volume_Name_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "/newPath/to/happines1" to "Edit_Volume_Path_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then click on "Apply_Edit_Button" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        When click on "Edit" in action menu in "Volume_Paths_Table" table in "Resources_Accordion" on "New_JobTemplate_Edit" wizard with offset "false"
            |  volume_name  |
            | Volume_Name_5 |
        Then type value "Edited_Name_5" to "Edit_Volume_Name_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "/newPath/to/happines5" to "Edit_Volume_Path_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then click on "Apply_Edit_Button" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify values in "Volume_Paths_Table" table in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
            |  volume_name  |        path           |
            | Edited_Name_1 | /newPath/to/happines1 |
            | Edited_Name_5 | /newPath/to/happines5 |
            | Volume_Name_7 | /path/to/happines7    |

    @oldJobWizard
    Scenario: Prior implementation - verify behaviour of Node Selector Table in Resources Accordion on create New JobTemplate edit wizard
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
        When add rows to "Resources_Node_Selector_Table" key-value table in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
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
            | key3 |
            | key1 |
        Then verify values in "Resources_Node_Selector_Table" table in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
            | key  | value  |
            | key2 | value2 |
            | key4 | value4 |
        Then edit 1 row in "Resources_Node_Selector_Table" key-value table in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
            | key_input        | value_input      |
            | edited           | edited           |
        Then edit 2 row in "Resources_Node_Selector_Table" key-value table in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
            | key_input        | value_input      |
            | edited           | edited           |
        Then verify values in "Resources_Node_Selector_Table" table in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
            | key        | value        |
            | key2edited | value2edited |
            | key4edited | value4edited |
    
    @oldJobWizard
    Scenario: Prior implementation - verify mandatory elements in Resources Accordion on Create New Jobs side panel
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
        Then verify "Pods_Priority_Dropdown" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Pods_Priority_Dropdown" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should contains "Dropdown_Options"."Pods_Priority"
        Then verify "Pods_Toleration_Dropdown" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard - Pods_Toleration is deleted from implementation
        Then verify "Pods_Toleration_Dropdown" dropdown in "Resources_Accordion" on "New_JobTemplate_Edit" wizard selected option value "Prevent"
        Then verify "Pods_Toleration_Dropdown" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should contains "Dropdown_Options"."Pods_Toleration"
        Then select "Allow" option in "Pods_Toleration_Dropdown" dropdown on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Pods_Toleration_Dropdown" dropdown in "Resources_Accordion" on "New_JobTemplate_Edit" wizard selected option value "Allow"
        Then select "Constrain" option in "Pods_Toleration_Dropdown" dropdown on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Pods_Toleration_Dropdown" dropdown in "Resources_Accordion" on "New_JobTemplate_Edit" wizard selected option value "Constrain"
        Then verify "Volumes_Subheader" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Volumes_Subheader" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Label_Hint"."New_Job_Volumes"
        Then verify "Volume_Paths_Table" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Request_Dropdown" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Request_Dropdown" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should contains "Dropdown_Options"."Memory_Unit_Options"
        Then verify "Memory_Limit_Dropdown" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Limit_Dropdown" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should contains "Dropdown_Options"."Memory_Unit_Options"
        Then verify "Memory_Request_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "0" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Limit_Number_Warning"
        Then type value "1" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "1025" to "Memory_Request_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Limit_Number_Warning"
        Then verify "Memory_Request_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Request_Number_Warning"
        Then type value "2" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then select "KB" option in "Memory_Limit_Dropdown" dropdown on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Limit_Number_Warning"
        Then verify "Memory_Request_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Request_Number_Warning"
        Then select "KB" option in "Memory_Request_Dropdown" dropdown on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then type value "2" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then select "GB" option in "Memory_Request_Dropdown" dropdown on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Limit_Number_Warning"
        Then verify "Memory_Request_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Request_Number_Warning"
        Then verify "CPU_Request_Dropdown" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Request_Dropdown" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should contains "Dropdown_Options"."CPU_Unit_Options"
        Then verify "CPU_Limit_Dropdown" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Limit_Dropdown" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should contains "Dropdown_Options"."CPU_Unit_Options"
        Then select "millicpu" option in "CPU_Limit_Dropdown" dropdown on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then select "millicpu" option in "CPU_Request_Dropdown" dropdown on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "0" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Limit_Number_Warning"
        Then type value "1" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "1025" to "CPU_Request_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Limit_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Limit_Number_Warning"
        Then verify "CPU_Request_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Request_Number_Warning"
        Then type value "0" to "GPU_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "GPU_Limit_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."GPU_Minimum_Value_Warning"
        Then verify "Memory_Request_Dropdown" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Request_Dropdown" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should contains "Dropdown_Options"."Memory_Unit_Options"
        Then verify "Memory_Request_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "1" to "Memory_Request_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then increase value on 15 points in "Memory_Request_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then decrease value on 15 points in "Memory_Request_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Limit_Dropdown" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Limit_Dropdown" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should contains "Dropdown_Options"."Memory_Unit_Options"
        Then verify "Memory_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "2" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then increase value on 15 points in "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then decrease value on 15 points in "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Request_Dropdown" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Request_Dropdown" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should contains "Dropdown_Options"."CPU_Unit_Options"
        Then verify "CPU_Request_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "3" to "CPU_Request_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then increase value on 15 points in "CPU_Request_Number_Input" field with "millicpu" on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then decrease value on 15 points in "CPU_Request_Number_Input" field with "millicpu" on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then select "cpu" option in "CPU_Request_Dropdown" dropdown on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Request_Number_Input" input should contains "0.003" value in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then increase value on 8 points in "CPU_Request_Number_Input" field with "cpu" on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then decrease value on 8 points in "CPU_Request_Number_Input" field with "cpu" on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Limit_Dropdown" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Limit_Dropdown" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should contains "Dropdown_Options"."CPU_Unit_Options"
        Then verify "CPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "4" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then increase value on 15 points in "CPU_Limit_Number_Input" field with "millicpu" on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then decrease value on 15 points in "CPU_Limit_Number_Input" field with "millicpu" on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then select "cpu" option in "CPU_Limit_Dropdown" dropdown on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Limit_Number_Input" input should contains "0.004" value in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then increase value on 8 points in "CPU_Request_Number_Input" field with "cpu" on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then decrease value on 8 points in "CPU_Request_Number_Input" field with "cpu" on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "GPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "5" to "GPU_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then increase value on 15 points in "GPU_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then decrease value on 15 points in "GPU_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard

    @oldJobWizard
    Scenario: Prior implementation - verify mandatory elements in Advanced Accordion on Create New Jobs side panel
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

    @oldJobWizard
    Scenario: Prior implementation - verify mandatory elements in Advanced Accordion on Create New Jobs side panel in Demo mode
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

    @oldJobWizard
    Scenario: Prior implementation - verify Advanced Environment Variables Table in Advanced Accordion on Create New Jobs side panel
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
            | name8 |
            | name4 |
            | name2 |
        Then verify values in "Advanced_Environment_Variables_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
            | name  |    value    |
            | name0 | value0      |
            | name5 | value5      |
        Then edit 1 row in "Advanced_Environment_Variables_Table" key-value table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
            | name_input        | value_input      |
            | edited            | edited           |
        Then edit 2 row in "Advanced_Environment_Variables_Table" key-value table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
            | name_input        | value_input      |
            | edited            | edited           |
        Then verify values in "Advanced_Environment_Variables_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
            | name        |    value          |
            | name0edited | value0edited      |
            | name5edited | value5edited      |

    @oldJobWizard
    Scenario: Prior implementation - verify Advanced Environment Variables Table in Advanced Accordion on Create New Jobs side panel
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
        When click on "Demo_Discard_Row_Button" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Advanced_Environment_Variables_Demo_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Environment_Variables_Demo_Name_Input | Environment_Variables_Type_Dropdown | Environment_Variables_Secret_Name_Input | Environment_Variables_Secret_Key_Input | Add_Row_Button |
            |                                  |              Secret                 |                                        |                 @#$                   |       yes      |
        Then verify "Environment_Variables_Demo_Name_Input" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Environment_Variables_Secret_Name_Input" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Environment_Variables_Secret_Name_Input" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Input_Hint"."SECRET_INPUT_HINT"
        Then verify "Environment_Variables_Secret_Key_Input" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "Environment_Variables_Secret_Key_Input" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Input_Hint"."VALUE_INPUT_HINT"
        When click on "Demo_Discard_Row_Button" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Advanced_Environment_Variables_Demo_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Environment_Variables_Demo_Name_Input | Environment_Variables_Type_Dropdown | Environment_Variables_Demo_Value_Input | Add_Row_Button | Demo_Discard_Row_Button |
            |              name0                    |                Value                |              value0                    |       yes      |                         |
            |              name1                    |                Value                |              value1                    |                |        yes              |
            |              name2                    |                Value                |              value2                    |       yes      |                         |
            |              name3                    |                Value                |              value3                    |                |        yes              |
            |              name4                    |                Value                |              value4                    |       yes      |                         |
            |              name5                    |                Value                |              value5                    |       yes      |                         |
            |              name6                    |                Value                |              value6                    |                |        yes              |
            |              name7                    |                Value                |              value7                    |                |        yes              |
            |              name8                    |                Value                |              value8                    |       yes      |                         |
            |              name9                    |                Value                |              value9                    |                |        yes              |
        When add new volume rows to "Advanced_Environment_Variables_Demo_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Environment_Variables_Demo_Name_Input | Environment_Variables_Type_Dropdown | Environment_Variables_Secret_Name_Input | Environment_Variables_Secret_Key_Input | Add_Row_Button | Demo_Discard_Row_Button |
            |            name0                      |             Secret                  |               value0                   |                key0                   |                |        yes              |
            |            name1                      |             Secret                  |               value1                   |                key1                   |       yes      |                         |
            |            name2                      |             Secret                  |               value2                   |                key2                   |                |        yes              |
            |            name3                      |             Secret                  |               value3                   |                key3                   |       yes      |                         |
            |            name4                      |             Secret                  |               value4                   |                key4                   |                |        yes              |
            |            name5                      |             Secret                  |               value5                   |                key5                   |                |        yes              |
            |            name6                      |             Secret                  |               value6                   |                key6                   |       yes      |                         |
            |            name7                      |             Secret                  |               value7                   |                key7                   |       yes      |                         |
            |            name8                      |             Secret                  |               value8                   |                key8                   |                |        yes              |
            |            name9                      |             Secret                  |               value9                   |                key9                   |       yes      |                         |
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
        When click on "Remove" in action menu in "Advanced_Environment_Variables_Demo_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard with offset "false"
            | name  |
            | name2 |
            | name4 |
            | name8 |
            | name1 |
            | name9 |
        Then verify values in "Advanced_Environment_Variables_Demo_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
            | name  |  type  |    value    |
            | name0 | value  | value0      |
            | name5 | value  | value5      |
            | name3 | secret | value3:key3 |
            | name6 | secret | value6:key6 |
        When click on "Edit" in action menu in "Advanced_Environment_Variables_Demo_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard with offset "false"
            | name  |
            | name5 |
        Then type value "Edited_Name_5" to "Edit_Environment_Variables_Demo_Name_Input" field on "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "Edited_Value_5" to "Edit_Environment_Variables_Demo_Value_Input" field on "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        Then click on "Apply_Edit_Button" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        When click on "Edit" in action menu in "Advanced_Environment_Variables_Demo_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard with offset "false"
            | name  |
            | name0 |
        Then type value "Edited_Name_0" to "Edit_Environment_Variables_Demo_Name_Input" field on "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        Then select "Secret" option in "Edit_Environment_Variables_Type_Dropdown" dropdown on "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "editedValue0" to "Edit_Environment_Variables_Secret_Name_Input" field on "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "editedKey0" to "Edit_Environment_Variables_Secret_Key_Input" field on "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        Then click on "Apply_Edit_Button" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify values in "Advanced_Environment_Variables_Demo_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
            | name          |  type  |    value                 |
            | Edited_Name_0 | secret | editedValue0:editedKey0  |
            | Edited_Name_5 | value  | Edited_Value_5           |
            | name3         | secret | value3:key3              |
            | name6         | secret | value6:key6              |
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
        Then edit 1 row in "Advanced_Secrets_Table" key-value table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
            | value_input       |
            | edited            |
        Then verify values in "Advanced_Secrets_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
            | kind        |    value          |
            | file        | value2edited      |

    @oldJobWizard
    Scenario: Prior implementation - verify non-unique value input hint on Create New Jobs side panel
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

    @oldJobWizard
    Scenario: Prior implementation - run New Job from template
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
        And expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        Then click on "Name_Edit_Button" element on "New_JobTemplate_Edit" wizard
        Then type value "demo_job_00" to "Job_Name_Input" field on "New_JobTemplate_Edit" wizard
        When collapse "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then select "High" option in "Pods_Priority_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        When scroll and hover "Run_Now_Button" component on "New_JobTemplate_Edit" wizard
        Then click on "Run_Now_Button" element on "New_JobTemplate_Edit" wizard
        Then check "demo_job_00" value in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        Then select "Re-run" option in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table at row with "demo_job_00" value in "name" column
        And wait load page
        When collapse "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Pods_Priority_Dropdown" dropdown in "Resources_Accordion" on "New_JobTemplate_Edit" wizard selected option value "High"
        Then select "Low" option in "Pods_Priority_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then verify "Pods_Priority_Dropdown" dropdown in "Resources_Accordion" on "New_Function" wizard selected option value "Low"
        Then select "Medium" option in "Pods_Priority_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then verify "Pods_Priority_Dropdown" dropdown in "Resources_Accordion" on "New_Function" wizard selected option value "Medium"

    @MLJW
    @passive
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
        Then select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then select "View YAML" option in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table at row with "test-m_ingest" value in "name" column
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
        When click on "Cross_Cancel_Button" element on "View_YAML" wizard
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then select "View YAML" option in action menu on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

    @MLJW
    @passive
    Scenario: MLJW069 - Verify View YAML action on Workflows Monitor tab
        Given open url
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
        Then select "View YAML" option in action menu on "ML_Function_Info_Pane" wizard
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

    @MLJW
    @passive
    Scenario: MLJW071 - Check all mandatory components on Workflow List View
        Given open url
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

    @MLJW 
    @passive
    Scenario: MLJW072 - Check all mandatory components on Overview tab Item infopane on Workflow List View Tab
        Given open url
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 2 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then click on "Toggle_View_Button" element on "Workflows_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 2 in "name" column in "Workflow_List_View_Table" table on "Workflows_Monitor_Tab" wizard
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
    Scenario: MLJW073 - Check all mandatory components on Logs tab Item infopane on Workflow List View Tab
        Given open url
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 2 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
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
    Scenario: MLJW074 - Check all mandatory components on Inputs tab Item infopane on Workflow List View Tab
        Given open url
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Monitor Workflows" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 2 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then click on "Toggle_View_Button" element on "Workflows_Monitor_Tab" wizard
        When click on cell with row index 2 in "name" column in "Workflow_List_View_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        And select "Inputs" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Inputs_Table" element visibility on "Inputs_Info_Pane" wizard

    @MLJW
    @passive
    Scenario: MLJW075 - Check all mandatory components on Artifacts tab Item infopane on Workflow List View Tab
        Given open url
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Monitor Workflows" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 2 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then click on "Toggle_View_Button" element on "Workflows_Monitor_Tab" wizard
        When click on cell with row index 2 in "name" column in "Workflow_List_View_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        And select "Artifacts" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Artifacts_Table" element visibility on "Artifacts_Info_Pane" wizard

    @MLJW
    @passive
    Scenario: MLJW076 - Check all mandatory components on Results tab Item infopane on Workflow List View Tab
        Given open url
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Monitor Workflows" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 2 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then click on "Toggle_View_Button" element on "Workflows_Monitor_Tab" wizard
        When click on cell with row index 4 in "name" column in "Workflow_List_View_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        And select "Results" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then verify "Results_Table" element visibility on "Results_Info_Pane" wizard

    @MLJW
    @passive
    Scenario: MLJW080 - Verify visibility of main components on Batch re-run Workflow wizard
        Given open url
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 2 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
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
    Scenario: MLJW082 - Check Artifacts preview action on Artifacts tab Item infopane on Workflow List View Tab
        Given open url
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Monitor Workflows" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 2 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then click on "Toggle_View_Button" element on "Workflows_Monitor_Tab" wizard
        When click on cell with row index 1 in "name" column in "Workflow_List_View_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        And select "Artifacts" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        Then click on cell with row index 1 in "name" column in "Artifacts_Table" table on "Artifacts_Info_Pane" wizard
        Then click on "Artifact_Preview_Button" element on "Artifacts_Info_Pane" wizard
        And wait load page
        Then verify "Preview_Header" element visibility on "Artifact_Preview_Popup" wizard
        Then verify "Cross_Cancel_Button" element visibility on "Artifact_Preview_Popup" wizard

    @MLJW
    @passive
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
        When pick up "Custom range" from "09/01/2021 18:00" to "09/03/2021 18:00" in "Date_Time_Picker" via "Start_Time_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        Then select "Error" option in "Status_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then verify options in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table with "Error" value in "status" column should contains "Jobs_And_Workflows"."Job_Action_Menu_Options"
        Then select "Running" option in "Status_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then verify options in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table with "Running" value in "status" column should contains "Jobs_And_Workflows"."Running_Job_Action_Menu_Options"
        When pick up "Custom range" from "08/28/2021 18:00" to "09/01/2021 18:00" in "Date_Time_Picker" via "Start_Time_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        Then select "Completed" option in "Status_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then verify options in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table with "Completed" value in "status" column should contains "Jobs_And_Workflows"."Job_Action_Menu_Options"
        Then select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then select "Pending" option in "Status_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then verify options in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table with "Pending" value in "status" column should contains "Jobs_And_Workflows"."Pending_Job_Action_Menu_Options"

    @MLJW
    @passive
    Scenario: MLJW077 - Check options in action menu on Workflows Monitor tab
        Given open url
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

    @MLJW
    @passive
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
    Scenario: MLJW081 - Check visibility of main components on Workflow graph View
        Given open url
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 2 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
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
    Scenario: MLJW030 - Check redirect to project`s Function Infopane from Job Overview
        Given open url
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
        Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Job started successfully" value
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
        When click on cell with value "test-m_ingest" in "name" column in "Jobs_And_Workflows" table on "Project" wizard
        And wait load page
        Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard
        And save to context "link" column and "href" attributes row where header "key" is "Function:" from "Overview_Headers" table on "Jobs_Monitor_Tab_Info_Pane" wizard
        When click on "link" value where option is "Function:" in "Overview_Headers" on "Jobs_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify "key" values "Hash:,Default handler:" values from "Overview_Headers" on "ML_Function_Info_Pane" with "link" context value with split
        Then compare current browser URL with test "href" context value
        Then click on "Cross_Close_Button" element on "ML_Function_Info_Pane" wizard
        Then select "Delete" option in action menu on "ML_Functions" wizard in "Functions_Table" table at row with "test-m_ingest" value in "name" column
        And wait load page
        Then "Title" element on "Common_Popup" should contains "Delete function?" value
        Then verify "Delete_Button" element visibility on "Common_Popup" wizard
        Then click on "Delete_Button" element on "Common_Popup" wizard
        And wait load page
        Then verify if "Notification_Popup" popup dialog appears
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Function deleted successfully" value
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on "Project_Monitoring_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        When click on cell with value "test-m_ingest" in "name" column in "Jobs_And_Workflows" table on "Project" wizard
        And wait load page
        When click on "link" value where option is "Function:" in "Overview_Headers" on "Jobs_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify redirection to "projects/churn-project-admin/functions"
        And wait load page
        Then verify if "Notification_Popup" popup dialog appears
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        Then "Notification_Pop_Up" element on "Notification_Popup" should contains "This function either does not exist or was deleted" value
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard


    @MLJW
    Scenario: MLJW083 - Check redirection to Last Run Drill-down from Schedules tab
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And select "Schedule" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then select "Run now" option in action menu on "Schedule_Monitor_Tab" wizard in "Schedule_Monitor_Table" table at row with "erann-test" value in "name" column
        And wait load page
        Then click on "Table_Refresh_Button" element on "Schedule_Monitor_Tab" wizard
        And wait load page
        And wait load page
        Then click on "Table_Refresh_Button" element on "Schedule_Monitor_Tab" wizard
        And wait load page
        Then save to context "lastRun" column and "href" attribute on 2 row from "Schedule_Monitor_Table" table on "Schedule_Monitor_Tab" wizard
        Then click on cell with row index 2 in "lastRun" column in "Schedule_Monitor_Table" table on "Schedule_Monitor_Tab" wizard
        And wait load page
        Then compare current browser URL with test "href" context value
        Then verify "Header" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then "Header" element on "Jobs_Monitor_Tab_Info_Pane" should contains "erann-test" value
        And select "Inputs" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
        And select "Artifacts" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
        And select "Results" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard

    @MLJW
    Scenario: MLJW084 - Check redirection to Function details from Schedules tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And select "Schedule" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then save to context "name" column and "href" attribute on 2 row from "Schedule_Monitor_Table" table on "Schedule_Monitor_Tab" wizard
        Then click on cell with row index 2 in "name" column in "Schedule_Monitor_Table" table on "Schedule_Monitor_Tab" wizard
        And wait load page
        And wait load page
        Then compare current browser URL with test "href" context value

    @oldJobWizard
    #@uniqueTag
    Scenario: Check messages when create a new Schedule
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Title" element visibility on "Modal_Wizard_Form" wizard
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Run" value
        And click on row root with value "clean-data" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "clean-data" value
        Then verify "Schedule_For_Later_Button" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Schedule_For_Later_Button" element on "Modal_Wizard_Form" wizard is enabled
        Then click on "Schedule_For_Later_Button" element on "Modal_Wizard_Form" wizard
        Then verify "Schedule_Button" element visibility in "Schedule_For_Later" on "New_JobTemplate_Edit" wizard
        Then verify "Schedule_Days_Dropdown" element visibility in "Schedule_For_Later" on "New_JobTemplate_Edit" wizard
        Then verify "Schedule_Time_Dropdown" element visibility in "Schedule_For_Later" on "New_JobTemplate_Edit" wizard
        Then verify "Schedule_Days_Dropdown" element in "Schedule_For_Later" on "New_JobTemplate_Edit" wizard should contains "Dropdown_Options"."Schedule_Variants"
        Then verify "Schedule_Time_Dropdown" element in "Schedule_For_Later" on "New_JobTemplate_Edit" wizard should contains "Dropdown_Options"."Schedule_Minutes_Variants"
        Then select "Hourly" option in "Schedule_Days_Dropdown" dropdown on "Schedule_For_Later" on "New_JobTemplate_Edit" wizard
        Then verify "Schedule_Time_Dropdown" element in "Schedule_For_Later" on "New_JobTemplate_Edit" wizard should contains "Dropdown_Options"."Schedule_Hours_Variants"
        * set tear-down property "schedule" created in "default" project with "aggregate" value
        Then click on "Schedule_Button" element in "Schedule_For_Later" on "New_JobTemplate_Edit" wizard
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        And expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        Then click on "Schedule_For_Later_Button" element on "New_JobTemplate_Edit" wizard
        Then click on "Schedule_Button" element in "Schedule_For_Later" on "New_JobTemplate_Edit" wizard
        Then "Error_Message" component on "New_JobTemplate_Edit" should contains "Error_Messages"."Already_Scheduled"

    @oldJobWizard
    Scenario: Verify behaviour of Method changing on Create New Job panel
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
        When select "feature-selection" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        Then collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then collapse "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then expand "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then select "High" option in "Pods_Priority_Dropdown" dropdown on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then select "Allow" option in "Pods_Toleration_Dropdown" dropdown on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "5" to "Memory_Request_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "10" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then select "millicpu" option in "CPU_Limit_Dropdown" dropdown on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then select "millicpu" option in "CPU_Request_Dropdown" dropdown on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "100" to "CPU_Request_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "1000" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "10" to "GPU_Limit_Number_Input" field on "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then select "plot_stat" option in "Job_Method_Dropdown" dropdown on "New_JobTemplate_Edit" wizard
        Then verify "Pods_Priority_Dropdown" dropdown in "Resources_Accordion" on "New_JobTemplate_Edit" wizard selected option value "Medium"
        Then verify "Pods_Toleration_Dropdown" dropdown in "Resources_Accordion" on "New_JobTemplate_Edit" wizard selected option value "Prevent"
        Then verify "Memory_Request_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard is disabled
        Then verify "Memory_Request_Number_Input" input should contains "" value in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard is disabled
        Then verify "Memory_Limit_Number_Input" input should contains "" value in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Request_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard is disabled
        Then verify "CPU_Request_Number_Input" input should contains "" value in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Limit_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard is disabled
        Then verify "CPU_Limit_Number_Input" input should contains "" value in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "GPU_Limit_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard is disabled
        Then verify "GPU_Limit_Number_Input" input should contains "" value in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Schedule_For_Later_Button" element on "New_JobTemplate_Edit" wizard is disabled
        Then verify "Run_Now_Button" element on "New_JobTemplate_Edit" wizard is disabled
        Then click on "Job_Method_Cancel" element on "New_JobTemplate_Edit" wizard
        Then verify "Pods_Priority_Dropdown" dropdown in "Resources_Accordion" on "New_JobTemplate_Edit" wizard selected option value "High"
        Then verify "Pods_Toleration_Dropdown" dropdown in "Resources_Accordion" on "New_JobTemplate_Edit" wizard selected option value "Allow"
        Then verify "Memory_Request_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard is enabled
        Then verify "Memory_Request_Number_Input" input should contains "5" value in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard is enabled
        Then verify "Memory_Limit_Number_Input" input should contains "10" value in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Request_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard is enabled
        Then verify "CPU_Request_Number_Input" input should contains "100" value in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Limit_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard is enabled
        Then verify "CPU_Limit_Number_Input" input should contains "1000" value in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "GPU_Limit_Number_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard is enabled
        Then verify "GPU_Limit_Number_Input" input should contains "10" value in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Schedule_For_Later_Button" element on "New_JobTemplate_Edit" wizard is enabled
        Then verify "Run_Now_Button" element on "New_JobTemplate_Edit" wizard is enabled
        Then select "plot_stat" option in "Job_Method_Dropdown" dropdown on "New_JobTemplate_Edit" wizard
        Then click on "Job_Method_Apply" element on "New_JobTemplate_Edit" wizard
        Then verify "Pods_Priority_Dropdown" dropdown in "Resources_Accordion" on "New_JobTemplate_Edit" wizard selected option value "Medium"
        Then verify "Pods_Toleration_Dropdown" dropdown in "Resources_Accordion" on "New_JobTemplate_Edit" wizard selected option value "Prevent"
        Then verify "CPU_Limit_Dropdown" dropdown in "Resources_Accordion" on "New_JobTemplate_Edit" wizard selected option value "cpu"
        Then verify "CPU_Request_Dropdown" dropdown in "Resources_Accordion" on "New_JobTemplate_Edit" wizard selected option value "cpu"
        Then verify "Memory_Request_Dropdown" dropdown in "Resources_Accordion" on "New_JobTemplate_Edit" wizard selected option value "MiB"
        Then verify "Memory_Limit_Dropdown" dropdown in "Resources_Accordion" on "New_JobTemplate_Edit" wizard selected option value "MiB"
        Then verify "Memory_Request_Number_Input" input should contains "" value in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Limit_Number_Input" input should contains "" value in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Request_Number_Input" input should contains "" value in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Limit_Number_Input" input should contains "" value in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "GPU_Limit_Number_Input" input should contains "" value in "Resources_Accordion" on "New_JobTemplate_Edit" wizard

    @MLJW
    Scenario: MLJW085 - Check broken link redirection on Monitor Jobs and Schedules screens
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Jobs and workflows" value in breadcrumbs menu
        And wait load page
        Then verify redirection from "projects/default/jobs/INVALID" to "projects/default/jobs/monitor-jobs"
        Then select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify redirection from "projects/default/jobs/INVALID" to "projects/default/jobs/monitor-jobs"
        Then select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify redirection from "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/INVALID" to "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/overview"
        Then select "Inputs" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify redirection from "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/INVALID" to "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/overview"
        Then select "Artifacts" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify redirection from "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/INVALID" to "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/overview"
        Then select "Results" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify redirection from "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/INVALID" to "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/overview"
        Then select "Logs" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify redirection from "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/INVALID" to "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/overview"
        Then select "Pods" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify redirection from "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/INVALID" to "projects/default/jobs/monitor-jobs/aggregate-test/864f4da42773494eb94dce1c8834feb6/overview"
        Then verify redirection from "projects/default/jobs/monitor-jobs/aggregate-test/INVALID/overview" to "projects/default/jobs/monitor-jobs"
        And select "Schedule" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify redirection from "projects/default/jobs/INVALID" to "projects/default/jobs/monitor-jobs"
        Then verify redirection from "projects/default/INVALID/monitor-jobs" to "projects"

    @MLJW
    #TODO: getPipelines func - update with 'create at' filter
    #TODO: Bug ML-5787 - The 'Created At' filter doesn't keep the selected type
    Scenario: MLJW086 - Check broken link redirection on Monitor Workflows and Schedules screens
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Jobs and workflows" value in breadcrumbs menu
        And wait load page
        Then select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify redirection from "projects/churn-project-admin/jobs/INVALID" to "projects/churn-project-admin/jobs/monitor-jobs"
        Then select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then verify redirection from "projects/churn-project-admin/jobs/monitor-workflows/workflow/INVALID" to "projects/churn-project-admin/jobs/monitor-workflows"
        When click on cell with row index 1 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        Then verify redirection from "projects/churn-project-admin/jobs/monitor-workflows/INVALID/eaae138e-439a-47fa-93c6-ba0fe1dc3b79" to "projects/churn-project-admin/jobs/monitor-jobs"
        Then select "Monitor Workflows" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 2 in "name" column in "Workflows_Monitor_Table" table on "Workflows_Monitor_Tab" wizard
        And wait load page
        When click on node with name "current-state" in "Workflow_Graph" graph on "Workflows_Monitor_Tab" wizard
        And wait load page
        Then verify redirection from "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/INVALID" to "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/overview"
        Then select "Inputs" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify redirection from "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/INVALID" to "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/overview"
        Then select "Artifacts" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify redirection from "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/INVALID" to "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/overview"
        Then select "Results" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify redirection from "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/INVALID" to "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/overview"
        Then select "Logs" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify redirection from "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/INVALID" to "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/overview"
        Then select "Pods" tab in "Info_Pane_Tab_Selector" on "Workflows_Monitor_Tab_Info_Pane" wizard
        And wait load page
        Then verify redirection from "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/INVALID" to "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/overview"
        Then verify redirection from "projects/churn-project-admin/jobs/monitor-workflows/workflow/INVALID/07f98fb46a424b2dbee5247b35f37727/overview" to "projects/churn-project-admin/jobs/monitor-workflows"
        Then verify redirection from "projects/churn-project-admin/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/INVALID/overview" to "projects/churn-project-admin/jobs/monitor-workflows"
        Then verify redirection from "projects/INVALID/jobs/monitor-workflows/workflow/eaae138e-439a-47fa-93c6-ba0fe1dc3b79/07f98fb46a424b2dbee5247b35f37727/overview" to "projects"

    @MLJW
    Scenario: MLJW012 - Check all mandatory components on Batch Run wizard - Function selection
        Given open url
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
        Then select "Utilities" option in "Category_Selector_Dropdown" filter dropdown on "Modal_Wizard_Form" wizard
        When click on "Apply_Button" element in "Filter_Dropdown" on "Modal_Wizard_Form" wizard
        And wait load page
        And click on "Title" element on "Modal_Wizard_Form" wizard
        Then value in "labels" column with "attribute" in "Functions_Table" on "Modal_Wizard_Form" wizard should contains "Utilities"
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
    Scenario: MLJW013 - Verify behaviour of Filter by category on Batch Run wizard - Function selection (Hub tab)
        Given open url
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
        Then select "Utilities" option in "Category_Selector_Dropdown" filter dropdown on "Modal_Wizard_Form" wizard
        When click on "Apply_Button" element in "Filter_Dropdown" on "Modal_Wizard_Form" wizard
        And wait load page
        And click on "Title" element on "Modal_Wizard_Form" wizard
        Then value in "labels" column with "attribute" in "Functions_Table" on "Modal_Wizard_Form" wizard should contains "Utilities"

    @MLJW
    Scenario: MLJW042 - Check all mandatory components on Batch Run wizard - Run Details without Method
        Given open url
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
    Scenario: MLJW044 - Check "Max Iterations", "Max errors" inputs field availability according to the strategy type in Hyperparameter strategy
        Given open url
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
    Scenario: MLJW051 - Check all mandatory components on Batch Run wizard - Run Details with Method
        Given open url
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
        Then verify labels warning should display options "Input_Hint"."Labels_Warning_Key"
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
    Scenario: MLJW053 - Check changing "Method" after "Hyperparameter" check in Run Details section of Batch Run
        Given open url
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
    Scenario: MLJW054 - Check "Image name" field in Run Details section of Batch Run
        Given open url
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
        Then verify "Image_Name_Input_Run_Details" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then "Image_Name_Text_Run_Details" component on "Modal_Wizard_Form" should contains "Modal_Wizard_Form"."Image_Name_Text"

    @MLJW
    Scenario: MLJW039 - Check all mandatory components on Batch Run wizard - Data Inputs
        Given open url
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
    Scenario: MLJW038 - Check all mandatory components on Batch Run wizard - Parameters
        Given open url
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
    Scenario: MLJW037 - Check all mandatory components on Batch Run wizard - Step 5 (Resources)
        Given open url
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
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Minimum_Value_Warning"
        Then type value "1" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then type value "1025" to "Memory_Request_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Limit_Number_Warning"
        Then verify "Memory_Request_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Request_Number_Warning"
        Then type value "2" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then select "KB" option in "Memory_Limit_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Limit_Number_Warning"
        Then verify "Memory_Request_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Request_Number_Warning"
        Then select "KB" option in "Memory_Request_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then type value "" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then type value "2" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then select "GB" option in "Memory_Request_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Limit_Number_Warning"
        Then verify "Memory_Request_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Request_Number_Warning"
        Then verify "CPU_Request_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Request_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."CPU_Unit_Options"
        Then verify "CPU_Limit_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."CPU_Unit_Options"
        Then select "millicpu" option in "CPU_Limit_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then select "millicpu" option in "CPU_Request_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then type value "0" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Minimum_Value_Warning"
        Then type value "1" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then type value "1025" to "CPU_Request_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Limit_Number_Warning" 
        Then verify "CPU_Request_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Request_Number_Warning" 
        Then type value "0" to "GPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "GPU_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."GPU_Minimum_Value_Warning"
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
    Scenario: MLJW043 - Check Batch-Run running after edit GPU limit in Resources section
        Given open url
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
    Scenario: MLJW025 - Check Minimum CPU value on Batch Run wizard - Resources
        Given open url
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
        Then verify "CPU_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Minimum_Value_Warning"
        Then type value "0" to "CPU_Request_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Request_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Minimum_Value_Warning"
        Then type value "-1" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Minimum_Value_Warning"
        Then type value "-1" to "CPU_Request_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Request_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Minimum_Value_Warning"
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
    Scenario: MLJW026 - Check tip and warning messages in Volumes section on Batch Run wizard - Resources
        Given open url
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
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Access_Key_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Mount_Path_Hint"
        Then verify "Volume_Paths_Table_Container_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Data_Container_Hint"
        Then verify "Volume_Paths_Table_Access_Key_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."DataAccess_Key_Hint"
        Then verify "Volume_Paths_Table_Resource_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Relative_Directory_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Config_Map_Input | Add_New_Row_Button |
            |           Config Map             |                                      |                               |                                     |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Config_Map_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Mount_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Secret_Name_Input | Add_New_Row_Button |
            |             Secret               |                                      |                               |                                      |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Secret_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Mount_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Claime_Name_Input | Add_New_Row_Button |
            |               PVC                |                                      |                               |                                      |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Claime_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Mount_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard

    @MLJW
    Scenario: MLJW031 - Check mandatory of Container and Resource Path fields for V3IO volume - Batch Run - Resources
        Given open url
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
    Scenario: MLJW033 - Check autocomplete without tags MLRun Store path for datasets, artifacts, models, feature vectors - Batch Run - Data input
        Given open url
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
    Scenario: MLJW034 - Check setting schedule for a job - Batch Run - Schedule for later 
        Given open url
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
    Scenario: MLJW035 - Check environment variables table types components on Batch Run in Advanced section
        Given open url
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
    Scenario: MLJW036 - Check setting schedule for a job - Batch Run - Schedule for later 
        Given open url
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
    Scenario: MLJW045 - Check back navigation from Job overview to Jobs Monitor tab and forward to Job overview
        Given open url
        And wait load page
        And click on row root with value "cat-vs-dog-classification" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        When select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        When click on cell with row index 1 in "name" column in "Jobs_Monitor_Table" table on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify redirection to "projects/cat-vs-dog-classification/jobs/monitor-jobs/sef/cf842616c89347c7bb7bca2c9e840a21/overview"
        Then verify "Info_Pane_Tab_Selector" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Tab_List"
        Then navigate back
        And wait load page
        Then verify redirection to "projects/cat-vs-dog-classification/jobs/monitor-jobs/sef"
        Then navigate back
        And wait load page
        Then verify redirection to "projects/cat-vs-dog-classification/jobs/monitor-jobs"
        Then navigate forward
        And wait load page
        Then verify redirection to "projects/cat-vs-dog-classification/jobs/monitor-jobs/sef"
        Then navigate forward
        And wait load page
        Then verify redirection to "projects/cat-vs-dog-classification/jobs/monitor-jobs/sef/cf842616c89347c7bb7bca2c9e840a21/overview"
        Then verify "Info_Pane_Tab_Selector" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Tab_List"

    @MLJW
    Scenario: MLJW046 - Check components in Parameters section on Batch Run wizard with checked Hyper
        Given open url
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