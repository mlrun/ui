Feature: MLRun Project Page

    Testcases that verifies functionality on MLRun Project Page

    @passive
    @sanity
    Scenario: Check all mandatory components
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify breadcrumbs "project" label should be equal "default" value
        Then verify "Create_New" element visibility on "Project" wizard
        Then verify "Refresh_Button" element visibility on "Project" wizard
        Then verify "Dashboard_Realtime_Functions_Table" element visibility on "Project" wizard
        Then verify "Jobs_And_Workflows" element visibility on "Project" wizard
        Then verify "Mono_Values_Cards" element visibility on "Project" wizard
        Then verify "Jobs_Info_Card_Statistics" element visibility on "Project" wizard
        Then verify "Real_Time_Functions_Card_Statistics" element visibility on "Project" wizard
        When hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then verify "General_Info_Quick_Links" element visibility on "commonPagesHeader" wizard

    @passive
    @sanity
    Scenario: Check all mandatory components on demo mode
        * set tear-down property "project" created with "automation-test-1000" value
        * create "automation-test-1000" MLRun Project with code 201
        Given open url
        And click on row root with value "automation-test-1000" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then "Navigation_Bar" on "commonPagesHeader" wizard should be "pinned"
        Then verify "General_Info_Quick_Links" element visibility on "commonPagesHeader" wizard
        Then verify "Project_Settings_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Pin_Quick_linck_Button" element visibility on "commonPagesHeader" wizard
        Then click on "Pin_Quick_linck_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        Then verify "General_Info_Quick_Links" element invisibility on "commonPagesHeader" wizard
        Then verify "Project_Settings_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "Pin_Quick_linck_Button" element invisibility on "commonPagesHeader" wizard
        When hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then verify "General_Info_Quick_Links" element visibility on "commonPagesHeader" wizard
        Then verify "Project_Settings_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Pin_Quick_linck_Button" element visibility on "commonPagesHeader" wizard
        Then "Navigation_Bar" on "commonPagesHeader" wizard should not be "pinned"

    @passive
    @sanity
    @demo
    Scenario: Check all mandatory components on demo mode
        * set tear-down property "project" created with "automation-test-1001" value
        * create "automation-test-1001" MLRun Project with code 201
        Given open url
        * turn on demo mode
        And click on row root with value "automation-test-1001" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then "Navigation_Bar" on "commonPagesHeader" wizard should be "pinned"
        Then verify "General_Info_Quick_Links" element visibility on "commonPagesHeader" wizard
        Then verify "Project_Settings_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Pin_Quick_linck_Button" element visibility on "commonPagesHeader" wizard
        Then click on "Pin_Quick_linck_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        Then verify "General_Info_Quick_Links" element invisibility on "commonPagesHeader" wizard
        Then verify "Project_Settings_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "Pin_Quick_linck_Button" element invisibility on "commonPagesHeader" wizard
        When hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then verify "General_Info_Quick_Links" element visibility on "commonPagesHeader" wizard
        Then verify "Project_Settings_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Pin_Quick_linck_Button" element visibility on "commonPagesHeader" wizard
        Then "Navigation_Bar" on "commonPagesHeader" wizard should not be "pinned"

    @passive
    @sanity
    @demo
    Scenario: Check all mandatory components on demo mode
        * set tear-down property "project" created with "automation-test-1002" value
        * create "automation-test-1002" MLRun Project with code 201
        Given open url
        * turn on demo mode
        And click on row root with value "automation-test-1002" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Header_Name_Label" element visibility on "Demo_Project" wizard
        Then verify "Header_Created_Time" element visibility on "Demo_Project" wizard
        Then verify "Header_Project_Description" element visibility on "Demo_Project" wizard
        Then verify "Header_Name_Label" on "Demo_Project" wizard should display "Project"."Online_Status" in "Common_Tolltip"
        Then verify value should equal "automation-test-1002" in "Header_Name_Label" on "Demo_Project" wizard
        Then verify value should equal "automation test description" in "Header_Project_Description" on "Demo_Project" wizard
        Then verify value should equal "Data collection" in "Data_Collection_Header" on "Demo_Project" wizard
        Then verify value should equal "Project"."Data_Collection_Description" in "Data_Collection_Description" on "Demo_Project" wizard
        Then verify "Data_Collection_Additional_Actions_Button" element visibility on "Demo_Project" wizard
        Then verify "Data_Collection_Actions_Table" element visibility on "Demo_Project" wizard
        Then verify "Data_Collection_Links_Table" element visibility on "Demo_Project" wizard
        Then verify value should equal "Development" in "Development_Header" on "Demo_Project" wizard
        Then verify value should equal "Project"."Development_Description" in "Development_Description" on "Demo_Project" wizard
        Then verify "Development_Actions_Table" element visibility on "Demo_Project" wizard
        Then verify "Development_Links_Table" element visibility on "Demo_Project" wizard
        Then verify value should equal "Deployment" in "Deployment_Header" on "Demo_Project" wizard
        Then verify value should equal "Project"."Deployment_Description" in "Deployment_Description" on "Demo_Project" wizard
        Then verify "Deployment_Actions_Table" element visibility on "Demo_Project" wizard
        Then verify "Deployment_Links_Table" element visibility on "Demo_Project" wizard
        Then click on "Data_Collection_Additional_Actions_Button" element on "Demo_Project" wizard
        Then verify values in "Data_Collection_Actions_Table" table on "Demo_Project" wizard
            |          name           |
            |   Create Features Set   |
            |     Register Dataset    |
            |     Register Artifact   |
        Then verify values in "Data_Collection_Additional_Actions_Table" table on "Demo_Project" wizard
            |          name           |
            | Create a Feature Vector |
        Then verify values in "Development_Actions_Table" table on "Demo_Project" wizard
            |          name           |
            |   Create New Function   |
            |      Create New Job     |
            |      Register Model     |
        Then verify values in "Deployment_Actions_Table" table on "Demo_Project" wizard
            |          name           |
            |   Create RT function    |
            | Deploy serving function |
            |      Deploy Model       |
        Then verify values in "Data_Collection_Links_Table" table on "Demo_Project" wizard
            |      name       |
            |   Feature Sets  |
            |    Artifacts    |
            |    Datasets     |
            | Feature Vectors |
        Then verify values in "Development_Links_Table" table on "Demo_Project" wizard
            |     name     |
            | ML Functions |
            |     Jobs     |
            |    Models    |
            |   Workflow   |
        Then verify values in "Deployment_Links_Table" table on "Demo_Project" wizard
            |        name         |
            |   Model Endpoints   |
            | Real Time Pipelines |
            |  Nuclio Functions   |
            |     Monitoring      |

    @passive
    @inProgress
    @enabledProjectMembership
    Scenario: Check all mandatory components on Project Owner Popup
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then click on "Owner_Link" element on "Project" wizard
        Then verify if "Change_Project_Owner_Popup" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "Change_Project_Owner_Popup" wizard
        Then verify "Title" element visibility on "Change_Project_Owner_Popup" wizard
        Then verify "Discard_Button" element visibility on "Change_Project_Owner_Popup" wizard
        Then verify "Apply_Button" element visibility on "Change_Project_Owner_Popup" wizard
        Then verify "Footer_Annotation_Label" element visibility on "Change_Project_Owner_Popup" wizard
        When type searchable fragment "D" into "Search_Input" on "Change_Project_Owner_Popup" wizard
        And wait load page
        Then searchable case "insensitive" fragment "D" should be in every suggested option into "Search_Input" on "Change_Project_Owner_Popup" wizard

    @passive
    @inProgress
    @enabledProjectMembership
    Scenario: Check all mandatory components on Project Owner Popup
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then click on "Members_Link" element on "Project" wizard
        Then verify if "Project_Members_Popup" popup dialog appears
        Then verify "Member_Overview_Labels_Table" element visibility on "Project_Members_Popup" wizard
        Then verify "Member_Overview_Tooltip" on "Project_Members_Popup" wizard should display "Label_Hint"."Members_Hint"
        Then verify "Invite_New_Members_Button" element visibility on "Project_Members_Popup" wizard
        Then verify "Members_Filter_Input" element visibility on "Project_Members_Popup" wizard
        Then verify "Role_Filter_Dropdown" element visibility on "Project_Members_Popup" wizard
        Then verify "Members_Table" element visibility on "Project_Members_Popup" wizard
        Then verify "Notify_by_Email" element visibility on "Project_Members_Popup" wizard
        Then verify "Discard_Button" element visibility on "Project_Members_Popup" wizard
        Then verify "Apply_Button" element visibility on "Project_Members_Popup" wizard
        Then verify "Footer_Annotation_Label" element visibility on "Project_Members_Popup" wizard

    @enabledProjectMembership
    Scenario: Verify behaviour of Invite New Members on Project Member Popup
        * set tear-down property "project" created with "automation-test" value
        * create "automation-test" MLRun Project with code 201
        Given open url
        And click on row root with value "automation-test" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then click on "Members_Link" element on "Project" wizard
        Then verify if "Project_Members_Popup" popup dialog appears
        Then click on "Invite_New_Members_Button" element on "Project_Members_Popup" wizard
        Then type value "a" to "New_Member_Name_Input" field on "Project_Members_Popup" wizard
        Then searchable case "insensitive" fragment "a" should be in every suggested option into "New_Member_Name_Input" on "Project_Members_Popup" wizard
        Then select "all_users" option in "New_Member_Name_Dropdown" dropdown on "Project_Members_Popup" wizard
        Then type value "a" to "New_Member_Name_Input" field on "Project_Members_Popup" wizard
        Then type value "ig" to "New_Member_Name_Input" field on "Project_Members_Popup" wizard
        Then searchable case "insensitive" fragment "ig" should be in every suggested option into "New_Member_Name_Input" on "Project_Members_Popup" wizard
        Then select "iguazio" option in "New_Member_Name_Dropdown" dropdown on "Project_Members_Popup" wizard
        Then type value "adm" to "New_Member_Name_Input" field on "Project_Members_Popup" wizard
        Then searchable case "insensitive" fragment "adm" should be in every suggested option into "New_Member_Name_Input" on "Project_Members_Popup" wizard
        Then select "admin" option in "New_Member_Name_Dropdown" dropdown on "Project_Members_Popup" wizard
        Then verify values in "Invite_New_Members_Labels_Table" table on "Project_Members_Popup" wizard
            |  label    |
            | all_users |
            | iguazio   |
            | admin     |
        When click on "remove_btn" in "Invite_New_Members_Labels_Table" table on "Project_Members_Popup" wizard
            |  label    |
            | iguazio   |
            | all_users |
        Then verify values in "Invite_New_Members_Labels_Table" table on "Project_Members_Popup" wizard
            |  label    |
            | admin     |
        Then select "Admin" option in "New_Member_Role_Dropdown" dropdown on "Project_Members_Popup" wizard
        Then click on "New_Member_Add_Button" element on "Project_Members_Popup" wizard
        Then click on "Invite_New_Members_Button" element on "Project_Members_Popup" wizard
        Then type value "all" to "New_Member_Name_Input" field on "Project_Members_Popup" wizard
        Then select "all_users" option in "New_Member_Name_Dropdown" dropdown on "Project_Members_Popup" wizard
        Then select "Viewer" option in "New_Member_Role_Dropdown" dropdown on "Project_Members_Popup" wizard
        Then click on "New_Member_Add_Button" element on "Project_Members_Popup" wizard
        Then verify values in "Members_Table" table on "Project_Members_Popup" wizard
            | name      | role   |
            | admin     | Admin  |
            | all_users | Viewer |
        When click on "delete_btn" in "Members_Table" table on "Project_Members_Popup" wizard with offset "false"
            | name  |
            | admin |
        Then verify if "Remove_Member_Popup" popup dialog appears
        Then verify "Remove_Member_Button" element visibility on "Remove_Member_Popup" wizard
        Then "Remove_Member_Button" element on "Remove_Member_Popup" should contains "Remove member" value
        Then click on "Remove_Member_Button" element on "Remove_Member_Popup" wizard
        Then verify values in "Members_Table" table on "Project_Members_Popup" wizard
            | name      | role   |
            | all_users | Viewer |
        Then click on "Discard_Button" element on "Project_Members_Popup" wizard
        Then verify if "Discard_Changes_Popup" popup dialog appears
        Then "No_Button" element on "Discard_Changes_Popup" should contains "No" value
        Then "Discard_Button" element on "Discard_Changes_Popup" should contains "Discard" value
        And remove "automation-test" MLRun Project with code 204

    @passive
    Scenario: Check MLRun logo redirection
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on "MLRun_Logo" element on "commonPagesHeader" wizard
        And wait load page
        Then verify "Projects_Table" element visibility on "Projects" wizard

    @passive
    Scenario: Check all mandatory components on Register File Popup
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Create_New" element visibility on "Project" wizard
        Then verify "Create_New" dropdown element on "Project" wizard should contains "Project"."Create_New_Options"
        Then select "Register Artifact" option in "Create_New" dropdown on "Project" wizard
        Then "Title" element on "Register_File_Popup" should contains "Register artifact" value
        Then verify "Cross_Cancel_Button" element visibility on "Register_File_Popup" wizard
        Then verify "New_File_Name_Input" element visibility on "Register_File_Popup" wizard
        Then verify "New_File_Name_Input" on "Register_File_Popup" wizard should display "Input_Hint"."Artifact_Names_Unique"
        Then verify "New_File_Target_Path_Input" element visibility on "Register_File_Popup" wizard
        Then verify "New_File_Description_Input" element visibility on "Register_File_Popup" wizard
        Then verify "New_File_Type_Dropdown" element visibility on "Register_File_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Register_File_Popup" wizard
        Then verify "Register_Button" element visibility on "Register_File_Popup" wizard
        Then click on "Register_Button" element on "Register_File_Popup" wizard
        Then verify "New_File_Name_Input" on "Register_File_Popup" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "New_File_Target_Path_Input" on "Register_File_Popup" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then type value "   " to "New_File_Name_Input" field on "Register_File_Popup" wizard
        Then verify "New_File_Name_Input" on "Register_File_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then type value "   " to "New_File_Target_Path_Input" field on "Register_File_Popup" wizard
        Then verify "New_File_Target_Path_Input" on "Register_File_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then type value "   " to "New_File_Description_Input" field on "Register_File_Popup" wizard
        Then verify "New_File_Description_Input" on "Register_File_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "New_File_Type_Dropdown" dropdown element on "Register_File_Popup" wizard should contains "Register_File"."Type_Options"

    @passive
    Scenario: Check all mandatory components on Register Model Popup
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Create_New" element visibility on "Project" wizard
        Then verify "Create_New" dropdown element on "Project" wizard should contains "Project"."Create_New_Options"
        Then select "Register Model" option in "Create_New" dropdown on "Project" wizard
        Then "Title" element on "Register_Model_Popup" should contains "Register model" value
        Then verify "Cross_Cancel_Button" element visibility on "Register_Model_Popup" wizard
        Then verify "New_File_Name_Input" element visibility on "Register_Model_Popup" wizard
        Then verify "New_File_Name_Input" on "Register_Model_Popup" wizard should display "Input_Hint"."Artifact_Names_Unique"
        Then verify "New_File_Target_Path_Input" element visibility on "Register_Model_Popup" wizard
        Then verify "New_File_Description_Input" element visibility on "Register_Model_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Register_Model_Popup" wizard
        Then verify "Register_Button" element visibility on "Register_Model_Popup" wizard
        Then click on "Register_Button" element on "Register_Model_Popup" wizard
        Then verify "New_File_Name_Input" on "Register_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "New_File_Target_Path_Input" on "Register_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then type value "   " to "New_File_Name_Input" field on "Register_Model_Popup" wizard
        Then verify "New_File_Name_Input" on "Register_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then type value "   " to "New_File_Target_Path_Input" field on "Register_Model_Popup" wizard
        Then verify "New_File_Target_Path_Input" on "Register_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then type value "   " to "New_File_Description_Input" field on "Register_Model_Popup" wizard
        Then verify "New_File_Description_Input" on "Register_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"

    @passive
    Scenario: Check all mandatory components on Register Dataset Popup
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Create_New" element visibility on "Project" wizard
        Then verify "Create_New" dropdown element on "Project" wizard should contains "Project"."Create_New_Options"
        Then select "Register Dataset" option in "Create_New" dropdown on "Project" wizard
        Then "Title" element on "Register_Dataset" should contains "Register dataset" value
        Then verify "Name_Input" element visibility on "Register_Dataset" wizard
        Then verify "Name_Input" on "Register_Dataset" wizard should display "Input_Hint"."Artifact_Names_Unique"
        Then verify "Target_Path_Input" element visibility on "Register_Dataset" wizard
        Then verify "Description_Input" element visibility on "Register_Dataset" wizard
        Then verify "Cancel_Button" element visibility on "Register_Dataset" wizard
        Then verify "Register_Button" element visibility on "Register_Dataset" wizard
        Then click on "Register_Button" element on "Register_Dataset" wizard
        Then verify "Name_Input" on "Register_Dataset" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Target_Path_Input" on "Register_Dataset" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then type value "   " to "Name_Input" field on "Register_Dataset" wizard
        Then verify "Name_Input" on "Register_Dataset" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then type value "   " to "Target_Path_Input" field on "Register_Dataset" wizard
        Then verify "Target_Path_Input" on "Register_Dataset" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then type value "   " to "Description_Input" field on "Register_Dataset" wizard
        Then verify "Description_Input" on "Register_Dataset" wizard should display warning "Input_Hint"."Input_Field_Invalid"

    @passive
    Scenario: Check all mandatory components on Create New Job
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Create_New" element visibility on "Project" wizard
        Then verify "Create_New" dropdown element on "Project" wizard should contains "Project"."Create_New_Options"
        Then select "Job" option in "Create_New" dropdown on "Project" wizard
        When expand row with "Data Preparation" at "name" in "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        When select "aggregate" in subcolumn "name" at "templates_list" column in "Data Preparation" row by "name" at "Functions_Templates_Table" in "Function_Templates_Accordion" on "Create_Job" wizard
        And wait load page
        Then verify "Default_Input_Path_Input" element visibility in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Default_Artifact_Path_Input" element visibility in "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Data_Inputs_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Job_Predefined_Parameters_Table" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Job_Custom_Parameters_Table" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Parameters_Additional_Settings_Input" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Result_Input" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Turning_Strategy_Dropdown" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Criteria_Dropdown" element visibility in "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Parameters_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Volumes_Subheader" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Volume_Paths_Table" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Unit_Dropdown" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Request_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Memory_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Unit_Dropdown" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Request_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "CPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "GPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Resources_Node_Selector_Table" element visibility in "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        When collapse "Resources_Accordion" on "New_JobTemplate_Edit" wizard
        When expand "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Advanced_Environment_Variables_Table" element visibility in "Advanced_Accordion" on "New_JobTemplate_Edit" wizard
        Then verify "Access_Key_Checkbox" element visibility on "New_JobTemplate_Edit" wizard
        Then uncheck "Access_Key_Checkbox" element on "New_JobTemplate_Edit" wizard
        Then verify "Access_Key_Input" element visibility on "New_JobTemplate_Edit" wizard
        Then verify "Schedule_For_Later_Button" element visibility on "New_JobTemplate_Edit" wizard
        Then verify "Run_Now_Button" element visibility on "New_JobTemplate_Edit" wizard

    @passive
    Scenario: Check all mandatory components on Create ML Function
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Create_New" element visibility on "Project" wizard
        Then verify "Create_New" dropdown element on "Project" wizard should contains "Project"."Create_New_Options"
        Then select "ML Function" option in "Create_New" dropdown on "Project" wizard
        Then "Title" element on "Create_ML_Function_Popup" should contains "Create New Function" value
        And verify "Cross_Cancel_Button" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Name_Input" element visibility on "Create_ML_Function_Popup" wizard
        Then type value "   " to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Name_Input" on "Create_ML_Function_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "New_Function_Name_Input" on "Create_ML_Function_Popup" wizard should display "Input_Hint"."Function_Name_Hint"
        Then verify "New_Function_Name_Input" according hint rules on "Create_ML_Function_Popup" wizard
        Then type value "   " to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Tag_Input" on "Create_ML_Function_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "New_Function_Runtime_Dropdown" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "Continue_Button" element visibility on "Create_ML_Function_Popup" wizard
        And type value "demo-function-02" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        And type value "latest" to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        And click on "Continue_Button" element on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Description_Text_Area" element visibility in "General_Accordion" on "New_Function" wizard
        Then verify "Labels_Table" element visibility in "General_Accordion" on "New_Function" wizard
        When collapse "General_Accordion" on "New_Function" wizard
        Then verify "New_Function_Code_Entry_Dropdown" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Handler_Input" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "Build_A_New_Image_Radiobutton" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "Use_An_Existing_Image_Radiobutton" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Image_Name_Input" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Resulting_Image_Input" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Build_Commands_Text_Area" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Base_Image_Input" element visibility in "Code_Accordion" on "New_Function" wizard
        When collapse "Code_Accordion" on "New_Function" wizard
        Then verify "Volumes_Subheader" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Volume_Paths_Table" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Unit_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Request_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Unit_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Request_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "GPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        When collapse "Resources_Accordion" on "New_Function" wizard
        Then verify "Function_Environment_Variables_Table" element visibility in "Environment_Variables_Accordion" on "New_Function" wizard
        When collapse "Environment_Variables_Accordion" on "New_Function" wizard
        Then verify "Access_Key_Checkbox" element visibility on "New_Function" wizard
        Then verify "Cancel_Button" element visibility on "New_Function" wizard
        Then verify "Save_Button" element visibility on "New_Function" wizard
        Then verify "Deploy_Button" element visibility on "New_Function" wizard

    @passive
    @demo
    Scenario: Check all mandatory components on Create ML Function on Demo mode
        Given open url
        And turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Project monitoring" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        Then verify "Create_New" element visibility on "Project" wizard
        Then verify "Create_New" dropdown element on "Project" wizard should contains "Project"."Create_New_Options"
        Then select "ML Function" option in "Create_New" dropdown on "Project" wizard
        Then "Title" element on "Create_ML_Function_Popup" should contains "Create New Function" value
        And verify "Cross_Cancel_Button" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Name_Input" element visibility on "Create_ML_Function_Popup" wizard
        Then type value "   " to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Name_Input" on "Create_ML_Function_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "New_Function_Name_Input" on "Create_ML_Function_Popup" wizard should display "Input_Hint"."Function_Name_Hint"
        Then verify "New_Function_Name_Input" according hint rules on "Create_ML_Function_Popup" wizard
        Then type value "   " to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Tag_Input" on "Create_ML_Function_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "New_Function_Runtime_Dropdown" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "Continue_Button" element visibility on "Create_ML_Function_Popup" wizard
        And type value "demo-function-02" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        And type value "latest" to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        And select "Serving" option in "New_Function_Runtime_Dropdown" dropdown on "Create_ML_Function_Popup" wizard
        And click on "Continue_Button" element on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Description_Text_Area" element visibility in "General_Accordion" on "New_Function" wizard
        Then verify "Labels_Table" element visibility in "General_Accordion" on "New_Function" wizard
        When collapse "General_Accordion" on "New_Function" wizard
        Then verify "New_Function_Code_Entry_Dropdown" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Default_Class_Input" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "Build_A_New_Image_Radiobutton" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "Use_An_Existing_Image_Radiobutton" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Image_Name_Input" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Resulting_Image_Input" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Build_Commands_Text_Area" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Base_Image_Input" element visibility in "Code_Accordion" on "New_Function" wizard
        When collapse "Code_Accordion" on "New_Function" wizard
        Then verify "Volumes_Subheader" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Volume_Paths_Table" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Unit_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Request_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Unit_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Request_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "GPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        When collapse "Resources_Accordion" on "New_Function" wizard
        Then verify "Function_Environment_Variables_Demo_Table" element visibility in "Environment_Variables_Accordion" on "New_Function" wizard
        When collapse "Environment_Variables_Accordion" on "New_Function" wizard
        Then verify "Topology_Router_Type_Dropdown" element visibility in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then verify "Serving_Runtime_Configuration_Model_Table" element visibility in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then verify "Model_Tracking_Checkbox" element visibility in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then verify "Secrets_Runtime_Configuration_Table" element visibility in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then verify "Stream_Path_Input" element visibility in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then verify "Stream_Path_Input" element in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard should display hint "Input_Hint"."Stream_Path_Hint"
        Then verify "Parameters_Runtime_Configuration_Table" element visibility in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then verify "Access_Key_Checkbox" element visibility on "New_Function" wizard
        Then verify "Cancel_Button" element visibility on "New_Function" wizard
        Then verify "Save_Button" element visibility on "New_Function" wizard
        Then verify "Deploy_Button" element visibility on "New_Function" wizard

    @passive
    Scenario: Check all mandatory components on Create New Feature Set
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Create_New" element visibility on "Project" wizard
        Then verify "Create_New" dropdown element on "Project" wizard should contains "Project"."Create_New_Options"
        Then select "Feature Set" option in "Create_New" dropdown on "Project" wizard
        Then verify "Cross_Close_Button" element visibility on "New_Feature_Set" wizard
        Then verify "Feature_Set_Name_Input" element visibility on "New_Feature_Set" wizard
        Then verify "Version_Input" element visibility on "New_Feature_Set" wizard
        Then verify "Description_Input" element visibility on "New_Feature_Set" wizard
        Then verify "Labels_Table" element visibility on "New_Feature_Set" wizard
        Then verify "Accordion_Header" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Collapse_Button" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "URL_Combobox" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Attributes_Input" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then type value "   " to "Attributes_Input" field on "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Attributes_Input" element in "Data_Source_Accordion" on "New_Feature_Set" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        When collapse "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Data_Source_Accordion" is collapsed on "New_Feature_Set" wizard
        Then verify "Accordion_Header" element visibility in "Schema_Accordion" on "New_Feature_Set" wizard
        Then verify "Collapse_Button" element visibility in "Schema_Accordion" on "New_Feature_Set" wizard
        Then verify "Entities_Input" element visibility in "Schema_Accordion" on "New_Feature_Set" wizard
        Then verify "Timestamp_Input" element visibility in "Schema_Accordion" on "New_Feature_Set" wizard
        When collapse "Schema_Accordion" on "New_Feature_Set" wizard
        Then verify "Schema_Accordion" is collapsed on "New_Feature_Set" wizard
        Then verify "Accordion_Header" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Collapse_Button" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Online_Checkbox" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Offline_Checkbox" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "External_Offline_Checkbox" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When collapse "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Target_Store_Accordion" is collapsed on "New_Feature_Set" wizard
        Then verify "Access_Key_Checkbox" element visibility on "New_Feature_Set" wizard
        Then verify "Cancel_Button" element visibility on "New_Feature_Set" wizard
        Then verify "Save_Button" element visibility on "New_Feature_Set" wizard
        Then verify "Save_And_Ingest_Button" element visibility on "New_Feature_Set" wizard

    @passive
    Scenario: Check Project Counter redirection to Models tab
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then click on cell with value "Models" in "name" column in "Mono_Values_Cards" table on "Project" wizard
        And wait load page
        Then verify "Table_Name_Filter_Input" element visibility on "Models" wizard
        Then verify "Table_Labels_Filter_Input" element visibility on "Models" wizard
        Then verify "Table_Tree_Filter_Dropdown" element visibility on "Models" wizard
        Then verify "Show_Iterations_Checkbox" element visibility on "Models" wizard
        Then verify "Table_Refresh_Button" element visibility on "Models" wizard
        Then verify "Models_Table" element visibility on "Models" wizard
        Then verify "Register_Model_Button" element visibility on "Models" wizard
        Then "Register_Model_Button" element on "Models" should contains "Register Model" value

    @passive
    Scenario: Check Project Counter redirection to Feature Sets tab
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then click on cell with value "Feature sets" in "name" column in "Mono_Values_Cards" table on "Project" wizard
        And wait load page
        Then verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        Then verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Tag_Filter_Dropdown" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then type value "   " to "Table_Name_Filter_Input" field on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Name_Filter_Input" on "Feature_Store_Feature_Sets_Tab" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "Table_Label_Filter_Input" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then type value "   " to "Table_Label_Filter_Input" field on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Label_Filter_Input" on "Feature_Store_Feature_Sets_Tab" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "Feature_Sets_Table" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Feature_Store_Tab_Selector" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Create_Set_Button" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" should contains "Create Set" value

    @passive
    Scenario: Check Project Counter redirection to Files tab
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then click on cell with value "Artifacts" in "name" column in "Mono_Values_Cards" table on "Project" wizard
        And wait load page
        Then verify "Table_Name_Filter_Input" element visibility on "Files" wizard
        Then verify "Table_Label_Filter_Input" element visibility on "Files" wizard
        Then verify "Table_Tree_Filter_Dropdown" element visibility on "Files" wizard
        Then verify "Show_Iterations_Checkbox" element visibility on "Files" wizard
        Then verify "Table_Refresh_Button" element visibility on "Files" wizard
        Then verify "Files_Table" element visibility on "Files" wizard
        Then verify "Register_File_Button" element visibility on "Files" wizard
        Then "Register_File_Button" element on "Files" should contains "Register Artifact" value

    @passive
    Scenario: Check Project Counter redirection to Monitor Jobs tab
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then click on cell with value "Running jobs" in "name" column in "Jobs_Info_Card_Statistics" table on "Project" wizard
        And wait load page
        Then verify "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard should contains "Jobs_And_Workflows"."Tab_List"
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "New_Job_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then "New_Job_Button" element on "Jobs_Monitor_Tab" should contains "New Job" value
        Then verify "Resource_Monitoring_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Expand_Rows_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Status_Filter_Dropdown" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Group_By_Name_Filter_Dropdown" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Labels_Filter_Input" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Start_Time_Filter_Dropdown" element visibility on "Jobs_Monitor_Tab" wizard
        When select "Past month" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then select "Any time" option in "Start_Time_Filter_Dropdown" filter dropdown on "Jobs_Monitor_Tab" wizard
        Then verify "Jobs_Monitor_Table" element visibility on "Jobs_Monitor_Tab" wizard

    @passive
    Scenario: Check Project Counter redirection to Schedules tab
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then click on cell with value "Scheduled" in "name" column in "Jobs_Info_Card_Statistics" table on "Project" wizard
        And wait load page
        Then verify "Schedule" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Schedule_Monitor_Tab" wizard
        Then verify "Table_Labels_Filter_Input" element visibility on "Schedule_Monitor_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Schedule_Monitor_Tab" wizard
        Then verify "Schedule_Monitor_Table" element visibility on "Schedule_Monitor_Tab" wizard

    @passive
    Scenario: Verify behaviour of Breadcrumbs menu
        Given open url
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify breadcrumbs "project" label should be equal "churn-project-admin" value
        Then select "project" with "default" value in breadcrumbs menu
        Then verify breadcrumbs "project" label should be equal "default" value
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Models" value
        Then verify "Models_Table" element visibility on "Models" wizard
        Then select "tab" with "Feature Store (Beta)" value in breadcrumbs menu
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Feature Store (Beta)" value
        Then verify "Feature_Sets_Table" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then select "tab" with "Artifacts" value in breadcrumbs menu
        And wait load page

    @passive
    @demo
    Scenario: Check all mandatory components on Create ML Function on Demo mode from Demo Page
        * set tear-down property "project" created with "automation-test-1003" value
        * create "automation-test-1003" MLRun Project with code 201
        Given open url
        * turn on demo mode
        And click on row root with value "automation-test-1003" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Development_Actions_Table" table on "Demo_Project" wizard with offset "false"
            |          name           |
            |   Create New Function   |
        And wait load page
        Then verify "Cross_Cancel_Button" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Name_Input" element visibility on "Create_ML_Function_Popup" wizard
        Then type value "   " to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Name_Input" on "Create_ML_Function_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "New_Function_Name_Input" on "Create_ML_Function_Popup" wizard should display "Input_Hint"."Function_Name_Hint"
        Then verify "New_Function_Name_Input" according hint rules on "Create_ML_Function_Popup" wizard
        Then type value "   " to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Tag_Input" on "Create_ML_Function_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "New_Function_Runtime_Dropdown" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "Continue_Button" element visibility on "Create_ML_Function_Popup" wizard
        And type value "demo-function-02" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard

    @passive
    @demo
    Scenario: Check all mandatory components on Create New Job on Demo mode from Demo Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Development_Actions_Table" table on "Demo_Project" wizard with offset "false"
            |          name           |
            |      Create New Job     |
        And wait load page
        Then verify "Back_Arrow_Button" element visibility on "Create_Job" wizard
        Then verify "Create_Job_Header" element visibility on "Create_Job" wizard
        Then verify "Search_Input" element visibility on "Create_Job" wizard

    @passive
    @demo
    Scenario: Check all mandatory components on Register Model Popup on Demo mode from Demo Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Development_Actions_Table" table on "Demo_Project" wizard with offset "false"
            |          name           |
            |      Register Model     |
        And wait load page
        Then "Title" element on "Register_Model_Popup" should contains "Register model" value
        Then verify "Cross_Cancel_Button" element visibility on "Register_Model_Popup" wizard
        Then verify "New_File_Name_Input" element visibility on "Register_Model_Popup" wizard
        Then verify "New_File_Name_Input" on "Register_Model_Popup" wizard should display "Input_Hint"."Artifact_Names_Unique"
        Then verify "New_File_Target_Path_Input" element visibility on "Register_Model_Popup" wizard
        Then verify "New_File_Description_Input" element visibility on "Register_Model_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Register_Model_Popup" wizard
        Then verify "Register_Button" element visibility on "Register_Model_Popup" wizard
        Then click on "Register_Button" element on "Register_Model_Popup" wizard
        Then verify "New_File_Name_Input" on "Register_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "New_File_Target_Path_Input" on "Register_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then type value "   " to "New_File_Name_Input" field on "Register_Model_Popup" wizard
        Then verify "New_File_Name_Input" on "Register_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then type value "   " to "New_File_Target_Path_Input" field on "Register_Model_Popup" wizard
        Then verify "New_File_Target_Path_Input" on "Register_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then type value "   " to "New_File_Description_Input" field on "Register_Model_Popup" wizard
        Then verify "New_File_Description_Input" on "Register_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"

    @passive
    @demo
    Scenario: Check all mandatory components on Create New Feature Set on Demo mode from Demo Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Data_Collection_Actions_Table" table on "Demo_Project" wizard with offset "false"
            |          name           |
            |   Create Features Set   |
        And wait load page
        Then verify "Cross_Close_Button" element visibility on "New_Feature_Set" wizard
        Then verify "Feature_Set_Name_Input" element visibility on "New_Feature_Set" wizard
        Then verify "Version_Input" element visibility on "New_Feature_Set" wizard
        Then verify "Description_Input" element visibility on "New_Feature_Set" wizard
        Then verify "Labels_Table" element visibility on "New_Feature_Set" wizard
        Then verify "Accordion_Header" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Collapse_Button" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "URL_Combobox" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Attributes_Input" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then type value "   " to "Attributes_Input" field on "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Attributes_Input" element in "Data_Source_Accordion" on "New_Feature_Set" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        When collapse "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Data_Source_Accordion" is collapsed on "New_Feature_Set" wizard
        Then verify "Accordion_Header" element visibility in "Schema_Accordion" on "New_Feature_Set" wizard
        Then verify "Collapse_Button" element visibility in "Schema_Accordion" on "New_Feature_Set" wizard
        Then verify "Entities_Input" element visibility in "Schema_Accordion" on "New_Feature_Set" wizard
        Then verify "Timestamp_Input" element visibility in "Schema_Accordion" on "New_Feature_Set" wizard
        When collapse "Schema_Accordion" on "New_Feature_Set" wizard
        Then verify "Schema_Accordion" is collapsed on "New_Feature_Set" wizard
        Then verify "Accordion_Header" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Collapse_Button" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Online_Checkbox" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Offline_Checkbox" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "External_Offline_Checkbox" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When collapse "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Target_Store_Accordion" is collapsed on "New_Feature_Set" wizard
        Then verify "Access_Key_Checkbox" element visibility on "New_Feature_Set" wizard
        Then verify "Cancel_Button" element visibility on "New_Feature_Set" wizard
        Then verify "Save_Button" element visibility on "New_Feature_Set" wizard
        Then verify "Save_And_Ingest_Button" element visibility on "New_Feature_Set" wizard

    @passive
    @demo
    Scenario: Check all mandatory components on Register Dataset Popup on Demo mode from Demo Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Data_Collection_Actions_Table" table on "Demo_Project" wizard with offset "false"
            |          name           |
            |     Register Dataset    |
        And wait load page
        Then "Title" element on "Register_Dataset" should contains "Register dataset" value
        Then verify "Name_Input" element visibility on "Register_Dataset" wizard
        Then verify "Name_Input" on "Register_Dataset" wizard should display "Input_Hint"."Artifact_Names_Unique"
        Then verify "Target_Path_Input" element visibility on "Register_Dataset" wizard
        Then verify "Description_Input" element visibility on "Register_Dataset" wizard
        Then verify "Cancel_Button" element visibility on "Register_Dataset" wizard
        Then verify "Register_Button" element visibility on "Register_Dataset" wizard
        Then click on "Register_Button" element on "Register_Dataset" wizard
        Then verify "Name_Input" on "Register_Dataset" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Target_Path_Input" on "Register_Dataset" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then type value "   " to "Name_Input" field on "Register_Dataset" wizard
        Then verify "Name_Input" on "Register_Dataset" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then type value "   " to "Target_Path_Input" field on "Register_Dataset" wizard
        Then verify "Target_Path_Input" on "Register_Dataset" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then type value "   " to "Description_Input" field on "Register_Dataset" wizard
        Then verify "Description_Input" on "Register_Dataset" wizard should display warning "Input_Hint"."Input_Field_Invalid"

    @passive
    @demo
    Scenario: Check all mandatory components on Register File Popup on Demo mode from Demo Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Data_Collection_Actions_Table" table on "Demo_Project" wizard with offset "false"
            |          name           |
            |    Register Artifact    |
        And wait load page
        Then "Title" element on "Register_File_Popup" should contains "Register artifact" value
        Then verify "Cross_Cancel_Button" element visibility on "Register_File_Popup" wizard
        Then verify "New_File_Name_Input" element visibility on "Register_File_Popup" wizard
        Then verify "New_File_Name_Input" on "Register_File_Popup" wizard should display "Input_Hint"."Artifact_Names_Unique"
        Then verify "New_File_Target_Path_Input" element visibility on "Register_File_Popup" wizard
        Then verify "New_File_Description_Input" element visibility on "Register_File_Popup" wizard
        Then verify "New_File_Type_Dropdown" element visibility on "Register_File_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Register_File_Popup" wizard
        Then verify "Register_Button" element visibility on "Register_File_Popup" wizard
        Then click on "Register_Button" element on "Register_File_Popup" wizard
        Then verify "New_File_Name_Input" on "Register_File_Popup" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "New_File_Target_Path_Input" on "Register_File_Popup" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then type value "   " to "New_File_Name_Input" field on "Register_File_Popup" wizard
        Then verify "New_File_Name_Input" on "Register_File_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then type value "   " to "New_File_Target_Path_Input" field on "Register_File_Popup" wizard
        Then verify "New_File_Target_Path_Input" on "Register_File_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then type value "   " to "New_File_Description_Input" field on "Register_File_Popup" wizard
        Then verify "New_File_Description_Input" on "Register_File_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "New_File_Type_Dropdown" dropdown element on "Register_File_Popup" wizard should contains "Register_File"."Type_Options"

    @passive
    @demo
    Scenario: Check all mandatory components on Create a Feature Vector Popup on Demo mode from Demo Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then click on "Data_Collection_Additional_Actions_Button" element on "Demo_Project" wizard
        When click on "name" in "Data_Collection_Additional_Actions_Table" table on "Demo_Project" wizard with offset "false"
            |          name           |
            | Create a Feature Vector |
        And wait load page
        Then "Title" element on "Create_Feature_Vector_Popup" should contains "Create feature vector" value
        Then verify "Cross_Cancel_Button" element visibility on "Create_Feature_Vector_Popup" wizard
        Then verify "Name_Input" element visibility on "Create_Feature_Vector_Popup" wizard
        Then type value "   " to "Name_Input" field on "Create_Feature_Vector_Popup" wizard
        Then verify "Name_Input" options rules on "Create_Feature_Vector_Popup" wizard
        Then verify "Tag_Input" element visibility on "Create_Feature_Vector_Popup" wizard
        Then verify "Description_Input" element visibility on "Create_Feature_Vector_Popup" wizard
        Then verify "Labels_Table" element visibility on "Create_Feature_Vector_Popup" wizard

    @passive
    @demo
    Scenario: Check all mandatory components on Feature Set tab on Demo mode from Demo Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Data_Collection_Links_Table" table on "Demo_Project" wizard with offset "false"
            |     name     |
            | Feature Sets |
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Feature Store (Beta)" value
        Then verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        Then verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Tag_Filter_Dropdown" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Tag_Filter_Dropdown" dropdown element on "Feature_Store_Feature_Sets_Tab" wizard should contains "Dropdown_Options"."Tag_Filer_Options"
        Then type value "   " to "Table_Name_Filter_Input" field on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Name_Filter_Input" on "Feature_Store_Feature_Sets_Tab" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "Table_Label_Filter_Input" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then type value "   " to "Table_Label_Filter_Input" field on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Label_Filter_Input" on "Feature_Store_Feature_Sets_Tab" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "Feature_Sets_Table" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Feature_Store_Tab_Selector" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Create_Set_Button" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" should contains "Create Set" value

    @passive
    @demo
    Scenario: Check all mandatory components on Files tab on Demo mode from Demo Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Data_Collection_Links_Table" table on "Demo_Project" wizard with offset "false"
            |   name    |
            | Artifacts |
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Artifacts" value
        Then verify "Table_Name_Filter_Input" element visibility on "Files" wizard
        Then verify "Table_Label_Filter_Input" element visibility on "Files" wizard
        Then verify "Table_Tree_Filter_Dropdown" element visibility on "Files" wizard
        Then verify "Show_Iterations_Checkbox" element visibility on "Files" wizard
        Then verify "Table_Refresh_Button" element visibility on "Files" wizard
        Then verify "Files_Table" element visibility on "Files" wizard
        Then verify "Register_File_Button" element visibility on "Files" wizard
        Then "Register_File_Button" element on "Files" should contains "Register Artifact" value

    @passive
    @demo
    Scenario: Check all mandatory components on Datasets tab on Demo mode from Demo Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Data_Collection_Links_Table" table on "Demo_Project" wizard with offset "false"
            |   name   |
            | Datasets |
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Feature Store (Beta)" value
        And select "Datasets" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then verify "Datasets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Datasets_Tab" wizard
        Then verify "Feature_Store_Tab_Selector" on "Feature_Store_Datasets_Tab" wizard should contains "Feature_Store"."Tab_List"
        Then verify "Register_Dataset_Button" element visibility on "Feature_Store_Datasets_Tab" wizard
        Then "Register_Dataset_Button" element on "Feature_Store_Datasets_Tab" should contains "Register Dataset" value
        Then verify "Table_Name_Filter_Input" element visibility on "Feature_Store_Datasets_Tab" wizard
        Then verify "Table_Label_Filter_Input" element visibility on "Feature_Store_Datasets_Tab" wizard
        Then verify "Table_Tree_Filter_Dropdown" element visibility on "Feature_Store_Datasets_Tab" wizard
        Then verify "Table_Tree_Filter_Dropdown" dropdown element on "Feature_Store_Datasets_Tab" wizard should contains "Dropdown_Options"."Tag_Filer_Options"
        Then verify "Table_Refresh_Button" element visibility on "Feature_Store_Datasets_Tab" wizard

    @passive
    @demo
    Scenario: Check all mandatory components on Feature Vectors tab on Demo mode from Demo Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Data_Collection_Links_Table" table on "Demo_Project" wizard with offset "false"
            |       name      |
            | Feature Vectors |
        And wait load page
        Then verify "Table_Name_Filter_Input" element visibility on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify "Table_Label_Filter_Input" element visibility on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify "Table_Tag_Filter_Dropdown" element visibility on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify "Table_Tag_Filter_Dropdown" dropdown element on "Feature_Store_Features_Vectors_Tab" wizard should contains "Dropdown_Options"."Tag_Filer_Options"
        Then verify "Table_Refresh_Button" element visibility on "Feature_Store_Features_Vectors_Tab" wizard

    @passive
    @demo
    Scenario: Check all mandatory components on ML Functions tab on Demo mode from Demo Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Development_Links_Table" table on "Demo_Project" wizard with offset "false"
            |     name     |
            | ML Functions |
        And wait load page
        Then verify "Table_Name_Filter_Input" element visibility on "ML_Functions" wizard
        Then verify "Show_Untagged_Functions_Checkbox" element visibility on "ML_Functions" wizard
        Then verify "New_Function_Button" element visibility on "ML_Functions" wizard
        Then "New_Function_Button" element on "ML_Functions" should contains "New" value
        Then verify "Table_Refresh_Button" element visibility on "ML_Functions" wizard
        Then verify "Table_Expand_Rows_Button" element visibility on "ML_Functions" wizard

    @passive
    @demo
    Scenario: Check all mandatory components on Jobs tab on Demo mode from Demo Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Development_Links_Table" table on "Demo_Project" wizard with offset "false"
            | name |
            | Jobs |
        And wait load page
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

    @passive
    @demo
    Scenario: Check all mandatory components on Models tab on Demo mode from Demo Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Development_Links_Table" table on "Demo_Project" wizard with offset "false"
            |  name  |
            | Models |
        And wait load page
        Then verify "Models_Tab_Selector" on "Models" wizard should contains "Models"."Tab_List"
        Then verify "Table_Name_Filter_Input" element visibility on "Models" wizard
        Then verify "Table_Labels_Filter_Input" element visibility on "Models" wizard
        Then verify "Table_Tree_Filter_Dropdown" element visibility on "Models" wizard
        Then verify "Show_Iterations_Checkbox" element visibility on "Models" wizard
        Then verify "Table_Refresh_Button" element visibility on "Models" wizard
        Then verify "Models_Table" element visibility on "Models" wizard
        Then verify "Register_Model_Button" element visibility on "Models" wizard
        Then "Register_Model_Button" element on "Models" should contains "Register Model" value

    @passive
    @demo
    Scenario: Check all mandatory components on Models tab on Demo mode from Demo Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Development_Links_Table" table on "Demo_Project" wizard with offset "false"
            |   name   |
            | Workflow |
        And wait load page
        Then verify "Monitor Workflows" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard

    @passive
    @demo
    Scenario: Check all mandatory components on Models Endpoint tab on Demo mode from Demo Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Deployment_Links_Table" table on "Demo_Project" wizard with offset "false"
            |      name       |
            | Model Endpoints |
        And wait load page
        Then verify "Model Endpoints (Beta)" tab is active in "Models_Tab_Selector" on "Models" wizard

    @passive
    @demo
    Scenario: Check all mandatory components on Real-Time Piplines tab on Demo mode from Demo Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Deployment_Links_Table" table on "Demo_Project" wizard with offset "false"
            |        name         |
            | Real Time Pipelines |
        And wait load page
        Then verify "Real-Time Pipelines" tab is active in "Models_Tab_Selector" on "Models" wizard

    @passive
    @demo
    Scenario: Check all mandatory components on Monitoring tab on Demo mode from Demo Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Deployment_Links_Table" table on "Demo_Project" wizard with offset "false"
            |    name    |
            | Monitoring |
        And wait load page
        Then verify breadcrumbs "project" label should be equal "default" value
        Then verify "Create_New" element visibility on "Project" wizard
        Then verify "Refresh_Button" element visibility on "Project" wizard
        Then verify "Dashboard_Realtime_Functions_Table" element visibility on "Project" wizard
        Then verify "Jobs_And_Workflows" element visibility on "Project" wizard
        Then verify "Mono_Values_Cards" element visibility on "Project" wizard
        Then verify "Jobs_Info_Card_Statistics" element visibility on "Project" wizard
        Then verify "Real_Time_Functions_Card_Statistics" element visibility on "Project" wizard
        When hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then verify "General_Info_Quick_Links" element visibility on "commonPagesHeader" wizard

    @passive
    Scenario: Check redirect to project`s job page
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify breadcrumbs "project" label should be equal "default" value
        # When click on cell with row index 1 in "name" column in "Jobs_And_Workflows" table on "Project" wizard
        Then click on "See_All_Jobs_Link" element on "Project" wizard
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

    @passive
    @links
    Scenario: Check redirect to project`s job Info Pane from Project Monitoring Page
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And save to context "name" column and "href" attributes on 1 row from "Jobs_And_Workflows" table on "Project" wizard
        When click on cell with row index 1 in "name" column in "Jobs_And_Workflows" table on "Project" wizard
        And wait load page
        Then verify "Arrow_Back" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Header" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Updated" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Tab_List"
        Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Overview_Headers" on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Overview_Headers"
        Then compare "Header" element value on "Jobs_Monitor_Tab_Info_Pane" wizard with test "cell" context value
        Then compare current browser URL with test "href" context value
