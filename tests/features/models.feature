Feature: Models Page

  Testcases that verifies functionality on Models Page

  @passive
  @failed
  Scenario: Check all mandatory components on Models tab
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
    Then verify "Models_Tab_Selector" on "Models" wizard should contains "Models"."Tab_List"
    Then verify "Table_Name_Filter_Input" element visibility on "Models" wizard
    Then verify "Table_Labels_Filter_Input" element visibility on "Models" wizard
    Then verify "Table_Tree_Filter_Dropdown" element visibility on "Models" wizard
    Then verify "Show_Iterations_Checkbox" element visibility on "Models" wizard
    Then verify "Table_Refresh_Button" element visibility on "Models" wizard
    Then verify "Models_Table" element visibility on "Models" wizard
    Then verify "Register_Model_Button" element visibility on "Models" wizard
    Then "Register_Model_Button" element on "Models" should contains "Register Model" value
    Then verify "Table_Tree_Filter_Dropdown" dropdown element on "Models" wizard should contains "Dropdown_Options"."Tag_Filer_Options"

  @passive
  Scenario: Check all mandatory components on Model Endpoints tab
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
    And select "Model Endpoints (Beta)" tab in "Models_Tab_Selector" on "Models" wizard
    And wait load page
    Then verify "Model Endpoints (Beta)" tab is active in "Models_Tab_Selector" on "Models" wizard
    Then verify "Table_Label_Filter_Input" element visibility on "Model_Endpoints" wizard
    Then verify "Table_Sort_By_Filter" element visibility on "Model_Endpoints" wizard
    Then verify "Table_Refresh_Button" element visibility on "Model_Endpoints" wizard
    Then verify "Model_Endpoints_Table" element visibility on "Model_Endpoints" wizard

  @passive
  Scenario: Check all mandatory components on Real-Time Pipelines tab
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

  @passive
  Scenario: Verify filtering by file name on Models tab
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

  @passive
  Scenario: Verify behaviour of Show iterations checkbox on Models tab
    * set tear-down property "model" created in "default" project with "automation-model" value
    * create "automation-model" Model with "latest" tag in "default" project with code 200
    Given open url
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then verify "Show_Iterations_Checkbox" element visibility on "Models" wizard
    Then check "Show_Iterations_Checkbox" element on "Models" wizard
    And wait load page
    Then "Show_Iterations_Checkbox" element should be checked on "Models" wizard
    Then check "expand_btn" visibility in "Models_Table" on "Models" wizard
    Then click on cell with row index 1 in "expand_btn" column in "Models_Table" table on "Models" wizard
    And wait load page
    Then click on cell with row index 1 in "name" column in "Models_Table" table on "Models" wizard
    Then verify "Header" element visibility on "Models_Info_Pane" wizard
    Then uncheck "Show_Iterations_Checkbox" element on "Models" wizard
    And wait load page
    Then verify "Header" element not exists on "Models_Info_Pane" wizard
    Then "Show_Iterations_Checkbox" element should be unchecked on "Models" wizard

  @passive
  Scenario: Verify filtering by name on Real-Time Pipelines tab
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

  @passive
  @inProgress
  Scenario: Verify filtering by label with key on Models tab
    Given open url
    And wait load page
    And click on row root with value "getting-started-tutorial-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then type value "class" to "Table_Labels_Filter_Input" field on "Models" wizard
    Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
    And wait load page
    Then value in "labels" column with "dropdowns" in "Models_Table" on "Models" wizard should contains "class"
    Then type value "class=sklearn.linear_model.LogisticRegression" to "Table_Labels_Filter_Input" field on "Models" wizard
    Then click on "Table_Refresh_Button" element on "Models" wizard
    Then value in "labels" column with "dropdowns" in "Models_Table" on "Models" wizard should contains "class=sklearn.linear_model.LogisticRegression"

  @passive
  Scenario: Verify filtering by label on Model Endpoints tab
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    And select "Model Endpoints (Beta)" tab in "Models_Tab_Selector" on "Models" wizard
    And wait load page
    Then verify "Model Endpoints (Beta)" tab is active in "Models_Tab_Selector" on "Models" wizard
    Then verify "Table_Label_Filter_Input" element visibility on "Model_Endpoints" wizard
    Then type value "my-key" to "Table_Label_Filter_Input" field on "Model_Endpoints" wizard
    Then click on "Table_Refresh_Button" element on "Model_Endpoints" wizard
    And wait load page
    Then value in "labels" column with "dropdowns" in "Model_Endpoints_Table" on "Model_Endpoints" wizard should contains "my-key=my-value"
    Then type value "my-key=my-value" to "Table_Label_Filter_Input" field on "Model_Endpoints" wizard
    Then click on "Table_Refresh_Button" element on "Model_Endpoints" wizard
    And wait load page
    Then value in "labels" column with "dropdowns" in "Model_Endpoints_Table" on "Model_Endpoints" wizard should contains "my-key=my-value"

  @passive
  Scenario: Check all mandatory components on Register Model Popup
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then click on "Register_Model_Button" element on "Models" wizard
    Then verify if "Register_Model_Popup" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "Register_Model_Popup" wizard
    Then verify "New_File_Name_Input" element visibility on "Register_Model_Popup" wizard
    Then verify "New_File_Name_Input" on "Register_Model_Popup" wizard should display "Input_Hint"."Artifact_Names_Unique"
    Then type value "   " to "New_File_Name_Input" field on "Register_Model_Popup" wizard
    Then verify "New_File_Name_Input" on "Register_Model_Popup" wizard should display options "Input_Hint"."Artifact_Name_Hint"
    Then verify "New_File_Name_Input" options rules on "Register_Model_Popup" wizard
    Then verify "New_File_Target_Path_Input" element visibility on "Register_Model_Popup" wizard
    Then type value "   " to "New_File_Target_Path_Input" field on "Register_Model_Popup" wizard
    Then verify "New_File_Target_Path_Input" on "Register_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
    Then verify "New_File_Description_Input" element visibility on "Register_Model_Popup" wizard
    Then type value "   " to "New_File_Description_Input" field on "Register_Model_Popup" wizard
    Then verify "New_File_Description_Input" on "Register_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
    Then verify "Cancel_Button" element visibility on "Register_Model_Popup" wizard
    Then "Cancel_Button" element on "Register_Model_Popup" should contains "Cancel" value
    Then verify "Register_Button" element visibility on "Register_Model_Popup" wizard
    Then "Register_Button" element on "Register_Model_Popup" should contains "Register" value

  Scenario: Verify behaviour on Register new Model
    * set tear-down property "model" created in "default" project with "automation-model" value
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then click on "Register_Model_Button" element on "Models" wizard
    Then verify if "Register_Model_Popup" popup dialog appears
    Then type value "automation-model" to "New_File_Name_Input" field on "Register_Model_Popup" wizard
    Then type value "path/to/model.txt" to "New_File_Target_Path_Input" field on "Register_Model_Popup" wizard
    Then click on "Register_Button" element on "Register_Model_Popup" wizard
    And wait load page
    Then click on cell with value "automation-model" in "name" column in "Models_Table" table on "Models" wizard
    Then "Header" element on "Models_Info_Pane" should contains "automation-model" value
    Then check "automation-model" value in "key" column in "Overview_Table" table on "Models_Info_Pane" wizard
    Then check "model" value in "kind" column in "Overview_Table" table on "Models_Info_Pane" wizard
    Then check "path/to/" value in "path" column in "Overview_Table" table on "Models_Info_Pane" wizard
    Then check "model.txt" value in "model_file" column in "Overview_Table" table on "Models_Info_Pane" wizard

  @passive
  Scenario: Check MLRun logo redirection
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

  @passive
  Scenario: Verify View YAML action
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then select "View YAML" option in action menu on "Models" wizard in "Models_Table" table at row with "data_clean_model" value in "name" column
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
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Models_Table" table on "Models" wizard
    Then verify "Action_Menu" element visibility on "Models_Info_Pane" wizard
    Then select "View YAML" option in action menu on "Models_Info_Pane" wizard
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

  @passive
  Scenario: Check all mandatory components in Item infopane on Overview tab table
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Models_Table" table on "Models" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "Models_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard should contains "Models_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    Then verify "Header" element visibility on "Models_Info_Pane" wizard
    Then verify "Updated" element visibility on "Models_Info_Pane" wizard
    Then verify "Download_Button" element visibility on "Models_Info_Pane" wizard
    Then verify "Cross_Close_Button" element visibility on "Models_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Models_Info_Pane" wizard should contains "Models_Info_Pane"."Overview_General_Headers"
    Then verify "Overview_Hash_Header" on "Models_Info_Pane" wizard should display "Label_Hint"."Overview_Hash"
    Then verify "Overview_UID_Header" on "Models_Info_Pane" wizard should display "Label_Hint"."Overview_UID"

  @passive
  Scenario: Check all mandatory components in Item infopane on Overview tab table on Model Endpoints tab
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    And select "Model Endpoints (Beta)" tab in "Models_Tab_Selector" on "Models" wizard
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

  @passive
  Scenario: Check Details panel still active on page refresh
    * set tear-down property "model" created in "default" project with "test-model" value
    * create "test-model" Model with "v1" tag in "default" project with code 200
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    Then select "v1" option in "Table_Tree_Filter_Dropdown" dropdown on "Models" wizard
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

  @passive
  Scenario: Check expand sources Item infopane on Overview tab table
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Models_Table" table on "Models" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "Models_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard should contains "Models_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    When click on "Expand_Sources" element on "Models_Info_Pane" wizard
    Then verify "Info_Sources_Table" element visibility on "Models_Info_Pane" wizard

  @passive
  Scenario: Check all mandatory components on Deploy Model Popup
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
    Then select "Deploy" option in action menu on "Models" wizard in "Models_Table" table at row with "automation-test-model" value in "name" column
    Then verify if "Deploy_Model_Popup" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "Deploy_Model_Popup" wizard
    Then verify "Serving_Function_Dropdown" element visibility on "Deploy_Model_Popup" wizard
    Then select "automation-test-function-2" option in "Serving_Function_Dropdown" dropdown on "Deploy_Model_Popup" wizard
    Then verify "Tag_Dropdown" element visibility on "Deploy_Model_Popup" wizard
    Then select "non-latest" option in "Tag_Dropdown" dropdown on "Deploy_Model_Popup" wizard
    Then verify "Model_Name_Input" element visibility on "Deploy_Model_Popup" wizard
    Then verify "Model_Name_Input" input should contains "automation-test-model" value on "Deploy_Model_Popup" wizard
    Then type value "  " to "Model_Name_Input" field on "Deploy_Model_Popup" wizard
    Then verify "Model_Name_Input" on "Deploy_Model_Popup" wizard should display options "Input_Hint"."Artifact_Name_Hint"
    Then verify "Model_Name_Input" options rules on form "Deploy_Model_Popup" wizard
    Then verify "Model_Name_Input" on "Deploy_Model_Popup" wizard should display "Input_Hint"."Deploy_Model_Name_Hint"
    Then verify "Class_Name_Input" element visibility on "Deploy_Model_Popup" wizard
    Then type value "  " to "Class_Name_Input" field on "Deploy_Model_Popup" wizard
    Then verify "Class_Name_Input" on "Deploy_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
    Then verify "Cancel_Button" element visibility on "Deploy_Model_Popup" wizard
    Then "Cancel_Button" element on "Deploy_Model_Popup" should contains "Cancel" value
    Then verify "Deploy_Button" element visibility on "Deploy_Model_Popup" wizard
    Then "Deploy_Button" element on "Deploy_Model_Popup" should contains "Deploy" value
    Then click on "Deploy_Button" element on "Deploy_Model_Popup" wizard
    Then verify "Deploy_Button" element on "Deploy_Model_Popup" wizard is disabled
    Then verify "Model_Name_Input" on "Deploy_Model_Popup" wizard should display options "Input_Hint"."Artifact_Name_Hint"
    Then type value "automation-test-model" to "Model_Name_Input" field on "Deploy_Model_Popup" wizard
    Then verify "Class_Name_Input" on "Deploy_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
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

    Scenario: Verify behaviour of key-value table on Deploy Model Popup
      * set tear-down property "model" created in "default" project with "automation-test-model" value
      * create "automation-test-model" Model with "latest" tag in "default" project with code 200
      Given open url
      And wait load page
      And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
      And wait load page
      And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
      And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
      And wait load page
      Then select "Deploy" option in action menu on "Models" wizard in "Models_Table" table at row with "automation-test-model" value in "name" column
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
      Then verify values in "Key_Value_Table" table in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard
        | name  | value  |
        | name1 | value1 |
        | name2 | value2 |
        | name4 | value4 |
        | name6 | value6 |
      When click on "delete_btn" in "Key_Value_Table" table in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard with offset "false"
        | name  |
        | name6 |
        | name1 |
      Then verify values in "Key_Value_Table" table in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard
        | name  | value  |
        | name2 | value2 |
        | name4 | value4 |
      When add new volume rows to "Key_Value_Table" table in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard using nontable inputs
        | Class_Argument_Name_Input | Class_Argument_Value_Input | Add_New_Row_Button | Delete_New_Row_Button |
        |           name2           |            value2          | yes                |                       |
      Then verify "Class_Argument_Name_Input" in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard should display options "Input_Hint"."Input_Field_Unique"
      When click on "edit_btn" in "Key_Value_Table" table in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard with offset "false"
        | name  |
        | name2 |
      Then type value "edited_name2" to "Class_Argument_Name_Input" field on "Deploy_Model_Table" on "Deploy_Model_Popup" wizard
      Then type value "edited_value2" to "Class_Argument_Value_Input" field on "Deploy_Model_Table" on "Deploy_Model_Popup" wizard
      Then click on "Add_New_Row_Button" element in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard
      Then verify values in "Key_Value_Table" table in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard
        | name         | value         |
        | edited_name2 | edited_value2 |
        | name4        | value4        |
      Then click on "Cancel_Button" element on "Deploy_Model_Popup" wizard
      Then verify if "Common_Popup" popup dialog appears
      Then click on "Cancel_Button" element on "Common_Popup" wizard
      Then verify if "Deploy_Model_Popup" popup dialog appears
      Then verify values in "Key_Value_Table" table in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard
        | name         | value         |
        | edited_name2 | edited_value2 |
        | name4        | value4        |

  @passive
  Scenario: Verify behaviour of Real-Time Pipelines table
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
    Then check "expand_btn" visibility in "Real_Time_Pipelines_Table" on "Real_Time_Pipelines" wizard
    Then save to context "name" column and "href" attribute on 1 row from "Real_Time_Pipelines_Table" table on "Real_Time_Pipelines" wizard
    When click on cell with row index 1 in "name" column in "Real_Time_Pipelines_Table" table on "Real_Time_Pipelines" wizard
    And wait load page
    Then compare current browser URL with test "href" context value
    Then verify "Real_Time_Pipelines_Graph" element visibility on "Real_Time_Pipelines" wizard
    Then verify arrow lines position on "Real_Time_Pipelines_Graph" on "Real_Time_Pipelines" wizard
    When click on node with index 2 in "Real_Time_Pipelines_Graph" graph on "Real_Time_Pipelines" wizard
    Then verify "Header" element visibility on "Real_Time_Pipline_Pane" wizard
    Then verify "Cross_Close_Button" element visibility on "Real_Time_Pipline_Pane" wizard
    Then verify "Overview_Headers" on "Real_Time_Pipline_Pane" wizard should contains "Real_Time_Pipline_Pane"."Overview_Headers"
    Then click on "Arrow_Back" element on "Real_Time_Pipline_Pane" wizard
    And wait load page
    Then save to context "function" column and "href" attribute on 1 row from "Real_Time_Pipelines_Table" table on "Real_Time_Pipelines" wizard
    Then click on cell with row index 1 in "function" column in "Real_Time_Pipelines_Table" table on "Real_Time_Pipelines" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "ML functions" value
    Then compare current browser URL with test "href" context value
    Then compare "Header" element value on "ML_Function_Info_Pane" wizard with test "function" context value