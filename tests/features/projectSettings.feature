Feature: Project Settings page

    Testcases that verifies functionality on Project Settings page
    !!!TestSuit in progress!!!

    @passive
    @inProgress
    Scenario: Verify all mandatory components on General Tab
        Given open url
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then click on "Project_Settings_Button" element on "Project" wizard
        Then verify "Project_Settings_Tab_Selector" on "Project_Settings_General_Tab" wizard should contains "Project_Settings"."Tab_List"
        Then verify "General" tab is active in "Project_Settings_Tab_Selector" on "Project_Settings_General_Tab" wizard
        Then verify "Artifact_Path_Input" element visibility on "Project_Settings_General_Tab" wizard
        Then type value "   " to "Artifact_Path_Input" field on "Project_Settings_General_Tab" wizard
        Then verify "Artifact_Path_Input" on "Project_Settings_General_Tab" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "Parameters_Table" element visibility on "Project_Settings_General_Tab" wizard

    Scenario: Verify Parameters Table on General Tab
        * create "automation-test-name5" MLRun Project with code 200
        Given open url
        And click on cell with value "automation-test-name5" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on "Project_Settings_Button" element on "Project" wizard
        When add new rows to "Parameters_Table" table on "Project_Settings_General_Tab" wizard using nontable inputs
            | Parameters_Table_Key_Input | Parameters_Table_Value_Input | Parameters_Table_Add_Row_Button |
            |                            |                              |               yes               |
        Then verify "Parameters_Table_Key_Input" on "Project_Settings_General_Tab" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then verify "Parameters_Table_Value_Input" on "Project_Settings_General_Tab" wizard should display warning "Input_Hint"."Input_Field_Require"
        When click on "Parameters_Table_Discard_Row_Button" element on "Project_Settings_General_Tab" wizard
        When add new rows to "Parameters_Table" table on "Project_Settings_General_Tab" wizard using nontable inputs
            | Parameters_Table_Key_Input | Parameters_Table_Value_Input | Parameters_Table_Add_Row_Button | Parameters_Table_Discard_Row_Button |
            |          key0              |           value0             |               yes               |                                     |
            |          key1              |           value1             |               yes               |                                     |
            |          key2              |           value2             |                                 |                 yes                 |
            |          key3              |           value3             |                                 |                 yes                 |
            |          key4              |           value4             |               yes               |                                     |
            |          key5              |           value5             |                                 |                 yes                 |
            |          key6              |           value6             |               yes               |                                     |
            |          key7              |           value7             |                                 |                 yes                 |
            |          key8              |           value8             |               yes               |                                     |
            |          key9              |           value9             |                                 |                 yes                 |
        Then verify values in "Parameters_Table" table on "Project_Settings_General_Tab" wizard
            | key  | value  |
            | key0 | value0 |
            | key1 | value1 |
            | key4 | value4 |
            | key6 | value6 |
            | key8 | value8 |
        When click on "remove_btn" in "Parameters_Table" table on "Project_Settings_General_Tab" wizard with offset "true"
            | key  |
            | key1 |
            | key4 |
            | key8 |
        Then verify values in "Parameters_Table" table on "Project_Settings_General_Tab" wizard
            | key  | value  |
            | key0 | value0 |
            | key6 | value6 |
        And remove "automation-test-name5" MLRun Project with code 204

    @passive
    Scenario: Check MLRun logo redirection
        Given open url
        And wait load page
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then click on "Project_Settings_Button" element on "Project" wizard
        And click on "MLRun_Logo" element on "commonPagesHeader" wizard
        And wait load page
        Then verify "Projects_Table" element visibility on "Projects" wizard
