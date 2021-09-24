Feature: ML Functions

    Tescases that verifies functionality on ML Functions Pages

    @passive
    Scenario: Check all mandatory components on ML Functions Page
        Given open url
        And wait load page
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then verify "Table_Name_Filter_Input" element visibility on "ML_Functions" wizard
        Then verify "Show_Untagged_Functions_Checkbox" element visibility on "ML_Functions" wizard
        Then verify "New_Function_Button" element visibility on "ML_Functions" wizard
        Then verify "Table_Refresh_Button" element visibility on "ML_Functions" wizard
        Then verify "Table_Expand_Rows_Button" element visibility on "ML_Functions" wizard
        Then verify "Functions_Table" element visibility on "ML_Functions" wizard

    @passive
    Scenario: verify filtering by function name on Functions page
        Given open url
        And wait load page
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And verify "Table_Name_Filter_Input" element visibility on "ML_Functions" wizard
        Then type value "test" to "Table_Name_Filter_Input" field on "ML_Functions" wizard
        Then click on "Table_Refresh_Button" element on "ML_Functions" wizard
        And wait load page
        Then value in "name" column with "text" in "Functions_Table" on "ML_Functions" wizard should contains "test"

    @passive
    Scenario: Check all mandatory components in General Accordion on create New Function page
        Given open url
        And wait load page
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And verify "Table_Name_Filter_Input" element visibility on "ML_Functions" wizard
        Then click on "New_Function_Button" element on "ML_Functions" wizard
        Then verify "Cross_Close_Button" element visibility on "New_Function" wizard
        Then verify "Collapse_Button" element visibility in "General_Accordion" on "New_Function" wizard
        Then type value "   " to "New_Function_Name_Input" field on "General_Accordion" on "New_Function" wizard
        Then verify "New_Function_Name_Input" element in "General_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "New_Function_Name_Input" element in "General_Accordion" on "New_Function" wizard should display hint "Input_Hint"."Function_Name_Hint"
        Then verify "New_Function_Tag_Input" element visibility in "General_Accordion" on "New_Function" wizard
        Then verify "New_Function_Run_Time_Dropdown" element visibility in "General_Accordion" on "New_Function" wizard
        Then verify "New_Function_Description_Text_Area" element visibility in "General_Accordion" on "New_Function" wizard
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

    @passive
    Scenario: Check all mandatory components in Code Accordion on create New Function page
        Given open url
        And wait load page
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And verify "Table_Name_Filter_Input" element visibility on "ML_Functions" wizard
        And click on "New_Function_Button" element on "ML_Functions" wizard
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


    @passive
    Scenario: Check all mandatory components in Resources Accordion on create New Function page
        Given open url
        And wait load page
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And verify "Table_Name_Filter_Input" element visibility on "ML_Functions" wizard
        And click on "New_Function_Button" element on "ML_Functions" wizard
        When collapse "General_Accordion" on "New_Function" wizard
        When collapse "Code_Accordion" on "New_Function" wizard
        Then verify "Volumes_Subheader" element in "Resouces_Accordion" on "New_Function" wizard should display hint "Label_Hint"."New_Job_Volumes"
        Then type value "0" to "Memory_Limit_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resouces_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Limit_Number_Warning"
        Then type value "1" to "Memory_Limit_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard
        Then type value "2" to "Memory_Request_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resouces_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Limit_Number_Warning"
        Then verify "Memory_Request_Number_Input" element in "Resouces_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Limit_Number_Request_Warning"
        Then type value "0" to "CPU_Limit_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard
        Then verify "Memory_Limit_Number_Input" element in "Resouces_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Limit_Number_Warning"
        Then type value "1" to "CPU_Limit_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard
        Then type value "2" to "CPU_Request_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard
        Then verify "CPU_Limit_Number_Input" element in "Resouces_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Limit_Number_Warning"
        Then verify "CPU_Request_Number_Input" element in "Resouces_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Limit_Number_Request_Warning"
        Then type value "0" to "GPU_Limit_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard
        Then verify "GPU_Limit_Number_Input" element in "Resouces_Accordion" on "New_Function" wizard should display warning "Input_Hint"."GPU_Minimum_Value_Warning"
        Then verify "Memory_Unit_Dropdown" element visibility in "Resouces_Accordion" on "New_Function" wizard
        Then verify "Memory_Request_Number_Input" element visibility in "Resouces_Accordion" on "New_Function" wizard
        Then type value "1" to "Memory_Request_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard
        Then increase value on 15 points in "Memory_Request_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard
        Then decrease value on 15 points in "Memory_Request_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard
        Then verify "Memory_Limit_Number_Input" element visibility in "Resouces_Accordion" on "New_Function" wizard
        Then type value "2" to "Memory_Limit_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard
        Then increase value on 15 points in "Memory_Limit_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard
        Then decrease value on 15 points in "Memory_Limit_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard
        Then verify "CPU_Unit_Dropdown" element visibility in "Resouces_Accordion" on "New_Function" wizard
        Then verify "CPU_Request_Number_Input" element visibility in "Resouces_Accordion" on "New_Function" wizard
        Then type value "3" to "CPU_Request_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard
        Then increase value on 15 points in "CPU_Request_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard
        Then decrease value on 15 points in "CPU_Request_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard
        Then verify "CPU_Limit_Number_Input" element visibility in "Resouces_Accordion" on "New_Function" wizard
        Then type value "4" to "CPU_Limit_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard
        Then increase value on 15 points in "CPU_Limit_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard
        Then decrease value on 15 points in "CPU_Limit_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard
        Then verify "GPU_Limit_Number_Input" element visibility in "Resouces_Accordion" on "New_Function" wizard
        Then type value "5" to "GPU_Limit_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard
        Then increase value on 15 points in "GPU_Limit_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard
        Then decrease value on 15 points in "GPU_Limit_Number_Input" field on "Resouces_Accordion" on "New_Function" wizard

    @passive
    Scenario: Verify behaviour of Volume Paths Table in Resources Accordion on create New Function page
        Given open url
        And wait load page
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And verify "Table_Name_Filter_Input" element visibility on "ML_Functions" wizard
        And click on "New_Function_Button" element on "ML_Functions" wizard
        When collapse "General_Accordion" on "New_Function" wizard
        When collapse "Code_Accordion" on "New_Function" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resouces_Accordion" on "New_Function" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Container_Input | Volume_Paths_Table_Access_Key_Input | Volume_Paths_Table_Resource_Path_Input | Add_New_Row_Button |
            |             V3IO                 |                                      |                               |                                    |                                     |                                        |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resouces_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resouces_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Access_Key_Input" element in "Resouces_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resouces_Accordion" on "New_Function" wizard should display hint "Input_Hint"."Moumt_Path_Hint"
        Then verify "Volume_Paths_Table_Container_Input" element in "Resouces_Accordion" on "New_Function" wizard should display hint "Input_Hint"."Data_Container_Hint"
        Then verify "Volume_Paths_Table_Access_Key_Input" element in "Resouces_Accordion" on "New_Function" wizard should display hint "Input_Hint"."DataAccess_Key_Hint"
        Then verify "Volume_Paths_Table_Resource_Path_Input" element in "Resouces_Accordion" on "New_Function" wizard should display hint "Input_Hint"."Relative_Directory_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resouces_Accordion" on "New_Function" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resouces_Accordion" on "New_Function" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Config_Map_Input | Add_New_Row_Button |
            |           Config Map             |                                      |                               |                                     |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resouces_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resouces_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Config_Map_Input" element in "Resouces_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resouces_Accordion" on "New_Function" wizard should display hint "Input_Hint"."Moumt_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resouces_Accordion" on "New_Function" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resouces_Accordion" on "New_Function" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Secret_Name_Input | Add_New_Row_Button |
            |             Secret               |                                      |                               |                                      |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resouces_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resouces_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Config_Map_Input" element in "Resouces_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resouces_Accordion" on "New_Function" wizard should display hint "Input_Hint"."Moumt_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resouces_Accordion" on "New_Function" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resouces_Accordion" on "New_Function" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Claime_Name_Input | Add_New_Row_Button |
            |               PVC                |                                      |                               |                                      |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resouces_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resouces_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Claime_Name_Input" element in "Resouces_Accordion" on "New_Function" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resouces_Accordion" on "New_Function" wizard should display hint "Input_Hint"."Moumt_Path_Hint"
        When click on "Delete_New_Row_Button" element in "Resouces_Accordion" on "New_Function" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resouces_Accordion" on "New_Function" wizard using nontable inputs
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
        Then verify values in "Volume_Paths_Table" table in "Resouces_Accordion" on "New_Function" wizard
            |  volume_name  |        path        |
            | Volume_Name_1 | /path/to/happines1 |
            | Volume_Name_3 | /path/to/happines3 |
            | Volume_Name_5 | /path/to/happines5 |
            | Volume_Name_7 | /path/to/happines7 |
            | Volume_Name_0 | /path/to/happines0 |
        When click on "Remove" in action menu in "Volume_Paths_Table" table in "Resouces_Accordion" on "New_Function" wizard
            |  volume_name  |
            | Volume_Name_0 |
            | Volume_Name_3 |
        Then verify values in "Volume_Paths_Table" table in "Resouces_Accordion" on "New_Function" wizard
            |  volume_name  |        path        |
            | Volume_Name_1 | /path/to/happines1 |
            | Volume_Name_5 | /path/to/happines5 |
            | Volume_Name_7 | /path/to/happines7 |

    @passive
    Scenario: Check all mandatory components in Resources Accordion on create New Function page
        Given open url
        And wait load page
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And verify "Table_Name_Filter_Input" element visibility on "ML_Functions" wizard
        And click on "New_Function_Button" element on "ML_Functions" wizard
        When collapse "General_Accordion" on "New_Function" wizard
        When collapse "Code_Accordion" on "New_Function" wizard
        When collapse "Resouces_Accordion" on "New_Function" wizard
        When add rows to "Function_Environment_Variables_Table" table in "Environment_Variables_Accordion" on "New_Function" wizard
            | name_input | value_input |
            |    name1   |    value1   |
            |    name2   |    value2   |
            |    name3   |    value3   |
        Then verify values in "Function_Environment_Variables_Table" table in "Environment_Variables_Accordion" on "New_Function" wizard
            | name  | value  |
            | name1 | value1 |
            | name2 | value2 |
            | name3 | value3 |
        When click on "delete_btn" in "Function_Environment_Variables_Table" table in "Environment_Variables_Accordion" on "New_Function" wizard
            | name  |
            | name1 |
            | name3 |
        Then verify values in "Function_Environment_Variables_Table" table in "Environment_Variables_Accordion" on "New_Function" wizard
            | name  | value  |
            | name2 | value2 |
        When collapse "Environment_Variables_Accordion" on "New_Function" wizard
        Then verify "Cansel_Button" element visibility on "New_Function" wizard
        Then verify "Save_Button" element visibility on "New_Function" wizard
        Then verify "Deploy_Button" element visibility on "New_Function" wizard
        And click on "Save_Button" element on "New_Function" wizard
        Then verify "Cansel_Button" element on "New_Function" wizard is enabled
        Then verify "Save_Button" element on "New_Function" wizard is disabled
        Then verify "Deploy_Button" element on "New_Function" wizard is disabled

    @inProgress
    Scenario: Save new ml-function
        Given open url
        And wait load page
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And verify "Table_Name_Filter_Input" element visibility on "ML_Functions" wizard
        And click on "New_Function_Button" element on "ML_Functions" wizard
        Then type value "new-aqa-function-00" to "New_Function_Name_Input" field on "General_Accordion" on "New_Function" wizard
        Then type value "latest" to "New_Function_Tag_Input" field on "General_Accordion" on "New_Function" wizard
        When collapse "General_Accordion" on "New_Function" wizard
        Then type value "demo" to "New_Function_Handler_Input" field on "Code_Accordion" on "New_Function" wizard
        When collapse "General_Accordion" on "New_Function" wizard
        When collapse "Resouces_Accordion" on "New_Function" wizard
        Then click on "Save_Button" element on "New_Function" wizard
        Then click on "Cross_Close_Button" element on "ML_Function_Info_Pane" wizard
        Then verify values in "Functions_Table" table on "ML_Functions" wizard
            |         name        |
            | new-aqa-function-00 |
        And select "Delete" option in action menu on "ML_Functions" wizard in "Functions_Table" table at row with "new-aqa-function-00" value in "name" column
        And click on "Delete_Button" element on "Delete_Function_Popup" wizard
