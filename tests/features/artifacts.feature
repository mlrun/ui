Feature: Files Page

  Testcases that verifies functionality on Files Page

  @MLA
  @passive
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
    Then verify "Table_Label_Filter_Input" element visibility on "Artifacts_FilterBy_Popup" wizard
    Then verify "Table_Tree_Filter_Dropdown" element visibility on "Artifacts_FilterBy_Popup" wizard
    Then verify "Show_Iterations_Checkbox" element visibility on "Artifacts_FilterBy_Popup" wizard
    Then verify "Table_Refresh_Button" element visibility on "Files" wizard
    Then verify "Files_Table" element visibility on "Files" wizard
    Then verify "Register_File_Button" element visibility on "Files" wizard
    Then "Register_File_Button" element on "Files" should contains "Register artifact" value
    Then verify "Table_Tree_Filter_Dropdown" dropdown element on "Artifacts_FilterBy_Popup" wizard should contains "Dropdown_Options"."Tag_Filer_Options"

  @MLA
  @passive
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
  Scenario: MLA003 - Verify filtering by file label on Artifacts page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And select "tab" with "Artifacts" value in breadcrumbs menu
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then type value "owner" to "Table_Label_Filter_Input" field on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then value in "labels" column with "dropdowns" in "Files_Table" on "Files" wizard should contains "owner"
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then type value "v3io_user=admin" to "Table_Label_Filter_Input" field on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then value in "labels" column with "dropdowns" in "Files_Table" on "Files" wizard should contains "v3io_user=admin"
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then type value "v3io_user=123" to "Table_Label_Filter_Input" field on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
    Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."No_Files_data"

  @MLA
  @passive
  Scenario: MLA004 - Verify behaviour of Show iterations checkbox on Artifacts tab
    Given open url
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then verify "Show_Iterations_Checkbox" element visibility on "Artifacts_FilterBy_Popup" wizard
    Then check "expand_btn" not presented in "Files_Table" on "Files" wizard
    Then uncheck "Show_Iterations_Checkbox" element on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then "Show_Iterations_Checkbox" element should be unchecked on "Artifacts_FilterBy_Popup" wizard
    Then check "expand_btn" visibility in "Files_Table" on "Files" wizard
    Then click on cell with row index 1 in "expand_btn" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    Then verify "Header" element visibility on "Files_Info_Pane" wizard
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then check "Show_Iterations_Checkbox" element on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then verify "Header" element not exists on "Files_Info_Pane" wizard
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then "Show_Iterations_Checkbox" element should be checked on "Artifacts_FilterBy_Popup" wizard
    Then check "expand_btn" not presented in "Files_Table" on "Files" wizard

  @MLA
  @passive
  @inProgress
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
    Then verify "New_File_Name_Input" options rules on form "Register_File_Popup" wizard
    Then verify options in "Path_Scheme_Combobox" combobox in "Target_Path" on "Register_File_Popup" wizard should contains "Register_Artifact"."Combobox_Options"
    When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_File_Popup" wizard
    When type value "  " to "Path_Scheme_Combobox" field on "Target_Path" on "Register_File_Popup" wizard
    Then verify "Path_Scheme_Combobox" element in "Target_Path" on "Register_File_Popup" wizard should display warning "Input_Hint"."V3IO_Path_Hint"
    Then verify "New_File_Description_Input" element visibility on "Register_File_Popup" wizard
    Then type value "   " to "New_File_Description_Input" field on "Register_File_Popup" wizard
    Then verify "New_File_Description_Input" on "Register_File_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
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

  @MLA
  Scenario: MLA006 - Verify behaviour on Register new Artifact
    * set tear-down property "project" created with "automation-test" value
    * create "automation-test" MLRun Project with code 201
    Given open url
    And wait load page
    And click on row root with value "automation-test" in "name" column in "Projects_Table" table on "Projects" wizard
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
    Then value in "name" column with "text" in "Files_Table" on "Files" wizard should contains "test-artifact"
    Then value in "type" column with "text" in "Files_Table" on "Files" wizard should contains "table"
    Then click on cell with value "test-artifact" in "name" column in "Files_Table" table on "Files" wizard
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
    Then "Register_Error_Message" component on "Register_File_Popup" should be equal "Register_Artifact"."Register_Error_Message"

  @MLA
  @passive
  @inProgress
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
  Scenario: MLA013 - Check Details panel still active on page refresh
    * set tear-down property "project" created with "automation-test" value
    * set tear-down property "file" created in "automation-test" project with "test-file" value
    * create "automation-test" MLRun Project with code 201
    * create "test-file" File with "test" tag in "automation-test" project with code 200
    Given open url
    And wait load page
    And click on row root with value "automation-test" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    When click on cell with value "test-file" in "name" column in "Files_Table" table on "Files" wizard
    Then check "latest" value in "tag" column in "Overview_Table" table on "Files_Info_Pane" wizard
    Then click on "Edit_btn_table_view" element on "Files_Info_Pane" wizard
    And wait load page
    When type value "v1" to "Version_tag_Input" field on "Files_Info_Pane" wizard
    Then click on "Apply_Button" element on "Files_Info_Pane" wizard
    Then click on "Apply_Changes_Button" element on "Files_Info_Pane" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then select "v1" option in "Table_Tree_Filter_Dropdown" dropdown on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    When click on cell with value "test-file" in "name" column in "Files_Table" table on "Files" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "Files_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    Then verify "Header" element visibility on "Files_Info_Pane" wizard
    Then "Header" element on "Files_Info_Pane" should contains "test-file" value
    Then refresh a page
    Then verify "Header" element visibility on "Files_Info_Pane" wizard
    Then "Header" element on "Files_Info_Pane" should contains "test-file" value

  @MLA
  @passive
  @inProgress
  Scenario: MLA016 - Check all mandatory components in Item infopane on Preview tab table
    Given open url
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
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
    When click on cell with value "survival-curves_km-survival" in "name" column in "Files_Table" table on "Files" wizard
    Then select "Preview" tab in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    And wait load page
    Then verify "Pop_Out_Button" element visibility on "Files_Info_Pane" wizard 
    Then click on "Pop_Out_Button" element on "Files_Info_Pane" wizard
    And wait load page
    Then verify "Preview_Header" element visibility on "Artifact_Preview_Popup" wizard
    Then verify "Cross_Cancel_Button" element visibility on "Artifact_Preview_Popup" wizard
    Then check "download_btn" visibility in "Preview_Header" on "Artifact_Preview_Popup" wizard
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
#    Then verify "Preview_Tab_Info_Pane_Table" element visibility on "Files_Info_Pane" wizard
#    TO DO: should be implemented mock requests

  @MLA
  Scenario: MLA022 - Verify the Delete option state in Artifacts table and Overview details action menu 
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And select "tab" with "Artifacts" value in breadcrumbs menu
    And wait load page
    Then verify action menu on "Files" wizard in "Files_Table" table with "survival-curves_km-survival" value in "name" column should contains "Common_Lists"."Action_Menu_List"
    Then verify that in action menu on "Files" wizard in "Files_Table" table with "survival-curves_km-survival" value in "name" column "Delete" option is enabled
    When click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    Then check "latest" value in "tag" column in "Overview_Table" table on "Files_Info_Pane" wizard
    Then verify "Action_Menu" element visibility on "Files_Info_Pane" wizard
    Then verify "Action_Menu" dropdown element on "Files_Info_Pane" wizard should contains "Common_Lists"."Action_Menu_List"
    Then check that "Delete" option in action menu on "Files_Info_Pane" wizard is enabled
    Then click on "Edit_btn_table_view" element on "Files_Info_Pane" wizard
    And wait load page
    When type value "" to "Version_tag_Input" field on "Files_Info_Pane" wizard
    Then click on "Apply_Button" element on "Files_Info_Pane" wizard
    Then click on "Apply_Changes_Button" element on "Files_Info_Pane" wizard
    And wait load page
    Then verify "Table_FilterBy_Button" element visibility on "Files" wizard
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then select "All" option in "Table_Tree_Filter_Dropdown" dropdown on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then verify action menu on "Files" wizard in "Files_Table" table with "survival-curves_km-survival" value in "name" column should contains "Common_Lists"."Action_Menu_List"
    Then verify that in action menu on "Files" wizard in "Files_Table" table with "survival-curves_km-survival" value in "name" column "Delete" option is disabled
    When click on cell with row index 2 in "name" column in "Files_Table" table on "Files" wizard
    Then check "Click to add" value in "tag" column in "Overview_Table" table on "Files_Info_Pane" wizard
    Then verify "Action_Menu" dropdown element on "Files_Info_Pane" wizard should contains "Common_Lists"."Action_Menu_List"
    Then check that "Delete" option in action menu on "Files_Info_Pane" wizard is disabled

  @MLA
  @passive
  @inProgress
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
    Then verify "Info_Pane_Tab_Selector" element visibility on "Files_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    Then verify "Overview_Sources_Headers" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Overview_Sources_Headers"
    Then verify "Overview_Sources_Headers" element visibility on "Files_Info_Pane" wizard

  @MLA
  @passive
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
    Then verify "Projects_Table" element visibility on "Projects" wizard

  @MLA
  @passive
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
    Then verify action menu on "Files" wizard in "Files_Table" table with "test-i" value in "name" column should contains "Common_Lists"."Action_Menu_List"
    Then select "Download" option in action menu on "Files" wizard in "Files_Table" table at row with "test-i" value in "name" column
    And wait load page
    And wait load page
    Then verify "Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Download_Pop_Up_Cross_Cancel_Button" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Header_Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    Then "Header_Download_Pop_Up" element on "Downloads_Popup" should contains "Downloads" value
    Then click on "Download_Pop_Up_Cross_Cancel_Button" element on "Downloads_Popup" wizard
    Then select "View YAML" option in action menu on "Files" wizard in "Files_Table" table at row with "test-i" value in "name" column
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
    Then click on "Cross_Cancel_Button" element on "View_YAML" wizard
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then uncheck "Show_Iterations_Checkbox" element on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then click on cell with row index 1 in "expand_btn" column in "Files_Table" table on "Files" wizard
    Then select "View YAML" option in action menu on "Files" wizard in "Files_Table" table at row with "latest" value in "name_expand_btn" column
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

  @MLA
  @passive
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
      Then click on "preview" option on "Files" wizard in "Files_Table" table with "training_iteration_results" value in "name" column
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
    Then verify "Action_Menu" element visibility on "Files_Info_Pane" wizard
    Then select "View YAML" option in action menu on "Files_Info_Pane" wizard
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

  @MLA 
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
    Then verify redirection from "projects/default/files/INVALID/latest/0/overview" to "projects/default/files"
    When click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then verify redirection from "projects/default/files/training_iteration_results/latest/0/INVALID" to "projects/default/files/training_iteration_results/latest/0/overview"
    And wait load page
    Then select "Preview" tab in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    And wait load page
    Then verify redirection from "projects/default/files/training_iteration_results/latest/0/INVALID" to "projects/default/files/training_iteration_results/latest/0/overview"
    And wait load page
    Then verify redirection from "projects/default/files/training_iteration_results/latest/IVNALID/overview" to "projects/default/files"
    And wait load page
    Then verify redirection from "projects/INVALID/files" to "projects"
    And wait load page

  @MLA
  Scenario: MLA021 - Check active/highlited items with details panel on Artifacts
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
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
    Then verify "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Overview_General_Headers"
    Then check "latest" value in "tag" column in "Overview_Table" table on "Files_Info_Pane" wizard
    Then click on "Edit_btn_table_view" element on "Files_Info_Pane" wizard    
    Then verify "Version_tag_Input_table_view" on "Files_Info_Pane" wizard should contains "latest" value
    Then click on "Full_View_Button" element on "Files_Info_Pane" wizard
    Then verify "Cross_Close_Button" element not exists on "Files_Info_Pane" wizard
    Then click on "Edit_btn_full_view" element on "Files_Info_Pane" wizard
    Then verify "Version_tag_Input_full_view" on "Files_Info_Pane" wizard should contains "latest" value   
    Then click on "Tabel_View_Button" element on "Files_Info_Pane" wizard
    Then verify "Cross_Close_Button" element visibility on "Files_Info_Pane" wizard

  @MLA
  @FAILED_TODO
  #TODO: tag edit implementation on mock
  Scenario: MLA010 - Check that version tag dropdown shows all tags on filters wizard on Artifacts page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 2 in "name" column in "Files_Table" table on "Files" wizard
    Then verify "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Overview_General_Headers"
    Then check "latest" value in "tag" column in "Overview_Table" table on "Files_Info_Pane" wizard
    Then click on "Edit_btn_table_view" element on "Files_Info_Pane" wizard
    And wait load page
    When type value "newTag" to "Version_tag_Input" field on "Files_Info_Pane" wizard
    Then click on "Apply_Button" element on "Files_Info_Pane" wizard
    Then click on "Apply_Changes_Button" element on "Files_Info_Pane" wizard
    And wait load page
    Then verify "Table_FilterBy_Button" element visibility on "Files" wizard
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then select "newTag" option in "Table_Tree_Filter_Dropdown" dropdown on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then check "newTag" value in "tag" column in "Files_Table" table on "Files" wizard

  @MLA
  Scenario: MLA011 - Check that version tag has "Click to add" status when it's empty after edited
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    Then verify "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Overview_General_Headers"   
    Then check "latest" value in "tag" column in "Overview_Table" table on "Files_Info_Pane" wizard
    Then click on "Edit_btn_table_view" element on "Files_Info_Pane" wizard
    Then type value "" to "Version_tag_Input" field on "Files_Info_Pane" wizard
    Then click on "Apply_Button" element on "Files_Info_Pane" wizard
    Then click on "Apply_Changes_Button" element on "Files_Info_Pane" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then select "All" option in "Table_Tree_Filter_Dropdown" dropdown on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    And wait load page
    Then "Version_Tag_Input_Placeholder" element on "Files_Info_Pane" should contains "Click to add" value

  @MLA
  @FAILED_TODO
  #TODO: tag edit implementation on mock
  Scenario: MLA012 - Check filter by "All" tag is performed when version tag was edited
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then select "All" option in "Table_Tree_Filter_Dropdown" dropdown on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then click on cell with row index 3 in "name" column in "Files_Table" table on "Files" wizard
    Then save to context "name" column on 3 row from "Files_Table" table on "Files" wizard
    Then compare "Header" element value on "Files_Info_Pane" wizard with test "name" context value
    Then check "latest" value in "tag" column in "Overview_Table" table on "Files_Info_Pane" wizard
    Then click on "Edit_btn_table_view" element on "Files_Info_Pane" wizard
    Then type value "latest123456" to "Version_tag_Input" field on "Files_Info_Pane" wizard
    Then click on "Apply_Button" element on "Files_Info_Pane" wizard
    Then click on "Apply_Changes_Button" element on "Files_Info_Pane" wizard
    And wait load page
    Then verify "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Overview_General_Headers"
    Then check "latest123456" value in "tag" column in "Overview_Table" table on "Files_Info_Pane" wizard
    Then save to context "name" column on 3 row from "Files_Table" table on "Files" wizard
    Then compare "Header" element value on "Files_Info_Pane" wizard with test "name" context value