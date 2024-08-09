Feature: Projects Page

    Testcases that verifies functionality on MLRun Projects Page

    @MLPr
    @passive
    @smoke
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

    @MLPr
    @passive
    @smoke
    Scenario: MLPr002 - Verify searching by project name
        Given open url
        And wait load page
        Then type value "stocks" to "Search_Projects_Input" field on "Projects" wizard
        Then value in "name" column with "text" in "Projects_Table" on "Projects" wizard should contains "stocks"
        Then type value "at" to "Search_Projects_Input" field on "Projects" wizard
        Then click on "Refresh_Projects_Button" element on "Projects" wizard
        And wait load page
        Then value in "name" column with "text" in "Projects_Table" on "Projects" wizard should contains "at"
        Then type value "default" to "Search_Projects_Input" field on "Projects" wizard
        Then value in "name" column with "text" in "Projects_Table" on "Projects" wizard should contains "default"
        Then type value "" to "Search_Projects_Input" field on "Projects" wizard
        Then click on "Refresh_Projects_Button" element on "Projects" wizard
        Then type value "Default" to "Search_Projects_Input" field on "Projects" wizard
        Then value in "name" column with "text" in "Projects_Table" on "Projects" wizard should contains "default"
        Then type value "" to "Search_Projects_Input" field on "Projects" wizard
        Then click on "Refresh_Projects_Button" element on "Projects" wizard
        Then type value "deFault" to "Search_Projects_Input" field on "Projects" wizard
        Then value in "name" column with "text" in "Projects_Table" on "Projects" wizard should contains "default"
        Then type value "" to "Search_Projects_Input" field on "Projects" wizard
        Then click on "Refresh_Projects_Button" element on "Projects" wizard
        Then type value "defa" to "Search_Projects_Input" field on "Projects" wizard
        Then value in "name" column with "text" in "Projects_Table" on "Projects" wizard should contains "default"        

    @MLPr
    @passive
    @smoke
    Scenario: MLPr003 - Sort projects in ascending and descending order
        Given open url
        And wait load page
        When select "By name" option in "Projects_Sort_Dropdown" filter dropdown on "Projects" wizard
        Then sort projects in ascending order
        Then sort projects in descending order
        When select "By created date" option in "Projects_Sort_Dropdown" filter dropdown on "Projects" wizard
        Then sort projects in ascending order

    @MLPr
    @passive
    @smoke
    Scenario: MLPr004 - Verify all mandatory components on Create new ML Project
        Given open url
        And wait load page
        Then check "automation-test-name" value not in "name" column in "Projects_Table" table on "Projects" wizard
        Then click on "New_Project_Button" element on "Projects" wizard
        Then verify if "Create_New_Project" popup dialog appears
        Then verify "Name_Input" element visibility on "Create_New_Project" wizard
        Then type value "/" to "Name_Input" field on "Create_New_Project" wizard
        Then verify "Name_Input" on "Create_New_Project" wizard should display options "Input_Hint"."Project_Name_Hint"
        Then verify "Name_Input" options rules on form "Create_New_Project" wizard
        Then verify "Description_Input" element visibility on "Create_New_Project" wizard
        Then verify "Cancel_Button" element visibility on "Create_New_Project" wizard
        Then "Cancel_Button" element on "Create_New_Project" should contains "Cancel" value
        Then verify "Create_Button" element visibility on "Create_New_Project" wizard
        Then "Create_Button" element on "Create_New_Project" should contains "Create" value
        Then type into "Name_Input" on "Create_New_Project" popup dialog "default" value
        Then click on "Create_Button" element on "Create_New_Project" wizard
        Then "Error_Message" component on "Create_New_Project" should be equal "Error_Messages"."Project_Already_Exists"

    @MLPr
    @passive
    @smoke
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

    @MLPr
    @passive
    @smoke
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

    @MLPr
    @sanity
    @smoke
    Scenario: MLPr007 - Create new ML Project with description
        Given open url
        And wait load page
        Then check "automation-test-name" value not in "name" column in "Projects_Table" table on "Projects" wizard
        Then click on "New_Project_Button" element on "Projects" wizard
        Then verify if "Create_New_Project" popup dialog appears
        Then type into "Name_Input" on "Create_New_Project" popup dialog "automation-test-name" value
        Then type into "Description_Input" on "Create_New_Project" popup dialog "automation test description" value
        Then verify "New_Project_Labels_Table" element visibility on "Create_New_Project" wizard
        And click on "Add_Label_Button" element on "Create_New_Project" wizard
        Then type value "/" to "Labels_Key" field on "Create_New_Project" wizard
        Then verify labels warning should display options "Input_Hint"."Projects_Labels_Warning_Key"
        Then verify "Labels_Key" options rules on "Create_New_Project" wizard with labels
        Then type value "/" to "Labels_Value" field on "Create_New_Project" wizard
        Then verify labels warning should display options "Input_Hint"."Projects_Labels_Warning_Value"
        Then verify "Labels_Value" options rules on "Create_New_Project" wizard with labels
        Then type value "/" to "Labels_Key" field on "Create_New_Project" wizard
        Then type value "/" to "Labels_Value" field on "Create_New_Project" wizard
        When click on "Title" element on "Create_New_Project" wizard
        And click on "Close_Label_Button" element on "Create_New_Project" wizard
        Then click on "Create_Button" element on "Create_New_Project" wizard
        And set tear-down property "project" created with "automation-test-name" value
        Then check "automation-test-name" value in "name" column in "Projects_Table" table on "Projects" wizard
    
    @MLPr
    @passive
    @smoke
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
    
    @MLPr
    @passive
    @smoke
    Scenario: MLPr009 - Delete existing ML Project
        * set tear-down property "project" created with "automation-test-name2" value
        * create "automation-test-name2" MLRun Project with code 201
        Given open url
        And wait load page
        Then check "automation-test-name2" value in "name" column in "Projects_Table" table on "Projects" wizard
        Then select "Delete" option in action menu on "Projects" wizard in "Projects_Table" table at row with "automation-test-name2" value in "name" column
        Then verify if "Common_Popup" popup dialog appears
        Then click on "Delete_Button" element on "Common_Popup" wizard
        And wait load page
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Project deletion in progress" value
        And wait load page
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
        And wait load page
        Then verify if "Notification_Popup" popup dialog appears
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Project \"automation-test-name2\" was deleted successfully" value
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
        Then check "automation-test-name2" value not in "name" column in "Projects_Table" table on "Projects" wizard
        Then verify "New_Project_Button" element visibility on "Projects" wizard
        Then "New_Project_Button" element on "Projects" should contains "New Project" value
    
    @MLPr
    @passive
    @smoke
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
        And click on row root with value "automation-test-name7" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
        And click on "MLRun_Logo" element on "commonPagesHeader" wizard
        And wait load page
        Then click on "Archive_Projects_Button" element on "Projects" wizard
        Then check "automation-test-name7" value in "name" column in "Projects_Table" table on "Projects" wizard
        Then select "Unarchive" option in action menu on "Projects" wizard in "Projects_Table" table at row with "automation-test-name7" value in "name" column
        Then click on "Active_Projects_Button" element on "Projects" wizard
        Then check "automation-test-name7" value in "name" column in "Projects_Table" table on "Projects" wizard
    
    @MLPr
    @passive
    @smoke
    Scenario: MLPr011 - Verify View YAML action
        Given open url
        And wait load page
        Then select "View YAML" option in action menu on "Projects" wizard in "Projects_Table" table at row with "default" value in "name" column
        Then verify if "View_YAML" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
        Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
        Then click on "Cross_Cancel_Button" element on "View_YAML" wizard
        Then select "Export YAML" option in action menu on "Projects" wizard in "Projects_Table" table at row with "default" value in "name" column
        And wait load page
        Then check that "default.yaml" file is existed on "Downloads" directory
    
    @MLPr    
    @danger
    @smoke
#   Run this test case only with mocked backend!!!
    Scenario: MLPr012 - Check projects limit message
        Then create up to limit projects with code 201
        Given open url
        And wait load page
        Then click on "New_Project_Button" element on "Projects" wizard
        Then type into "Name_Input" on "Create_New_Project" popup dialog "automation-test-name201" value
        Then click on "Create_Button" element on "Create_New_Project" wizard
        Then "Error_Message" component on "Create_New_Project" should contains "Error_Messages"."Projects_Limit_Reached"

    @MLPr
    @passive
    @smoke
    @FAILED_TODO
    #TODO: change mock api getIguazioProjects for owner
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
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Quick actions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify value should equal "navigation-test" in "Header_Name_Label" on "Demo_Project" wizard
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on "Pin_Quick_Link_Button" element on "commonPagesHeader" wizard
        And click on cell with value "Project monitoring" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
        And click on cell with value "Feature store" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Feature store" value
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
        Then verify breadcrumbs "tab" label should be equal "Jobs and workflows" value
        And click on cell with value "ML functions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "ML functions" value
        Then click on "Project_Settings_Button" element on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Settings" value

    @MLPr
    @smoke
    Scenario: MLPr015 - Check components on Monitoring container on Projects page
        Given open url
        And wait load page
        And turn on demo mode
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Container_Title" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then "Monitoring_Container_Title" element in "Projects_Monitoring_Container" on "Projects" should contains "Monitoring" value
        Then verify "Monitoring_Container_Running_Status" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Container_Running_Icon" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then "Monitoring_Container_Running_Status" element in "Projects_Monitoring_Container" on "Projects" should contains "In Process" value
        Then verify "Monitoring_Container_Failed_Status" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Container_Failed_Icon" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then "Monitoring_Container_Failed_Status" element in "Projects_Monitoring_Container" on "Projects" should contains "Failed" value
        Then verify "Monitoring_Container_Completed_Status" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Container_Completed_Icon" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then "Monitoring_Container_Completed_Status" element in "Projects_Monitoring_Container" on "Projects" should contains "Succeeded" value
        Then verify "Monitoring_Jobs_Box" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Workflows_Box" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Scheduled_Box" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
        Then verify breadcrumbs "project" label should be equal "default" value
        Then navigate back
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Jobs_Box" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Workflows_Box" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Scheduled_Box" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
        Then verify breadcrumbs "project" label should be equal "default" value
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Jobs_Box" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Workflows_Box" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Scheduled_Box" element visibility in "Projects_Monitoring_Container" on "Projects" wizard

    @MLPr
    @smoke
    Scenario: MLPr016 - Check components on Jobs counter box
        Given open url
        And wait load page
        And turn on demo mode
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Container_Title" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then "Monitoring_Container_Title" element in "Projects_Monitoring_Container" on "Projects" should contains "Monitoring" value
        Then verify "Monitoring_Jobs_Box" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Jobs_Box_Title" element visibility in "Monitoring_Jobs_Box" on "Projects" wizard
        Then "Monitoring_Jobs_Box_Title" element in "Monitoring_Jobs_Box" on "Projects" should contains "Jobs" value
        Then verify "Filtering_Time_Period" element visibility in "Monitoring_Jobs_Box" on "Projects" wizard
        Then "Filtering_Time_Period" element in "Monitoring_Jobs_Box" on "Projects" should contains "Past 24 hours" value
        Then verify "Total_Counter_Title" element visibility in "Monitoring_Jobs_Box" on "Projects" wizard
        Then "Total_Counter_Title" element in "Monitoring_Jobs_Box" on "Projects" should contains "Jobs" value
        Then verify "Total_Counter_Number" element visibility in "Monitoring_Jobs_Box" on "Projects" wizard
        Then "Total_Counter_Number" element in "Monitoring_Jobs_Box" on "Projects" should contains "6" value
        Then verify "Counter_Running_Status_Number" element visibility in "Monitoring_Jobs_Box" on "Projects" wizard
        Then verify "Counter_Running_Status_Icon" element visibility in "Monitoring_Jobs_Box" on "Projects" wizard
        Then "Counter_Running_Status_Number" element in "Monitoring_Jobs_Box" on "Projects" should contains "3" value
        Then verify "Counter_Failed_Status_Number" element visibility in "Monitoring_Jobs_Box" on "Projects" wizard
        Then verify "Counter_Failed_Status_Icon" element visibility in "Monitoring_Jobs_Box" on "Projects" wizard
        Then "Counter_Failed_Status_Number" element in "Monitoring_Jobs_Box" on "Projects" should contains "2" value
        Then verify "Counter_Completed_Status_Number" element visibility in "Monitoring_Jobs_Box" on "Projects" wizard
        Then verify "Counter_Completed_Status_Icon" element visibility in "Monitoring_Jobs_Box" on "Projects" wizard
        Then "Counter_Completed_Status_Number" element in "Monitoring_Jobs_Box" on "Projects" should contains "1" value
        Then verify "See_All_Link" element visibility in "Monitoring_Jobs_Box" on "Projects" wizard
        Then "See_All_Link" element in "Monitoring_Jobs_Box" on "Projects" should contains "See all" value
        When click on "Counter_Running_Status_Number" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/jobs-monitoring/jobs"
        Then navigate back
        And wait load page
        When click on "Counter_Failed_Status_Number" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/jobs-monitoring/jobs"
        Then navigate back
        And wait load page
        When click on "Counter_Completed_Status_Number" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/jobs-monitoring/jobs"
        Then navigate back
        And wait load page
        When click on "See_All_Link" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/jobs-monitoring/jobs"
        Then navigate back
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard

    @MLPr
    @smoke
    Scenario: MLPr017 - Check components on Workflows counter box
        Given open url
        And wait load page
        And turn on demo mode
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Container_Title" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then "Monitoring_Container_Title" element in "Projects_Monitoring_Container" on "Projects" should contains "Monitoring" value
        Then verify "Monitoring_Workflows_Box" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Workflows_Box_Title" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        Then "Monitoring_Workflows_Box_Title" element in "Monitoring_Workflows_Box" on "Projects" should contains "Workflows" value
        Then verify "Filtering_Time_Period" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        Then "Filtering_Time_Period" element in "Monitoring_Workflows_Box" on "Projects" should contains "Past 24 hours" value
        Then verify "Total_Counter_Title" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        Then "Total_Counter_Title" element in "Monitoring_Workflows_Box" on "Projects" should contains "Workflows" value
        Then verify "Total_Counter_Number" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        Then "Total_Counter_Number" element in "Monitoring_Workflows_Box" on "Projects" should contains "2" value
        Then verify "Counter_Running_Status_Number" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        Then verify "Counter_Running_Status_Icon" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        Then "Counter_Running_Status_Number" element in "Monitoring_Workflows_Box" on "Projects" should contains "0" value
        Then verify "Counter_Failed_Status_Number" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        Then verify "Counter_Failed_Status_Icon" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        Then "Counter_Failed_Status_Number" element in "Monitoring_Workflows_Box" on "Projects" should contains "1" value
        Then verify "Counter_Completed_Status_Number" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        Then verify "Counter_Completed_Status_Icon" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        Then "Counter_Completed_Status_Number" element in "Monitoring_Workflows_Box" on "Projects" should contains "1" value
        Then verify "See_All_Link" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        Then "See_All_Link" element in "Monitoring_Workflows_Box" on "Projects" should contains "See all" value
        When click on "Counter_Running_Status_Number" element in "Monitoring_Workflows_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/jobs-monitoring/workflows"
        Then navigate back
        And wait load page
        When click on "Counter_Failed_Status_Number" element in "Monitoring_Workflows_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/jobs-monitoring/workflows"
        Then navigate back
        And wait load page
        When click on "Counter_Completed_Status_Number" element in "Monitoring_Workflows_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/jobs-monitoring/workflows"
        Then navigate back
        And wait load page
        When click on "See_All_Link" element in "Monitoring_Workflows_Box" on "Projects" wizard
        Then verify redirection to "projects/jobs-monitoring/workflows"
        Then navigate back
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard

    @MLPr
    @smoke
    Scenario: MLPr018 - Check components on Sheduled counter box
        Given open url
        And wait load page
        And turn on demo mode
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Container_Title" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then "Monitoring_Container_Title" element in "Projects_Monitoring_Container" on "Projects" should contains "Monitoring" value
        Then verify "Monitoring_Scheduled_Box" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Scheduled_Box_Title" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        Then "Monitoring_Scheduled_Box_Title" element in "Monitoring_Scheduled_Box" on "Projects" should contains "Scheduled" value
        Then verify "Filtering_Time_Period" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        Then "Filtering_Time_Period" element in "Monitoring_Scheduled_Box" on "Projects" should contains "Next 24 hours" value
        Then verify "Total_Job_Counter_Title" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        Then "Total_Job_Counter_Title" element in "Monitoring_Scheduled_Box" on "Projects" should contains "Jobs" value
        Then verify "Total_Workflows_Counter_Title" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        Then "Total_Workflows_Counter_Title" element in "Monitoring_Scheduled_Box" on "Projects" should contains "Workflows" value
        Then verify "Total_Job_Counter_Number" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        Then "Total_Job_Counter_Number" element in "Monitoring_Scheduled_Box" on "Projects" should contains "7" value
        Then verify "Total_Workflows_Counter_Number" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        Then "Total_Workflows_Counter_Number" element in "Monitoring_Scheduled_Box" on "Projects" should contains "1" value
        Then verify "Jobs_See_All_Link" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        Then "Jobs_See_All_Link" element in "Monitoring_Scheduled_Box" on "Projects" should contains "See all" value
        Then verify "Workflows_See_All_Link" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        Then "Workflows_See_All_Link" element in "Monitoring_Scheduled_Box" on "Projects" should contains "See all" value
        When click on "Jobs_See_All_Link" element in "Monitoring_Scheduled_Box" on "Projects" wizard
        Then verify redirection to "projects/jobs-monitoring/scheduled"
        Then navigate back
        And wait load page
        When click on "Workflows_See_All_Link" element in "Monitoring_Scheduled_Box" on "Projects" wizard
        Then verify redirection to "projects/jobs-monitoring/scheduled"
        Then navigate back
        And wait load page
