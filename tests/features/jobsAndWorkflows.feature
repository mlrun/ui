Feature: Jobs and workflows

    Testcases that verifies functionality on Jobs and Workflows Pages

    @passive
    Scenario: Check all mandatory components on Jobs Monitor tab
        Given open url
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then verify "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard should contains "Jobs_And_Workflows"."Tab_List"
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "New_Job_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Resource_Monitoring_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Expand_Rows_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Status_Filter_Dropdown" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Group_By_Name_Filter_Dropdown" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Labels_Filter_Input" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Start_Time_Filter_Dropdown" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Jobs_Monitor_Table" element visibility on "Jobs_Monitor_Tab" wizard

    @passive
    Scenario: Check all mandatory components on Workflows Monitor tab
        Given open url
        And turn on demo mode
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
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
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
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
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
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
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        When pick up "Custom range" from "03/31/2014 10:30" to "03/21/2015 19:15" in "Date_Time_Picker" via "Start_Time_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        Then verify from "03/31/2014 10:30" to "03/21/2015 19:15" filter band in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        When pick up "Custom range" from "03/31/2044 10:30" to "03/21/2015 19:15" in "Date_Time_Picker" via "Start_Time_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        Then verify error mesege in "Date_Time_Picker" on "Jobs_Monitor_Tab" wizard with value "Date_Time_Picker"."Error_Message"
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        When pick up "Custom range" from "03/31/2030 10:30" to "03/31/2030 10:30" in "Date_Time_Picker" via "Start_Time_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        Then verify from "03/31/2030 10:30" to "03/31/2030 10:30" filter band in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        When pick up "Custom range" from "03/31/2025 10:31" to "03/21/2025 10:30" in "Date_Time_Picker" via "Start_Time_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        Then verify error mesege in "Date_Time_Picker" on "Jobs_Monitor_Tab" wizard with value "Date_Time_Picker"."Error_Message"

    @passive
    Scenario: verify filtering by job name on Jobs Monitor tab
        Given open url
        And wait load page
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then type value "ing" to "Table_Name_Filter_Input" field on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then value in "name" column with "text" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "ing"

    @passive
    @inProgress
    Scenario: verify filtering by job name on Schedule Monitor tab
        Given open url
        And wait load page
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And select "Schedule" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Schedule" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then type value "test" to "Table_Name_Filter_Input" field on "Schedule_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Schedule_Monitor_Tab" wizard
        And wait load page
        Then value in "name" column with "text" in "Schedule_Monitor_Table" on "Schedule_Monitor_Tab" wizard should contains "test"
#    TO DO: should be implemented mock requests for filters

    @passive
    Scenario: verify filtering by job label with key on Jobs Monitor tab
        Given open url
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then type value "host" to "Table_Labels_Filter_Input" field on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then value in "labels" column with "dropdowns" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "host"
        Then type value "host=test-m-ingest-lw42t" to "Table_Labels_Filter_Input" field on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        Then value in "labels" column with "dropdowns" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "host=test-m-ingest-lw42t"

    @passive
    @inProgress
    Scenario: verify filtering by job label with key on Jobs Monitor tab
        Given open url
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
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
#    TO DO: should be implemented mock requests for filters

    @passive
    @inProgress
    Scenario: verify filtering by starttime on Jobs Monitor tab
        Given open url
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        When pick up "Custom range" from "07/09/2021 00:00" to "07/10/2021 00:00" in "Date_Time_Picker" via "Start_Time_Filter_Dropdown" on "Jobs_Monitor_Tab" wizard
        Then verify from "07/09/2021 00:00" to "07/10/2021 00:00" filter band in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then value in "datetime" column in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should be from "07/09/2021 00:00" to "07/10/2021 00:00"

    @passive
    Scenario: verify mandatory elements starttime on Jobs Monitor tab
        Given open url
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
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
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        When type searchable fragment "server" into "Search_Input" on "Create_Job" wizard
        Then searchable fragment "server" should be in every sugested option into "Search_Input" on "Create_Job" wizard
        Then value in "name" column with "text" in "Selected_Functions_Templates" in "Select_Functions_From_Accordion" on "Create_Job" wizard should contains "server"
        When expand each row in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        Then subtable column "templates_list" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard should contains "server" in "name" column

    @passive
    Scenario: Check all mandatory components in Item infopane on Overview tab table on Jobs Monitor Page
        Given open url
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
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
    Scenario: Check all mandatory components in Item infopane on Overview tab table on Schedule Page
        Given open url
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
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
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And select "Schedule" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then verify "Schedule" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then select "Delete" option in action menu on "Schedule_Monitor_Tab" wizard in "Schedule_Monitor_Table" table at row with "clean-data" value in "name" column
        Then verify if "Delete_Scheduled_Job_Popup" popup dialog appears
        Then "Description" component on "Delete_Scheduled_Job_Popup" should contains "Descriptions"."Delete_Scheduled_Job"
        Then verify "Cancel_Button" element visibility on "Delete_Scheduled_Job_Popup" wizard
        Then verify "Delete_Button" element visibility on "Delete_Scheduled_Job_Popup" wizard

    @passive
    Scenario: verify mandatory elements on Create New Jobs side panel except accordions
        Given open url
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        When expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        When select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        Then click on "Name_Edit_Button" element on "New_JobTemplate_Edit" wizard
        Then verify "Job_Name_Input" on "New_JobTemplate_Edit" wizard should display "Input_Hint"."Jobs_Name_Hint"
        Then verify "Job_Name_Input" according hint rules on "New_JobTemplate_Edit" wizard
        Then type value "" to "Job_Name_Input" field on "New_JobTemplate_Edit" wizard
        Then verify "Job_Name_Input" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then type value "   " to "Job_Name_Input" field on "New_JobTemplate_Edit" wizard
        Then verify "Job_Name_Input" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Shedule_For_Later_Button" element visibility on "New_JobTemplate_Edit" wizard
        Then verify "Run_Now_Button" element visibility on "New_JobTemplate_Edit" wizard

    @passive
    Scenario: verify mandatory elements in Data Inputs Accordion on Create New Jobs side panel
        Given open url
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        When expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        When select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        Then verify "Default_Input_Path_Input" element visibility in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Default_Artifact_Path_Input" element visibility in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard

    @passive
    Scenario: verify mandatory elements in Parameters Accordion on Create New Jobs side panel
        Given open url
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
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
        Then verify "Turning_Stratedgy_Dropdown" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Criteria_Dropdown" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard

    @passive
    Scenario: Verify behaviour of Volume Paths Table in Resources Accordion on create New JobTemplate edit wizard
        Given open url
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        When expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        When select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Container_Input | Volume_Paths_Table_Access_Key_Input | Volume_Paths_Table_Resource_Path_Input | Add_New_Row_Button |
            |             V3IO                 |                                      |                               |                                    |                                     |                                        |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Access_Key_Input" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Input_Hint"."Moumt_Path_Hint"
        Then verify "Volume_Paths_Table_Container_Input" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Input_Hint"."Data_Container_Hint"
        Then verify "Volume_Paths_Table_Access_Key_Input" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Input_Hint"."DataAccess_Key_Hint"
        Then verify "Volume_Paths_Table_Resource_Path_Input" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Input_Hint"."Relative_Directory_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Config_Map_Input | Add_New_Row_Button |
            |           Config Map             |                                      |                               |                                     |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Config_Map_Input" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Input_Hint"."Moumt_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Secret_Name_Input | Add_New_Row_Button |
            |             Secret               |                                      |                               |                                      |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Config_Map_Input" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Input_Hint"."Moumt_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Claime_Name_Input | Add_New_Row_Button |
            |               PVC                |                                      |                               |                                      |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Claime_Name_Input" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Input_Hint"."Moumt_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
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
        Then verify values in "Volume_Paths_Table" table in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
            |  volume_name  |        path        |
            | Volume_Name_1 | /path/to/happines1 |
            | Volume_Name_3 | /path/to/happines3 |
            | Volume_Name_5 | /path/to/happines5 |
            | Volume_Name_7 | /path/to/happines7 |
            | Volume_Name_0 | /path/to/happines0 |
        When click on "Remove" in action menu in "Volume_Paths_Table" table in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard with offset "false"
            |  volume_name  |
            | Volume_Name_0 |
            | Volume_Name_3 |
        Then verify values in "Volume_Paths_Table" table in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
            |  volume_name  |        path        |
            | Volume_Name_1 | /path/to/happines1 |
            | Volume_Name_5 | /path/to/happines5 |
            | Volume_Name_7 | /path/to/happines7 |

    @passive
    Scenario: verify mandatory elements in Resouces Accordion on Create New Jobs side panel
        Given open url
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        When expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        When select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Volumes_Subheader" element visibility in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Volumes_Subheader" element in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Label_Hint"."New_Job_Volumes"
        Then verify "Volume_Paths_Table" element visibility in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Unit_Dropdown" element visibility in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Request_Number_Input" element visibility in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "1" to "Memory_Request_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then increase value on 15 points in "Memory_Request_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then decrease value on 15 points in "Memory_Request_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Limit_Number_Input" element visibility in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "2" to "Memory_Limit_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then increase value on 15 points in "Memory_Limit_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then decrease value on 15 points in "Memory_Limit_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Unit_Dropdown" element visibility in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Request_Number_Input" element visibility in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "3" to "CPU_Request_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then increase value on 15 points in "CPU_Request_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then decrease value on 15 points in "CPU_Request_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Limit_Number_Input" element visibility in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "4" to "CPU_Limit_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then increase value on 15 points in "CPU_Limit_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then decrease value on 15 points in "CPU_Limit_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "GPU_Limit_Number_Input" element visibility in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "5" to "GPU_Limit_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then increase value on 15 points in "GPU_Limit_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then decrease value on 15 points in "GPU_Limit_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Resources_Node_Selector_Table" element visibility in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard

    @passive
    Scenario: verify mandatory elements in Advanced Accordion on Create New Jobs side panel
        Given open url
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        When expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        When select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Advanced_Secrets_Table" element visibility in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Advanced_Accordion" on "New_JobTemplate_Edit" wizard

    @passive
    @demo
    Scenario: verify mandatory elements in Advanced Accordion on Create New Jobs side panel in Demo mode
        Given open url
        And wait load page
        And turn on demo mode
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
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
        When collapse "Advanced_Accordion" on "New_JobTemplate_Edit" wizard

    @passive
    @inProgress
    Scenario: verify Advanced Environment Variables Table in Advanced Accordion on Create New Jobs side panel
        Given open url
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        And expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
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
    @failed
    @demo
    Scenario: verify Advanced Environment Variables Table in Advanced Accordion on Create New Jobs side panel
        Given open url
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
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
            | Environment_Variables_Name_Input | Environment_Variables_Type_Dropdown | Environment_Variables_Value_Input | Add_Row_Button |
            |                                  |               Value                 |                                   |       yes      |
        Then verify "Environment_Variables_Name_Input" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Environment_Variables_Value_Input" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        When click on "Discard_Row_Button" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Advanced_Environment_Variables_Demo_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Environment_Variables_Name_Input | Environment_Variables_Type_Dropdown | Environment_Variables_Seret_Name_Input | Environment_Variables_Seret_Key_Input | Add_Row_Button |
            |                                  |              Secret                 |                                        |                 @#$                   |       yes      |
        Then verify "Environment_Variables_Name_Input" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Environment_Variables_Seret_Name_Input" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Environment_Variables_Seret_Name_Input" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Input_Hint"."SECRET_INPUT_HINT"
        Then verify "Environment_Variables_Seret_Key_Input" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "Environment_Variables_Seret_Key_Input" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard should display hint "Input_Hint"."VALUE_INPUT_HINT"
        When click on "Discard_Row_Button" element in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        When add new volume rows to "Advanced_Environment_Variables_Demo_Table" table in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard using nontable inputs
            | Environment_Variables_Name_Input | Environment_Variables_Type_Dropdown | Environment_Variables_Value_Input | Add_Row_Button | Discard_Row_Button |
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
            | Environment_Variables_Name_Input | Environment_Variables_Type_Dropdown | Environment_Variables_Seret_Name_Input | Environment_Variables_Seret_Key_Input | Add_Row_Button | Discard_Row_Button |
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

    @passive
    Scenario: Verify View YAML action on Jobs Monitor tab
        Given open url
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then select "Past month" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then select "View YAML" option in action menu on "Jobs_Monitor_Tab" wizard in "Jobs_Monitor_Table" table at row with "test-m_ingest" value in "name" column
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

    @passive
    Scenario: Verify View YAML action on Workflows Monitor tab
        Given open url
        And turn on demo mode
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
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
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And select "Schedule" tab in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then select "View YAML" option in action menu on "Schedule_Monitor_Tab" wizard in "Schedule_Monitor_Table" table at row with "clean-data" value in "name" column
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
