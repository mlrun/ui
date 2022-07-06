Feature: Feature Store Page

    Testcases that verifies functionality on Feature Store Page

    @passive
    Scenario: Check all mandatory components on Feature Store tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify breadcrumbs "project" label should be equal "default" value
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Feature store" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Feature Store" value
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
        Then additionally redirect by INVALID-TAB

    @passive
    Scenario: Check all mandatory components on Features tab
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify breadcrumbs "project" label should be equal "default" value
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Feature store" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Feature Store" value
        And select "Features" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then verify "Features" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Feature_Store_Tab_Selector" on "Feature_Store_Features_Tab" wizard should contains "Feature_Store"."Tab_List"
        Then verify "Add_To_Feature_Vector_Button" element visibility on "Feature_Store_Features_Tab" wizard
        Then "Add_To_Feature_Vector_Button" element on "Feature_Store_Features_Tab" should contains "Add to feature vector" value
        Then verify "Table_Refresh_Button" element visibility on "Feature_Store_Features_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Feature_Store_Features_Tab" wizard
        Then verify "Table_Label_Filter_Input" element visibility on "Feature_Store_Features_Tab" wizard
        Then verify "Table_Tag_Filter_Dropdown" element visibility on "Feature_Store_Features_Tab" wizard
        Then verify "Table_Tag_Filter_Dropdown" dropdown element on "Feature_Store_Features_Tab" wizard should contains "Dropdown_Options"."Tag_Filer_Options"
        Then verify "Features_Table" element visibility on "Feature_Store_Features_Tab" wizard
        Then select "project" with "test-test" value in breadcrumbs menu
        Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."Common_Message"
        Then select "All" option in "Table_Tag_Filter_Dropdown" dropdown on "Feature_Store_Features_Tab" wizard
        Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."No_Features_Yet"

    @passive
    Scenario: Check all mandatory components on Feature Vectors tab
        Given open url
        And click on row root with value "fsdemo-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify breadcrumbs "project" label should be equal "fsdemo-admin" value
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Feature store" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Feature Vectors" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Feature Store" value
        Then verify "Feature Vectors" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Feature_Store_Tab_Selector" on "Feature_Store_Features_Vectors_Tab" wizard should contains "Feature_Store"."Tab_List"
        And turn on demo mode
        Then verify "Create_Vector_Button" element visibility on "Feature_Store_Features_Vectors_Tab" wizard
        Then "Create_Vector_Button" element on "Feature_Store_Features_Vectors_Tab" should contains "Create Vector" value
        Then verify "Table_Name_Filter_Input" element visibility on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify "Table_Label_Filter_Input" element visibility on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify "Table_Tag_Filter_Dropdown" element visibility on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify "Table_Tag_Filter_Dropdown" dropdown element on "Feature_Store_Features_Vectors_Tab" wizard should contains "Dropdown_Options"."Tag_Filer_Options"
        Then verify "Table_Refresh_Button" element visibility on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify "Feature_Vectors_Table" element visibility on "Feature_Store_Features_Vectors_Tab" wizard

    @passive
    @inProgress
    Scenario: Check all mandatory components in Item infopane on Overview tab table on Feature Sets tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Feature store" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then select "All" option in "Table_Tag_Filter_Dropdown" dropdown on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        When click on cell with row index 2 in "name" column in "Feature_Sets_Table" table on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Header" element visibility on "Feature_Sets_Info_Pane" wizard
        Then verify "Updated" element visibility on "Feature_Sets_Info_Pane" wizard
        Then verify "Cancel_Button" element visibility on "Feature_Sets_Info_Pane" wizard
        Then "Cancel_Button" element on "Feature_Sets_Info_Pane" should contains "Cancel" value
        Then verify "Apply_Changes_Button" element visibility on "Feature_Sets_Info_Pane" wizard
        Then verify "Apply_Changes_Button" element on "Feature_Sets_Info_Pane" wizard is disabled
        Then "Apply_Changes_Button" element on "Feature_Sets_Info_Pane" should contains "Apply Changes" value
        Then verify "Action_Menu" element visibility on "Feature_Sets_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "Feature_Sets_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" element visibility on "Feature_Sets_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Feature_Sets_Info_Pane" wizard should contains "Feature_Sets_Info_Pane"."Tab_List"
        Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Feature_Sets_Info_Pane" wizard
        Then verify "Overview_General_Headers" on "Feature_Sets_Info_Pane" wizard should contains "Feature_Sets_Info_Pane"."Overview_General_Headers"
        Then click on "Description_Field" element on "Feature_Sets_Info_Pane" wizard
        Then type value " " to "Description_Input" field on "Feature_Sets_Info_Pane" wizard
        Then verify "Description_Input" on "Feature_Sets_Info_Pane" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then type value "test_description" to "Description_Input" field on "Feature_Sets_Info_Pane" wizard
        Then click on "Apply_Button" element on "Feature_Sets_Info_Pane" wizard
        Then "Description_Field" element on "Feature_Sets_Info_Pane" should contains "test_description" value
        Then verify "Apply_Changes_Button" element on "Feature_Sets_Info_Pane" wizard is enabled
        Then click on "Description_Field" element on "Feature_Sets_Info_Pane" wizard
        Then type value "" to "Description_Input" field on "Feature_Sets_Info_Pane" wizard
        Then click on "Apply_Button" element on "Feature_Sets_Info_Pane" wizard
        Then verify "Apply_Changes_Button" element on "Feature_Sets_Info_Pane" wizard is disabled
        When add rows to "Labels_Table" table on "Feature_Sets_Info_Pane" wizard
            | key_input | value_input |
            |    key1   |    value1   |
            |    key2   |    value2   |
            |    key3   |    value3   |
        Then verify values in "Labels_Table" table on "Feature_Sets_Info_Pane" wizard
            |       label     |
            | key1\n:\nvalue1 |
            | key2\n:\nvalue2 |
            | key3\n:\nvalue3 |
        When click on "remove_btn" in "Labels_Table" table on "Feature_Sets_Info_Pane" wizard
            |       label     |
            | key1\n:\nvalue1 |
            | key3\n:\nvalue3 |
        Then verify values in "Labels_Table" table on "Feature_Sets_Info_Pane" wizard
            |       label     |
            | key2\n:\nvalue2 |
        Then click on "Apply_Button" element on "Feature_Sets_Info_Pane" wizard
        Then verify "Apply_Changes_Button" element on "Feature_Sets_Info_Pane" wizard is enabled
        When click on cell with row index 2 in "expand_btn" column in "Feature_Sets_Table" table on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then verify "Info_Pane_Tab_Selector" element visibility on "Feature_Sets_Info_Pane" wizard
        When click on cell with row index 2 in "expand_btn" column in "Feature_Sets_Table" table on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then verify "Info_Pane_Tab_Selector" element visibility on "Feature_Sets_Info_Pane" wizard

    @passive
    @inProgress
    Scenario: Check all mandatory components in Item infopane on Overview tab table on Feature Vectors tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        And select "Feature Vectors" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Feature Vectors" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Features_Vectors_Tab" wizard
        When click on cell with row index 1 in "name" column in "Feature_Vectors_Table" table on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify "Header" element visibility on "Feature_Vectors_Info_Pane" wizard
        Then verify "Updated" element visibility on "Feature_Vectors_Info_Pane" wizard
        Then verify "Cancel_Button" element visibility on "Feature_Vectors_Info_Pane" wizard
        Then "Cancel_Button" element on "Feature_Vectors_Info_Pane" should contains "Cancel" value
        Then verify "Apply_Changes_Button" element visibility on "Feature_Vectors_Info_Pane" wizard
        Then "Apply_Changes_Button" element on "Feature_Vectors_Info_Pane" should contains "Apply Changes" value
        Then verify "Action_Menu" element visibility on "Feature_Vectors_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "Feature_Vectors_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" element visibility on "Feature_Vectors_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Feature_Vectors_Info_Pane" wizard should contains "Feature_Vectors_Info_Pane"."Tab_List"
        Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Feature_Vectors_Info_Pane" wizard
        Then verify "Overview_General_Headers" on "Feature_Vectors_Info_Pane" wizard should contains "Feature_Vectors_Info_Pane"."Overview_General_Headers"

    @passive
    @inProgress
    Scenario: Check all mandatory components in Item infopane with non-latest tag on Overview tab table on Feature Vectors tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Feature store" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        And select "Feature Vectors" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Feature Vectors" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Features_Vectors_Tab" wizard
        When select "test-tag" option in "Table_Tag_Filter_Dropdown" filter dropdown on "Feature_Store_Features_Vectors_Tab" wizard
        And wait load page
        When click on cell with row index 1 in "name" column in "Feature_Vectors_Table" table on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify "Header" element visibility on "Feature_Vectors_Info_Pane" wizard
        Then verify "Updated" element visibility on "Feature_Vectors_Info_Pane" wizard
        Then verify "Cancel_Button" element visibility on "Feature_Vectors_Info_Pane" wizard
        Then "Cancel_Button" element on "Feature_Vectors_Info_Pane" should contains "Cancel" value
        Then verify "Apply_Changes_Button" element visibility on "Feature_Vectors_Info_Pane" wizard
        Then "Apply_Changes_Button" element on "Feature_Vectors_Info_Pane" should contains "Apply Changes" value
        Then verify "Action_Menu" element visibility on "Feature_Vectors_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "Feature_Vectors_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" element visibility on "Feature_Vectors_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Feature_Vectors_Info_Pane" wizard should contains "Feature_Vectors_Info_Pane"."Tab_List"
        Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Feature_Vectors_Info_Pane" wizard
        Then verify "Overview_General_Headers" on "Feature_Vectors_Info_Pane" wizard should contains "Feature_Vectors_Info_Pane"."Overview_General_Headers"

    @passive
    Scenario: Check all mandatory components in Item infopane on Features tab table
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        Then verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        When click on cell with row index 1 in "name" column in "Feature_Sets_Table" table on "Feature_Store_Feature_Sets_Tab" wizard
        Then select "Features" tab in "Info_Pane_Tab_Selector" on "Feature_Sets_Info_Pane" wizard
        Then verify "Features" tab is active in "Info_Pane_Tab_Selector" on "Features_Info_Pane" wizard
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
        And click on row root with value "fraud-demo2-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        Then verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        When click on cell with row index 1 in "name" column in "Feature_Sets_Table" table on "Feature_Store_Feature_Sets_Tab" wizard
        Then select "Transformations" tab in "Info_Pane_Tab_Selector" on "Feature_Sets_Info_Pane" wizard
        Then verify "Transformations" tab is active in "Info_Pane_Tab_Selector" on "Transformations_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Features_Info_Pane" wizard should contains "Feature_Sets_Info_Pane"."Tab_List"
        Then verify "Info_Pane_Tab_Selector" element visibility on "Transformations_Info_Pane" wizard
        Then verify "Header" element visibility on "Transformations_Info_Pane" wizard
        Then verify "Updated" element visibility on "Transformations_Info_Pane" wizard
        Then verify "Cancel_Button" element visibility on "Transformations_Info_Pane" wizard
        Then verify "Apply_Changes_Button" element visibility on "Transformations_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "Transformations_Info_Pane" wizard
        Then verify "Transformation_Graph" element visibility on "Transformations_Info_Pane" wizard
        Then verify arrow lines position on "Transformation_Graph" on "Transformations_Info_Pane" wizard
        # TO DO: configuration component for future work

    @passive
    Scenario: Check all mandatory components in Item infopane on Preview tab table
        Given open url
        And click on row root with value "fsdemo-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        Then verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        When click on cell with row index 1 in "name" column in "Feature_Sets_Table" table on "Feature_Store_Feature_Sets_Tab" wizard
        Then select "Preview" tab in "Info_Pane_Tab_Selector" on "Feature_Sets_Info_Pane" wizard
        Then verify "Preview" tab is active in "Info_Pane_Tab_Selector" on "Preview_Info_Pane" wizard
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
    Scenario: Check all mandatory components in Item infopane on Analysis tab table
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        Then verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        When click on cell with row index 1 in "name" column in "Feature_Sets_Table" table on "Feature_Store_Feature_Sets_Tab" wizard
        Then select "Analysis" tab in "Info_Pane_Tab_Selector" on "Feature_Sets_Info_Pane" wizard
        Then verify "Analysis" tab is active in "Info_Pane_Tab_Selector" on "Analysis_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Analysis_Info_Pane" wizard should contains "Feature_Sets_Info_Pane"."Tab_List"
        Then verify "Info_Pane_Tab_Selector" element visibility on "Analysis_Info_Pane" wizard
        Then verify "Header" element visibility on "Analysis_Info_Pane" wizard
        Then verify "Updated" element visibility on "Analysis_Info_Pane" wizard
        Then verify "Cancel_Button" element visibility on "Analysis_Info_Pane" wizard
        Then verify "Apply_Changes_Button" element visibility on "Analysis_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "Analysis_Info_Pane" wizard
        # TO DO: tab components too complicated for quick automatization

    @passive
    Scenario: Check filtering by Name on Feature Store Feature Sets Tab
        Given open url
        And click on row root with value "fsdemo-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        Then verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then type value "ea" to "Table_Name_Filter_Input" field on "Feature_Store_Feature_Sets_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then value in "name" column with "text" in "Feature_Sets_Table" on "Feature_Store_Feature_Sets_Tab" wizard should contains "ea"

    @passive
    Scenario: Check filtering by Name on Feature Store Features Tab
        Given open url
        And click on row root with value "fsdemo-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        And select "Features" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then type value "ea" to "Table_Name_Filter_Input" field on "Feature_Store_Features_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Feature_Store_Features_Tab" wizard
        And wait load page
        Then value in "feature_name" column with "text" in "Features_Table" on "Feature_Store_Features_Tab" wizard should contains "ea"
        Then type value "ccccc" to "Table_Name_Filter_Input" field on "Feature_Store_Features_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Feature_Store_Features_Tab" wizard
        Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."Common_Message"

    @passive
    Scenario: Check filtering by Name on Feature Store Feature Vectors Tab
        Given open url
        And click on row root with value "fsdemo-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        And select "Feature Vectors" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then type value "io" to "Table_Name_Filter_Input" field on "Feature_Store_Features_Vectors_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Feature_Store_Features_Vectors_Tab" wizard
        And wait load page
        Then value in "name" column with "text" in "Feature_Vectors_Table" on "Feature_Store_Features_Vectors_Tab" wizard should contains "io"

    @passive
    Scenario: Check filtering by Tag on Feature Store Feature Sets Tab
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        Then verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        When select "my-tag" option in "Table_Tag_Filter_Dropdown" dropdown on "Feature_Store_Feature_Sets_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then value in "tag" column with "text" in "Feature_Sets_Table" on "Feature_Store_Feature_Sets_Tab" wizard should contains "my-tag"

    @passive
    Scenario: Check filtering by Tag on Feature Store Feature Vectors Tab
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        And select "Feature Vectors" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        When select "test-tag" option in "Table_Tag_Filter_Dropdown" dropdown on "Feature_Store_Features_Vectors_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Feature_Store_Features_Vectors_Tab" wizard
        And wait load page
        Then value in "tag" column with "text" in "Feature_Vectors_Table" on "Feature_Store_Features_Vectors_Tab" wizard should contains "test-tag"

    @passive
    @inProgress
    Scenario: Check all mandatory components on Feature Store Feature Set new item wizard on Data Source Accordion Parquet Kind
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        Then verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        Then verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Create_Set_Button" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then click on "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Cross_Close_Button" element visibility on "New_Feature_Set" wizard
        Then verify "Feature_Set_Name_Input" element visibility on "New_Feature_Set" wizard
        Then verify "Version_Input" element visibility on "New_Feature_Set" wizard
        Then verify "Description_Input" element visibility on "New_Feature_Set" wizard
        Then verify "Labels_Table" element visibility on "New_Feature_Set" wizard
        When select "PARQUET" option in "Kind_Dropdown" dropdown on "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Schedule_Button" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Parquet_Timestamp_Column_Input" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Parquet_Timestamp_Column_Input" element in "Data_Source_Accordion" on "New_Feature_Set" wizard should display hint "Input_Hint"."Timestamp_Column"
        Then verify "Start_Date_Time_Picker" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Start_Date_Time_Hint" element in "Data_Source_Accordion" on "New_Feature_Set" wizard should display hint "Input_Hint"."Start_Time_Input"
        Then verify "End_Date_Time_Picker" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "End_Date_Time_Hint" element in "Data_Source_Accordion" on "New_Feature_Set" wizard should display hint "Input_Hint"."End_Time_Input"
        Then click on "Schedule_Button" element in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify if "Feature_Set_Schedule_Popup" popup dialog appears

    @passive
    Scenario: Verify behaviour of Combobox element on Feature Store Feature Set new item wizard on Data Source Accordion
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        Then verify "Create_Set_Button" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then click on "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify options in "URL_Combobox" combobox in "Data_Source_Accordion" on "New_Feature_Set" wizard should contains "New_Feature_Store"."Combobox_Options"
        When select "MLRun store" option in "URL_Combobox" combobox on "Data_Source_Accordion" accordion on "New_Feature_Set" wizard
        Then searchable fragment "Artifacts" should be in every suggested option into "URL_Combobox" combobox input in "Data_Source_Accordion" on "New_Feature_Set" wizard
        When select "Artifacts" option in "URL_Combobox" combobox suggestion on "Data_Source_Accordion" accordion on "New_Feature_Set" wizard
        When type searchable fragment "m" into "URL_Combobox" combobox input in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then searchable fragment "m" should be in every suggested option into "URL_Combobox" combobox input in "Data_Source_Accordion" on "New_Feature_Set" wizard
        When type searchable fragment "churn" into "URL_Combobox" combobox input in "Data_Source_Accordion" on "New_Feature_Set" wizard
        When select "churn-project-admin" option in "URL_Combobox" combobox suggestion on "Data_Source_Accordion" accordion on "New_Feature_Set" wizard
        When type searchable fragment "clean" into "URL_Combobox" combobox input in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then searchable fragment "clean" should be in every suggested option into "URL_Combobox" combobox input in "Data_Source_Accordion" on "New_Feature_Set" wizard
        When type value "  " to "URL_Combobox" field on "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then click on "Accordion_Header" element in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "URL_Combobox" element in "Data_Source_Accordion" on "New_Feature_Set" wizard should display warning "Input_Hint"."MLRun_Store_Path_Hint"
        When type value "artifacts/stocks" to "URL_Combobox" field on "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then searchable fragment "stocks" should be in every suggested option into "URL_Combobox" combobox input in "Data_Source_Accordion" on "New_Feature_Set" wizard
        When type value "artifacts/churn-project-admin/raw-data" to "URL_Combobox" field on "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then searchable fragment "raw-data" should be in every suggested option into "URL_Combobox" combobox input in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then select "V3IO" option in "URL_Combobox" combobox on "Data_Source_Accordion" accordion on "New_Feature_Set" wizard
        Then type value "  " to "URL_Combobox" field on "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then click on "Accordion_Header" element in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "URL_Combobox" element in "Data_Source_Accordion" on "New_Feature_Set" wizard should display warning "Input_Hint"."V3IO_Path_Hint"
        Then select "S3" option in "URL_Combobox" combobox on "Data_Source_Accordion" accordion on "New_Feature_Set" wizard
        Then type value "@!$&" to "URL_Combobox" field on "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then click on "Accordion_Header" element in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "URL_Combobox" element in "Data_Source_Accordion" on "New_Feature_Set" wizard should display warning "Input_Hint"."S3_Path_Hint"
        Then select "Azure storage" option in "URL_Combobox" combobox on "Data_Source_Accordion" accordion on "New_Feature_Set" wizard
        Then type value "__" to "URL_Combobox" field on "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then click on "Accordion_Header" element in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "URL_Combobox" element in "Data_Source_Accordion" on "New_Feature_Set" wizard should display warning "Input_Hint"."Azure_Storage_Path_Hint"

    @passive
    @inProgress
    Scenario: Check all mandatory components on Schedule popup on Feature Store Feature Set new item wizard on Data Source Accordion Parquet Kind
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        Then verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then click on "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        When select "PARQUET" option in "Kind_Dropdown" dropdown on "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Schedule_Button" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then "Schedule_Button" element in "Data_Source_Accordion" on "New_Feature_Set" should contains "Schedule" value
        Then click on "Schedule_Button" element in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify if "Feature_Set_Schedule_Popup" popup dialog appears
        Then verify "Repeat_Dropdown" element visibility on "Feature_Set_Schedule_Popup" wizard
        Then verify "Time_Dropdown" element visibility on "Feature_Set_Schedule_Popup" wizard
        Then verify "Schedule_Button" element visibility on "Feature_Set_Schedule_Popup" wizard
        Then select "10" option in "Time_Dropdown" dropdown on "Feature_Set_Schedule_Popup" wizard
        And click on "Schedule_Button" element on "Feature_Set_Schedule_Popup" wizard
        Then "Schedule_Button" element in "Data_Source_Accordion" on "New_Feature_Set" should contains "Every 10 minutes" value
        # Should be finished after drop-down fix

    @passive
    @inProgress
    Scenario: Check all mandatory components on Feature Store Feature Set new item wizard
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        Then verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        Then verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Create_Set_Button" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then click on "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
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
        Then uncheck "Access_Key_Checkbox" element on "New_Feature_Set" wizard
        Then verify "Access_Key_Input" element visibility on "New_Feature_Set" wizard
        Then type value "  " to "Access_Key_Input" field on "New_Feature_Set" wizard
        Then verify "Access_Key_Input" on "New_Feature_Set" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "Cancel_Button" element visibility on "New_Feature_Set" wizard
        Then "Cancel_Button" element on "New_Feature_Set" should contains "Cancel" value
        Then verify "Save_Button" element visibility on "New_Feature_Set" wizard
        Then "Save_Button" element on "New_Feature_Set" should contains "Save" value
        Then verify "Save_And_Ingest_Button" element visibility on "New_Feature_Set" wizard
        Then "Save_And_Ingest_Button" element on "New_Feature_Set" should contains "Save and ingest" value

    @passive
    @inProgress
    Scenario: Check Input and Dropdown components on Feature Store Feature Set new item wizard
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        And verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        And verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And click on "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        Then type value "   " to "Feature_Set_Name_Input" field on "New_Feature_Set" wizard
        Then verify "Feature_Set_Name_Input" on "New_Feature_Set" wizard should display options "Input_Hint"."Feature_Set_Name_Hint"
        Then verify "Feature_Set_Name_Input" options rules on "New_Feature_Set" wizard
        Then type value "   " to "Version_Input" field on "New_Feature_Set" wizard
        Then verify "Version_Input" on "New_Feature_Set" wizard should display options "Input_Hint"."Feature_Set_Version_Hint"
        Then verify "Version_Input" options rules on "New_Feature_Set" wizard
        Then verify "Kind_Dropdown" element in "Data_Source_Accordion" on "New_Feature_Set" wizard should contains "New_Feature_Store"."Kind_Options"
        When collapse "Data_Source_Accordion" on "New_Feature_Set" wizard
        When collapse "Schema_Accordion" on "New_Feature_Set" wizard
        When check "External_Offline_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "File_Type_Dropdown" element in "Target_Store_Accordion" on "New_Feature_Set" wizard should contains "New_Feature_Store"."Target_Store_File_Type"

    @passive
    Scenario: Check Input and Dropdown components on Feature Store Feature Set new item wizard
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        And verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        And verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And click on "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        When collapse "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Entities_Input" element visibility in "Schema_Accordion" on "New_Feature_Set" wizard
        Then verify "Timestamp_Input" element visibility in "Schema_Accordion" on "New_Feature_Set" wizard

    @passive
    @inProgress
    Scenario: Check Schema Accordion components on Feature Store Feature Set new item wizard
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        And verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        And verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And click on "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        When collapse "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Timestamp_Input" element visibility in "Schema_Accordion" on "New_Feature_Set" wizard
        Then type value "text" to "Entities_Input" field on "Schema_Accordion" on "New_Feature_Set" wizard
        Then type value "" to "Entities_Input" field on "Schema_Accordion" on "New_Feature_Set" wizard
        Then verify "Entities_Input" element in "Schema_Accordion" on "New_Feature_Set" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Timestamp_Input" element in "Schema_Accordion" on "New_Feature_Set" wizard should display hint "Input_Hint"."Timestamp_Key_Hint"
        When check "Offline_Partition_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then type value "text" to "Timestamp_Input" field on "Schema_Accordion" on "New_Feature_Set" wizard
        Then type value "" to "Timestamp_Input" field on "Schema_Accordion" on "New_Feature_Set" wizard
        Then verify "Timestamp_Input" element in "Schema_Accordion" on "New_Feature_Set" wizard should display warning "Input_Hint"."Timestamp_Key_Warning"

    @passive
    @inProgress
    Scenario: Check Target Store Accordion components on Feature Store Feature Set new item wizard
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        And verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        And verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And click on "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        When collapse "Data_Source_Accordion" on "New_Feature_Set" wizard
        When collapse "Schema_Accordion" on "New_Feature_Set" wizard
        Then "Online_Checkbox" element should be checked in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Offline_Checkbox" element should be checked in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Offline_Partition_Checkbox" element should be unchecked in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Online_Checkbox_Hint" element in "Target_Store_Accordion" on "New_Feature_Set" wizard should display hint "Input_Hint"."Target_Store_Online"
        Then verify "Offline_Checkbox_Hint" element in "Target_Store_Accordion" on "New_Feature_Set" wizard should display hint "Input_Hint"."Target_Store_Offline"
        Then verify "External_Offline_Checkbox_Hint" element in "Target_Store_Accordion" on "New_Feature_Set" wizard should display hint "Input_Hint"."Target_Store_External_Offline"
        Then uncheck "External_Offline_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then uncheck "Online_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then uncheck "Offline_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Error_Message" component in "Target_Store_Accordion" on "New_Feature_Set" should contains "Error_Messages"."Must_Select_One"
        Then check "Offline_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "Offline_Partition_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Offline_Partition_ShowHide_Link" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When click on "Offline_Partition_ShowHide_Link" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "Offline_Partition_By_Key_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "Offline_Partition_By_Time_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "Offline_Partition_By_Columns_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then is "Offline_Partition_Distinct_Keys_Radiobutton" in "Target_Store_Accordion" on "New_Feature_Set" selected
        Then is not "Offline_Partition_Number_Of_Buckets_Radiobutton" in "Target_Store_Accordion" on "New_Feature_Set" selected
        When select "Offline_Partition_Number_Of_Buckets_Radiobutton" in "Target_Store_Accordion" on "New_Feature_Set"
        Then is "Offline_Partition_Number_Of_Buckets_Radiobutton" in "Target_Store_Accordion" on "New_Feature_Set" selected
        Then verify "Offline_Partition_Key_Bucketing_Number_Input" element in "Target_Store_Accordion" on "New_Feature_Set" wizard should display hint "Input_Hint"."Key_Bucketing_Number_Hint"
        Then type value "432493" to "Offline_Partition_Key_Bucketing_Number_Input" field on "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then increase value on 15 points in "Offline_Partition_Key_Bucketing_Number_Input" field on "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then decrease value on 15 points in "Offline_Partition_Key_Bucketing_Number_Input" field on "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Offline_Partition_Columns_Input" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Offline_Partition_Granularity_Dropdown" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Offline_Partition_Granularity_Dropdown" element in "Target_Store_Accordion" on "New_Feature_Set" wizard should contains "Dropdown_Options"."Partition_Granularity_Options"
        Then "External_Offline_Checkbox" element should be unchecked in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When uncheck "Offline_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "External_Offline_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "File_Type_Dropdown" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "URL_Input" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When select "Parquet" option in "File_Type_Dropdown" dropdown on "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "External_Offline_Partition_Checkbox" element should be unchecked in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "External_Offline_Partition_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "External_Offline_Partition_ShowHide_Link" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When click on "External_Offline_Partition_ShowHide_Link" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "External_Offline_Partition_By_Key_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "External_Offline_Partition_By_Time_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "External_Offline_Partition_By_Columns_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then is "External_Offline_Partition_Distinct_Keys_Radiobutton" in "Target_Store_Accordion" on "New_Feature_Set" selected
        Then is not "External_Offline_Partition_Number_Of_Buckets_Radiobutton" in "Target_Store_Accordion" on "New_Feature_Set" selected
        When select "External_Offline_Partition_Number_Of_Buckets_Radiobutton" in "Target_Store_Accordion" on "New_Feature_Set"
        Then is "External_Offline_Partition_Number_Of_Buckets_Radiobutton" in "Target_Store_Accordion" on "New_Feature_Set" selected
        Then verify "External_Offline_Partition_Key_Bucketing_Number_Input" element in "Target_Store_Accordion" on "New_Feature_Set" wizard should display hint "Input_Hint"."Key_Bucketing_Number_Hint"
        Then type value "432493" to "External_Offline_Partition_Key_Bucketing_Number_Input" field on "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then increase value on 15 points in "External_Offline_Partition_Key_Bucketing_Number_Input" field on "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then decrease value on 15 points in "External_Offline_Partition_Key_Bucketing_Number_Input" field on "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "External_Offline_Partition_Columns_Input" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "External_Offline_Partition_Granularity_Dropdown" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When collapse "Target_Store_Accordion" on "New_Feature_Set" wizard
        And wait load page

    @passive
    Scenario: Verify behaviour of Online and Offline Target store on Feature Store Feature Set new item wizard
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        And click on "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        When collapse "Data_Source_Accordion" on "New_Feature_Set" wizard
        When collapse "Schema_Accordion" on "New_Feature_Set" wizard
        Then "Online_Path" element in "Target_Store_Accordion" on "New_Feature_Set" should contains "v3io:///projects/default/FeatureStore/{name}/{run_id}/nosql/sets/{name}" value
        Then "Offline_Path" element in "Target_Store_Accordion" on "New_Feature_Set" should contains "v3io:///projects/default/FeatureStore/{name}/{run_id}/parquet/sets/{name}.parquet" value
        Then type value "test-fs" to "Feature_Set_Name_Input" field on "New_Feature_Set" wizard
        Then click on "Accordion_Header" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Online_Path" element in "Target_Store_Accordion" on "New_Feature_Set" should contains "v3io:///projects/default/FeatureStore/test-fs/{run_id}/nosql/sets/test-fs" value
        Then "Offline_Path" element in "Target_Store_Accordion" on "New_Feature_Set" should contains "v3io:///projects/default/FeatureStore/test-fs/{run_id}/parquet/sets/test-fs.parquet" value
        When uncheck "Online_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When uncheck "Offline_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then type value "test-fs1" to "Feature_Set_Name_Input" field on "New_Feature_Set" wizard
        Then click on "Accordion_Header" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "Online_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "Offline_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Online_Path" element in "Target_Store_Accordion" on "New_Feature_Set" should contains "v3io:///projects/default/FeatureStore/test-fs1/{run_id}/nosql/sets/test-fs1" value
        Then "Offline_Path" element in "Target_Store_Accordion" on "New_Feature_Set" should contains "v3io:///projects/default/FeatureStore/test-fs1/{run_id}/parquet/sets/test-fs1.parquet" value
        Then click on "Edit_Online_Path_Button" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then click on "Apply_Online_Path_Button" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then click on "Edit_Offline_Path_Button" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then click on "Apply_Offline_Path_Button" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then type value "test-fs2" to "Feature_Set_Name_Input" field on "New_Feature_Set" wizard
        Then click on "Accordion_Header" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Online_Path" element in "Target_Store_Accordion" on "New_Feature_Set" should contains "v3io:///projects/default/FeatureStore/test-fs2/{run_id}/nosql/sets/test-fs2" value
        Then "Offline_Path" element in "Target_Store_Accordion" on "New_Feature_Set" should contains "v3io:///projects/default/FeatureStore/test-fs2/{run_id}/parquet/sets/test-fs2.parquet" value
        Then click on "Edit_Online_Path_Button" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then type value "v3io:///custom/path" to "Online_Path_Input" field on "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then click on "Discard_Online_Path_Button" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Online_Path" element in "Target_Store_Accordion" on "New_Feature_Set" should contains "v3io:///projects/default/FeatureStore/test-fs2/{run_id}/nosql/sets/test-fs2" value
        Then click on "Edit_Online_Path_Button" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Online_Path_Annotation" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Online_Path_Annotation" component in "Target_Store_Accordion" on "New_Feature_Set" should contains "New_Feature_Store"."Target_Store_Path_Annotation"
        Then type value "v3io:///custom/path" to "Online_Path_Input" field on "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then click on "Apply_Online_Path_Button" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Online_Path" element in "Target_Store_Accordion" on "New_Feature_Set" should contains "v3io:///custom/path" value
        Then type value "test-fs3" to "Feature_Set_Name_Input" field on "New_Feature_Set" wizard
        Then click on "Accordion_Header" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Online_Path" element in "Target_Store_Accordion" on "New_Feature_Set" should contains "v3io:///custom/path" value
        Then "Offline_Path" element in "Target_Store_Accordion" on "New_Feature_Set" should contains "v3io:///projects/default/FeatureStore/test-fs3/{run_id}/parquet/sets/test-fs3.parquet" value
        Then click on "Edit_Offline_Path_Button" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Offline_Path_Annotation" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Offline_Path_Annotation" component in "Target_Store_Accordion" on "New_Feature_Set" should contains "New_Feature_Store"."Target_Store_Path_Annotation"
        Then type value "v3io:///custom/offline/path" to "Offline_Path_Input" field on "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then click on "Discard_Offline_Path_Button" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Offline_Path" element in "Target_Store_Accordion" on "New_Feature_Set" should contains "v3io:///projects/default/FeatureStore/test-fs3/{run_id}/parquet/sets/test-fs3.parquet" value
        Then click on "Edit_Offline_Path_Button" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then type value "v3io:///custom/offline/path" to "Offline_Path_Input" field on "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then click on "Apply_Offline_Path_Button" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Offline_Path" element in "Target_Store_Accordion" on "New_Feature_Set" should contains "v3io:///custom/offline/path" value
        Then type value "test-fs3" to "Feature_Set_Name_Input" field on "New_Feature_Set" wizard
        Then click on "Accordion_Header" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Online_Path" element in "Target_Store_Accordion" on "New_Feature_Set" should contains "v3io:///custom/path" value
        Then "Offline_Path" element in "Target_Store_Accordion" on "New_Feature_Set" should contains "v3io:///custom/offline/path" value
        When uncheck "Online_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When uncheck "Offline_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "Online_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "Offline_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Online_Path" element in "Target_Store_Accordion" on "New_Feature_Set" should contains "v3io:///projects/default/FeatureStore/test-fs3/{run_id}/nosql/sets/test-fs3" value
        Then "Offline_Path" element in "Target_Store_Accordion" on "New_Feature_Set" should contains "v3io:///projects/default/FeatureStore/test-fs3/{run_id}/parquet/sets/test-fs3.parquet" value

    @passive
    Scenario: Check Partition part in Target Store Accordion components on Feature Store Feature Set new item wizard
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        And verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        And verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And click on "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        When collapse "Data_Source_Accordion" on "New_Feature_Set" wizard
        When collapse "Schema_Accordion" on "New_Feature_Set" wizard
        When check "Offline_Partition_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Offline_Partition_ShowHide_Link" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When click on "Offline_Partition_ShowHide_Link" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "Offline_Partition_By_Key_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "Offline_Partition_By_Time_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "Offline_Partition_By_Columns_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When select "Offline_Partition_Number_Of_Buckets_Radiobutton" in "Target_Store_Accordion" on "New_Feature_Set"
        When click on "Offline_Partition_ShowHide_Link" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When click on "Offline_Partition_ShowHide_Link" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Offline_Partition_By_Key_Checkbox" element should be checked in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Offline_Partition_By_Time_Checkbox" element should be checked in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "Offline_Partition_By_Columns_Checkbox" element should be checked in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then is "Offline_Partition_Number_Of_Buckets_Radiobutton" in "Target_Store_Accordion" on "New_Feature_Set" selected
        When check "External_Offline_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When uncheck "Offline_Partition_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When select "Parquet" option in "File_Type_Dropdown" dropdown on "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "External_Offline_Partition_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When click on "External_Offline_Partition_ShowHide_Link" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "External_Offline_Partition_By_Key_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "External_Offline_Partition_By_Time_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When check "External_Offline_Partition_By_Columns_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When select "External_Offline_Partition_Number_Of_Buckets_Radiobutton" in "Target_Store_Accordion" on "New_Feature_Set"
        When click on "External_Offline_Partition_ShowHide_Link" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When click on "External_Offline_Partition_ShowHide_Link" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "External_Offline_Partition_By_Key_Checkbox" element should be checked in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "External_Offline_Partition_By_Time_Checkbox" element should be checked in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then "External_Offline_Partition_By_Columns_Checkbox" element should be checked in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then is "External_Offline_Partition_Number_Of_Buckets_Radiobutton" in "Target_Store_Accordion" on "New_Feature_Set" selected

    @passive
    Scenario: Test rows Labels on Feature Store Feature Set new item wizard
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        And verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        And verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
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
        When click on "remove_btn" in "Labels_Table" table on "New_Feature_Set" wizard with offset "false"
            |      label      |
            | key1\n:\nvalue1 |
            | key3\n:\nvalue3 |
        Then verify values in "Labels_Table" table on "New_Feature_Set" wizard
            |      label      |
            | key2\n:\nvalue2 |

    @inProgress
    Scenario: Save new Feature Store Feature Set new item wizard
        * set tear-down property "project" created with "automation-test-name3" value
        * create "automation-test-name3" MLRun Project with code 201
        Given open url
        And wait load page
        And click on row root with value "automation-test-name3" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        And verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        And verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And click on "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        Then click on "Save_Button" element on "New_Feature_Set" wizard
        Then verify "Save_Button" element on "New_Feature_Set" wizard is disabled
        Then verify "Save_And_Ingest_Button" element on "New_Feature_Set" wizard is disabled
        Then verify "URL_Combobox" element in "Data_Source_Accordion" on "New_Feature_Set" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Entities_Input" element in "Schema_Accordion" on "New_Feature_Set" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then type value "demo_feature_set" to "Feature_Set_Name_Input" field on "New_Feature_Set" wizard
        Then type value "latest" to "Version_Input" field on "New_Feature_Set" wizard
        Then type value "Some demo description" to "Description_Input" field on "New_Feature_Set" wizard
        When add rows to "Labels_Table" table on "New_Feature_Set" wizard
            | key_input | value_input |
            |    key1   |    value1   |
            |    key2   |    value2   |
            |    key3   |    value3   |
        Then verify values in "Labels_Table" table on "New_Feature_Set" wizard
            |       label     |
            | key1\n:\nvalue1 |
            | key2\n:\nvalue2 |
            | key3\n:\nvalue3 |
        Then type value "entity1,entity2,entity3" to "Entities_Input" field on "Schema_Accordion" on "New_Feature_Set" wizard
        When collapse "Schema_Accordion" on "New_Feature_Set" wizard
        When uncheck "Offline_Checkbox" element in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When collapse "Target_Store_Accordion" on "New_Feature_Set" wizard
        When select "MLRun store" option in "URL_Combobox" combobox on "Data_Source_Accordion" accordion on "New_Feature_Set" wizard
        When type value "artifacts/automation-test-name3/artifact" to "URL_Combobox" field on "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then click on "Save_Button" element on "New_Feature_Set" wizard
        Then verify "Save_Button" element on "New_Feature_Set" wizard is enabled
        Then verify "Save_And_Ingest_Button" element on "New_Feature_Set" wizard is enabled
        Then click on "Save_Button" element on "New_Feature_Set" wizard
        Then click on "Confirm_Button" element on "Common_Popup" wizard
        Then click on "Cross_Close_Button" element on "Features_Info_Pane" wizard
        Then verify values in "Feature_Sets_Table" table on "Feature_Store_Feature_Sets_Tab" wizard
            |       name       |      description      |
            | demo_feature_set | Some demo description |
        And remove "automation-test-name3" MLRun Project with code 204

    @passive
    Scenario: Check expand button on Feature Store tab when change tag from "latest"
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        Then verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        Then verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then check "expand_btn" visibility in "Feature_Sets_Table" on "Feature_Store_Feature_Sets_Tab" wizard
        When select "my-tag" option in "Table_Tag_Filter_Dropdown" dropdown on "Feature_Store_Feature_Sets_Tab" wizard
        Then check "expand_btn" not visible in "Feature_Sets_Table" on "Feature_Store_Feature_Sets_Tab" wizard
        When select "Features" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then verify "Features" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then check "expand_btn" not visible in "Features_Table" on "Feature_Store_Features_Tab" wizard
        When select "All" option in "Table_Tag_Filter_Dropdown" dropdown on "Feature_Store_Features_Tab" wizard
        Then check "expand_btn" visibility in "Features_Table" on "Feature_Store_Features_Tab" wizard
        When select "my-tag" option in "Table_Tag_Filter_Dropdown" dropdown on "Feature_Store_Features_Tab" wizard
        Then check "expand_btn" not visible in "Features_Table" on "Feature_Store_Features_Tab" wizard
        When select "Feature Vectors" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then verify "Feature Vectors" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then check "expand_btn" not visible in "Feature_Vectors_Table" on "Feature_Store_Features_Vectors_Tab" wizard
        When select "All" option in "Table_Tag_Filter_Dropdown" dropdown on "Feature_Store_Features_Vectors_Tab" wizard
        Then check "expand_btn" visibility in "Feature_Vectors_Table" on "Feature_Store_Features_Vectors_Tab" wizard
        When select "test-tag" option in "Table_Tag_Filter_Dropdown" dropdown on "Feature_Store_Features_Vectors_Tab" wizard
        Then check "expand_btn" not visible in "Feature_Vectors_Table" on "Feature_Store_Features_Vectors_Tab" wizard

    @passive
    Scenario: Check MLRun logo redirection
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        And click on "MLRun_Logo" element on "commonPagesHeader" wizard
        And wait load page
        Then verify "Projects_Table" element visibility on "Projects" wizard

    @passive
    Scenario: Verify View YAML action on Feature Sets tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        Then select "View YAML" option in action menu on "Feature_Store_Feature_Sets_Tab" wizard in "Feature_Sets_Table" table at row with "test-i" value in "name" column
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

    @passive
    Scenario: Verify View YAML action on Features tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        And select "Features" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then verify "Features" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then select "View YAML" option in action menu on "Feature_Store_Features_Tab" wizard in "Features_Table" table at row with "test" value in "feature_name" column
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

    @passive
    Scenario: Verify View YAML action on Feature Vectors tab
        Given open url
        And wait load page
        And click on row root with value "fsdemo-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        And select "Feature Vectors" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then verify "Feature Vectors" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then select "View YAML" option in action menu on "Feature_Store_Features_Vectors_Tab" wizard in "Feature_Vectors_Table" table at row with "test-m" value in "name" column
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard


    @passive
    Scenario: Verify View YAML action in Item infopane on Feature Sets tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        Then verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        When click on cell with row index 1 in "name" column in "Feature_Sets_Table" table on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Action_Menu" element visibility on "Feature_Sets_Info_Pane" wizard
        Then select "View YAML" option in action menu on "Feature_Sets_Info_Pane" wizard
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

    @passive
    Scenario: Check all mandatory components on Add to feature vector popup
        Given open url
        And click on row root with value "fsdemo-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        And select "Features" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then verify "Features" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then click on "Add_To_Feature_Vector_Button" element on "Feature_Store_Features_Tab" wizard
        Then verify if "Add_To_Feature_Vector_Popup" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "Add_To_Feature_Vector_Popup" wizard
        Then verify "Project_Name_Dropdown" element visibility on "Add_To_Feature_Vector_Popup" wizard
        Then verify "Vector_Name_Dropdown" element visibility on "Add_To_Feature_Vector_Popup" wizard
        Then verify "Vector_Tag_Dropdown" element visibility on "Add_To_Feature_Vector_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Add_To_Feature_Vector_Popup" wizard
        Then "Cancel_Button" element on "Add_To_Feature_Vector_Popup" should contains "Cancel" value
        Then verify "Select_Button" element visibility on "Add_To_Feature_Vector_Popup" wizard
        Then "Select_Button" element on "Add_To_Feature_Vector_Popup" should contains "Select" value
        Then verify "Create_Feature_Vector_Button" element visibility on "Add_To_Feature_Vector_Popup" wizard
        Then "Create_Feature_Vector_Button" element on "Add_To_Feature_Vector_Popup" should contains "Create new feature vector" value

    @passive
    Scenario: Check all mandatory components on Create feature vector popup
        Given open url
        And turn on demo mode
        And click on row root with value "fsdemo-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Feature store" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Feature Vectors" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then click on "Create_Vector_Button" element on "Feature_Store_Features_Vectors_Tab" wizard
        Then "Title" element on "Create_Feature_Vector_Popup" should contains "Create feature vector" value
        Then verify "Cross_Cancel_Button" element visibility on "Create_Feature_Vector_Popup" wizard
        Then verify "Name_Input" element visibility on "Create_Feature_Vector_Popup" wizard
        Then type value "   " to "Name_Input" field on "Create_Feature_Vector_Popup" wizard
        Then verify "Name_Input" options rules on "Create_Feature_Vector_Popup" wizard
        Then verify "Tag_Input" element visibility on "Create_Feature_Vector_Popup" wizard
        Then verify "Tag_Input" input should contains "latest" value on "Create_Feature_Vector_Popup" wizard
        Then type value "   " to "Tag_Input" field on "Create_Feature_Vector_Popup" wizard
        Then verify "Tag_Input" options rules on "Create_Feature_Vector_Popup" wizard
        Then verify "Description_Input" element visibility on "Create_Feature_Vector_Popup" wizard
        Then verify "Labels_Table" element visibility on "Create_Feature_Vector_Popup" wizard
        When add rows to "Labels_Table" table on "Create_Feature_Vector_Popup" wizard
            | key_input | value_input |
            |    key1   |    value1   |
            |    key2   |    value2   |
            |    key3   |    value3   |
            |    key4   |    value4   |
            |    key5   |    value5   |
        Then verify values in "Labels_Table" table on "Create_Feature_Vector_Popup" wizard
            |       label     |
            | key1\n:\nvalue1 |
            | key2\n:\nvalue2 |
            | key3\n:\nvalue3 |
            | key4\n:\nvalue4 |
            | key5\n:\nvalue5 |
        When click on "remove_btn" in "Labels_Table" table on "Create_Feature_Vector_Popup" wizard
            |       label     |
            | key1\n:\nvalue1 |
            | key3\n:\nvalue3 |
        Then verify values in "Labels_Table" table on "Create_Feature_Vector_Popup" wizard
            |       label     |
            | key2\n:\nvalue2 |
            | key4\n:\nvalue4 |
            | key5\n:\nvalue5 |
        Then verify "Cancel_Button" element visibility on "Create_Feature_Vector_Popup" wizard
        Then "Cancel_Button" element on "Create_Feature_Vector_Popup" should contains "Cancel" value
        Then verify "Create_Button" element visibility on "Create_Feature_Vector_Popup" wizard
        Then "Create_Button" element on "Create_Feature_Vector_Popup" should contains "Create" value

    @passive
    Scenario: Check all mandatory components on Edit feature vector Popup
        Given open url
        And turn on demo mode
        And click on row root with value "fsdemo-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Feature store" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Feature Vectors" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then click on "Create_Vector_Button" element on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify if "Create_Feature_Vector_Popup" popup dialog appears
        Then type into "Name_Input" on "Create_Feature_Vector_Popup" popup dialog "automation-fv-01" value
        Then type into "Tag_Input" on "Create_Feature_Vector_Popup" popup dialog "v1" value
        Then click on "Create_Button" element on "Create_Feature_Vector_Popup" wizard
        And wait load page
        Then "Feature_Vector_Name" element on "Add_To_Feature_Vector_Tab" should contains "automation-fv-01" value
        Then "Feature_Vector_Tag" element on "Add_To_Feature_Vector_Tab" should contains "v1" value
        Then click on "Edit_Feature_Vector_Button" element on "Add_To_Feature_Vector_Tab" wizard
        Then "Title" element on "Create_Feature_Vector_Popup" should contains "Edit feature vector" value
        Then verify "Cross_Cancel_Button" element visibility on "Create_Feature_Vector_Popup" wizard
        Then verify "Name_Input" element visibility on "Create_Feature_Vector_Popup" wizard
        Then type value "   " to "Name_Input" field on "Create_Feature_Vector_Popup" wizard
        Then verify "Name_Input" options rules on "Create_Feature_Vector_Popup" wizard
        Then type value "automation-fv-02" to "Name_Input" field on "Create_Feature_Vector_Popup" wizard
        Then verify "Tag_Input" element visibility on "Create_Feature_Vector_Popup" wizard
        Then type value "v2" to "Tag_Input" field on "Create_Feature_Vector_Popup" wizard
        Then verify "Description_Input" element visibility on "Create_Feature_Vector_Popup" wizard
        Then verify "Labels_Table" element visibility on "Create_Feature_Vector_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Create_Feature_Vector_Popup" wizard
        Then "Cancel_Button" element on "Create_Feature_Vector_Popup" should contains "Cancel" value
        Then verify "Create_Button" element visibility on "Create_Feature_Vector_Popup" wizard
        Then "Create_Button" element on "Create_Feature_Vector_Popup" should contains "Create" value
        Then click on "Create_Button" element on "Create_Feature_Vector_Popup" wizard
        Then "Feature_Vector_Name" element on "Add_To_Feature_Vector_Tab" should contains "automation-fv-02" value
        Then "Feature_Vector_Tag" element on "Add_To_Feature_Vector_Tab" should contains "v2" value

    @passive
    Scenario: Check all mandatory components on Add to feature vector tab
        Given open url
        And turn on demo mode
        And click on row root with value "fsdemo-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Feature store" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Feature Vectors" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then click on "Create_Vector_Button" element on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify if "Create_Feature_Vector_Popup" popup dialog appears
        Then type into "Name_Input" on "Create_Feature_Vector_Popup" popup dialog "test" value
        Then type into "Tag_Input" on "Create_Feature_Vector_Popup" popup dialog "latest" value
        Then click on "Create_Button" element on "Create_Feature_Vector_Popup" wizard
        And wait load page
        Then verify "Add_To_Feature_Vector_Table" element visibility on "Add_To_Feature_Vector_Tab" wizard
        Then verify "Table_Tree_Filter_Dropdown" element visibility on "Add_To_Feature_Vector_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Add_To_Feature_Vector_Tab" wizard
        Then verify "Table_Entity_Filter_Input" element visibility on "Add_To_Feature_Vector_Tab" wizard
        Then verify "Table_Label_Filter_Input" element visibility on "Add_To_Feature_Vector_Tab" wizard
        Then verify "Table_Projects_Filter_Dropdown" element visibility on "Add_To_Feature_Vector_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Add_To_Feature_Vector_Tab" wizard
        Then verify "Features_Panel_Title" element visibility on "Add_To_Feature_Vector_Tab" wizard
        Then verify "Features_Panel_Title" on "Add_To_Feature_Vector_Tab" wizard should display "Input_Hint"."Add_Feature_Vector_Hint"
        When select "test-test" option in "Table_Projects_Filter_Dropdown" filter dropdown on "Add_To_Feature_Vector_Tab" wizard
        And wait load page
        Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."Common_Message"
        When select "stocks" option in "Table_Projects_Filter_Dropdown" filter dropdown on "Add_To_Feature_Vector_Tab" wizard
        And wait load page
        Then verify "Features_Panel_Title" element visibility on "Add_To_Feature_Vector_Tab" wizard
        Then verify "Features_Panel_Title" on "Add_To_Feature_Vector_Tab" wizard should display "Input_Hint"."Add_Feature_Vector_Hint"
        Then verify "Cancel_Button" element visibility on "Add_To_Feature_Vector_Tab" wizard
        Then "Cancel_Button" element on "Add_To_Feature_Vector_Tab" should contains "Cancel" value
        Then verify "Add_Button" element visibility on "Add_To_Feature_Vector_Tab" wizard
        Then "Add_Button" element on "Add_To_Feature_Vector_Tab" should contains "Add" value

    @passive
    Scenario: Verify filtering by name and entity on Add to feature vector tab
        Given open url
        And turn on demo mode
        And click on row root with value "fsdemo-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Feature store" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Feature Vectors" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then click on "Create_Vector_Button" element on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify if "Create_Feature_Vector_Popup" popup dialog appears
        Then type into "Name_Input" on "Create_Feature_Vector_Popup" popup dialog "test" value
        Then type into "Tag_Input" on "Create_Feature_Vector_Popup" popup dialog "latest" value
        Then click on "Create_Button" element on "Create_Feature_Vector_Popup" wizard
        And wait load page
        Then type value "dep" to "Table_Name_Filter_Input" field on "Add_To_Feature_Vector_Tab" wizard
        Then type value "patient_id" to "Table_Entity_Filter_Input" field on "Add_To_Feature_Vector_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Add_To_Feature_Vector_Tab" wizard
        Then value in "featureName" column with "text" in "Add_To_Feature_Vector_Table" on "Add_To_Feature_Vector_Tab" wizard should contains "department"
        Then value in "entities" column with "text" in "Add_To_Feature_Vector_Table" on "Add_To_Feature_Vector_Tab" wizard should contains "patient_id"
        Then type value "" to "Table_Name_Filter_Input" field on "Add_To_Feature_Vector_Tab" wizard
        Then type value "patient_id" to "Table_Entity_Filter_Input" field on "Add_To_Feature_Vector_Tab" wizard
        Then click on "Table_Refresh_Button" element on "Add_To_Feature_Vector_Tab" wizard
        Then value in "entities" column with "text" in "Add_To_Feature_Vector_Table" on "Add_To_Feature_Vector_Tab" wizard should contains "patient_id"

    @inProgress
    Scenario: Add to feature vector
        Given open url
        And turn on demo mode
        And click on row root with value "fsdemo-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Feature store" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Feature Vectors" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then click on "Create_Vector_Button" element on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify if "Create_Feature_Vector_Popup" popup dialog appears
        Then type into "Name_Input" on "Create_Feature_Vector_Popup" popup dialog "temp_vector01" value
        Then type into "Tag_Input" on "Create_Feature_Vector_Popup" popup dialog "temp_tag" value
        Then type into "Description_Input" on "Create_Feature_Vector_Popup" popup dialog "Automation test description" value
        Then click on "Create_Button" element on "Create_Feature_Vector_Popup" wizard
        And wait load page
        Then click on "add_feature_btn" in "Add_To_Feature_Vector_Table" table on "Add_To_Feature_Vector_Tab" wizard
            | featureName              |
            | department               |
            | room                     |
            | age_mapped_elder         |
            | gender                   |
        Then verify values in "Features_Panel_Table" table in "Selected_Project_Accordion" on "Add_To_Feature_Vector_Tab" wizard
            | feature                                           |
            | patient_details : latest #department              |
            | patient_details : latest #room                    |
            | patient_details : latest #age_mapped_elder        |
            | patient_details : latest #gender                  |
        Then click on "remove_btn" in "Features_Panel_Table" table in "Selected_Project_Accordion" on "Add_To_Feature_Vector_Tab" wizard
            | feature                        |
            | patient_details : latest #room |
        Then verify values in "Features_Panel_Table" table in "Selected_Project_Accordion" on "Add_To_Feature_Vector_Tab" wizard
            | feature                                           |
            | patient_details : latest #department              |
            | patient_details : latest #age_mapped_elder        |
            | patient_details : latest #gender                  |
        Then select "stocks" option in "Table_Projects_Filter_Dropdown" dropdown on "Add_To_Feature_Vector_Tab" wizard
        Then expand "Features_By_Projects_Accordion" on "Add_To_Feature_Vector_Tab" wizard
        Then verify values in "Features_By_Projects_Table" table in "Features_By_Projects_Accordion" on "Add_To_Feature_Vector_Tab" wizard
            | feature                                           |
            | patient_details : latest #department              |
            | patient_details : latest #age_mapped_elder        |
            | patient_details : latest #gender                  |
        Then click on "add_feature_btn" in "Add_To_Feature_Vector_Table" table on "Add_To_Feature_Vector_Tab" wizard
            | featureName |
            | name        |
            | exchange    |
            | bid         |
            | extra       |
        Then verify values in "Features_Panel_Table" table in "Selected_Project_Accordion" on "Add_To_Feature_Vector_Tab" wizard
            | feature                      |
            | stocks : latest #name        |
            | stocks : latest #exchange    |
            | stock-quotes : latest #bid   |
            | stock-quotes : latest #extra |
        Then click on "remove_btn" in "Features_Panel_Table" table in "Selected_Project_Accordion" on "Add_To_Feature_Vector_Tab" wizard
            | feature                      |
            | stock-quotes : latest #bid   |
            | stock-quotes : latest #extra |
        Then verify values in "Features_Panel_Table" table in "Selected_Project_Accordion" on "Add_To_Feature_Vector_Tab" wizard
            | feature                      |
            | stocks : latest #name        |
            | stocks : latest #exchange    |
        Then click on "Add_Button" element on "Add_To_Feature_Vector_Tab" wizard
        And set tear-down property "featureVector" created in "fsdemo-admin" project with "temp_vector01" value
        When select "temp_tag" option in "Table_Tree_Filter_Dropdown" filter dropdown on "Add_To_Feature_Vector_Tab" wizard
        Then value in "name" column with "text" in "Feature_Vectors_Table" on "Feature_Store_Features_Vectors_Tab" wizard should contains "temp_vector"
        Then value in "description" column with "text" in "Feature_Vectors_Table" on "Feature_Store_Features_Vectors_Tab" wizard should contains "Automation test description"

    @inProgress
    Scenario: Check all mandatory components in Item infopane on Requested Features tab on Feature Vectors tab
        Given open url
        And turn on demo mode
        And click on row root with value "fsdemo-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Feature store" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Feature Vectors" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then click on "Create_Vector_Button" element on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify if "Create_Feature_Vector_Popup" popup dialog appears
        Then type into "Name_Input" on "Create_Feature_Vector_Popup" popup dialog "temp_vector02" value
        Then type into "Tag_Input" on "Create_Feature_Vector_Popup" popup dialog "latest" value
        Then click on "Create_Button" element on "Create_Feature_Vector_Popup" wizard
        And wait load page
        Then click on "add_feature_btn" in "Add_To_Feature_Vector_Table" table on "Add_To_Feature_Vector_Tab" wizard
            | featureName |
            | department  |
            | bad         |
            | room         |
        Then select "stocks-admin" option in "Table_Projects_Filter_Dropdown" dropdown on "Add_To_Feature_Vector_Tab" wizard
        Then click on "add_feature_btn" in "Add_To_Feature_Vector_Table" table on "Add_To_Feature_Vector_Tab" wizard
            | featureName  |
            | price        |
            | volume       |
            | last_updated |
        Then click on "Add_Button" element on "Add_To_Feature_Vector_Tab" wizard
        And wait load page
        And set tear-down property "featureVector" created in "fsdemo-admin" project with "temp_vector02" value
        Then click on "Table_Refresh_Button" element on "Feature_Store_Features_Vectors_Tab" wizard
        And wait load page
        Then click on cell with value "temp_vector02" in "name" column in "Feature_Vectors_Table" table on "Feature_Store_Features_Vectors_Tab" wizard
        Then select "Requested Features" tab in "Info_Pane_Tab_Selector" on "Feature_Vectors_Info_Pane" wizard
        Then click on "add_alias" in "Requested_Features_Table" table on "Requested_Features_Info_Pane" wizard
            | feature    |
            | room       |
        Then type value "test_alias" to "Alias_Input" field on "Requested_Features_Info_Pane" wizard
        Then click on "apply_btn" in "Requested_Features_Table" table on "Requested_Features_Info_Pane" wizard
            | feature    |
            | room       |
        Then click on "add_alias" in "Requested_Features_Table" table on "Requested_Features_Info_Pane" wizard
            | feature    |
            | price       |
        Then type value "price_alias" to "Alias_Input" field on "Requested_Features_Info_Pane" wizard
        Then click on "apply_btn" in "Requested_Features_Table" table on "Requested_Features_Info_Pane" wizard
            | feature    |
            | price      |
        Then click on "add_alias" in "Requested_Features_Table" table on "Requested_Features_Info_Pane" wizard
            | feature      |
            | last_updated |
        Then type value "last_updated_alias" to "Alias_Input" field on "Requested_Features_Info_Pane" wizard
        Then click on "discard_btn" in "Requested_Features_Table" table on "Requested_Features_Info_Pane" wizard
            | feature      |
            | last_updated |
        Then click on "add_alias" in "Requested_Features_Table" table on "Requested_Features_Info_Pane" wizard
            | feature |
            | room    |
        Then type value "room_alias" to "Alias_Input" field on "Requested_Features_Info_Pane" wizard
        Then click on "discard_btn" in "Requested_Features_Table" table on "Requested_Features_Info_Pane" wizard
            | feature    |
            | room       |
        Then verify values in "Requested_Features_Table" table on "Requested_Features_Info_Pane" wizard
            | projectName  |        featureSet         |    feature   |  alias      |
            | fsdemo-admin | patient_details\n: latest |  department  |             |
            | fsdemo-admin | patient_details\n: latest |      bad     |             |
            | fsdemo-admin | patient_details\n: latest |      room    | test_alias  |
            | stocks-admin |     stocks\n: latest      |     price    | price_alias |
            | stocks-admin |     stocks\n: latest      |    volume    |             |
            | stocks-admin |     stocks\n: latest      | last_updated |             |
        Then click on "delete_btn" in "Requested_Features_Table" table on "Requested_Features_Info_Pane" wizard
            | feature    |
            | department |
        Then verify if "Common_Popup" popup dialog appears
        Then "Description" component on "Common_Popup" should be equal "Descriptions"."Delete_Feature"
        Then "Cancel_Button" element on "Common_Popup" should contains "Cancel" value
        Then "Delete_Button" element on "Common_Popup" should contains "Delete" value
        Then click on "Delete_Button" element on "Common_Popup" wizard
        Then verify values in "Requested_Features_Table" table on "Requested_Features_Info_Pane" wizard
            | projectName  |        featureSet         |   feature    |
            | fsdemo-admin | patient_details\n: latest |     bad      |
            | fsdemo-admin | patient_details\n: latest |     room     |
            | stocks-admin |      stocks\n: latest     |    price     |
            | stocks-admin |      stocks\n: latest     |   volume     |
            | stocks-admin |      stocks\n: latest     | last_updated |

    Scenario: Verify Feature Label icon on Requested Features tab on Feature Vectors tab
        And set tear-down property "featureVector" created in "default" project with "test_vector" value
        Given open url
        And turn on demo mode
        And click on row root with value "fsdemo-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Feature store" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Feature Vectors" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then click on "Create_Vector_Button" element on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify if "Create_Feature_Vector_Popup" popup dialog appears
        Then type into "Name_Input" on "Create_Feature_Vector_Popup" popup dialog "test_vector" value
        Then type into "Tag_Input" on "Create_Feature_Vector_Popup" popup dialog "latest" value
        Then click on "Create_Button" element on "Create_Feature_Vector_Popup" wizard
        And wait load page
        Then click on "add_feature_btn" in "Add_To_Feature_Vector_Table" table on "Add_To_Feature_Vector_Tab" wizard
            | featureName |
            | department  |
        Then click on "set_as_label_btn" in "Features_Panel_Table" table in "Selected_Project_Accordion" on "Add_To_Feature_Vector_Tab" wizard
            | feature                              |
            | patient_details : latest #department |
        Then click on "Add_Button" element on "Add_To_Feature_Vector_Tab" wizard
        And wait load page
        Then click on cell with value "test_vector" in "name" column in "Feature_Vectors_Table" table on "Feature_Store_Features_Vectors_Tab" wizard
        Then select "Requested Features" tab in "Info_Pane_Tab_Selector" on "Feature_Vectors_Info_Pane" wizard
        And wait load page
        Then value in "labelIcon" column with "tooltip" in "Requested_Features_Table" on "Requested_Features_Info_Pane" wizard should contains "Label column"

    Scenario: Verify No Data message on Feature Store tabs
        * set tear-down property "project" created with "automation-test-name001" value
        * create "automation-test-name001" MLRun Project with code 201
        Given open url
        And click on row root with value "automation-test-name001" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And select "tab" with "Feature Store" value in breadcrumbs menu
        And wait load page
        Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."Common_Message"
        * set tear-down property "featureSet" created in "automation-test-name001" project with "test_fs" value
        * create "test_fs" Feature Set in "automation-test-name001" project with code 200
        Then click on "Table_Refresh_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        And click on cell with value "test_fs" in "name" column in "Feature_Sets_Table" table on "Feature_Store_Feature_Sets_Tab" wizard
        Then select "Preview" tab in "Info_Pane_Tab_Selector" on "Feature_Sets_Info_Pane" wizard
        And wait load page
        Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."Common_Message"
        Then select "Analysis" tab in "Info_Pane_Tab_Selector" on "Feature_Sets_Info_Pane" wizard
        And wait load page
        Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."Common_Message"
        Then select "Features" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."Common_Message"
        Then select "Feature Vectors" tab in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        And wait load page
        Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."Common_Message"
        * set tear-down property "featureVector" created in "automation-test-name001" project with "test_fv" value
        * create "test_fv" Feature Vector in "automation-test-name001" project with code 200
        Then click on "Table_Refresh_Button" element on "Feature_Store_Features_Vectors_Tab" wizard
        And click on cell with value "test_fv" in "name" column in "Feature_Vectors_Table" table on "Feature_Store_Features_Vectors_Tab" wizard
        Then select "Requested Features" tab in "Info_Pane_Tab_Selector" on "Feature_Vectors_Info_Pane" wizard
        And wait load page
        Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."Common_Message"
        Then select "Analysis" tab in "Info_Pane_Tab_Selector" on "Feature_Vectors_Info_Pane" wizard
        And wait load page
        Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."Common_Message"


