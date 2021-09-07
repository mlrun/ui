Feature: Feature Store Page

    Tescases that verifies functionality on Feature Store Page

    @passive
    Scenario: Check all mandatory components on Feature Store tab
        Given open url
        And wait load page
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Feature store (Beta)" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        Then verify "Feature Sets" tab is activ in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Expand_Rows_Button" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Label_Filter_Input" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Feature_Sets_Table" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Feature_Store_Tab_Selector" element visibility on "Feature_Store_Feature_Sets_Tab" wizard

    @passive
    Scenario: Check all mandatory components on Features tab
        Given open url
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Feature store (Beta)" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And select "Features" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then verify "Features" tab is activ in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Feature_Store_Tab_Selector" on "Feature_Store_Features_Tab" wizard should contains "Feature_Store"."Tab_List"
        Then verify "Table_Refresh_Button" element visibility on "Feature_Store_Features_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Feature_Store_Features_Tab" wizard
        Then verify "Table_Label_Filter_Input" element visibility on "Feature_Store_Features_Tab" wizard
        Then verify "Table_Tag_Filter_Dropdown" element visibility on "Feature_Store_Features_Tab" wizard
        Then verify "Features_Table" element visibility on "Feature_Store_Features_Tab" wizard

    @passive
    Scenario: Check all mandatory components on Feature Vectors tab
        Given open url
        And click on cell with value "fsdemo-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Feature store (Beta)" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And select "Feature Vectors" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then verify "Feature Vectors" tab is activ in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Feature_Store_Tab_Selector" on "Feature_Store_Features_Vectors_Tab" wizard should contains "Feature_Store"."Tab_List"
        And turn on demo mode
        Then verify "Create_Vector_Button" element visibility on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify "Table_Label_Filter_Input" element visibility on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify "Table_Tag_Filter_Dropdown" element visibility on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify "Feature_Vectors_Table" element visibility on "Feature_Store_Features_Vectors_Tab" wizard

    @passive
    Scenario: Check all mandatory components on Datasets tab
        Given open url
        And click on cell with value "fsdemo-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Feature store (Beta)" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And select "Datasets" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then verify "Datasets" tab is activ in "Feature_Store_Tab_Selector" on "Feature_Store_Datasets_Tab" wizard
        Then verify "Feature_Store_Tab_Selector" on "Feature_Store_Datasets_Tab" wizard should contains "Feature_Store"."Tab_List"
        Then verify "Register_Dataset_Button" element visibility on "Feature_Store_Datasets_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Feature_Store_Datasets_Tab" wizard
        Then verify "Table_Label_Filter_Input" element visibility on "Feature_Store_Datasets_Tab" wizard
        Then verify "Table_Tree_Filter_Dropdown" element visibility on "Feature_Store_Datasets_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Feature_Store_Datasets_Tab" wizard
        Then verify "Feature_Datasets_Table" element visibility on "Feature_Store_Datasets_Tab" wizard

    @passive
    @inProgress
    Scenario: Check all mandatory components in Item infopane on Overview tab table
        Given open url
        And wait load page
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Feature store (Beta)" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then verify "Feature Sets" tab is activ in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        When click on cell with row index 1 in "name" column in "Feature_Sets_Table" table on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Header" element visibility on "Feature_Sets_Info_Pane" wizard
        Then verify "Updated" element visibility on "Feature_Sets_Info_Pane" wizard
        Then verify "Cancel_Button" element visibility on "Feature_Sets_Info_Pane" wizard
        Then verify "Apply_Changes_Button" element visibility on "Feature_Sets_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "Feature_Sets_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" element visibility on "Feature_Sets_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Feature_Sets_Info_Pane" wizard should contains "Feature_Sets_Info_Pane"."Tab_List"
        Then verify "Overview" tab is activ in "Info_Pane_Tab_Selector" on "Feature_Sets_Info_Pane" wizard
        # TO DO: Overview Tab info should be verified

    @passive
    Scenario: Check all mandatory components in Item infopane on Features tab table
        Given open url
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Feature store (Beta)" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then verify "Feature Sets" tab is activ in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        When click on cell with row index 1 in "name" column in "Feature_Sets_Table" table on "Feature_Store_Feature_Sets_Tab" wizard  
        Then select "Features" tab in "Info_Pane_Tab_Selector" on "Feature_Sets_Info_Pane" wizard
        Then verify "Features" tab is activ in "Info_Pane_Tab_Selector" on "Features_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Features_Info_Pane" wizard should contains "Feature_Sets_Info_Pane"."Tab_List"
        Then verify "Info_Pane_Tab_Selector" element visibility on "Features_Info_Pane" wizard
        Then verify "Header" element visibility on "Features_Info_Pane" wizard
        Then verify "Updated" element visibility on "Features_Info_Pane" wizard
        Then verify "Cancel_Button" element visibility on "Features_Info_Pane" wizard
        Then verify "Apply_Changes_Button" element visibility on "Features_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "Features_Info_Pane" wizard
        Then verify "Features_Tab_Info_Pane_Table" element visibility on "Features_Info_Pane" wizard

    @passive
    @inProgress
    Scenario: Check all mandatory components in Item infopane on Transformations tab table
        Given open url
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Feature store (Beta)" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then verify "Feature Sets" tab is activ in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        When click on cell with row index 1 in "name" column in "Feature_Sets_Table" table on "Feature_Store_Feature_Sets_Tab" wizard  
        Then select "Transformations" tab in "Info_Pane_Tab_Selector" on "Feature_Sets_Info_Pane" wizard
        Then verify "Transformations" tab is activ in "Info_Pane_Tab_Selector" on "Transformations_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Features_Info_Pane" wizard should contains "Feature_Sets_Info_Pane"."Tab_List"
        Then verify "Info_Pane_Tab_Selector" element visibility on "Transformations_Info_Pane" wizard
        Then verify "Header" element visibility on "Transformations_Info_Pane" wizard
        Then verify "Updated" element visibility on "Transformations_Info_Pane" wizard
        Then verify "Cancel_Button" element visibility on "Transformations_Info_Pane" wizard
        Then verify "Apply_Changes_Button" element visibility on "Transformations_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "Transformations_Info_Pane" wizard
        # TO DO: graph-view component for future work
        # TO DO: configuration component for future work

    @passive
    Scenario: Check all mandatory components in Item infopane on Preview tab table
        Given open url
        And click on cell with value "fsdemo-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Feature store (Beta)" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then verify "Feature Sets" tab is activ in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        When click on cell with row index 1 in "name" column in "Feature_Sets_Table" table on "Feature_Store_Feature_Sets_Tab" wizard  
        Then select "Preview" tab in "Info_Pane_Tab_Selector" on "Feature_Sets_Info_Pane" wizard
        Then verify "Preview" tab is activ in "Info_Pane_Tab_Selector" on "Preview_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Preview_Info_Pane" wizard should contains "Feature_Sets_Info_Pane"."Tab_List"
        Then verify "Info_Pane_Tab_Selector" element visibility on "Preview_Info_Pane" wizard
        Then verify "Header" element visibility on "Preview_Info_Pane" wizard
        Then verify "Updated" element visibility on "Preview_Info_Pane" wizard
        Then verify "Cancel_Button" element visibility on "Preview_Info_Pane" wizard
        Then verify "Apply_Changes_Button" element visibility on "Preview_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "Preview_Info_Pane" wizard
        Then verify "Preview_Tab_Info_Pane_Table" element visibility on "Preview_Info_Pane" wizard

    @passive
    @inProgress
    Scenario: Check all mandatory components in Item infopane on Statistics tab table
        Given open url
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Feature store (Beta)" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then verify "Feature Sets" tab is activ in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        When click on cell with row index 1 in "name" column in "Feature_Sets_Table" table on "Feature_Store_Feature_Sets_Tab" wizard  
        Then select "Analysis" tab in "Info_Pane_Tab_Selector" on "Feature_Sets_Info_Pane" wizard
        Then verify "Analysis" tab is activ in "Info_Pane_Tab_Selector" on "Analysis_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Analysis_Info_Pane" wizard should contains "Feature_Sets_Info_Pane"."Tab_List"
        Then verify "Info_Pane_Tab_Selector" element visibility on "Analysis_Info_Pane" wizard
        Then verify "Header" element visibility on "Analysis_Info_Pane" wizard
        Then verify "Updated" element visibility on "Analysis_Info_Pane" wizard
        Then verify "Cancel_Button" element visibility on "Analysis_Info_Pane" wizard
        Then verify "Apply_Changes_Button" element visibility on "Analysis_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "Analysis_Info_Pane" wizard
        # TO DO: tab components too complicated for quick automatization

    @passive
    Scenario: Check all mandatory components on Register Dataset form
        Given open url
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Feature store (Beta)" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And select "Datasets" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then verify "Datasets" tab is activ in "Feature_Store_Tab_Selector" on "Feature_Store_Datasets_Tab" wizard
        Then click on "Register_Dataset_Button" element on "Feature_Store_Datasets_Tab" wizard
        Then verify if "Register_Dataset" popup dialog appears
        Then verify "Name_Input" element visibility on "Register_Dataset" wizard
        Then verify "Name_Input" on "Register_Dataset" wizard should display "Input_Hint"."Artifact_Names_Unique"
        Then verify "Target_Path_Input" element visibility on "Register_Dataset" wizard
        Then verify "Description_Input" element visibility on "Register_Dataset" wizard
        Then verify "Cancel_Button" element visibility on "Register_Dataset" wizard
        Then verify "Archive_Button" element visibility on "Register_Dataset" wizard

    @passive
    Scenario: Check filtering by Name on Feature Store Feature Sets Tab
        Given open url
        And click on cell with value "fsdemo-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Feature store (Beta)" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then verify "Feature Sets" tab is activ in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then type value "ea" to "Table_Name_Filter_Input" field on "Feature_Store_Feature_Sets_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        Then value in "name" column with "text" in "Feature_Sets_Table" on "Feature_Store_Feature_Sets_Tab" wizard should contains "ea"

    @passive
    Scenario: Check filtering by Name on Feature Store Features Tab
        Given open url
        And click on cell with value "fsdemo-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Feature store (Beta)" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And select "Features" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then type value "ea" to "Table_Name_Filter_Input" field on "Feature_Store_Features_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Feature_Store_Features_Tab" wizard
        Then value in "feature_name" column with "text" in "Features_Table" on "Feature_Store_Features_Tab" wizard should contains "ea"

    @passive
    Scenario: Check filtering by Name on Feature Store Feature Vectors Tab
        Given open url
        And click on cell with value "fsdemo-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Feature store (Beta)" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And select "Feature Vectors" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then type value "io" to "Table_Name_Filter_Input" field on "Feature_Store_Features_Vectors_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Feature_Store_Features_Vectors_Tab" wizard
        Then value in "name" column with "text" in "Feature_Vectors_Table" on "Feature_Store_Features_Vectors_Tab" wizard should contains "io"

    @passive
    Scenario: Check filtering by Name on Feature Store Datasets Tab
        Given open url
        And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Feature store (Beta)" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And select "Datasets" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then type value "ea" to "Table_Name_Filter_Input" field on "Feature_Store_Datasets_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Feature_Store_Datasets_Tab" wizard
        Then value in "name" column with "text" in "Feature_Datasets_Table" on "Feature_Store_Datasets_Tab" wizard should contains "ea"

    @passive
    @inProgress
    Scenario: Check all mandatory components on Feature Store Feature Set new item wizard
        Given open url
        And wait load page
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Feature store (Beta)" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        Then verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        Then verify "Feature Sets" tab is activ in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And turn on demo mode
        Then verify "Create_Set_Button" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then click on "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Cross_Close_Button" element visibility on "New_Feature_Set" wizard
        Then verify "Feature_Set_Name_Input" element visibility on "New_Feature_Set" wizard
        Then verify "Version_Input" element visibility on "New_Feature_Set" wizard
        Then verify "Description_Input" element visibility on "New_Feature_Set" wizard
        Then verify "Labels_Table" element visibility on "New_Feature_Set" wizard
        Then verify "Accordion_Header" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Collapse_Button" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "URL_Input" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Attributes_Table" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        When collapse "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Data_Source_Accordion" is collapsed on "New_Feature_Set" wizard
        Then verify "Accordion_Header" element visibility in "Schema_Accordion" on "New_Feature_Set" wizard
        Then verify "Collapse_Button" element visibility in "Schema_Accordion" on "New_Feature_Set" wizard
        Then verify "Timestamp_Input" element visibility in "Schema_Accordion" on "New_Feature_Set" wizard
        When collapse "Schema_Accordion" on "New_Feature_Set" wizard
        Then verify "Schema_Accordion" is collapsed on "New_Feature_Set" wizard
        Then verify "Accordion_Header" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Collapse_Button" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Online_Checkbox" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Offline_Checkbox" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Other_Checkbox" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When collapse "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Target_Store_Accordion" is collapsed on "New_Feature_Set" wizard
        Then verify "Cancel_Batton" element visibility on "New_Feature_Set" wizard
        Then verify "Save_Batton" element visibility on "New_Feature_Set" wizard
        Then verify "Save_And_Ingest_Button" element visibility on "New_Feature_Set" wizard

    @passive
    @inProgress
    Scenario: Check Input and Dropdown components on Feature Store Feature Set new item wizard
        Given open url
        And wait load page
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Feature store (Beta)" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        And verify "Feature Sets" tab is activ in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And turn on demo mode
        And click on "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Feature_Set_Name_Input" on "New_Feature_Set" wizard should display "Input_Hint"."Feature_Set_Name_Hint"
        Then verify "Feature_Set_Name_Input" on "New_Feature_Set" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then type value "#$@" to "Feature_Set_Name_Input" field on "New_Feature_Set" wizard
        Then verify "Feature_Set_Name_Input" on "New_Feature_Set" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "Kind_Dropdown" element in "Data_Source_Accordion" on "New_Feature_Set" wizard should contains "New_Feature_Store"."Kind_Options"
        When collapse "Data_Source_Accordion" on "New_Feature_Set" wizard
        When collapse "Schema_Accordion" on "New_Feature_Set" wizard
        When check "Other_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "File_Type_Dropdown" element in "Target_Store_Accordion" on "New_Feature_Set" wizard should contains "New_Feature_Store"."Target_Store_File_Type"

    @passive
    Scenario: Check Input and Dropdown components on Feature Store Feature Set new item wizard
        Given open url
        And wait load page
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Feature store (Beta)" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        And verify "Feature Sets" tab is activ in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And turn on demo mode
        And click on "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        When collapse "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Entities_Input" element visibility in "Schema_Accordion" on "New_Feature_Set" wizard
        Then verify "Timestamp_Input" element visibility in "Schema_Accordion" on "New_Feature_Set" wizard

    @passive
    @inProgress
    Scenario: Check Target Store Accordion components on Feature Store Feature Set new item wizard
        Given open url
        And wait load page
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Feature store (Beta)" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        And verify "Feature Sets" tab is activ in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And turn on demo mode
        And click on "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        When collapse "Data_Source_Accordion" on "New_Feature_Set" wizard
        When collapse "Schema_Accordion" on "New_Feature_Set" wizard
        Then "Online_Checkbox" element should be checked in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Online_Checkbox" element should be checked in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Offline_Checkbox" element should be checked in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Offline_Partition_Checkbox" element should be unchecked in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "Offline_Partition_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Offline_Partition_Key_Buckering_Number_Input" element in "Target_Store_Accordion" on "New_Feature_Set" wizard should display hint "Input_Hint"."Key_Buckering_Number_Hint"
        Then type value "432493" to "Offline_Partition_Key_Buckering_Number_Input" field on "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then increase value on 15 points in "Offline_Partition_Key_Buckering_Number_Input" field on "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then decrease value on 15 points in "Offline_Partition_Key_Buckering_Number_Input" field on "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Offline_Partition_Columns_Input" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Offline_Partition_Granularity_Dropdown" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Other_Checkbox" element should be unchecked in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "Other_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "File_Type_Dropdown" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "URL_Input" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When collapse "Target_Store_Accordion" on "New_Feature_Set" wizard
        And wait load page

    @passive
    Scenario: Test rows Labels on Feature Store Feature Set new item wizard
        Given open url
        And wait load page
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Feature store (Beta)" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        And verify "Feature Sets" tab is activ in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And turn on demo mode
        And click on "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        When add rows to "Labels_Table" table on "New_Feature_Set" wizard
            | key_input | value_input |
            |    key1   |    value1   |
            |    key2   |    value2   |
            |    key3   |    value3   |
        Then verify values in "Labels_Table" table on "New_Feature_Set" wizard
            |      label      |
            | key1\n:\nvalue1 |
            | key2\n:\nvalue2 |
            | key3\n:\nvalue3 |
        When click on "remove_btn" in "Labels_Table" table on "New_Feature_Set" wizard
            |      label      |
            | key1\n:\nvalue1 |
            | key3\n:\nvalue3 |
        Then verify values in "Labels_Table" table on "New_Feature_Set" wizard
            |      label      |
            | key2\n:\nvalue2 |

    @passive
    Scenario: Test rows on Attributes Table on Feature Store Feature Set new item wizard
        Given open url
        And wait load page
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Feature store (Beta)" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        And verify "Feature Sets" tab is activ in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And turn on demo mode
        And click on "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        When add rows to "Attributes_Table" table in "Data_Source_Accordion" on "New_Feature_Set" wizard
            | attribute_name_input | value_input |
            |      attribute1      |    value1   |
            |      attribute2      |    value2   |
            |      attribute3      |    value3   |
        Then verify values in "Attributes_Table" table in "Data_Source_Accordion" on "New_Feature_Set" wizard
            | attribute_name | value  |
            |   attribute1   | value1 |
            |   attribute2   | value2 |
            |   attribute3   | value3 |

    @inProgress
    Scenario: Save new Feature Store Feature Set new item wizard
        * create "automation-test-name3" MLRun Project with code 200
        Given open url
        And wait load page
        And click on cell with value "automation-test-name3" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on cell with value "Feature store (Beta)" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
        And wait load page
        And verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        And verify "Feature Sets" tab is activ in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And turn on demo mode
        And click on "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        Then type value "demo_feature_set" to "Feature_Set_Name_Input" field on "New_Feature_Set" wizard
        Then type value "0.0.1" to "Version_Input" field on "New_Feature_Set" wizard
        Then type value "Some demo description" to "Description_Input" field on "New_Feature_Set" wizard
        When add rows to "Labels_Table" table on "New_Feature_Set" wizard
            | key_input | value_input |
            |    key1   |    value1   |
            |    key2   |    value2   |
            |    key3   |    value3   |
        Then verify values in "Labels_Table" table on "New_Feature_Set" wizard
            |     label    |
            | key1\n:\nvalue1 |
            | key2\n:\nvalue2 |
            | key3\n:\nvalue3 |
        When select "MLRun store" option in "URL_Input" combobox on "Data_Source_Accordion" accordion on "New_Feature_Set" wizard
        When select "Artifacts" option in "URL_Input" combobox suggestion on "Data_Source_Accordion" accordion on "New_Feature_Set" wizard
        When select "Current project" option in "URL_Input" combobox suggestion on "Data_Source_Accordion" accordion on "New_Feature_Set" wizard
        When select "train_model" option in "URL_Input" combobox suggestion on "Data_Source_Accordion" accordion on "New_Feature_Set" wizard
        When add rows to "Attributes_Table" table in "Data_Source_Accordion" on "New_Feature_Set" wizard
            | attribute_name_input | value_input |
            |      attribute1      |    value1   |
            |      attribute2      |    value2   |
            |      attribute3      |    value3   |
        Then verify values in "Attributes_Table" table in "Data_Source_Accordion" on "New_Feature_Set" wizard
            | attribute_name | value  |
            |   attribute1   | value1 |
            |   attribute2   | value2 |
            |   attribute3   | value3 |
        When collapse "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then type value "entity1,entity2,entity3" to "Entities_Input" field on "Schema_Accordion" on "New_Feature_Set" wizard
        When collapse "Schema_Accordion" on "New_Feature_Set" wizard
        When uncheck "Offline_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When collapse "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then click on "Save_Batton" element on "New_Feature_Set" wizard
        Then click on "OK_Button" element on "Create_Feature_Set_Popup_Dialog" wizard
        Then click on "Cross_Close_Button" element on "Features_Info_Pane" wizard
        Then verify values in "Feature_Sets_Table" table on "Feature_Store_Feature_Sets_Tab" wizard
            |       name       |      description      |
            | demo_feature_set | Some demo description |
        And remove "automation-test-name3" MLRun Project with code 204
