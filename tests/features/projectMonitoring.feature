Feature: Project Monitoring Page

    Testcases that verifies functionality on MLRun Project Page

    @MLPM
    @passive
    @smoke
    Scenario: MLPM002 - Check components on the header details and the project monitoring container
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify breadcrumbs "project" label should be equal "default" value
        Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
        Then verify "Project_Name" element visibility on "Project" wizard
        Then "Project_Name" element on "Project" should contains "default" value
        Then verify "Created_Details" element visibility on "Project" wizard
        Then "Created_Details" element on "Project" should contains "Created: 08/29/2021, 15:21:14 PM" value
        Then verify "Owner_Details" element visibility on "Project" wizard
        Then "Owner_Details" element on "Project" should contains "Owner: igz_nobody" value
        Then verify "Info_Baner_Icon" element visibility on "Project" wizard
        Then verify "Info_Baner_Icon" element on "Project" wizard should display hover hint "Label_Hint"."Project_Monitoring_Counters"
        Then verify "Quick_Actions" element visibility on "Project" wizard
        Then verify "Quick_Actions" dropdown element on "Project" wizard should contains "Project"."Quick_Actions_Options"
        Then verify "Refresh_Button" element visibility on "Project" wizard
        Then verify "Refresh_Button" element on "Project" wizard should display hover tooltip "Common_Tooltips"."Refresh_Button"
        Then verify "Mono_Values_Cards" element visibility on "Project" wizard
        Then verify "Artifacts_Stats_Title" element visibility in "Artifacts_Stats_Container" on "Project" wizard
        Then "Artifacts_Stats_Title" element in "Artifacts_Stats_Container" on "Project" should contains "Artifacts" value
        Then verify "Artifacts_Stats_Counter" element visibility in "Artifacts_Stats_Container" on "Project" wizard
        Then verify "Datasets_Counter_Subtitle" element visibility in "Artifacts_Stats_Container" on "Project" wizard
        Then "Datasets_Counter_Subtitle" element in "Artifacts_Stats_Container" on "Project" should contains "Datasets" value
        Then verify "Datasets_Counter_Number" element visibility in "Artifacts_Stats_Container" on "Project" wizard
        Then verify "Documents_Counter_Subtitle" element visibility in "Artifacts_Stats_Container" on "Project" wizard
        Then "Documents_Counter_Subtitle" element in "Artifacts_Stats_Container" on "Project" should contains "Documents" value
        Then verify "Documents_Counter_Number" element visibility in "Artifacts_Stats_Container" on "Project" wizard
        Then verify "LLM_Prompts_Counter_Subtitle" element visibility in "Artifacts_Stats_Container" on "Project" wizard
        Then "LLM_Prompts_Counter_Subtitle" element in "Artifacts_Stats_Container" on "Project" should contains "LLM prompt artifacts" value
        Then verify "LLM_Prompts_Counter_Number" element visibility in "Artifacts_Stats_Container" on "Project" wizard
        Then verify "Other_Artifacts_Counter_Subtitle" element visibility in "Artifacts_Stats_Container" on "Project" wizard
        Then "Other_Artifacts_Counter_Subtitle" element in "Artifacts_Stats_Container" on "Project" should contains "Other artifacts" value
        Then verify "Other_Artifacts_Counter_Number" element visibility in "Artifacts_Stats_Container" on "Project" wizard
        Then verify "Workflows_Stats_Title" element visibility in "Workflows_Stats_Container" on "Project" wizard
        Then "Workflows_Stats_Title" element in "Workflows_Stats_Container" on "Project" should contains "Workflows" value
        Then verify "Filtering_Time_Period" element visibility in "Workflows_Stats_Container" on "Project" wizard
        Then "Filtering_Time_Period" element in "Workflows_Stats_Container" on "Project" should contains "Last 24 hrs" value
        Then verify "Workflows_Stats_Counter" element visibility in "Workflows_Stats_Container" on "Project" wizard
        Then verify "In_Process_Counter_Subtitle" element visibility in "Workflows_Stats_Container" on "Project" wizard
        Then "In_Process_Counter_Subtitle" element in "Workflows_Stats_Container" on "Project" should contains "In process" value
        Then verify "In_Process_Counter_Status_Icon" element visibility in "Workflows_Stats_Container" on "Project" wizard
        Then verify "In_Process_Counter_Status_Icon" element in "Workflows_Stats_Container" on "Project" wizard should display hover tooltip "Common_Tooltips"."Running_Tip"
        Then verify "In_Process_Counter_Number" element visibility in "Workflows_Stats_Container" on "Project" wizard
        Then verify "Failed_Counter_Subtitle" element visibility in "Workflows_Stats_Container" on "Project" wizard
        Then "Failed_Counter_Subtitle" element in "Workflows_Stats_Container" on "Project" should contains "Failed" value
        Then verify "Failed_Counter_Status_Icon" element visibility in "Workflows_Stats_Container" on "Project" wizard
        Then verify "Failed_Counter_Status_Icon" element in "Workflows_Stats_Container" on "Project" wizard should display hover tooltip "Common_Tooltips"."Failed_Worflows"
        Then verify "Failed_Counter_Number" element visibility in "Workflows_Stats_Container" on "Project" wizard
        Then verify "Succeeded_Counter_Subtitle" element visibility in "Workflows_Stats_Container" on "Project" wizard
        Then "Succeeded_Counter_Subtitle" element in "Workflows_Stats_Container" on "Project" should contains "Succeeded" value
        Then verify "Succeeded_Counter_Status_Icon" element visibility in "Workflows_Stats_Container" on "Project" wizard
        Then verify "In_Process_Counter_Status_Icon" element in "Workflows_Stats_Container" on "Project" wizard should display hover tooltip "Common_Tooltips"."Running_Tip"
        Then verify "Succeeded_Counter_Status_Icon" element in "Workflows_Stats_Container" on "Project" wizard should display hover tooltip "Common_Tooltips"."Succeeded"
        Then verify "Succeeded_Counter_Number" element visibility in "Workflows_Stats_Container" on "Project" wizard
        Then verify "Scheduled_Stats_Title" element visibility in "Scheduled_Stats_Container" on "Project" wizard
        Then "Scheduled_Stats_Title" element in "Scheduled_Stats_Container" on "Project" should contains "Scheduled" value
        Then verify "Filtering_Time_Period" element visibility in "Scheduled_Stats_Container" on "Project" wizard
        Then "Filtering_Time_Period" element in "Scheduled_Stats_Container" on "Project" should contains "Next 24 hrs" value
        Then verify "Scheduled_Stats_Counter" element visibility in "Scheduled_Stats_Container" on "Project" wizard
        Then verify "Jobs_Counter_Subtitle" element visibility in "Scheduled_Stats_Container" on "Project" wizard
        Then "Jobs_Counter_Subtitle" element in "Scheduled_Stats_Container" on "Project" should contains "Jobs" value
        Then verify "Jobs_Counter_Number" element visibility in "Scheduled_Stats_Container" on "Project" wizard
        Then verify "Workflows_Counter_Subtitle" element visibility in "Scheduled_Stats_Container" on "Project" wizard
        Then "Workflows_Counter_Subtitle" element in "Scheduled_Stats_Container" on "Project" should contains "Workflows" value
        Then verify "Workflows_Counter_Number" element visibility in "Scheduled_Stats_Container" on "Project" wizard
        Then verify "Models_Stats_Title" element visibility in "Models_Stats_Container" on "Project" wizard
        Then "Models_Stats_Title" element in "Models_Stats_Container" on "Project" should contains "Models" value
        Then verify "Model_Stats_Counter" element visibility in "Models_Stats_Container" on "Project" wizard
        Then verify "Monitoring_App_Stats_Title" element visibility in "Monitoring_App_Stats_Container" on "Project" wizard
        Then "Monitoring_App_Stats_Title" element in "Monitoring_App_Stats_Container" on "Project" should contains "Monitoring apps" value
        Then verify "Monitoring_App_Running_Stats_Counter" element visibility in "Monitoring_App_Stats_Container" on "Project" wizard
        Then verify "Monitoring_App_Running_Counter_Subtitle" element visibility in "Monitoring_App_Stats_Container" on "Project" wizard
        Then "Monitoring_App_Running_Counter_Subtitle" element in "Monitoring_App_Stats_Container" on "Project" should contains "Running" value
        Then verify "Monitoring_App_Running_Counter_Status_Icon" element visibility in "Monitoring_App_Stats_Container" on "Project" wizard
        Then verify "Monitoring_App_Running_Counter_Status_Icon" element in "Monitoring_App_Stats_Container" on "Project" wizard should display hover tooltip "Common_Tooltips"."Running"
        Then verify "Monitoring_App_Failed_Stats_Counter" element visibility in "Monitoring_App_Stats_Container" on "Project" wizard
        Then verify "Monitoring_App_Failed_Counter_Subtitle" element visibility in "Monitoring_App_Stats_Container" on "Project" wizard
        Then "Monitoring_App_Failed_Counter_Subtitle" element in "Monitoring_App_Stats_Container" on "Project" should contains "Failed" value
        Then verify "Monitoring_App_Failed_Counter_Status_Icon" element visibility in "Monitoring_App_Stats_Container" on "Project" wizard
        Then verify "Monitoring_App_Failed_Counter_Status_Icon" element in "Monitoring_App_Stats_Container" on "Project" wizard should display hover tooltip "Common_Tooltips"."Failed_Tip"
        Then verify "Alerts_Stats_Title" element visibility in "Alerts_Stats_Container" on "Project" wizard
        Then "Alerts_Stats_Title" element in "Alerts_Stats_Container" on "Project" should contains "Alerts" value
        Then verify "Alerts_Stats_Title_Icon" element visibility in "Alerts_Stats_Container" on "Project" wizard
        Then verify "Filtering_Time_Period" element visibility in "Alerts_Stats_Container" on "Project" wizard
        Then "Filtering_Time_Period" element in "Alerts_Stats_Container" on "Project" should contains "Last 24 hrs" value
        Then verify "Alerts_Stats_Counter" element visibility in "Alerts_Stats_Container" on "Project" wizard
        Then verify "Alerts_Stats_Endpoint_Subtitle" element visibility in "Alerts_Stats_Container" on "Project" wizard
        Then "Alerts_Stats_Endpoint_Subtitle" element in "Alerts_Stats_Container" on "Project" should contains "Endpoint" value
        Then verify "Alerts_Stats_Endpoint_Counter" element visibility in "Alerts_Stats_Container" on "Project" wizard
        Then verify "Alerts_Stats_Jobs_Subtitle" element visibility in "Alerts_Stats_Container" on "Project" wizard
        Then "Alerts_Stats_Jobs_Subtitle" element in "Alerts_Stats_Container" on "Project" should contains "Jobs" value
        Then verify "Alerts_Stats_Jobs_Counter" element visibility in "Alerts_Stats_Container" on "Project" wizard
        Then verify "Alerts_Stats_Application_Subtitle" element visibility in "Alerts_Stats_Container" on "Project" wizard
        Then "Alerts_Stats_Application_Subtitle" element in "Alerts_Stats_Container" on "Project" should contains "Application" value
        Then verify "Alerts_Stats_Application_Counter" element visibility in "Alerts_Stats_Container" on "Project" wizard

    @MLPM
    @passive
    @smoke
    Scenario: MLPM023 - Check components on on the header details and the statistics section
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify breadcrumbs "project" label should be equal "default" value
        Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
        Then verify "Project_Name" element visibility on "Project" wizard
        Then "Project_Name" element on "Project" should contains "default" value
        Then verify "Created_Details" element visibility on "Project" wizard
        Then "Created_Details" element on "Project" should contains "Created: 08/29/2021, 15:21:14 PM" value
        Then verify "Owner_Details" element visibility on "Project" wizard
        Then "Owner_Details" element on "Project" should contains "Owner: igz_nobody" value
        Then verify "Info_Baner_Icon" element visibility on "Project" wizard
        Then verify "Info_Baner_Icon" element on "Project" wizard should display hover hint "Label_Hint"."Project_Monitoring_Counters"
        Then verify "Quick_Actions" element visibility on "Project" wizard
        Then verify "Quick_Actions" dropdown element on "Project" wizard should contains "Project"."Quick_Actions_Options"
        Then verify "Refresh_Button" element visibility on "Project" wizard
        Then verify "Refresh_Button" element on "Project" wizard should display hover tooltip "Common_Tooltips"."Refresh_Button"
        Then verify "Runs_Statistic_Table" element visibility on "Project" wizard
        Then verify visibility of header column "title" in "Runs_Statistic_Table" table on "Project" wizard
        Then check "Runs" header value in "title" column in "Runs_Statistic_Table" table on "Project" wizard
        Then verify "Runs_Statistic_Section_Title_Tip" element visibility in "Runs_Statistic_Section_Container" on "Project" wizard
        Then verify "Runs_Statistic_Section_Title_Tip" element in "Runs_Statistic_Section_Container" on "Project" wizard should display hover hint "Label_Hint"."Runs_Statistic_Section_Title_Tip"
        Then verify visibility of header column "time_period" in "Runs_Statistic_Table" table on "Project" wizard
        Then check "Last 24 hrs" header value in "time_period" column in "Runs_Statistic_Table" table on "Project" wizard
        Then verify visibility of header column "in_process_counter_number" in "Runs_Statistic_Table" table on "Project" wizard
        Then verify visibility of header column "in_process_counter_subtitle" in "Runs_Statistic_Table" table on "Project" wizard
        Then check "In Process" header value in "in_process_counter_subtitle" column in "Runs_Statistic_Table" table on "Project" wizard
        Then verify visibility of header column "in_process_counter_icon" in "Runs_Statistic_Table" table on "Project" wizard
        Then verify "In_Process_Counter_Subtitle" element in "Runs_Statistic_Section_Container" on "Project" wizard should display hover tooltip "Common_Tooltips"."In_Process_Jobs"
        Then verify visibility of header column "failed_counter_number" in "Runs_Statistic_Table" table on "Project" wizard
        Then verify visibility of header column "failed_counter_subtitle" in "Runs_Statistic_Table" table on "Project" wizard
        Then check "Failed" header value in "failed_counter_subtitle" column in "Runs_Statistic_Table" table on "Project" wizard
        Then verify visibility of header column "failed_counter_icon" in "Runs_Statistic_Table" table on "Project" wizard
        Then verify "Failed_Counter_Subtitle" element in "Runs_Statistic_Section_Container" on "Project" wizard should display hover tooltip "Common_Tooltips"."Failed_Jobs"
        Then verify visibility of header column "succeeded_counter_number" in "Runs_Statistic_Table" table on "Project" wizard
        Then verify visibility of header column "succeeded_counter_subtitle" in "Runs_Statistic_Table" table on "Project" wizard
        Then check "Succeeded" header value in "succeeded_counter_subtitle" column in "Runs_Statistic_Table" table on "Project" wizard
        Then verify visibility of header column "succeeded_counter_icon" in "Runs_Statistic_Table" table on "Project" wizard
        Then verify "Succeeded_Counter_Subtitle" element in "Runs_Statistic_Section_Container" on "Project" wizard should display hover tooltip "Common_Tooltips"."Succeeded"
        Then verify "Recent_Text" element visibility in "Runs_Statistic_Section_Container" on "Project" wizard
        Then "Recent_Text" element in "Runs_Statistic_Section_Container" on "Project" should contains "Recent jobs" value
        Then "Recent_Text_Sm" element in "Runs_Statistic_Section_Container" on "Project" should contains "(last 7 days)" value
        Then check "erann-test" value in "name" column in "Runs_Statistic_Table" table on "Project" wizard
        When scroll to the element with "erann-test" value in "name" column in "Runs_Statistic_Table" table on "Project" wizard
        And wait load page
        Then verify "All_Jobs_Link" element visibility in "Runs_Statistic_Section_Container" on "Project" wizard
        Then "All_Jobs_Link" element in "Runs_Statistic_Section_Container" on "Project" should contains "All jobs" value
        Then verify "Realtime_Functions_Nuclio_Table" element visibility on "Project" wizard
        Then verify visibility of header column "title" in "Realtime_Functions_Nuclio_Table" table on "Project" wizard
        Then check "Real-time functions (Nuclio)" header value in "title" column in "Realtime_Functions_Nuclio_Table" table on "Project" wizard
        Then verify visibility of header column "running_counter_number" in "Realtime_Functions_Nuclio_Table" table on "Project" wizard
        Then check "Running" header value in "running_counter_subtitle" column in "Realtime_Functions_Nuclio_Table" table on "Project" wizard
        Then verify visibility of header column "running_counter_icon" in "Realtime_Functions_Nuclio_Table" table on "Project" wizard
        Then verify visibility of header column "failed_counter_number" in "Realtime_Functions_Nuclio_Table" table on "Project" wizard
        Then check "Failed" header value in "failed_counter_subtitle" column in "Realtime_Functions_Nuclio_Table" table on "Project" wizard
        Then verify visibility of header column "failed_counter_icon" in "Realtime_Functions_Nuclio_Table" table on "Project" wizard
        Then verify "Running_Counter_Subtitle" element in "Realtime_Functions_Nuclio_Statistic_Section" on "Project" wizard should display hover tooltip "Common_Tooltips"."Running"
        Then verify "Failed_Counter_Subtitle" element in "Realtime_Functions_Nuclio_Statistic_Section" on "Project" wizard should display hover tooltip "Common_Tooltips"."Failed_Tip"
        Then verify visibility of header column "api_gateways_counter_number" in "Realtime_Functions_Nuclio_Table" table on "Project" wizard
        Then check "API gateways" header value in "api_gateways_counter_subtitle" column in "Realtime_Functions_Nuclio_Table" table on "Project" wizard
        Then verify visibility of header column "consumer_groups_counter_number" in "Realtime_Functions_Nuclio_Table" table on "Project" wizard
        Then check "Consumer groups" header value in "consumer_groups_counter_subtitle" column in "Realtime_Functions_Nuclio_Table" table on "Project" wizard
        Then "Recent_Text" element in "Realtime_Functions_Nuclio_Statistic_Section" on "Project" should contains "Recent real-time functions" value
        Then check "cat-vs-dog-classification-tf2-serving" value in "name" column in "Realtime_Functions_Nuclio_Table" table on "Project" wizard
        Then verify "All_Realtime_Functions_Link" element visibility in "Realtime_Functions_Nuclio_Statistic_Section" on "Project" wizard
        Then "All_Realtime_Functions_Link" element in "Realtime_Functions_Nuclio_Statistic_Section" on "Project" should contains "All real-time functions" value
        When hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then verify "General_Info_Quick_Links" element visibility on "commonPagesHeader" wizard
    
    @MLPM
    @passive
    @smoke
    Scenario: MLPM001 - Check all mandatory components on Navigation Bar
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        #check the default state of 'Navigation_Bar'
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then "Navigation_Bar" on "commonPagesHeader" wizard should not be "pinned"
        #check visibility of menu buttons with pinned 'Navigation_Bar'
        Then click on "Pin_Quick_Link_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        Then "Navigation_Bar" on "commonPagesHeader" wizard should be "pinned"
        Then verify "Pin_Quick_Link_Button" element visibility on "commonPagesHeader" wizard
        Then verify "General_Info_Quick_Panel" element visibility on "commonPagesHeader" wizard
        Then verify "Project_Monitoring_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Feature_Store_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Datasets_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Documents_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Artifacts_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Models_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Jobs_And_Workflows_Button" element visibility on "commonPagesHeader" wizard
        Then verify "ML_Functions_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Real_Time_Functions_Button" element visibility on "commonPagesHeader" wizard
        Then verify "API_Gateways_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Alerts_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Project_Settings_Button" element visibility on "commonPagesHeader" wizard
        #check invisibility of menu buttons and visibility of menu icons with unpinned 'Navigation_Bar'
        Then click on "Pin_Quick_Link_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        Then verify "Pin_Quick_Link_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "General_Info_Quick_Panel" element visibility on "commonPagesHeader" wizard
        Then verify "Project_Monitoring_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "Project_Monitoring_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "Feature_Store_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "Feature_Store_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "Datasets_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "Datasets_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "Documents_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "Documents_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "Artifacts_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "Artifacts_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "Models_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "Models_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "Jobs_And_Workflows_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "Jobs_And_Workflows_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "ML_Functions_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "ML_Functions_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "Real_Time_Functions_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "Real_Time_Functions_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "API_Gateways_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "API_Gateways_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "Alerts_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "Alerts_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "Project_Settings_Button" element invisibility on "commonPagesHeader" wizard
        Then verify "Project_Settings_Icon" element visibility on "commonPagesHeader" wizard
        #check that 'Navigation_Bar' save the state through different pages
        Then "Navigation_Bar" on "commonPagesHeader" wizard should not be "pinned"
        Then click on "ML_Functions_Icon" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then "Navigation_Bar" on "commonPagesHeader" wizard should not be "pinned"
        Then click on "Jobs_And_Workflows_Icon" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then "Navigation_Bar" on "commonPagesHeader" wizard should not be "pinned"
        Then click on "Feature_Store_Icon" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then "Navigation_Bar" on "commonPagesHeader" wizard should not be "pinned"
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on "Pin_Quick_Link_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        Then "Navigation_Bar" on "commonPagesHeader" wizard should be "pinned"
        Then click on "Project_Monitoring_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then "Navigation_Bar" on "commonPagesHeader" wizard should be "pinned"
        Then click on "Datasets_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then "Navigation_Bar" on "commonPagesHeader" wizard should be "pinned"
        Then click on "Project_Settings_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "Secrets" tab in "Project_Settings_Tab_Selector" on "Project_Settings_General_Tab" wizard
        And wait load page
        Then "Navigation_Bar" on "commonPagesHeader" wizard should be "pinned"
        #check visibility of menu buttons in demo mode
        When turn on demo mode with query params "false"
        And wait load page
        And wait load page
        Then verify "Monitoring_App_Button" element visibility on "commonPagesHeader" wizard
        Then verify "Monitoring_App_Icon" element visibility on "commonPagesHeader" wizard
        Then verify "LLM_Prompts_Button" element visibility on "commonPagesHeader" wizard
        Then verify "LLM_Prompts_Icon" element visibility on "commonPagesHeader" wizard

    @MLPM
    @passive
    @smoke
    Scenario: MLPM003 - Check MLRun logo redirection
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on "MLRun_Logo" element on "commonPagesHeader" wizard
        And wait load page
        And wait load page
        Then verify "Projects_Table" element visibility on "Projects" wizard

    @MLPM
    @passive
    @smoke
    Scenario: MLPM004 - Check all mandatory components on Register File Popup
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Quick_Actions" element visibility on "Project" wizard
        Then verify "Quick_Actions" dropdown element on "Project" wizard should contains "Project"."Quick_Actions_Options"
        Then select "Register artifact" option in "Quick_Actions" dropdown on "Project" wizard
        Then "Title" element on "Register_File_Popup" should contains "Register Artifact" value
        Then "Form_Text" component on "Register_File_Popup" should contains "Register_Artifact"."Form_Text"
        Then "Form_Subtext" component on "Register_File_Popup" should contains "Register_Artifact"."Form_Subtext"
        Then verify "Cross_Cancel_Button" element visibility on "Register_File_Popup" wizard
        Then verify "New_File_Name_Input" element visibility on "Register_File_Popup" wizard
        Then type value " " to "New_File_Name_Input" field on "Register_File_Popup" wizard
        Then verify "New_File_Name_Input" on "Register_File_Popup" wizard should display options "Input_Hint"."Artifact_Name_Hint"
        Then click on "Form_Subtext" element on "Register_File_Popup" wizard
        Then verify "New_File_Name_Input" options rules on form "Register_File_Popup" wizard
        Then verify options in "Path_Scheme_Combobox" combobox in "Target_Path" on "Register_File_Popup" wizard should contains "Register_Artifact"."Combobox_Options"
        When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_File_Popup" wizard
        When type value "  " to "Path_Scheme_Combobox" field on "Target_Path" on "Register_File_Popup" wizard
        Then verify "Path_Scheme_Combobox" element in "Target_Path" on "Register_File_Popup" wizard should display hover warning "Input_Hint"."V3IO_Path_Hint"
        Then verify "New_File_Description_Input" element visibility on "Register_File_Popup" wizard
        Then type value " " to "New_File_Description_Input" field on "Register_File_Popup" wizard
        Then verify "New_File_Description_Input" on "Register_File_Popup" wizard should display hover warning "Input_Hint"."Input_Field_Invalid"
        Then verify "New_File_Type_Dropdown" element visibility on "Register_File_Popup" wizard
        Then verify "New_File_Type_Dropdown" dropdown element on "Register_File_Popup" wizard should contains "Register_Artifact"."Type_Options"
        Then select "Table" option in "New_File_Type_Dropdown" dropdown on "Register_File_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Register_File_Popup" wizard
        Then "Cancel_Button" element on "Register_File_Popup" should contains "Cancel" value
        Then verify "Register_Button" element visibility on "Register_File_Popup" wizard
        Then "Register_Button" element on "Register_File_Popup" should contains "Register" value
        Then click on "Register_Button" element on "Register_File_Popup" wizard
        Then verify "Register_Button" element on "Register_File_Popup" wizard is disabled
        Then type value "artifact" to "New_File_Name_Input" field on "Register_File_Popup" wizard
        When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_File_Popup" wizard
        When type value "target/path" to "Path_Scheme_Combobox" field on "Target_Path" on "Register_File_Popup" wizard
        Then type value "new artifact description" to "New_File_Description_Input" field on "Register_File_Popup" wizard
        Then check "New_File_Description_Input" textarea counter on "Register_File_Popup" wizard
        Then verify "Register_Button" element on "Register_File_Popup" wizard is enabled
        Then click on "Cancel_Button" element on "Register_File_Popup" wizard
        Then verify if "Common_Popup" popup dialog appears
        Then click on "Cancel_Button" element on "Common_Popup" wizard
        Then verify if "Register_Dataset" popup dialog appears
        Then verify "New_File_Name_Input" input should contains "artifact" value on "Register_File_Popup" wizard
        Then verify "Path_Scheme_Combobox" input should contains "target/path" value in "Target_Path" on "Register_File_Popup" wizard
        Then verify "New_File_Description_Input" input should contains "new artifact description" value on "Register_File_Popup" wizard
        Then verify "New_File_Type_Dropdown" dropdown on "Register_File_Popup" wizard selected option value "Table"

    @MLPM
    @passive
    @smoke
    Scenario: MLPM005 - Check all mandatory components on Register Model Popup
        Given open url
        And wait load page
        When turn on demo mode with query params "false"
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Quick_Actions" element visibility on "Project" wizard
        Then verify "Quick_Actions" dropdown element on "Project" wizard should contains "Project"."Quick_Actions_Options_Demo"
        Then select "Register model" option in "Quick_Actions" dropdown on "Project" wizard
        Then "Title" element on "Register_Model_Popup" should contains "Register Model" value
        Then verify "Cross_Cancel_Button" element visibility on "Register_Model_Popup" wizard
        Then verify "New_File_Name_Input" element visibility on "Register_Model_Popup" wizard
        Then verify options in "Path_Scheme_Combobox" combobox in "Target_Path" on "Register_Model_Popup" wizard should contains "Models"."Combobox_Options"
        Then verify "New_File_Description_Input" element visibility on "Register_Model_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Register_Model_Popup" wizard
        Then verify "Register_Button" element visibility on "Register_Model_Popup" wizard
        Then click on "Register_Button" element on "Register_Model_Popup" wizard
        Then type value "   " to "New_File_Name_Input" field on "Register_Model_Popup" wizard
        Then verify "New_File_Name_Input" on "Register_Model_Popup" wizard should display options "Input_Hint"."Artifact_Name_Hint"
        When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_Model_Popup" wizard
        When type value "  " to "Path_Scheme_Combobox" field on "Target_Path" on "Register_Model_Popup" wizard
        Then verify "Path_Scheme_Combobox" element in "Target_Path" on "Register_Model_Popup" wizard should display hover warning "Input_Hint"."V3IO_Path_Hint"
        Then type value "   " to "New_File_Description_Input" field on "Register_Model_Popup" wizard
        Then verify "New_File_Description_Input" on "Register_Model_Popup" wizard should display hover warning "Input_Hint"."Input_Field_Invalid"
        When add rows to "Labels_Table" table on "Register_Model_Popup" wizard
            | key_input | value_input |
            |    key1   |    value1   |
            |    key2   |    value2   |
            |    key3   |    value3   |
        Then verify values in "Labels_Table" table on "Register_Model_Popup" wizard with attribute
            | key_verify | value_verify | 
            |    key1    |    value1    |
            |    key2    |    value2    |
            |    key3    |    value3    |
        When click on "remove_btn" in "Labels_Table" table on "Register_Model_Popup" wizard with attribute
            | key_verify | 
            |    key1    |    
            |    key3    |      
        Then verify values in "Labels_Table" table on "Register_Model_Popup" wizard with attribute
            | key_verify | value_verify | 
            |    key2    |    value2    |

    @MLPM
    @passive
    @smoke
    Scenario: MLPM006 - Check all mandatory components on Register Dataset Popup
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Quick_Actions" element visibility on "Project" wizard
        Then verify "Quick_Actions" dropdown element on "Project" wizard should contains "Project"."Quick_Actions_Options"
        Then select "Register dataset" option in "Quick_Actions" dropdown on "Project" wizard
        Then "Title" element on "Register_Dataset" should contains "Register Dataset" value
        Then "Form_Text" component on "Register_Dataset" should contains "Register_Dataset"."Form_Text"
        Then "Form_Subtext" component on "Register_Dataset" should contains "Register_Dataset"."Form_Subtext"
        Then verify "Name_Input" element visibility on "Register_Dataset" wizard
        Then type value "   " to "Name_Input" field on "Register_Dataset" wizard
        Then verify "Name_Input" on "Register_Dataset" wizard should display options "Input_Hint"."Artifact_Name_Hint"
        Then click on "Form_Subtext" element on "Register_Dataset" wizard
        Then verify "Name_Input" options rules on form "Register_Dataset" wizard
        Then verify options in "Path_Scheme_Combobox" combobox in "Target_Path" on "Register_Dataset" wizard should contains "Register_Dataset"."Combobox_Options"
        When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_Dataset" wizard
        When type value "  " to "Path_Scheme_Combobox" field on "Target_Path" on "Register_Dataset" wizard
        Then verify "Path_Scheme_Combobox" element in "Target_Path" on "Register_Dataset" wizard should display hover warning "Input_Hint"."V3IO_Path_Hint"
        Then verify "Description_Input" element visibility on "Register_Dataset" wizard
        Then type value "   " to "Description_Input" field on "Register_Dataset" wizard
        Then verify "Description_Input" on "Register_Dataset" wizard should display hover warning "Input_Hint"."Input_Field_Invalid"
        Then verify "Cancel_Button" element visibility on "Register_Dataset" wizard
        Then "Cancel_Button" element on "Register_Dataset" should contains "Cancel" value
        Then verify "Register_Button" element visibility on "Register_Dataset" wizard
        Then "Register_Button" element on "Register_Dataset" should contains "Register" value
        Then click on "Register_Button" element on "Register_Dataset" wizard
        Then verify "Register_Button" element on "Register_Dataset" wizard is disabled
        Then type value "dataset" to "Name_Input" field on "Register_Dataset" wizard
        When type value "target/path" to "Path_Scheme_Combobox" field on "Target_Path" on "Register_Dataset" wizard
        Then type value "new dataset description" to "Description_Input" field on "Register_Dataset" wizard
        Then check "Description_Input" textarea counter on "Register_Dataset" wizard
        Then verify "Register_Button" element on "Register_Dataset" wizard is enabled
        Then click on "Cancel_Button" element on "Register_Dataset" wizard
        Then verify if "Common_Popup" popup dialog appears
        Then click on "Cancel_Button" element on "Common_Popup" wizard
        Then verify if "Register_Dataset" popup dialog appears
        Then verify "Name_Input" input should contains "dataset" value on "Register_Dataset" wizard
        Then verify "Path_Scheme_Combobox" input should contains "target/path" value in "Target_Path" on "Register_Dataset" wizard
        Then verify "Description_Input" input should contains "new dataset description" value on "Register_Dataset" wizard
    
    @MLPM
    @passive
    @smoke
    Scenario: MLPM007 - Check all mandatory components on Batch run
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Quick_Actions" element visibility on "Project" wizard
        Then verify "Quick_Actions" dropdown element on "Project" wizard should contains "Project"."Quick_Actions_Options"
        Then select "Batch run" option in "Quick_Actions" dropdown on "Project" wizard
        And wait load page
        Then verify "Title" element visibility on "Modal_Wizard_Form" wizard
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Run" value
        Then verify "Cross_Close_Button" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Wizard_Steps_Content" element visibility on "Modal_Wizard_Form" wizard
        And click on row root with value "test" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "test" value
        Then verify "Step_1_Button" element on "commonPagesHeader" wizard is enabled
        Then "Step_1_Button_text" element on "commonPagesHeader" should contains "Function selection" value
        Then verify "Step_2_Button" element on "commonPagesHeader" wizard is enabled
        Then "Step_2_Button_text" element on "commonPagesHeader" should contains "Run details" value
        Then verify "Step_3_Button" element on "commonPagesHeader" wizard is enabled
        Then "Step_3_Button_text" element on "commonPagesHeader" should contains "Data inputs" value
        Then verify "Step_4_Button" element on "commonPagesHeader" wizard is enabled
        Then "Step_4_Button_text" element on "commonPagesHeader" should contains "Parameters" value
        Then verify "Step_5_Button" element on "commonPagesHeader" wizard is enabled
        Then "Step_5_Button_text" element on "commonPagesHeader" should contains "Resources" value
        Then verify "Step_6_Button" element on "commonPagesHeader" wizard is enabled
        Then "Step_6_Button_text" element on "commonPagesHeader" should contains "Advanced" value
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
        Then verify "Schedule_For_Later_Button" element on "Modal_Wizard_Form" wizard is enabled
        Then verify "Run_Button" element on "Modal_Wizard_Form" wizard is enabled
        Then verify "Back_Button" element not exists on "Modal_Wizard_Form" wizard
        Then verify "Form_Header_Function_Selection" element visibility on "commonPagesHeader" wizard
        Then verify "Function_Selection_Tabs" on "Modal_Wizard_Form" wizard should contains "Modal_Wizard_Form"."Tab_List"
        Then verify "Search_Input" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Project_Selector_Dropdown" element visibility on "Modal_Wizard_Form" wizard
        Then select "Hub" tab in "Function_Selection_Tabs" on "Modal_Wizard_Form" wizard
        And wait load page
        Then verify "Filter_Button_Hub_Tab" element visibility on "Modal_Wizard_Form" wizard
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then "Form_Header_Run_Details" element on "commonPagesHeader" should contains "Run details" value
        Then "Hyperparameter_Checkbox" element should be unchecked on "Modal_Wizard_Form" wizard
        Then verify "Run_Name_Input" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Version_Tag_Dropdown" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Handler_Dropdown" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Labels_Table" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Image_Name_Input_Run_Details" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Back_Button" element on "Modal_Wizard_Form" wizard is enabled
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then "Form_Header_Data_Inputs" element on "commonPagesHeader" should contains "Data inputs" value
        Then verify "Data_Inputs_Headers" on "Modal_Wizard_Form" wizard should contains "Modal_Wizard_Form"."Data_Inputs_Table_Header"
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then "Form_Header_Parameters" element on "commonPagesHeader" should contains "Parameters" value
        Then verify "Parameters_Headers" on "Modal_Wizard_Form" wizard should contains "Modal_Wizard_Form"."Parameters_Table_Header"
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then verify "Volumes_Subheader" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Volume_Paths_Table" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Request_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Request_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Limit_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Memory_Limit_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Request_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Request_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "CPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "GPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        And click on "Next_Button" element on "Modal_Wizard_Form" wizard
        Then "Form_Header_Advanced" element on "commonPagesHeader" should contains "Advanced" value
        Then "Accordion_Advanced_Subheader" element on "Modal_Wizard_Form" should contains "Environment variables" value
        Then verify "Advanced_Environment_Variables_Table" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Default_Input_Path_Input" element visibility in "Advanced_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Default_Artifact_Path_Input" element visibility in "Advanced_Accordion" on "Modal_Wizard_Form" wizard
        Then "Default_Artifact_Path_Input" element in "Advanced_Accordion" on "Modal_Wizard_Form" should contains "v3io:///projects/{{run.project}}/artifacts" attribute value
        Then verify "Access_Key_Checkbox" element visibility on "Modal_Wizard_Form" wizard
        Then uncheck "Access_Key_Checkbox" element on "Modal_Wizard_Form" wizard
        Then verify "Access_Key_Input" element visibility on "Modal_Wizard_Form" wizard
        And click on "Step_2_Button" element on "commonPagesHeader" wizard
        Then check "Hyperparameter_Checkbox" element on "Modal_Wizard_Form" wizard
        And click on "Step_5_Button" element on "commonPagesHeader" wizard
        Then "Form_Header_Hyperparameter_Strategy" element on "commonPagesHeader" should contains "Hyperparameter strategy" value
        Then verify "Strategy_Dropdown" element visibility in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Max_Iterations" element visibility in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Max_Errors" element visibility in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard
        Then "Ranking_Subheader" element on "Modal_Wizard_Form" should contains "Ranking" value
        Then verify "Ranking_Result_Input" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Ranking_Criteria_Dropdown" dropdown element on "Modal_Wizard_Form" wizard should contains "Common_Lists"."Ranking_Criteria_List"
        Then "Stop_Condition_Subheader" element on "Modal_Wizard_Form" should contains "Stop condition" value
        Then verify "Stop_Condition_Input" element visibility on "Modal_Wizard_Form" wizard
        Then "Parallelism_Subheader" element on "Modal_Wizard_Form" should contains "Parallelism" value
        Then verify "Parallel_Runs_Number_Input" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Dask_Clutter_URL_Input" element visibility on "Modal_Wizard_Form" wizard
        Then "Teardown_Checkbox" element should be unchecked on "Modal_Wizard_Form" wizard

    @MLPM
    @passive
    @smoke
    Scenario: MLPM029 - Check the Secret name validation in the Resources step on the Batch run wizard
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Quick_Actions" element visibility on "Project" wizard
        Then verify "Quick_Actions" dropdown element on "Project" wizard should contains "Project"."Quick_Actions_Options"
        Then select "Batch run" option in "Quick_Actions" dropdown on "Project" wizard
        And wait load page
        Then verify "Title" element visibility on "Modal_Wizard_Form" wizard
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Run" value
        Then verify "Cross_Close_Button" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Wizard_Steps_Content" element visibility on "Modal_Wizard_Form" wizard
        And click on row root with value "aggregate" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "aggregate" value
        And click on "Step_5_Button" element on "commonPagesHeader" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "aggregate" value
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Run" value
        Then verify "Form_Header_Resources" element visibility on "commonPagesHeader" wizard
        Then "Form_Header_Resources" element on "commonPagesHeader" should contains "Resources" value
        Then verify "Volumes_Subheader" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Volumes_Subheader" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Label_Hint"."New_Job_Volumes"
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Secret_Name_Input | Add_New_Row_Button |
            |             Secret               |                                      |                               |   mlrun-project-secrets-defaultinv   |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Mount_Path_Hint"
        Then verify "Volume_Paths_Table_Secret_Name_Input" in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display options "Input_Hint"."Secret_Name_Rule_Options"
        When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Secret_Name_Input | Add_New_Row_Button |
            |             Secret               |            test                      |       test                    |   mlrun-project-secrets-default      |         yes        |
        Then verify values in "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard
            |  type  | volume_name  |  path  |
            | Secret |    test      |  test  |
        When click on data "remove_btn" in "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard
            |  type  |
            | Secret |
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Secret_Name_Input | Add_New_Row_Button |
            |             Secret               |                                      |                               |         mlrun-auth-secrets.          |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Mount_Path_Hint"
        Then verify "Volume_Paths_Table_Secret_Name_Input" in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display options "Input_Hint"."Secret_Name_Rule_Options"
        When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Secret_Name_Input | Add_New_Row_Button |
            |             Secret               |            test                      |       test                    |         mlrun-auth-secrets           |         yes        |
        Then verify values in "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard
            |  type  | volume_name  |  path  |
            | Secret |    test      |  test  |
        When click on data "remove_btn" in "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard
            |  type  |
            | Secret |
        Then verify "Cross_Close_Button" element visibility on "Modal_Wizard_Form" wizard
        And click on "Cross_Close_Button" element on "Modal_Wizard_Form" wizard
        And wait load page
        Then verify "Quick_Actions" element visibility on "Project" wizard
        Then verify "Quick_Actions" dropdown element on "Project" wizard should contains "Project"."Quick_Actions_Options"

    @MLPM
    @passive
    @smoke
    Scenario: MLPM030 - Check the Secret name validation in the Advanced step on the Batch run wizard
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Quick_Actions" element visibility on "Project" wizard
        Then verify "Quick_Actions" dropdown element on "Project" wizard should contains "Project"."Quick_Actions_Options"
        Then select "Batch run" option in "Quick_Actions" dropdown on "Project" wizard
        And wait load page
        Then verify "Title" element visibility on "Modal_Wizard_Form" wizard
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Run" value
        Then verify "Cross_Close_Button" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Wizard_Steps_Content" element visibility on "Modal_Wizard_Form" wizard
        And click on row root with value "erann-job-func" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "erann-job-func" value
        And click on "Step_6_Button" element on "commonPagesHeader" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "erann-job-func" value
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Run" value
        Then verify "Form_Header_Advanced" element visibility on "commonPagesHeader" wizard
        Then "Form_Header_Advanced" element on "commonPagesHeader" should contains "Advanced" value
        Then "Accordion_Advanced_Subheader" element on "Modal_Wizard_Form" should contains "Environment variables" value
        Then verify "Advanced_Environment_Variables_Table" element visibility on "Modal_Wizard_Form" wizard 
        When add data to "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard with several inputs
            | name_input | type_dropdown |             value_input            | value_input_key |
            |    name1   |    Secret     | mlrun-project-secrets-defaultinv   |   sectretKey1   |
        Then verify "Env_Variables_Table_Secret_Name_Input" in "Advanced_Accordion" on "Modal_Wizard_Form" wizard should display options "Input_Hint"."Secret_Name_Rule_Options"
        When click on "Delete_New_Row_Button" element in "Advanced_Accordion" on "Modal_Wizard_Form" wizard
        When add data to "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard with several inputs
            | name_input | type_dropdown |             value_input            | value_input_key |
            |    name1   |    Secret     |    mlrun-project-secrets-default   |   sectretKey1   |
        Then verify data in "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard
            | name_verify | type_dropdown_verify |                value_verify               |
            |    name1    |        secret        | mlrun-project-secrets-default:sectretKey1 | 
        When click on "delete_btn" in "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard with offset "false"
            | name_verify |
            |    name1    |
        When add data to "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard with several inputs
            | name_input | type_dropdown |     value_input     | value_input_key |
            |    name1   |    Secret     | mlrun-auth-secrets. |   sectretKey1   |
        Then verify "Env_Variables_Table_Secret_Name_Input" in "Advanced_Accordion" on "Modal_Wizard_Form" wizard should display options "Input_Hint"."Secret_Name_Rule_Options"
        When click on "Delete_New_Row_Button" element in "Advanced_Accordion" on "Modal_Wizard_Form" wizard
        When add data to "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard with several inputs
            | name_input | type_dropdown |     value_input    | value_input_key |
            |    name1   |    Secret     | mlrun-auth-secrets |   sectretKey1   |
        Then verify data in "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard
            | name_verify | type_dropdown_verify |         value_verify           |
            |    name1    |        secret        | mlrun-auth-secrets:sectretKey1 | 
        When click on "delete_btn" in "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard with offset "false"
            | name_verify |
            |    name1    |
        Then verify "Cross_Close_Button" element visibility on "Modal_Wizard_Form" wizard
        And click on "Cross_Close_Button" element on "Modal_Wizard_Form" wizard
        And wait load page
        Then verify "Quick_Actions" element visibility on "Project" wizard
        Then verify "Quick_Actions" dropdown element on "Project" wizard should contains "Project"."Quick_Actions_Options"

    @MLPM
    @passive
    @smoke
    Scenario: MLPM031 - Check all mandatory components on Batch inference in Advanced section
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Quick_Actions" element visibility on "Project" wizard
        Then verify "Quick_Actions" dropdown element on "Project" wizard should contains "Project"."Quick_Actions_Options"
        Then select "Batch inference" option in "Quick_Actions" dropdown on "Project" wizard
        And wait load page
        Then verify "Title" element visibility on "Modal_Wizard_Form" wizard
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Inference" value
        Then verify "Cross_Close_Button" element visibility on "Modal_Wizard_Form" wizard
        Then verify "Wizard_Steps_Content" element visibility on "Modal_Wizard_Form" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "batch-inference-v2" value
        And click on "Step_5_Button" element on "commonPagesHeader" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "batch-inference-v2" value
        Then "Preview_text" element on "Modal_Wizard_Form" should contains "Tech Preview" value
        Then "Title" element on "Modal_Wizard_Form" should contains "Batch Inference" value
        Then verify "Form_Header_Advanced" element visibility on "commonPagesHeader" wizard
        Then "Form_Header_Advanced" element on "commonPagesHeader" should contains "Advanced" value
        Then "Accordion_Advanced_Subheader" element on "Modal_Wizard_Form" should contains "Environment variables" value
        Then verify "Advanced_Environment_Variables_Table" element visibility on "Modal_Wizard_Form" wizard 
        Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is disabled
        Then verify "Back_Button" element on "Modal_Wizard_Form" wizard is enabled
        Then "Next_Button" element on "Modal_Wizard_Form" should contains "Next" value
        Then "Back_Button" element on "Modal_Wizard_Form" should contains "Back" value
        Then "Infer_Now_Button" element on "Modal_Wizard_Form" should contains "Infer now" value
        Then "Schedule_Infer_Button" element on "Modal_Wizard_Form" should contains "Schedule infer" value
        Then verify "Accordion_Advanced_Subheader" element visibility on "Modal_Wizard_Form" wizard
        Then "Accordion_Advanced_Subheader" element on "Modal_Wizard_Form" should contains "Environment variables" value
        Then verify "Advanced_Environment_Variables_Table" element visibility on "Modal_Wizard_Form" wizard
        When add data to "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard with several inputs
            | name_input | type_dropdown |  value_input | value_input_key |
            |    name1   |     Value     |    value1    |                 |
            |    name2   |     Secret    | sectretName1 |   sectretKey1   |
            |    name3   |     Secret    | sectretName2 |   sectretKey2   |
            |    name4   |     Value     |    value2    |                 |
            |    name5   |     Secret    | sectretName3 |   sectretKey3   |
            |    name6   |     Value     |    value3    |                 |
            |    name7   |     Secret    | sectretName4 |   sectretKey4   |
            |    name8   |     Value     |    value4    |                 |
        Then verify data in "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard
            | name_verify | type_dropdown_verify |       value_verify       |
            |    name1    |        value         |          value1          |
            |    name2    |        secret        | sectretName1:sectretKey1 | 
            |    name3    |        secret        | sectretName2:sectretKey2 |
            |    name4    |        value         |          value2          |
            |    name5    |        secret        | sectretName3:sectretKey3 |
            |    name6    |        value         |          value3          |
            |    name7    |        secret        | sectretName4:sectretKey4 |
            |    name8    |        value         |          value4          |
        When click on "delete_btn" in "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard with offset "false"
            | name_verify |
            |    name1    |
            |    name3    |
            |    name6    |
        Then verify data in "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard
            | name_verify | type_dropdown_verify |       value_verify       |
            |    name2    |        secret        | sectretName1:sectretKey1 | 
            |    name4    |        value         |          value2          |
            |    name5    |        secret        | sectretName3:sectretKey3 |
            |    name7    |        secret        | sectretName4:sectretKey4 |
            |    name8    |        value         |          value4          |
        And wait load page
        Then edit 1 row in "Advanced_Environment_Variables_Table" key-value table on "Modal_Wizard_Form" wizard
            | name_input | value_input | 
            |   edited   |    edited   |
        Then verify data in "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard
            | name_verify | type_dropdown_verify |          value_verify          |
            | name2edited |        secret        | sectretName1edited:sectretKey1 | 
            |    name4    |        value         |             value2             |
            |    name5    |        secret        |    sectretName3:sectretKey3    |
            |    name7    |        secret        |    sectretName4:sectretKey4    |
            |    name8    |        value         |             value4             |
        And wait load page
        Then edit 5 row in "Advanced_Environment_Variables_Table" key-value table on "Modal_Wizard_Form" wizard
            | name_input | value_input | 
            |   edited   |    edited   |
        Then verify data in "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard
            | name_verify | type_dropdown_verify |          value_verify          |
            | name2edited |        secret        | sectretName1edited:sectretKey1 | 
            |    name4    |        value         |             value2             |
            |    name5    |        secret        |    sectretName3:sectretKey3    |
            |    name7    |        secret        |    sectretName4:sectretKey4    |
            | name8edited |        value         |          value4edited          |
        And wait load page
        When click on "delete_btn" in "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard with offset "false"
            | name_verify |
            |    name4    |
            |    name5    |
        And wait load page
        Then verify "Default_Input_Path_Input" element visibility in "Advanced_Accordion" on "Modal_Wizard_Form" wizard
        Then type value "test" to "Default_Input_Path_Input" field on "Advanced_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Default_Artifact_Path_Input" element visibility in "Advanced_Accordion" on "Modal_Wizard_Form" wizard
        Then "Default_Artifact_Path_Input" element in "Advanced_Accordion" on "Modal_Wizard_Form" should contains "v3io:///projects/{{run.project}}/artifacts" attribute value
        Then verify "Access_Key_Checkbox" element visibility on "Modal_Wizard_Form" wizard
        Then uncheck "Access_Key_Checkbox" element on "Modal_Wizard_Form" wizard
        Then verify "Access_Key_Input" element visibility on "Modal_Wizard_Form" wizard
        Then type value "  @" to "Access_Key_Input" field on "Modal_Wizard_Form" wizard
        Then verify "Access_Key_Input" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Invalid"
        Then type value "" to "Access_Key_Input" field on "Modal_Wizard_Form" wizard
        Then verify "Access_Key_Input" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then check "Access_Key_Checkbox" element on "Modal_Wizard_Form" wizard
        When click on "delete_btn" in "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard with offset "false"
            | name_verify |
            | name2edited |
            |    name7    |
            | name8edited |
        And wait load page
        When add data to "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard with several inputs
            | name_input | type_dropdown |             value_input            | value_input_key |
            |    name1   |    Secret     | mlrun-project-secrets-defaultinv   |   sectretKey1   |
        Then verify "Env_Variables_Table_Secret_Name_Input" in "Advanced_Accordion" on "Modal_Wizard_Form" wizard should display options "Input_Hint"."Secret_Name_Rule_Options"
        When click on "Delete_New_Row_Button" element in "Advanced_Accordion" on "Modal_Wizard_Form" wizard
        When add data to "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard with several inputs
            | name_input | type_dropdown |             value_input            | value_input_key |
            |    name1   |    Secret     |    mlrun-project-secrets-default   |   sectretKey1   |
        Then verify data in "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard
            | name_verify | type_dropdown_verify |                value_verify               |
            |    name1    |        secret        | mlrun-project-secrets-default:sectretKey1 | 
        When click on "delete_btn" in "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard with offset "false"
            | name_verify |
            |    name1    |
        When add data to "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard with several inputs
            | name_input | type_dropdown |     value_input     | value_input_key |
            |    name1   |    Secret     | mlrun-auth-secrets. |   sectretKey1   |
        Then verify "Env_Variables_Table_Secret_Name_Input" in "Advanced_Accordion" on "Modal_Wizard_Form" wizard should display options "Input_Hint"."Secret_Name_Rule_Options"
        When click on "Delete_New_Row_Button" element in "Advanced_Accordion" on "Modal_Wizard_Form" wizard
        When add data to "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard with several inputs
            | name_input | type_dropdown |     value_input    | value_input_key |
            |    name1   |    Secret     | mlrun-auth-secrets |   sectretKey1   |
        Then verify data in "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard
            | name_verify | type_dropdown_verify |         value_verify           |
            |    name1    |        secret        | mlrun-auth-secrets:sectretKey1 | 
        When click on "delete_btn" in "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard with offset "false"
            | name_verify |
            |    name1    |
        And click on "Step_4_Button" element on "commonPagesHeader" wizard
        Then "Function_Title" element on "Modal_Wizard_Form" should contains "batch-inference-v2" value
        Then verify "Form_Header_Resources" element visibility on "commonPagesHeader" wizard
        Then "Form_Header_Resources" element on "commonPagesHeader" should contains "Resources" value
        Then verify "Volumes_Subheader" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        Then verify "Volumes_Subheader" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Label_Hint"."New_Job_Volumes"
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Secret_Name_Input | Add_New_Row_Button |
            |             Secret               |                                      |                               |   mlrun-project-secrets-defaultinv   |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Mount_Path_Hint"
        Then verify "Volume_Paths_Table_Secret_Name_Input" in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display options "Input_Hint"."Secret_Name_Rule_Options"
        When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Secret_Name_Input | Add_New_Row_Button |
            |             Secret               |            test                      |       test                    |   mlrun-project-secrets-default      |         yes        |
        Then verify values in "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard
            |  type  | volume_name  |  path  |
            | Secret |    test      |  test  |
        When click on data "remove_btn" in "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard
            |  type  |
            | Secret |
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Secret_Name_Input | Add_New_Row_Button |
            |             Secret               |                                      |                               |         mlrun-auth-secrets.          |         yes        |
        Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hover warning "Input_Hint"."Input_Field_Require"
        Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Mount_Path_Hint"
        Then verify "Volume_Paths_Table_Secret_Name_Input" in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display options "Input_Hint"."Secret_Name_Rule_Options"
        When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard
        When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Secret_Name_Input | Add_New_Row_Button |
            |             Secret               |            test                      |       test                    |         mlrun-auth-secrets           |         yes        |
        Then verify values in "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard
            |  type  | volume_name  |  path  |
            | Secret |    test      |  test  |
        When click on data "remove_btn" in "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard
            |  type  |
            | Secret |
        Then verify "Infer_Now_Button" element on "Modal_Wizard_Form" wizard is enabled
        And click on "Infer_Now_Button" element on "Modal_Wizard_Form" wizard
        And wait load page
        And wait load page
        Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
        Then "Notification_Pop_Up" element on "Notification_Popup" should contains "The batch run was started" value
        And wait load page
        Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
        And wait load page
        Then value in "name" column with "text" in "Jobs_Monitor_Table" on "Jobs_Monitor_Tab" wizard should contains "batch-inference-v2"

    @MLPM
    @passive
    @smoke
    Scenario: MLPM008 - Check all mandatory components on Create ML Function - Job runtime
        Given open url
        And wait load page
        When turn on demo mode with query params "false"
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Quick_Actions" element visibility on "Project" wizard
        Then verify "Quick_Actions" dropdown element on "Project" wizard should contains "Project"."Quick_Actions_Options_Demo"
        When turn on demo mode with query params "false"
        And wait load page
        Then select "ML function" option in "Quick_Actions" dropdown on "Project" wizard
        Then "Title" element on "Create_ML_Function_Popup" should contains "Create new function" value
        And verify "Cross_Cancel_Button" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Name_Input" element visibility on "Create_ML_Function_Popup" wizard
        Then type value "   " to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Name_Input" on "Create_ML_Function_Popup" wizard should display options "Input_Hint"."Function_Name_Hint"
        Then click on "Title" element on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Name_Input" options rules on "Create_ML_Function_Popup" wizard
        Then type value "   " to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Tag_Input" on "Create_ML_Function_Popup" wizard should display options "Input_Hint"."Function_Tag_Hint"
        Then click on "Title" element on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Tag_Input" options rules on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Runtime_Dropdown" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "Continue_Button" element visibility on "Create_ML_Function_Popup" wizard
        And type value "demo-function-02" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        And type value "latest" to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        And click on "Continue_Button" element on "Create_ML_Function_Popup" wizard
        Then verify "Function_Description_Input" element visibility in "General_Accordion" on "New_Function" wizard
        Then verify "Labels_Table" element visibility in "General_Accordion" on "New_Function" wizard
        When collapse "General_Accordion" on "New_Function" wizard
        Then verify "New_Function_Code_Entry_Dropdown" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Handler_Input" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "Build_A_New_Image_Radiobutton" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "Use_An_Existing_Image_Radiobutton" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Image_Name_Input" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Resulting_Image_Input" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Build_Commands_Text_Area" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Base_Image_Input" element visibility in "Code_Accordion" on "New_Function" wizard
        When collapse "Code_Accordion" on "New_Function" wizard
        Then verify "Volumes_Subheader" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Volume_Paths_Table" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Request_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Limit_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Request_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Request_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Limit_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Request_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "GPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        When collapse "Resources_Accordion" on "New_Function" wizard
        Then verify "Function_Environment_Variables_Table" element visibility in "Environment_Variables_Accordion" on "New_Function" wizard
        When collapse "Environment_Variables_Accordion" on "New_Function" wizard
        Then verify "Access_Key_Checkbox" element visibility on "New_Function" wizard
        Then verify "Cancel_Button" element visibility on "New_Function" wizard
        Then verify "Save_Button" element visibility on "New_Function" wizard
        Then verify "Create_Button" element visibility on "New_Function" wizard

    @MLPM
    @passive
    @smoke
    Scenario: MLPM009 - Check all mandatory components on Create ML Function - Serving runtime
        Given open url
        And wait load page
        When turn on demo mode with query params "false"
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Quick_Actions" element visibility on "Project" wizard
        Then verify "Quick_Actions" dropdown element on "Project" wizard should contains "Project"."Quick_Actions_Options_Demo"
        When turn on demo mode with query params "false"
        And wait load page
        Then select "ML function" option in "Quick_Actions" dropdown on "Project" wizard
        Then "Title" element on "Create_ML_Function_Popup" should contains "Create new function" value
        And verify "Cross_Cancel_Button" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Name_Input" element visibility on "Create_ML_Function_Popup" wizard
        Then type value "   " to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Name_Input" on "Create_ML_Function_Popup" wizard should display options "Input_Hint"."Function_Name_Hint"
        Then click on "Title" element on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Name_Input" options rules on "Create_ML_Function_Popup" wizard
        Then type value "   " to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Tag_Input" on "Create_ML_Function_Popup" wizard should display options "Input_Hint"."Function_Tag_Hint"
        Then click on "Title" element on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Tag_Input" options rules on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Runtime_Dropdown" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "Continue_Button" element visibility on "Create_ML_Function_Popup" wizard
        And type value "demo-function-02" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        And type value "latest" to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        And select "Serving" option in "New_Function_Runtime_Dropdown" dropdown on "Create_ML_Function_Popup" wizard
        And click on "Continue_Button" element on "Create_ML_Function_Popup" wizard
        Then verify "Function_Description_Input" element visibility in "General_Accordion" on "New_Function" wizard
        Then verify "Labels_Table" element visibility in "General_Accordion" on "New_Function" wizard
        When collapse "General_Accordion" on "New_Function" wizard
        Then verify "New_Function_Code_Entry_Dropdown" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Default_Class_Input" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "Build_A_New_Image_Radiobutton" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "Use_An_Existing_Image_Radiobutton" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Image_Name_Input" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Resulting_Image_Input" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Build_Commands_Text_Area" element visibility in "Code_Accordion" on "New_Function" wizard
        Then verify "New_Function_Base_Image_Input" element visibility in "Code_Accordion" on "New_Function" wizard
        When collapse "Code_Accordion" on "New_Function" wizard
        Then verify "Volumes_Subheader" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Volume_Paths_Table" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Limit_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Request_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "Memory_Request_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Request_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Request_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Limit_Dropdown" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "CPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        Then verify "GPU_Limit_Number_Input" element visibility in "Resources_Accordion" on "New_Function" wizard
        When collapse "Resources_Accordion" on "New_Function" wizard
        Then verify "Function_Environment_Variables_Demo_Table" element visibility in "Environment_Variables_Accordion" on "New_Function" wizard
        When collapse "Environment_Variables_Accordion" on "New_Function" wizard
        Then verify "Topology_Router_Type_Dropdown" element visibility in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then verify "Serving_Runtime_Configuration_Model_Table" element visibility in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then verify "Model_Tracking_Checkbox" element visibility in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then verify "Secrets_Runtime_Configuration_Table" element visibility in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then verify "Stream_Path_Input" element visibility in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then verify "Stream_Path_Input" element in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard should display hint "Input_Hint"."Stream_Path_Hint"
        Then verify "Parameters_Runtime_Configuration_Table" element visibility in "Serving_Runtime_Configuration_Accordion" on "New_Function" wizard
        Then verify "Access_Key_Checkbox" element visibility on "New_Function" wizard
        Then verify "Cancel_Button" element visibility on "New_Function" wizard
        Then verify "Save_Button" element visibility on "New_Function" wizard
        # Deploy button available for Serving function 
        # Then verify "Deploy_Button" element visibility on "New_Function" wizard

    @MLPM
    @passive
    @smoke
    Scenario: MLPM010 - Check all mandatory components on Create New Feature Set
        Given open url
        And wait load page
        When turn on demo mode with query params "false"
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Quick_Actions" element visibility on "Project" wizard
        Then verify "Quick_Actions" dropdown element on "Project" wizard should contains "Project"."Quick_Actions_Options_Demo"
        Then select "Feature set" option in "Quick_Actions" dropdown on "Project" wizard
        Then verify "Cross_Close_Button" element visibility on "New_Feature_Set" wizard
        Then verify "Feature_Set_Name_Input" element visibility on "New_Feature_Set" wizard
        Then verify "Version_Input" element visibility on "New_Feature_Set" wizard
        Then verify "Description_Input" element visibility on "New_Feature_Set" wizard
        Then verify "Labels_Table" element visibility on "New_Feature_Set" wizard
        Then verify "Accordion_Header" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Collapse_Button" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Attributes_Input" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then type value "   " to "Attributes_Input" field on "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Attributes_Input" element in "Data_Source_Accordion" on "New_Feature_Set" wizard should display hover warning "Input_Hint"."Input_Field_Invalid"
        When click on "Edit_Button" element in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "URL_Combobox" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then select "V3IO" option in "URL_Combobox" combobox on "Data_Source_Accordion" accordion on "New_Feature_Set" wizard
        When type value "target/path" to "URL_Combobox" field on "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then click on "Apply_Combobox_Button" element in "Data_Source_Accordion" on "New_Feature_Set" wizard
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
        Then verify "Cancel_Button" element visibility on "New_Feature_Set" wizard
        Then verify "Save_Button" element visibility on "New_Feature_Set" wizard
        Then verify "Save_And_Ingest_Button" element visibility on "New_Feature_Set" wizard

    @MLPM
    @passive
    @smoke
    Scenario: MLPM011 - Check the redirection from Models counter to Models page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "Model_Stats_Counter" element in "Models_Stats_Container" on "Project" wizard
        And wait load page
        Then verify "Table_Name_Filter_Input" element visibility on "Models" wizard
        Then click on "Table_FilterBy_Button" element on "Models" wizard
        Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Table_Tree_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Show_Iterations_Checkbox" element visibility on "FilterBy_Popup" wizard
        Then verify "Table_Refresh_Button" element visibility on "Models" wizard
        Then verify "Models_Table" element visibility on "Models" wizard
        When turn on demo mode with query params "true"
        And wait load page
        Then verify "Register_Model_Button" element visibility on "Models" wizard
        Then "Register_Model_Button" element on "Models" should contains "Register model" value

    @MLPM
    @passive
    @smoke
    #TODO: Create Feature set from the Quick Actions dropdown menu
    Scenario: MLPM012 - Check the redirection to Feature sets page during creating the Feature set
        Given open url
        And wait load page
        When turn on demo mode with query params "false"
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then select "Feature set" option in "Quick_Actions" dropdown on "Project" wizard
        And wait load page
        Then verify "Cross_Close_Button" element visibility on "New_Feature_Set" wizard
        Then verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        Then verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_FilterBy_Button" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Table_Tree_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Table_Tree_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Tag_Filer_Options"
        Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
        Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element on "FilterBy_Popup" wizard is disabled
        Then click on "Table_FilterBy_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        Then type value "   " to "Table_Name_Filter_Input" field on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Name_Filter_Input" on "Feature_Store_Feature_Sets_Tab" wizard should display hover warning "Input_Hint"."Input_Field_Invalid"
        Then click on "Table_FilterBy_Button" element on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then type value "   " to "Table_Label_Filter_Input" field on "FilterBy_Popup" wizard
        Then verify "Table_Label_Filter_Input" on "FilterBy_Popup" wizard should display hover warning "Input_Hint"."Input_Field_Invalid"
        Then verify "Feature_Sets_Table" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Feature_Store_Tab_Selector" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Create_Set_Button" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" should contains "Create set" value

    @MLPM
    @passive
    @smoke
    Scenario: MLPM013 - Check the redirection from Other artifacts counter to Artifacts page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "Other_Artifacts_Counter_Number" element in "Artifacts_Stats_Container" on "Project" wizard
        And wait load page
        Then verify "Table_Name_Filter_Input" element visibility on "Files" wizard
        Then click on "Table_FilterBy_Button" element on "Files" wizard
        Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Table_Tree_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Show_Iterations_Checkbox" element visibility on "FilterBy_Popup" wizard
        Then verify "Table_Refresh_Button" element visibility on "Files" wizard
        Then verify "Files_Table" element visibility on "Files" wizard
        Then verify "Register_File_Button" element visibility on "Files" wizard
        Then "Register_File_Button" element on "Files" should contains "Register artifact" value
    
    @MLPM
    @passive
    @smoke
    Scenario: MLPM024 - Check the redirection from Datasets counter to Datasets page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "Datasets_Counter_Number" element in "Artifacts_Stats_Container" on "Project" wizard
        And wait load page
        Then verify "Table_Name_Filter_Input" element visibility on "Datasets" wizard
        Then verify "Table_FilterBy_Button" element visibility on "Datasets" wizard
        Then click on "Table_FilterBy_Button" element on "Datasets" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
        Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Table_Tree_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Table_Tree_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Tag_Filer_Options_Main_Table"
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then verify "Show_Iterations_Checkbox" element visibility on "FilterBy_Popup" wizard
        Then "Checkbox_Label" element on "FilterBy_Popup" should contains "Show best iteration only" value
        Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Table_Refresh_Button" element visibility on "Datasets" wizard
        Then verify "Datasets_Table" element visibility on "Datasets" wizard
    
    @MLPM
    @passive
    @smoke
    Scenario: MLPM025 - Check the redirection from Documents counter to Documents page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "Documents_Counter_Number" element in "Artifacts_Stats_Container" on "Project" wizard
        And wait load page
        Then verify "Table_Name_Filter_Input" element visibility on "Documents" wizard
        Then verify "Table_FilterBy_Button" element visibility on "Documents" wizard
        Then verify "Table_FilterBy_Button" element on "Documents" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button"
        Then click on "Table_FilterBy_Button" element on "Documents" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
        Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
        Then verify "Table_Tree_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Table_Tree_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Tag_Filer_Options_Main_Table"
        Then click on "Title" element on "FilterBy_Popup" wizard
        Then verify "Show_Iterations_Checkbox" element visibility on "FilterBy_Popup" wizard
        Then "Checkbox_Label" element on "FilterBy_Popup" should contains "Show best iteration only" value
        Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Clear_Button" element on "FilterBy_Popup" wizard is disabled
        Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
        Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
        Then verify "Table_Refresh_Button" element visibility on "Documents" wizard
        Then verify "Table_Refresh_Button" element on "Documents" wizard should display hover tooltip "Common_Tooltips"."Refresh_Button"
        Then verify "Documents_Table" element visibility on "Documents" wizard
    
    @MLPM
    @passive
    @smoke
    #TODO: Add components check on LLM prompts page
    Scenario: MLPM026 - Check the redirection from LLM prompts counter to LLM prompts page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "LLM_Prompts_Counter_Number" element in "Artifacts_Stats_Container" on "Project" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "LLM prompts" value
        Then verify redirection to "projects/default/llm-prompts?bePage=1&fePage=1"

    @MLPM
    @passive
    @smoke
    Scenario: MLPM014 - Check Project Counter redirection to Monitor Jobs tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "In_Process_Counter_Subtitle" element in "Runs_Statistic_Section_Container" on "Project" wizard
        And wait load page
        Then verify "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard should contains "Jobs_And_Workflows"."Tab_List"
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitor_Tab" wizard selected option value "Any time"
        Then verify "Table_FilterBy_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitor_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "4 items selected"
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        And wait load page
        Then click on "Status_Filter_Element" element on "FilterBy_Popup" wizard
        Then "Status_All_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Aborting_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Status_Jobs_Running_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Status_Pending_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Status_Pending_retry_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Status_Aborted_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Jobs_Error_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Status_Jobs_Completed_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then verify "Batch_Run_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then "Batch_Run_Button" element on "Jobs_Monitor_Tab" should contains "Batch run" value
        Then verify "Resource_Monitoring_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Auto_Refresh_Checkbox" element visibility on "Jobs_Monitor_Tab" wizard
        Then "Auto_Refresh_Checkbox" element should be unchecked on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Jobs_Monitor_Table" element visibility on "Jobs_Monitor_Tab" wizard
        Then navigate back
        And wait load page
        When click on "Failed_Counter_Subtitle" element in "Runs_Statistic_Section_Container" on "Project" wizard
        And wait load page
        Then verify "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard should contains "Jobs_And_Workflows"."Tab_List"
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitor_Tab" wizard selected option value "Past 24 hours"
        Then verify "Table_FilterBy_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitor_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Aborted, Error"
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Batch_Run_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then "Batch_Run_Button" element on "Jobs_Monitor_Tab" should contains "Batch run" value
        Then verify "Resource_Monitoring_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Auto_Refresh_Checkbox" element visibility on "Jobs_Monitor_Tab" wizard
        Then "Auto_Refresh_Checkbox" element should be unchecked on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then navigate back
        And wait load page
        When click on "Succeeded_Counter_Subtitle" element in "Runs_Statistic_Section_Container" on "Project" wizard
        And wait load page
        Then verify "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard should contains "Jobs_And_Workflows"."Tab_List"
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Jobs_Monitor_Tab" wizard selected option value "Past 24 hours"
        Then verify "Table_FilterBy_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Jobs_Monitor_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Completed"
        Then verify "Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Batch_Run_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then "Batch_Run_Button" element on "Jobs_Monitor_Tab" should contains "Batch run" value
        Then verify "Resource_Monitoring_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Auto_Refresh_Checkbox" element visibility on "Jobs_Monitor_Tab" wizard
        Then "Auto_Refresh_Checkbox" element should be unchecked on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Jobs_Monitor_Tab" wizard
        
    @MLPM
    @passive
    @smoke
    Scenario: MLPM015 - Check the redirection from Scheduled counter to Schedule tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "Scheduled_Stats_Counter" element in "Scheduled_Stats_Container" on "Project" wizard
        And wait load page
        Then verify "Schedule" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Schedule_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Schedule_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Schedule_Monitor_Tab" wizard selected option value "Next 24 hours"
        Then verify "Table_FilterBy_Button" element visibility on "Schedule_Monitor_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Schedule_Monitor_Tab" wizard
        Then verify "Type_Filter_Dropdown_Schedule" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then click on "Type_Filter_Element" element on "FilterBy_Popup" wizard
        And wait load page
        Then "Type_All_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Type_Job_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Type_Workflow_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Type_Spark_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Type_Horovod_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Type_Dask_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Type_Databricks_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then click on "Type_Filter_Element" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Batch_Run_Button" element visibility on "Schedule_Monitor_Tab" wizard
        Then "Batch_Run_Button" element on "Schedule_Monitor_Tab" should contains "Batch run" value
        Then verify "Table_Refresh_Button" element visibility on "Schedule_Monitor_Tab" wizard
        Then verify "Schedule_Monitor_Table" element visibility on "Schedule_Monitor_Tab" wizard
        Then navigate back
        And wait load page
        When click on "Jobs_Counter_Number" element in "Scheduled_Stats_Container" on "Project" wizard
        And wait load page
        Then verify "Schedule" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Schedule_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Schedule_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Schedule_Monitor_Tab" wizard selected option value "Next 24 hours"
        Then verify "Table_FilterBy_Button" element visibility on "Schedule_Monitor_Tab" wizard
        Then verify "Table_FilterBy_Button" element on "Schedule_Monitor_Tab" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button_1"
        Then click on "Table_FilterBy_Button" element on "Schedule_Monitor_Tab" wizard
        Then verify "Type_Filter_Dropdown_Schedule" dropdown on "FilterBy_Popup" wizard selected option value "5 items selected"
        Then click on "Type_Filter_Element" element on "FilterBy_Popup" wizard
        And wait load page
        Then "Type_All_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Type_Job_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Type_Workflow_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Type_Spark_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Type_Horovod_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Type_Dask_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Type_Databricks_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then click on "Type_Filter_Element" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Batch_Run_Button" element visibility on "Schedule_Monitor_Tab" wizard
        Then "Batch_Run_Button" element on "Schedule_Monitor_Tab" should contains "Batch run" value
        Then verify "Table_Refresh_Button" element visibility on "Schedule_Monitor_Tab" wizard
        Then verify "Schedule_Monitor_Table" element visibility on "Schedule_Monitor_Tab" wizard
        Then click on breadcrumbs "project" label on "commonPagesHeader" wizard
        And wait load page
        When click on "Workflows_Counter_Number" element in "Scheduled_Stats_Container" on "Project" wizard
        And wait load page
        Then verify "Schedule" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Schedule_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Schedule_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Schedule_Monitor_Tab" wizard selected option value "Next 24 hours"
        Then verify "Table_FilterBy_Button" element visibility on "Schedule_Monitor_Tab" wizard
        Then verify "Table_FilterBy_Button" element on "Schedule_Monitor_Tab" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button_1"
        Then click on "Table_FilterBy_Button" element on "Schedule_Monitor_Tab" wizard
        Then verify "Type_Filter_Dropdown_Schedule" dropdown on "FilterBy_Popup" wizard selected option value "Workflow"
        Then click on "Type_Filter_Element" element on "FilterBy_Popup" wizard
        And wait load page
        Then "Type_All_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Type_Job_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Type_Workflow_Checkbox" element should be checked on "FilterBy_Popup" wizard
        Then "Type_Spark_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Type_Horovod_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Type_Dask_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then "Type_Databricks_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
        Then click on "Type_Filter_Element" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Batch_Run_Button" element visibility on "Schedule_Monitor_Tab" wizard
        Then "Batch_Run_Button" element on "Schedule_Monitor_Tab" should contains "Batch run" value
        Then verify "Table_Refresh_Button" element visibility on "Schedule_Monitor_Tab" wizard
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
        Then "No_Data_Message" component on "commonPagesHeader" should be equal "No_Data_Message"."Common_Message_Scheduled_Type"

    @MLPM
    @passive
    @smoke
    Scenario: MLPM027 - Check the redirection from Workflows counter to Monitor Workflows tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "Workflows_Stats_Counter" element in "Workflows_Stats_Container" on "Project" wizard
        And wait load page
        Then verify "Monitor Workflows" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Workflows_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Workflows_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Schedule_Monitor_Tab" wizard selected option value "Past 24 hours"
        Then verify "Table_FilterBy_Button" element visibility on "Workflows_Monitor_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Workflows_Monitor_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Table_Refresh_Button" element visibility on "Workflows_Monitor_Tab" wizard
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
        Then "No_Data_Message" component on "commonPagesHeader" should be equal "No_Data_Message"."Common_Message_Monitoring_Workflow"
        Then navigate back
        And wait load page
        When click on "In_Process_Counter_Number" element in "Workflows_Stats_Container" on "Project" wizard
        And wait load page
        Then verify "Monitor Workflows" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Workflows_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Workflows_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Schedule_Monitor_Tab" wizard selected option value "Any time"
        Then verify "Table_FilterBy_Button" element visibility on "Workflows_Monitor_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Workflows_Monitor_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Running, Terminating"
        Then verify "Table_Refresh_Button" element visibility on "Workflows_Monitor_Tab" wizard
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
        Then "No_Data_Message" component on "commonPagesHeader" should be equal "No_Data_Message"."Common_Message_Monitoring_Workflow_Status"
        Then click on breadcrumbs "project" label on "commonPagesHeader" wizard
        And wait load page
        When click on "Failed_Counter_Number" element in "Workflows_Stats_Container" on "Project" wizard
        And wait load page
        Then verify "Monitor Workflows" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Workflows_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Workflows_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Schedule_Monitor_Tab" wizard selected option value "Past 24 hours"
        Then verify "Table_FilterBy_Button" element visibility on "Workflows_Monitor_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Workflows_Monitor_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Error, Failed"
        Then verify "Table_Refresh_Button" element visibility on "Workflows_Monitor_Tab" wizard
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
        Then "No_Data_Message" component on "commonPagesHeader" should be equal "No_Data_Message"."Common_Message_Jobs_Monitoring_Status"
        Then navigate back
        And wait load page
        When click on "Succeeded_Counter_Number" element in "Workflows_Stats_Container" on "Project" wizard
        And wait load page
        Then verify "Monitor Workflows" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Workflows_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Workflows_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Schedule_Monitor_Tab" wizard selected option value "Past 24 hours"
        Then verify "Table_FilterBy_Button" element visibility on "Workflows_Monitor_Tab" wizard
        Then click on "Table_FilterBy_Button" element on "Workflows_Monitor_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Completed"
        Then verify "Table_Refresh_Button" element visibility on "Workflows_Monitor_Tab" wizard
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
        Then "No_Data_Message" component on "commonPagesHeader" should be equal "No_Data_Message"."Common_Message_Jobs_Monitoring_Status"

    @MLPM
    @passive
    @smoke
    #TODO: Add components check on LLM prompts page
    Scenario: MLPM028 - Check the redirection from Monitoring App counter to Monitoring app page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "Monitoring_App_Running_Stats_Counter" element in "Monitoring_App_Stats_Container" on "Project" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
        Then verify redirection to "projects/default/monitoring-app"
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Monitoring_App" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Monitoring_App" wizard selected option value "Past 24 hours"
        Then verify "Refresh_Button" element visibility on "Monitoring_App" wizard
        Then navigate back
        And wait load page
        When click on "Monitoring_App_Failed_Stats_Counter" element in "Monitoring_App_Stats_Container" on "Project" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
        Then verify redirection to "projects/default/monitoring-app"
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Monitoring_App" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Monitoring_App" wizard selected option value "Past 24 hours"
        Then verify "Refresh_Button" element visibility on "Monitoring_App" wizard

    @MLPM
    @passive
    @smoke
    Scenario: MLPM022 - Verify behaviour of Breadcrumbs menu
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify breadcrumbs "project" label should be equal "churn-project-admin" value
        Then select "project" with "default" value in breadcrumbs menu
        Then verify breadcrumbs "project" label should be equal "default" value
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Models" value
        Then verify "Models_Table" element visibility on "Models" wizard
        Then select "tab" with "Feature store" value in breadcrumbs menu
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Feature store" value
        Then verify "Feature_Sets_Table" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then select "tab" with "Artifacts" value in breadcrumbs menu
        And wait load page

    @MLPM
    @passive
    @smoke
    Scenario: MLPM016 - Check redirect to Jobs and workflows page using All jobs link
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify breadcrumbs "project" label should be equal "default" value
        Then select "Batch run" option in "Quick_Actions" dropdown on "Project" wizard
        And wait load page
        And click on row root with value "test" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        And wait load page
        And click on "Run_Button" element on "Modal_Wizard_Form" wizard
        And wait load page
        And click on "Batch_Run_Button" element on "Jobs_Monitor_Tab" wizard
        And wait load page
        And click on row root with value "test-func" in "name" column in "Functions_Table" table on "Modal_Wizard_Form" wizard
        And wait load page
        Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
        And wait load page
        And click on "Run_Button" element on "Modal_Wizard_Form" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on "Project_Monitoring_Button" element on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify "Recent_Text" element visibility in "Runs_Statistic_Section_Container" on "Project" wizard
        Then verify "Quick_Actions" dropdown element on "Project" wizard should contains "Project"."Quick_Actions_Options"
        Then verify "All_Jobs_Link" element visibility in "Runs_Statistic_Section_Container" on "Project" wizard
        When click on "All_Jobs_Link" element in "Runs_Statistic_Section_Container" on "Project" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Jobs and workflows" value
        Then verify "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard should contains "Jobs_And_Workflows"."Tab_List"
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "Batch_Run_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then "Batch_Run_Button" element on "Jobs_Monitor_Tab" should contains "Batch run" value
        Then verify "Resource_Monitoring_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Name_Filter_Input" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_FilterBy_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Jobs_Monitor_Table" element visibility on "Jobs_Monitor_Tab" wizard

    @MLPM
    @passive
    @smoke
    Scenario: MLPM017 - Check redirect to Job Info Pane overview from Project Monitoring Page
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And save to context "name" column and "href" attribute on 1 row from "Runs_Statistic_Table" table on "Project" wizard
        When click on cell with row index 1 in "name" column in "Runs_Statistic_Table" table on "Project" wizard
        And wait load page
        Then verify "Arrow_Back" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Header" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Updated" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Cross_Close_Button" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" element visibility on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Tab_List"
        Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Jobs_Monitor_Tab_Info_Pane" wizard
        Then verify "Overview_Headers" on "Jobs_Monitor_Tab_Info_Pane" wizard should contains "Jobs_Monitor_Tab_Info_Pane"."Overview_Headers"
        Then compare "Header" element value on "Jobs_Monitor_Tab_Info_Pane" wizard with test "name" context value
        Then verify redirection to "projects/default/jobs/monitor-jobs/erann-test/1d3a8b0833b74f55b008537b1e19ea57/overview?bePage=1&fePage=1"

    @MLPM
    @passive
    @smoke
    Scenario: MLPM018 - Check all mandatory components on Consumer Groups tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "ConsumerGroups_Stats_Counter" element in "Realtime_Functions_Nuclio_Statistic_Section" on "Project" wizard
        And wait load page
        Then "Title" element on "Consumer_Groups" should contains "Consumer groups (v3io stream)" value
        Then "Description" element on "Consumer_Groups" should contains "This report displays the project's consumer groups for Iguazio v3io streams" value
        Then verify "Arrow_Back" element visibility on "Consumer_Groups" wizard
        Then verify "Search_Input" element visibility on "Consumer_Groups" wizard
        Then verify "Consumer_Groups_Table" element visibility on "Consumer_Groups" wizard
        Then click on "Arrow_Back" element on "Consumer_Groups" wizard
        And wait load page
        Then verify breadcrumbs "project" label should be equal "default" value
        Then verify "Quick_Actions" element visibility on "Project" wizard
        Then verify "Refresh_Button" element visibility on "Project" wizard
        Then verify "Realtime_Functions_Nuclio_Table" element visibility on "Project" wizard
        Then verify "Runs_Statistic_Table" element visibility on "Project" wizard
        Then verify "Mono_Values_Cards" element visibility on "Project" wizard

    @MLPM
    @passive
    @smoke
    Scenario: MLPM019 - Verify filtering by name on Consumer Groups tab
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "ConsumerGroups_Stats_Counter" element in "Realtime_Functions_Nuclio_Statistic_Section" on "Project" wizard
        And wait load page
        Then verify "Search_Input" element visibility on "Consumer_Groups" wizard
        Then verify "Consumer_Groups_Table" element visibility on "Consumer_Groups" wizard
        Then type value "c" to "Search_Input" field on "Consumer_Groups" wizard
        Then value in "consumer_group_name" column with "text" in "Consumer_Groups_Table" on "Consumer_Groups" wizard should contains "C"
        Then type value "consumer" to "Search_Input" field on "Consumer_Groups" wizard
        Then value in "consumer_group_name" column with "text" in "Consumer_Groups_Table" on "Consumer_Groups" wizard should contains "Consumer"
        Then type value "randomtext" to "Search_Input" field on "Consumer_Groups" wizard
        Then check "ConsumerGroup1" value not in "consumer_group_name" column in "Consumer_Groups_Table" table on "Consumer_Groups" wizard

    @MLPM
    @passive
    @smoke
    Scenario: MLPM020 - Verify all mandatory components on Consumer Groups drill-down
        Given open url
        And wait load page
        And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "ConsumerGroups_Stats_Counter" element in "Realtime_Functions_Nuclio_Statistic_Section" on "Project" wizard
        And wait load page
        And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
        Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."No_Consumer_Group_Yet"
        Then select "project" with "default" value in breadcrumbs menu
        And wait load page
        When click on "ConsumerGroups_Stats_Counter" element in "Realtime_Functions_Nuclio_Statistic_Section" on "Project" wizard
        And wait load page
        And wait load page
        And save to context "consumer_group_name" column and "href" attribute on 1 row from "Consumer_Groups_Table" table on "Consumer_Groups" wizard
        And click on cell with row index 1 in "consumer_group_name" column in "Consumer_Groups_Table" table on "Consumer_Groups" wizard
        And wait load page
        Then compare current browser URL with test "href" context value
        Then compare "Title" element value on "Consumer_Groups" wizard with test "consumer_group_name" context value
        Then verify "Arrow_Back" element visibility on "Consumer_Groups" wizard
        Then verify "Search_Input" element visibility on "Consumer_Groups" wizard
        Then verify "Refresh_Button" element visibility on "Consumer_Groups" wizard
        Then verify "Shard_Lags_Table" element visibility on "Consumer_Groups" wizard
        Then click on "Arrow_Back" element on "Consumer_Groups" wizard
        And wait load page
        Then verify "Consumer_Groups_Table" element visibility on "Consumer_Groups" wizard
        Then "Title" element on "Consumer_Groups" should contains "Consumer groups (v3io stream)" value
        Then "Description" element on "Consumer_Groups" should contains "This report displays the project's consumer groups for Iguazio v3io streams" value
    
    @MLPM
    @smoke
    Scenario: MLPM021 - Verify filtering by name on Consumer Groups drill-down
        Given open url
        And wait load page
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "ConsumerGroups_Stats_Counter" element in "Realtime_Functions_Nuclio_Statistic_Section" on "Project" wizard
        And wait load page
        And click on cell with row index 1 in "consumer_group_name" column in "Consumer_Groups_Table" table on "Consumer_Groups" wizard
        And wait load page
        Then verify "Search_Input" element visibility on "Consumer_Groups" wizard
        Then verify "Shard_Lags_Table" element visibility on "Consumer_Groups" wizard
        Then type value "shard" to "Search_Input" field on "Consumer_Groups" wizard
        Then click on "Refresh_Button" element on "Consumer_Groups" wizard
        Then value in "shard_name" column with "text" in "Shard_Lags_Table" on "Consumer_Groups" wizard should contains "shard"
        Then type value "shard-id-0" to "Search_Input" field on "Consumer_Groups" wizard
        Then value in "shard_name" column with "text" in "Shard_Lags_Table" on "Consumer_Groups" wizard should contains "shard-id-0"
        Then type value "randomtext" to "Search_Input" field on "Consumer_Groups" wizard
        Then check "shard-id-0" value not in "shard_name" column in "Shard_Lags_Table" table on "Consumer_Groups" wizard

    @MLPM
    @smoke
    Scenario: MLPM023 - Check all mandatory components on Alerts page
        Given open url
        And wait load page
        And click on row root with value "auto-generated-data" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "Alerts_Stats_Counter" element in "Alerts_Stats_Container" on "Project" wizard
        And wait load page
        Then verify "Search_By_Name_Filter_Input" element visibility on "Alerts" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Alerts" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Alerts" wizard selected option value "Past 24 hours"
        Then verify "Date_Picker_Filter_Dropdown" dropdown element on "Alerts" wizard should contains "Dropdown_Options"."Date_Picker_Filter_Options"
        When select "Any time" option in "Date_Picker_Filter_Dropdown" filter dropdown on "Alerts" wizard
        And wait load page
        Then verify "Alerts_Table" element visibility on "Alerts" wizard
        Then verify "Table_FilterBy_Button" element visibility on "Alerts" wizard
        Then verify "Table_FilterBy_Button" element on "Alerts" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button"
        Then verify "Refresh_Button" element visibility on "Alerts" wizard
        Then verify "Refresh_Button" element on "Alerts" wizard should display hover tooltip "Common_Tooltips"."Refresh_Button"
        Then click on "Table_FilterBy_Button" element on "Alerts" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
        Then verify "Entity_Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Entity_Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Severity_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Severity_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Event_Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Event_Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then click on breadcrumbs "project" label on "commonPagesHeader" wizard
        And wait load page
        When click on "Alerts_Stats_Endpoint_Counter" element in "Alerts_Stats_Container" on "Project" wizard
        And wait load page
        Then verify "Search_By_Name_Filter_Input" element visibility on "Alerts" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Alerts" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Alerts" wizard selected option value "Past 24 hours"
        Then verify "Date_Picker_Filter_Dropdown" dropdown element on "Alerts" wizard should contains "Dropdown_Options"."Date_Picker_Filter_Options"
        Then verify "Table_FilterBy_Button" element on "Alerts" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button_1"
        Then click on "Table_FilterBy_Button" element on "Alerts" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
        Then verify "Entity_Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Entity_Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Endpoint"
        Then verify "Entity_Type_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Entity_Type_Filter_Options"
        Then click on "Title" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Severity_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Severity_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Severity_Filter_Options"
        Then click on "Title" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Event_Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Event_Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then click on breadcrumbs "project" label on "commonPagesHeader" wizard
        And wait load page
        When click on "Alerts_Stats_Jobs_Counter" element in "Alerts_Stats_Container" on "Project" wizard
        And wait load page
        Then verify "Search_By_Name_Filter_Input" element visibility on "Alerts" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Alerts" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Alerts" wizard selected option value "Past 24 hours"
        Then verify "Date_Picker_Filter_Dropdown" dropdown element on "Alerts" wizard should contains "Dropdown_Options"."Date_Picker_Filter_Options"
        Then verify "Table_FilterBy_Button" element on "Alerts" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button_1"
        Then click on "Table_FilterBy_Button" element on "Alerts" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
        Then verify "Entity_Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Entity_Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Job"
        Then verify "Entity_Type_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Entity_Type_Filter_Options"
        Then verify "Alerts_Table" element visibility on "Alerts" wizard
        Then verify "Severity_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Severity_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Severity_Filter_Options"
        Then click on "Title" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Event_Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Event_Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then click on breadcrumbs "project" label on "commonPagesHeader" wizard
        And wait load page
        When click on "Alerts_Stats_Application_Counter" element in "Alerts_Stats_Container" on "Project" wizard
        And wait load page
        Then verify "Search_By_Name_Filter_Input" element visibility on "Alerts" wizard
        Then verify "Date_Picker_Filter_Dropdown" element visibility on "Alerts" wizard
        Then verify "Date_Picker_Filter_Dropdown" dropdown on "Alerts" wizard selected option value "Past 24 hours"
        Then verify "Date_Picker_Filter_Dropdown" dropdown element on "Alerts" wizard should contains "Dropdown_Options"."Date_Picker_Filter_Options"
        Then verify "Table_FilterBy_Button" element on "Alerts" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button_1"
        Then click on "Table_FilterBy_Button" element on "Alerts" wizard
        Then "Title" element on "FilterBy_Popup" should contains "Filter by" value
        Then verify "Entity_Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Entity_Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "Application"
        Then verify "Entity_Type_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Entity_Type_Filter_Options"
        Then verify "Severity_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
        Then verify "Severity_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Severity_Filter_Options"
        Then click on "Title" element on "FilterBy_Popup" wizard
        And wait load page
        Then verify "Event_Type_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
        Then verify "Event_Type_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected option value "All"
