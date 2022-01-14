Feature: MLRun Projects Page

    Testcases that verifies functionality on MLRun Projects Page

    @passive
    Scenario: Check all mandatory components
        Given open url
        And wait load page
        Then verify "New_Project_Button" element visibility on "Projects" wizard
        Then "New_Project_Button" element on "Projects" should contains "New Project" value
        Then verify "See_On_Github" element visibility on "commonPagesHeader" wizard
        Then verify "Projects_Dropdown" element visibility on "Projects" wizard
        Then verify "Projects_Sort_Dropdown" element visibility on "Projects" wizard
        Then verify "Projects_Sorter" element visibility on "Projects" wizard
        Then verify "Projects_Table" element visibility on "Projects" wizard

    @passive
    Scenario: Verify filtering by project name
        Given open url
        And wait load page
        Then type value "stocks" to "Search_Projects_Input" field on "Projects" wizard
        Then value in "name" column with "text" in "Projects_Table" on "Projects" wizard should contains "stocks"
        Then type value "at" to "Search_Projects_Input" field on "Projects" wizard
        Then click on "Refresh_Projects_Button" element on "Projects" wizard
        And wait load page
        Then value in "name" column with "text" in "Projects_Table" on "Projects" wizard should contains "at"

    @passive
    Scenario: Sort projects in ascending and descending order
        Given open url
        And wait load page
        When select "By name" option in "Projects_Sort_Dropdown" dropdown on "Projects" wizard
        Then sort projects in ascending order
        Then sort projects in descending order

    @passive
    Scenario: Verify all mandatory components on Create new ML Project
        Given open url
        And wait load page
        Then check "automation-test-name" value not in "name" column in "Projects_Table" table on "Projects" wizard
        Then click on "New_Project_Button" element on "Projects" wizard
        Then verify if "Create_New_Project" popup dialog appears
        Then verify "Name_Input" element visibility on "Create_New_Project" wizard
        Then verify "Name_Input" on "Create_New_Project" wizard should display "Input_Hint"."Project_Name_Hint"
        Then verify "Name_Input" according hint rules on "Create_New_Project" wizard
        Then verify "Description_Input" element visibility on "Create_New_Project" wizard
        Then verify "Cancel_Button" element visibility on "Create_New_Project" wizard
        Then "Cancel_Button" element on "Create_New_Project" should contains "Cancel" value
        Then verify "Create_Button" element visibility on "Create_New_Project" wizard
        Then "Create_Button" element on "Create_New_Project" should contains "Create" value
        Then type into "Name_Input" on "Create_New_Project" popup dialog "default" value
        Then click on "Create_Button" element on "Create_New_Project" wizard
        Then "Error_Message" component on "Create_New_Project" should be equal "Error_Messages"."Create_New_Project"

    @passive
    Scenario: Verify all mandatory components on Archive ML Project
        Given open url
        And wait load page
        Then select "Archive" option in action menu on "Projects" wizard in "Projects_Table" table at row with "cat-vs-dog-classification" value in "name" column
        Then verify if "Common_Popup" popup dialog appears
        Then "Description" component on "Common_Popup" should contains "Descriptions"."Archive_Project"
        Then verify "Cancel_Button" element visibility on "Common_Popup" wizard
        Then "Cancel_Button" element on "Common_Popup" should contains "Cancel" value
        Then verify "Confirm_Button" element visibility on "Common_Popup" wizard
        Then "Confirm_Button" element on "Common_Popup" should contains "Archive" value

    @passive
    Scenario: Verify all mandatory components on Delete existing ML Project
        Given open url
        And wait load page
        Then select "Delete" option in action menu on "Projects" wizard in "Projects_Table" table at row with "churn-project-admin" value in "name" column
        Then verify if "Common_Popup" popup dialog appears
        Then "Description" component on "Common_Popup" should be equal "Descriptions"."Delete_Project"
        Then verify "Cancel_Button" element visibility on "Common_Popup" wizard
        Then "Cancel_Button" element on "Common_Popup" should contains "Cancel" value
        Then verify "Delete_Button" element visibility on "Common_Popup" wizard
        Then "Delete_Button" element on "Common_Popup" should contains "Delete" value

    @sanity
    Scenario: Create new ML Project with description
        Given open url
        And wait load page
        Then check "automation-test-name" value not in "name" column in "Projects_Table" table on "Projects" wizard
        Then click on "New_Project_Button" element on "Projects" wizard
        Then verify if "Create_New_Project" popup dialog appears
        Then type into "Name_Input" on "Create_New_Project" popup dialog "automation-test-name" value
        Then type into "Description_Input" on "Create_New_Project" popup dialog "automation test description" value
        Then click on "Create_Button" element on "Create_New_Project" wizard
        And set tear-down property "project" created with "automation-test-name" value
        Then check "automation-test-name" value in "name" column in "Projects_Table" table on "Projects" wizard
        And remove "automation-test-name" MLRun Project with code 204

    Scenario: Archive ML Project
        * create "automation-test-name1" MLRun Project with code 201
        And set tear-down property "project" created with "automation-test-name1" value
        Given open url
        And wait load page
        Then check "automation-test-name1" value in "name" column in "Projects_Table" table on "Projects" wizard
        Then select "Archive" option in action menu on "Projects" wizard in "Projects_Table" table at row with "automation-test-name1" value in "name" column
        Then verify if "Common_Popup" popup dialog appears
        Then click on "Confirm_Button" element on "Common_Popup" wizard
        Then check "automation-test-name1" value not in "name" column in "Projects_Table" table on "Projects" wizard
        When select "Archived Projects" option in "Projects_Dropdown" dropdown on "Projects" wizard
        Then check "automation-test-name1" value in "name" column in "Projects_Table" table on "Projects" wizard
        And remove "automation-test-name1" MLRun Project with code 204

    Scenario: Delete existing ML Project
        * create "automation-test-name2" MLRun Project with code 201
        And set tear-down property "project" created with "automation-test-name2" value
        Given open url
        And wait load page
        Then check "automation-test-name2" value in "name" column in "Projects_Table" table on "Projects" wizard
        Then select "Delete" option in action menu on "Projects" wizard in "Projects_Table" table at row with "automation-test-name2" value in "name" column
        Then verify if "Common_Popup" popup dialog appears
        Then click on "Delete_Button" element on "Common_Popup" wizard
        Then check "automation-test-name2" value not in "name" column in "Projects_Table" table on "Projects" wizard
        And remove "automation-test-name2" MLRun Project with code 500

    Scenario: Unarchive ML Project
        * create "automation-test-name7" MLRun Project with code 201
        And set tear-down property "project" created with "automation-test-name7" value
        Given open url
        And wait load page
        Then check "automation-test-name7" value in "name" column in "Projects_Table" table on "Projects" wizard
        Then select "Archive" option in action menu on "Projects" wizard in "Projects_Table" table at row with "automation-test-name7" value in "name" column
        Then verify if "Common_Popup" popup dialog appears
        Then click on "Confirm_Button" element on "Common_Popup" wizard
        Then check "automation-test-name7" value not in "name" column in "Projects_Table" table on "Projects" wizard
        When select "Archived Projects" option in "Projects_Dropdown" dropdown on "Projects" wizard
        Then check "automation-test-name7" value in "name" column in "Projects_Table" table on "Projects" wizard
        Then select "Unarchive" option in action menu on "Projects" wizard in "Projects_Table" table at row with "automation-test-name7" value in "name" column
        When select "All Projects" option in "Projects_Dropdown" dropdown on "Projects" wizard
        Then check "automation-test-name7" value in "name" column in "Projects_Table" table on "Projects" wizard
        And remove "automation-test-name7" MLRun Project with code 204

    @passive
    Scenario: Verify View YAML action
        Given open url
        And wait load page
        Then select "View YAML" option in action menu on "Projects" wizard in "Projects_Table" table at row with "default" value in "name" column
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

    @danger
#   Run this test case only with mocked backend!!!
    Scenario: Check projects limit message
        Then create up to limit projects with code 201
        Given open url
        And wait load page
        Then click on "New_Project_Button" element on "Projects" wizard
        Then type into "Name_Input" on "Create_New_Project" popup dialog "automation-test-name201" value
        Then click on "Create_Button" element on "Create_New_Project" wizard
        Then "Error_Message" component on "Create_New_Project" should contains "Error_Messages"."Projects_Limit_Reached"
