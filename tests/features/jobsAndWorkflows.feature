Feature: Jobs and workflows

    Tescases that verifies functionality on Jobs and Workflows Pages

    @passive
    Scenario: Check all mandatory components on Jobs Monitor tab
        Given open url
        And wait load page
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then verify "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard should contains "Jobs_And_Workflows"."Tab_List"
        Then verify "Monitor" tab is activ in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
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
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then type value "ea" to "Table_Name_Filter_Input" field on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        Then value in "name" column with "text" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "ea"

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
        Then value in "labels" column with "dropdowns" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "host"
        Then type value "host=describe-v6mwd" to "Table_Labels_Filter_Input" field on "Jobs_Monitor_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
        Then value in "labels" column with "dropdowns" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "host=describe-v6mwd"

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
        When type searchable fragment "server" into "Search_Input" on "Create_Job" wizard
        Then searchable fragment "server" should be in every sugested option into "Search_Input" on "Create_Job" wizard
        Then value in "name" column with "text" in "Selected_Functions_Templates" in "Select_Functions_From_Accordion" on "Create_Job" wizard should contains "server"
        When expand each row in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        Then subtable column "templates_list" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard should contains "server" in "name" column

    @passive
    Scenario: verify mandatory elements on Create New Jobs side panel except accordions
        Given open url
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
        When expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        When select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        Then click on "Name_Edit_Button" element on "New_JobTemplate_Edit" wizard
        Then verify "Job_Name_Input" on "New_JobTemplate_Edit" wizard should display "Input_Hint"."Feature_Set_Name_Hint"
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
    Scenario: verify mandatory elements in Resouces Accordion on Create New Jobs side panel
        Given open url
        And wait load page
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then click on "New_Job_Button" element on "Jobs_Monitor_Tab" wizard
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
        Then type value "0" to "Memory_Request_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then increase value on 15 points in "Memory_Request_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then decrease value on 15 points in "Memory_Request_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Limit_Number_Input" element visibility in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "1" to "Memory_Limit_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then increase value on 15 points in "Memory_Limit_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then decrease value on 15 points in "Memory_Limit_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Unit_Dropdown" element visibility in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Request_Number_Input" element visibility in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "2" to "CPU_Request_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then increase value on 15 points in "CPU_Request_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then decrease value on 15 points in "CPU_Request_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Limit_Number_Input" element visibility in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "3" to "CPU_Limit_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then increase value on 15 points in "CPU_Limit_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then decrease value on 15 points in "CPU_Limit_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "GPU_Limit_Number_Input" element visibility in "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
        Then type value "4" to "GPU_Limit_Number_Input" field on "Resouces_Accordion" on "New_JobTemplate_Edit" wizard
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
        When expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        When select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Advanced_Environment_Variables_Table" element visibility in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Advanced_Secrets_Table" element visibility in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
