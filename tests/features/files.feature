Feature: Files Page

  Testcases that verifies functionality on Files Page

  @passive
  Scenario: MLA001 - Check all mandatory components on Artifacts tab
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    Then click on "Project_Monitoring_Button" element on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "project" label should be equal "default" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Artifacts" value
    Then verify "Table_Name_Filter_Input" element visibility on "Files" wizard
    Then click on "Table_FilterBy_Button" element on "Files" wizard
    Then verify "Table_Label_Filter_Input" element visibility on "Artifacts_FilterBy_Popup" wizard
    Then verify "Table_Tree_Filter_Dropdown" element visibility on "Artifacts_FilterBy_Popup" wizard
    Then verify "Show_Iterations_Checkbox" element visibility on "Artifacts_FilterBy_Popup" wizard
    Then verify "Table_Refresh_Button" element visibility on "Files" wizard
    Then verify "Files_Table" element visibility on "Files" wizard
    Then verify "Register_File_Button" element visibility on "Files" wizard
    Then "Register_File_Button" element on "Files" should contains "Register Artifact" value
    Then verify "Table_Tree_Filter_Dropdown" dropdown element on "Artifacts_FilterBy_Popup" wizard should contains "Dropdown_Options"."Tag_Filer_Options"

  @passive
  Scenario: MLA002 - Verify filtering by file name on Artifacts page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    Then click on "Project_Monitoring_Button" element on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "project" label should be equal "default" value
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

  @passive
  Scenario: MLA003 - Verify filtering by file label on Artifacts page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    Then click on "Project_Monitoring_Button" element on "commonPagesHeader" wizard
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

  @FAILED_TODO
  #TODO: 'Name_Input' - options "Input_Hint"."Artifact_Name_Hint" implementation with click on warning hint  
  #TODO: 'Target_Path_Input' implementstion with dropdown before input, rewrite test case
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
    Then "Form_Text" component on "Register_File_Popup" should be equal "Register_Artifact"."Form_Text"
    Then "Form_Subtext" component on "Register_File_Popup" should contains "Register_Artifact"."Form_Subtext"
    Then verify "Cross_Cancel_Button" element visibility on "Register_File_Popup" wizard
    Then verify "New_File_Name_Input" element visibility on "Register_File_Popup" wizard
    Then verify "New_File_Name_Input" on "Register_File_Popup" wizard should display "Input_Hint"."Artifact_Names_Unique"
    Then type value "   " to "New_File_Name_Input" field on "Register_File_Popup" wizard
    Then verify "New_File_Name_Input" on "Register_File_Popup" wizard should display options "Input_Hint"."Artifact_Name_Hint"
    Then verify "New_File_Name_Input" options rules on form "Register_File_Popup" wizard
    Then verify "New_File_Target_Path_Input" element visibility on "Register_File_Popup" wizard
    Then type value "   " to "New_File_Target_Path_Input" field on "Register_File_Popup" wizard
    Then verify "New_File_Target_Path_Input" on "Register_File_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
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
    Then type value "target/path" to "New_File_Target_Path_Input" field on "Register_File_Popup" wizard
    Then type value "new artifact description" to "New_File_Description_Input" field on "Register_File_Popup" wizard
    Then verify "Register_Button" element on "Register_File_Popup" wizard is enabled
    Then click on "Cancel_Button" element on "Register_File_Popup" wizard
    Then verify if "Common_Popup" popup dialog appears
    Then click on "Cancel_Button" element on "Common_Popup" wizard
    Then verify if "Register_File_Popup" popup dialog appears
    Then verify "New_File_Name_Input" input should contains "artifact" value on "Register_File_Popup" wizard
    Then verify "New_File_Target_Path_Input" input should contains "target/path" value on "Register_File_Popup" wizard
    Then verify "New_File_Description_Input" input should contains "new artifact description" value on "Register_File_Popup" wizard
    Then verify "New_File_Type_Dropdown" dropdown on "Register_File_Popup" wizard selected option value "Table"
    Then click on "Cross_Cancel_Button" element on "Register_File_Popup" wizard
    Then verify if "Common_Popup" popup dialog appears
    Then click on "Cancel_Button" element on "Common_Popup" wizard
    Then verify if "Register_File_Popup" popup dialog appears
    Then verify "New_File_Name_Input" input should contains "artifact" value on "Register_File_Popup" wizard
    Then verify "New_File_Target_Path_Input" input should contains "target/path" value on "Register_File_Popup" wizard
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

  @FAILED_TODO 
  #TODO: 'Target_Path_Input' implementstion with dropdown before input, rewrite test case
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
    Then type value "test-path" to "New_File_Target_Path_Input" field on "Register_File_Popup" wizard
    Then select "Table" option in "New_File_Type_Dropdown" dropdown on "Register_File_Popup" wizard
    Then click on "Register_Button" element on "Register_File_Popup" wizard
    And wait load page
    Then value in "name" column with "text" in "Files_Table" on "Files" wizard should contains "test-artifact"
    Then value in "type" column with "text" in "Files_Table" on "Files" wizard should contains "table"
    Then click on cell with value "test-artifact" in "name" column in "Files_Table" table on "Files" wizard
    Then "Header" element on "Files_Info_Pane" should contains "test-artifact" value
    Then check "test-artifact" value in "key" column in "Overview_Table" table on "Files_Info_Pane" wizard
    Then check "latest" value in "tag" column in "Overview_Table" table on "Files_Info_Pane" wizard
    Then check "test-path" value in "path" column in "Overview_Table" table on "Files_Info_Pane" wizard

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
    Then verify "Download_Button" element visibility on "Files_Info_Pane" wizard
    Then verify "Cross_Close_Button" element visibility on "Files_Info_Pane" wizard
    Then verify "Full_View_Button" element visibility on "Files_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Overview_General_Headers"
    Then verify "Overview_Hash_Header" on "Files_Info_Pane" wizard should display "Label_Hint"."Overview_Hash"
    Then verify "Overview_UID_Header" on "Files_Info_Pane" wizard should display "Label_Hint"."Overview_UID"
    Then click on "Full_View_Button" element on "Files_Info_Pane" wizard
    Then verify "Cross_Close_Button" element not exists on "Files_Info_Pane" wizard
    Then click on "Tabel_View_Button" element on "Files_Info_Pane" wizard
    Then verify "Cross_Close_Button" element visibility on "Files_Info_Pane" wizard

  @passive
  Scenario: Check Details panel still active on page refresh
    * set tear-down property "project" created with "automation-test" value
    * set tear-down property "file" created in "automation-test" project with "test-file" value
    * create "automation-test" MLRun Project with code 201
    * create "test-file" File with "v1" tag in "automation-test" project with code 200
    Given open url
    And wait load page
    And click on row root with value "automation-test" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
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

  @passive
  @inProgress
  Scenario: Check all mandatory components in Item infopane on Preview tab table
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
    Then verify "Download_Button" element visibility on "Files_Info_Pane" wizard
    Then verify "Cross_Close_Button" element visibility on "Files_Info_Pane" wizard
#    Then verify "Preview_Tab_Info_Pane_Table" element visibility on "Files_Info_Pane" wizard
#    TO DO: should be implemented mock requests

  @passive
  @inProgress
  Scenario: Check expand sources Item infopane on Overview tab table
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
    When click on "Expand_Sources" element on "Files_Info_Pane" wizard
    Then verify "Info_Sources_Table" element visibility on "Files_Info_Pane" wizard

  @passive
  Scenario: Check MLRun logo redirection
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

  @passive
  Scenario: Verify View YAML action
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
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

  @passive
  Scenario: Verify View YAML action in Item infopane
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

  @FAILED_TODO
  #TODO: redirection from "projects/INVALID/files" to "projects" - wrong redirect 
  Scenario: Check broken link redirection
    * set tear-down property "project" created with "automation-test-011" value
    * set tear-down property "file" created in "automation-test-011" project with "test_ds" value
    * create "automation-test-011" MLRun Project with code 201
    * create "test_file" File with "latest" tag in "automation-test-011" project with code 200
    Given open url
    And wait load page
    And click on row root with value "automation-test-011" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    Then click on "Project_Monitoring_Button" element on "commonPagesHeader" wizard
    And wait load page
    And select "tab" with "Artifacts" value in breadcrumbs menu
    And wait load page
    When click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    Then verify redirection from "projects/automation-test-011/files/INVALID/latest/0/overview" to "projects/automation-test-011/files"
    When click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    Then verify redirection from "projects/automation-test-011/files/test_file/latest/0/INVALID" to "projects/automation-test-011/files/test_file/latest/0/overview"
    Then select "Preview" tab in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    And wait load page
    Then verify redirection from "projects/automation-test-011/files/test_file/latest/0/INVALID" to "projects/automation-test-011/files/test_file/latest/0/overview"
    Then verify redirection from "projects/automation-test-011/files/test_file/latest/IVNALID/overview" to "projects/automation-test-011/files"
    Then verify redirection from "projects/INVALID/files" to "projects"

  Scenario: Check active/highlited items with details panel on Models tab
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Artifacts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "Models_Info_Pane" wizard
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify "Header" element visibility on "Models_Info_Pane" wizard
    Then save to context "name" column on 1 row from "Files_Table" table on "Files" wizard
    Then compare "Header" element value on "Models_Info_Pane" wizard with test "name" context value
	  Then verify that row index 1 is active in "Files_Table" table on "Files" wizard
    Then verify that row index 2 is NOT active in "Files_Table" table on "Files" wizard
    Then click on cell with row index 2 in "name" column in "Files_Table" table on "Files" wizard  
    Then verify that row index 2 is active in "Files_Table" table on "Files" wizard   
    Then verify that row index 1 is NOT active in "Files_Table" table on "Files" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "Models_Info_Pane" wizard
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify "Header" element visibility on "Models_Info_Pane" wizard
    Then save to context "name" column on 2 row from "Files_Table" table on "Files" wizard
    Then compare "Header" element value on "Models_Info_Pane" wizard with test "name" context value
