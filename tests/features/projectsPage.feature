Feature: MLRun Projects Page

    Testcases that verifies functionality on MLRun Projects Page

    @passive
    Scenario: Check all mandatory components
        Given open url
        And wait load page
        Then verify "New_Project_Button" element visibility on "Projects" wizard
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
        Then verify "Create_Button" element visibility on "Create_New_Project" wizard

    @passive
    Scenario: Verify all mandatory components on Archive ML Project
        Given open url
        And wait load page
        Then select "Archive" option in action menu on "Projects" wizard in "Projects_Table" table at row with "cat-vs-dog-classification" value in "name" column
        Then verify if "Archive_Project" popup dialog appears
        Then "Description" component on "Archive_Project" should contains "Descriptions"."Archive_Project"
        Then verify "Cancel_Button" element visibility on "Archive_Project" wizard
        Then verify "Archive_Button" element visibility on "Archive_Project" wizard

    @passive
    Scenario: Verify all mandatory components on Delete existing ML Project
        Given open url
        And wait load page
        Then select "Delete" option in action menu on "Projects" wizard in "Projects_Table" table at row with "churn-project-admin" value in "name" column
        Then verify if "Delete_Project" popup dialog appears
        Then "Description" component on "Delete_Project" should contains "Descriptions"."Delete_Project"
        Then verify "Cancel_Button" element visibility on "Delete_Project" wizard
        Then verify "Delete_Button" element visibility on "Delete_Project" wizard

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
        Then check "automation-test-name" value in "name" column in "Projects_Table" table on "Projects" wizard
        And remove "automation-test-name" MLRun Project with code 204

    Scenario: Archive ML Project
        * create "automation-test-name1" MLRun Project with code 200
        Given open url
        And wait load page
        Then check "automation-test-name1" value in "name" column in "Projects_Table" table on "Projects" wizard
        Then select "Archive" option in action menu on "Projects" wizard in "Projects_Table" table at row with "automation-test-name1" value in "name" column
        Then verify if "Archive_Project" popup dialog appears
        Then click on "Archive_Button" element on "Archive_Project" wizard
        Then check "automation-test-name1" value not in "name" column in "Projects_Table" table on "Projects" wizard
        When select "Archived Projects" option in "Projects_Dropdown" dropdown on "Projects" wizard
        Then check "automation-test-name1" value in "name" column in "Projects_Table" table on "Projects" wizard
        And remove "automation-test-name1" MLRun Project with code 204

    Scenario: Delete existing ML Project
        * create "automation-test-name2" MLRun Project with code 200
        Given open url
        And wait load page
        Then check "automation-test-name2" value in "name" column in "Projects_Table" table on "Projects" wizard
        Then select "Delete" option in action menu on "Projects" wizard in "Projects_Table" table at row with "automation-test-name2" value in "name" column
        Then verify if "Delete_Project" popup dialog appears
        Then click on "Delete_Button" element on "Delete_Project" wizard
        Then check "automation-test-name2" value not in "name" column in "Projects_Table" table on "Projects" wizard
        And remove "automation-test-name2" MLRun Project with code 500

    Scenario: Unarchive ML Project
        * create "automation-test-name3" MLRun Project with code 200
        Given open url
        And wait load page
        Then check "automation-test-name3" value in "name" column in "Projects_Table" table on "Projects" wizard
        Then select "Archive" option in action menu on "Projects" wizard in "Projects_Table" table at row with "automation-test-name3" value in "name" column
        Then verify if "Archive_Project" popup dialog appears
        Then click on "Archive_Button" element on "Archive_Project" wizard
        Then check "automation-test-name3" value not in "name" column in "Projects_Table" table on "Projects" wizard
        When select "Archived Projects" option in "Projects_Dropdown" dropdown on "Projects" wizard
        Then check "automation-test-name3" value in "name" column in "Projects_Table" table on "Projects" wizard
        Then select "Unarchive" option in action menu on "Projects" wizard in "Projects_Table" table at row with "automation-test-name3" value in "name" column
        When select "All Projects" option in "Projects_Dropdown" dropdown on "Projects" wizard
        Then check "automation-test-name3" value in "name" column in "Projects_Table" table on "Projects" wizard
        And remove "automation-test-name3" MLRun Project with code 204

    @passive
    Scenario: Verify View YAML action
        Given open url
        And wait load page
        Then select "View YAML" option in action menu on "Projects" wizard in "Projects_Table" table at row with "default" value in "name" column
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
