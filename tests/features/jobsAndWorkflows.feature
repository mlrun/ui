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
        Then verify "Select_Function_From_Dropdown" element visibility in "Select_Functions_From" on "Create_Job" wizard
        Then verify "Collapse_Button" element visibility in "Functions_Template" on "Create_Job" wizard

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
