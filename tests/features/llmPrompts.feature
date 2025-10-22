Feature: LLM prompts Page

    Testcases that verifies functionality on LLM prompts Page
    
  @MLLP
  @smoke
  Scenario: MLLP001 - Check components on LLM prompts page
    Given open url
    And wait load page
    And click on row root with value "llmdeploy332" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "llmdeploy332" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "LLM prompts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "LLM prompts" value
    Then verify redirection to "projects/llmdeploy332/llm-prompts?bePage=1&fePage=1"
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Project monitoring" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    And wait load page
    And select "tab" with "LLM prompts" value in breadcrumbs menu
    And wait load page
    Then verify redirection to "projects/llmdeploy332/llm-prompts?bePage=1&fePage=1"
    Then verify breadcrumbs "tab" label should be equal "LLM prompts" value
    Then verify "Search_By_Name_Filter_Input" element visibility on "LLM_Prompts" wizard
    Then verify "LLMPrompts_Table" element visibility on "LLM_Prompts" wizard
    Then verify "Table_FilterBy_Button" element visibility on "LLM_Prompts" wizard
    Then verify "Table_FilterBy_Button" element on "LLM_Prompts" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button"
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    And wait load page
    Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
    Then verify "Table_Tree_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
    Then verify "Table_Tree_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected attribute option value "latest"
    Then verify "Model_Name_Filter_Input" element visibility on "FilterBy_Popup" wizard
    Then verify "Model_Version_Tag_Filter_Input" element visibility on "FilterBy_Popup" wizard
    Then verify "Model_Version_Tag_Filter_Field" element on "FilterBy_Popup" wizard is disabled by class name
    Then verify "Model_Version_Tag_Filter_Tip" element visibility on "FilterBy_Popup" wizard
    Then verify "Model_Version_Tag_Filter_Tip" element on "FilterBy_Popup" wizard should display hover hint "Label_Hint"."Model_Version_Tag"
    Then verify "Show_Iterations_Checkbox" element visibility on "FilterBy_Popup" wizard
    Then "Show_Iterations_Checkbox" element should be checked on "FilterBy_Popup" wizard
    Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
    Then verify "Clear_Button" element on "FilterBy_Popup" wizard is disabled
    Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
    Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
    Then uncheck "Show_Iterations_Checkbox" element on "FilterBy_Popup" wizard
    And wait load page
    Then verify "Apply_Button" element on "FilterBy_Popup" wizard is enabled
    Then verify "Clear_Button" element on "FilterBy_Popup" wizard is enabled
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    And wait load page
    Then "Show_Iterations_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
    Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
    Then verify "Clear_Button" element on "FilterBy_Popup" wizard is enabled
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    And wait load page
    Then verify "LLMPrompts_Table" element visibility on "LLM_Prompts" wizard
    Then verify "Refresh_Button" element visibility on "LLM_Prompts" wizard
    Then verify "Refresh_Button" element on "LLM_Prompts" wizard should display hover tooltip "Common_Tooltips"."Refresh_Button"
    Then verify "Table_FilterBy_Button" element on "LLM_Prompts" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button_1"
    Then verify "BE_Pagination_Navigate_Prev" element visibility on "Pagination_Info_Pane" wizard
    Then verify "BE_Pagination_Navigate_Prev" element on "Pagination_Info_Pane" wizard is disabled
    Then verify "BE_Pagination_Navigate_Next" element visibility on "Pagination_Info_Pane" wizard
    Then verify "BE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is disabled
    Then verify "FE_Pagination_Navigate_Next" element visibility on "Pagination_Info_Pane" wizard
    Then verify "FE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is disabled
    Then verify "FE_Pagination_Navigate_Prev" element visibility on "Pagination_Info_Pane" wizard
    Then verify "FE_Pagination_Navigate_Prev" element on "Pagination_Info_Pane" wizard is disabled
    Then verify "Pagination_Page_Number" element visibility on "Pagination_Info_Pane" wizard
    Then "Pagination_Page_Number" element on "Pagination_Info_Pane" should contains "1" value
    Then verify "Pagination_Count" element visibility on "Pagination_Info_Pane" wizard
    Then "Pagination_Count" element on "Pagination_Info_Pane" should contains "Showing 1 - 1" value

  @MLLP
  @smoke
  Scenario: MLLP002 - Verify searching by llm prompt name on LLM prompts page
    Given open url
    And wait load page
    And click on row root with value "auto-generated-data" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "auto-generated-data" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "LLM prompts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "LLM prompts" value
    Then verify redirection to "projects/auto-generated-data/llm-prompts?bePage=1&fePage=1"
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Project monitoring" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    And wait load page
    Then verify "LLM_Prompts_Counter_Subtitle" element visibility in "Artifacts_Stats_Container" on "Project" wizard
    Then "LLM_Prompts_Counter_Subtitle" element in "Artifacts_Stats_Container" on "Project" should contains "LLM prompt artifacts" value
    When click on "LLM_Prompts_Counter_Number" element in "Artifacts_Stats_Container" on "Project" wizard
    And wait load page
    Then verify redirection to "projects/auto-generated-data/llm-prompts?bePage=1&fePage=1"
    Then verify breadcrumbs "tab" label should be equal "LLM prompts" value
    Then verify "Search_By_Name_Filter_Input" element visibility on "LLM_Prompts" wizard
    Then type value "59" to "Search_By_Name_Filter_Input" field on "LLM_Prompts" wizard
    Then click on "Refresh_Button" element on "LLM_Prompts" wizard
    And wait load page
    Then value in "name" column with "text" in "LLMPrompts_Table" on "LLM_Prompts" wizard should contains "59"
    And wait load page
    Then type value "yyyy" to "Search_By_Name_Filter_Input" field on "LLM_Prompts" wizard
    Then click on "Refresh_Button" element on "LLM_Prompts" wizard
    And wait load page
    And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
    Then "No_Data_Message" component on "commonPagesHeader" should be equal "No_Data_Message"."Common_Message_LLM_Prompt_Name"

  @MLLP
  @smoke
  Scenario: MLLP003 - Verify filtering by llm prompt label on LLM prompts page
    Given open url
    And wait load page
    And click on row root with value "auto-generated-data" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "auto-generated-data" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "LLM prompts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "LLM prompts" value
    Then verify redirection to "projects/auto-generated-data/llm-prompts?bePage=1&fePage=1"
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Project monitoring" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    And wait load page
    Then verify "LLM_Prompts_Counter_Subtitle" element visibility in "Artifacts_Stats_Container" on "Project" wizard
    Then "LLM_Prompts_Counter_Subtitle" element in "Artifacts_Stats_Container" on "Project" should contains "LLM prompt artifacts" value
    When click on "LLM_Prompts_Counter_Number" element in "Artifacts_Stats_Container" on "Project" wizard
    And wait load page
    Then verify redirection to "projects/auto-generated-data/llm-prompts?bePage=1&fePage=1"
    Then verify breadcrumbs "tab" label should be equal "LLM prompts" value
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    Then type value "language" to "Table_Label_Filter_Input" field on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    Then type value "50" to "Search_By_Name_Filter_Input" field on "LLM_Prompts" wizard
    Then click on "Refresh_Button" element on "LLM_Prompts" wizard
    And wait load page
    Then value in "labels" column with "dropdowns" in "LLMPrompts_Table" on "LLM_Prompts" wizard should contains "language" in "Overlay"
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    Then type value "type=qa" to "Table_Label_Filter_Input" field on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    Then value in "labels" column with "text" in "LLMPrompts_Table" on "LLM_Prompts" wizard should contains "type=qa"
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    Then type value "v3io_user=123" to "Table_Label_Filter_Input" field on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
    Then "No_Data_Message" component on "commonPagesHeader" should be equal "No_Data_Message"."Common_Message_LLM_Prompt_Label"

  @MLLP
  @smoke
  Scenario: MLLP004 - Verify the Show iterations checkbox on LLM prompts page
    Given open url
    And wait load page
    And click on row root with value "llmdeploy332" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "llmdeploy332" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "LLM prompts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "LLM prompts" value
    Then verify redirection to "projects/llmdeploy332/llm-prompts?bePage=1&fePage=1"
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Project monitoring" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    And wait load page
    And select "tab" with "LLM prompts" value in breadcrumbs menu
    And wait load page
    Then verify redirection to "projects/llmdeploy332/llm-prompts?bePage=1&fePage=1"
    Then verify breadcrumbs "tab" label should be equal "LLM prompts" value
    Then verify "LLMPrompts_Table" element visibility on "LLM_Prompts" wizard
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    Then verify "Show_Iterations_Checkbox" element visibility on "FilterBy_Popup" wizard
    Then "Show_Iterations_Checkbox" element should be checked on "FilterBy_Popup" wizard
    Then uncheck "Show_Iterations_Checkbox" element on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    Then "Show_Iterations_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
    Then verify "LLMPrompts_Table" element visibility on "LLM_Prompts" wizard
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    Then verify "show_all_versions" option is present on "LLM_Prompts" wizard in "LLMPrompts_Table" table with "my_llm" value in "name" column
    Then verify "show_all_versions" option on "LLM_Prompts" wizard in "LLMPrompts_Table" table with "my_llm" value in "name" column should display hover tooltip "Common_Tooltips"."Show_All_Versions" with scroll "false"
    Then click on cell with row index 1 in "name" column in "LLMPrompts_Table" table on "LLM_Prompts" wizard
    And wait load page
    Then verify "Header" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    Then check "Show_Iterations_Checkbox" element on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    Then verify "Header" element not exists on "LLM_Prompts_Info_Pane" wizard
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    Then "Show_Iterations_Checkbox" element should be checked on "FilterBy_Popup" wizard

  @MLLP
  @smoke
  Scenario: MLLP005 - Check components on prompt item infopane on Overview tab table
    Given open url
    And wait load page
    And click on row root with value "llmdeploy332" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "llmdeploy332" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "LLM prompts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "LLM prompts" value
    Then verify redirection to "projects/llmdeploy332/llm-prompts?bePage=1&fePage=1"
    Then verify "LLMPrompts_Table" element visibility on "LLM_Prompts" wizard
    Then click on cell with row index 1 in "name" column in "LLMPrompts_Table" table on "LLM_Prompts" wizard
    And wait load page
    Then verify "Header" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard should contains "LLM_Prompts_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard
    Then verify "Header" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Updated" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Action_Menu" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Action_Menu" dropdown element on "LLM_Prompts_Info_Pane" wizard should contains "Common_Lists"."Action_Menu_List_LLM_Prompt"
    Then select "Download" option in action menu on "LLM_Prompts_Info_Pane" wizard
    And wait load page
    And wait load page
    Then verify "Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Download_Pop_Up_Cross_Cancel_Button" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Download_Pop_Up_Cross_Cancel_Button" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Header_Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    Then "Header_Download_Pop_Up" element on "Downloads_Popup" should contains "Downloads" value
    Then click on "Download_Pop_Up_Cross_Cancel_Button" element on "Downloads_Popup" wizard
    Then verify "Cross_Close_Button" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Full_View_Button" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "LLM_Prompts_Info_Pane" wizard should contains "LLM_Prompts_Info_Pane"."Overview_General_Headers"
    Then verify "Overview_Hash_Header" on "LLM_Prompts_Info_Pane" wizard should display "Label_Hint"."Overview_Hash"
    Then verify "Overview_Producer_Headers" on "LLM_Prompts_Info_Pane" wizard should contains "LLM_Prompts_Info_Pane"."Overview_Producer_Headers"
    Then verify "Overview_UID_Header" on "LLM_Prompts_Info_Pane" wizard should display "Label_Hint"."Overview_UID"
    Then click on "Full_View_Button" element on "LLM_Prompts_Info_Pane" wizard
    Then verify "Cross_Close_Button" element not exists on "LLM_Prompts_Info_Pane" wizard
    Then click on "Tabel_View_Button" element on "LLM_Prompts_Info_Pane" wizard
    Then verify "Cross_Close_Button" element visibility on "LLM_Prompts_Info_Pane" wizard

  @MLLP
  @smoke
  Scenario: MLLP006 - Verify Add a Tag, Edit a tag action and detail panel behavior after page refresh 
    Given open url
    And wait load page
    And click on row root with value "llmdeploy332" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "llmdeploy332" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "LLM prompts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "LLM prompts" value
    Then verify redirection to "projects/llmdeploy332/llm-prompts?bePage=1&fePage=1"
    Then verify "LLMPrompts_Table" element visibility on "LLM_Prompts" wizard
    Then select "Add a tag" option in action menu on "LLM_Prompts" wizard in "LLMPrompts_Table" table at row with "my_llm" value in "name" column
    And wait load page
    Then verify "Add_Tag_Popup" element visibility on "Add_Tag_Popup" wizard
    Then type value "test" to "Tag_Input" field on "Add_Tag_Popup" wizard
    Then click on "Add_Button" element on "Add_Tag_Popup" wizard
    And wait load page
    Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
    And wait load page
    Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Tag was added successfully" value
    And wait load page
    Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
    Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
    Then verify "Table_FilterBy_Button" element on "LLM_Prompts" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button"
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    Then select "test" option in "Table_Tree_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    When click on cell with value "my_llm" in "name" column in "LLMPrompts_Table" table on "LLM_Prompts" wizard
    And wait load page
    Then check "test" value in "tag" column in "Overview_Table" table on "LLM_Prompts_Info_Pane" wizard
    Then click on "Edit_btn_table_view" element on "LLM_Prompts_Info_Pane" wizard
    And wait load page
    When type value "v1" to "Version_tag_Input" field on "LLM_Prompts_Info_Pane" wizard
    Then click on "Apply_Button" element on "LLM_Prompts_Info_Pane" wizard
    Then click on "Apply_Changes_Button" element on "LLM_Prompts_Info_Pane" wizard
    And wait load page
    Then verify "Info_Pane_Tab_Selector" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Not_In_Filtered_List_Message" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then "Not_In_Filtered_List_Message" component on "LLM_Prompts_Info_Pane" should be equal "LLM_Prompts_Info_Pane"."Info_Banner_Message"
    Then verify "Info_Pane_Tab_Selector" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard should contains "LLM_Prompts_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard
    Then verify "Header" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then "Header" element on "LLM_Prompts_Info_Pane" should contains "my_llm" value
    Then refresh a page
    And wait load page
    Then verify "Info_Pane_Tab_Selector" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Not_In_Filtered_List_Message" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then "Not_In_Filtered_List_Message" component on "LLM_Prompts_Info_Pane" should be equal "LLM_Prompts_Info_Pane"."Info_Banner_Message"
    Then verify "Info_Pane_Tab_Selector" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard should contains "LLM_Prompts_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard
    Then verify "Header" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then "Header" element on "LLM_Prompts_Info_Pane" should contains "my_llm" value
    Then verify "Refresh_Button" element visibility on "LLM_Prompts" wizard
    Then verify "Refresh_Button" element on "LLM_Prompts" wizard should display hover tooltip "Common_Tooltips"."Refresh_Button"
    Then click on "Refresh_Button" element on "LLM_Prompts" wizard
    And wait load page
    Then verify "Info_Pane_Tab_Selector" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Not_In_Filtered_List_Message" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then "Not_In_Filtered_List_Message" component on "LLM_Prompts_Info_Pane" should be equal "LLM_Prompts_Info_Pane"."Info_Banner_Message"
    Then verify "Info_Pane_Tab_Selector" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard should contains "LLM_Prompts_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard
    Then verify "Header" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then click on "Cross_Close_Button" element on "LLM_Prompts_Info_Pane" wizard
    And wait load page
    Then verify "Header" element not exists on "LLM_Prompts_Info_Pane" wizard
    And wait load page
    And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
    Then "No_Data_Message" component on "commonPagesHeader" should be equal "No_Data_Message"."Common_Message_LLM_Prompt_Tag"
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    Then click on "Clear_Button" element on "FilterBy_Popup" wizard
    And wait load page
    When click on cell with value "my_llm" in "name" column in "LLMPrompts_Table" table on "LLM_Prompts" wizard
    And wait load page
    Then verify "Info_Pane_Tab_Selector" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Not_In_Filtered_List_Message" element not exists on "LLM_Prompts_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard should contains "LLM_Prompts_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard
    Then verify "Header" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    Then select "v1" option in "Table_Tree_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    When click on cell with value "my_llm" in "name" column in "LLMPrompts_Table" table on "LLM_Prompts" wizard
    And wait load page
    Then verify "Info_Pane_Tab_Selector" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Not_In_Filtered_List_Message" element not exists on "LLM_Prompts_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard should contains "LLM_Prompts_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard
    Then verify "Header" element visibility on "LLM_Prompts_Info_Pane" wizard

  @MLLP
  @smoke
  Scenario: MLLP007 - Check components on prompt item infopane on Prompt Template tab table 
    Given open url
    And wait load page
    And click on row root with value "llmdeploy332" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "llmdeploy332" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "LLM prompts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "LLM prompts" value
    Then verify redirection to "projects/llmdeploy332/llm-prompts?bePage=1&fePage=1"
    Then verify "LLMPrompts_Table" element visibility on "LLM_Prompts" wizard
    Then click on cell with row index 1 in "name" column in "LLMPrompts_Table" table on "LLM_Prompts" wizard
    And wait load page
    Then select "Prompt Template" tab in "Info_Pane_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard
    And wait load page
    Then verify "Prompt_Template_Tab_Selector" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Prompt_Template_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard should contains "LLM_Prompts_Info_Pane"."Tab_List"
    Then verify "Prompt Template" tab is active in "Prompt_Template_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard
    Then verify "Header" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Updated" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Action_Menu" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Action_Menu" dropdown element on "LLM_Prompts_Info_Pane" wizard should contains "Common_Lists"."Action_Menu_List_LLM_Prompt"
    Then verify "Cross_Close_Button" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Prompt_Arguments_Tab_Selector" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Prompt_Arguments_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard should contains "LLM_Prompts_Info_Pane"."Tab_List_Prompt_Template"
    Then verify "Prompt" tab is active in "Prompt_Arguments_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard
    Then verify "Find_In_Prompt_Filter_Input" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Prompt_Template_Table" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Prompt_Template_Argument" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then "Prompt_Template_Argument" element on "LLM_Prompts_Info_Pane" should contains "{something_with_meaning}" value
    Then verify "Prompt_Template_Argument" element on "LLM_Prompts_Info_Pane" wizard should display hover tooltip "Common_Tooltips"."Argument"
    Then click on "Prompt_Template_Argument" element on "LLM_Prompts_Info_Pane" wizard
    And wait load page
    Then verify "Prompt Template" tab is active in "Prompt_Template_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard
    Then verify "Arguments" tab is active in "Prompt_Arguments_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard
    Then value in "key" column with "text" in "Arguments_Tab_Table" on "LLM_Prompts_Info_Pane" wizard should contains "word"
    Then value in "value" column with "text" in "Arguments_Tab_Table" on "LLM_Prompts_Info_Pane" wizard should contains "The essence of all things"

  @MLLP
  @smoke
  Scenario: MLLP008 - Check components on prompt item infopane on Generation Configuration tab table 
    Given open url
    And wait load page
    And click on row root with value "llmdeploy332" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "llmdeploy332" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "LLM prompts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "LLM prompts" value
    Then verify redirection to "projects/llmdeploy332/llm-prompts?bePage=1&fePage=1"
    Then verify "LLMPrompts_Table" element visibility on "LLM_Prompts" wizard
    Then click on cell with row index 1 in "name" column in "LLMPrompts_Table" table on "LLM_Prompts" wizard
    And wait load page
    Then select "Generation Configuration" tab in "Info_Pane_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard
    And wait load page
    Then verify "Prompt_Template_Tab_Selector" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Prompt_Template_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard should contains "LLM_Prompts_Info_Pane"."Tab_List"
    Then verify "Generation Configuration" tab is active in "Prompt_Template_Tab_Selector" on "LLM_Prompts_Info_Pane" wizard
    Then verify "Header" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Updated" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Action_Menu" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Action_Menu" dropdown element on "LLM_Prompts_Info_Pane" wizard should contains "Common_Lists"."Action_Menu_List_LLM_Prompt"
    Then verify "Cross_Close_Button" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Generation_Configuration_Counter" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then "Generation_Configuration_Counter" element on "LLM_Prompts_Info_Pane" should contains "1 modifications made to the default configuration:" value
    Then value in "key" column with "text" in "Generation_Configuration_Tab_Table" on "LLM_Prompts_Info_Pane" wizard should contains "temperature"
    Then value in "value" column with "text" in "Generation_Configuration_Tab_Table" on "LLM_Prompts_Info_Pane" wizard should contains "0.5"

  @MLLP
  @smoke
  Scenario: MLLP009 - Check components on prompt version history page
    Given open url
    And wait load page
    And click on row root with value "llmdeploy332" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "llmdeploy332" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "LLM prompts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "LLM prompts" value
    Then verify redirection to "projects/llmdeploy332/llm-prompts?bePage=1&fePage=1"
    Then verify "LLMPrompts_Table" element visibility on "LLM_Prompts" wizard
    Then verify action menu on "LLM_Prompts" wizard in "LLMPrompts_Table" table with "my_llm" value in "name" column should contains "Common_Lists"."Action_Menu_List_LLM_Prompt"
    Then verify "show_all_versions" option is present on "LLM_Prompts" wizard in "LLMPrompts_Table" table with "my_llm" value in "name" column
    Then verify "show_all_versions" option on "LLM_Prompts" wizard in "LLMPrompts_Table" table with "my_llm" value in "name" column should display hover tooltip "Common_Tooltips"."Show_All_Versions" with scroll "false"
    Then click on "show_all_versions" option on "LLM_Prompts" wizard in "LLMPrompts_Table" table with "my_llm" value in "name" column with scroll "false"
    And wait load page
    Then verify "History_Back_Button" element visibility on "LLM_Prompts" wizard
    Then verify "Version_History_Title" element visibility on "LLM_Prompts" wizard
    Then "Version_History_Title" element on "LLM_Prompts" should contains "Version history:" value
    Then verify "Version_History_Prompt_Name" element visibility on "LLM_Prompts" wizard
    Then "Version_History_Prompt_Name" element on "LLM_Prompts" should contains "my_llm" value
    Then verify "Refresh_Button" element visibility on "LLM_Prompts" wizard
    Then verify "Table_FilterBy_Button" element visibility on "LLM_Prompts" wizard
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    Then "Show_Iterations_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
    Then verify action menu on "LLM_Prompts" wizard in "LLMPrompts_Table" table with "1d459c52a1102adcbbe242e6bb36e99129f2a8b9" value in "uid" column should contains "Common_Lists"."Action_Menu_List_LLM_Prompt"
    When click on cell with row index 1 in "uid" column in "LLMPrompts_Table" table on "LLM_Prompts" wizard
    And wait load page
    Then check "latest" value in "tag" column in "Overview_Table" table on "LLM_Prompts_Info_Pane" wizard
    Then verify "Action_Menu" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Action_Menu" dropdown element on "LLM_Prompts_Info_Pane" wizard should contains "Common_Lists"."Action_Menu_List_LLM_Prompt"
    Then verify "Header" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then "Header" element on "LLM_Prompts_Info_Pane" should contains "my_llm" value
    Then click on "History_Back_Button" element on "LLM_Prompts" wizard
    Then verify "LLMPrompts_Table" element visibility on "LLM_Prompts" wizard

  @MLLP
  @smoke
  Scenario: MLLP010 - Verify action menu list options on main llm prompts list
    Given open url
    And wait load page
    And click on row root with value "llmdeploy332" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "llmdeploy332" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "LLM prompts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "LLM prompts" value
    Then verify redirection to "projects/llmdeploy332/llm-prompts?bePage=1&fePage=1"
    Then verify "LLMPrompts_Table" element visibility on "LLM_Prompts" wizard
    Then verify action menu on "LLM_Prompts" wizard in "LLMPrompts_Table" table with "my_llm" value in "name" column should contains "Common_Lists"."Action_Menu_List_LLM_Prompt"
    Then select "Download" option in action menu on "LLM_Prompts" wizard in "LLMPrompts_Table" table at row with "my_llm" value in "name" column
    And wait load page
    And wait load page
    Then verify "Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Download_Pop_Up_Cross_Cancel_Button" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Header_Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    Then "Header_Download_Pop_Up" element on "Downloads_Popup" should contains "Downloads" value
    Then click on "Download_Pop_Up_Cross_Cancel_Button" element on "Downloads_Popup" wizard
    Then select "View YAML" option in action menu on "LLM_Prompts" wizard in "LLMPrompts_Table" table at row with "my_llm" value in "name" column
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
    Then click on "Cross_Cancel_Button" element on "View_YAML" wizard
    Then select "Copy URI" option in action menu on "LLM_Prompts" wizard in "LLMPrompts_Table" table at row with "my_llm" value in "name" column
    And wait load page
    Then verify if "Notification_Popup" popup dialog appears
    Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
    Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Copied to clipboard successfully" value
    Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
    Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
    Then verify "LLMPrompts_Table" element visibility on "LLM_Prompts" wizard
    Then click on cell with row index 1 in "name" column in "LLMPrompts_Table" table on "LLM_Prompts" wizard
    And wait load page
    Then verify "Header" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Action_Menu" dropdown element on "LLM_Prompts_Info_Pane" wizard should contains "Common_Lists"."Action_Menu_List_LLM_Prompt"
    Then select "Download" option in action menu on "LLM_Prompts_Info_Pane" wizard
    And wait load page
    And wait load page
    Then verify "Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Download_Pop_Up_Cross_Cancel_Button" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Header_Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    Then "Header_Download_Pop_Up" element on "Downloads_Popup" should contains "Downloads" value
    Then click on "Download_Pop_Up_Cross_Cancel_Button" element on "Downloads_Popup" wizard
    Then select "View YAML" option in action menu on "LLM_Prompts_Info_Pane" wizard
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
    Then click on "Cross_Cancel_Button" element on "View_YAML" wizard
    Then select "Copy URI" option in action menu on "LLM_Prompts_Info_Pane" wizard
    And wait load page
    Then verify if "Notification_Popup" popup dialog appears
    Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
    Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Copied to clipboard successfully" value
    Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
    Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
    Then click on "Cross_Close_Button" element on "LLM_Prompts_Info_Pane" wizard
    Then verify "LLMPrompts_Table" element visibility on "LLM_Prompts" wizard
    Then select "Add a tag" option in action menu on "LLM_Prompts" wizard in "LLMPrompts_Table" table at row with "my_llm" value in "name" column
    And wait load page
    Then verify "Add_Tag_Popup" element visibility on "Add_Tag_Popup" wizard
    Then type value "instructions" to "Tag_Input" field on "Add_Tag_Popup" wizard
    Then click on "Add_Button" element on "Add_Tag_Popup" wizard
    And wait load page
    Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
    And wait load page
    Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Tag was added successfully" value
    And wait load page
    Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
    Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
    Then verify "Table_FilterBy_Button" element on "LLM_Prompts" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button"
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    Then select "instructions" option in "Table_Tree_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    When click on cell with value "my_llm" in "name" column in "LLMPrompts_Table" table on "LLM_Prompts" wizard
    And wait load page
    Then check "instructions" value in "tag" column in "Overview_Table" table on "LLM_Prompts_Info_Pane" wizard
    Then select "Add a tag" option in action menu on "LLM_Prompts_Info_Pane" wizard
    And wait load page
    Then verify "Add_Tag_Popup" element visibility on "Add_Tag_Popup" wizard
    Then type value "criteria" to "Tag_Input" field on "Add_Tag_Popup" wizard
    Then click on "Add_Button" element on "Add_Tag_Popup" wizard
    And wait load page
    Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
    And wait load page
    Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Tag was added successfully" value
    And wait load page
    Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
    Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
    Then verify "Table_FilterBy_Button" element on "LLM_Prompts" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button_1"
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    Then select "criteria" option in "Table_Tree_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    When click on cell with value "my_llm" in "name" column in "LLMPrompts_Table" table on "LLM_Prompts" wizard
    And wait load page
    Then check "criteria" value in "tag" column in "Overview_Table" table on "LLM_Prompts_Info_Pane" wizard

  @MLLP
  @smoke
  Scenario: MLLP011 - Verify action menu list options on version history llm prompts list
    Given open url
    And wait load page
    And click on row root with value "llmdeploy332" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "llmdeploy332" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "LLM prompts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "LLM prompts" value
    Then verify redirection to "projects/llmdeploy332/llm-prompts?bePage=1&fePage=1"
    Then verify "LLMPrompts_Table" element visibility on "LLM_Prompts" wizard
    Then verify "show_all_versions" option is present on "LLM_Prompts" wizard in "LLMPrompts_Table" table with "my_llm" value in "name" column
    Then verify "show_all_versions" option on "LLM_Prompts" wizard in "LLMPrompts_Table" table with "my_llm" value in "name" column should display hover tooltip "Common_Tooltips"."Show_All_Versions" with scroll "false"
    Then click on "show_all_versions" option on "LLM_Prompts" wizard in "LLMPrompts_Table" table with "my_llm" value in "name" column with scroll "false"
    And wait load page
    Then verify "History_Back_Button" element visibility on "LLM_Prompts" wizard
    Then "Version_History_Prompt_Name" element on "LLM_Prompts" should contains "my_llm" value
    Then verify "Refresh_Button" element visibility on "LLM_Prompts" wizard
    Then verify "Table_FilterBy_Button" element visibility on "LLM_Prompts" wizard
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    Then "Show_Iterations_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
    Then verify action menu on "LLM_Prompts" wizard in "LLMPrompts_Table" table with "1d459c52a1102adcbbe242e6bb36e99129f2a8b9" value in "uid" column should contains "Common_Lists"."Action_Menu_List_LLM_Prompt"
    Then verify action menu on "LLM_Prompts" wizard in "LLMPrompts_Table" table with "1d459c52a1102adcbbe242e6bb36e99129f2a8b9" value in "uid" column should contains "Common_Lists"."Action_Menu_List_LLM_Prompt"
    Then select "Download" option in action menu on "LLM_Prompts" wizard in "LLMPrompts_Table" table at row with "1d459c52a1102adcbbe242e6bb36e99129f2a8b9" value in "uid" column
    And wait load page
    And wait load page
    Then verify "Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Download_Pop_Up_Cross_Cancel_Button" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Header_Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    Then "Header_Download_Pop_Up" element on "Downloads_Popup" should contains "Downloads" value
    Then click on "Download_Pop_Up_Cross_Cancel_Button" element on "Downloads_Popup" wizard
    Then select "View YAML" option in action menu on "LLM_Prompts" wizard in "LLMPrompts_Table" table at row with "1d459c52a1102adcbbe242e6bb36e99129f2a8b9" value in "uid" column
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
    Then click on "Cross_Cancel_Button" element on "View_YAML" wizard
    Then select "Copy URI" option in action menu on "LLM_Prompts" wizard in "LLMPrompts_Table" table at row with "1d459c52a1102adcbbe242e6bb36e99129f2a8b9" value in "uid" column
    And wait load page
    Then verify if "Notification_Popup" popup dialog appears
    Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
    Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Copied to clipboard successfully" value
    Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
    Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
    Then verify "History_Back_Button" element visibility on "LLM_Prompts" wizard
    Then verify "LLMPrompts_Table" element visibility on "LLM_Prompts" wizard
    When click on cell with row index 1 in "uid" column in "LLMPrompts_Table" table on "LLM_Prompts" wizard
    And wait load page
    Then verify "Header" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "LLM_Prompts_Info_Pane" wizard
    Then verify "Action_Menu" dropdown element on "LLM_Prompts_Info_Pane" wizard should contains "Common_Lists"."Action_Menu_List_LLM_Prompt"
    Then select "Download" option in action menu on "LLM_Prompts_Info_Pane" wizard
    And wait load page
    And wait load page
    Then verify "Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Download_Pop_Up_Cross_Cancel_Button" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Header_Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    Then "Header_Download_Pop_Up" element on "Downloads_Popup" should contains "Downloads" value
    Then click on "Download_Pop_Up_Cross_Cancel_Button" element on "Downloads_Popup" wizard
    Then select "View YAML" option in action menu on "LLM_Prompts_Info_Pane" wizard
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
    Then click on "Cross_Cancel_Button" element on "View_YAML" wizard
    Then select "Copy URI" option in action menu on "LLM_Prompts_Info_Pane" wizard
    And wait load page
    Then verify if "Notification_Popup" popup dialog appears
    Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
    Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Copied to clipboard successfully" value
    Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
    Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
    Then click on "Cross_Close_Button" element on "LLM_Prompts_Info_Pane" wizard
    Then verify "History_Back_Button" element visibility on "LLM_Prompts" wizard
    Then verify "LLMPrompts_Table" element visibility on "LLM_Prompts" wizard
    Then select "Add a tag" option in action menu on "LLM_Prompts" wizard in "LLMPrompts_Table" table at row with "1d459c52a1102adcbbe242e6bb36e99129f2a8b9" value in "uid" column
    And wait load page
    Then verify "Add_Tag_Popup" element visibility on "Add_Tag_Popup" wizard
    Then type value "context" to "Tag_Input" field on "Add_Tag_Popup" wizard
    Then click on "Add_Button" element on "Add_Tag_Popup" wizard
    And wait load page
    Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
    And wait load page
    Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Tag was added successfully" value
    And wait load page
    Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
    Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
    Then verify "Table_FilterBy_Button" element on "LLM_Prompts" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button"
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    Then select "context" option in "Table_Tree_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    When click on cell with value "1d459c52a1102adcbbe242e6bb36e99129f2a8b9" in "uid" column in "LLMPrompts_Table" table on "LLM_Prompts" wizard
    And wait load page
    Then check "context" value in "tag" column in "Overview_Table" table on "LLM_Prompts_Info_Pane" wizard
    Then select "Add a tag" option in action menu on "LLM_Prompts_Info_Pane" wizard
    And wait load page
    Then verify "Add_Tag_Popup" element visibility on "Add_Tag_Popup" wizard
    Then type value "Final_Answer" to "Tag_Input" field on "Add_Tag_Popup" wizard
    Then click on "Add_Button" element on "Add_Tag_Popup" wizard
    And wait load page
    Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
    And wait load page
    Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Tag was added successfully" value
    And wait load page
    Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
    Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
    Then verify "Table_FilterBy_Button" element on "LLM_Prompts" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button_1"
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    Then select "Final_Answer" option in "Table_Tree_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    When click on cell with value "1d459c52a1102adcbbe242e6bb36e99129f2a8b9" in "uid" column in "LLMPrompts_Table" table on "LLM_Prompts" wizard
    And wait load page
    Then check "Final_Answer" value in "tag" column in "Overview_Table" table on "LLM_Prompts_Info_Pane" wizard

  @MLLP
  @smoke
  #TODO: verify 'Add a Tag' behavior in Version History page when overwriting an existing prompt instance
  Scenario: MLLP012 - Verify overwrite Add a tag option in action menu on llm prompts list
  Given open url
    And wait load page
    And click on row root with value "llmdeploy332" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "llmdeploy332" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "LLM prompts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "LLM prompts" value
    Then verify redirection to "projects/llmdeploy332/llm-prompts?bePage=1&fePage=1"
    Then verify "LLMPrompts_Table" element visibility on "LLM_Prompts" wizard
    Then select "Add a tag" option in action menu on "LLM_Prompts" wizard in "LLMPrompts_Table" table at row with "my_llm" value in "name" column
    And wait load page
    Then verify "Add_Tag_Popup" element visibility on "Add_Tag_Popup" wizard
    Then type value "latest" to "Tag_Input" field on "Add_Tag_Popup" wizard
    Then click on "Add_Button" element on "Add_Tag_Popup" wizard
    And wait load page
    Then verify "Add_Button" element on "Add_Tag_Popup" wizard is disabled
    Then type value "system" to "Tag_Input" field on "Add_Tag_Popup" wizard
    Then click on "Add_Button" element on "Add_Tag_Popup" wizard
    And wait load page
    Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
    And wait load page
    Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Tag was added successfully" value
    And wait load page
    Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
    Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
    Then select "Add a tag" option in action menu on "LLM_Prompts" wizard in "LLMPrompts_Table" table at row with "my_llm" value in "name" column
    And wait load page
    Then verify "Add_Tag_Popup" element visibility on "Add_Tag_Popup" wizard
    Then type value "system" to "Tag_Input" field on "Add_Tag_Popup" wizard
    Then click on "Add_Button" element on "Add_Tag_Popup" wizard
    Then verify if "Confirm_Popup" popup dialog appears
    Then "Title" element on "Confirm_Popup" should contains "Overwrite LLM prompt?" value
    Then verify "Cross_Cancel_Button" element visibility on "Confirm_Popup" wizard
    Then verify "Confirm_Dialog_Message" element visibility on "Confirm_Popup" wizard
    Then "Confirm_Dialog_Message" component on "Confirm_Popup" should be equal "Descriptions"."Add_A_Tag_Overwrite_Message"
    Then verify "Cancel_Button" element visibility on "Confirm_Popup" wizard
    Then "Cancel_Button" element on "Confirm_Popup" should contains "Cancel" value
    Then verify "Overwrite_Button" element visibility on "Confirm_Popup" wizard
    Then "Overwrite_Button" element on "Confirm_Popup" should contains "Overwrite" value
    When click on "Cancel_Button" element on "Confirm_Popup" wizard
    Then select "Add a tag" option in action menu on "LLM_Prompts" wizard in "LLMPrompts_Table" table at row with "my_llm" value in "name" column
    And wait load page
    Then verify "Add_Tag_Popup" element visibility on "Add_Tag_Popup" wizard
    Then type value "system" to "Tag_Input" field on "Add_Tag_Popup" wizard
    Then click on "Add_Button" element on "Add_Tag_Popup" wizard
    Then verify if "Confirm_Popup" popup dialog appears
    Then "Title" element on "Confirm_Popup" should contains "Overwrite LLM prompt?" value
    Then verify "Cross_Cancel_Button" element visibility on "Confirm_Popup" wizard
    Then verify "Confirm_Dialog_Message" element visibility on "Confirm_Popup" wizard
    Then "Confirm_Dialog_Message" component on "Confirm_Popup" should be equal "Descriptions"."Add_A_Tag_Overwrite_Message"
    Then verify "Cancel_Button" element visibility on "Confirm_Popup" wizard
    Then "Cancel_Button" element on "Confirm_Popup" should contains "Cancel" value
    Then verify "Overwrite_Button" element visibility on "Confirm_Popup" wizard
    Then "Overwrite_Button" element on "Confirm_Popup" should contains "Overwrite" value
    When click on "Overwrite_Button" element on "Confirm_Popup" wizard
    And wait load page
    Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
    And wait load page
    Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Tag was added successfully" value
    And wait load page
    Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
    Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard

  @MLLP
  @smoke
  Scenario: MLLP013 - Verify prompt preview option on the main an version history llm prompts lists
    Given open url
    And wait load page
    And click on row root with value "llmdeploy332" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "llmdeploy332" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "LLM prompts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "LLM prompts" value
    Then verify redirection to "projects/llmdeploy332/llm-prompts?bePage=1&fePage=1"
    Then verify "LLMPrompts_Table" element visibility on "LLM_Prompts" wizard
    Then verify "preview" option is present on "LLM_Prompts" wizard in "LLMPrompts_Table" table with "my_llm" value in "name" column
    Then click on "preview" option on "LLM_Prompts" wizard in "LLMPrompts_Table" table with "my_llm" value in "name" column with scroll "false"
    And wait load page
    Then verify if "Preview_Popup" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "Preview_Popup" wizard
    Then verify "Preview_Modal_Container" element visibility on "Preview_Popup" wizard
    Then verify "Download_Button" element visibility on "Preview_Popup" wizard
    Then click on "Download_Button" element on "Preview_Popup" wizard
    And wait load page
    And wait load page
    Then verify "Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Download_Pop_Up_Cross_Cancel_Button" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Header_Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    Then "Header_Download_Pop_Up" element on "Downloads_Popup" should contains "Downloads" value
    Then click on "Download_Pop_Up_Cross_Cancel_Button" element on "Downloads_Popup" wizard
    Then verify visibility of header column "name" in "Preview_Table" table on "Preview_Popup" wizard
    Then check "Name" header value in "name" column in "Preview_Table" table on "Preview_Popup" wizard
    Then verify visibility of header column "path" in "Preview_Table" table on "Preview_Popup" wizard
    Then check "Path" header value in "path" column in "Preview_Table" table on "Preview_Popup" wizard
    Then verify visibility of header column "size" in "Preview_Table" table on "Preview_Popup" wizard
    Then check "Size" header value in "size" column in "Preview_Table" table on "Preview_Popup" wizard
    Then verify visibility of header column "updated" in "Preview_Table" table on "Preview_Popup" wizard
    Then check "Updated" header value in "updated" column in "Preview_Table" table on "Preview_Popup" wizard
    Then click on "Cross_Cancel_Button" element on "Preview_Popup" wizard
    Then verify "show_all_versions" option is present on "LLM_Prompts" wizard in "LLMPrompts_Table" table with "my_llm" value in "name" column
    Then click on "show_all_versions" option on "LLM_Prompts" wizard in "LLMPrompts_Table" table with "my_llm" value in "name" column with scroll "false"
    And wait load page
    Then verify "History_Back_Button" element visibility on "LLM_Prompts" wizard
    Then "Version_History_Prompt_Name" element on "LLM_Prompts" should contains "my_llm" value
    Then verify "preview" option is present on "LLM_Prompts" wizard in "LLMPrompts_Table" table with "1d459c52a1102adcbbe242e6bb36e99129f2a8b9" value in "uid" column
    Then click on "preview" option on "LLM_Prompts" wizard in "LLMPrompts_Table" table with "1d459c52a1102adcbbe242e6bb36e99129f2a8b9" value in "uid" column with scroll "false"
    And wait load page
    Then verify if "Preview_Popup" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "Preview_Popup" wizard
    Then verify "Preview_Modal_Container" element visibility on "Preview_Popup" wizard
    Then verify "Download_Button" element visibility on "Preview_Popup" wizard
    Then click on "Download_Button" element on "Preview_Popup" wizard
    And wait load page
    And wait load page
    Then verify "Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Download_Pop_Up_Cross_Cancel_Button" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Header_Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    Then "Header_Download_Pop_Up" element on "Downloads_Popup" should contains "Downloads" value
    Then click on "Download_Pop_Up_Cross_Cancel_Button" element on "Downloads_Popup" wizard
    Then verify visibility of header column "name" in "Preview_Table" table on "Preview_Popup" wizard
    Then check "Name" header value in "name" column in "Preview_Table" table on "Preview_Popup" wizard
    Then verify visibility of header column "path" in "Preview_Table" table on "Preview_Popup" wizard
    Then check "Path" header value in "path" column in "Preview_Table" table on "Preview_Popup" wizard
    Then verify visibility of header column "size" in "Preview_Table" table on "Preview_Popup" wizard
    Then check "Size" header value in "size" column in "Preview_Table" table on "Preview_Popup" wizard
    Then verify visibility of header column "updated" in "Preview_Table" table on "Preview_Popup" wizard
    Then check "Updated" header value in "updated" column in "Preview_Table" table on "Preview_Popup" wizard
    Then click on "Cross_Cancel_Button" element on "Preview_Popup" wizard
    Then verify "LLMPrompts_Table" element visibility on "LLM_Prompts" wizard
