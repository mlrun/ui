Feature: Jobs Monitoring Page

    Testcases that verifies functionality on MLRun Jobs Monitoring Page

    @MLJM
    @smoke
    Scenario: MLJM001 - Check components on Jobs tab of Jobs monitoring page
        Given open url
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then "Total_Counter_Number" element in "Monitoring_Jobs_Box" on "Projects" should contains "6" value
        When click on "See_All_Link" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/jobs-monitoring/jobs"
        Then verify breadcrumbs "cross" label should be equal "Jobs monitoring" value
        Then verify breadcrumbs "projectsPage" label should be equal "Projects" value
        Then verify "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Jobs_Tab" wizard should contains "Jobs_Monitoring"."Tab_List"
        Then verify "Jobs" tab is active in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify that 6 row elements are displayed in "Jobs_Table" on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Search_By_Name_Filter_Input" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Past 24 hours"
        Then verify "Date_Picker_Filter_Dropdown" dropdown element on "Jobs_Monitoring_Jobs_Tab" wizard should contains "Dropdown_Options"."Date_Picker_Filter_Options"
        Then verify "Table_FilterBy_Button" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
        Then verify "Table_Project_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Status_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Status_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Jobs_Status_Filter_Options"
        And wait load page
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then "Status_All_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then verify "Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Type_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Jobs_Type_Filter_Options"
        Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element on "FilterBy_Popup" wizard is disabled
        Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
        Then navigate back
        And wait load page
        Then verify "Counter_Running_Status_Number" element visibility in "Monitoring_Jobs_Box" on "Projects" wizard
        Then "Counter_Running_Status_Number" element in "Monitoring_Jobs_Box" on "Projects" should contains "3" value
        When click on "Counter_Running_Status_Number" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then verify "Jobs" tab is active in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Past 24 hours"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "3 items selected"
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        And wait load page
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then "Status_All_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Aborting_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Status_Jobs_Running_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Status_Pending_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify that 3 row elements are displayed in "Jobs_Table" on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        Then verify "Counter_Failed_Status_Number" element visibility in "Monitoring_Jobs_Box" on "Projects" wizard
        Then "Counter_Failed_Status_Number" element in "Monitoring_Jobs_Box" on "Projects" should contains "2" value
        When click on "Counter_Failed_Status_Number" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then verify "Jobs" tab is active in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Past 24 hours"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Aborted, Error"
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        And wait load page
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then "Status_All_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Aborting_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Jobs_Running_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Pending_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Aborted_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Status_Jobs_Error_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify that 2 row elements are displayed in "Jobs_Table" on "Jobs_Monitoring_Jobs_Tab" wizard
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        Then verify "Counter_Completed_Status_Number" element visibility in "Monitoring_Jobs_Box" on "Projects" wizard
        Then "Counter_Completed_Status_Number" element in "Monitoring_Jobs_Box" on "Projects" should contains "1" value
        When click on "Counter_Completed_Status_Number" element in "Monitoring_Jobs_Box" on "Projects" wizard
        And wait load page
        Then verify "Jobs" tab is active in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Past 24 hours"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Completed"
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        And wait load page
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then "Status_All_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Aborting_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Jobs_Running_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Pending_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Aborted_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Jobs_Error_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Jobs_Completed_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then verify "Jobs_Table" element visibility on "Jobs_Monitoring_Jobs_Tab" wizard
        Then verify that 1 row elements are displayed in "Jobs_Table" on "Jobs_Monitoring_Jobs_Tab" wizard

    @MLJM
    @smoke
    Scenario: MLJM002 - Check components on Workflows tab of Jobs monitoring page
        Given open url
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Workflows_Box" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Total_Counter_Number" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        Then "Total_Counter_Number" element in "Monitoring_Workflows_Box" on "Projects" should contains "2" value
        When click on "See_All_Link" element in "Monitoring_Workflows_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/jobs-monitoring/workflows"
        Then verify breadcrumbs "cross" label should be equal "Jobs monitoring" value
        Then verify breadcrumbs "projectsPage" label should be equal "Projects" value
        Then verify "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Workflows_Tab" wizard should contains "Jobs_Monitoring"."Tab_List"
        Then verify "Workflows" tab is active in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Workflows_Table" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify that 2 row elements are displayed in "Workflows_Table" on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Search_By_Name_Filter_Input" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Past 24 hours"
        Then verify "Date_Picker_Filter_Dropdown" dropdown element on "Jobs_Monitoring_Workflows_Tab" wizard should contains "Dropdown_Options"."Date_Picker_Filter_Options"
        Then verify "Table_FilterBy_Button" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Workflows_Tab" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
        Then verify "Table_Project_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Status_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Status_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Workflows_Status_Filter_Options"
        And wait load page
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then "Status_All_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element on "FilterBy_Popup" wizard is disabled
        Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
        Then navigate back
        And wait load page
        Then verify "Counter_Running_Status_Number" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        Then "Counter_Running_Status_Number" element in "Monitoring_Workflows_Box" on "Projects" should contains "0" value
        When click on "Counter_Running_Status_Number" element in "Monitoring_Workflows_Box" on "Projects" wizard
        And wait load page
        Then verify "Workflows" tab is active in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Past 24 hours"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Running"
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then "Status_All_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Workflows_Running_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Status_Workflows_Error_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Failed_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Workflows_Completed_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then verify that 0 row elements are displayed in "Workflows_Table" on "Jobs_Monitoring_Workflows_Tab" wizard
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        Then verify "Counter_Failed_Status_Number" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        Then "Counter_Failed_Status_Number" element in "Monitoring_Workflows_Box" on "Projects" should contains "1" value
        When click on "Counter_Failed_Status_Number" element in "Monitoring_Workflows_Box" on "Projects" wizard
        And wait load page
        Then verify "Workflows" tab is active in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Past 24 hours"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Error, Failed"
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then "Status_All_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Workflows_Error_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Status_Failed_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Status_Workflows_Running_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Workflows_Completed_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then verify "Workflows_Table" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify that 1 row elements are displayed in "Workflows_Table" on "Jobs_Monitoring_Workflows_Tab" wizard
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
        Then verify "Counter_Completed_Status_Number" element visibility in "Monitoring_Workflows_Box" on "Projects" wizard
        Then "Counter_Completed_Status_Number" element in "Monitoring_Workflows_Box" on "Projects" should contains "1" value
        When click on "Counter_Completed_Status_Number" element in "Monitoring_Workflows_Box" on "Projects" wizard
        And wait load page
        Then verify "Workflows" tab is active in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Workflows_Tab" wizard selected option value "Past 24 hours"
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Completed"
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then "Status_All_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Workflows_Error_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Failed_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Workflows_Running_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Workflows_Completed_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then verify "Workflows_Table" element visibility on "Jobs_Monitoring_Workflows_Tab" wizard
        Then verify that 1 row elements are displayed in "Workflows_Table" on "Jobs_Monitoring_Workflows_Tab" wizard

    @MLJM
    @smoke
    Scenario: MLJM003 - Check components on Scheduled tab of Jobs monitoring page
        Given open url
        And wait load page
        Then verify "Monitoring_Container" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Monitoring_Scheduled_Box" element visibility in "Projects_Monitoring_Container" on "Projects" wizard
        Then verify "Total_Job_Counter_Number" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        Then "Total_Job_Counter_Number" element in "Monitoring_Scheduled_Box" on "Projects" should contains "7" value
        Then verify "Jobs_See_All_Link" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        When click on "Jobs_See_All_Link" element in "Monitoring_Scheduled_Box" on "Projects" wizard
        And wait load page
        Then verify redirection to "projects/jobs-monitoring/scheduled"
        Then verify breadcrumbs "cross" label should be equal "Jobs monitoring" value
        Then verify breadcrumbs "projectsPage" label should be equal "Projects" value
        Then verify "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Scheduled_Tab" wizard should contains "Jobs_Monitoring"."Tab_List"
        Then verify "Scheduled" tab is active in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Scheduled_Table" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify that 7 row elements are displayed in "Scheduled_Table" on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Search_By_Name_Filter_Input" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Scheduled_Tab" wizard selected option value "Next 24 hours"
        Then verify "Date_Picker_Filter_Dropdown" dropdown element on "Jobs_Monitoring_Scheduled_Tab" wizard should contains "Dropdown_Options"."Scheduled_Date_Picker_Filter_Options"
        Then verify "Table_FilterBy_Button" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
        Then verify "Table_Project_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Jobs"
        Then verify "Type_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Scheduled_Type_Filter_Options"
        Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element on "FilterBy_Popup" wizard is enabled
        Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
        Then navigate back
        And wait load page
        Then verify "Total_Workflows_Counter_Number" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        Then "Total_Workflows_Counter_Number" element in "Monitoring_Scheduled_Box" on "Projects" should contains "1" value
        Then verify "Workflows_See_All_Link" element visibility in "Monitoring_Scheduled_Box" on "Projects" wizard
        When click on "Workflows_See_All_Link" element in "Monitoring_Scheduled_Box" on "Projects" wizard
        Then verify redirection to "projects/jobs-monitoring/scheduled"
        Then verify breadcrumbs "cross" label should be equal "Jobs monitoring" value
        Then verify breadcrumbs "projectsPage" label should be equal "Projects" value
        Then verify "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Scheduled_Tab" wizard should contains "Jobs_Monitoring"."Tab_List"
        Then verify "Scheduled" tab is active in "Cross_Jobs_Tab_Selector" on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Scheduled_Table" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify that 1 row elements are displayed in "Scheduled_Table" on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Search_By_Name_Filter_Input" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitoring_Scheduled_Tab" wizard selected option value "Next 24 hours"
        Then verify "Date_Picker_Filter_Dropdown" dropdown element on "Jobs_Monitoring_Scheduled_Tab" wizard should contains "Dropdown_Options"."Scheduled_Date_Picker_Filter_Options"
        Then verify "Table_FilterBy_Button" element visibility on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitoring_Scheduled_Tab" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
        Then verify "Table_Project_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Workflows"
        Then verify "Type_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Scheduled_Type_Filter_Options"
        Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element on "FilterBy_Popup" wizard is enabled
        Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
        Then click on breadcrumbs "projectsPage" label on "commonPagesHeader" wizard
        And wait load page
