Feature: MLRun Projects Page

    Testcases that verifies functionality on MLRun Projects Page

    @sanity
    Scenario: Create new ML Project with description
        Given open url
        Then check "automation-test-name" value not in "name" column in "Projects_Table" table on "Projects" wizard
        Then click on "New_Project_Button" element on "Projects" wizard
        Then verify if "Create_New_Project" popup dialog appears
        Then type into "Name_Input" on "Create_New_Project" popup dialog "automation-test-name" value
        Then type into "Description_Input" on "Create_New_Project" popup dialog "automation test description" value
        Then click on "Create_Button" element on "Create_New_Project" wizard
        Then check "automation-test-name" value in "name" column in "Projects_Table" table on "Projects" wizard
        Then remove "automation-test-name" MLRun Project with code 204

    Scenario: Archive ML Project
        * create "automation-test-name1" MLRun Project with code 200
        Given open url
        Then check "automation-test-name1" value in "name" column in "Projects_Table" table on "Projects" wizard
        Then select "Archive" option in action menu on "Projects" wizard in "Projects_Table" table at row with "automation-test-name1" value in "name" column
        Then verify if "Archive_Project" popup dialog appears
        Then click on "Archive_Button" element on "Archive_Project" wizard
        Then check "automation-test-name1" value not in "name" column in "Projects_Table" table on "Projects" wizard
        Then select "Archived Projects" option in "Projects_Dropdown" dropdown on "Projects" wizard
        Then check "automation-test-name1" value in "name" column in "Projects_Table" table on "Projects" wizard
        Then remove "automation-test-name1" MLRun Project with code 204

    Scenario: Delete existing ML Project
        * create "automation-test-name2" MLRun Project with code 200
        Given open url
        Then check "automation-test-name2" value in "name" column in "Projects_Table" table on "Projects" wizard
        Then select "Delete" option in action menu on "Projects" wizard in "Projects_Table" table at row with "automation-test-name2" value in "name" column
        Then verify if "Delete_Project" popup dialog appears
        Then click on "Delete_Button" element on "Delete_Project" wizard
        Then check "automation-test-name2" value not in "name" column in "Projects_Table" table on "Projects" wizard
        Then remove "automation-test-name2" MLRun Project with code 500