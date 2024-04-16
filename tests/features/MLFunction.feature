Feature: ML Functions

    Testcases that verifies functionality on ML Functions Pages

    @MLF
    @passive
    #TODO: ML-5137 - move create/edit 'function panel' to UI Demo mode
    Scenario: MLF005 - Check all mandatory components on ML Functions Page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify breadcrumbs "project" label should be equal "default" value
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "ML functions" value
        Then click on breadcrumbs "project" label on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify "Table_Name_Filter_Input" element visibility on "ML_Functions" wizard
        Then verify "Show_Untagged_Functions_Checkbox" element visibility on "ML_Functions" wizard
        And turn on demo mode
        And wait load page
        Then verify "New_Function_Button" element visibility on "ML_Functions" wizard
        Then "New_Function_Button" element on "ML_Functions" should contains "New" value
        Then verify "Table_Refresh_Button" element visibility on "ML_Functions" wizard
        Then verify "Table_Expand_Rows_Button" element visibility on "ML_Functions" wizard
        Then verify "Functions_Table" element visibility on "ML_Functions" wizard

    @MLF
    @passive
    Scenario: MLF006 - Verify filtering by function name on Functions page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "tab" with "Project monitoring" value in breadcrumbs menu
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And verify "Table_Name_Filter_Input" element visibility on "ML_Functions" wizard
        Then type value "test" to "Table_Name_Filter_Input" field on "ML_Functions" wizard
        Then click on "Table_Refresh_Button" element on "ML_Functions" wizard
        And wait load page
        Then value in "name" column with "text" in "Functions_Table" on "ML_Functions" wizard should contains "test"

    @MLF
    @passive
    Scenario: MLF007 - Check all mandatory components in Item infopane on Overview tab table
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Functions_Table" table on "ML_Functions" wizard
        Then verify "Header" element visibility on "ML_Function_Info_Pane" wizard
        Then verify "Updated" element visibility on "ML_Function_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "ML_Function_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" element visibility on "ML_Function_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "ML_Function_Info_Pane" wizard should contains "ML_Function_Info_Pane"."Tab_List"
        Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "ML_Function_Info_Pane" wizard
        Then verify "Overview_Headers" on "ML_Function_Info_Pane" wizard should contains "ML_Function_Info_Pane"."Overview_Headers"

    @MLF
    @passive
    Scenario: MLF008 - Verify all mandatory components on Delete existing function
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then select "Delete" option in action menu on "ML_Functions" wizard in "Functions_Table" table at row with "test-m" value in "name" column
        And wait load page
        Then "Title" element on "Common_Popup" should contains "Delete function?" value
        Then "Description" component on "Common_Popup" should be equal "Descriptions"."Delete_Function"
        Then verify "Cancel_Button" element visibility on "Common_Popup" wizard
        Then "Cancel_Button" element on "Common_Popup" should contains "Cancel" value
        Then verify "Delete_Button" element visibility on "Common_Popup" wizard
        Then "Delete_Button" element on "Common_Popup" should contains "Delete" value

    @MLF
    @passive
    Scenario: MLF009 - Verify all mandatory components on Delete existing function in Item infopane
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Functions_Table" table on "ML_Functions" wizard
        Then verify "Action_Menu" element visibility on "ML_Function_Info_Pane" wizard
        Then select "Delete" option in action menu on "ML_Function_Info_Pane" wizard
        And wait load page
        Then "Title" element on "Common_Popup" should contains "Delete function?" value
        Then "Description" component on "Common_Popup" should be equal "Descriptions"."Delete_Function"
        Then verify "Cancel_Button" element visibility on "Common_Popup" wizard
        Then "Cancel_Button" element on "Common_Popup" should contains "Cancel" value
        Then verify "Delete_Button" element visibility on "Common_Popup" wizard
        Then "Delete_Button" element on "Common_Popup" should contains "Delete" value

    @MLF
    @passive
    #TODO: ML-5137 - move create/edit 'function panel' to UI Demo mode
    Scenario: MLF003 - Check all mandatory components on Create ML Function Popup
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And turn on demo mode
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then click on "New_Function_Button" element on "ML_Functions" wizard
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
        Then "Cancel_Button" element on "Create_ML_Function_Popup" should contains "Cancel" value
        Then verify "Continue_Button" element visibility on "Create_ML_Function_Popup" wizard
        Then "Continue_Button" element on "Create_ML_Function_Popup" should contains "Continue" value

    @MLF
    @passive
    #TODO: ML-5137 - move create/edit 'function panel' to UI Demo mode
    Scenario: MLF010 - Check all mandatory components in General Accordion on create New Function page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And turn on demo mode
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And click on "New_Function_Button" element on "ML_Functions" wizard
        And type value "demo-function-00" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        And type value "latest" to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        And click on "Continue_Button" element on "Create_ML_Function_Popup" wizard
        Then verify "Cross_Close_Button" element visibility on "New_Function" wizard
        Then verify "Function_Name" element visibility in "General_Accordion" on "New_Function" wizard
        Then "Function_Name" element in "General_Accordion" on "New_Function" should contains "demo-function-00" value
        Then verify "Function_Tag" element visibility in "General_Accordion" on "New_Function" wizard
        Then "Function_Tag" element in "General_Accordion" on "New_Function" should contains "latest" value
        Then verify "Function_Runtime" element visibility in "General_Accordion" on "New_Function" wizard
        Then "Function_Runtime" element in "General_Accordion" on "New_Function" should contains "job" value
        Then verify "Function_Description_Input" element visibility in "General_Accordion" on "New_Function" wizard
        Then verify "Labels_Table" element visibility in "General_Accordion" on "New_Function" wizard
        When add rows to "Labels_Table" table in "General_Accordion" on "New_Function" wizard
            | key_input | value_input |
            |    key1   |    value1   |
            |    key2   |    value2   |
            |    key3   |    value3   |
        Then verify values in "Labels_Table" table in "General_Accordion" on "New_Function" wizard
            |       label     |
            | key1\n:\nvalue1 |
            | key2\n:\nvalue2 |
            | key3\n:\nvalue3 |
        When click on "remove_btn" in "Labels_Table" table in "General_Accordion" on "New_Function" wizard
            |       label     |
            | key1\n:\nvalue1 |
            | key3\n:\nvalue3 |
        Then verify values in "Labels_Table" table in "General_Accordion" on "New_Function" wizard
            |       label     |
            | key2\n:\nvalue2 |

    @MLF
    @passive
    #TODO: ML-5137 - move create/edit 'function panel' to UI Demo mode
    Scenario: MLF011 - Check all mandatory components in Code Accordion on create New Function page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And turn on demo mode
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And click on "New_Function_Button" element on "ML_Functions" wizard
        And type value "demo-function-01" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        And type value "latest" to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        And click on "Continue_Button" element on "Create_ML_Function_Popup" wizard
        When collapse "General_Accordion" on "New_Function" wizard
        Then verify "New_Function_Code_Entry_Dropdown" element visibility in "Code_Accordion" on "New_Function" wizard
        Then type value "   " to "New_Function_Handler_Input" field on "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Handler_Input" element in "Code_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "New_Function_Handler_Input" element in "Code_Accordion" on "New_Function" wizard should display hint "Input_Hint"."Function_Handler_Hint"
        Then is "Use_An_Existing_Image_Radiobutton" in "Code_Accordion" on "New_Function" selected
        Then is not "Build_A_New_Image_Radiobutton" in "Code_Accordion" on "New_Function" selected
        Then verify "New_Function_Image_Name_Input" element in "Code_Accordion" on "New_Function" wizard is enabled
        Then verify "New_Function_Resulting_Image_Input" element in "Code_Accordion" on "New_Function" wizard is disabled
        Then verify "New_Function_Base_Image_Input" element in "Code_Accordion" on "New_Function" wizard is disabled
        Then verify "New_Function_Build_Commands_Text_Area" element visibility in "Code_Accordion" on "New_Function" wizard
        Then type value "   " to "New_Function_Image_Name_Input" field on "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Image_Name_Input" element in "Code_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "New_Function_Image_Name_Input" element in "Code_Accordion" on "New_Function" wizard should display hint "Input_Hint"."Image_Name_Hint"
        When select "Build_A_New_Image_Radiobutton" in "Code_Accordion" on "New_Function"
        Then is "Build_A_New_Image_Radiobutton" in "Code_Accordion" on "New_Function" selected
        Then is not "Use_An_Existing_Image_Radiobutton" in "Code_Accordion" on "New_Function" selected
        Then verify "New_Function_Image_Name_Input" element in "Code_Accordion" on "New_Function" wizard is disabled
        Then verify "New_Function_Resulting_Image_Input" element in "Code_Accordion" on "New_Function" wizard is enabled
        Then verify "New_Function_Base_Image_Input" element in "Code_Accordion" on "New_Function" wizard is enabled
        Then type value "   " to "New_Function_Resulting_Image_Input" field on "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Resulting_Image_Input" element in "Code_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "New_Function_Resulting_Image_Input" element in "Code_Accordion" on "New_Function" wizard should display hint "Input_Hint"."Resulting_Image_Hint"
        Then type value "   " to "New_Function_Base_Image_Input" field on "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Base_Image_Input" element in "Code_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "New_Function_Base_Image_Input" element in "Code_Accordion" on "New_Function" wizard should display hint "Input_Hint"."Base_Image_Hint"

    @MLF
    @passive
    #TODO: ML-5137 - move create/edit 'function panel' to UI Demo mode
    Scenario: MLF012 - Check all mandatory components in Resources Accordion on create New Function page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And turn on demo mode
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And click on "New_Function_Button" element on "ML_Functions" wizard
        And type value "demo-function-02" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        And type value "latest" to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        And click on "Continue_Button" element on "Create_ML_Function_Popup" wizard
        When collapse "General_Accordion" on "New_Function" wizard
        When collapse "Code_Accordion" on "New_Function" wizard
        Then verify "Volumes_Subheader" element in "Resources_Accordion" on "New_Function" wizard should display hint "Label_Hint"."New_Job_Volumes"
        Then verify "New_Function_Volume_Mount_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "New_Function_Volume_Mount_Dropdown" element in "Resources_Accordion" on "New_Function" wizard should contains "Dropdown_Options"."Volume_Mount_Options"
        Then type value "0" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Limit_Number_Warning"
        Then type value "1" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then type value "1025" to "Memory_Request_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Limit_Number_Warning"
        Then verify "Memory_Request_Number_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Request_Number_Warning"
        Then type value "2" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then select "KB" option in "Memory_Limit_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Limit_Number_Warning"
        Then verify "Memory_Request_Number_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Request_Number_Warning"
        Then select "KB" option in "Memory_Request_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then type value "" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then type value "2" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then select "GB" option in "Memory_Request_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Limit_Number_Warning"
        Then verify "Memory_Request_Number_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Request_Number_Warning"
        Then select "cpu" option in "CPU_Request_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then increase value on 2 points in "CPU_Request_Number_Input" field with "cpu" on "Resources_Accordion" on "New_Function" wizard
        Then increase value on 1 points in "CPU_Limit_Number_Input" field with "cpu" on "Resources_Accordion" on "New_Function" wizard
        Then select "millicpu" option in "CPU_Limit_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then select "millicpu" option in "CPU_Request_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then type value "0" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Limit_Number_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Limit_Number_Warning"
        Then type value "1" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then type value "2" to "CPU_Request_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Limit_Number_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Limit_Number_Warning"
        Then verify "CPU_Request_Number_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Request_Number_Warning"
        Then type value "0" to "GPU_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then verify "GPU_Limit_Number_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."GPU_Minimum_Value_Warning"
        Then verify "Memory_Request_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Request_Dropdown" element in "Resources_Accordion" on "New_Function" wizard should contains "Dropdown_Options"."Memory_Unit_Options"
        Then verify "Memory_Request_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then type value "1" to "Memory_Request_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then increase value on 15 points in "Memory_Request_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then decrease value on 15 points in "Memory_Request_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Limit_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Limit_Dropdown" element in "Resources_Accordion" on "New_Function" wizard should contains "Dropdown_Options"."Memory_Unit_Options"
        Then verify "Memory_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then type value "2" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then increase value on 15 points in "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then decrease value on 15 points in "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Request_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Request_Dropdown" element in "Resources_Accordion" on "New_Function" wizard should contains "Dropdown_Options"."CPU_Unit_Options"
        Then verify "CPU_Request_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then type value "3" to "CPU_Request_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then increase value on 15 points in "CPU_Request_Number_Input" field with "millicpu" on "Resources_Accordion" on "New_Function" wizard
        Then decrease value on 15 points in "CPU_Request_Number_Input" field with "millicpu" on "Resources_Accordion" on "New_Function" wizard
        Then select "cpu" option in "CPU_Request_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Request_Number_Input" input should contains "0.003" value in "Resources_Accordion" on "New_Function" wizard
        Then increase value on 8 points in "CPU_Request_Number_Input" field with "cpu" on "Resources_Accordion" on "New_Function" wizard
        Then decrease value on 8 points in "CPU_Request_Number_Input" field with "cpu" on "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Limit_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Limit_Dropdown" element in "Resources_Accordion" on "New_Function" wizard should contains "Dropdown_Options"."CPU_Unit_Options"
        Then verify "CPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then type value "4" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then increase value on 15 points in "CPU_Limit_Number_Input" field with "millicpu" on "Resources_Accordion" on "New_Function" wizard
        Then decrease value on 15 points in "CPU_Limit_Number_Input" field with "millicpu" on "Resources_Accordion" on "New_Function" wizard
        Then select "cpu" option in "CPU_Limit_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Limit_Number_Input" input should contains "0.004" value in "Resources_Accordion" on "New_Function" wizard
        Then increase value on 8 points in "CPU_Request_Number_Input" field with "cpu" on "Resources_Accordion" on "New_Function" wizard
        Then decrease value on 8 points in "CPU_Request_Number_Input" field with "cpu" on "Resources_Accordion" on "New_Function" wizard
        Then verify "GPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then type value "5" to "GPU_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then increase value on 15 points in "GPU_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then decrease value on 15 points in "GPU_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard

    @MLF
    @passive
    #TODO: ML-5137 - move create/edit 'function panel' to UI Demo mode
    Scenario: MLF013 - Verify behaviour of Volume Paths Table in Resources Accordion on create New Function page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And turn on demo mode
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And click on "New_Function_Button" element on "ML_Functions" wizard
        And type value "demo-function-03" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        And type value "latest" to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        And click on "Continue_Button" element on "Create_ML_Function_Popup" wizard
        When collapse "General_Accordion" on "New_Function" wizard
        When collapse "Code_Accordion" on "New_Function" wizard
        Then verify "Pods_Priority_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Pods_Priority_Dropdown" element in "Resources_Accordion" on "New_Function" wizard should contains "Dropdown_Options"."Pods_Priority"
        When select "Manual" option in "New_Function_Volume_Mount_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "New_Function" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Container_Input | Volume_Paths_Table_Access_Key_Input | Volume_Paths_Table_Resource_Path_Input | Add_New_Row_Button |
            |             V3IO                 |                                      |                               |                                    |                                     |                                        |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Access_Key_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "New_Function" wizard should display hint "Input_Hint"."Mount_Path_Hint"
        Then verify "Volume_Paths_Table_Container_Input" element in "Resources_Accordion" on "New_Function" wizard should display hint "Input_Hint"."Data_Container_Hint"
        Then verify "Volume_Paths_Table_Access_Key_Input" element in "Resources_Accordion" on "New_Function" wizard should display hint "Input_Hint"."DataAccess_Key_Hint"
        Then verify "Volume_Paths_Table_Resource_Path_Input" element in "Resources_Accordion" on "New_Function" wizard should display hint "Input_Hint"."Relative_Directory_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "New_Function" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "New_Function" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Config_Map_Input | Add_New_Row_Button |
            |           Config Map             |                                      |                               |                                     |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Config_Map_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "New_Function" wizard should display hint "Input_Hint"."Mount_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "New_Function" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "New_Function" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Secret_Name_Input | Add_New_Row_Button |
            |             Secret               |                                      |                               |                                      |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Config_Map_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "New_Function" wizard should display hint "Input_Hint"."Mount_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "New_Function" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "New_Function" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Claime_Name_Input | Add_New_Row_Button |
            |               PVC                |                                      |                               |                                      |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Claime_Name_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "New_Function" wizard should display hint "Input_Hint"."Mount_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "New_Function" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "New_Function" wizard using nontable inputs
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
        Then verify values in "Volume_Paths_Table" table in "Resources_Accordion" on "New_Function" wizard
            |  volume_name  |        path        |
            | Volume_Name_1 | /path/to/happines1 |
            | Volume_Name_3 | /path/to/happines3 |
            | Volume_Name_5 | /path/to/happines5 |
            | Volume_Name_7 | /path/to/happines7 |
            | Volume_Name_0 | /path/to/happines0 |
        When click on "Remove" in action menu in "Volume_Paths_Table" table in "Resources_Accordion" on "New_Function" wizard with offset "false"
            |  volume_name  |
            | Volume_Name_3 |
            | Volume_Name_0 |
        Then verify values in "Volume_Paths_Table" table in "Resources_Accordion" on "New_Function" wizard
            |  volume_name  |        path        |
            | Volume_Name_1 | /path/to/happines1 |
            | Volume_Name_5 | /path/to/happines5 |
            | Volume_Name_7 | /path/to/happines7 |
        When click on "Edit" in action menu in "Volume_Paths_Table" table in "Resources_Accordion" on "New_Function" wizard with offset "false"
            |  volume_name  |
            | Volume_Name_1 |
        Then type value "Edited_Name_1" to "Edit_Volume_Name_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then type value "/newPath/to/happines1" to "Edit_Volume_Path_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then click on "Apply_Edit_Button" element in "Resources_Accordion" on "New_Function" wizard
        When click on "Edit" in action menu in "Volume_Paths_Table" table in "Resources_Accordion" on "New_Function" wizard with offset "false"
            |  volume_name  |
            | Volume_Name_7 |
        Then type value "Edited_Name_7" to "Edit_Volume_Name_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then type value "/newPath/to/happines7" to "Edit_Volume_Path_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then click on "Apply_Edit_Button" element in "Resources_Accordion" on "New_Function" wizard
        Then verify values in "Volume_Paths_Table" table in "Resources_Accordion" on "New_Function" wizard
            |  volume_name  |        path           |
            | Edited_Name_1 | /newPath/to/happines1 |
            | Volume_Name_5 | /path/to/happines5    |
            | Edited_Name_7 | /newPath/to/happines7 |

    @MLF
    @passive
    #TODO: ML-5137 - move create/edit 'function panel' to UI Demo mode
    Scenario: MLF014 - Check all mandatory components in Resources Accordion on create New Function page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And turn on demo mode
        And wait load page
        And click on "New_Function_Button" element on "ML_Functions" wizard
        And type value "demo-function-04" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        And type value "latest" to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        And click on "Continue_Button" element on "Create_ML_Function_Popup" wizard
        When collapse "General_Accordion" on "New_Function" wizard
        When collapse "Code_Accordion" on "New_Function" wizard
        When collapse "Resources_Accordion" on "New_Function" wizard
        When add new volume rows to "Function_Environment_Variables_Demo_Table" table in "Environment_Variables_Accordion" on "New_Function" wizard using nontable inputs
            | Function_Environment_Variables_Name_Input | Function_Environment_Variables_Type_Dropdown | Function_Environment_Variables_Value_Input | Add_Row_Button |
            |                                           |                    Value                     |                                            |       yes      |
        Then verify "Function_Environment_Variables_Name_Input" element in "Environment_Variables_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Function_Environment_Variables_Value_Input" element in "Environment_Variables_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        When click on "Discard_Row_Button" element in "Environment_Variables_Accordion" on "New_Function" wizard
        When add new volume rows to "Function_Environment_Variables_Demo_Table" table in "Environment_Variables_Accordion" on "New_Function" wizard using nontable inputs
            | Function_Environment_Variables_Name_Input | Function_Environment_Variables_Type_Dropdown | Function_Environment_Variables_Secret_Name_Input | Function_Environment_Variables_Secret_Key_Input | Add_Row_Button |
            |                                           |                    Secret                    |                                                 |                        @#$                     |       yes      |
        Then verify "Function_Environment_Variables_Name_Input" element in "Environment_Variables_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Function_Environment_Variables_Secret_Name_Input" element in "Environment_Variables_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Function_Environment_Variables_Secret_Name_Input" element in "Environment_Variables_Accordion" on "New_Function" wizard should display hint "Input_Hint"."SECRET_INPUT_HINT"
        Then verify "Function_Environment_Variables_Secret_Key_Input" element in "Environment_Variables_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "Function_Environment_Variables_Secret_Key_Input" element in "Environment_Variables_Accordion" on "New_Function" wizard should display hint "Input_Hint"."VALUE_INPUT_HINT"
        When click on "Discard_Row_Button" element in "Environment_Variables_Accordion" on "New_Function" wizard
        When add new volume rows to "Function_Environment_Variables_Demo_Table" table in "Environment_Variables_Accordion" on "New_Function" wizard using nontable inputs
            | Function_Environment_Variables_Name_Input | Function_Environment_Variables_Type_Dropdown | Function_Environment_Variables_Value_Input | Add_Row_Button | Discard_Row_Button |
            |                 name0                     |                    Value                     |                  value0                    |       yes      |                    |
            |                 name1                     |                    Value                     |                  value1                    |                |        yes         |
            |                 name2                     |                    Value                     |                  value2                    |       yes      |                    |
            |                 name3                     |                    Value                     |                  value3                    |                |        yes         |
            |                 name4                     |                    Value                     |                  value4                    |       yes      |                    |
            |                 name5                     |                    Value                     |                  value5                    |       yes      |                    |
            |                 name6                     |                    Value                     |                  value6                    |                |        yes         |
            |                 name7                     |                    Value                     |                  value7                    |                |        yes         |
            |                 name8                     |                    Value                     |                  value8                    |       yes      |                    |
            |                 name9                     |                    Value                     |                  value9                    |                |        yes         |
        When add new volume rows to "Function_Environment_Variables_Demo_Table" table in "Environment_Variables_Accordion" on "New_Function" wizard using nontable inputs
            | Function_Environment_Variables_Name_Input | Function_Environment_Variables_Type_Dropdown | Function_Environment_Variables_Secret_Name_Input | Function_Environment_Variables_Secret_Key_Input | Add_Row_Button | Discard_Row_Button |
            |                 name0                     |                    Secret                    |                  value0                         |                    key0                        |                |        yes         |
            |                 name1                     |                    Secret                    |                  value1                         |                    key1                        |       yes      |                    |
            |                 name2                     |                    Secret                    |                  value2                         |                    key2                        |                |        yes         |
            |                 name3                     |                    Secret                    |                  value3                         |                    key3                        |       yes      |                    |
            |                 name4                     |                    Secret                    |                  value4                         |                    key4                        |                |        yes         |
            |                 name5                     |                    Secret                    |                  value5                         |                    key5                        |                |        yes         |
            |                 name6                     |                    Secret                    |                  value6                         |                    key6                        |       yes      |                    |
            |                 name7                     |                    Secret                    |                  value7                         |                    key7                        |       yes      |                    |
            |                 name8                     |                    Secret                    |                  value8                         |                    key8                        |                |        yes         |
            |                 name9                     |                    Secret                    |                  value9                         |                    key9                        |       yes      |                    |
        Then verify values in "Function_Environment_Variables_Demo_Table" table in "Environment_Variables_Accordion" on "New_Function" wizard
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
        When click on "Delete" in action menu in "Function_Environment_Variables_Demo_Table" table in "Environment_Variables_Accordion" on "New_Function" wizard with offset "false"
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
        When click on "Edit" in action menu in "Function_Environment_Variables_Demo_Table" table in "Environment_Variables_Accordion" on "New_Function" wizard with offset "false"
            | name  |
            | name5 |
        Then type value "Edited_Name_5" to "Edit_Function_Environment_Variables_Name_Input" field on "Environment_Variables_Accordion" on "New_Function" wizard
        Then select "Secret" option in "Edit_Function_Environment_Variables_Type_Dropdown" dropdown on "Environment_Variables_Accordion" on "New_Function" wizard
        Then type value "secret" to "Edit_Function_Environment_Variables_Secret_Name_Input" field on "Environment_Variables_Accordion" on "New_Function" wizard
        Then type value "123" to "Edit_Function_Environment_Variables_Secret_Key_Input" field on "Environment_Variables_Accordion" on "New_Function" wizard
        Then click on "Apply_Edit_Button" element in "Environment_Variables_Accordion" on "New_Function" wizard
        When click on "Edit" in action menu in "Function_Environment_Variables_Demo_Table" table in "Environment_Variables_Accordion" on "New_Function" wizard with offset "false"
            | name  |
            | name6 |
        Then type value "Edited_Name_6" to "Edit_Function_Environment_Variables_Name_Input" field on "Environment_Variables_Accordion" on "New_Function" wizard
        Then select "Value" option in "Edit_Function_Environment_Variables_Type_Dropdown" dropdown on "Environment_Variables_Accordion" on "New_Function" wizard
        Then type value "Edited_Value6" to "Edit_Function_Environment_Variables_Value_Input" field on "Environment_Variables_Accordion" on "New_Function" wizard
        Then click on "Apply_Edit_Button" element in "Environment_Variables_Accordion" on "New_Function" wizard
        Then verify values in "Function_Environment_Variables_Demo_Table" table in "Environment_Variables_Accordion" on "New_Function" wizard
            | name          |  type  |    value      |
            | name0         | value  | value0        |
            | Edited_Name_5 | secret | secret:123    |
            | name3         | secret | value3:key3   |
            | Edited_Name_6 | value  | Edited_Value6 |
        When collapse "Environment_Variables_Accordion" on "New_Function" wizard
        Then verify "Access_Key_Checkbox" element visibility on "New_Function" wizard
        Then uncheck "Access_Key_Checkbox" element on "New_Function" wizard
        Then verify "Access_Key_Input" element visibility on "New_Function" wizard
        Then type value "  " to "Access_Key_Input" field on "New_Function" wizard
        Then verify "Access_Key_Input" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then type value "" to "Access_Key_Input" field on "New_Function" wizard
        Then verify "Access_Key_Input" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Cancel_Button" element visibility on "New_Function" wizard
        Then "Cancel_Button" element on "New_Function" should contains "Cancel" value
        Then verify "Save_Button" element visibility on "New_Function" wizard
        Then "Save_Button" element on "New_Function" should contains "Save" value
        Then verify "Deploy_Button" element visibility on "New_Function" wizard
        Then "Deploy_Button" element on "New_Function" should contains "Create" value 
        And click on "Save_Button" element on "New_Function" wizard
        Then verify "Cancel_Button" element on "New_Function" wizard is enabled
        Then verify "Save_Button" element on "New_Function" wizard is disabled
        Then verify "Deploy_Button" element on "New_Function" wizard is disabled

    @MLF
    #TODO: ML-5137 - move create/edit 'function panel' to UI Demo mode
    Scenario: MLF015 - Save new ml-function
        * set tear-down property "function" created in "default" project with "new-aqa-function-00" value
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And turn on demo mode
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And click on "New_Function_Button" element on "ML_Functions" wizard
        And type value "new-aqa-function-00" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        And type value "latest" to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        And click on "Continue_Button" element on "Create_ML_Function_Popup" wizard
        Then "Function_Name" element in "General_Accordion" on "New_Function" should contains "new-aqa-function-00" value
        Then "Function_Tag" element in "General_Accordion" on "New_Function" should contains "latest" value
        Then "Function_Runtime" element in "General_Accordion" on "New_Function" should contains "job" value
        Then check "Function_Description_Input" textarea counter in "General_Accordion" on "New_Function" wizard
        Then type value "Some function description" to "Function_Description_Input" field on "General_Accordion" on "New_Function" wizard
        Then check "Function_Description_Input" textarea counter in "General_Accordion" on "New_Function" wizard
        When collapse "General_Accordion" on "New_Function" wizard
        Then type value "demo" to "New_Function_Handler_Input" field on "Code_Accordion" on "New_Function" wizard
        When collapse "General_Accordion" on "New_Function" wizard
        Then select "Low" option in "Pods_Priority_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then type value "1" to "Memory_Request_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then select "MB" option in "Memory_Request_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then type value "1000" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then select "KB" option in "Memory_Limit_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then select "millicpu" option in "CPU_Request_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then type value "10" to "CPU_Request_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then select "millicpu" option in "CPU_Limit_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then type value "50" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then type value "15" to "GPU_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        When collapse "Resources_Accordion" on "New_Function" wizard
        And set tear-down property "function" created in "default" project with "new-aqa-function-00" value
        Then click on "Save_Button" element on "New_Function" wizard
        And wait load page
        Then "Header" element on "ML_Function_Info_Pane" should contains "new-aqa-function-00" value
        Then check "new-aqa-function-00" value in "name" column in "Overview_Table" table on "ML_Function_Info_Pane" wizard
        Then check "job" value in "kind" column in "Overview_Table" table on "ML_Function_Info_Pane" wizard
        Then click on "Cross_Close_Button" element on "ML_Function_Info_Pane" wizard
        Then check "new-aqa-function-00" value in "name" column in "Functions_Table" table on "ML_Functions" wizard
        Then select "Edit" option in action menu on "ML_Functions" wizard in "Functions_Table" table at row with "new-aqa-function-00" value in "name" column
        And wait load page
        When collapse "General_Accordion" on "New_Function" wizard
        Then verify "New_Function_Handler_Input" input should contains "demo" value in "Code_Accordion" on "New_Function" wizard
        When collapse "Code_Accordion" on "New_Function" wizard
        Then verify "Pods_Priority_Dropdown" dropdown in "Resources_Accordion" on "New_Function" wizard selected option value "Low"
        Then verify "Memory_Request_Number_Input" input should contains "1" value in "Resources_Accordion" on "New_Function" wizard
        Then type value "" to "Memory_Request_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Request_Number_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Memory_Request_Dropdown" dropdown in "Resources_Accordion" on "New_Function" wizard selected option value "MB"
        Then verify "Memory_Limit_Number_Input" input should contains "1000" value in "Resources_Accordion" on "New_Function" wizard
        Then type value "" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Memory_Limit_Dropdown" dropdown in "Resources_Accordion" on "New_Function" wizard selected option value "KB"
        Then verify "CPU_Request_Number_Input" input should contains "10" value in "Resources_Accordion" on "New_Function" wizard
        Then type value "" to "CPU_Request_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Request_Number_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "CPU_Request_Dropdown" dropdown in "Resources_Accordion" on "New_Function" wizard selected option value "millicpu"
        Then verify "CPU_Limit_Number_Input" input should contains "50" value in "Resources_Accordion" on "New_Function" wizard
        Then type value "" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Limit_Number_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "CPU_Limit_Dropdown" dropdown in "Resources_Accordion" on "New_Function" wizard selected option value "millicpu"
        Then verify "GPU_Limit_Number_Input" input should contains "15" value in "Resources_Accordion" on "New_Function" wizard

    @MLF
    #TODO: ML-5137 - move create/edit 'function panel' to UI Demo mode
    Scenario: MLF016 - Deploy new ml-function with build new image option
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And turn on demo mode
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And click on "New_Function_Button" element on "ML_Functions" wizard
        And type value "new-aqa-function-01" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        And type value "latest" to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        And click on "Continue_Button" element on "Create_ML_Function_Popup" wizard
        When collapse "General_Accordion" on "New_Function" wizard
        Then type value "demo" to "New_Function_Handler_Input" field on "Code_Accordion" on "New_Function" wizard
        When select "Build_A_New_Image_Radiobutton" in "Code_Accordion" on "New_Function"
        When collapse "General_Accordion" on "New_Function" wizard
        When collapse "Resources_Accordion" on "New_Function" wizard
        And set tear-down property "function" created in "default" project with "new-aqa-function-00" value
        Then click on "Deploy_Button" element on "New_Function" wizard
        Then "Deploy_Button" element on "New_Function" should contains "Create" value
        Then click on "Cross_Close_Button" element on "ML_Function_Info_Pane" wizard
        Then check "new-aqa-function-01" value in "name" column in "Functions_Table" table on "ML_Functions" wizard

    @MLF
    Scenario: MLF017 - Delete ml-function
        * set tear-down property "function" created with "new-aqa-function-01" value
        * set tear-down property "project" created with "automation-test-name07" value
        * create "automation-test-name07" MLRun Project with code 201
        * create "new-aqa-function-01" Function with "job" kind and "latest" tag in "automation-test-name07" project with code 200
        And set tear-down property "function" created in "automation-test-name07" project with "new-aqa-function-01" value
        Given open url
        And wait load page
        And click on row root with value "automation-test-name07" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then check "new-aqa-function-01" value in "name" column in "Functions_Table" table on "ML_Functions" wizard
        And select "Delete" option in action menu on "ML_Functions" wizard in "Functions_Table" table at row with "new-aqa-function-01" value in "name" column
        And click on "Delete_Button" element on "Common_Popup" wizard
        Then check "new-aqa-function-01" value not in "name" column in "Functions_Table" table on "ML_Functions" wizard

    @MLF
    @passive
    #TODO: ML-5137 - move create/edit 'function panel' to UI Demo mode
    Scenario: MLF018 - Check all mandatory components in Serving Runtime Configuration Accordion on create New Serving Function page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And turn on demo mode
        And wait load page
        And click on "New_Function_Button" element on "ML_Functions" wizard
        And type value "demo-function-01" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        And type value "latest" to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        And select "Serving" option in "New_Function_Runtime_Dropdown" dropdown on "Create_ML_Function_Popup" wizard
        And click on "Continue_Button" element on "Create_ML_Function_Popup" wizard
        Then verify "Function_Runtime" element visibility in "General_Accordion" on "New_Function" wizard
        Then "Function_Runtime" element in "General_Accordion" on "New_Function" should contains "serving" value
        When collapse "General_Accordion" on "New_Function" wizard
        When collapse "Code_Accordion" on "New_Function" wizard
        When collapse "Resources_Accordion" on "New_Function" wizard
        When collapse "Environment_Variables_Accordion" on "New_Function" wizard
        Then verify "Topology_Router_Type_Dropdown" element visibility in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then verify "Serving_Runtime_Configuration_Model_Table" element visibility in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then verify "Model_Tracking_Checkbox" element visibility in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then verify "Secrets_Runtime_Configuration_Table" element visibility in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then verify "Stream_Path_Input" element visibility in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then verify "Stream_Path_Input" element in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard should display hint "Input_Hint"."Stream_Path_Hint"
        Then verify "Parameters_Runtime_Configuration_Table" element visibility in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard

    @MLF
    @passive
    #TODO: ML-5137 - move create/edit 'function panel' to UI Demo mode
    Scenario: MLF019 - Check Model Table in Serving Runtime Configuration Accordion on create New Serving Function page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And turn on demo mode
        And wait load page
        And click on "New_Function_Button" element on "ML_Functions" wizard
        And type value "demo-function-01" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        And type value "latest" to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        And select "Serving" option in "New_Function_Runtime_Dropdown" dropdown on "Create_ML_Function_Popup" wizard
        And click on "Continue_Button" element on "Create_ML_Function_Popup" wizard
        When collapse "General_Accordion" on "New_Function" wizard
        When collapse "Code_Accordion" on "New_Function" wizard
        When collapse "Resources_Accordion" on "New_Function" wizard
        When collapse "Environment_Variables_Accordion" on "New_Function" wizard
        When add new volume rows to "Serving_Runtime_Configuration_Model_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard using nontable inputs
            | Model_Table_Name_Input | Model_Table_Class_Input | Model_Table_Path_Input | Add_Model_Table_Row_Button | Discard_Model_Table_Row_Button |
            |          name0         |          class0         |         /path/0        |            yes             |                                |
            |          name1         |          class1         |         /path/1        |                            |               yes              |
            |          name2         |          class2         |         /path/2        |            yes             |                                |
            |          name3         |          class3         |         /path/3        |                            |               yes              |
            |          name4         |          class4         |         /path/4        |            yes             |                                |
            |          name5         |          class5         |         /path/5        |            yes             |                                |
            |          name6         |          class6         |         /path/6        |                            |               yes              |
            |          name7         |          class7         |         /path/7        |                            |               yes              |
            |          name8         |          class8         |         /path/8        |            yes             |                                |
            |          name9         |          class9         |         /path/9        |            yes             |                                |
        Then verify values in "Serving_Runtime_Configuration_Model_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
            | name  | class  |  path   |
            | name0 | class0 | /path/0 |
            | name2 | class2 | /path/2 |
            | name4 | class4 | /path/4 |
            | name5 | class5 | /path/5 |
            | name8 | class8 | /path/8 |
            | name9 | class9 | /path/9 |
        When click on "Remove" in action menu in "Serving_Runtime_Configuration_Model_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
            | name  |
            | name0 |
            | name2 |
            | name9 |
            | name5 |
        Then verify values in "Serving_Runtime_Configuration_Model_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
            | name  | class  |  path   |
            | name4 | class4 | /path/4 |
            | name8 | class8 | /path/8 |
        When click on "Edit" in action menu in "Serving_Runtime_Configuration_Model_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
            | name  |
            | name4 |
        Then type value "editedName4" to "Edit_Model_Table_Name_Input" field on "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then type value "edited_class4" to "Edit_Model_Table_Class_Input" field on "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then type value "edited/path/4" to "Edit_Model_Table_Path_Input" field on "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then click on "Apply_Edit_Button" element in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        When click on "Edit" in action menu in "Serving_Runtime_Configuration_Model_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
            | name  |
            | name8 |
        Then type value "editedName8" to "Edit_Model_Table_Name_Input" field on "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then type value "edited_class8" to "Edit_Model_Table_Class_Input" field on "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then type value "edited/path/8" to "Edit_Model_Table_Path_Input" field on "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then click on "Apply_Edit_Button" element in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then verify values in "Serving_Runtime_Configuration_Model_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
            | name        | class         |  path         |
            | editedName4 | edited_class4 | edited/path/4 |
            | editedName8 | edited_class8 | edited/path/8 |

    @MLF
    @passive
    #TODO: ML-5137 - move create/edit 'function panel' to UI Demo mode
    Scenario: MLF020 - Check Secret Table in Serving Runtime Configuration Accordion on create New Serving Function page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And turn on demo mode
        And wait load page
        And click on "New_Function_Button" element on "ML_Functions" wizard
        And type value "demo-function-01" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        And type value "latest" to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        And select "Serving" option in "New_Function_Runtime_Dropdown" dropdown on "Create_ML_Function_Popup" wizard
        And click on "Continue_Button" element on "Create_ML_Function_Popup" wizard
        When collapse "General_Accordion" on "New_Function" wizard
        When collapse "Code_Accordion" on "New_Function" wizard
        When collapse "Resources_Accordion" on "New_Function" wizard
        When collapse "Environment_Variables_Accordion" on "New_Function" wizard
        When add new volume rows to "Secrets_Runtime_Configuration_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard using nontable inputs
            | Secrets_Table_Value_Input | Apply_Secrets_Table_Row_Button |
            |           value0          |               yes              |
            |           value1          |               yes              |
            |           value2          |               yes              |
            |           value3          |               yes              |
            |           value4          |               yes              |
        Then verify values in "Secrets_Runtime_Configuration_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
            | kind | value  |
            | file | value0 |
            | file | value1 |
            | file | value2 |
            | file | value3 |
            | file | value4 |
        When click on "delete_btn" in "Secrets_Runtime_Configuration_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
            | value  |
            | value4 |
            | value2 |
            | value0 |
        Then verify values in "Secrets_Runtime_Configuration_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
            | kind | value  |
            | file | value1 |
            | file | value3 |
        Then edit 1 row in "Secrets_Runtime_Configuration_Table" key-value table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
            | value_input |
            | edited      |
        Then edit 2 row in "Secrets_Runtime_Configuration_Table" key-value table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
            | value_input |
            | edited      |
        Then verify values in "Secrets_Runtime_Configuration_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
            | kind | value        |
            | file | value1edited |
            | file | value3edited |

    @MLF
    @passive
    #TODO: ML-5137 - move create/edit 'function panel' to UI Demo mode
    Scenario: MLF021 - Check Parameters Table in Serving Runtime Configuration Accordion on create New Serving Function page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And turn on demo mode
        And wait load page
        And click on "New_Function_Button" element on "ML_Functions" wizard
        And type value "demo-function-01" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        And type value "latest" to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        And select "Serving" option in "New_Function_Runtime_Dropdown" dropdown on "Create_ML_Function_Popup" wizard
        And click on "Continue_Button" element on "Create_ML_Function_Popup" wizard
        When collapse "General_Accordion" on "New_Function" wizard
        When collapse "Code_Accordion" on "New_Function" wizard
        When collapse "Resources_Accordion" on "New_Function" wizard
        When collapse "Environment_Variables_Accordion" on "New_Function" wizard
        When add new volume rows to "Parameters_Runtime_Configuration_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard using nontable inputs
            | Parameters_Table_Name_Input | Parameters_Table_Type_Dropdown | Parameters_Table_Value_Input | Add_Parameter_Table_Row_Button | Remove_Parameter_Table_Row_Button |
            |            name0            |             String             |            valueA            |                                |               yes                 |
            |            name1            |             String             |            valueB            |                yes             |                                   |
            |            name2            |             String             |            valueC            |                yes             |                                   |
            |            name3            |             JSON               |            {"a": "b"}        |                yes             |                                   |
            |            name4            |             String             |            valueE            |                yes             |                                   |
        When add new volume rows to "Parameters_Runtime_Configuration_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard using nontable inputs
            | Parameters_Table_Name_Input | Parameters_Table_Type_Dropdown | Parameters_Table_Value_Number_Input | Add_Parameter_Table_Row_Button |
            |            name5            |             Number             |            123                      |                yes             |
        Then verify values in "Parameters_Runtime_Configuration_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
            | name  |  type  | value      |
            | name1 | string | valueB     |
            | name2 | string | valueC     |
            | name3 | json   | {"a": "b"} |
            | name4 | string | valueE     |
            | name5 | number | 123        |
        When click on "Remove" in action menu in "Parameters_Runtime_Configuration_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
            | name  |
            | name3 |
            | name2 |
            | name4 |
        Then verify values in "Parameters_Runtime_Configuration_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
            | name  |  type  | value  |
            | name1 | string | valueB |
            | name5 | number | 123    |
        When click on "Edit" in action menu in "Parameters_Runtime_Configuration_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
            | name  |
            | name1 |
        Then type value "editedName1" to "Edit_Parameters_Table_Name_Input" field on "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then select "JSON" option in "Edit_Parameters_Table_Type_Dropdown" dropdown on "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then type value "{\"key\":\"value\"}" to "Edit_Parameters_Table_Value_Input" field on "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then click on "Apply_Edit_Button" element in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        When click on "Edit" in action menu in "Parameters_Runtime_Configuration_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
            | name  |
            | name5 |
        Then type value "editedName5" to "Edit_Parameters_Table_Name_Input" field on "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then select "String" option in "Edit_Parameters_Table_Type_Dropdown" dropdown on "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then type value "editedValue" to "Edit_Parameters_Table_Value_Input" field on "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then click on "Apply_Edit_Button" element in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then verify values in "Parameters_Runtime_Configuration_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
            | name        |  type  | value           |
            | editedName1 | json   | {"key":"value"} |
            | editedName5 | string | editedValue     |

    @MLF
    @passive
    #TODO: ML-5137 - move create/edit 'function panel' to UI Demo mode
    Scenario: MLF022 - Verify non-unique value input hint on Create New Function page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And turn on demo mode
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And click on "New_Function_Button" element on "ML_Functions" wizard
        And type value "demo-function-5" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        And click on "Continue_Button" element on "Create_ML_Function_Popup" wizard
        When collapse "General_Accordion" on "New_Function" wizard
        When collapse "Code_Accordion" on "New_Function" wizard
        When select "Manual" option in "New_Function_Volume_Mount_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "New_Function" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Container_Input | Volume_Paths_Table_Access_Key_Input | Volume_Paths_Table_Resource_Path_Input | Add_New_Row_Button | Delete_New_Row_Button |
            |               V3IO               |            Volume_Name_1             |       /path/to/happines1      |         Container_Input_1          |           Access_Key_1              |            /resource/path_1            |         yes        |                       |
            |               V3IO               |            Volume_Name_1             |       /path/to/happines1      |         Container_Input_1          |           Access_Key_1              |            /resource/path_1            |         yes        |                       |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Name_Already_Exists"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Volumes_Path_Already_Exists"

    @MLF
    @passive
    #TODO: ML-5137 - move create/edit 'function panel' to UI Demo mode
    Scenario: MLF023 - Verify non-unique value input hint on Create New Serving Function page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And turn on demo mode
        And wait load page
        And click on "New_Function_Button" element on "ML_Functions" wizard
        And type value "demo-function-5" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        And select "Serving" option in "New_Function_Runtime_Dropdown" dropdown on "Create_ML_Function_Popup" wizard
        And click on "Continue_Button" element on "Create_ML_Function_Popup" wizard
        When collapse "General_Accordion" on "New_Function" wizard
        When collapse "Code_Accordion" on "New_Function" wizard
        When select "Manual" option in "New_Function_Volume_Mount_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "New_Function" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Container_Input | Volume_Paths_Table_Access_Key_Input | Volume_Paths_Table_Resource_Path_Input | Add_New_Row_Button | Delete_New_Row_Button |
            |               V3IO               |            Volume_Name_1             |       /path/to/happines1      |         Container_Input_1          |           Access_Key_1              |            /resource/path_1            |         yes        |                       |
            |               V3IO               |            Volume_Name_1             |       /path/to/happines1      |         Container_Input_1          |           Access_Key_1              |            /resource/path_1            |         yes        |                       |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Name_Already_Exists"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "New_JobTemplate_Edit" wizard should display warning "Input_Hint"."Volumes_Path_Already_Exists"
        When collapse "Resources_Accordion" on "New_Function" wizard
        When collapse "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        When add new volume rows to "Function_Environment_Variables_Demo_Table" table in "Environment_Variables_Accordion" on "New_Function" wizard using nontable inputs
            | Function_Environment_Variables_Name_Input | Function_Environment_Variables_Type_Dropdown | Function_Environment_Variables_Value_Input | Add_Row_Button | Discard_Row_Button |
            |                 name0                     |                    Value                     |                  value0                    |       yes      |                    |
            |                 name0                     |                    Value                     |                  value0                    |       yes      |                    |
        Then verify "Function_Environment_Variables_Name_Input" element in "Environment_Variables_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Name_Already_Exists"
        When collapse "Environment_Variables_Accordion" on "New_Function" wizard
        When expand "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        When add new volume rows to "Serving_Runtime_Configuration_Model_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard using nontable inputs
            | Model_Table_Name_Input | Model_Table_Class_Input | Model_Table_Path_Input | Add_Model_Table_Row_Button | Discard_Model_Table_Row_Button |
            |          name0         |          class0         |         /path/0        |            yes             |                                |
            |          name0         |          class0         |         /path/0        |            yes             |                                |
        Then verify "Model_Table_Name_Input" element in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Name_Already_Exists"
        When add new volume rows to "Parameters_Runtime_Configuration_Table" table in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard using nontable inputs
            | Parameters_Table_Name_Input | Parameters_Table_Type_Dropdown | Parameters_Table_Value_Input | Add_Parameter_Table_Row_Button | Remove_Parameter_Table_Row_Button |
            |            name0            |             String             |            valueA            |                yes             |                                   |
            |            name0            |             String             |            valueA            |                yes             |                                   |
        Then verify "Parameters_Table_Name_Input" element in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Name_Already_Exists"

    @MLF
    @passive
    Scenario: MLF024 - Check MLRun logo redirection
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And click on "MLRun_Logo" element on "commonPagesHeader" wizard
        And wait load page
        Then verify "Projects_Table" element visibility on "Projects" wizard

    @MLF
    @passive
    Scenario: MLF025 - Verify View YAML action
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then select "View YAML" option in action menu on "ML_Functions" wizard in "Functions_Table" table at row with "test-m" value in "name" column
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
        Then click on "Cross_Cancel_Button" element on "View_YAML" wizard
        Then click on cell with row index 7 in "expand_btn" column in "Functions_Table" table on "ML_Functions" wizard
        Then select "View YAML" option in action menu on "ML_Functions" wizard in "Functions_Table" table at row with "Nov 23, 2021, 11:31:51 AM" value in "name" column
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

    @MLF
    @passive
    Scenario: MLF026 - Verify View YAML action in Item infopane
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Functions_Table" table on "ML_Functions" wizard
        Then verify "Action_Menu" element visibility on "ML_Function_Info_Pane" wizard
        Then select "View YAML" option in action menu on "ML_Function_Info_Pane" wizard
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

    @MLF
    @passive
    #TODO: ML-5137 - move create/edit 'function panel' to UI Demo mode
    Scenario: MLF027 - Verify Edit action visibility in action menu
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And turn on demo mode
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify options in action menu on "ML_Functions" wizard in "Functions_Table" table with "Job" value in "kind" column should contains "ML_Functions_Tab"."Common_Action_Menu_Options"
        Then verify options in action menu on "ML_Functions" wizard in "Functions_Table" table with "Serving" value in "kind" column should contains "ML_Functions_Tab"."Serving_Action_Menu_Options"
        #TODO: check if serving function can be edited

    @MLF
    @passive
    #TODO: ML-5137 - move create/edit 'function panel' to UI Demo mode
    Scenario: MLF028 - Verify Edit action visibility in Item infopane for Job function
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And turn on demo mode
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        When click on cell with row index 2 in "name" column in "Functions_Table" table on "ML_Functions" wizard
        Then verify "Action_Menu" element visibility on "ML_Function_Info_Pane" wizard
        Then verify "Action_Menu" dropdown element on "ML_Function_Info_Pane" wizard should contains "ML_Functions_Tab"."Common_Action_Menu_Options"

    @MLF
    @passive
    #TODO: ML-5137 - move create/edit 'function panel' to UI Demo mode
    Scenario: MLF029 - Verify Edit action visibility in Item infopane for Serving function
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And turn on demo mode
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        When click on cell with row index 9 in "name" column in "Functions_Table" table on "ML_Functions" wizard
        Then verify "Action_Menu" element visibility on "ML_Function_Info_Pane" wizard
        Then verify "Action_Menu" dropdown element on "ML_Function_Info_Pane" wizard should contains "ML_Functions_Tab"."Serving_Action_Menu_Options"
        #TODO: check if serving function can be edited

    @MLF
    @passive
    #TODO: ML-5137 - move create/edit 'function panel' to UI Demo mode
    Scenario: MLF030 - Verify all mandatory component on Edit Function sidebar
        * set tear-down property "project" created with "automation-test" value
        * create "automation-test" MLRun Project with code 201
        * create "test-function" Function with "job" kind and "latest" tag in "automation-test" project with code 200
        Given open url
        And wait load page
        And click on row root with value "automation-test" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And turn on demo mode
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And save to context "name" column on 1 row from "Functions_Table" table on "ML_Functions" wizard
        And save to context "tag" column on 1 row from "Functions_Table" table on "ML_Functions" wizard
        Then select "Edit" option in action menu on "ML_Functions" wizard in "Functions_Table" table at row with "test-function" value in "name" column
        And wait load page
        Then compare "Function_Name" element value in "General_Accordion" on "New_Function" wizard with test "name" context value
        Then compare "Function_Tag" element value in "General_Accordion" on "New_Function" wizard with test "tag" context value
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
        Then verify "Force_Build_Checkbox" element visibility in "Code_Accordion" on "New_Function" wizard
        When collapse "Code_Accordion" on "New_Function" wizard
        Then verify "Pods_Priority_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Pods_Priority_Dropdown" dropdown in "Resources_Accordion" on "New_Function" wizard selected option value "Medium"
        Then verify "Pods_Priority_Dropdown" element in "Resources_Accordion" on "New_Function" wizard should contains "Dropdown_Options"."Pods_Priority"
        Then select "Low" option in "Pods_Priority_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then verify "Pods_Priority_Dropdown" dropdown in "Resources_Accordion" on "New_Function" wizard selected option value "Low"
        Then select "High" option in "Pods_Priority_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then verify "Pods_Priority_Dropdown" dropdown in "Resources_Accordion" on "New_Function" wizard selected option value "High"
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
        When collapse "Resources_Accordion" on "New_Function" wizard
        Then verify "Function_Environment_Variables_Table" element visibility in "Environment_Variables_Accordion" on "New_Function" wizard
        When collapse "Environment_Variables_Accordion" on "New_Function" wizard
        Then verify "Access_Key_Checkbox" element visibility on "New_Function" wizard
        Then uncheck "Access_Key_Checkbox" element on "New_Function" wizard
        Then verify "Access_Key_Input" element visibility on "New_Function" wizard
        Then type value "  " to "Access_Key_Input" field on "New_Function" wizard
        Then verify "Access_Key_Input" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then type value "" to "Access_Key_Input" field on "New_Function" wizard
        Then verify "Access_Key_Input" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Cancel_Button" element visibility on "New_Function" wizard
        Then "Cancel_Button" element on "New_Function" should contains "Cancel" value
        Then verify "Save_Button" element visibility on "New_Function" wizard
        Then "Save_Button" element on "New_Function" should contains "Save" value
        Then verify "Deploy_Button" element visibility on "New_Function" wizard
        Then "Deploy_Button" element on "New_Function" should contains "Create" value

    @MLF
    #TODO: ML-5137 - move create/edit 'function panel' to UI Demo mode
    Scenario: MLF033 - Verify Resources values on Function Deploy and Run
        * set tear-down property "project" created with "automation-test" value
        * set tear-down property "function" created in "automation-test" project with "new-aqa-function-00" value
        * create "automation-test" MLRun Project with code 201
        Given open url
        And wait load page
        And click on row root with value "automation-test" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And turn on demo mode
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And click on "New_Function_Button" element on "ML_Functions" wizard
        And type value "new-aqa-function-00" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        And type value "latest" to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        And click on "Continue_Button" element on "Create_ML_Function_Popup" wizard
        Then select "High" option in "Pods_Priority_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then verify "Pods_Priority_Dropdown" dropdown in "Resources_Accordion" on "New_Function" wizard selected option value "High"
        Then type value "1" to "Memory_Request_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then select "MB" option in "Memory_Request_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then type value "1000" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then select "KB" option in "Memory_Limit_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then select "millicpu" option in "CPU_Request_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then type value "6" to "CPU_Request_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then select "millicpu" option in "CPU_Limit_Dropdown" dropdown on "Resources_Accordion" on "New_Function" wizard
        Then type value "7" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then type value "99" to "GPU_Limit_Number_Input" field on "Resources_Accordion" on "New_Function" wizard
        Then click on "Deploy_Button" element on "New_Function" wizard
        And wait load page
        Then "Header" element on "ML_Function_Info_Pane" should contains "new-aqa-function-00" value
        Then select "tab" with "Jobs and workflows" value in breadcrumbs menu
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Run" value
        And click on row root with value "new-aqa-function-00" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "new-aqa-function-00" value
        And click on "Step_5_Button" element on "commonPagesHeader" wizard
        Then "Form_Header_Resources" element on "commonPagesHeader" should contains "Resources" value
        Then verify "Pods_Priority_Dropdown" dropdown in "Resources_Accordion" on "Modal_Wizard_Form" wizard selected option value "High"
        Then verify "Memory_Request_Number_Input" input should contains "1" value in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Request_Dropdown" dropdown in "Resources_Accordion" on "Modal_Wizard_Form" wizard selected option value "MB"
        Then verify "Memory_Limit_Number_Input" input should contains "1000" value in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Limit_Dropdown" dropdown in "Resources_Accordion" on "Modal_Wizard_Form" wizard selected option value "KB"
        Then verify "CPU_Request_Number_Input" input should contains "6" value in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Request_Dropdown" dropdown in "Resources_Accordion" on "Modal_Wizard_Form" wizard selected option value "millicpu"
        Then verify "CPU_Limit_Number_Input" input should contains "7" value in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Dropdown" dropdown in "Resources_Accordion" on "Modal_Wizard_Form" wizard selected option value "millicpu"
        Then verify "GPU_Limit_Number_Input" input should contains "99" value in "Resources_Accordion" on "Modal_Wizard_Form" wizard

    @MLF
    Scenario: MLF032 - Check broken link redirection
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on "Project_Monitoring_Button" element on "commonPagesHeader" wizard
        And wait load page
        And select "tab" with "ML functions" value in breadcrumbs menu
        And wait load page
        When click on cell with row index 1 in "name" column in "Functions_Table" table on "ML_Functions" wizard
        Then verify redirection from "projects/default/functions/INVALID/overview" to "projects/default/functions"
        When click on cell with row index 1 in "name" column in "Functions_Table" table on "ML_Functions" wizard
        Then verify redirection from "projects/default/functions/85957751e571a92e07213781f5e0c35bfbe42c64/INVALID" to "projects/default/functions/85957751e571a92e07213781f5e0c35bfbe42c64/overview"
        Then select "Code" tab in "Info_Pane_Tab_Selector" on "ML_Function_Info_Pane" wizard
        And wait load page
        Then verify redirection from "projects/default/functions/85957751e571a92e07213781f5e0c35bfbe42c64/INVALID" to "projects/default/functions/85957751e571a92e07213781f5e0c35bfbe42c64/overview"
        Then select "Build Log" tab in "Info_Pane_Tab_Selector" on "ML_Function_Info_Pane" wizard
        And wait load page
        Then verify redirection from "projects/default/functions/85957751e571a92e07213781f5e0c35bfbe42c64/INVALID" to "projects/default/functions/85957751e571a92e07213781f5e0c35bfbe42c64/overview"
        Then verify redirection from "projects/default/INVALID/85957751e571a92e07213781f5e0c35bfbe42c64/overview" to "projects"

    @MLF
    Scenario: MLF031 - Check active/highlited items with details panel on ML Function Info Pane
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then click on cell with row index 1 in "name" column in "Functions_Table" table on "ML_Functions" wizard
        And wait load page
        Then verify "Info_Pane_Tab_Selector" element visibility on "ML_Function_Info_Pane" wizard
        Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "ML_Function_Info_Pane" wizard
        Then verify "Header" element visibility on "ML_Function_Info_Pane" wizard
        Then save to context "name" column on 1 row from "Functions_Table" table on "ML_Functions" wizard
        Then compare "Header" element value on "ML_Function_Info_Pane" wizard with test "name" context value
	    Then verify that row index 1 is active in "Functions_Table" table on "ML_Functions" wizard
        Then verify that row index 2 is NOT active in "Functions_Table" table on "ML_Functions" wizard
        Then click on cell with row index 2 in "name" column in "Functions_Table" table on "ML_Functions" wizard  
        Then verify that row index 2 is active in "Functions_Table" table on "ML_Functions" wizard   
        Then verify that row index 1 is NOT active in "Functions_Table" table on "ML_Functions" wizard
        Then verify "Info_Pane_Tab_Selector" element visibility on "ML_Function_Info_Pane" wizard
        Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "ML_Function_Info_Pane" wizard
        Then verify "Header" element visibility on "ML_Function_Info_Pane" wizard
        Then save to context "name" column on 2 row from "Functions_Table" table on "ML_Functions" wizard
        Then compare "Header" element value on "ML_Function_Info_Pane" wizard with test "name" context value

    @MLF
    #TODO: ML-5137 - move create/edit 'function panel' to UI Demo mode
    Scenario: MLF002 - Check requirements field in Code Accordion on Create New Function page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And turn on demo mode
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And click on "New_Function_Button" element on "ML_Functions" wizard
        And type value "demo-function-02" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
	    And click on "Continue_Button" element on "Create_ML_Function_Popup" wizard
        When collapse "General_Accordion" on "New_Function" wizard
	    Then is "Use_An_Existing_Image_Radiobutton" in "Code_Accordion" on "New_Function" selected
        Then is not "Build_A_New_Image_Radiobutton" in "Code_Accordion" on "New_Function" selected
	    Then verify "New_Function_Image_Name_Input" element in "Code_Accordion" on "New_Function" wizard is enabled
        Then verify "New_Function_Resulting_Image_Input" element in "Code_Accordion" on "New_Function" wizard is disabled
        Then verify "New_Function_Base_Image_Input" element in "Code_Accordion" on "New_Function" wizard is disabled
        Then verify "New_Requirements_Input" element in "Code_Accordion" on "New_Function" wizard is disabled
        Then verify "New_Function_Build_Commands_Text_Area" not input element in "Code_Accordion" on "New_Function" wizard is disabled
        When select "Build_A_New_Image_Radiobutton" in "Code_Accordion" on "New_Function"
        Then is "Build_A_New_Image_Radiobutton" in "Code_Accordion" on "New_Function" selected
        Then is not "Use_An_Existing_Image_Radiobutton" in "Code_Accordion" on "New_Function" selected
        Then verify "New_Function_Image_Name_Input" element in "Code_Accordion" on "New_Function" wizard is disabled
        Then verify "New_Function_Resulting_Image_Input" element in "Code_Accordion" on "New_Function" wizard is enabled
        Then verify "New_Function_Base_Image_Input" element in "Code_Accordion" on "New_Function" wizard is enabled
        Then verify "New_Requirements_Input" element in "Code_Accordion" on "New_Function" wizard is enabled
        Then verify "New_Function_Build_Commands_Text_Area" not input element in "Code_Accordion" on "New_Function" wizard is enabled
        Then click on "Save_Button" element on "New_Function" wizard
        And wait load page
        Then "Header" element on "ML_Function_Info_Pane" should contains "demo-function-02" value
        Then check "demo-function-02" value in "name" column in "Overview_Table" table on "ML_Function_Info_Pane" wizard

    @MLF
    @passive
    #TODO: ML-5718 - move 'Deploy' button for "Serving" function to demo mode
    Scenario: MLF034 - Verify Deploy option for serving kind functions
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And turn on demo mode
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then value in "kind" column with "text" in "Functions_Table" on "ML_Functions" wizard should contains "Serving"
        Then verify that "Serving" type is displayed in "kind" kind on "ML_Functions" wizard in "Functions_Table" table with "churn-server" value in "name" column
        Then verify "deploy" option is present on "ML_Functions" wizard in "Functions_Table" table with "churn-server" value in "name" column
        Then click on "deploy" option on "ML_Functions" wizard in "Functions_Table" table with "churn-server" value in "name" column
        And wait load page
        Then verify "Function_Name" element visibility in "General_Accordion" on "New_Function" wizard
        Then "Function_Name" element in "General_Accordion" on "New_Function" should contains "churn-server" value
        Then verify "Deploy_Button" element visibility on "New_Function" wizard
        Then "Deploy_Button" element on "New_Function" should contains "Deploy" value