Feature: Datasets Page

    Testcases that verifies functionality on Datasets Page

  @passive
  Scenario: Check all mandatory components on Datasets page
    Given open url
    And click on row root with value "getting-started-tutorial-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "project" label should be equal "getting-started-tutorial-admin" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Datasets" value
    And wait load page
    Then verify "Feature_Store_Tab_Selector" on "Datasets" wizard should contains "Feature_Store"."Tab_List"
    Then verify "Register_Dataset_Button" element visibility on "Datasets" wizard
    Then "Register_Dataset_Button" element on "Datasets" should contains "Register Dataset" value
    Then verify "Table_Name_Filter_Input" element visibility on "Datasets" wizard
    Then verify "Table_Label_Filter_Input" element visibility on "Datasets" wizard
    Then verify "Table_Tree_Filter_Dropdown" element visibility on "Datasets" wizard
    Then verify "Table_Tree_Filter_Dropdown" dropdown element on "Datasets" wizard should contains "Dropdown_Options"."Tag_Filer_Options"
    Then verify "Table_Refresh_Button" element visibility on "Datasets" wizard
    Then verify "Datasets_Table" element visibility on "Datasets" wizard

  @passive
  Scenario: Verify behaviour of Show iterations checkbox on Datasets page
    Given open url
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then verify "Show_Iterations_Checkbox" element visibility on "Datasets" wizard
    Then check "expand_btn" not presented in "Datasets_Table" on "Datasets" wizard
    Then check "Show_Iterations_Checkbox" element on "Datasets" wizard
    And wait load page
    Then "Show_Iterations_Checkbox" element should be checked on "Datasets" wizard
    Then check "expand_btn" visibility in "Datasets_Table" on "Datasets" wizard
    Then click on cell with row index 1 in "expand_btn" column in "Datasets_Table" table on "Datasets" wizard
    Then click on cell with row index 2 in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then verify "Header" element visibility on "Datasets_Info_Pane" wizard
    Then uncheck "Show_Iterations_Checkbox" element on "Datasets" wizard
    And wait load page
    Then verify "Header" element not exists on "Datasets_Info_Pane" wizard
    Then "Show_Iterations_Checkbox" element should be unchecked on "Datasets" wizard
    Then check "expand_btn" not presented in "Datasets_Table" on "Datasets" wizard

  @passive
  @inProgress
  Scenario: Check all mandatory components in Item infopane on Overview tab table on Datasets page
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then verify "Info_Pane_Tab_Selector" on "Datasets_Info_Pane" wizard should contains "Datasets_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Datasets_Info_Pane" wizard
    Then verify "Header" element visibility on "Datasets_Info_Pane" wizard
    Then verify "Updated" element visibility on "Datasets_Info_Pane" wizard
    Then verify "Download_Button" element visibility on "Datasets_Info_Pane" wizard
    Then verify "Action_Menu" element visibility on "Datasets_Info_Pane" wizard
    Then verify "Cross_Close_Button" element visibility on "Datasets_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Datasets_Info_Pane" wizard should contains "Datasets_Info_Pane"."Overview_General_Headers"
    Then verify "Overview_Hash_Header" on "Datasets_Info_Pane" wizard should display "Label_Hint"."Overview_Hash"
    Then verify "Overview_UID_Header" on "Datasets_Info_Pane" wizard should display "Label_Hint"."Overview_UID"

  @passive
  Scenario: Check Details panel still active on page refresh
    * set tear-down property "dataset" created in "automation-test" project with "test-file" value
    * create "test-dataset" Dataset with "v1" tag in "default" project with code 200
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then select "v1" option in "Table_Tree_Filter_Dropdown" dropdown on "Files" wizard
    And wait load page
    When click on cell with value "test-dataset" in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "Datasets_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "Datasets_Info_Pane" wizard should contains "Datasets_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Datasets_Info_Pane" wizard
    Then verify "Header" element visibility on "Datasets_Info_Pane" wizard
    Then "Header" element on "Datasets_Info_Pane" should contains "test-dataset" value
    Then refresh a page
    Then verify "Header" element visibility on "Datasets_Info_Pane" wizard
    Then "Header" element on "Datasets_Info_Pane" should contains "test-dataset" value

  @passive
  Scenario: Check all mandatory components on Register Dataset form
    Given open url
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And select "tab" with "Datasets" value in breadcrumbs menu
    And wait load page
    Then "Register_Dataset_Button" element on "Datasets" should contains "Register Dataset" value
    Then click on "Register_Dataset_Button" element on "Datasets" wizard
    Then verify if "Register_Dataset" popup dialog appears
    Then navigate back
    Then verify "Title" element not exists on "Register_Dataset" wizard
    Then navigate forward
    Then verify "Title" element not exists on "Register_Dataset" wizard
    Then click on "Register_Dataset_Button" element on "Datasets" wizard
    Then verify if "Register_File_Popup" popup dialog appears
    Then "Title" element on "Register_Dataset" should contains "Register Dataset" value
    Then "Form_Text" component on "Register_Dataset" should be equal "Register_Artifact"."Form_Text"
    Then "Form_Subtext" component on "Register_Dataset" should contains "Register_Artifact"."Form_Subtext"
    Then verify "Name_Input" element visibility on "Register_Dataset" wizard
    Then verify "Name_Input" on "Register_Dataset" wizard should display "Input_Hint"."Artifact_Names_Unique"
    Then type value "   " to "Name_Input" field on "Register_Dataset" wizard
    Then verify "Name_Input" on "Register_Dataset" wizard should display options "Input_Hint"."Artifact_Name_Hint"
    Then verify "Name_Input" options rules on form "Register_Dataset" wizard
    Then verify "Target_Path_Input" element visibility on "Register_Dataset" wizard
    Then type value "   " to "Target_Path_Input" field on "Register_Dataset" wizard
    Then verify "Target_Path_Input" on "Register_Dataset" wizard should display warning "Input_Hint"."Input_Field_Invalid"
    Then verify "Description_Input" element visibility on "Register_Dataset" wizard
    Then type value "   " to "Description_Input" field on "Register_Dataset" wizard
    Then verify "Description_Input" on "Register_Dataset" wizard should display warning "Input_Hint"."Input_Field_Invalid"
    Then verify "Cancel_Button" element visibility on "Register_Dataset" wizard
    Then "Cancel_Button" element on "Register_Dataset" should contains "Cancel" value
    Then verify "Register_Button" element visibility on "Register_Dataset" wizard
    Then "Register_Button" element on "Register_Dataset" should contains "Register" value
    Then click on "Register_Button" element on "Register_Dataset" wizard
    Then verify "Register_Button" element on "Register_Dataset" wizard is disabled
    Then type value "dataset" to "Name_Input" field on "Register_Dataset" wizard
    Then type value "target/path" to "Target_Path_Input" field on "Register_Dataset" wizard
    Then type value "new dataset description" to "Description_Input" field on "Register_Dataset" wizard
    Then check "Description_Input" textarea counter on "Register_Dataset" wizard
    Then verify "Register_Button" element on "Register_Dataset" wizard is enabled
    Then click on "Cancel_Button" element on "Register_Dataset" wizard
    Then verify if "Common_Popup" popup dialog appears
    Then click on "Cancel_Button" element on "Common_Popup" wizard
    Then verify if "Register_Dataset" popup dialog appears
    Then verify "Name_Input" input should contains "dataset" value on "Register_Dataset" wizard
    Then verify "Target_Path_Input" input should contains "target/path" value on "Register_Dataset" wizard
    Then verify "Description_Input" input should contains "new dataset description" value on "Register_Dataset" wizard
    Then click on "Cross_Cancel_Button" element on "Register_Dataset" wizard
    Then verify if "Common_Popup" popup dialog appears
    Then click on "Cancel_Button" element on "Common_Popup" wizard
    Then verify if "Register_Dataset" popup dialog appears
    Then verify "Name_Input" input should contains "dataset" value on "Register_Dataset" wizard
    Then verify "Target_Path_Input" input should contains "target/path" value on "Register_Dataset" wizard
    Then verify "Description_Input" input should contains "new dataset description" value on "Register_Dataset" wizard
    Then navigate back
    Then verify if "Common_Popup" popup dialog appears
    Then click on "Cancel_Button" element on "Common_Popup" wizard
    Then navigate back
    Then verify if "Common_Popup" popup dialog appears
    Then click on "Cancel_Button" element on "Common_Popup" wizard
    Then navigate back
    Then verify if "Common_Popup" popup dialog appears
    Then click on "Confirm_Button" element on "Common_Popup" wizard
    And wait load page
    Then verify "Title" element not exists on "Register_Dataset" wizard
    Then navigate forward
    Then verify "Title" element not exists on "Register_Dataset" wizard

  Scenario: Verify behaviour on Register new Dataset
    * set tear-down property "dataset" created in "default" project with "test-dataset" value
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on "Register_Dataset_Button" element on "Datasets" wizard
    Then verify if "Register_Dataset" popup dialog appears
    Then type value "test-dataset" to "Name_Input" field on "Register_Dataset" wizard
    Then type value "test-path" to "Target_Path_Input" field on "Register_Dataset" wizard
    Then click on "Register_Button" element on "Register_Dataset" wizard
    And wait load page
    Then check "test-dataset" value in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then click on cell with value "test-dataset" in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then "Header" element on "Datasets_Info_Pane" should contains "test-dataset" value
    Then check "test-dataset" value in "key" column in "Overview_Table" table on "Datasets_Info_Pane" wizard
    Then check "latest" value in "tag" column in "Overview_Table" table on "Datasets_Info_Pane" wizard
    Then check "test-path" value in "path" column in "Overview_Table" table on "Datasets_Info_Pane" wizard

  @passive
  Scenario: Check filtering by name on Datasets page
    Given open url
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And select "tab" with "Datasets" value in breadcrumbs menu
    And wait load page
    Then type value "ea" to "Table_Name_Filter_Input" field on "Datasets" wizard
    Then click on "Table_Refresh_Button" element on "Datasets" wizard
    And wait load page
    Then value in "name" column with "text" in "Datasets_Table" on "Datasets" wizard should contains "ea"

  @passive
  Scenario: verify filtering by label on Datasets page
     Given open url
     And wait load page
     And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
     And wait load page
     And select "tab" with "Datasets" value in breadcrumbs menu
     And wait load page
     Then type value "owner" to "Table_Label_Filter_Input" field on "Datasets" wizard
     Then click on "Table_Refresh_Button" element on "Datasets" wizard
     And wait load page
     Then value in "labels" column with "dropdowns" in "Datasets_Table" on "Datasets" wizard should contains "owner"
     Then type value "v3io_user=admin" to "Table_Label_Filter_Input" field on "Datasets" wizard
     Then click on "Table_Refresh_Button" element on "Datasets" wizard
     And wait load page
     Then value in "labels" column with "dropdowns" in "Datasets_Table" on "Datasets" wizard should contains "v3io_user=admin"
     Then type value "v3io_user=123" to "Table_Label_Filter_Input" field on "Datasets" wizard
     Then click on "Table_Refresh_Button" element on "Datasets" wizard
     And wait load page
     And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard

  @passive
  Scenario: Verify View YAML action on Datasets page
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And select "tab" with "Datasets" value in breadcrumbs menu
    And wait load page
    Then select "View YAML" option in action menu on "Datasets" wizard in "Datasets_Table" table at row with "data_clean_cleaned-data" value in "name" column
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
    Then click on "Cross_Cancel_Button" element on "View_YAML" wizard
    Then check "Show_Iterations_Checkbox" element on "Datasets" wizard
    Then click on cell with row index 1 in "expand_btn" column in "Datasets_Table" table on "Datasets" wizard
    Then select "View YAML" option in action menu on "Datasets" wizard in "Datasets_Table" table at row with "latest #0" value in "name" column
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

  @passive
  Scenario: Check all mandatory components on Artifact Preview on Datasets page
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And select "tab" with "Datasets" value in breadcrumbs menu
    And wait load page
    When click on cell with row index 1 in "artifact_preview_btn" column in "Datasets_Table" table on "Datasets" wizard
    Then verify "Preview_Header" element visibility on "Artifact_Preview_Popup" wizard
    Then verify "Cross_Cancel_Button" element visibility on "Artifact_Preview_Popup" wizard

  Scenario: Check broken link redirection
     * set tear-down property "dataset" created in "default" project with "test_ds" value
     * create "test_ds" Dataset with "latest" tag in "default" project with code 200
     Given open url
     And wait load page
     And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
     And wait load page
     And select "tab" with "Datasets" value in breadcrumbs menu
     And wait load page
     When click on cell with row index 1 in "name" column in "Datasets_Table" table on "Datasets" wizard
     Then verify redirection from "projects/default/datasets/test_ds/latest/0/INVALID" to "projects/default/datasets/test_ds/latest/0/overview"
     Then select "Preview" tab in "Info_Pane_Tab_Selector" on "Datasets_Info_Pane" wizard
     And wait load page
     Then verify redirection from "projects/default/datasets/test_ds/latest/0/INVALID" to "projects/default/datasets/test_ds/latest/0/overview"
     Then verify redirection from "projects/INVALID/datasets/test_ds/latest/0/overview" to "projects"
     Then verify redirection from "projects/default/INVALID/test_ds/latest/0/overview" to "projects"
