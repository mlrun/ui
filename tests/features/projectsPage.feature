Feature: MLRun Projects Page

    Testcases that verifies functionality on MLRun Projects Page

    @passive
    @FAILED_TODO
    #TODO: last two steps are unstable on small screen extensions because scroll change the screen coordinates, it needs another solution
    Scenario: MLPr001 - Check all mandatory components
        Given open url
        And wait load page
        Then verify redirection from "INVALID" to "projects"
        Then verify "New_Project_Button" element visibility on "Projects" wizard
        Then "New_Project_Button" element on "Projects" should contains "New Project" value
        Then verify "See_On_Github" element visibility on "commonPagesHeader" wizard
        Then verify "See_On_Slack" element visibility on "commonPagesHeader" wizard
        Then verify "Active_Projects_Button" element visibility on "Projects" wizard
        Then verify "Archive_Projects_Button" element visibility on "Projects" wizard
        Then verify "Projects_Sort_Dropdown" element visibility on "Projects" wizard
        Then verify "Projects_Sorter" element visibility on "Projects" wizard
        Then verify "Projects_Table" element visibility on "Projects" wizard
        Then value in "running" column with "tooltip" in "Projects_Table" on "Projects" wizard should contains "ML jobs and Nuclio functions"
        Then value in "failed" column with "tooltip" in "Projects_Table" on "Projects" wizard should contains "Failed ML jobs and nuclio functions in the last 24 hours"

    @passive
    Scenario: MLPr002 - Verify filtering by project name
        Given open url
        And wait load page
        Then type value "stocks" to "Search_Projects_Input" field on "Projects" wizard
        Then value in "name" column with "text" in "Projects_Table" on "Projects" wizard should contains "stocks"
        Then type value "at" to "Search_Projects_Input" field on "Projects" wizard
        Then click on "Refresh_Projects_Button" element on "Projects" wizard
        And wait load page
        Then value in "name" column with "text" in "Projects_Table" on "Projects" wizard should contains "at"

    @passive
    Scenario: MLPr003 - Sort projects in ascending and descending order
        Given open url
        And wait load page
        When select "By name" option in "Projects_Sort_Dropdown" filter dropdown on "Projects" wizard
        Then sort projects in ascending order
        Then sort projects in descending order
        When select "By created date" option in "Projects_Sort_Dropdown" filter dropdown on "Projects" wizard
        Then sort projects in ascending order

    @passive
    Scenario: MLPr004 - Verify all mandatory components on Create new ML Project
        Given open url
        And wait load page
        Then check "automation-test-name" value not in "name" column in "Projects_Table" table on "Projects" wizard
        Then click on "New_Project_Button" element on "Projects" wizard
        Then verify if "Create_New_Project" popup dialog appears
        Then verify "Name_Input" element visibility on "Create_New_Project" wizard
        Then type value "   " to "Name_Input" field on "Create_New_Project" wizard
        Then verify "Name_Input" on "Create_New_Project" wizard should display options "Input_Hint"."Project_Name_Hint"
        Then verify "Name_Input" options rules on "Create_New_Project" wizard
        Then verify "Description_Input" element visibility on "Create_New_Project" wizard
        Then verify "Cancel_Button" element visibility on "Create_New_Project" wizard
        Then "Cancel_Button" element on "Create_New_Project" should contains "Cancel" value
        Then verify "Create_Button" element visibility on "Create_New_Project" wizard
        Then "Create_Button" element on "Create_New_Project" should contains "Create" value
        Then type into "Name_Input" on "Create_New_Project" popup dialog "default" value
        Then click on "Create_Button" element on "Create_New_Project" wizard
        Then "Error_Message" component on "Create_New_Project" should be equal "Error_Messages"."Project_Already_Exists"

    @passive
    Scenario: MLPr005 - Verify all mandatory components on Archive ML Project
        Given open url
        And wait load page
        Then select "Archive" option in action menu on "Projects" wizard in "Projects_Table" table at row with "churn-project-admin" value in "name" column
        Then verify if "Common_Popup" popup dialog appears
        Then "Description" component on "Common_Popup" should contains "Descriptions"."Archive_Project"
        Then verify "Cancel_Button" element visibility on "Common_Popup" wizard
        Then "Cancel_Button" element on "Common_Popup" should contains "Cancel" value
        Then verify "Confirm_Button" element visibility on "Common_Popup" wizard
        Then "Confirm_Button" element on "Common_Popup" should contains "Archive" value

    @passive
    Scenario: MLPr006 - Verify all mandatory components on Delete existing ML Project
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
    Scenario: MLPr007 - Create new ML Project with description
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
    
    @passive
    Scenario: MLPr008 - Archive ML Project
        * set tear-down property "project" created with "automation-test-name1" value
        * create "automation-test-name1" MLRun Project with code 201
        Given open url
        And wait load page
        Then check "automation-test-name1" value in "name" column in "Projects_Table" table on "Projects" wizard
        Then select "Archive" option in action menu on "Projects" wizard in "Projects_Table" table at row with "automation-test-name1" value in "name" column
        Then verify if "Common_Popup" popup dialog appears
        Then click on "Confirm_Button" element on "Common_Popup" wizard
        Then check "automation-test-name1" value not in "name" column in "Projects_Table" table on "Projects" wizard
        Then click on "Archive_Projects_Button" element on "Projects" wizard
        Then check "automation-test-name1" value in "name" column in "Projects_Table" table on "Projects" wizard
    
    @passive
    Scenario: MLPr009 - Delete existing ML Project
        * set tear-down property "project" created with "automation-test-name2" value
        * create "automation-test-name2" MLRun Project with code 201
        Given open url
        And wait load page
        Then check "automation-test-name2" value in "name" column in "Projects_Table" table on "Projects" wizard
        Then select "Delete" option in action menu on "Projects" wizard in "Projects_Table" table at row with "automation-test-name2" value in "name" column
        Then verify if "Common_Popup" popup dialog appears
        Then click on "Delete_Button" element on "Common_Popup" wizard
        Then check "automation-test-name2" value not in "name" column in "Projects_Table" table on "Projects" wizard
    
    @passive
    Scenario: MLPr010 - Unarchive ML Project
        * set tear-down property "project" created with "automation-test-name7" value
        * create "automation-test-name7" MLRun Project with code 201
        Given open url
        And wait load page
        Then check "automation-test-name7" value in "name" column in "Projects_Table" table on "Projects" wizard
        Then select "Archive" option in action menu on "Projects" wizard in "Projects_Table" table at row with "automation-test-name7" value in "name" column
        Then verify if "Common_Popup" popup dialog appears
        Then click on "Confirm_Button" element on "Common_Popup" wizard
        Then check "automation-test-name7" value not in "name" column in "Projects_Table" table on "Projects" wizard
        Then click on "Archive_Projects_Button" element on "Projects" wizard
        Then check "automation-test-name7" value in "name" column in "Projects_Table" table on "Projects" wizard
        Then select "Unarchive" option in action menu on "Projects" wizard in "Projects_Table" table at row with "automation-test-name7" value in "name" column
        Then click on "Active_Projects_Button" element on "Projects" wizard
        Then check "automation-test-name7" value in "name" column in "Projects_Table" table on "Projects" wizard

    @passive
    Scenario: MLPr011 - Verify View YAML action
        Given open url
        And wait load page
        Then select "View YAML" option in action menu on "Projects" wizard in "Projects_Table" table at row with "default" value in "name" column
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

    @danger
#   Run this test case only with mocked backend!!!
    Scenario: MLPr012 - Check projects limit message
        Then create up to limit projects with code 201
        Given open url
        And wait load page
        Then click on "New_Project_Button" element on "Projects" wizard
        Then type into "Name_Input" on "Create_New_Project" popup dialog "automation-test-name201" value
        Then click on "Create_Button" element on "Create_New_Project" wizard
        Then "Error_Message" component on "Create_New_Project" should contains "Error_Messages"."Projects_Limit_Reached"

    @passive
    Scenario: MLPr013 - Create new ML Project and check navigation through project navigation menu
        Given open url
        And wait load page
        Then check "navigation-test" value not in "name" column in "Projects_Table" table on "Projects" wizard
        Then click on "New_Project_Button" element on "Projects" wizard
        Then verify if "Create_New_Project" popup dialog appears
        Then type into "Name_Input" on "Create_New_Project" popup dialog "navigation-test" value
        Then click on "Create_Button" element on "Create_New_Project" wizard
        And click on row root with value "navigation-test" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify value should equal "navigation-test" in "Header_Name_Label" on "Demo_Project" wizard
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on "Pin_Quick_Link_Button" element on "commonPagesHeader" wizard
        And click on cell with value "Project monitoring" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Project Monitoring" value
        And click on cell with value "Feature store" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Feature Store" value
        And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Datasets" value
        And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Artifacts" value
        And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Models" value
        And click on cell with value "Jobs and workflows" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Jobs" value
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "ML functions" value
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "ML functions" value
        Then click on "Project_Settings_Button" element on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Settings" value