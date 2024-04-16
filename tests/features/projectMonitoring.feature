Feature: MLRun Project Page

    Testcases that verifies functionality on MLRun Project Page

    @MLPM
    @passive
    Scenario: MLPM002 - Check all mandatory components
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
    
    @MLPM
    @passive
    Scenario: MLNB001 - Check all mandatory components on Navigation Bar
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        #check the default state of 'Navigation_Bar'
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then "Navigation_Bar" on "commonPagesHeader" wizard should not be "pinned"
        #check visibility of menu buttons with pinned 'Navigation_Bar'
        Then click on "Pin_Quick_Link_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        Then "Navigation_Bar" on "commonPagesHeader" wizard should be "pinned"
        Then verify "Pin_Quick_Link_Button" element visibility on "commonPagesHeader" wizard
        Then verify "General_Info_Quick_Panel" element visibility on "commonPagesHeader" wizard
        Then verify "Project_Monitoring_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Quick_actions_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Feature_Store_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Datasets_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Artifacts_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Models_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Jobs_And_Workflows_Button" element visibility on "commonPagesHeader" wizard
        Then verify "ML_Functions_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Real_Time_Functions_Button" element visibility on "commonPagesHeader" wizard
        Then verify "API_Gateways_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Project_Settings_Button" element visibility on "commonPagesHeader" wizard
        #check invisibility of menu buttons and visibility of menu icons with unpinned 'Navigation_Bar'
        Then click on "Pin_Quick_Link_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        Then verify "Pin_Quick_Link_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "General_Info_Quick_Panel" element visibility on "commonPagesHeader" wizard
        Then verify "Project_Monitoring_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "Project_Monitoring_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "Quick_actions_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "Quick_actions_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "Feature_Store_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "Feature_Store_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "Datasets_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "Datasets_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "Artifacts_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "Artifacts_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "Models_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "Models_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "Jobs_And_Workflows_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "Jobs_And_Workflows_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "ML_Functions_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "ML_Functions_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "Real_Time_Functions_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "Real_Time_Functions_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "API_Gateways_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "API_Gateways_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "Project_Settings_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "Project_Settings_Icon" element visibility on "commonPagesHeader" wizard
        #check that 'Navigation_Bar' save the state through different pages
        Then "Navigation_Bar" on "commonPagesHeader" wizard should not be "pinned"
        Then click on "ML_Functions_Icon" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then "Navigation_Bar" on "commonPagesHeader" wizard should not be "pinned"
        Then click on "Jobs_And_Workflows_Icon" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then "Navigation_Bar" on "commonPagesHeader" wizard should not be "pinned"
        Then click on "Feature_Store_Icon" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then "Navigation_Bar" on "commonPagesHeader" wizard should not be "pinned"
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on "Pin_Quick_Link_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        Then "Navigation_Bar" on "commonPagesHeader" wizard should be "pinned"
        Then click on "Project_Monitoring_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then "Navigation_Bar" on "commonPagesHeader" wizard should be "pinned"
        Then click on "Datasets_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then "Navigation_Bar" on "commonPagesHeader" wizard should be "pinned"
        Then click on "Project_Settings_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Secrets" tab in "Project_Settings_Tab_Selector" on "Project_Settings_General_Tab" wizard
        And wait load page
        Then "Navigation_Bar" on "commonPagesHeader" wizard should be "pinned"
        #check navigation between pages  Project monitoring and Quick-actions due to instance links
        Then click on "Project_Monitoring_Button" element on "commonPagesHeader" wizard
        Then click on "Project_Quick_Actions_Instance" element on "commonPagesHeader" wizard
        Then verify "Quick_actions_Active" not input element on "commonPagesHeader" wizard is active
        Then click on "Project_Monitoring_First_Instance" element on "commonPagesHeader" wizard
        Then verify "Project_Monitoring_Active" not input element on "commonPagesHeader" wizard is active
        Then click on "Project_Quick_Actions_Instance" element on "commonPagesHeader" wizard
        Then verify "Quick_actions_Active" not input element on "commonPagesHeader" wizard is active
        Then click on "Project_Monitoring_Second_Instance" element on "commonPagesHeader" wizard
        Then verify "Project_Monitoring_Active" not input element on "commonPagesHeader" wizard is active

    @MLPM
    @passive
    Scenario: MLPM003 - Check MLRun logo redirection
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on "MLRun_Logo" element on "commonPagesHeader" wizard
        And wait load page
        Then verify "Projects_Table" element visibility on "Projects" wizard

    @MLPM
    @passive
    @FAILED_TODO
    #TODO: bug #2339 Fix [Artifacts] refine UI text for Register Artifact
    Scenario: MLPM004 - Check all mandatory components on Register File Popup
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Create_New" element visibility on "Project" wizard
        Then verify "Create_New" dropdown element on "Project" wizard should contains "Project"."Create_New_Options"
        Then select "Register Artifact" option in "Create_New" dropdown on "Project" wizard
        Then "Title" element on "Register_File_Popup" should contains "Register Artifact" value
        Then "Form_Text" component on "Register_File_Popup" should contains "Register_Artifact"."Form_Text"
        Then "Form_Subtext" component on "Register_File_Popup" should contains "Register_Artifact"."Form_Subtext"
        Then verify "Cross_Cancel_Button" element visibility on "Register_File_Popup" wizard
        Then verify "New_File_Name_Input" element visibility on "Register_File_Popup" wizard
        Then type value " " to "New_File_Name_Input" field on "Register_File_Popup" wizard
        Then verify "New_File_Name_Input" on "Register_File_Popup" wizard should display options "Input_Hint"."Artifact_Name_Hint"
        Then verify "New_File_Name_Input" options rules on form "Register_File_Popup" wizard
        Then verify options in "Path_Scheme_Combobox" combobox in "Target_Path" on "Register_File_Popup" wizard should contains "Register_Artifact"."Combobox_Options"
        When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_File_Popup" wizard
        When type value "  " to "Path_Scheme_Combobox" field on "Target_Path" on "Register_File_Popup" wizard
        Then verify "Path_Scheme_Combobox" element in "Target_Path" on "Register_File_Popup" wizard should display warning "Input_Hint"."V3IO_Path_Hint"
        Then verify "New_File_Description_Input" element visibility on "Register_File_Popup" wizard
        Then type value "   " to "New_File_Description_Input" field on "Register_File_Popup" wizard
        Then verify "New_File_Description_Input" on "Register_File_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "New_File_Type_Dropdown" element visibility on "Register_File_Popup" wizard
        Then verify "New_File_Type_Dropdown" dropdown element on "Register_File_Popup" wizard should contains "Register_Artifact"."Type_Options"
        Then select "Table" option in "New_File_Type_Dropdown" dropdown on "Register_File_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Register_File_Popup" wizard
        Then "Cancel_Button" element on "Register_File_Popup" should contains "Cancel" value
        Then verify "Register_Button" element visibility on "Register_File_Popup" wizard
        Then "Register_Button" element on "Register_File_Popup" should contains "Register" value
        Then click on "Register_Button" element on "Register_File_Popup" wizard
        Then verify "Register_Button" element on "Register_File_Popup" wizard is disabled
        Then type value "artifact" to "New_File_Name_Input" field on "Register_File_Popup" wizard
        When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_File_Popup" wizard
        When type value "target/path" to "Path_Scheme_Combobox" field on "Target_Path" on "Register_File_Popup" wizard
        Then type value "new artifact description" to "New_File_Description_Input" field on "Register_File_Popup" wizard
        Then check "New_File_Description_Input" textarea counter on "Register_File_Popup" wizard
        Then verify "Register_Button" element on "Register_File_Popup" wizard is enabled
        Then click on "Cancel_Button" element on "Register_File_Popup" wizard
        Then verify if "Common_Popup" popup dialog appears
        Then click on "Cancel_Button" element on "Common_Popup" wizard
        Then verify if "Register_Dataset" popup dialog appears
        Then verify "New_File_Name_Input" input should contains "artifact" value on "Register_File_Popup" wizard
        Then verify "Path_Scheme_Combobox" input should contains "target/path" value in "Target_Path" on "Register_File_Popup" wizard
        Then verify "New_File_Description_Input" input should contains "new artifact description" value on "Register_File_Popup" wizard
        Then verify "New_File_Type_Dropdown" dropdown on "Register_File_Popup" wizard selected option value "Table"

    @MLPM
    @FAILED_TODO
    #TODO: 'Register Model' option is missing in list of 'Create New' dropdown in demo mode
    @passive
    Scenario: MLPM005 - Check all mandatory components on Register Model Popup
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Create_New" element visibility on "Project" wizard
        Then verify "Create_New" dropdown element on "Project" wizard should contains "Project"."Create_New_Options"
        Then select "Register Model" option in "Create_New" dropdown on "Project" wizard
        Then "Title" element on "Register_Model_Popup" should contains "Register Model" value
        Then verify "Cross_Cancel_Button" element visibility on "Register_Model_Popup" wizard
        Then verify "New_File_Name_Input" element visibility on "Register_Model_Popup" wizard
        Then verify options in "Path_Scheme_Combobox" combobox in "Target_Path" on "Register_Model_Popup" wizard should contains "Models"."Combobox_Options"
        Then verify "New_File_Description_Input" element visibility on "Register_Model_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Register_Model_Popup" wizard
        Then verify "Register_Button" element visibility on "Register_Model_Popup" wizard
        Then click on "Register_Button" element on "Register_Model_Popup" wizard
        Then type value "   " to "New_File_Name_Input" field on "Register_Model_Popup" wizard
        Then verify "New_File_Name_Input" on "Register_Model_Popup" wizard should display options "Input_Hint"."Artifact_Name_Hint"
        When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_Model_Popup" wizard
        When type value "  " to "Path_Scheme_Combobox" field on "Target_Path" on "Register_Model_Popup" wizard
        Then verify "Path_Scheme_Combobox" element in "Target_Path" on "Register_Model_Popup" wizard should display warning "Input_Hint"."V3IO_Path_Hint"
        Then type value "   " to "New_File_Description_Input" field on "Register_Model_Popup" wizard
        Then verify "New_File_Description_Input" on "Register_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        When add rows to "Labels_Table" table on "Register_Model_Popup" wizard
            | key_input | value_input |
            |    key1   |    value1   |
            |    key2   |    value2   |
            |    key3   |    value3   |
        Then verify values in "Labels_Table" table on "Register_Model_Popup" wizard with attribute
            | key_verify | value_verify | 
            |    key1    |    value1    |
            |    key2    |    value2    |
            |    key3    |    value3    |
        When click on "remove_btn" in "Labels_Table" table on "Register_Model_Popup" wizard with attribute
            | key_verify | 
            |    key1    |    
            |    key3    |      
        Then verify values in "Labels_Table" table on "Register_Model_Popup" wizard with attribute
            | key_verify | value_verify | 
            |    key2    |    value2    |

    @MLPM
    @passive
    Scenario: MLPM006 - Check all mandatory components on Register Dataset Popup
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Create_New" element visibility on "Project" wizard
        Then verify "Create_New" dropdown element on "Project" wizard should contains "Project"."Create_New_Options"
        Then select "Register Dataset" option in "Create_New" dropdown on "Project" wizard
        Then "Title" element on "Register_Dataset" should contains "Register Dataset" value
        Then "Form_Text" component on "Register_Dataset" should contains "Register_Dataset"."Form_Text"
        Then "Form_Subtext" component on "Register_Dataset" should contains "Register_Dataset"."Form_Subtext"
        Then verify "Name_Input" element visibility on "Register_Dataset" wizard
        Then type value "   " to "Name_Input" field on "Register_Dataset" wizard
        Then verify "Name_Input" on "Register_Dataset" wizard should display options "Input_Hint"."Artifact_Name_Hint"
        Then verify "Name_Input" options rules on form "Register_Dataset" wizard
        Then verify options in "Path_Scheme_Combobox" combobox in "Target_Path" on "Register_Dataset" wizard should contains "Register_Dataset"."Combobox_Options"
        When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_Dataset" wizard
        When type value "  " to "Path_Scheme_Combobox" field on "Target_Path" on "Register_Dataset" wizard
        Then verify "Path_Scheme_Combobox" element in "Target_Path" on "Register_Dataset" wizard should display warning "Input_Hint"."V3IO_Path_Hint"
        Then verify "Description_Input" element visibility on "Register_Dataset" wizard
        Then type value "   " to "Description_Input" field on "Register_Dataset" wizard
        Then verify "Description_Input" on "Register_Dataset" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "Cancel_Button" element visibility on "Register_Dataset" wizard
        Then "Cancel_Button" element on "Register_Dataset" should contains "Cancel" value
        Then verify "Register_Button" element visibility on "Register_Dataset" wizard
        Then "Register_Button" element on "Register_Dataset" should contains "Register" value
        Then click on "Register_Button" element on "Register_Dataset" wizard
        Then verify "Register_Button" element on "Register_Dataset" wizard is disabled
        Then type value "dataset" to "Name_Input" field on "Register_Dataset" wizard
        When type value "target/path" to "Path_Scheme_Combobox" field on "Target_Path" on "Register_Dataset" wizard
        Then type value "new dataset description" to "Description_Input" field on "Register_Dataset" wizard
        Then check "Description_Input" textarea counter on "Register_Dataset" wizard
        Then verify "Register_Button" element on "Register_Dataset" wizard is enabled
        Then click on "Cancel_Button" element on "Register_Dataset" wizard
        Then verify if "Common_Popup" popup dialog appears
        Then click on "Cancel_Button" element on "Common_Popup" wizard
        Then verify if "Register_Dataset" popup dialog appears
        Then verify "Name_Input" input should contains "dataset" value on "Register_Dataset" wizard
        Then verify "Path_Scheme_Combobox" input should contains "target/path" value in "Target_Path" on "Register_Dataset" wizard
        Then verify "Description_Input" input should contains "new dataset description" value on "Register_Dataset" wizard
    
    @MLPM
    @passive
    Scenario: MLPM007 - Check all mandatory components on Batch run
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Create_New" element visibility on "Project" wizard
        Then verify "Create_New" dropdown element on "Project" wizard should contains "Project"."Create_New_Options"
        Then select "Batch run" option in "Create_New" dropdown on "Project" wizard
        And wait load page
        Then verify "Title" element visibility on "Modal_Wizard_Form" wizard
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Run" value
        Then verify "Cross_Close_Button" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Wizard_Steps_Content" element visibility on "Modal_Wizard_Form" wizard
        And click on row root with value "test" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "test" value
        Then verify "Step_1_Button" element on "commonPagesHeader" wizard is enabled
        Then "Step_1_Button_text" element on "commonPagesHeader" should contains "Function Selection" value
        Then verify "Step_2_Button" element on "commonPagesHeader" wizard is enabled
        Then "Step_2_Button_text" element on "commonPagesHeader" should contains "Run Details" value
        Then verify "Step_3_Button" element on "commonPagesHeader" wizard is enabled
        Then "Step_3_Button_text" element on "commonPagesHeader" should contains "Data Inputs" value
        Then verify "Step_4_Button" element on "commonPagesHeader" wizard is enabled
        Then "Step_4_Button_text" element on "commonPagesHeader" should contains "Parameters" value
        Then verify "Step_5_Button" element on "commonPagesHeader" wizard is enabled
        Then "Step_5_Button_text" element on "commonPagesHeader" should contains "Resources" value
        Then verify "Step_6_Button" element on "commonPagesHeader" wizard is enabled
        Then "Step_6_Button_text" element on "commonPagesHeader" should contains "Advanced" value
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
        Then verify "Schedule_For_Later_Button" element on "Modal_Wizard_Form" wizard is enabled
        Then verify "Run_Button" element on "Modal_Wizard_Form" wizard is enabled
        Then verify "Back_Button" element not exists on "Modal_Wizard_Form" wizard
        Then verify "Form_Header_Function_Selection" element visibility on "commonPagesHeader" wizard
        Then verify "Function_Selection_Tabs" on "Modal_Wizard_Form" wizard should contains "Modal_Wizard_Form"."Tab_List"
        Then verify "Search_Input" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Project_Selector_Dropdown" element visibility on "Modal_Wizard_Form" wizard
        Then select "Hub" tab in "Function_Selection_Tabs" on "Modal_Wizard_Form" wizard
        And wait load page
        Then verify "Filter_Button_Hub_Tab" element visibility on "Modal_Wizard_Form" wizard
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then "Form_Header_Run_Details" element on "commonPagesHeader" should contains "Run Details" value
        Then "Hyperparameter_Checkbox" element should be unchecked on "Modal_Wizard_Form" wizard
        Then verify "Run_Name_Input" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Version_Tag_Dropdown" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Handler_Dropdown" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Labels_Table" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Image_Name_Input_Run_Details" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Back_Button" element on "Modal_Wizard_Form" wizard is enabled
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then "Form_Header_Data_Inputs" element on "commonPagesHeader" should contains "Data Inputs" value
        Then verify "Data_Inputs_Headers" on "Modal_Wizard_Form" wizard should contains "Modal_Wizard_Form"."Data_Inputs_Table_Header"
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then "Form_Header_Parameters" element on "commonPagesHeader" should contains "Parameters" value
        Then verify "Parameters_Headers" on "Modal_Wizard_Form" wizard should contains "Modal_Wizard_Form"."Parameters_Table_Header"
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then verify "Volumes_Subheader" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Volume_Paths_Table" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Request_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Request_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Limit_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Limit_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Request_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Request_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "GPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then "Form_Header_Advanced" element on "commonPagesHeader" should contains "Advanced" value
        Then "Accordion_Advanced_Subheader" element on "Modal_Wizard_Form" should contains "Environment variables" value
        Then verify "Advanced_Environment_Variables_Table" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Default_Input_Path_Input" element visibility in "Advanced_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Default_Artifact_Path_Input" element visibility in "Advanced_Accordion" on "Modal_Wizard_Form" wizard
        Then "Default_Artifact_Path_Input" element in "Advanced_Accordion" on "Modal_Wizard_Form" should contains "v3io:///projects/{{run.project}}/artifacts/{{run.uid}}" attribute value
        Then verify "Access_Key_Checkbox" element visibility on "Modal_Wizard_Form" wizard
        Then uncheck "Access_Key_Checkbox" element on "Modal_Wizard_Form" wizard
        Then verify "Access_Key_Input" element visibility on "Modal_Wizard_Form" wizard
        And click on "Step_2_Button" element on "commonPagesHeader" wizard
        Then check "Hyperparameter_Checkbox" element on "Modal_Wizard_Form" wizard
        And click on "Step_5_Button" element on "commonPagesHeader" wizard
        Then "Form_Header_Hyperparameter_Strategy" element on "commonPagesHeader" should contains "Hyperparameter strategy" value
        Then verify "Strategy_Dropdown" element visibility in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Max_Iterations" element visibility in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Max_Errors" element visibility in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard
        Then "Ranking_Subheader" element on "Modal_Wizard_Form" should contains "Ranking" value
        Then verify "Ranking_Result_Input" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Ranking_Criteria_Dropdown" dropdown element on "Modal_Wizard_Form" wizard should contains "Common_Lists"."Ranking_Criteria_List"
        Then "Stop_Condition_Subheader" element on "Modal_Wizard_Form" should contains "Stop condition" value
        Then verify "Stop_Condition_Input" element visibility on "Modal_Wizard_Form" wizard
        Then "Parallelism_Subheader" element on "Modal_Wizard_Form" should contains "Parallelism" value
        Then verify "Parallel_Runs_Number_Input" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Dask_Clutter_URL_Input" element visibility on "Modal_Wizard_Form" wizard
        Then "Teardown_Checkbox" element should be unchecked on "Modal_Wizard_Form" wizard
    
    @MLPM
    @passive
    Scenario: MLPM008 - Check all mandatory components on Create ML Function - Job runtime
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Create_New" element visibility on "Project" wizard
        Then verify "Create_New" dropdown element on "Project" wizard should contains "Project"."Create_New_Options"
        And turn on demo mode
        And wait load page
        Then select "ML Function" option in "Create_New" dropdown on "Project" wizard
        Then "Title" element on "Create_ML_Function_Popup" should contains "Create New Function" value
        And verify "Cross_Cancel_Button" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Name_Input" element visibility on "Create_ML_Function_Popup" wizard
        Then type value "   " to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Name_Input" on "Create_ML_Function_Popup" wizard should display options "Input_Hint"."Function_Name_Hint"
        Then verify "New_Function_Name_Input" options rules on "Create_ML_Function_Popup" wizard
        Then type value "   " to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Tag_Input" on "Create_ML_Function_Popup" wizard should display options "Input_Hint"."Function_Tag_Hint"
        Then verify "New_Function_Tag_Input" options rules on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Runtime_Dropdown" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "Continue_Button" element visibility on "Create_ML_Function_Popup" wizard
        And type value "demo-function-02" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        And type value "latest" to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        And click on "Continue_Button" element on "Create_ML_Function_Popup" wizard
        Then verify "Function_Description_Input" element visibility in "General_Accordion" on "New_Function" wizard
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
        Then verify "Memory_Request_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Limit_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Request_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Request_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Limit_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Request_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "GPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        When collapse "Resources_Accordion" on "New_Function" wizard
        Then verify "Function_Environment_Variables_Table" element visibility in "Environment_Variables_Accordion" on "New_Function" wizard
        When collapse "Environment_Variables_Accordion" on "New_Function" wizard
        Then verify "Access_Key_Checkbox" element visibility on "New_Function" wizard
        Then verify "Cancel_Button" element visibility on "New_Function" wizard
        Then verify "Save_Button" element visibility on "New_Function" wizard
        Then verify "Create_Button" element visibility on "New_Function" wizard

    @MLPM
    @passive
    Scenario: MLPM009 - Check all mandatory components on Create ML Function - Serving runtime
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Create_New" element visibility on "Project" wizard
        Then verify "Create_New" dropdown element on "Project" wizard should contains "Project"."Create_New_Options"
        And turn on demo mode
        And wait load page
        Then select "ML Function" option in "Create_New" dropdown on "Project" wizard
        Then "Title" element on "Create_ML_Function_Popup" should contains "Create New Function" value
        And verify "Cross_Cancel_Button" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Name_Input" element visibility on "Create_ML_Function_Popup" wizard
        Then type value "   " to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Name_Input" on "Create_ML_Function_Popup" wizard should display options "Input_Hint"."Function_Name_Hint"
        Then verify "New_Function_Name_Input" options rules on "Create_ML_Function_Popup" wizard
        Then type value "   " to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Tag_Input" on "Create_ML_Function_Popup" wizard should display options "Input_Hint"."Function_Tag_Hint"
        Then verify "New_Function_Tag_Input" options rules on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Runtime_Dropdown" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "Continue_Button" element visibility on "Create_ML_Function_Popup" wizard
        And type value "demo-function-02" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        And type value "latest" to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        And select "Serving" option in "New_Function_Runtime_Dropdown" dropdown on "Create_ML_Function_Popup" wizard
        And click on "Continue_Button" element on "Create_ML_Function_Popup" wizard
        Then verify "Function_Description_Input" element visibility in "General_Accordion" on "New_Function" wizard
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
        Then verify "Memory_Limit_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Request_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Request_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Request_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Request_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Limit_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
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

    @MLPM
    @passive
    Scenario: MLPM010 - Check all mandatory components on Create New Feature Set
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

    @MLPM
    @passive
    Scenario: MLPM011 - Check Project Counter redirection to Models page
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then click on cell with value "Models" in "name" column in "Mono_Values_Cards" table on "Project" wizard
        And wait load page
        Then verify "Table_Name_Filter_Input" element visibility on "Models" wizard
        Then click on "Table_FilterBy_Button" element on "Models" wizard
        Then verify "Table_Label_Filter_Input" element visibility on "Artifacts_FilterBy_Popup" wizard
        Then verify "Table_Tree_Filter_Dropdown" element visibility on "Artifacts_FilterBy_Popup" wizard
        Then verify "Show_Iterations_Checkbox" element visibility on "Artifacts_FilterBy_Popup" wizard
        Then verify "Table_Refresh_Button" element visibility on "Models" wizard
        Then verify "Models_Table" element visibility on "Models" wizard
        And turn on demo mode
        And wait load page
        Then verify "Register_Model_Button" element visibility on "Models" wizard
        Then "Register_Model_Button" element on "Models" should contains "Register model" value

    @MLPM
    @passive
    Scenario: MLPM012 - Check Project Counter redirection to Feature Sets page
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

    @MLPM
    @passive
    Scenario: MLPM013 - Check Project Counter redirection to Artifacts page
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then click on cell with value "Artifacts" in "name" column in "Mono_Values_Cards" table on "Project" wizard
        And wait load page
        Then verify "Table_Name_Filter_Input" element visibility on "Files" wizard
        Then click on "Table_FilterBy_Button" element on "Files" wizard
        Then verify "Table_Label_Filter_Input" element visibility on "Artifacts_FilterBy_Popup" wizard
        Then verify "Table_Tree_Filter_Dropdown" element visibility on "Artifacts_FilterBy_Popup" wizard
        Then verify "Show_Iterations_Checkbox" element visibility on "Artifacts_FilterBy_Popup" wizard
        Then verify "Table_Refresh_Button" element visibility on "Files" wizard
        Then verify "Files_Table" element visibility on "Files" wizard
        Then verify "Register_File_Button" element visibility on "Files" wizard
        Then "Register_File_Button" element on "Files" should contains "Register artifact" value

    @MLPM
    @passive
    Scenario: MLPM014 - Check Project Counter redirection to Monitor Jobs tab
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then click on cell with value "Running jobs" in "name" column in "Jobs_Info_Card_Statistics" table on "Project" wizard
        And wait load page
        Then verify "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard should contains "Jobs_And_Workflows"."Tab_List"
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "Batch_Run_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then "Batch_Run_Button" element on "Jobs_Monitor_Tab" should contains "Batch Run" value
        Then verify "Resource_Monitoring_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Status_Filter_Dropdown" element visibility on "Jobs_Monitor_Tab" wizard

    @MLPM
    @passive
    Scenario: MLPM015 - Check Project Counter redirection to Schedules tab
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

    @MLPM
    @passive
    Scenario: MLB003 - Verify behaviour of Breadcrumbs menu
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
        Then select "tab" with "Feature store" value in breadcrumbs menu
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Feature store" value
        Then verify "Feature_Sets_Table" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then select "tab" with "Artifacts" value in breadcrumbs menu
        And wait load page

    @MLPM
    @passive
    Scenario: MLPM016 - Check redirect to Jobs and workflows page using See All link
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify breadcrumbs "project" label should be equal "default" value
        Then select "Batch run" option in "Create_New" dropdown on "Project" wizard
        And wait load page
        And click on row root with value "test" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        And wait load page
        And click on "Run_Button" element on "Modal_Wizard_Form" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        And click on row root with value "test-func" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        And wait load page
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
        And wait load page
        And click on "Run_Button" element on "Modal_Wizard_Form" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on "Project_Monitoring_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then click on "See_All_Jobs_Link" element on "Project" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Jobs and workflows" value
        Then verify "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard should contains "Jobs_And_Workflows"."Tab_List"
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "Batch_Run_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then "Batch_Run_Button" element on "Jobs_Monitor_Tab" should contains "Batch Run" value
        Then verify "Resource_Monitoring_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Status_Filter_Dropdown" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown element on "Jobs_Monitor_Tab" wizard should contains "Dropdown_Options"."Status_Filter_Options"

    @MLPM
    @passive
    Scenario: MLPM017 - Check redirect to Job Info Pane overview from Project Monitoring Page
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And save to context "name" column and "href" attribute on 1 row from "Jobs_And_Workflows" table on "Project" wizard
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
        Then compare "Header" element value on "Jobs_Monitor_Tab_Info_Pane" wizard with test "name" context value
        Then compare current browser URL with test "href" context value

    @MLPM
    @passive
    Scenario: MLPM018 - Check all mandatory components on Consumer Groups tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then click on cell with value "Consumer groups" in "name" column in "Mono_Values_Cards" table on "Project" wizard
        And wait load page
        Then "Title" element on "Consumer_Groups" should contains "Consumer groups (v3io stream)" value
        Then "Description" element on "Consumer_Groups" should contains "This report displays the project's consumer groups for Iguazio v3io streams" value
        Then verify "Arrow_Back" element visibility on "Consumer_Groups" wizard
        Then verify "Search_Input" element visibility on "Consumer_Groups" wizard
        Then verify "Consumer_Groups_Table" element visibility on "Consumer_Groups" wizard
        Then click on "Arrow_Back" element on "Consumer_Groups" wizard
        And wait load page
        Then verify breadcrumbs "project" label should be equal "default" value
        Then verify "Create_New" element visibility on "Project" wizard
        Then verify "Refresh_Button" element visibility on "Project" wizard
        Then verify "Dashboard_Realtime_Functions_Table" element visibility on "Project" wizard
        Then verify "Jobs_And_Workflows" element visibility on "Project" wizard
        Then verify "Mono_Values_Cards" element visibility on "Project" wizard
        Then verify "Jobs_Info_Card_Statistics" element visibility on "Project" wizard
        Then verify "Real_Time_Functions_Card_Statistics" element visibility on "Project" wizard

    @MLPM
    @passive
    Scenario: MLPM019 - Verify filtering by name on Consumer Groups tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then click on cell with value "Consumer groups" in "name" column in "Mono_Values_Cards" table on "Project" wizard
        And wait load page
        Then verify "Search_Input" element visibility on "Consumer_Groups" wizard
        Then verify "Consumer_Groups_Table" element visibility on "Consumer_Groups" wizard
        Then type value "C" to "Search_Input" field on "Consumer_Groups" wizard
        Then value in "consumer_group_name" column with "text" in "Consumer_Groups_Table" on "Consumer_Groups" wizard should contains "C"
        Then type value "CONSUMER" to "Search_Input" field on "Consumer_Groups" wizard
        Then value in "consumer_group_name" column with "text" in "Consumer_Groups_Table" on "Consumer_Groups" wizard should contains "Consumer"
        Then type value "randomText" to "Search_Input" field on "Consumer_Groups" wizard
        Then check "ConsumerGroup1" value not in "consumer_group_name" column in "Consumer_Groups_Table" table on "Consumer_Groups" wizard

    @MLPM
    @passive
    Scenario: MLPM020 - Verify all mandatory components on Consumer Groups drill-down
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then click on cell with value "Consumer groups" in "name" column in "Mono_Values_Cards" table on "Project" wizard
        And wait load page
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
        Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."No_Consumer_Group_Yet"
        Then select "project" with "default" value in breadcrumbs menu
        And wait load page
        Then click on cell with value "Consumer groups" in "name" column in "Mono_Values_Cards" table on "Project" wizard
        And wait load page
        And save to context "consumer_group_name" column and "href" attribute on 1 row from "Consumer_Groups_Table" table on "Consumer_Groups" wizard
        And click on cell with row index 1 in "consumer_group_name" column in "Consumer_Groups_Table" table on "Consumer_Groups" wizard
        And wait load page
        Then compare current browser URL with test "href" context value
        Then compare "Title" element value on "Consumer_Groups" wizard with test "consumer_group_name" context value
        Then verify "Arrow_Back" element visibility on "Consumer_Groups" wizard
        Then verify "Search_Input" element visibility on "Consumer_Groups" wizard
        Then verify "Refresh_Button" element visibility on "Consumer_Groups" wizard
        Then verify "Shard_Lags_Table" element visibility on "Consumer_Groups" wizard
        Then click on "Arrow_Back" element on "Consumer_Groups" wizard
        And wait load page
        Then verify "Consumer_Groups_Table" element visibility on "Consumer_Groups" wizard
        Then "Title" element on "Consumer_Groups" should contains "Consumer groups (v3io stream)" value
        Then "Description" element on "Consumer_Groups" should contains "This report displays the project's consumer groups for Iguazio v3io streams" value
    
    @MLPM
    Scenario: MLPM021 - Verify filtering by name on Consumer Groups drill-down
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then click on cell with value "Consumer groups" in "name" column in "Mono_Values_Cards" table on "Project" wizard
        And wait load page
        And click on cell with row index 1 in "consumer_group_name" column in "Consumer_Groups_Table" table on "Consumer_Groups" wizard
        And wait load page
        Then verify "Search_Input" element visibility on "Consumer_Groups" wizard
        Then verify "Shard_Lags_Table" element visibility on "Consumer_Groups" wizard
        Then type value "SHARD" to "Search_Input" field on "Consumer_Groups" wizard
        Then click on "Refresh_Button" element on "Consumer_Groups" wizard
        Then value in "shard_name" column with "text" in "Shard_Lags_Table" on "Consumer_Groups" wizard should contains "shard"
        Then type value "shard-id-0" to "Search_Input" field on "Consumer_Groups" wizard
        Then value in "shard_name" column with "text" in "Shard_Lags_Table" on "Consumer_Groups" wizard should contains "shard-id-0"
        Then type value "randomText" to "Search_Input" field on "Consumer_Groups" wizard
        Then check "shard-id-0" value not in "shard_name" column in "Shard_Lags_Table" table on "Consumer_Groups" wizard