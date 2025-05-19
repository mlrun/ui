Feature: Documents Page

    Testcases that verifies functionality on Documents Page
    
  @MLDoc
  @smoke
  Scenario: MLDoc001 - Check components on Documents page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "default" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Documents" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Documents" value
    And wait load page
    Then click on breadcrumbs "project" label on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "default" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Documents" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Documents" value
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
    Then "Pagination_Count" element on "Pagination_Info_Pane" should contains "Showing 1 - 8" value
    When click on cell with row index 1 in "name" column in "Documents_Table" table on "Documents" wizard
    And wait load page
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
    Then "Pagination_Count" element on "Pagination_Info_Pane" should contains "Showing 1 - 8" value
    Then select "project" with "cat-vs-dog-classification" value in breadcrumbs menu
    And wait load page
    Then verify breadcrumbs "project" label should be equal "cat-vs-dog-classification" value
    And wait load page
    Then verify breadcrumbs "project" label should be equal "cat-vs-dog-classification" value
    And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
    Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."No_Documents_data"
    Then select "project" with "default" value in breadcrumbs menu
    And wait load page
    Then verify breadcrumbs "project" label should be equal "default" value
    Then verify "Documents_Table" element visibility on "Documents" wizard

  @MLDoc
  @smoke
  Scenario: MLDoc002 - Verify behaviour of Show iterations checkbox on Documents page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Documents" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    And select "tab" with "Project monitoring" value in breadcrumbs menu
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Documents" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Documents" wizard
    Then verify "Show_Iterations_Checkbox" element visibility on "FilterBy_Popup" wizard
    Then "Show_Iterations_Checkbox" element should be checked on "FilterBy_Popup" wizard
    Then check "expand_btn" not presented in "Datasets_Table" on "Datasets" wizard
    Then uncheck "Show_Iterations_Checkbox" element on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Documents" wizard
    Then "Show_Iterations_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
    Then click on "Table_FilterBy_Button" element on "Documents" wizard
    Then verify "show_all_versions" option is present on "Documents" wizard in "Documents_Table" table with "loaded-doc" value in "name" column
    Then verify "show_all_versions" option on "Documents" wizard in "Documents_Table" table with "loaded-doc" value in "name" column should display hover tooltip "Common_Tooltips"."Show_All_Versions" with scroll "false"
    Then click on cell with row index 3 in "name" column in "Documents_Table" table on "Documents" wizard
    And wait load page
    Then verify "Header" element visibility on "Documents_Info_Pane" wizard
    Then click on "Table_FilterBy_Button" element on "Documents" wizard
    Then check "Show_Iterations_Checkbox" element on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    Then verify "Header" element not exists on "Documents_Info_Pane" wizard
    Then click on "Table_FilterBy_Button" element on "Documents" wizard
    Then "Show_Iterations_Checkbox" element should be checked on "FilterBy_Popup" wizard

  @MLDoc
  @smoke
  Scenario: MLDoc003 - Check all mandatory components in Item infopane on Overview tab table on Documents page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Documents" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Documents_Table" table on "Documents" wizard
    And wait load page
    Then verify "Info_Pane_Tab_Selector" on "Documents_Info_Pane" wizard should contains "Documents_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Documents_Info_Pane" wizard
    Then verify "Header" element visibility on "Documents_Info_Pane" wizard
    Then verify "Updated" element visibility on "Documents_Info_Pane" wizard
    Then verify "Action_Menu" element visibility on "Documents_Info_Pane" wizard
    Then verify "Action_Menu" dropdown element on "Documents_Info_Pane" wizard should contains "Common_Lists"."Action_Menu_List"
    Then select "Download" option in action menu on "Documents_Info_Pane" wizard
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
    Then verify "Full_View_Button" element visibility on "Documents_Info_Pane" wizard
    Then verify "Cross_Close_Button" element visibility on "Documents_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Documents_Info_Pane" wizard should contains "Documents_Info_Pane"."Overview_General_Headers"
    Then verify "Overview_Producer_Headers" on "Documents_Info_Pane" wizard should contains "Documents_Info_Pane"."Overview_Producer_Headers"
    And hover "Overview_Hash_Header" component on "Documents_Info_Pane" wizard
    Then verify "Overview_Hash_Header" on "Documents_Info_Pane" wizard should display "Label_Hint"."Overview_Hash"
    Then verify "Overview_UID_Header" on "Documents_Info_Pane" wizard should display "Label_Hint"."Overview_UID"
    Then click on "Full_View_Button" element on "Documents_Info_Pane" wizard
    Then verify "Cross_Close_Button" element not exists on "Documents_Info_Pane" wizard
    Then click on "Tabel_View_Button" element on "Documents_Info_Pane" wizard
    Then verify "Cross_Close_Button" element visibility on "Documents_Info_Pane" wizard
  
  @MLDoc
  @smoke
  Scenario: MLDoc004 - Check filtering by name on Documents page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    Then click on "Project_Monitoring_Button" element on "commonPagesHeader" wizard
    And wait load page
    And select "tab" with "Documents" value in breadcrumbs menu
    And wait load page
    Then type value "doc" to "Table_Name_Filter_Input" field on "Documents" wizard
    Then click on "Table_Refresh_Button" element on "Documents" wizard
    And wait load page
    Then value in "name" column with "text" in "Documents_Table" on "Documents" wizard should contains "doc"
  
  @MLDoc
  @smoke
  Scenario: MLDoc005 - Verify filtering by label on Documents page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    Then click on "Project_Monitoring_Button" element on "commonPagesHeader" wizard
    And wait load page
    And select "tab" with "Documents" value in breadcrumbs menu
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Documents" wizard
    Then type value "kind" to "Table_Label_Filter_Input" field on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    Then value in "labels" column with "text" in "Documents_Table" on "Documents" wizard should contains "kind"
    Then click on "Table_FilterBy_Button" element on "Documents" wizard
    Then type value "kind=milvus" to "Table_Label_Filter_Input" field on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    Then value in "labels" column with "text" in "Documents_Table" on "Documents" wizard should contains "kind=milvus"
    Then click on "Table_FilterBy_Button" element on "Documents" wizard
    Then type value "v3io_user=123" to "Table_Label_Filter_Input" field on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
    Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."No_Datasets_data"
  
  @MLDoc
  @smoke
  Scenario: MLDoc006 - Verify action menu list, Downloads action, View YAML action
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And select "tab" with "Documents" value in breadcrumbs menu
    And wait load page
    Then verify action menu on "Documents" wizard in "Documents_Table" table with "anxujkpvfi" value in "name" column should contains "Common_Lists"."Action_Menu_List"
    Then select "Download" option in action menu on "Documents" wizard in "Documents_Table" table at row with "anxujkpvfi" value in "name" column
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
    Then select "View YAML" option in action menu on "Documents" wizard in "Documents_Table" table at row with "anxujkpvfi" value in "name" column
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
    Then click on "Cross_Cancel_Button" element on "View_YAML" wizard
    Then click on "Table_FilterBy_Button" element on "Documents" wizard
    Then uncheck "Show_Iterations_Checkbox" element on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    