Feature: Datasets Page

    Testcases that verifies functionality on Datasets Page
    
  @MLD
  @passive
  Scenario: MLD001 - Check components on Datasets page
    Given open url
    And click on row root with value "getting-started-tutorial-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "getting-started-tutorial-admin" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Datasets" value
    And wait load page
    Then click on breadcrumbs "project" label on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "getting-started-tutorial-admin" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Datasets" value
    And wait load page
    Then verify "Register_Dataset_Button" element visibility on "Datasets" wizard
    Then "Register_Dataset_Button" element on "Datasets" should contains "Register dataset" value
    Then verify "Table_Name_Filter_Input" element visibility on "Datasets" wizard
    Then verify "Table_FilterBy_Button" element visibility on "Datasets" wizard
    Then click on "Table_FilterBy_Button" element on "Datasets" wizard
    Then "Title" element on "Artifacts_FilterBy_Popup" should contains "Filter by" value
    Then verify "Table_Label_Filter_Input" element visibility on "Artifacts_FilterBy_Popup" wizard
    Then verify "Table_Tree_Filter_Dropdown" element visibility on "Artifacts_FilterBy_Popup" wizard
    Then verify "Table_Tree_Filter_Dropdown" dropdown element on "Artifacts_FilterBy_Popup" wizard should contains "Dropdown_Options"."Tag_Filer_Options"
    Then click on "Title" element on "Artifacts_FilterBy_Popup" wizard
    Then verify "Show_Iterations_Checkbox" element visibility on "Artifacts_FilterBy_Popup" wizard
    Then "Checkbox_Label" element on "Artifacts_FilterBy_Popup" should contains "Show best iteration only" value
    Then verify "Clear_Button" element visibility on "Artifacts_FilterBy_Popup" wizard
    Then verify "Apply_Button" element visibility on "Artifacts_FilterBy_Popup" wizard
    Then verify "Table_Refresh_Button" element visibility on "Datasets" wizard
    Then verify "Datasets_Table" element visibility on "Datasets" wizard

  @MLD
  @passive
  Scenario: MLD002 - Verify behaviour of Show iterations checkbox on Datasets page
    Given open url
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    And select "tab" with "Project monitoring" value in breadcrumbs menu
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Datasets" wizard
    Then verify "Show_Iterations_Checkbox" element visibility on "Artifacts_FilterBy_Popup" wizard
    Then "Show_Iterations_Checkbox" element should be checked on "Artifacts_FilterBy_Popup" wizard
    Then check "expand_btn" not presented in "Datasets_Table" on "Datasets" wizard
    Then uncheck "Show_Iterations_Checkbox" element on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Datasets" wizard
    Then "Show_Iterations_Checkbox" element should be unchecked on "Artifacts_FilterBy_Popup" wizard
    Then check "expand_btn" visibility in "Datasets_Table" on "Datasets" wizard
    Then click on cell with row index 1 in "expand_btn" column in "Datasets_Table" table on "Datasets" wizard
    And wait load page
    Then click on cell with row index 2 in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then verify "Header" element visibility on "Datasets_Info_Pane" wizard
    Then click on "Table_FilterBy_Button" element on "Datasets" wizard
    Then check "Show_Iterations_Checkbox" element on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then verify "Header" element not exists on "Datasets_Info_Pane" wizard
    Then click on "Table_FilterBy_Button" element on "Datasets" wizard
    Then "Show_Iterations_Checkbox" element should be checked on "Artifacts_FilterBy_Popup" wizard
    Then check "expand_btn" not presented in "Datasets_Table" on "Datasets" wizard

  @MLD
  @passive
  Scenario: MLD003 - Check all mandatory components in Item infopane on Overview tab table on Datasets page
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
    Then verify "Action_Menu" element visibility on "Datasets_Info_Pane" wizard
    Then verify "Action_Menu" dropdown element on "Datasets_Info_Pane" wizard should contains "Common_Lists"."Action_Menu_List"
    Then select "Download" option in action menu on "Datasets_Info_Pane" wizard
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
    Then verify "Full_View_Button" element visibility on "Datasets_Info_Pane" wizard
    Then verify "Cross_Close_Button" element visibility on "Datasets_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Datasets_Info_Pane" wizard should contains "Datasets_Info_Pane"."Overview_General_Headers"
    Then verify "Overview_Producer_Headers" on "Datasets_Info_Pane" wizard should contains "Datasets_Info_Pane"."Overview_Producer_Headers"
    Then verify "Overview_Sources_Headers" element visibility on "Datasets_Info_Pane" wizard
    Then verify "Overview_Sources_Headers" on "Datasets_Info_Pane" wizard should contains "Datasets_Info_Pane"."Overview_Sources_Headers"
    Then "Label_column" element on "Datasets_Info_Pane" should contains "radius" value 
    Then verify "Train_Button" element visibility on "Datasets_Info_Pane" wizard
    Then "Train_Button" element on "Datasets_Info_Pane" should contains "Train" value
    Then click on "Train_Button" element on "Datasets_Info_Pane" wizard
    And wait load page
    Then verify "Title" element visibility on "Modal_Wizard_Form" wizard
    Then "Title" element on "Modal_Wizard_Form" should contains "Train Model" value
    Then verify "Cross_Close_Button" element visibility on "Modal_Wizard_Form" wizard
    Then click on "Cross_Close_Button" element on "Modal_Wizard_Form" wizard
    And hover "Overview_Hash_Header" component on "Datasets_Info_Pane" wizard
    Then verify "Overview_Hash_Header" on "Datasets_Info_Pane" wizard should display "Label_Hint"."Overview_Hash"
    Then verify "Overview_UID_Header" on "Datasets_Info_Pane" wizard should display "Label_Hint"."Overview_UID"
    Then click on "Full_View_Button" element on "Datasets_Info_Pane" wizard
    Then verify "Cross_Close_Button" element not exists on "Datasets_Info_Pane" wizard
    Then click on "Tabel_View_Button" element on "Datasets_Info_Pane" wizard
    Then verify "Cross_Close_Button" element visibility on "Datasets_Info_Pane" wizard
  
  @MLD
  @passive
  Scenario: MLD005 - Check Details panel still active on page refresh
    * set tear-down property "dataset" created in "automation-test" project with "test-file" value
    * create "test-dataset" Dataset with "v1" tag in "default" project with code 200
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    When click on cell with value "test-dataset" in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then check "latest" value in "tag" column in "Overview_Table" table on "Datasets_Info_Pane" wizard
    Then click on "Edit_btn_table_view" element on "Datasets_Info_Pane" wizard
    And wait load page
    When type value "v2" to "Version_tag_Input" field on "Datasets_Info_Pane" wizard
    Then click on "Apply_Button" element on "Datasets_Info_Pane" wizard
    Then click on "Apply_Changes_Button" element on "Datasets_Info_Pane" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Datasets" wizard
    Then select "v2" option in "Table_Tree_Filter_Dropdown" dropdown on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
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
  
  @MLD
  @passive
  Scenario: MLD006 - Check all mandatory components on Register Dataset form
    Given open url
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And select "tab" with "Datasets" value in breadcrumbs menu
    And wait load page
    Then "Register_Dataset_Button" element on "Datasets" should contains "Register dataset" value
    Then click on "Register_Dataset_Button" element on "Datasets" wizard
    Then verify if "Register_Dataset" popup dialog appears
    Then navigate back
    Then verify "Title" element not exists on "Register_Dataset" wizard
    Then navigate forward
    Then verify "Title" element not exists on "Register_Dataset" wizard
    Then click on "Register_Dataset_Button" element on "Datasets" wizard
    Then verify if "Register_File_Popup" popup dialog appears
    Then "Title" element on "Register_Dataset" should contains "Register Dataset" value
    Then "Form_Text" component on "Register_Dataset" should contains "Register_Dataset"."Form_Text"
    Then "Form_Subtext" component on "Register_Dataset" should contains "Register_Dataset"."Form_Subtext"
    Then verify "Name_Input" element visibility on "Register_Dataset" wizard
    Then type value " " to "Name_Input" field on "Register_Dataset" wizard
    And wait load page
    Then verify "Name_Input" on "Register_Dataset" wizard should display options "Input_Hint"."Artifact_Name_Hint"
    Then verify "Name_Input" options rules on form "Register_Dataset" wizard
    Then verify options in "Path_Scheme_Combobox" combobox in "Target_Path" on "Register_Dataset" wizard should contains "Register_Dataset"."Combobox_Options"
    When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_Dataset" wizard
    When type value "  " to "Path_Scheme_Combobox" field on "Target_Path" on "Register_Dataset" wizard
    Then verify "Path_Scheme_Combobox" element in "Target_Path" on "Register_Dataset" wizard should display warning "Input_Hint"."V3IO_Path_Hint"
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
    When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_Dataset" wizard
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
    Then click on "Cross_Cancel_Button" element on "Register_Dataset" wizard
    Then verify if "Common_Popup" popup dialog appears
    Then click on "Cancel_Button" element on "Common_Popup" wizard
    Then verify if "Register_Dataset" popup dialog appears
    Then verify "Name_Input" input should contains "dataset" value on "Register_Dataset" wizard
    Then verify "Path_Scheme_Combobox" input should contains "target/path" value in "Target_Path" on "Register_Dataset" wizard
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
  
  @MLD
  Scenario: MLD007 - Verify behaviour on Register new Dataset
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on "Register_Dataset_Button" element on "Datasets" wizard
    Then verify if "Register_Dataset" popup dialog appears
    Then type value "dataset-test" to "Name_Input" field on "Register_Dataset" wizard
    When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_Dataset" wizard
    When type value "target/path" to "Path_Scheme_Combobox" field on "Target_Path" on "Register_Dataset" wizard
    Then click on "Register_Button" element on "Register_Dataset" wizard
    And wait load page
    Then check "dataset-test" value in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then click on cell with value "dataset-test" in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then "Header" element on "Datasets_Info_Pane" should contains "dataset-test" value
    Then check "dataset-test" value in "key" column in "Overview_Table" table on "Datasets_Info_Pane" wizard
    Then check "latest" value in "tag" column in "Overview_Table" table on "Datasets_Info_Pane" wizard
    Then check "v3io:///target/path" value in "path" column in "Overview_Table" table on "Datasets_Info_Pane" wizard
    Then click on "Register_Dataset_Button" element on "Datasets" wizard
    Then type value "auto-trainer-train_test_set" to "Name_Input" field on "Register_Dataset" wizard
    Then type value "latest" to "Tag_Input" field on "Register_Dataset" wizard
    When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_Dataset" wizard
    When type value "target/path" to "Path_Scheme_Combobox" field on "Target_Path" on "Register_Dataset" wizard
    Then click on "Register_Button" element on "Register_Dataset" wizard
    And wait load page
    Then "Register_Error_Message" component on "Register_Dataset" should be equal "Register_Artifact"."Register_Error_Message"
  
  @MLD
  @passive
  Scenario: MLD014 - Check filtering by name on Datasets page
    Given open url
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    Then click on "Project_Monitoring_Button" element on "commonPagesHeader" wizard
    And wait load page
    And select "tab" with "Datasets" value in breadcrumbs menu
    And wait load page
    Then type value "ea" to "Table_Name_Filter_Input" field on "Datasets" wizard
    Then click on "Table_Refresh_Button" element on "Datasets" wizard
    And wait load page
    Then value in "name" column with "text" in "Datasets_Table" on "Datasets" wizard should contains "ea"
  
  @MLD
  @passive
  Scenario: MLD004 - Verify filtering by label on Datasets page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    Then click on "Project_Monitoring_Button" element on "commonPagesHeader" wizard
    And wait load page
    And select "tab" with "Datasets" value in breadcrumbs menu
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Datasets" wizard
    Then type value "owner" to "Table_Label_Filter_Input" field on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then value in "labels" column with "dropdowns" in "Datasets_Table" on "Datasets" wizard should contains "owner"
    Then click on "Table_FilterBy_Button" element on "Datasets" wizard
    Then type value "v3io_user=admin" to "Table_Label_Filter_Input" field on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then value in "labels" column with "dropdowns" in "Datasets_Table" on "Datasets" wizard should contains "v3io_user=admin"
    Then click on "Table_FilterBy_Button" element on "Datasets" wizard
    Then type value "v3io_user=123" to "Table_Label_Filter_Input" field on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
    Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."No_Datasets_data"
  
  @MLD
  @passive
  Scenario: MLD015 - Verify action menu list, Downloads action,  View YAML action
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And select "tab" with "Datasets" value in breadcrumbs menu
    And wait load page
    Then verify action menu on "Datasets" wizard in "Datasets_Table" table with "survival-curves_km-timelines" value in "name" column should contains "Common_Lists"."Action_Menu_List"
    Then select "Download" option in action menu on "Datasets" wizard in "Datasets_Table" table at row with "survival-curves_km-timelines" value in "name" column
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
    Then select "View YAML" option in action menu on "Datasets" wizard in "Datasets_Table" table at row with "survival-curves_km-timelines" value in "name" column
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
    Then click on "Cross_Cancel_Button" element on "View_YAML" wizard
    Then click on "Table_FilterBy_Button" element on "Datasets" wizard
    Then uncheck "Show_Iterations_Checkbox" element on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then click on cell with row index 1 in "expand_btn" column in "Datasets_Table" table on "Datasets" wizard
    Then select "View YAML" option in action menu on "Datasets" wizard in "Datasets_Table" table at row with "latest" value in "name_expand_btn" column
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

  @MLD
  Scenario: MLD018 - Verify the Delete option state in Datasets table and Overview details action menu 
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And select "tab" with "Datasets" value in breadcrumbs menu
    And wait load page
    Then verify action menu on "Datasets" wizard in "Datasets_Table" table with "test-regressor_cox-test-summary" value in "name" column should contains "Common_Lists"."Action_Menu_List"
    Then verify that in action menu on "Datasets" wizard in "Datasets_Table" table with "test-regressor_cox-test-summary" value in "name" column "Delete" option is enabled
    When click on cell with row index 1 in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then check "latest" value in "tag" column in "Overview_Table" table on "Datasets_Info_Pane" wizard
    Then verify "Action_Menu" element visibility on "Datasets_Info_Pane" wizard
    Then verify "Action_Menu" dropdown element on "Datasets_Info_Pane" wizard should contains "Common_Lists"."Action_Menu_List"
    Then check that "Delete" option in action menu on "Datasets_Info_Pane" wizard is enabled
    Then click on "Edit_btn_table_view" element on "Datasets_Info_Pane" wizard
    And wait load page
    When type value "" to "Version_tag_Input" field on "Datasets_Info_Pane" wizard
    Then click on "Apply_Button" element on "Datasets_Info_Pane" wizard
    Then click on "Apply_Changes_Button" element on "Datasets_Info_Pane" wizard
    And wait load page
    Then verify "Table_FilterBy_Button" element visibility on "Datasets" wizard
    Then click on "Table_FilterBy_Button" element on "Datasets" wizard
    Then select "All" option in "Table_Tree_Filter_Dropdown" dropdown on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then verify action menu on "Datasets" wizard in "Datasets_Table" table with "test-regressor_cox-test-summary" value in "name" column should contains "Common_Lists"."Action_Menu_List"
    Then verify that in action menu on "Datasets" wizard in "Datasets_Table" table with "test-regressor_cox-test-summary" value in "name" column "Delete" option is disabled
    When click on cell with row index 1 in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then check "Click to add" value in "tag" column in "Overview_Table" table on "Datasets_Info_Pane" wizard
    Then verify "Action_Menu" dropdown element on "Datasets_Info_Pane" wizard should contains "Common_Lists"."Action_Menu_List"
    Then check that "Delete" option in action menu on "Datasets_Info_Pane" wizard is disabled
  
  @MLD
  @passive
  Scenario: MLD013 - Check components on Artifact Preview on Datasets page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And select "tab" with "Datasets" value in breadcrumbs menu
    And wait load page    
    Then hover on cell with row index 2 in "name" column in "Datasets_Table" table on "Datasets" wizard
    When click on cell with row index 2 in "artifact_preview_btn" column in "Datasets_Table" table on "Datasets" wizard
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
    When click on cell with value "auto-trainer-train_test_set" in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then select "Preview" tab in "Info_Pane_Tab_Selector" on "Datasets_Info_Pane" wizard
    And wait load page
    Then verify "Pop_Out_Button" element visibility on "Datasets_Info_Pane" wizard 
    Then click on "Pop_Out_Button" element on "Datasets_Info_Pane" wizard
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
  
  @MLD 
  Scenario: MLD016 - Check broken link redirection
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    Then click on "Project_Monitoring_Button" element on "commonPagesHeader" wizard
    And wait load page
    And select "tab" with "Datasets" value in breadcrumbs menu
    And wait load page
    When click on cell with row index 1 in "name" column in "Datasets_Table" table on "Datasets" wizard
    And wait load page
    Then verify redirection from "projects/default/datasets/auto-trainer-train_test_set/latest/0/INVALID" to "projects/default/datasets/auto-trainer-train_test_set/latest/0/overview"
    Then select "Preview" tab in "Info_Pane_Tab_Selector" on "Datasets_Info_Pane" wizard
    And wait load page
    Then verify redirection from "projects/default/datasets/auto-trainer-train_test_set/latest/0/INVALID" to "projects/default/datasets/auto-trainer-train_test_set/latest/0/overview"
    And wait load page
    Then verify redirection from "projects/INVALID/datasets/auto-trainer-train_test_set/latest/0/overview" to "projects"
    And wait load page
    Then verify redirection from "projects/default/INVALID/auto-trainer-train_test_set/latest/0/overview" to "projects"
    And wait load page
  
  @MLD
  Scenario: MLD017 - Check active/highlited items with details panel on Datasets
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on cell with row index 1 in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "Datasets_Info_Pane" wizard
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Datasets_Info_Pane" wizard
    Then verify "Header" element visibility on "Datasets_Info_Pane" wizard
    Then save to context "name" column on 1 row from "Datasets_Table" table on "Datasets" wizard
    Then compare "Header" element value on "Datasets_Info_Pane" wizard with test "name" context value
    Then verify that row index 1 is active in "Datasets_Table" table on "Datasets" wizard
    Then verify that row index 2 is NOT active in "Datasets_Table" table on "Datasets" wizard
    Then click on cell with row index 2 in "name" column in "Datasets_Table" table on "Datasets" wizard  
    Then verify that row index 2 is active in "Datasets_Table" table on "Datasets" wizard   
    Then verify that row index 1 is NOT active in "Datasets_Table" table on "Datasets" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "Datasets_Info_Pane" wizard
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Datasets_Info_Pane" wizard
    Then verify "Header" element visibility on "Datasets_Info_Pane" wizard
    Then save to context "name" column on 2 row from "Datasets_Table" table on "Datasets" wizard
    Then compare "Header" element value on "Datasets_Info_Pane" wizard with test "name" context value
  
  @MLD
  Scenario: MLD009 - Check that version tag is filled when edit it in table view and full view on Overview tab table on Datasets page
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
    Then verify "Overview_General_Headers" on "Datasets_Info_Pane" wizard should contains "Datasets_Info_Pane"."Overview_General_Headers"
    Then check "latest" value in "tag" column in "Overview_Table" table on "Datasets_Info_Pane" wizard
    Then click on "Edit_btn_table_view" element on "Datasets_Info_Pane" wizard
    And wait load page
    Then verify "Version_tag_Input_table_view" on "Datasets_Info_Pane" wizard should contains "latest" value
    Then click on "Full_View_Button" element on "Datasets_Info_Pane" wizard
    Then verify "Cross_Close_Button" element not exists on "Datasets_Info_Pane" wizard
    Then click on "Edit_btn_full_view" element on "Datasets_Info_Pane" wizard
    Then verify "Version_tag_Input_full_view" on "Datasets_Info_Pane" wizard should contains "latest" value   
    Then click on "Tabel_View_Button" element on "Datasets_Info_Pane" wizard
    Then verify "Cross_Close_Button" element visibility on "Datasets_Info_Pane" wizard

  @MLD
  Scenario: MLD010 - Check that version tag dropdown shows all tags on filters wizard on Datasets page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then verify "Info_Pane_Tab_Selector" on "Datasets_Info_Pane" wizard should contains "Datasets_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Datasets_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Datasets_Info_Pane" wizard should contains "Datasets_Info_Pane"."Overview_General_Headers"
    Then check "latest" value in "tag" column in "Overview_Table" table on "Datasets_Info_Pane" wizard
    Then click on "Edit_btn_table_view" element on "Datasets_Info_Pane" wizard
    And wait load page
    When type value "newTag" to "Version_tag_Input" field on "Datasets_Info_Pane" wizard
    Then click on "Apply_Button" element on "Datasets_Info_Pane" wizard
    Then click on "Apply_Changes_Button" element on "Datasets_Info_Pane" wizard
    And wait load page
    Then verify "Table_FilterBy_Button" element visibility on "Datasets" wizard
    Then click on "Table_FilterBy_Button" element on "Datasets" wizard
    Then select "newTag" option in "Table_Tree_Filter_Dropdown" dropdown on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then check "newTag" value in "tag" column in "Datasets_Table" table on "Datasets" wizard

  @MLD
  Scenario: MLD011 - Check that version tag has "Click to add" status when it's empty after edited
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
    Then verify "Overview_General_Headers" on "Datasets_Info_Pane" wizard should contains "Datasets_Info_Pane"."Overview_General_Headers"
    Then check "latest" value in "tag" column in "Overview_Table" table on "Datasets_Info_Pane" wizard
    Then click on "Edit_btn_table_view" element on "Datasets_Info_Pane" wizard
    Then type value "" to "Version_tag_Input" field on "Datasets_Info_Pane" wizard
    Then click on "Apply_Button" element on "Datasets_Info_Pane" wizard
    Then click on "Apply_Changes_Button" element on "Datasets_Info_Pane" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Datasets" wizard
    Then select "All" option in "Table_Tree_Filter_Dropdown" dropdown on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Datasets_Table" table on "Datasets" wizard
    And wait load page
    Then "Version_Tag_Input_Placeholder" element on "Datasets_Info_Pane" should contains "Click to add" value

  @MLD
  Scenario: MLD012 - Check filter by "All" tag is performed when version tag was edited
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Datasets" wizard
    Then select "All" option in "Table_Tree_Filter_Dropdown" dropdown on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then click on cell with row index 2 in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then save to context "name" column on 2 row from "Datasets_Table" table on "Datasets" wizard
    Then compare "Header" element value on "Datasets_Info_Pane" wizard with test "name" context value
    Then check "latest" value in "tag" column in "Overview_Table" table on "Datasets_Info_Pane" wizard
    Then click on "Edit_btn_table_view" element on "Datasets_Info_Pane" wizard
    Then type value "latest123456" to "Version_tag_Input" field on "Datasets_Info_Pane" wizard
    Then click on "Apply_Button" element on "Datasets_Info_Pane" wizard
    Then click on "Apply_Changes_Button" element on "Datasets_Info_Pane" wizard
    And wait load page
    Then verify "Info_Pane_Tab_Selector" on "Datasets_Info_Pane" wizard should contains "Datasets_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Datasets_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Datasets_Info_Pane" wizard should contains "Datasets_Info_Pane"."Overview_General_Headers"
    Then check "latest123456" value in "tag" column in "Overview_Table" table on "Datasets_Info_Pane" wizard
    Then save to context "name" column on 3 row from "Datasets_Table" table on "Datasets" wizard
    Then compare "Header" element value on "Datasets_Info_Pane" wizard with test "name" context value

  @MLD
  Scenario: MLD019 - Check steps, buttons components on Train Model wizard
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then verify "Train_Button" element visibility on "Datasets_Info_Pane" wizard
    Then "Train_Button" element on "Datasets_Info_Pane" should contains "Train" value
    Then click on "Train_Button" element on "Datasets_Info_Pane" wizard
    And wait load page
    Then verify "Title" element visibility on "Modal_Wizard_Form" wizard
    Then "Title" element on "Modal_Wizard_Form" should contains "Train Model" value
    Then verify "Cross_Close_Button" element visibility on "Modal_Wizard_Form" wizard
    Then "Function_Title" element on "Modal_Wizard_Form" should contains "auto-trainer" value
    Then "Form_Header_Run_Details" element on "commonPagesHeader" should contains "Run Details" value
    Then "Hyperparameter_Checkbox" element should be unchecked on "Modal_Wizard_Form" wizard
    Then verify "Step_1_Button" element on "commonPagesHeader" wizard is enabled
    Then "Step_1_Button_text" element on "commonPagesHeader" should contains "Run Details" value
    Then verify "Step_2_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_3_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_4_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_5_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then "Next_Button" element on "Modal_Wizard_Form" should contains "Next" value
    Then verify "Run_Training_Now_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then "Run_Training_Now_Button" element on "Modal_Wizard_Form" should contains "Run training now" value
    Then verify "Schedule_Training_Job_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then "Schedule_Training_Job_Button" element on "Modal_Wizard_Form" should contains "Schedule training job" value
    Then verify "Back_Button" element not exists on "Modal_Wizard_Form" wizard
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    Then "Form_Header_Data_Inputs" element on "commonPagesHeader" should contains "Data Inputs" value
    Then verify "Step_1_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_2_Button" element on "commonPagesHeader" wizard is enabled
    Then "Step_2_Button_text" element on "commonPagesHeader" should contains "Data Inputs" value
    Then verify "Back_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then "Back_Button" element on "Modal_Wizard_Form" should contains "Back" value
    Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then verify "Schedule_Training_Job_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then verify "Run_Training_Now_Button" element on "Modal_Wizard_Form" wizard is enabled
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    Then "Form_Header_Parameters" element on "commonPagesHeader" should contains "Parameters" value
    Then verify "Step_1_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_2_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_3_Button" element on "commonPagesHeader" wizard is enabled
    Then "Step_3_Button_text" element on "commonPagesHeader" should contains "Parameters" value
    Then verify "Back_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then verify "Schedule_Training_Job_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then verify "Run_Training_Now_Button" element on "Modal_Wizard_Form" wizard is enabled
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    Then "Form_Header_Resources" element on "commonPagesHeader" should contains "Resources" value
    Then verify "Step_1_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_2_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_3_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_4_Button" element on "commonPagesHeader" wizard is enabled
    Then "Step_4_Button_text" element on "commonPagesHeader" should contains "Resources" value
    Then verify "Back_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then verify "Schedule_Training_Job_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then verify "Run_Training_Now_Button" element on "Modal_Wizard_Form" wizard is enabled
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    Then "Form_Header_Advanced" element on "commonPagesHeader" should contains "Advanced" value
    Then verify "Step_1_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_2_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_3_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_4_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_5_Button" element on "commonPagesHeader" wizard is enabled
    Then "Step_5_Button_text" element on "commonPagesHeader" should contains "Advanced" value
    Then verify "Back_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is disabled
    Then verify "Schedule_Training_Job_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then verify "Run_Training_Now_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then click on "Cross_Close_Button" element on "Modal_Wizard_Form" wizard
    Then click on "Train_Button" element on "Datasets_Info_Pane" wizard
    And wait load page
    Then check "Hyperparameter_Checkbox" element on "Modal_Wizard_Form" wizard
    Then "Hyperparameter_Checkbox" element should be checked on "Modal_Wizard_Form" wizard
    Then verify "Step_2_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_3_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_4_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_5_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_6_Button" element on "commonPagesHeader" wizard is enabled
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    Then "Form_Header_Hyperparameter_Strategy" element on "commonPagesHeader" should contains "Hyperparameter strategy" value
    Then verify "Step_5_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_6_Button" element on "commonPagesHeader" wizard is enabled
    Then "Step_4_Button_text" element on "commonPagesHeader" should contains "Hyperparameter strategy" value
    Then verify "Back_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then verify "Schedule_Training_Job_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then verify "Run_Training_Now_Button" element on "Modal_Wizard_Form" wizard is enabled
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    Then "Form_Header_Resources" element on "commonPagesHeader" should contains "Resources" value
    Then verify "Step_6_Button" element on "commonPagesHeader" wizard is enabled
    Then "Step_5_Button_text" element on "commonPagesHeader" should contains "Resources" value
    Then verify "Back_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then verify "Schedule_Training_Job_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then verify "Run_Training_Now_Button" element on "Modal_Wizard_Form" wizard is enabled
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    Then "Form_Header_Advanced" element on "commonPagesHeader" should contains "Advanced" value
    Then verify "Step_1_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_2_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_3_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_4_Button" element on "commonPagesHeader" wizard is enabled
    Then verify "Step_5_Button" element on "commonPagesHeader" wizard is enabled
    Then "Step_6_Button_text" element on "commonPagesHeader" should contains "Advanced" value
    Then verify "Back_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then verify "Next_Button" element on "Modal_Wizard_Form" wizard is disabled
    Then verify "Schedule_Training_Job_Button" element on "Modal_Wizard_Form" wizard is enabled
    Then verify "Run_Training_Now_Button" element on "Modal_Wizard_Form" wizard is enabled
    And click on "Step_1_Button" element on "commonPagesHeader" wizard
    Then "Form_Header_Run_Details" element on "commonPagesHeader" should contains "Run Details" value
    And click on "Step_3_Button" element on "commonPagesHeader" wizard
    Then "Form_Header_Parameters" element on "commonPagesHeader" should contains "Parameters" value
    And click on "Step_4_Button" element on "commonPagesHeader" wizard
    Then "Form_Header_Hyperparameter_Strategy" element on "commonPagesHeader" should contains "Hyperparameter strategy" value
    And click on "Run_Training_Now_Button" element on "Modal_Wizard_Form" wizard
    Then verify "Run_Training_Now_Button" element on "Modal_Wizard_Form" wizard is disabled
    Then verify "Schedule_Training_Job_Button" element on "Modal_Wizard_Form" wizard is disabled
    Then verify data in "Parameters_Table" table on "Modal_Wizard_Form" wizard
            | name_verify           |         type_dropdown_verify         | value_verify |
            | model_class           |                str                   |              |

  @MLD
  Scenario: MLD020 - Check Run Details components on Train Model wizard
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then click on "Train_Button" element on "Datasets_Info_Pane" wizard
    And wait load page
    Then "Form_Header_Run_Details" element on "commonPagesHeader" should contains "Run Details" value
    Then "Hyperparameter_Checkbox" element should be unchecked on "Modal_Wizard_Form" wizard
    Then verify "Run_Name_Input" element visibility on "Modal_Wizard_Form" wizard
    Then type value "/" to "Run_Name_Input" field on "Modal_Wizard_Form" wizard
    Then verify "Run_Name_Input" on "Modal_Wizard_Form" wizard should display options "Input_Hint"."Run_Name_Hint"
    Then verify "Version_Tag_Dropdown" element on "Modal_Wizard_Form" wizard is disabled by class name
    Then verify "Handler_Dropdown" element visibility on "Modal_Wizard_Form" wizard
    Then verify "Handler_Dropdown" dropdown element on "Modal_Wizard_Form" wizard should contains "Common_Lists"."Handler_List"
    Then verify "Labels_Table" element visibility on "Modal_Wizard_Form" wizard
    And click on "Add_Label_Button" element on "Modal_Wizard_Form" wizard
    Then type value "/" to "Run_Details_Labels_Key" field on "Modal_Wizard_Form" wizard
    Then verify labels warning should display options "Input_Hint"."Labels_Warning_Key"
    Then type value "/" to "Run_Details_Labels_Value" field on "Modal_Wizard_Form" wizard without inputgroup
    When click on "Title" element on "Modal_Wizard_Form" wizard
    And click on "Close_Label_Button" element on "Modal_Wizard_Form" wizard   
    When add rows to "Labels_Table" table on "Modal_Wizard_Form" wizard
            | key_input | value_input |
            |    key1   |    value1   |
            |    key2   |    value2   |
            |    key3   |    value3   |
    Then verify values in "Labels_Table" table on "Modal_Wizard_Form" wizard with attribute
            | key_verify | value_verify | 
            |    key1    |    value1    |
            |    key2    |    value2    |
            |    key3    |    value3    |
    Then verify "Image_Name_Input_Run_Details" element visibility on "Modal_Wizard_Form" wizard
    Then type value "" to "Image_Name_Input_Run_Details" field on "Modal_Wizard_Form" wizard
    Then verify "Image_Name_Input_Run_Details" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
    Then "Image_Name_Text_Run_Details" component on "Modal_Wizard_Form" should contains "Modal_Wizard_Form"."Image_Name_Text"

  @MLD
  Scenario: MLD021 - Check Data Inputs components on Train Model wizard
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 3 in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then click on "Train_Button" element on "Datasets_Info_Pane" wizard
    And wait load page
    Then "Form_Header_Run_Details" element on "commonPagesHeader" should contains "Run Details" value
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    Then "Form_Header_Data_Inputs" element on "commonPagesHeader" should contains "Data Inputs" value
    Then verify "Data_Inputs_Headers" on "Modal_Wizard_Form" wizard should contains "Modal_Wizard_Form"."Data_Inputs_Table_Header"
    Then verify data in "Data_Inputs_Table" table on "Modal_Wizard_Form" wizard
            | name_verify |                     path_verify                       |      
            | dataset     | store://datasets/default/test_new_structure2#0:latest | 
            | sample_set  |                                                       | 
            | test_set    |                                                       | 
    When add data to "Data_Inputs_Table" table on "Modal_Wizard_Form" wizard with a pre-filled table
            | name_input | path_dropdown |      path_input     |
            |    name1   |      V3IO     | container-name/file |
            |    name2   |      V3IO     | container-name/file |
            |    name3   |      V3IO     | container-name/file |
    Then verify data in "Data_Inputs_Table" table on "Modal_Wizard_Form" wizard
            | name_verify |                     path_verify                       |    
            |   dataset   | store://datasets/default/test_new_structure2#0:latest | 
            | sample_set  |                                                       | 
            |   test_set  |                                                       | 
            |    name1    |             v3io:///container-name/file               | 
            |    name2    |             v3io:///container-name/file               | 
            |    name3    |             v3io:///container-name/file               | 
    When click on "delete_btn" with data in "Data_Inputs_Table" table on "Modal_Wizard_Form" wizard with offset "false"
            | name_verify |
            |    name1    |
            |    name3    |
    Then verify data in "Data_Inputs_Table" table on "Modal_Wizard_Form" wizard
            | name_verify |                    path_verify                        |    
            |   dataset   | store://datasets/default/test_new_structure2#0:latest | 
            | sample_set  |                                                       | 
            |   test_set  |                                                       | 
            |    name2    |              v3io:///container-name/file              |    
    Then edit 4 row in "Data_Inputs_Table" key-value table on "Modal_Wizard_Form" wizard
            | name_input | path_input |
            |   edited   |   edited   |
    Then verify data in "Data_Inputs_Table" table on "Modal_Wizard_Form" wizard
            | name_verify |                    path_verify                        |    
            |   dataset   | store://datasets/default/test_new_structure2#0:latest | 
            | sample_set  |                                                       | 
            |   test_set  |                                                       | 
            | name2edited |         v3io:///container-name/fileedited             |

  @MLD
  Scenario: MLD022 - Check Parameters components on Train Model wizard
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then click on "Train_Button" element on "Datasets_Info_Pane" wizard
    And wait load page
    Then "Form_Header_Run_Details" element on "commonPagesHeader" should contains "Run Details" value
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    Then "Form_Header_Parameters" element on "commonPagesHeader" should contains "Parameters" value
    Then verify "Parameters_Headers" on "Modal_Wizard_Form" wizard should contains "Modal_Wizard_Form"."Parameters_Table_Header"
    Then verify data in "Parameters_Table" table on "Modal_Wizard_Form" wizard
            | name_verify           |         type_dropdown_verify         | value_verify |
            | model_class           |                str                   |              |
            | label_columns         |  Optional[Union[str, List[str]]]     |              |
            | drop_columns          |              List[str]               |              |
            | model_name            |                str                   |     model    |
            | tag                   |                str                   |              |
            | train_test_split_size |                float                 |              |
            | random_state          |                int                   |              |
            | labels                |                dict                  |              |
    When add custom parameters to "Parameters_Table" table on "Modal_Wizard_Form" wizard with a pre-filled table
            | name_input | type_dropdown | value_input |
            |    name1   |      str      |    value1   |
            |    name2   |      int      |      1      |
            |    name3   |      float    |     0.5     |
    Then verify data in "Parameters_Table" table on "Modal_Wizard_Form" wizard
            | name_verify           |         type_dropdown_verify         | value_verify |
            | model_class           |                str                   |              |
            | label_columns         |  Optional[Union[str, List[str]]]     |              |
            | drop_columns          |              List[str]               |              |
            | model_name            |                str                   |     model    |
            | tag                   |                str                   |              |
            | train_test_split_size |                float                 |              |
            | random_state          |                int                   |              |
            | labels                |                dict                  |              |
            | name1                 |                str                   |    value1    |
            | name2                 |                int                   |      1       |
            | name3                 |               float                  |     0.5      | 
    When click on "delete_btn" in "Parameters_Table" table on "Modal_Wizard_Form" wizard with offset "false"
            | name_verify |
            |    name3    |
            |    name1    |
    Then verify data in "Parameters_Table" table on "Modal_Wizard_Form" wizard
            | name_verify           |         type_dropdown_verify         | value_verify |
            | model_class           |                str                   |              |
            | label_columns         |  Optional[Union[str, List[str]]]     |              |
            | drop_columns          |              List[str]               |              |
            | model_name            |                str                   |     model    |
            | tag                   |                str                   |              |
            | train_test_split_size |                float                 |              |
            | random_state          |                int                   |              |
            | labels                |                dict                  |              |
            | name2                 |                int                   |      1       |
    Then edit 9 row in "Parameters_Table" key-value table on "Modal_Wizard_Form" wizard
            |  name_input | value_input |
            |    edited   |     234     |   
    Then verify data in "Parameters_Table" table on "Modal_Wizard_Form" wizard
            | name_verify           |         type_dropdown_verify         | value_verify |
            | model_class           |                str                   |              |
            | label_columns         |  Optional[Union[str, List[str]]]     |              |
            | drop_columns          |              List[str]               |              |
            | model_name            |                str                   |     model    |
            | tag                   |                str                   |              |
            | train_test_split_size |                float                 |              |
            | random_state          |                int                   |              |
            | labels                |                dict                  |              |
            | name2edited           |                int                   |     1234     |

  @MLD
  Scenario: MLD023 - Check Resources components on Train Model wizard
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then click on "Train_Button" element on "Datasets_Info_Pane" wizard
    And wait load page
    Then "Form_Header_Run_Details" element on "commonPagesHeader" should contains "Run Details" value
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    Then "Form_Header_Resources" element on "commonPagesHeader" should contains "Resources" value
    Then verify "Pods_Priority_Dropdown" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then verify "Pods_Priority_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Common_Lists"."Pods_Priority_List"
    Then verify "Node_Selection_Subheader" element visibility in "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then "Node_Selection_Subheader" element in "Resources_Accordion" on "Modal_Wizard_Form" should contains "Node selection" value
    When add data rows to "Resources_Node_Selector_Table" key-value table in "Resources_Accordion" on "Modal_Wizard_Form" wizard
            | key_input | value_input |
            | key1      | value1      |
            | key2      | value2      |
            | key3      | value3      |
            | key4      | value4      |
    Then verify data values in "Resources_Node_Selector_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard
            | key  | value  |
            | key1 | value1 |
            | key2 | value2 |
            | key3 | value3 |
            | key4 | value4 |
    When click on "delete_btn" in "Resources_Node_Selector_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard with offset "false"
            | key  |
            | key3 |
            | key1 |
    Then verify data values in "Resources_Node_Selector_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard
            | key  | value  |
            | key2 | value2 |
            | key4 | value4 |
    Then edit 2 row in "Resources_Node_Selector_Table" key-value table in "Resources_Accordion" on "Modal_Wizard_Form" wizard
            | key_input        | value_input      |
            | edited           | edited           |
    Then verify data values in "Resources_Node_Selector_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard
            | key        | value        |
            | key2edited | value2edited |
            | key4       | value4       |
    Then verify "Memory_Request_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."Memory_Unit_Options"
    Then verify "Memory_Limit_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."Memory_Unit_Options"
    Then type value "0" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Minimum_Value_Warning"
    Then type value "1" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then type value "1025" to "Memory_Request_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Limit_Number_Warning"
    Then verify "Memory_Request_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Request_Number_Warning"
    Then type value "2" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then select "KB" option in "Memory_Limit_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Limit_Number_Warning"
    Then verify "Memory_Request_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Request_Number_Warning"
    Then select "KB" option in "Memory_Request_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then type value "" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
    Then type value "2" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then select "GB" option in "Memory_Request_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then verify "Memory_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Limit_Number_Warning"
    Then verify "Memory_Request_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Request_Number_Warning"
    Then verify "CPU_Request_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."CPU_Unit_Options"
    Then verify "CPU_Limit_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."CPU_Unit_Options"
    Then select "millicpu" option in "CPU_Limit_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then select "millicpu" option in "CPU_Request_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then type value "0" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then verify "CPU_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Minimum_Value_Warning"
    Then type value "1" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then type value "1025" to "CPU_Request_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then verify "CPU_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Limit_Number_Warning" 
    Then verify "CPU_Request_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Request_Number_Warning" 
    Then type value "0" to "GPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then verify "GPU_Limit_Number_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Minimum_Value_Warning"
    Then verify "Memory_Request_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."Memory_Unit_Options"
    Then type value "1" to "Memory_Request_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then increase value on 15 points in "Memory_Request_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then decrease value on 15 points in "Memory_Request_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then verify "Memory_Limit_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."Memory_Unit_Options"
    Then type value "2" to "Memory_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then increase value on 15 points in "Memory_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then decrease value on 15 points in "Memory_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then verify "CPU_Request_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."CPU_Unit_Options"
    Then type value "3" to "CPU_Request_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then increase value on 15 points in "CPU_Request_Number_Input" field with "millicpu" on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then decrease value on 15 points in "CPU_Request_Number_Input" field with "millicpu" on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then select "cpu" option in "CPU_Request_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then verify "CPU_Request_Number_Input" input should contains "0.003" value in "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then verify "CPU_Limit_Dropdown" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."CPU_Unit_Options"
    Then type value "4" to "CPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then increase value on 15 points in "CPU_Limit_Number_Input" field with "millicpu" on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then decrease value on 15 points in "CPU_Limit_Number_Input" field with "millicpu" on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then select "cpu" option in "CPU_Limit_Dropdown" dropdown on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then verify "CPU_Limit_Number_Input" input should contains "0.004" value in "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then type value "5" to "GPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then increase value on 15 points in "GPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then decrease value on 15 points in "GPU_Limit_Number_Input" field on "Resources_Accordion" on "Modal_Wizard_Form" wizard
    Then verify "Volumes_Subheader" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Label_Hint"."New_Job_Volumes"
    When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Container_Input | Volume_Paths_Table_Access_Key_Input | Volume_Paths_Table_Resource_Path_Input | Add_New_Row_Button |
            |             V3IO                 |                                      |                               |                                    |                                     |                                        |         yes        |
    Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
    Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
    Then verify "Volume_Paths_Table_Access_Key_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
    Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Mount_Path_Hint"
    Then verify "Volume_Paths_Table_Container_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Data_Container_Hint"
    Then verify "Volume_Paths_Table_Access_Key_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."DataAccess_Key_Hint"
    Then verify "Volume_Paths_Table_Resource_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Relative_Directory_Path_Hint"
    When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard
    When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Config_Map_Input | Add_New_Row_Button |
            |           Config Map             |                                      |                               |                                     |         yes        |
    Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
    Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
    Then verify "Volume_Paths_Table_Config_Map_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
    Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Mount_Path_Hint"
    When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard
    When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Secret_Name_Input | Add_New_Row_Button |
            |             Secret               |                                      |                               |                                      |         yes        |
    Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
    Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
    Then verify "Volume_Paths_Table_Secret_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
    Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Mount_Path_Hint"
    When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard
    When add new volume rows to "Volume_Paths_Table" table in "Resources_Accordion" on "Modal_Wizard_Form" wizard using nontable inputs
            | Volume_Paths_Table_Type_Dropdown | Volume_Paths_Table_Volume_Name_Input | Volume_Paths_Table_Path_Input | Volume_Paths_Table_Claime_Name_Input | Add_New_Row_Button |
            |               PVC                |                                      |                               |                                      |         yes        |
    Then verify "Volume_Paths_Table_Volume_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
    Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
    Then verify "Volume_Paths_Table_Claime_Name_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display warning "Input_Hint"."Input_Field_Require"
    Then verify "Volume_Paths_Table_Path_Input" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard should display hint "Input_Hint"."Mount_Path_Hint"
    When click on "Delete_New_Row_Button" element in "Resources_Accordion" on "Modal_Wizard_Form" wizard

  @MLD
  Scenario: MLD024 - Check Advanced components on Train Model wizard
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then click on "Train_Button" element on "Datasets_Info_Pane" wizard
    And wait load page
    Then "Form_Header_Run_Details" element on "commonPagesHeader" should contains "Run Details" value
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    Then "Form_Header_Advanced" element on "commonPagesHeader" should contains "Advanced" value
    Then "Accordion_Advanced_Subheader" element on "Modal_Wizard_Form" should contains "Environment variables" value
    Then verify "Advanced_Environment_Variables_Table" element visibility on "Modal_Wizard_Form" wizard 
    When add data to "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard
            | name_input | type_dropdown | value_input |
            |    name1   |      Value    |    value1   |
            |    name2   |      Value    |      1      |
            |    name3   |      Value    |     0.5     |    
    Then verify data in "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard
            | name_verify | type_dropdown_verify | value_verify |
            |    name1    |        value         |    value1    |
            |    name2    |        value         |      1       | 
            |    name3    |        value         |     0.5      |  
    Then edit dropdown field 1 row in "Advanced_Environment_Variables_Table" key-value table on "Modal_Wizard_Form" wizard
            | type_dropdown |  value_input | value_input_key |
            |     Secret    | sectretName1 |   sectretKey1   |
    Then edit dropdown field 3 row in "Advanced_Environment_Variables_Table" key-value table on "Modal_Wizard_Form" wizard
            | type_dropdown |  value_input | value_input_key |
            |     Secret    | sectretName2 |   sectretKey2   |
    Then verify data in "Advanced_Environment_Variables_Table" table on "Modal_Wizard_Form" wizard
            | name_verify | type_dropdown_verify |        value_verify      |
            |    name1    |        secret        | sectretName1:sectretKey1 |
            |    name2    |        value         |             1            | 
            |    name3    |        secret        | sectretName2:sectretKey2 |

  @MLD
  Scenario: MLD025 - Check Hyperparameter strategy components on Train Model wizard
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then click on "Train_Button" element on "Datasets_Info_Pane" wizard
    And wait load page
    Then "Form_Header_Run_Details" element on "commonPagesHeader" should contains "Run Details" value
    Then check "Hyperparameter_Checkbox" element on "Modal_Wizard_Form" wizard
    Then "Hyperparameter_Checkbox" element should be checked on "Modal_Wizard_Form" wizard
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    And click on "Next_Button" element on "Modal_Wizard_Form" wizard
    Then "Form_Header_Hyperparameter_Strategy" element on "commonPagesHeader" should contains "Hyperparameter strategy" value
    Then verify "Strategy_Dropdown" element in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard should contains "Dropdown_Options"."Hyperparameter_Strategy_Options"
    Then verify "Strategy_Dropdown" dropdown in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard selected option value "List"
    Then verify "Max_Iterations" element in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard is disabled by class name
    Then verify "Max_Errors" element in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard is disabled by class name
    Then select "Grid" option in "Strategy_Dropdown" dropdown on "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard
    Then verify "Strategy_Dropdown" dropdown in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard selected option value "Grid"
    Then verify "Max_Iterations" element in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard is disabled by class name
    Then verify "Max_Errors" element in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard is disabled by class name
    Then select "Random" option in "Strategy_Dropdown" dropdown on "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard
    Then verify "Strategy_Dropdown" dropdown in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard selected option value "Random"
    Then verify "Max_Iterations" element in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard is enabled by class name
    Then verify "Max_Errors" element in "Hyperparameter_Strategy_Accordion" on "Modal_Wizard_Form" wizard is enabled by class name
    Then "Ranking_Subheader" element on "Modal_Wizard_Form" should contains "Ranking" value
    When type value "ordinal" to "Ranking_Result_Input" field on "Modal_Wizard_Form" wizard
    Then verify "Ranking_Criteria_Dropdown" dropdown element on "Modal_Wizard_Form" wizard should contains "Common_Lists"."Ranking_Criteria_List"
    Then "Stop_Condition_Subheader" element on "Modal_Wizard_Form" should contains "Stop condition" value
    When type value "dbutils.notebook.exit()" to "Stop_Condition_Input" field on "Modal_Wizard_Form" wizard
    Then "Parallelism_Subheader" element on "Modal_Wizard_Form" should contains "Parallelism" value
    Then type value "5" to "Parallel_Runs_Number_Input" field on "Modal_Wizard_Form" wizard
    Then increase value on 4 points in "Parallel_Runs_Number_Input" field on "Modal_Wizard_Form" wizard
    Then decrease value on 4 points in "Parallel_Runs_Number_Input" field on "Modal_Wizard_Form" wizard
    When type value "cluster.dashboard_link" to "Dask_Clutter_URL_Input" field on "Modal_Wizard_Form" wizard
    Then "Teardown_Checkbox" element should be unchecked on "Modal_Wizard_Form" wizard
    Then check "Teardown_Checkbox" element on "Modal_Wizard_Form" wizard
    Then "Teardown_Checkbox" element should be checked on "Modal_Wizard_Form" wizard

  @MLD
  @FAILED_TODO
  #TODO: bug - not all artifacts are being displayed - ML-5942
  Scenario: MLD026 - Verify dataset elements visibility on Datasets Table with low number of rows
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then verify that 9 row elements are displayed in "Datasets_Table" on "Datasets" wizard
    When click on cell with row index 1 in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then verify "Info_Pane_Tab_Selector" on "Datasets_Info_Pane" wizard should contains "Datasets_Info_Pane"."Tab_List"
    Then verify that 9 row elements are displayed in "Datasets_Table" on "Datasets" wizard
    Then click on "Cross_Close_Button" element on "Datasets_Info_Pane" wizard
    Then verify that 6 row elements are displayed in "Datasets_Table" on "Datasets" wizard
    Then click on "Table_FilterBy_Button" element on "Datasets" wizard
    Then select "All" option in "Table_Tree_Filter_Dropdown" dropdown on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then check "expand_btn" visibility in "Datasets_Table" on "Datasets" wizard
    Then verify that 6 row elements are displayed in "Datasets_Table" on "Datasets" wizard
    Then click on cell with row index 1 in "expand_btn" column in "Datasets_Table" table on "Datasets" wizard
    Then verify that 7 row elements are displayed in "Datasets_Table" on "Datasets" wizard
    Then select "View YAML" option in action menu on "Datasets" wizard in "Datasets_Table" table at row with "latest" value in "name_expand_btn" column
    Then verify if "View_YAML" popup dialog appears
    Then verify that 7 row elements are displayed in "Datasets_Table" on "Datasets" wizard
    Then click on "Cross_Cancel_Button" element on "View_YAML" wizard
    Then verify that 7 row elements are displayed in "Datasets_Table" on "Datasets" wizard
    Then click on cell with row index 2 in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then verify "Info_Pane_Tab_Selector" on "Datasets_Info_Pane" wizard should contains "Datasets_Info_Pane"."Tab_List"
    Then verify that 10 row elements are displayed in "Datasets_Table" on "Datasets" wizard
    Then click on "Cross_Close_Button" element on "Datasets_Info_Pane" wizard
    Then verify that 7 row elements are displayed in "Datasets_Table" on "Datasets" wizard
    Then click on cell with row index 1 in "expand_btn" column in "Datasets_Table" table on "Datasets" wizard
    Then verify that 6 row elements are displayed in "Datasets_Table" on "Datasets" wizard

  @MLD
  Scenario: MLD027 - Verify dataset elements visibility on Datasets Table with high number of rows
    * create "new_dataset_10" Dataset with "set_10" tag in "churn-project-admin" project with code 200
    * create "new_dataset_11" Dataset with "set_11" tag in "churn-project-admin" project with code 200
    * create "new_dataset_12" Dataset with "set_12" tag in "churn-project-admin" project with code 200
    * create "new_dataset_13" Dataset with "set_13" tag in "churn-project-admin" project with code 200
    * create "new_dataset_14" Dataset with "set_14" tag in "churn-project-admin" project with code 200
    * create "new_dataset_15" Dataset with "set_15" tag in "churn-project-admin" project with code 200
    * create "new_dataset_16" Dataset with "set_16" tag in "churn-project-admin" project with code 200
    * create "new_dataset_17" Dataset with "set_17" tag in "churn-project-admin" project with code 200
    * create "new_dataset_18" Dataset with "set_18" tag in "churn-project-admin" project with code 200
    * create "new_dataset_19" Dataset with "set_19" tag in "churn-project-admin" project with code 200
    * create "new_dataset_20" Dataset with "set_20" tag in "churn-project-admin" project with code 200
    * create "new_dataset_21" Dataset with "set_21" tag in "churn-project-admin" project with code 200
    * create "new_dataset_22" Dataset with "set_22" tag in "churn-project-admin" project with code 200
    * create "new_dataset_23" Dataset with "set_23" tag in "churn-project-admin" project with code 200
    * create "new_dataset_24" Dataset with "set_24" tag in "churn-project-admin" project with code 200
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify that 16 row elements are displayed in "Datasets_Table" on "Datasets" wizard
    Then verify that 16 web elements are exist in "Datasets_Table_View" on "Datasets" wizard
    Then check "new_dataset_10" value in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then check "new_dataset_24" value in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then check "test-regressor_cox-test-summary" value in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then check "survival-curves_coxhazard-summary" value not in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then check "iris_gen_iris_dataset" value not in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then check "data_clean_cleaned-data" value not in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then click on cell with value "test-regressor_cox-test-summary" in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then "Header" element on "Datasets_Info_Pane" should contains "test-regressor_cox-test-summary" value
    Then click on "Cross_Close_Button" element on "Datasets_Info_Pane" wizard
    And wait load page
    And wait load page
    Then verify that 22 row elements are displayed in "Datasets_Table" on "Datasets" wizard
    Then verify that 22 web elements are exist in "Datasets_Table_View" on "Datasets" wizard
    Then check "survival-curves_coxhazard-summary" value in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then check "iris_gen_iris_dataset" value in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then check "new_dataset_10" value not in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then check "data_clean_cleaned-data" value not in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then click on cell with value "iris_gen_iris_dataset" in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then "Header" element on "Datasets_Info_Pane" should contains "iris_gen_iris_dataset" value
    Then click on "Cross_Close_Button" element on "Datasets_Info_Pane" wizard
    Then verify that 21 row elements are displayed in "Datasets_Table" on "Datasets" wizard
    Then verify that 21 web elements are exist in "Datasets_Table_View" on "Datasets" wizard
    Then check "new_dataset_11" value not in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then check "new_dataset_12" value not in "name" column in "Datasets_Table" table on "Datasets" wizard
    Then check "data_clean_cleaned-data" value in "name" column in "Datasets_Table" table on "Datasets" wizard
