Feature: Artifacts Page

  Testcases that verifies functionality on Artifacts Page

  @MLA
  @passive
  @smoke
  Scenario: MLA001 - Check all mandatory components on Artifacts tab
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "project" label should be equal "default" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Artifacts" value
    Then click on breadcrumbs "project" label on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify "Table_Name_Filter_Input" element visibility on "Files" wizard
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
    Then verify "Table_Tree_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
    Then verify "Show_Iterations_Checkbox" element visibility on "FilterBy_Popup" wizard
    Then verify "Table_Refresh_Button" element visibility on "Files" wizard
    Then verify "Table_Refresh_Button" element on "Files" wizard should display hover tooltip "Common_Tooltips"."Refresh_Button"
    Then verify "Files_Table" element visibility on "Files" wizard
    Then verify "Register_File_Button" element visibility on "Files" wizard
    Then "Register_File_Button" element on "Files" should contains "Register artifact" value
    Then verify "Table_Tree_Filter_Dropdown" dropdown element on "FilterBy_Popup" wizard should contains "Dropdown_Options"."Tag_Filer_Options_Main_Table"

  @MLA
  @passive
  @smoke
  Scenario: MLA002 - Verify filtering by file name on Artifacts page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "project" label should be equal "default" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    And select "tab" with "Project monitoring" value in breadcrumbs menu
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Artifacts" value
    Then verify "Table_Name_Filter_Input" element visibility on "Files" wizard
    Then type value "test" to "Table_Name_Filter_Input" field on "Files" wizard
    Then click on "Table_Refresh_Button" element on "Files" wizard
    And wait load page
    Then value in "name" column with "text" in "Files_Table" on "Files" wizard should contains "test"

  @MLA
  @passive
  @smoke
  Scenario: MLA003 - Verify filtering by file label on Artifacts page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And select "tab" with "Artifacts" value in breadcrumbs menu
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then type value "owner" to "Table_Label_Filter_Input" field on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    Then value in "labels" column with "dropdowns" in "Files_Table" on "Files" wizard should contains "owner"
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then type value "v3io_user=admin" to "Table_Label_Filter_Input" field on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    Then value in "labels" column with "dropdowns" in "Files_Table" on "Files" wizard should contains "v3io_user=admin"
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then type value "v3io_user=123" to "Table_Label_Filter_Input" field on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
    Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."No_Files_data"

  @MLA
  @passive
  @smoke
  Scenario: MLA004 - Verify behaviour of Show iterations checkbox on Artifacts tab
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then verify "Show_Iterations_Checkbox" element visibility on "FilterBy_Popup" wizard
    Then check "expand_btn" not presented in "Files_Table" on "Files" wizard
    Then uncheck "Show_Iterations_Checkbox" element on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then "Show_Iterations_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
    Then check "expand_btn" not presented in "Files_Table" on "Files" wizard
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then verify "show_all_versions" option is present on "Files" wizard in "Files_Table" table with "training_iteration_results" value in "name" column
    Then verify "show_all_versions" option on "Files" wizard in "Files_Table" table with "training_iteration_results" value in "name" column should display hover tooltip "Common_Tooltips"."Show_All_Versions" with scroll "false"
    Then click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then verify "Header" element visibility on "Files_Info_Pane" wizard
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then check "Show_Iterations_Checkbox" element on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    Then verify "Header" element not exists on "Files_Info_Pane" wizard
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then "Show_Iterations_Checkbox" element should be checked on "FilterBy_Popup" wizard

  @MLA
  @passive
  @inProgress
  @smoke
  Scenario: MLA005 - Check all mandatory components on Register Artifacts Popup
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then click on "Register_File_Button" element on "Files" wizard
    Then verify if "Register_File_Popup" popup dialog appears
    Then verify options in "Path_Scheme_Combobox" combobox in "Target_Path" on "Register_File_Popup" wizard should contains "Register_Artifact"."Combobox_Options"
    Then navigate back
    Then verify "Title" element not exists on "Register_File_Popup" wizard
    Then navigate forward
    Then verify "Title" element not exists on "Register_File_Popup" wizard
    Then click on "Register_File_Button" element on "Files" wizard
    Then verify if "Register_File_Popup" popup dialog appears
    Then "Title" element on "Register_File_Popup" should contains "Register Artifact" value
    Then "Form_Text" component on "Register_File_Popup" should contains "Register_Artifact"."Form_Text"
    Then "Form_Subtext" component on "Register_File_Popup" should contains "Register_Artifact"."Form_Subtext"
    Then verify "Cross_Cancel_Button" element visibility on "Register_File_Popup" wizard
    Then verify "New_File_Name_Input" element visibility on "Register_File_Popup" wizard
    Then type value " " to "New_File_Name_Input" field on "Register_File_Popup" wizard
    Then verify "New_File_Name_Input" on "Register_File_Popup" wizard should display options "Input_Hint"."Artifact_Name_Hint"
    Then click on "Form_Subtext" element on "Register_File_Popup" wizard
    Then verify "New_File_Name_Input" options rules on form "Register_File_Popup" wizard
    When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_File_Popup" wizard
    When type value "  " to "Path_Scheme_Combobox" field on "Target_Path" on "Register_File_Popup" wizard
    Then verify "Path_Scheme_Combobox" element in "Target_Path" on "Register_File_Popup" wizard should display hover warning "Input_Hint"."V3IO_Path_Hint"
    Then verify "New_File_Description_Input" element visibility on "Register_File_Popup" wizard
    Then type value " " to "New_File_Description_Input" field on "Register_File_Popup" wizard
    Then verify "New_File_Description_Input" on "Register_File_Popup" wizard should display hover warning "Input_Hint"."Input_Field_Invalid"
    Then verify "New_File_Type_Dropdown" element visibility on "Register_File_Popup" wizard
    Then verify "New_File_Type_Dropdown" dropdown on "Register_File_Popup" wizard selected option value "General"
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
    Then verify "Register_Button" element on "Register_File_Popup" wizard is enabled
    Then click on "Cancel_Button" element on "Register_File_Popup" wizard
    Then verify if "Common_Popup" popup dialog appears
    Then click on "Cancel_Button" element on "Common_Popup" wizard
    Then verify if "Register_File_Popup" popup dialog appears
    Then verify "New_File_Name_Input" input should contains "artifact" value on "Register_File_Popup" wizard
    Then verify "Path_Scheme_Combobox" input should contains "target/path" value in "Target_Path" on "Register_File_Popup" wizard
    Then verify "New_File_Description_Input" input should contains "new artifact description" value on "Register_File_Popup" wizard
    Then verify "New_File_Type_Dropdown" dropdown on "Register_File_Popup" wizard selected option value "Table"
    Then click on "Cross_Cancel_Button" element on "Register_File_Popup" wizard
    Then verify if "Common_Popup" popup dialog appears
    Then click on "Cancel_Button" element on "Common_Popup" wizard
    Then verify if "Register_File_Popup" popup dialog appears
    Then verify "New_File_Name_Input" input should contains "artifact" value on "Register_File_Popup" wizard
    Then verify "Path_Scheme_Combobox" input should contains "target/path" value in "Target_Path" on "Register_File_Popup" wizard
    Then verify "New_File_Description_Input" input should contains "new artifact description" value on "Register_File_Popup" wizard
    Then check "New_File_Description_Input" textarea counter on "Register_File_Popup" wizard
    Then verify "New_File_Type_Dropdown" dropdown on "Register_File_Popup" wizard selected option value "Table"
    Then navigate back
    Then verify if "Common_Popup" popup dialog appears
    Then click on "Cancel_Button" element on "Common_Popup" wizard
    Then navigate back
    Then verify if "Common_Popup" popup dialog appears
    Then click on "Confirm_Button" element on "Common_Popup" wizard
    And wait load page
    Then verify "Title" element not exists on "Register_File_Popup" wizard
    Then navigate forward
    Then verify "Title" element not exists on "Register_File_Popup" wizard
    Then verify "Files_Table" element visibility on "Files" wizard

  @MLA
  @smoke
  Scenario: MLA006 - Verify behaviour on Register new Artifact
    * set tear-down property "project" created with "automation-test" value
    * create "automation-test" MLRun Project with code 201
    Given open url
    And wait load page
    And click on row root with value "automation-test" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on "Register_File_Button" element on "Files" wizard
    Then verify if "Register_File_Popup" popup dialog appears
    Then type value "test-artifact" to "New_File_Name_Input" field on "Register_File_Popup" wizard
    When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_File_Popup" wizard
    When type value "target/path" to "Path_Scheme_Combobox" field on "Target_Path" on "Register_File_Popup" wizard
    Then select "Table" option in "New_File_Type_Dropdown" dropdown on "Register_File_Popup" wizard
    Then click on "Register_Button" element on "Register_File_Popup" wizard
    And wait load page
    Then verify if "Notification_Popup" popup dialog appears
    Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
    Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Register artifact initiated successfully" value
    Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
    Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
    Then value in "name" column with "text" in "Files_Table" on "Files" wizard should contains "test-artifact"
    Then value in "type" column with "text" in "Files_Table" on "Files" wizard should contains "table"
    Then click on cell with value "test-artifact" in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then "Header" element on "Files_Info_Pane" should contains "test-artifact" value
    Then check "test-artifact" value in "key" column in "Overview_Table" table on "Files_Info_Pane" wizard
    Then check "latest" value in "tag" column in "Overview_Table" table on "Files_Info_Pane" wizard
    Then check "v3io:///target/path" value in "path" column in "Overview_Table" table on "Files_Info_Pane" wizard
    Then click on "Register_File_Button" element on "Files" wizard
    Then type value "test-artifact" to "New_File_Name_Input" field on "Register_File_Popup" wizard
    Then type value "latest" to "Tag_Input" field on "Register_File_Popup" wizard
    When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_Dataset" wizard
    When type value "target/path" to "Path_Scheme_Combobox" field on "Target_Path" on "Register_Dataset" wizard
    Then click on "Register_Button" element on "Register_File_Popup" wizard
    Then verify if "Confirm_Popup" popup dialog appears
    Then "Title" element on "Confirm_Popup" should contains "Overwrite artifact?" value
    Then verify "Cross_Cancel_Button" element visibility on "Confirm_Popup" wizard
    Then verify "Confirm_Dialog_Message" element visibility on "Confirm_Popup" wizard
    Then "Confirm_Dialog_Message" component on "Confirm_Popup" should be equal "Register_Artifact"."Register_Error_Message"
    Then verify "Cancel_Button" element visibility on "Confirm_Popup" wizard
    Then "Cancel_Button" element on "Confirm_Popup" should contains "Cancel" value
    Then verify "Overwrite_Button" element visibility on "Confirm_Popup" wizard
    Then "Overwrite_Button" element on "Confirm_Popup" should contains "Overwrite" value
    When click on "Cancel_Button" element on "Confirm_Popup" wizard

  @MLA
  @passive
  @inProgress
  @smoke
  Scenario: MLA007 - Check all mandatory components in Item infopane on Overview tab table
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then verify "Info_Pane_Tab_Selector" element visibility on "Files_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    Then verify "Header" element visibility on "Files_Info_Pane" wizard
    Then verify "Updated" element visibility on "Files_Info_Pane" wizard
    Then verify "Action_Menu" element visibility on "Files_Info_Pane" wizard
    Then verify "Action_Menu" dropdown element on "Files_Info_Pane" wizard should contains "Common_Lists"."Action_Menu_List"
    Then select "Download" option in action menu on "Files_Info_Pane" wizard
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
    Then verify "Cross_Close_Button" element visibility on "Files_Info_Pane" wizard
    Then verify "Full_View_Button" element visibility on "Files_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Overview_General_Headers"
    Then verify "Overview_Hash_Header" on "Files_Info_Pane" wizard should display "Label_Hint"."Overview_Hash"
    Then verify "Overview_UID_Header" on "Files_Info_Pane" wizard should display "Label_Hint"."Overview_UID"
    Then verify "Overview_Producer_Headers" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Overview_Producer_Headers"
    Then verify "Overview_Sources_Headers" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Overview_Sources_Headers"
    Then click on "Full_View_Button" element on "Files_Info_Pane" wizard
    Then verify "Cross_Close_Button" element not exists on "Files_Info_Pane" wizard
    Then click on "Tabel_View_Button" element on "Files_Info_Pane" wizard
    Then verify "Cross_Close_Button" element visibility on "Files_Info_Pane" wizard

  @MLA
  @passive
  @smoke
  Scenario: MLA013 - Check Details panel still active on page refresh
    # * set tear-down property "project" created with "automation-test" value
    # * set tear-down property "file" created in "automation-test" project with "test-file" value
    * create "automation-test" MLRun Project with code 201
    * create "test-file" File with "test" tag in "automation-test" project with code 200
    Given open url
    And wait load page
    And click on row root with value "automation-test" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then verify "Table_FilterBy_Button" element on "Files" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button"
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then select "test" option in "Table_Tree_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    When click on cell with value "test-file" in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then check "test" value in "tag" column in "Overview_Table" table on "Files_Info_Pane" wizard
    Then click on "Edit_btn_table_view" element on "Files_Info_Pane" wizard
    And wait load page
    When type value "v1" to "Version_tag_Input" field on "Files_Info_Pane" wizard
    Then click on "Apply_Button" element on "Files_Info_Pane" wizard
    Then click on "Apply_Changes_Button" element on "Files_Info_Pane" wizard
    And wait load page
    Then verify "Info_Pane_Tab_Selector" element visibility on "Files_Info_Pane" wizard
    Then verify "Not_In_Filtered_List_Message" element visibility on "Files_Info_Pane" wizard
    Then "Not_In_Filtered_List_Message" component on "Files_Info_Pane" should be equal "Files_Info_Pane"."Info_Banner_Message"
    Then verify "Info_Pane_Tab_Selector" element visibility on "Files_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    Then verify "Header" element visibility on "Files_Info_Pane" wizard
    Then "Header" element on "Files_Info_Pane" should contains "test-file" value
    Then refresh a page
    And wait load page
    Then verify "Info_Pane_Tab_Selector" element visibility on "Files_Info_Pane" wizard
    Then verify "Not_In_Filtered_List_Message" element visibility on "Files_Info_Pane" wizard
    Then "Not_In_Filtered_List_Message" component on "Files_Info_Pane" should be equal "Files_Info_Pane"."Info_Banner_Message"
    Then verify "Info_Pane_Tab_Selector" element visibility on "Files_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    Then verify "Header" element visibility on "Files_Info_Pane" wizard
    Then "Header" element on "Files_Info_Pane" should contains "test-file" value
    Then verify "Table_Refresh_Button" element visibility on "Files" wizard
    Then verify "Table_Refresh_Button" element on "Files" wizard should display hover tooltip "Common_Tooltips"."Refresh_Button"
    Then click on "Table_Refresh_Button" element on "Files" wizard
    And wait load page
    Then verify "Info_Pane_Tab_Selector" element visibility on "Files_Info_Pane" wizard
    Then verify "Not_In_Filtered_List_Message" element visibility on "Files_Info_Pane" wizard
    Then "Not_In_Filtered_List_Message" component on "Files_Info_Pane" should be equal "Files_Info_Pane"."Info_Banner_Message"
    Then verify "Info_Pane_Tab_Selector" element visibility on "Files_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    Then verify "Header" element visibility on "Files_Info_Pane" wizard
    Then click on "Cross_Close_Button" element on "Files_Info_Pane" wizard
    And wait load page
    Then verify "Header" element not exists on "Files_Info_Pane" wizard
    When click on cell with value "test-file" in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then verify "Info_Pane_Tab_Selector" element visibility on "Files_Info_Pane" wizard
    Then verify "Not_In_Filtered_List_Message" element not exists on "Files_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "Files_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    Then verify "Header" element visibility on "Files_Info_Pane" wizard

  @MLA
  @passive
  @inProgress
  @smoke
  Scenario: MLA016 - Check all mandatory components in Item infopane on Preview tab table
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 3 in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then select "Preview" tab in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    And wait load page
    Then verify "Info_Pane_Tab_Selector" element visibility on "Files_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Tab_List"
    Then verify "Preview" tab is active in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    Then verify "Header" element visibility on "Files_Info_Pane" wizard
    Then verify "Updated" element visibility on "Files_Info_Pane" wizard
    Then verify "Action_Menu" element visibility on "Files_Info_Pane" wizard
    Then verify "Action_Menu" dropdown element on "Files_Info_Pane" wizard should contains "Common_Lists"."Action_Menu_List"
    Then verify "Cross_Close_Button" element visibility on "Files_Info_Pane" wizard
    When click on cell with value "test-i" in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then verify "Preview" tab is active in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    When click on cell with value "download_content" in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then verify "Pop_Out_Button" element visibility on "Files_Info_Pane" wizard 
    Then click on "Pop_Out_Button" element on "Files_Info_Pane" wizard
    And wait load page
    Then verify "Preview_Row" element visibility on "Artifact_Preview_Popup" wizard
    Then verify "Cross_Cancel_Button" element visibility on "Artifact_Preview_Popup" wizard
    Then verify "Preview_Header" on "Artifact_Preview_Popup" wizard should contains "Preview_Pop_Up"."Table_Header"
    Then check "download_btn" visibility in "Preview_Row" on "Artifact_Preview_Popup" wizard with 1 offset
    Then click on "Download_Button" element on "Artifact_Preview_Popup" wizard
    And wait load page
    And wait load page
    Then verify "Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Download_Pop_Up_Cross_Cancel_Button" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Header_Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    Then "Header_Download_Pop_Up" element on "Downloads_Popup" should contains "Downloads" value
    Then click on "Download_Pop_Up_Cross_Cancel_Button" element on "Downloads_Popup" wizard
    Then click on "Cross_Cancel_Button" element on "Artifact_Preview_Popup" wizard
    Then verify "Preview_Tab_Info_Pane_Table" element visibility on "Files_Info_Pane" wizard

  @MLA
  @smoke
  Scenario: MLA022 - Verify the Delete option state in Artifacts table and Overview details action menu 
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And select "tab" with "Artifacts" value in breadcrumbs menu
    And wait load page
    Then verify action menu on "Files" wizard in "Files_Table" table with "survival-curves_km-survival" value in "name" column should contains "Common_Lists"."Action_Menu_List"
    Then verify that in action menu on "Files" wizard in "Files_Table" table with "survival-curves_km-survival" value in "name" column "Delete" option is enabled
    Then verify that in action menu on "Files" wizard in "Files_Table" table with "survival-curves_km-survival" value in "name" column "Delete all versions" option is enabled
    When click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then check "latest" value in "tag" column in "Overview_Table" table on "Files_Info_Pane" wizard
    Then verify "Action_Menu" element visibility on "Files_Info_Pane" wizard
    Then verify "Action_Menu" dropdown element on "Files_Info_Pane" wizard should contains "Common_Lists"."Action_Menu_List"
    Then check that "Delete" option in action menu on "Files_Info_Pane" wizard is enabled
    Then check that "Delete all versions" option in action menu on "Files_Info_Pane" wizard is enabled
    Then click on "Cross_Close_Button" element on "Files_Info_Pane" wizard
    And wait load page
    Then verify "show_all_versions" option is present on "Files" wizard in "Files_Table" table with "survival-curves_km-survival" value in "name" column
    Then verify "show_all_versions" option on "Files" wizard in "Files_Table" table with "survival-curves_km-survival" value in "name" column should display hover tooltip "Common_Tooltips"."Show_All_Versions" with scroll "false"
    Then click on "show_all_versions" option on "Files" wizard in "Files_Table" table with "survival-curves_km-survival" value in "name" column with scroll "false"
    And wait load page
    Then verify "History_Back_Button" element visibility on "Files" wizard
    Then verify "Version_History_Title" element visibility on "Files" wizard
    Then "Version_History_Title" element on "Files" should contains "Version history:" value
    Then verify "Version_History_Model_Name" element visibility on "Files" wizard
    Then "Version_History_Model_Name" element on "Files" should contains "survival-curves_km-survival" value
    Then verify "Table_Refresh_Button" element visibility on "Files" wizard
    Then verify "Register_File_Button" element visibility on "Files" wizard
    Then verify "Table_FilterBy_Button" element visibility on "Files" wizard
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then "Show_Iterations_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
    Then verify action menu on "Files" wizard in "Files_Table" table with "5a44b12b-9ef3-4239-87e8-e0cbdae-17" value in "uid" column should contains "Common_Lists"."Action_Menu_List_Version_History"
    Then verify that in action menu on "Files" wizard in "Files_Table" table with "5a44b12b-9ef3-4239-87e8-e0cbdae-17" value in "uid" column "Delete" option is enabled
    When click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then check "latest" value in "tag" column in "Overview_Table" table on "Files_Info_Pane" wizard
    Then verify "Action_Menu" element visibility on "Files_Info_Pane" wizard
    Then verify "Action_Menu" dropdown element on "Files_Info_Pane" wizard should contains "Common_Lists"."Action_Menu_List_Version_History"
    Then check that "Delete" option in action menu on "Files_Info_Pane" wizard is enabled
    Then verify "Header" element visibility on "Files_Info_Pane" wizard
    Then "Header" element on "Files_Info_Pane" should contains "survival-curves_km-survival" value
    Then click on "Register_File_Button" element on "Files" wizard
    Then verify if "Register_File_Popup" popup dialog appears
    Then type value "survival-curves_km-survival" to "New_File_Name_Input" field on "Register_File_Popup" wizard
    When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_File_Popup" wizard
    When type value "target/path" to "Path_Scheme_Combobox" field on "Target_Path" on "Register_File_Popup" wizard
    Then click on "Register_Button" element on "Register_File_Popup" wizard
    Then verify if "Confirm_Popup" popup dialog appears
    Then "Title" element on "Confirm_Popup" should contains "Overwrite artifact?" value
    When click on "Overwrite_Button" element on "Confirm_Popup" wizard
    And wait load page
    Then click on "History_Back_Button" element on "Files" wizard
    When click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then verify "Header" element visibility on "Files_Info_Pane" wizard
    Then "Header" element on "Files_Info_Pane" should contains "survival-curves_km-survival" value
    Then verify "Not_In_Filtered_List_Message" element visibility on "Files_Info_Pane" wizard
    Then "Not_In_Filtered_List_Message" component on "Files_Info_Pane" should be equal "Files_Info_Pane"."Info_Banner_Message"
    #TODO: Verify that editing the tag to an empty string '' will delete the artifact instance
    
  @MLA
  @passive
  @inProgress
  @smoke
  Scenario: MLA017 - Check expand sources Item infopane on Overview tab table
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 2 in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then verify "Info_Pane_Tab_Selector" element visibility on "Files_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    Then verify "Overview_Sources_Headers" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Overview_Sources_Headers"
    Then verify "Overview_Sources_Headers" element visibility on "Files_Info_Pane" wizard
    When click on cell with value "raw-data" in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then click on "Source_Path" element on "Files_Info_Pane" wizard
    And wait load page
    Then verify if "Modal_Transition_Popup" popup dialog appears
    Then verify "Title" element visibility on "Modal_Transition_Popup" wizard
    Then "Title" element on "Modal_Transition_Popup" should contains "survival-curves_km-timelines" value
    Then verify "Data_Status" element visibility on "Modal_Transition_Popup" wizard
    Then "Data_Status" element on "Modal_Transition_Popup" should contains "Aug 29, 2021, 07:54:15 PM" value
    Then verify "Refresh_Button" element visibility on "Modal_Transition_Popup" wizard
    Then click on "Refresh_Button" element on "Modal_Transition_Popup" wizard
    And wait load page
    Then verify "Refresh_Button" element visibility on "Modal_Transition_Popup" wizard
    Then verify "Action_Menu" element visibility on "Modal_Transition_Popup" wizard
    Then verify "Action_Menu" dropdown element on "Modal_Transition_Popup" wizard should contains "Common_Lists"."Action_Menu_List_Dataset_Transition_Popup"
    Then verify "Cross_Close_Button" element visibility on "Modal_Transition_Popup" wizard
    Then click on "Cross_Close_Button" element on "Modal_Transition_Popup" wizard
    And wait load page
    Then click on "Source_Path" element on "Files_Info_Pane" wizard
    And wait load page
    Then select "Download" option in action menu on "Modal_Transition_Popup" wizard
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
    Then select "Copy URI" option in action menu on "Modal_Transition_Popup" wizard
    And wait load page
    Then verify if "Notification_Popup" popup dialog appears
    Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
    Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Copied to clipboard successfully" value
    Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
    Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
    Then select "View YAML" option in action menu on "Modal_Transition_Popup" wizard
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
    Then click on "Cross_Cancel_Button" element on "View_YAML" wizard
    Then verify "Tab_Selector" on "Modal_Transition_Popup" wizard should contains "Datasets_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Tab_Selector" on "Modal_Transition_Popup" wizard
    Then select "Preview" tab in "Tab_Selector" on "Modal_Transition_Popup" wizard
    Then verify "Preview" tab is active in "Tab_Selector" on "Modal_Transition_Popup" wizard
    Then select "Metadata" tab in "Tab_Selector" on "Modal_Transition_Popup" wizard
    Then verify "Metadata" tab is active in "Tab_Selector" on "Modal_Transition_Popup" wizard
    Then select "Analysis" tab in "Tab_Selector" on "Modal_Transition_Popup" wizard
    Then verify "Analysis" tab is active in "Tab_Selector" on "Modal_Transition_Popup" wizard
    Then select "Overview" tab in "Tab_Selector" on "Modal_Transition_Popup" wizard
    Then verify "Overview" tab is active in "Tab_Selector" on "Modal_Transition_Popup" wizard
    Then verify "Overview_General_Headers" on "Modal_Transition_Popup" wizard should contains "Datasets_Info_Pane"."Overview_General_Headers"
    Then verify "Overview_Producer_Headers" on "Modal_Transition_Popup" wizard should contains "Datasets_Info_Pane"."Overview_Producer_Headers"
    Then verify "Overview_Sources_Headers" element visibility on "Modal_Transition_Popup" wizard
    Then verify "Overview_Sources_Headers" on "Modal_Transition_Popup" wizard should contains "Datasets_Info_Pane"."Overview_Sources_Headers"

  @MLA
  @passive
  @smoke
  Scenario: MLA018 - Check MLRun logo redirection
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    And click on "MLRun_Logo" element on "commonPagesHeader" wizard
    And wait load page
    And wait load page
    Then verify "Projects_Table" element visibility on "Projects" wizard

  @MLA
  @passive
  @smoke
  Scenario: MLA014 - Verify action menu list, Downloads action,  View YAML action
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify action menu on "Files" wizard in "Files_Table" table with "training_iteration_results" value in "name" column should contains "Common_Lists"."Action_Menu_List"
    Then select "Download" option in action menu on "Files" wizard in "Files_Table" table at row with "training_iteration_results" value in "name" column
    And wait load page
    And wait load page
    Then verify "Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Download_Pop_Up_Cross_Cancel_Button" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Header_Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    Then "Header_Download_Pop_Up" element on "Downloads_Popup" should contains "Downloads" value
    Then click on "Download_Pop_Up_Cross_Cancel_Button" element on "Downloads_Popup" wizard
    Then select "View YAML" option in action menu on "Files" wizard in "Files_Table" table at row with "training_iteration_results" value in "name" column
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
    Then click on "Cross_Cancel_Button" element on "View_YAML" wizard
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then uncheck "Show_Iterations_Checkbox" element on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    Then select "View YAML" option in action menu on "Files" wizard in "Files_Table" table at row with "training_iteration_results" value in "name" column
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

  @MLA
  @passive
  @smoke
  Scenario: MLA015 - Verify Preview option, view Preview action
      Given open url
      And wait load page
      And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
      And wait load page
      Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
      And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
      And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
      And hover "MLRun_Logo" component on "commonPagesHeader" wizard
      And wait load page
      Then verify "preview" option is present on "Files" wizard in "Files_Table" table with "training_iteration_results" value in "name" column
      Then click on "preview" option on "Files" wizard in "Files_Table" table with "training_iteration_results" value in "name" column with scroll "false"
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
      Then click on "Cross_Cancel_Button" element on "Preview_Popup" wizard
      
  @MLA
  @passive
  @smoke
  Scenario: MLA019 - Verify View YAML action in Item infopane
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then verify "Action_Menu" element visibility on "Files_Info_Pane" wizard
    Then select "View YAML" option in action menu on "Files_Info_Pane" wizard
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

  @MLA 
  @smoke
  Scenario: MLA020 - Check broken link redirection
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    Then click on "Project_Monitoring_Button" element on "commonPagesHeader" wizard
    And wait load page
    And select "tab" with "Artifacts" value in breadcrumbs menu
    And wait load page
    When click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then verify redirection from "projects/default/files/INVALID/:latest@5a44b12b-9ef3-4239-87e8-e0cbdae-98/overview?bePage=1&fePage=1" to "projects/default/files?bePage=1&fePage=1"
    And wait load page
    Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
    And wait load page
    Then "Notification_Pop_Up" element on "Notification_Popup" should contains "An error occurred while retrieving the artifact." value
    And wait load page
    Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
    Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
    And select "tab" with "Datasets" value in breadcrumbs menu
    And wait load page
    And select "tab" with "Artifacts" value in breadcrumbs menu
    And wait load page
    When click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then verify redirection from "projects/default/files/training_iteration_results/:latest@5a44b12b-9ef3-4239-87e8-e0cbdae-98/INVALID?bePage=1&fePage=1" to "projects/default/files/training_iteration_results/:latest@5a44b12b-9ef3-4239-87e8-e0cbdae-98/overview?bePage=1&fePage=1"
    And wait load page
    Then select "Preview" tab in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    And wait load page
    Then verify redirection from "projects/default/files/training_iteration_results/:latest@5a44b12b-9ef3-4239-87e8-e0cbdae-98/INVALID?bePage=1&fePage=1" to "projects/default/files/training_iteration_results/:latest@5a44b12b-9ef3-4239-87e8-e0cbdae-98/overview?bePage=1&fePage=1"
    And wait load page
    Then verify redirection from "projects/default/files/training_iteration_results/:INVALID/overview?bePage=1&fePage=1" to "projects/default/files?bePage=1&fePage=1"
    And wait load page
     Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
    And wait load page
    Then "Notification_Pop_Up" element on "Notification_Popup" should contains "An error occurred while retrieving the artifact." value
    And wait load page
    Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
    Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
    Then verify redirection from "projects/INVALID/files?bePage=1&fePage=1" to "projects"
    And wait load page

  @MLA
  @smoke
  Scenario: MLA021 - Check active/highlited items with details panel on Artifacts
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then verify "Info_Pane_Tab_Selector" element visibility on "Files_Info_Pane" wizard
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    Then verify "Header" element visibility on "Files_Info_Pane" wizard
    Then save to context "name" column on 1 row from "Files_Table" table on "Files" wizard
    Then compare "Header" element value on "Files_Info_Pane" wizard with test "name" context value
	  Then verify that row index 1 is active in "Files_Table" table on "Files" wizard
    Then verify that row index 2 is NOT active in "Files_Table" table on "Files" wizard
    Then click on cell with row index 2 in "name" column in "Files_Table" table on "Files" wizard  
    Then verify that row index 2 is active in "Files_Table" table on "Files" wizard   
    Then verify that row index 1 is NOT active in "Files_Table" table on "Files" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "Files_Info_Pane" wizard
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    Then verify "Header" element visibility on "Files_Info_Pane" wizard
    Then save to context "name" column on 2 row from "Files_Table" table on "Files" wizard
    Then compare "Header" element value on "Files_Info_Pane" wizard with test "name" context value

  @MLA
  @smoke
  Scenario: MLA009 - Check that version tag is filled when edit it in table view and full view on Overview tab table on Artifacts page
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then verify "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Overview_General_Headers"
    Then check "latest" value in "tag" column in "Overview_Table" table on "Files_Info_Pane" wizard
    Then verify "Edit_btn_table_view" element not exists on "Files_Info_Pane" wizard    
    Then click on "Full_View_Button" element on "Files_Info_Pane" wizard
    Then verify "Cross_Close_Button" element not exists on "Files_Info_Pane" wizard
    Then verify "Edit_btn_full_view" element not exists on "Files_Info_Pane" wizard   
    Then "Version_tag_Value_full_view" element on "Files_Info_Pane" should contains "latest" value
    Then click on "Tabel_View_Button" element on "Files_Info_Pane" wizard
    Then verify "Cross_Close_Button" element visibility on "Files_Info_Pane" wizard

  @MLA
  @smoke
  Scenario: MLA010 - Check that version tag dropdown shows all tags on filters wizard on Artifacts page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 2 in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then verify "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Overview_General_Headers"
    Then check "latest" value in "tag" column in "Overview_Table" table on "Files_Info_Pane" wizard
    Then verify "Edit_btn_table_view" element not exists on "Files_Info_Pane" wizard
    Then select "Add a tag" option in action menu on "Files_Info_Pane" wizard
    And wait load page
    Then verify "Add_Tag_Popup" element visibility on "Add_Tag_Popup" wizard
    Then type value "newTag" to "Tag_Input" field on "Add_Tag_Popup" wizard
    Then click on "Add_Button" element on "Add_Tag_Popup" wizard
    And wait load page
    Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
    And wait load page
    Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Tag was added successfully" value
    And wait load page
    Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
    Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
    Then verify "Table_FilterBy_Button" element visibility on "Files" wizard
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then select "newTag" option in "Table_Tree_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    Then check "newTag" value in "tag" column in "Files_Table" table on "Files" wizard

  @MLA
  @smoke
  Scenario: MLA011 - Check that version tag has "Click to add" status when it's empty after edited
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on "show_all_versions" option on "Files" wizard in "Files_Table" table with "download_content" value in "name" column with scroll "false"
    And wait load page
    Then click on "Register_File_Button" element on "Files" wizard
    Then verify if "Register_File_Popup" popup dialog appears
    Then type value "download_content" to "New_File_Name_Input" field on "Register_File_Popup" wizard
    When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_File_Popup" wizard
    When type value "target/path" to "Path_Scheme_Combobox" field on "Target_Path" on "Register_File_Popup" wizard
    Then click on "Register_Button" element on "Register_File_Popup" wizard
    Then verify if "Confirm_Popup" popup dialog appears
    Then "Title" element on "Confirm_Popup" should contains "Overwrite artifact?" value
    When click on "Overwrite_Button" element on "Confirm_Popup" wizard
    And wait load page
    When click on cell with row index 2 in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then verify "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Overview_General_Headers"   
    Then "Version_Tag_Input_Placeholder" element on "Files_Info_Pane" should contains "Click to add" value

  @MLA
  @smoke
  Scenario: MLA012 - Check filter by "All" tag is performed when version tag was edited
    Given open url
    And wait load page
    And click on row root with value "cat-vs-dog-classification" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on "show_all_versions" option on "Files" wizard in "Files_Table" table with "images" value in "name" column with scroll "false"
    And wait load page
    Then verify "History_Back_Button" element visibility on "Files" wizard
    Then verify "Version_History_Title" element visibility on "Files" wizard
    Then "Version_History_Title" element on "Files" should contains "Version history:" value
    Then verify "Version_History_Model_Name" element visibility on "Files" wizard
    Then "Version_History_Model_Name" element on "Files" should contains "images" value
    Then verify "Table_Refresh_Button" element visibility on "Files" wizard
    Then verify "Register_File_Button" element visibility on "Files" wizard
    Then verify "Table_FilterBy_Button" element visibility on "Files" wizard
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    And wait load page
    Then verify "Title" element visibility on "FilterBy_Popup" wizard
    Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
    Then verify "Table_Tree_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
    Then verify "Table_Tree_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected attribute option value "All tags"
    Then verify "Show_Iterations_Checkbox" element visibility on "FilterBy_Popup" wizard
    Then "Show_Iterations_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
    Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
    Then verify "Clear_Button" element on "FilterBy_Popup" wizard is disabled
    Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
    Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then verify "Files_Table" element visibility on "Files" wizard
    Then click on "Register_File_Button" element on "Files" wizard
    Then verify if "Register_File_Popup" popup dialog appears
    Then type value "images" to "New_File_Name_Input" field on "Register_File_Popup" wizard
    When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_File_Popup" wizard
    When type value "target/path" to "Path_Scheme_Combobox" field on "Target_Path" on "Register_File_Popup" wizard
    Then click on "Register_Button" element on "Register_File_Popup" wizard
    Then verify if "Confirm_Popup" popup dialog appears
    Then "Title" element on "Confirm_Popup" should contains "Overwrite artifact?" value
    When click on "Overwrite_Button" element on "Confirm_Popup" wizard
    And wait load page
    When click on cell with row index 2 in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then "Version_Tag_Input_Placeholder" element on "Files_Info_Pane" should contains "Click to add" value
    Then click on "Click_To_Add_Button" element on "Files_Info_Pane" wizard
    Then type value "latest123456" to "Version_tag_Input" field on "Files_Info_Pane" wizard
    Then click on "Apply_Button" element on "Files_Info_Pane" wizard
    Then click on "Apply_Changes_Button" element on "Files_Info_Pane" wizard
    And wait load page
    Then verify "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Overview_General_Headers"
    Then check "latest123456" value in "tag" column in "Overview_Table" table on "Files_Info_Pane" wizard
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    And wait load page
    Then verify "Table_Tree_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected attribute option value "All tags"

  @MLA
  @smoke
  Scenario: MLA023 - Check components on artifact Full view content
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then verify "Full_View_Button" element visibility on "Files_Info_Pane" wizard
    Then click on "Full_View_Button" element on "Files_Info_Pane" wizard
    And wait load page
    Then verify "Cross_Close_Button" element not exists on "Files_Info_Pane" wizard
    Then verify "Header_Full_View" element visibility on "Files_Info_Pane" wizard
    Then "Header_Full_View" element on "Files_Info_Pane" should contains "survival-curves_km-survival" value
    Then verify "Updated_Full_View" element visibility on "Files_Info_Pane" wizard
    Then verify "Refresh_Button_Full_View" element visibility on "Files_Info_Pane" wizard
    Then click on "Refresh_Button_Full_View" element on "Files_Info_Pane" wizard
    And wait load page
    Then verify "Header_Full_View" element visibility on "Files_Info_Pane" wizard
    Then "Header_Full_View" element on "Files_Info_Pane" should contains "survival-curves_km-survival" value
    Then verify "Action_Menu_Full_View" element visibility on "Files_Info_Pane" wizard
    Then verify "Action_Menu_Full_View" dropdown element on "Files_Info_Pane" wizard should contains "Common_Lists"."Action_Menu_List"
    Then click on "Header_Full_View" element on "Files_Info_Pane" wizard
    Then select "Download" option in full view action menu on "Files_Info_Pane" wizard
    And wait load page
    And wait load page
    Then verify "Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    Then select "Add a tag" option in full view action menu on "Files_Info_Pane" wizard
    And wait load page
    And wait load page
    Then verify "Add_Tag_Popup" element visibility on "Add_Tag_Popup" wizard
    Then verify "Close_Button" element visibility on "Add_Tag_Popup" wizard
    Then verify "Title" element visibility on "Add_Tag_Popup" wizard
    Then "Title" element on "Add_Tag_Popup" should contains "Add A Tag" value
    Then verify "Input_Label" element visibility on "Add_Tag_Popup" wizard
    Then "Input_Label" element on "Add_Tag_Popup" should contains "Artifact tag *" value
    Then verify "Tag_Input" element visibility on "Add_Tag_Popup" wizard
    Then verify "Add_Button" element visibility on "Add_Tag_Popup" wizard
    Then "Add_Button" element on "Add_Tag_Popup" should contains "Add" value
    Then verify "Cancel_Button" element visibility on "Add_Tag_Popup" wizard
    Then "Cancel_Button" element on "Add_Tag_Popup" should contains "Cancel" value
    Then type value "newTag" to "Tag_Input" field on "Add_Tag_Popup" wizard
    Then click on "Cancel_Button" element on "Add_Tag_Popup" wizard
    And wait load page
    Then verify if "Common_Popup" popup dialog appears
    Then "Title" element on "Common_Popup" should contains "Are you sure?" value
    Then "Description" element on "Common_Popup" should contains "All changes will be lost" value
    Then click on "Confirm_Button" element on "Common_Popup" wizard
    Then select "Copy URI" option in full view action menu on "Files_Info_Pane" wizard
    And wait load page
    Then verify if "Notification_Popup" popup dialog appears
    Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
    Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Copied to clipboard successfully" value
    Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
    Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
    Then select "View YAML" option in full view action menu on "Files_Info_Pane" wizard
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
    Then click on "Cross_Cancel_Button" element on "View_YAML" wizard
    Then select "Delete" option in full view action menu on "Files_Info_Pane" wizard
    And wait load page
    Then verify if "Delete_Artifact_Popup" popup dialog appears
    Then verify "Delete_Artifact_Popup" element visibility on "Files_Info_Pane" wizard
    Then verify "Close_Button" element visibility on "Delete_Artifact_Popup" wizard
    Then verify "Title" element visibility on "Delete_Artifact_Popup" wizard
    Then "Title" element on "Delete_Artifact_Popup" should contains "Delete artifact?" value
    Then verify "Dialog_Message" element visibility on "Delete_Artifact_Popup" wizard
    Then "Dialog_Message" element on "Delete_Artifact_Popup" should contains "Are you sure you want to delete the artifact \"survival-curves_km-survival\" metadata? Deleted metadata can not be restored." value
    Then verify "Delete_Data_Checkbox" element visibility on "Delete_Artifact_Popup" wizard
    Then "Delete_Data_Checkbox" element should be unchecked on "Delete_Artifact_Popup" wizard
    Then verify "Cancel_Button" element visibility on "Delete_Artifact_Popup" wizard
    Then "Cancel_Button" element on "Delete_Artifact_Popup" should contains "Cancel" value
    Then verify "Delete_Button" element visibility on "Delete_Artifact_Popup" wizard
    Then "Delete_Button" element on "Delete_Artifact_Popup" should contains "Delete" value
    Then click on "Delete_Button" element on "Delete_Artifact_Popup" wizard
    And wait load page
    Then verify if "Notification_Popup" popup dialog appears
    Then verify "Notification_Pop_Up" element visibility on "Notification_Popup" wizard
    Then "Notification_Pop_Up" element on "Notification_Popup" should contains "Artifact is successfully deleted" value
    Then verify "Notification_Pop_Up_Cross_Close_Button" element visibility on "Notification_Popup" wizard
    Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
    Then check "survival-curves_km-survival" value not in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then verify "Full_View_Button" element visibility on "Files_Info_Pane" wizard
    Then click on "Full_View_Button" element on "Files_Info_Pane" wizard
    And wait load page
    Then verify "Cross_Close_Button" element not exists on "Files_Info_Pane" wizard
    Then verify "Header_Full_View" element visibility on "Files_Info_Pane" wizard
    Then "Header_Full_View" element on "Files_Info_Pane" should contains "clean-data_preproc-numcat_map.json" value
    Then select "Add a tag" option in full view action menu on "Files_Info_Pane" wizard
    And wait load page
    And wait load page
    Then verify "Add_Tag_Popup" element visibility on "Add_Tag_Popup" wizard
    Then verify "Title" element visibility on "Add_Tag_Popup" wizard
    Then type value "newTag" to "Tag_Input" field on "Add_Tag_Popup" wizard
    Then click on "Add_Button" element on "Add_Tag_Popup" wizard
    And wait load page
    Then verify "Header_Full_View" element visibility on "Files_Info_Pane" wizard
    Then "Header_Full_View" element on "Files_Info_Pane" should contains "clean-data_preproc-numcat_map.json" value
    Then click on "Tabel_View_Button" element on "Files_Info_Pane" wizard
    And wait load page
    Then verify "Cross_Close_Button" element visibility on "Files_Info_Pane" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then select "newTag" option in "Table_Tree_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then check "newTag" value in "tag" column in "Overview_Table" table on "Files_Info_Pane" wizard
