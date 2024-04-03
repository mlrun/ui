Feature: Models Page

  Testcases that verifies functionality on Models Page

  @MLM
  #TODO: Register_Model_Button hidden from 1.4.0, running on demo mode
  @passive
  Scenario: MLM001 - Check all mandatory components on Models tab
    Given open url
    And turn on demo mode
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "project" label should be equal "default" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Models" value
    Then click on breadcrumbs "project" label on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify "Models_Tab_Selector" on "Models" wizard should contains "Models"."Tab_List"
    Then verify "Table_Name_Filter_Input" element visibility on "Models" wizard
    Then click on "Table_FilterBy_Button" element on "Models" wizard
    Then verify "Table_Label_Filter_Input" element visibility on "Artifacts_FilterBy_Popup" wizard
    Then verify "Table_Tree_Filter_Dropdown" element visibility on "Artifacts_FilterBy_Popup" wizard
    Then verify "Table_Tree_Filter_Dropdown" dropdown element on "Artifacts_FilterBy_Popup" wizard should contains "Dropdown_Options"."Tag_Filer_Options"
    Then verify "Show_Iterations_Checkbox" element visibility on "Artifacts_FilterBy_Popup" wizard
    Then verify "Table_Refresh_Button" element visibility on "Models" wizard
    Then verify "Models_Table" element visibility on "Models" wizard
    Then verify "Register_Model_Button" element visibility on "Models" wizard
    Then "Register_Model_Button" element on "Models" should contains "Register model" value
    Then verify "Train_Model_Button" element visibility on "Models" wizard
    Then "Train_Model_Button" element on "Models" should contains "Train model" value
    Then click on "Train_Model_Button" element on "Models" wizard
    And wait load page
    Then verify "Title" element visibility on "Modal_Wizard_Form" wizard
    Then "Title" element on "Modal_Wizard_Form" should contains "Train Model" value
    Then verify "Cross_Close_Button" element visibility on "Modal_Wizard_Form" wizard
    Then click on "Cross_Close_Button" element on "Modal_Wizard_Form" wizard

  @MLM
  @passive
  @FAILED_TODO
  #TODO: Bug - UI crash upon navigating to model endpoints tab ML-5919 (fixed on rc6)
  Scenario: MLM002 - Check all mandatory components on Model Endpoints tab
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "project" label should be equal "default" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    And select "tab" with "Project monitoring" value in breadcrumbs menu
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Models" value
    And select "Model Endpoints" tab in "Models_Tab_Selector" on "Models" wizard
    And wait load page
    Then verify "Model Endpoints" tab is active in "Models_Tab_Selector" on "Models" wizard
    Then verify "Table_Label_Filter_Input" element visibility on "Model_Endpoints" wizard
    Then verify "Table_Sort_By_Filter" element visibility on "Model_Endpoints" wizard
    Then verify "Table_Refresh_Button" element visibility on "Model_Endpoints" wizard
    Then verify "Model_Endpoints_Table" element visibility on "Model_Endpoints" wizard

  @MLM
  @passive
  Scenario: MLM003 - Check all mandatory components on Real-Time Pipelines tab
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "project" label should be equal "default" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Models" value
    And select "Real-Time Pipelines" tab in "Models_Tab_Selector" on "Models" wizard
    And wait load page
    Then verify "Real-Time Pipelines" tab is active in "Models_Tab_Selector" on "Models" wizard
    Then verify "Table_Name_Filter_Input" element visibility on "Real_Time_Pipelines" wizard
    Then verify "Table_Refresh_Button" element visibility on "Real_Time_Pipelines" wizard
    Then verify "Real_Time_Pipelines_Table" element visibility on "Real_Time_Pipelines" wizard

  @MLM
  @passive
  Scenario: MLM004 - Verify filtering by model name on Models tab
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify "Table_Name_Filter_Input" element visibility on "Models" wizard
    Then type value "survival" to "Table_Name_Filter_Input" field on "Models" wizard
    Then click on "Table_Refresh_Button" element on "Models" wizard
    And wait load page
    Then value in "name" column with "text" in "Models_Table" on "Models" wizard should contains "survival"

  @MLM
  @passive
  Scenario: MLM005 - Verify behaviour of Show iterations checkbox on Models tab
    Given open url
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Models" wizard
    Then verify "Show_Iterations_Checkbox" element visibility on "Artifacts_FilterBy_Popup" wizard
    Then check "expand_btn" not presented in "Models_Table" on "Models" wizard
    Then uncheck "Show_Iterations_Checkbox" element on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Models" wizard
    Then "Show_Iterations_Checkbox" element should be unchecked on "Artifacts_FilterBy_Popup" wizard
    Then check "expand_btn" visibility in "Models_Table" on "Models" wizard
    Then click on cell with row index 1 in "expand_btn" column in "Models_Table" table on "Models" wizard
    And wait load page
    Then click on cell with row index 1 in "name" column in "Models_Table" table on "Models" wizard
    Then verify "Header" element visibility on "Models_Info_Pane" wizard
    Then click on "Table_FilterBy_Button" element on "Models" wizard
    Then check "Show_Iterations_Checkbox" element on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then verify "Header" element not exists on "Models_Info_Pane" wizard
    Then click on "Table_FilterBy_Button" element on "Models" wizard
    Then "Show_Iterations_Checkbox" element should be checked on "Artifacts_FilterBy_Popup" wizard

  @MLM
  @passive
  Scenario: MLM006 - Verify filtering by name on Real-Time Pipelines tab
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "project" label should be equal "churn-project-admin" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Models" value
    And select "Real-Time Pipelines" tab in "Models_Tab_Selector" on "Models" wizard
    And wait load page
    Then verify "Real-Time Pipelines" tab is active in "Models_Tab_Selector" on "Models" wizard
    Then type value "  " to "Table_Name_Filter_Input" field on "Real_Time_Pipelines" wizard
    Then verify "Table_Name_Filter_Input" on "Real_Time_Pipelines" wizard should display warning "Input_Hint"."Input_Field_Invalid"
    Then type value "churn-server" to "Table_Name_Filter_Input" field on "Real_Time_Pipelines" wizard
    Then click on "Table_Refresh_Button" element on "Real_Time_Pipelines" wizard
    And wait load page
    Then value in "name" column with "text" in "Real_Time_Pipelines_Table" on "Real_Time_Pipelines" wizard should contains "churn-server"

  @MLM
  @passive
  Scenario: MLM007 - Verify filtering by label with key on Models tab
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Models" wizard
    Then type value "my-key" to "Table_Label_Filter_Input" field on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then value in "labels" column with "dropdowns" in "Models_Table" on "Models" wizard should contains "my-key" in "Overlay"
    Then click on "Table_FilterBy_Button" element on "Models" wizard
    Then type value "my-key=my-value" to "Table_Label_Filter_Input" field on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then value in "labels" column with "dropdowns" in "Models_Table" on "Models" wizard should contains "my-key=my-value" in "Overlay"
    Then click on "Table_FilterBy_Button" element on "Models" wizard
    Then type value "MY-KEY" to "Table_Label_Filter_Input" field on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard
    Then "No_Data_Message" component on "commonPagesHeader" should contains "No_Data_Message"."No_Models_data"

  @MLM
  @passive
  @FAILED_TODO
  #TODO: Bug - UI crash upon navigating to model endpoints tab ML-5919 (fixed on rc6)
  Scenario: MLM008 - Verify filtering by label on Model Endpoints tab
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    And select "Model Endpoints" tab in "Models_Tab_Selector" on "Models" wizard
    And wait load page
    Then verify "Model Endpoints" tab is active in "Models_Tab_Selector" on "Models" wizard
    Then verify "Table_Label_Filter_Input" element visibility on "Model_Endpoints" wizard
    Then type value "my-key" to "Table_Label_Filter_Input" field on "Model_Endpoints" wizard
    Then click on "Table_Refresh_Button" element on "Model_Endpoints" wizard
    And wait load page
    Then value in "labels" column with "dropdowns" in "Model_Endpoints_Table" on "Model_Endpoints" wizard should contains "my-key=my-value" in "Overlay"
    Then type value "my-key=my-value" to "Table_Label_Filter_Input" field on "Model_Endpoints" wizard
    Then click on "Table_Refresh_Button" element on "Model_Endpoints" wizard
    And wait load page
    Then value in "labels" column with "dropdowns" in "Model_Endpoints_Table" on "Model_Endpoints" wizard should contains "my-key=my-value" in "Overlay"
    Then type value "MY-KEY" to "Table_Label_Filter_Input" field on "Model_Endpoints" wizard
    Then click on "Table_Refresh_Button" element on "Model_Endpoints" wizard
    And wait load page
    And verify "No_Data_Message" element visibility on "commonPagesHeader" wizard

  @MLM
  #TODO: Register_Model_Button hidden from 1.4.0, running on demo mode
  @passive
  Scenario: MLM009 - Check all mandatory components on Register Model Popup
    Given open url
    And turn on demo mode
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify "Register_Model_Button" element visibility on "Models" wizard
    Then "Register_Model_Button" element on "Models" should contains "Register model" value
    Then click on "Register_Model_Button" element on "Models" wizard
    Then navigate back
    Then verify "Title" element not exists on "Register_Model_Popup" wizard
    Then click on "Register_Model_Button" element on "Models" wizard
    Then verify if "Register_Model_Popup" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "Register_Model_Popup" wizard
    Then verify "New_File_Name_Input" element visibility on "Register_Model_Popup" wizard
    Then type value "   " to "New_File_Name_Input" field on "Register_Model_Popup" wizard
    Then verify "New_File_Name_Input" on "Register_Model_Popup" wizard should display options "Input_Hint"."Artifact_Name_Hint"
    Then verify options in "Path_Scheme_Combobox" combobox in "Target_Path" on "Register_Model_Popup" wizard should contains "Models"."Combobox_Options"
    When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_Model_Popup" wizard
    When type value "  " to "Path_Scheme_Combobox" field on "Target_Path" on "Register_Model_Popup" wizard
    Then verify "Path_Scheme_Combobox" element in "Target_Path" on "Register_Model_Popup" wizard should display warning "Input_Hint"."V3IO_Path_Hint"
    Then verify "New_File_Description_Input" element visibility on "Register_Model_Popup" wizard
    Then check "New_File_Description_Input" textarea counter on "Register_Model_Popup" wizard
    Then type value "   " to "New_File_Description_Input" field on "Register_Model_Popup" wizard
    Then verify "New_File_Description_Input" on "Register_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
    Then verify "Cancel_Button" element visibility on "Register_Model_Popup" wizard
    Then "Cancel_Button" element on "Register_Model_Popup" should contains "Cancel" value
    Then verify "Register_Button" element visibility on "Register_Model_Popup" wizard
    Then "Register_Button" element on "Register_Model_Popup" should contains "Register" value
    Then click on "Register_Button" element on "Register_Model_Popup" wizard
    Then verify "Register_Button" element on "Register_Model_Popup" wizard is disabled
    Then type value "model" to "New_File_Name_Input" field on "Register_Model_Popup" wizard
    When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_Model_Popup" wizard
    When type value "target/path" to "Path_Scheme_Combobox" field on "Target_Path" on "Register_Model_Popup" wizard
    Then type value "new model description" to "New_File_Description_Input" field on "Register_Model_Popup" wizard
    Then check "New_File_Description_Input" textarea counter on "Register_Model_Popup" wizard
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
    Then verify "Register_Button" element on "Register_Model_Popup" wizard is enabled
    Then click on "Cancel_Button" element on "Register_Model_Popup" wizard
    Then verify if "Common_Popup" popup dialog appears
    Then click on "Cancel_Button" element on "Common_Popup" wizard
    Then verify if "Register_Model_Popup" popup dialog appears
    Then verify "New_File_Name_Input" input should contains "model" value on "Register_Model_Popup" wizard
    Then verify "Path_Scheme_Combobox" input should contains "target/path" value in "Target_Path" on "Register_Model_Popup" wizard
    Then verify "New_File_Description_Input" input should contains "new model description" value on "Register_Model_Popup" wizard
    Then verify values in "Labels_Table" table on "Register_Model_Popup" wizard with attribute
            | key_verify | value_verify | 
            |    key2    |    value2    |
    Then click on "Cross_Cancel_Button" element on "Register_Model_Popup" wizard
    Then verify if "Common_Popup" popup dialog appears
    Then click on "Cancel_Button" element on "Common_Popup" wizard
    Then verify if "Register_Model_Popup" popup dialog appears
    Then verify "New_File_Name_Input" input should contains "model" value on "Register_Model_Popup" wizard
    Then verify "Path_Scheme_Combobox" input should contains "target/path" value in "Target_Path" on "Register_Model_Popup" wizard
    Then verify "New_File_Description_Input" input should contains "new model description" value on "Register_Model_Popup" wizard
    Then verify values in "Labels_Table" table on "Register_Model_Popup" wizard with attribute
            | key_verify | value_verify | 
            |    key2    |    value2    |
    Then navigate back
    Then verify if "Common_Popup" popup dialog appears
    Then click on "Cancel_Button" element on "Common_Popup" wizard
    Then navigate back
    Then verify if "Common_Popup" popup dialog appears
    Then click on "Confirm_Button" element on "Common_Popup" wizard
    And wait load page
    Then verify "Title" element not exists on "Register_Model_Popup" wizard
    Then navigate forward
    Then verify "Title" element not exists on "Register_Model_Popup" wizard

  @MLM
  #TODO: Register_Model_Button hidden from 1.4.0, running on demo mode
  Scenario: MLM010 - Verify behaviour on Register new Model
    * set tear-down property "model" created in "default" project with "automation-model" value
    Given open url
    And turn on demo mode
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on "Register_Model_Button" element on "Models" wizard
    Then verify if "Register_Model_Popup" popup dialog appears
    Then type value "automation-model" to "New_File_Name_Input" field on "Register_Model_Popup" wizard
    When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_Model_Popup" wizard
    When type value "path/to/model.txt" to "Path_Scheme_Combobox" field on "Target_Path" on "Register_Model_Popup" wizard
    Then click on "Register_Button" element on "Register_Model_Popup" wizard
    And wait load page
    Then click on cell with value "automation-model" in "name" column in "Models_Table" table on "Models" wizard
    Then "Header" element on "Models_Info_Pane" should contains "automation-model" value
    Then check "automation-model" value in "key" column in "Overview_Table" table on "Models_Info_Pane" wizard
    Then check "latest" value in "tag" column in "Overview_Table" table on "Models_Info_Pane" wizard
    Then check "model" value in "kind" column in "Overview_Table" table on "Models_Info_Pane" wizard
    Then check "v3io:///path/to/" value in "path" column in "Overview_Table" table on "Models_Info_Pane" wizard
    Then check "model.txt" value in "model_file" column in "Overview_Table" table on "Models_Info_Pane" wizard

  @MLM
  @passive
  Scenario: MLM011 - Check MLRun logo redirection
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    And click on "MLRun_Logo" element on "commonPagesHeader" wizard
    And wait load page
    Then verify "Projects_Table" element visibility on "Projects" wizard

  @MLM
  @passive
  Scenario: MLM012 - Verify action menu list, Downloads action,  View YAML action
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify action menu on "Models" wizard in "Models_Table" table with "model_default" value in "name" column should contains "Common_Lists"."Action_Menu_List"
    Then select "Download" option in action menu on "Models" wizard in "Models_Table" table at row with "model_default" value in "name" column
    And wait load page
    And wait load page
    Then verify "Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Download_Pop_Up_Cross_Cancel_Button" element visibility on "Downloads_Popup" wizard
    And wait load page
    Then verify "Header_Download_Pop_Up" element visibility on "Downloads_Popup" wizard
    Then "Header_Download_Pop_Up" element on "Downloads_Popup" should contains "Downloads" value
    Then click on "Download_Pop_Up_Cross_Cancel_Button" element on "Downloads_Popup" wizard
    Then select "View YAML" option in action menu on "Models" wizard in "Models_Table" table at row with "model_default" value in "name" column
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard
    Then click on "Cross_Cancel_Button" element on "View_YAML" wizard
    Then click on "Table_FilterBy_Button" element on "Models" wizard
    Then uncheck "Show_Iterations_Checkbox" element on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then click on cell with row index 1 in "expand_btn" column in "Models_Table" table on "Models" wizard
    Then select "View YAML" option in action menu on "Models" wizard in "Models_Table" table at row with "latest" value in "name_expand_btn" column
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

  @MLM
  @passive
  Scenario: MLM013 - Verify View YAML action in Item infopane
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Models_Table" table on "Models" wizard
    Then verify "Action_Menu" element visibility on "Models_Info_Pane" wizard
    Then select "View YAML" option in action menu on "Models_Info_Pane" wizard
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

  @MLM
  @passive
  Scenario: MLM014 - Check all mandatory components in Item infopane on Overview tab table
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 2 in "name" column in "Models_Table" table on "Models" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "Models_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard should contains "Models_Info_Pane"."Tab_List_Extended"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify "Header" element visibility on "Models_Info_Pane" wizard
    Then verify "Updated" element visibility on "Models_Info_Pane" wizard
    Then verify "Action_Menu" element visibility on "Models_Info_Pane" wizard
    Then verify "Action_Menu" dropdown element on "Models_Info_Pane" wizard should contains "Common_Lists"."Action_Menu_List"
    Then select "Download" option in action menu on "Models_Info_Pane" wizard
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
    Then verify "Cross_Close_Button" element visibility on "Models_Info_Pane" wizard
    Then verify "Full_View_Button" element visibility on "Models_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Models_Info_Pane" wizard should contains "Models_Info_Pane"."Overview_General_Headers"
    Then verify "Overview_Hash_Header" on "Models_Info_Pane" wizard should display "Label_Hint"."Overview_Hash"
    Then verify "Overview_UID_Header" on "Models_Info_Pane" wizard should display "Label_Hint"."Overview_UID"
    Then verify "Overview_Producer_Headers" on "Models_Info_Pane" wizard should contains "Models_Info_Pane"."Overview_Producer_Headers"
    Then verify "Overview_Sources_Headers" on "Models_Info_Pane" wizard should contains "Models_Info_Pane"."Overview_Sources_Headers"
    Then select "Preview" tab in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify "Preview" tab is active in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify "Models" tab is active in "Models_Tab_Selector" on "Models" wizard
    Then select "Features" tab in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify "Features" tab is active in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify "Models" tab is active in "Models_Tab_Selector" on "Models" wizard
    Then select "Statistics" tab in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify "Statistics" tab is active in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify cell with "Statistics" value in "key" column in "Info_Pane_Tab_Selector" table on "Models_Info_Pane" wizard should display "Label_Hint"."Models_Statistics"
    Then verify "Models" tab is active in "Models_Tab_Selector" on "Models" wizard
    Then click on "Full_View_Button" element on "Models_Info_Pane" wizard
    Then verify "Cross_Close_Button" element not exists on "Models_Info_Pane" wizard
    Then click on "Tabel_View_Button" element on "Models_Info_Pane" wizard
    Then verify "Cross_Close_Button" element visibility on "Models_Info_Pane" wizard

  @MLM
  Scenario: MLM026 - Verify the Delete option state in Models table and Overview details action menu 
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And select "tab" with "Models" value in breadcrumbs menu
    And wait load page
    Then verify action menu on "Models" wizard in "Models_Table" table with "current-state_model" value in "name" column should contains "Common_Lists"."Action_Menu_List"
    Then verify that in action menu on "Models" wizard in "Models_Table" table with "current-state_model" value in "name" column "Delete" option is enabled
    When click on cell with row index 1 in "name" column in "Models_Table" table on "Models" wizard
    Then check "latest" value in "tag" column in "Overview_Table" table on "Models_Info_Pane" wizard
    Then verify "Action_Menu" element visibility on "Models_Info_Pane" wizard
    Then verify "Action_Menu" dropdown element on "Models_Info_Pane" wizard should contains "Common_Lists"."Action_Menu_List"
    Then check that "Delete" option in action menu on "Models_Info_Pane" wizard is enabled
    Then click on "Edit_btn_table_view" element on "Models_Info_Pane" wizard
    And wait load page
    When type value "" to "Version_tag_Input" field on "Models_Info_Pane" wizard
    Then click on "Apply_Button" element on "Models_Info_Pane" wizard
    Then click on "Apply_Changes_Button" element on "Models_Info_Pane" wizard
    And wait load page
    Then verify "Table_FilterBy_Button" element visibility on "Models" wizard
    Then click on "Table_FilterBy_Button" element on "Models" wizard
    Then select "All" option in "Table_Tree_Filter_Dropdown" dropdown on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then verify action menu on "Models" wizard in "Models_Table" table with "current-state_model" value in "name" column should contains "Common_Lists"."Action_Menu_List"
    Then verify that in action menu on "Models" wizard in "Models_Table" table with "current-state_model" value in "name" column "Delete" option is disabled
    When click on cell with row index 1 in "name" column in "Models_Table" table on "Models" wizard
    Then check "Click to add" value in "tag" column in "Overview_Table" table on "Models_Info_Pane" wizard
    Then verify "Action_Menu" dropdown element on "Models_Info_Pane" wizard should contains "Common_Lists"."Action_Menu_List"
    Then check that "Delete" option in action menu on "Models_Info_Pane" wizard is disabled

  @MLM
  @passive
  Scenario: MLM025 - Verify Preview, Deploy option, view Preview, Deploy action, Preview tab
      Given open url
      And wait load page
      And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
      And wait load page
      Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
      And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
      And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
      And hover "MLRun_Logo" component on "commonPagesHeader" wizard
      And wait load page
      Then verify "preview" option is present on "Models" wizard in "Models_Table" table with "transaction_fraud_xgboost" value in "name" column
      Then click on "preview" option on "Models" wizard in "Models_Table" table with "transaction_fraud_xgboost" value in "name" column
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
      Then verify "deploy" option is present on "Models" wizard in "Models_Table" table with "transaction_fraud_xgboost" value in "name" column
      Then click on "deploy" option on "Models" wizard in "Models_Table" table with "transaction_fraud_xgboost" value in "name" column
      Then verify if "Common_Popup" popup dialog appears
      Then "Title" element on "Common_Popup" should contains "Failed to deploy model" value
      Then "Message" component on "Common_Popup" should contains "Messages"."How_To_Create"
      Then verify "Cross_Cancel_Button" element visibility on "Common_Popup" wizard
      Then click on "Cross_Cancel_Button" element on "Common_Popup" wizard
      When click on cell with value "transaction_fraud_xgboost" in "name" column in "Models_Table" table on "Models" wizard
      Then select "Preview" tab in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
      And wait load page
      Then verify "Pop_Out_Button" element visibility on "Models_Info_Pane" wizard 
      Then click on "Pop_Out_Button" element on "Models_Info_Pane" wizard
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
      And select "project" with "churn-project-admin" value in breadcrumbs menu
      And wait load page
      Then verify breadcrumbs "project" label should be equal "churn-project-admin" value
      Then verify "deploy" option is present on "Models" wizard in "Models_Table" table with "current-state_model" value in "name" column
      Then click on "deploy" option on "Models" wizard in "Models_Table" table with "current-state_model" value in "name" column
      Then verify if "Deploy_Model_Popup" popup dialog appears
      Then verify "Title" element visibility on "Deploy_Model_Popup" wizard
      Then "Title" element on "Deploy_Model_Popup" should contains "Deploy Model" value
      Then verify "Cross_Cancel_Button" element visibility on "Deploy_Model_Popup" wizard
      Then click on "Cross_Cancel_Button" element on "Deploy_Model_Popup" wizard

  @MLM
  Scenario: MLM015 - Check Labels table components in Item infopane on Overview tab table
    * set tear-down property "model" created in "default" project with "test-model" value
    * create "test-model" Model with "latest" tag in "default" project with code 200
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    When click on cell with value "test-model" in "name" column in "Models_Table" table on "Models" wizard
    And wait load page
    Then verify "Header" element visibility on "Models_Info_Pane" wizard
    When add rows to "Labels_Table" table on "Models_Info_Pane" wizard
            | key_input | value_input |
            |    key1   |    value1   |
            |    key2   |    value2   |
            |    key3   |    value3   |
    Then verify values in "Labels_Table" table on "Models_Info_Pane" wizard with attribute
            | key_verify | value_verify | 
            |    key1    |    value1    |
            |    key2    |    value2    |
            |    key3    |    value3    |
    When click on "remove_btn" in "Labels_Table" table on "Models_Info_Pane" wizard with attribute
            | key_verify | 
            |    key3    |    
            |    key1    |
    Then verify values in "Labels_Table" table on "Models_Info_Pane" wizard with attribute
            | key_verify | value_verify | 
            |    key2    |    value2    |
    Then click on "Labels_Apply_Button" element on "Models_Info_Pane" wizard
    And wait load page
    Then verify "Apply_Changes_Button" element on "Models_Info_Pane" wizard is enabled
    Then click on "Apply_Changes_Button" element on "Models_Info_Pane" wizard
    And wait load page
    Then verify values in "Labels_Table" table on "Models_Info_Pane" wizard with attribute
            | key_verify | value_verify | 
            |    key2    |    value2    |
    And wait load page
    Then click on "Notification_Pop_Up_Cross_Close_Button" element on "Notification_Popup" wizard
    And wait load page
    When click on "remove_btn" in "Labels_Table" table on "Models_Info_Pane" wizard with attribute
            | key_verify | 
            |    key2    |    
    Then click on "Labels_Apply_Button" element on "Models_Info_Pane" wizard
    Then click on "Apply_Changes_Button" element on "Models_Info_Pane" wizard
    And wait load page
    When add rows to "Labels_Table" table on "Models_Info_Pane" wizard
            | key_input | value_input |
            |    key3   |    value3   |
            |    key4   |    value4   |
    Then click on "Labels_Apply_Button" element on "Models_Info_Pane" wizard
    Then click on "Apply_Changes_Button" element on "Models_Info_Pane" wizard
    And wait load page
    Then verify values in "Labels_Table" table on "Models_Info_Pane" wizard with attribute
            | key_verify | value_verify | 
            |    key3   |    value3   |
            |    key4   |    value4   |
    
  @MLM
  @passive
  @FAILED_TODO
  #TODO: Bug - UI crash upon navigating to model endpoints tab ML-5919 (fixed on rc6)
  Scenario: MLM016 - Check all mandatory components in Item infopane on Overview tab table on Model Endpoints tab
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    And select "Model Endpoints" tab in "Models_Tab_Selector" on "Models" wizard
    And wait load page
    Then save to context "name" column and "href" attribute on 1 row from "Model_Endpoints_Table" table on "Model_Endpoints" wizard
    When click on cell with row index 1 in "name" column in "Model_Endpoints_Table" table on "Model_Endpoints" wizard
    Then compare current browser URL with test "href" context value
    Then verify "Info_Pane_Tab_Selector" element visibility on "Models_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard should contains "Models_Endpoints_Info_Pane"."Tab_List"
    Then verify cell with "Features Analysis" value in "key" column in "Info_Pane_Tab_Selector" table on "Models_Info_Pane" wizard should display "Label_Hint"."Feature_Analysis"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify "Header" element visibility on "Models_Info_Pane" wizard
    Then verify "Cross_Close_Button" element visibility on "Models_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Models_Info_Pane" wizard should contains "Models_Endpoints_Info_Pane"."Overview_General_Headers"
    Then verify "Overview_Drift_Headers" on "Models_Info_Pane" wizard should contains "Models_Endpoints_Info_Pane"."Overview_Drift_Headers"

  @MLM
  @passive
  Scenario: MLM027 - Check Details panel still active on page refresh
    * set tear-down property "model" created in "default" project with "test-model" value
    * create "test-model" Model with "v1" tag in "default" project with code 200
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Models" wizard
    Then select "v1" option in "Table_Tree_Filter_Dropdown" dropdown on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    When click on cell with value "test-model" in "name" column in "Models_Table" table on "Models" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "Models_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard should contains "Models_Info_Pane"."Tab_List_Extended"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify "Header" element visibility on "Models_Info_Pane" wizard
    Then "Header" element on "Models_Info_Pane" should contains "test-model" value
    Then refresh a page
    Then verify "Header" element visibility on "Models_Info_Pane" wizard
    Then "Header" element on "Models_Info_Pane" should contains "test-model" value

  @MLM
  @passive
  @inProgress
  Scenario: MLM028 - Check tab list compontnts on Model Item infopane
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Models_Table" table on "Models" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "Models_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard should contains "Models_Info_Pane"."Tab_List_Extended"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify "Overview_Sources_Headers" on "Models_Info_Pane" wizard should contains "Models_Info_Pane"."Overview_Sources_Headers"

  @MLM
  @passive
  Scenario: MLM029 - Check components on Deploy Model Popup
    * set tear-down property "function" created in "default" project with "automation-test-function-1" value
    * set tear-down property "function" created in "default" project with "automation-test-function-2" value
    * set tear-down property "model" created in "default" project with "automation-test-model" value
    * create "automation-test-function-1" Function with "serving" kind and "latest" tag in "default" project with code 200
    * create "automation-test-function-2" Function with "serving" kind and "non-latest" tag in "default" project with code 200
    * create "automation-test-model" Model with "latest" tag in "default" project with code 200
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    Then verify "deploy" option is present on "Models" wizard in "Models_Table" table with "automation-test-model" value in "name" column
    Then click on "deploy" option on "Models" wizard in "Models_Table" table with "automation-test-model" value in "name" column
    Then verify if "Deploy_Model_Popup" popup dialog appears
    Then navigate back
    Then verify "Title" element not exists on "Deploy_Model_Popup" wizard
    Then navigate forward
    Then verify "Title" element not exists on "Deploy_Model_Popup" wizard
    Then verify "deploy" option is present on "Models" wizard in "Models_Table" table with "automation-test-model" value in "name" column
    Then click on "deploy" option on "Models" wizard in "Models_Table" table with "automation-test-model" value in "name" column
    Then verify if "Deploy_Model_Popup" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "Deploy_Model_Popup" wizard
    Then verify "Serving_Function_Dropdown" element visibility on "Deploy_Model_Popup" wizard
    Then select "automation-test-function-2" option in "Serving_Function_Dropdown" dropdown on "Deploy_Model_Popup" wizard
    Then verify "Tag_Dropdown" element visibility on "Deploy_Model_Popup" wizard
    Then select "non-latest" option in "Tag_Dropdown" dropdown on "Deploy_Model_Popup" wizard
    Then verify "Model_Name_Input" element visibility on "Deploy_Model_Popup" wizard
    Then verify "Model_Name_Input" input should contains "automation-test-model" value on "Deploy_Model_Popup" wizard
    Then type value "/" to "Model_Name_Input" field on "Deploy_Model_Popup" wizard
    Then verify "Model_Name_Input" on "Deploy_Model_Popup" wizard should display options "Input_Hint"."Artifact_Name_Hint_Deploy_Model"
    Then verify "Model_Name_Input" options rules on form "Deploy_Model_Popup" wizard
    Then verify "Model_Name_Input" on "Deploy_Model_Popup" wizard should display "Input_Hint"."Deploy_Model_Name_Hint"
    Then type value "/" to "Model_Name_Input" field on "Deploy_Model_Popup" wizard
    Then verify "Class_Name_Input" element visibility on "Deploy_Model_Popup" wizard
    Then type value "  " to "Class_Name_Input" field on "Deploy_Model_Popup" wizard
    Then verify "Class_Name_Input" on "Deploy_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Require"
    Then verify "Cancel_Button" element visibility on "Deploy_Model_Popup" wizard
    Then "Cancel_Button" element on "Deploy_Model_Popup" should contains "Cancel" value
    Then verify "Deploy_Button" element visibility on "Deploy_Model_Popup" wizard
    Then "Deploy_Button" element on "Deploy_Model_Popup" should contains "Deploy" value
    Then click on "Deploy_Button" element on "Deploy_Model_Popup" wizard
    Then verify "Deploy_Button" element on "Deploy_Model_Popup" wizard is disabled
    Then verify "Model_Name_Input" on "Deploy_Model_Popup" wizard should display options "Input_Hint"."Artifact_Name_Hint_Deploy_Model"
    Then type value "automation-test-model" to "Model_Name_Input" field on "Deploy_Model_Popup" wizard
    Then verify "Class_Name_Input" on "Deploy_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Require"
    Then type value "Class" to "Class_Name_Input" field on "Deploy_Model_Popup" wizard
    Then verify "Deploy_Button" element on "Deploy_Model_Popup" wizard is enabled
    Then click on "Cancel_Button" element on "Deploy_Model_Popup" wizard
    Then verify if "Common_Popup" popup dialog appears
    Then click on "Cancel_Button" element on "Common_Popup" wizard
    Then verify if "Deploy_Model_Popup" popup dialog appears
    Then verify "Model_Name_Input" input should contains "automation-test-model" value on "Deploy_Model_Popup" wizard
    Then verify "Class_Name_Input" input should contains "Class" value on "Deploy_Model_Popup" wizard
    Then verify "Serving_Function_Dropdown" dropdown on "Deploy_Model_Popup" wizard selected option value "automation-test-function-2"
    Then verify "Tag_Dropdown" dropdown on "Deploy_Model_Popup" wizard selected option value "non-latest"
    Then click on "Cross_Cancel_Button" element on "Deploy_Model_Popup" wizard
    Then verify if "Common_Popup" popup dialog appears
    Then click on "Cancel_Button" element on "Common_Popup" wizard
    Then verify if "Deploy_Model_Popup" popup dialog appears
    Then verify "Model_Name_Input" input should contains "automation-test-model" value on "Deploy_Model_Popup" wizard
    Then verify "Class_Name_Input" input should contains "Class" value on "Deploy_Model_Popup" wizard
    Then verify "Serving_Function_Dropdown" dropdown on "Deploy_Model_Popup" wizard selected option value "automation-test-function-2"
    Then verify "Tag_Dropdown" dropdown on "Deploy_Model_Popup" wizard selected option value "non-latest"
    Then navigate back
    Then verify if "Common_Popup" popup dialog appears
    Then click on "Cancel_Button" element on "Common_Popup" wizard
    Then navigate back
    Then verify if "Common_Popup" popup dialog appears
    Then click on "Confirm_Button" element on "Common_Popup" wizard
    And wait load page
    Then verify "Title" element not exists on "Deploy_Model_Popup" wizard
    Then navigate forward
    Then verify "Title" element not exists on "Deploy_Model_Popup" wizard

    @MLM
    Scenario: MLM030 - Verify behaviour of key-value table on Deploy Model Popup
     Given open url
     And wait load page
     And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
     And wait load page
     And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
     And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
     And wait load page
     And hover "MLRun_Logo" component on "commonPagesHeader" wizard
     Then verify "deploy" option is present on "Models" wizard in "Models_Table" table with "current-state_model" value in "name" column
     Then click on "deploy" option on "Models" wizard in "Models_Table" table with "current-state_model" value in "name" column
     Then verify if "Deploy_Model_Popup" popup dialog appears
     When add new volume rows to "Key_Value_Table" table in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard using nontable inputs
       | Class_Argument_Name_Input | Class_Argument_Value_Input | Add_New_Row_Button | Delete_New_Row_Button |
       |           \n name0        |            \n value0       | yes                |                       |
     Then verify "Class_Argument_Name_Input" element in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
     Then verify "Class_Argument_Value_Input" element in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
     Then click on "Delete_New_Row_Button" element in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard
     When add new volume rows to "Key_Value_Table" table in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard using nontable inputs
       | Class_Argument_Name_Input | Class_Argument_Value_Input | Add_New_Row_Button | Delete_New_Row_Button |
       | name1                     | value1                     | yes                |                       |
       | name2                     | value2                     | yes                |                       |
       | name3                     | value3                     |                    | yes                   |
       | name4                     | value4                     | yes                |                       |
       | name5                     | value5                     |                    | yes                   |
       | name6                     | value6                     | yes                |                       |
     Then verify data values in "Key_Value_Table" table in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard
       | name  | value  |
       | name1 | value1 |
       | name2 | value2 |
       | name4 | value4 |
       | name6 | value6 |
     When click on "delete_btn" with data in "Key_Value_Table" table in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard with offset "false"
       | name  |
       | name6 |
       | name1 |
     Then verify data values in "Key_Value_Table" table in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard
       | name  | value  |
       | name2 | value2 |
       | name4 | value4 |
     When add new volume rows to "Key_Value_Table" table in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard using nontable inputs
       | Class_Argument_Name_Input | Class_Argument_Value_Input | Add_New_Row_Button | Delete_New_Row_Button |
       |           name2           |            value2          | yes                |                       |
     Then verify "Class_Argument_Name_Input" in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard should display options "Input_Hint"."Input_Field_Unique"
     When click on "edit_btn" with data in "Key_Value_Table" table in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard with offset "false"
       | name  |
       | name2 |
     Then type value "edited_name2" to "Class_Argument_Name_Input" field on "Deploy_Model_Table" on "Deploy_Model_Popup" wizard
     Then type value "edited_value2" to "Class_Argument_Value_Input" field on "Deploy_Model_Table" on "Deploy_Model_Popup" wizard
     Then click on "Add_New_Row_Button" element in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard
     Then verify data values in "Key_Value_Table" table in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard
       | name         | value         |
       | edited_name2 | edited_value2 |
       | name4        | value4        |
     Then click on "Cancel_Button" element on "Deploy_Model_Popup" wizard
     Then verify if "Common_Popup" popup dialog appears
     Then click on "Cancel_Button" element on "Common_Popup" wizard
     Then verify if "Deploy_Model_Popup" popup dialog appears
     Then verify data values in "Key_Value_Table" table in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard
       | name         | value         |
       | edited_name2 | edited_value2 |
       | name4        | value4        |

  @MLM
  #TODO: arrow lines position - y not found
  @passive
  Scenario: MLM031 - Verify behaviour of Real-Time Pipelines table
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    Then click on "Project_Monitoring_Button" element on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "project" label should be equal "churn-project-admin" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Models" value
    And select "Real-Time Pipelines" tab in "Models_Tab_Selector" on "Models" wizard
    And wait load page
    Then verify "Real-Time Pipelines" tab is active in "Models_Tab_Selector" on "Models" wizard
    Then check "expand_btn" visibility in "Real_Time_Pipelines_Table" on "Real_Time_Pipelines" wizard
    Then save to context "name" column and "href" attribute on 1 row from "Real_Time_Pipelines_Table" table on "Real_Time_Pipelines" wizard
    When click on cell with row index 1 in "name" column in "Real_Time_Pipelines_Table" table on "Real_Time_Pipelines" wizard
    And wait load page
    Then compare current browser URL with test "href" context value
    Then verify "Real_Time_Pipelines_Graph" element visibility on "Real_Time_Pipelines" wizard
    # Then verify arrow lines position on "Real_Time_Pipelines_Graph" on "Real_Time_Pipelines" wizard
    When click on node with index 2 in "Real_Time_Pipelines_Graph" graph on "Real_Time_Pipelines" wizard
    Then verify "Header" element visibility on "Real_Time_Pipeline_Pane" wizard
    Then verify "Cross_Close_Button" element visibility on "Real_Time_Pipeline_Pane" wizard
    Then verify "Overview_Headers" on "Real_Time_Pipeline_Pane" wizard should contains "Real_Time_Pipeline_Pane"."Overview_Headers"
    Then click on "Arrow_Back" element on "Real_Time_Pipeline_Pane" wizard
    And wait load page
    Then save to context "function" column and "href" attribute on 1 row from "Real_Time_Pipelines_Table" table on "Real_Time_Pipelines" wizard
    Then click on cell with row index 1 in "function" column in "Real_Time_Pipelines_Table" table on "Real_Time_Pipelines" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "ML functions" value
    Then compare current browser URL with test "href" context value
    Then compare "Header" element value on "ML_Function_Info_Pane" wizard with test "function" context value

  @MLM
  @FAILED_TODO
  #TODO: Bug - UI crash upon navigating to model endpoints tab ML-5919 (fixed on rc6)
  Scenario: MLM032 - Check broken link redirection
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    Then click on "Project_Monitoring_Button" element on "commonPagesHeader" wizard
    And wait load page
    And select "tab" with "Models" value in breadcrumbs menu
    And wait load page
    Then verify redirection from "projects/default/models/INVALID" to "projects/default/models/models"
    When click on cell with row index 3 in "name" column in "Models_Table" table on "Models" wizard
    Then verify redirection from "projects/default/models/INVALID/model_default/latest/0/overview" to "projects/default/models/models"
    Then verify redirection from "projects/default/models/models/INVALID/latest/0/overview" to "projects/default/models/models"
    When click on cell with row index 3 in "name" column in "Models_Table" table on "Models" wizard
    Then verify redirection from "projects/default/models/models/model_default/latest/0/INVALID" to "projects/default/models/models/model_default/latest/0/overview"
    Then verify redirection from "projects/default/models/models/model_default/latest/0/INVALID" to "projects/default/models/models/model_default/latest/0/overview"
    Then verify redirection from "projects/default/models/models/model_default/latest/INVALID/overview" to "projects/default/models/models"
    When click on cell with row index 1 in "name" column in "Models_Table" table on "Models" wizard
    Then select "Preview" tab in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    And wait load page
    When select "Model Endpoints" tab in "Models_Tab_Selector" on "Models" wizard
    And wait load page
    Then verify redirection from "projects/default/models/INVALID" to "projects/default/models/models"
    When select "Model Endpoints" tab in "Models_Tab_Selector" on "Models" wizard
    And wait load page
    Then click on cell with row index 1 in "name" column in "Model_Endpoints_Table" table on "Model_Endpoints" wizard
    Then verify redirection from "projects/default/models/model-endpoints/RandomForestClassifier/a7c95783e6a726a1a233e581ea898ba33fa7e342/INVALID" to "projects/default/models/model-endpoints/RandomForestClassifier/a7c95783e6a726a1a233e581ea898ba33fa7e342/overview"
    Then select "Features Analysis" tab in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify redirection from "projects/default/models/model-endpoints/RandomForestClassifier/a7c95783e6a726a1a233e581ea898ba33fa7e342/INVALID" to "projects/default/models/model-endpoints/RandomForestClassifier/a7c95783e6a726a1a233e581ea898ba33fa7e342/overview"
    Then verify redirection from "projects/default/models/model-endpoints/RandomForestClassifier/INVALID/overview" to "projects/default/models/model-endpoints"
    When select "Real-Time Pipelines" tab in "Models_Tab_Selector" on "Models" wizard
    And wait load page
    Then verify redirection from "projects/default/models/INVALID" to "projects/default/models/models"
    Then select "Real-Time Pipelines" tab in "Models_Tab_Selector" on "Models" wizard
    And wait load page
    Then click on cell with row index 1 in "name" column in "Real_Time_Pipelines_Table" table on "Real_Time_Pipelines" wizard
    Then verify redirection from "projects/default/models/real-time-pipelines/pipeline/INVALID" to "projects/default/models/real-time-pipelines"
    Then verify redirection from "projects/INVALID/models/real-time-pipelines" to "projects"
  
  @MLM
  @FAILED_TODO
  #TODO: Bug - UI crash upon navigating to model endpoints tab ML-5919 (fixed on rc6)
  Scenario: MLM033 - Check active/highlited items with details panel on Model Endpoints tab
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    And select "Model Endpoints" tab in "Models_Tab_Selector" on "Models" wizard
    And wait load page
    Then verify "Model Endpoints" tab is active in "Models_Tab_Selector" on "Models" wizard
    Then verify "Model_Endpoints_Table" element visibility on "Model_Endpoints" wizard
    Then click on cell with row index 1 in "name" column in "Model_Endpoints_Table" table on "Model_Endpoints" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "Models_Info_Pane" wizard
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify "Header" element visibility on "Models_Info_Pane" wizard
    Then save to context "name" column on 1 row from "Model_Endpoints_Table" table on "Model_Endpoints" wizard
    Then compare "Header" element value on "Models_Info_Pane" wizard with test "name" context value
	  Then verify that row index 1 is active in "Model_Endpoints_Table" table on "Model_Endpoints" wizard
    Then verify that row index 2 is NOT active in "Model_Endpoints_Table" table on "Model_Endpoints" wizard
    Then click on cell with row index 2 in "name" column in "Model_Endpoints_Table" table on "Model_Endpoints" wizard  
    Then verify that row index 2 is active in "Model_Endpoints_Table" table on "Model_Endpoints" wizard   
    Then verify that row index 1 is NOT active in "Model_Endpoints_Table" table on "Model_Endpoints" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "Models_Info_Pane" wizard
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify "Header" element visibility on "Models_Info_Pane" wizard
    Then save to context "name" column on 2 row from "Model_Endpoints_Table" table on "Model_Endpoints" wizard
    Then compare "Header" element value on "Models_Info_Pane" wizard with test "name" context value

  @MLM
  Scenario: MLM034 - Check active/highlited items with details panel on Models tab
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on cell with row index 1 in "name" column in "Models_Table" table on "Models" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "Models_Info_Pane" wizard
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify "Header" element visibility on "Models_Info_Pane" wizard
    Then save to context "name" column on 1 row from "Models_Table" table on "Models" wizard
    Then compare "Header" element value on "Models_Info_Pane" wizard with test "name" context value
	  Then verify that row index 1 is active in "Models_Table" table on "Models" wizard
    Then verify that row index 2 is NOT active in "Models_Table" table on "Models" wizard
    Then click on cell with row index 2 in "name" column in "Models_Table" table on "Models" wizard  
    Then verify that row index 2 is active in "Models_Table" table on "Models" wizard   
    Then verify that row index 1 is NOT active in "Models_Table" table on "Models" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "Models_Info_Pane" wizard
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify "Header" element visibility on "Models_Info_Pane" wizard
    Then save to context "name" column on 2 row from "Models_Table" table on "Models" wizard
    Then compare "Header" element value on "Models_Info_Pane" wizard with test "name" context value

  @MLM  
  Scenario: MLM020 - Check that version tag is filled when edit it in table view and full view on Overview tab table on Models page
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Models_Table" table on "Models" wizard
    Then verify "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard should contains "Models_Info_Pane"."Tab_List_Extended"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Models_Info_Pane" wizard should contains "Models_Info_Pane"."Overview_General_Headers"
    Then check "latest" value in "tag" column in "Overview_Table" table on "Models_Info_Pane" wizard
    Then click on "Edit_btn_table_view" element on "Models_Info_Pane" wizard    
    Then verify "Version_tag_Input_table_view" on "Models_Info_Pane" wizard should contains "latest" value
    Then click on "Full_View_Button" element on "Models_Info_Pane" wizard
    Then verify "Cross_Close_Button" element not exists on "Models_Info_Pane" wizard
    Then click on "Edit_btn_full_view" element on "Models_Info_Pane" wizard
    Then verify "Version_tag_Input_full_view" on "Models_Info_Pane" wizard should contains "latest" value   
    Then click on "Tabel_View_Button" element on "Models_Info_Pane" wizard
    Then verify "Cross_Close_Button" element visibility on "Models_Info_Pane" wizard

  @MLM
  Scenario: MLM021 - Check that version tag dropdown shows all tags on filters wizard on Models page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 2 in "name" column in "Models_Table" table on "Models" wizard
    Then verify "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard should contains "Models_Info_Pane"."Tab_List_Extended"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Models_Info_Pane" wizard should contains "Models_Info_Pane"."Overview_General_Headers"
    Then check "latest" value in "tag" column in "Overview_Table" table on "Models_Info_Pane" wizard
    Then click on "Edit_btn_table_view" element on "Models_Info_Pane" wizard
    And wait load page
    When type value "newTag" to "Version_tag_Input" field on "Models_Info_Pane" wizard
    Then click on "Apply_Button" element on "Models_Info_Pane" wizard
    Then click on "Apply_Changes_Button" element on "Models_Info_Pane" wizard
    And wait load page
    Then verify "Table_FilterBy_Button" element visibility on "Models" wizard
    Then click on "Table_FilterBy_Button" element on "Models" wizard
    Then select "newTag" option in "Table_Tree_Filter_Dropdown" dropdown on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then check "newTag" value in "tag" column in "Models_Table" table on "Models" wizard

  @MLM
  Scenario: MLM023 - Check that version tag has "Click to add" status when it's empty after edited
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Models_Table" table on "Models" wizard
    Then verify "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard should contains "Models_Info_Pane"."Tab_List_Extended"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Models_Info_Pane" wizard should contains "Models_Info_Pane"."Overview_General_Headers"   
    Then check "latest" value in "tag" column in "Overview_Table" table on "Models_Info_Pane" wizard
    Then click on "Edit_btn_table_view" element on "Models_Info_Pane" wizard
    Then type value "" to "Version_tag_Input" field on "Models_Info_Pane" wizard
    Then click on "Apply_Button" element on "Models_Info_Pane" wizard
    Then click on "Apply_Changes_Button" element on "Models_Info_Pane" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Models" wizard
    Then select "All" option in "Table_Tree_Filter_Dropdown" dropdown on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Models_Table" table on "Models" wizard
    And wait load page
    Then "Version_Tag_Input_Placeholder" element on "Models_Info_Pane" should contains "Click to add" value

  @MLM
  Scenario: MLM024 - Check filter by "All" tag is performed when version tag was edited
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "Models" wizard
    Then select "All" option in "Table_Tree_Filter_Dropdown" dropdown on "Artifacts_FilterBy_Popup" wizard
    Then click on "Apply_Button" element on "Artifacts_FilterBy_Popup" wizard
    And wait load page
    Then click on cell with row index 3 in "name" column in "Models_Table" table on "Models" wizard
    Then save to context "name" column on 3 row from "Models_Table" table on "Models" wizard
    Then compare "Header" element value on "Models_Info_Pane" wizard with test "name" context value
    Then check "latest" value in "tag" column in "Overview_Table" table on "Models_Info_Pane" wizard
    Then click on "Edit_btn_table_view" element on "Models_Info_Pane" wizard
    Then type value "latest123456" to "Version_tag_Input" field on "Models_Info_Pane" wizard
    Then click on "Apply_Button" element on "Models_Info_Pane" wizard
    Then click on "Apply_Changes_Button" element on "Models_Info_Pane" wizard
    And wait load page
    Then verify "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard should contains "Models_Info_Pane"."Tab_List_Extended"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Models_Info_Pane" wizard should contains "Models_Info_Pane"."Overview_General_Headers"
    Then check "latest123456" value in "tag" column in "Overview_Table" table on "Models_Info_Pane" wizard
    Then save to context "name" column on 3 row from "Models_Table" table on "Models" wizard
    Then compare "Header" element value on "Models_Info_Pane" wizard with test "name" context value