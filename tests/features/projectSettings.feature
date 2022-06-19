Feature: Project Settings page

    Testcases that verifies functionality on Project Settings page
    !!!TestSuit in progress!!!

    @inProgress
    Scenario: Verify all mandatory components on General Tab
        * set tear-down property "project" created with "automation-test-name8" value
        * create "automation-test-name8" MLRun Project with code 201
        Given open url
        And click on row root with value "automation-test-name8" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify breadcrumbs "project" label should be equal "automation-test-name8" value
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on "Project_Settings_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        Then verify "Project_Settings_Tab_Selector" on "Project_Settings_General_Tab" wizard should contains "Project_Settings"."Tab_List"
        Then verify "General" tab is active in "Project_Settings_Tab_Selector" on "Project_Settings_General_Tab" wizard
        Then verify "Artifact_Path_Input" element visibility on "Project_Settings_General_Tab" wizard
        Then type value "   " to "Artifact_Path_Input" field on "Project_Settings_General_Tab" wizard
        Then verify "Artifact_Path_Input" on "Project_Settings_General_Tab" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "Parameters_Table" element visibility on "Project_Settings_General_Tab" wizard
        Then click on "Source_URL_Edit_Button" element on "Project_Settings_General_Tab" wizard
        Then type value "   " to "Source_URL_Edit_Input" field on "Project_Settings_General_Tab" wizard
        Then verify "Source_URL_Edit_Input" on "Project_Settings_General_Tab" wizard should display warning "Input_Hint"."Input_Field_Invalid"

    Scenario: Verify Parameters Table on General Tab
        * set tear-down property "project" created with "automation-test-name5" value
        * create "automation-test-name5" MLRun Project with code 201
        Given open url
        And click on row root with value "automation-test-name5" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on "Project_Settings_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
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
        And refresh a page
        When click on "remove_btn" in "Parameters_Table" table on "Project_Settings_General_Tab" wizard
            | key  |
            | key1 |
            | key4 |
            | key8 |
        Then verify values in "Parameters_Table" table on "Project_Settings_General_Tab" wizard
            | key  | value  |
            | key0 | value0 |
            | key6 | value6 |

    @passive
    Scenario: Check MLRun logo redirection
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on "Project_Settings_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And click on "MLRun_Logo" element on "commonPagesHeader" wizard
        And wait load page
        Then verify "Projects_Table" element visibility on "Projects" wizard

    @passive
    Scenario: Verify all mandatory components on Secrets tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on "Project_Settings_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Secrets" tab in "Project_Settings_Tab_Selector" on "Project_Settings_General_Tab" wizard
        And wait load page
        Then verify "Secrets_Table" element visibility on "Projects_Settings_Secret_Tab" wizard
        Then click on "Add_Secret_Button" element on "Projects_Settings_Secret_Tab" wizard
        Then verify "New_Secret_Key_Input" element visibility on "Create_New_Secret_Popup" wizard
        Then type value "   " to "New_Secret_Key_Input" field on "Create_New_Secret_Popup" wizard
        Then verify "New_Secret_Key_Input" on "Create_New_Secret_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "New_Secret_Value_Input" element visibility on "Create_New_Secret_Popup" wizard
        Then type value "   " to "New_Secret_Value_Input" field on "Create_New_Secret_Popup" wizard
        Then verify "New_Secret_Value_Input" on "Create_New_Secret_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"


    @inProgress
    Scenario: Verify Secrets table on Secrets tab
        * set tear-down property "project" created with "automation-test" value
        * create "automation-test" MLRun Project with code 201
        Given open url
        And wait load page
        And click on row root with value "automation-test" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on "Project_Settings_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Secrets" tab in "Project_Settings_Tab_Selector" on "Project_Settings_General_Tab" wizard
        And wait load page
        When add rows to "Secrets_Table" key-value table on "Projects_Settings_Secret_Tab" wizard
            | key_input | value_input |
            |    key1   |    value1   |
            |    key2   |    value2   |
            |    key3   |    value3   |
            |    key4   |    value4   |
        Then verify values in "Secrets_Table" table on "Projects_Settings_Secret_Tab" wizard
            | key  |
            | key1 |
            | key2 |
            | key3 |
            | key4 |
        When click on "remove_btn" in "Secrets_Table" table on "Projects_Settings_Secret_Tab" wizard
            | key  |
            | key1 |
            | key4 |
        Then verify values in "Secrets_Table" table on "Projects_Settings_Secret_Tab" wizard
            | key  |
            | key2 |
            | key3 |

    @passive
    @inProgress
    @enabledProjectMembership
    Scenario: Check all mandatory components on Project Owner Popup
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on "Project_Settings_Button" element on "commonPagesHeader" wizard
        And wait load page
        Then verify "Discard_Button" element visibility on "Change_Project_Owner_Popup" wizard
        Then verify "Apply_Button" element visibility on "Change_Project_Owner_Popup" wizard
        When type searchable fragment "D" into "Search_Input" on "Change_Project_Owner_Popup" wizard
        And wait load page
        Then searchable case "insensitive" fragment "D" should be in every suggested option into "Search_Input" on "Change_Project_Owner_Popup" wizard
        When type searchable fragment "admin" into "Search_Input" on "Change_Project_Owner_Popup" wizard
        And wait load page
        Then searchable case "insensitive" fragment "admin" should be in every suggested option into "Search_Input" on "Change_Project_Owner_Popup" wizard

    @passive
    @inProgress
    @enabledProjectMembership
    Scenario: Check all mandatory components on Project Member Popup
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on "Project_Settings_Button" element on "commonPagesHeader" wizard
        And select "Members" tab in "Project_Settings_Tab_Selector" on "Project_Settings_General_Tab" wizard
        And wait load page
        Then verify "Member_Overview_Labels_Table" element visibility on "Project_Members_Popup" wizard
        Then verify "Member_Overview_Tooltip" on "Project_Members_Popup" wizard should display "Label_Hint"."Members_Hint"
        Then verify "Invite_New_Members_Button" element visibility on "Project_Members_Popup" wizard
        Then verify "Members_Filter_Input" element visibility on "Project_Members_Popup" wizard
        Then verify "Role_Filter_Dropdown" element visibility on "Project_Members_Popup" wizard
        Then verify "Members_Table" element visibility on "Project_Members_Popup" wizard
        Then verify "Notify_by_Email_Checkbox" element visibility on "Project_Members_Popup" wizard
        Then verify "Discard_Button" element visibility on "Project_Members_Popup" wizard
        Then verify "Apply_Button" element visibility on "Project_Members_Popup" wizard
        Then verify "Footer_Annotation_Label" element visibility on "Project_Members_Popup" wizard

    @enabledProjectMembership
    Scenario: Verify behaviour of Invite New Members on Project Member Popup
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on "Project_Settings_Button" element on "commonPagesHeader" wizard
        And wait load page
        And select "Members" tab in "Project_Settings_Tab_Selector" on "Project_Settings_General_Tab" wizard
        And wait load page
        Then "Members_Summary" element on "Project_Members_Popup" should contains "0members have access to this project" value
        Then verify "Discard_Button" element on "Project_Members_Popup" wizard is disabled
        Then verify "Apply_Button" element on "Project_Members_Popup" wizard is disabled
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
        Then verify "Discard_Button" element on "Project_Members_Popup" wizard is enabled
        Then verify "Apply_Button" element on "Project_Members_Popup" wizard is enabled
        Then click on "Invite_New_Members_Button" element on "Project_Members_Popup" wizard
        Then type value "all" to "New_Member_Name_Input" field on "Project_Members_Popup" wizard
        Then select "all_users" option in "New_Member_Name_Dropdown" dropdown on "Project_Members_Popup" wizard
        Then select "Viewer" option in "New_Member_Role_Dropdown" dropdown on "Project_Members_Popup" wizard
        Then click on "New_Member_Add_Button" element on "Project_Members_Popup" wizard
        Then verify values in "Members_Table" table on "Project_Members_Popup" wizard
            | name      | role   |
            | admin     | Admin  |
            | all_users | Viewer |
        Then click on "Apply_Button" element on "Project_Members_Popup" wizard
        And wait load page
        Then "Members_Summary" element on "Project_Members_Popup" should contains "2members have access to this project" value
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
        Then click on "Apply_Button" element on "Project_Members_Popup" wizard
        And wait load page
        Then "Members_Summary" element on "Project_Members_Popup" should contains "1member has access to this project" value
        When click on "delete_btn" in "Members_Table" table on "Project_Members_Popup" wizard with offset "false"
            | name      |
            | all_users |
        Then click on "Remove_Member_Button" element on "Remove_Member_Popup" wizard
        Then click on "Discard_Button" element on "Project_Members_Popup" wizard
        Then verify if "Discard_Changes_Popup" popup dialog appears
        Then "No_Button" element on "Discard_Changes_Popup" should contains "No" value
        Then "Discard_Button" element on "Discard_Changes_Popup" should contains "Discard" value
        Then click on "Discard_Button" element on "Discard_Changes_Popup" wizard
        Then verify "Discard_Button" element on "Project_Members_Popup" wizard is disabled
        Then verify "Apply_Button" element on "Project_Members_Popup" wizard is disabled
        And remove "automation-test" MLRun Project with code 204
