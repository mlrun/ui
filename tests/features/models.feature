Feature: Models Page

  Testcases that verifies functionality on Models Page

  @passive
  @failed
  Scenario: Check all mandatory components on Models tab
    Given open url
    And wait load page
    And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "project" label should be equal "default" value
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
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
  Scenario: Check all mandatory components on Real-Time Pipelines tab
    Given open url
    And wait load page
    And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "project" label should be equal "default" value
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
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
    And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
    And wait load page
    Then verify "Table_Name_Filter_Input" element visibility on "Models" wizard
    Then type value "survival" to "Table_Name_Filter_Input" field on "Models" wizard
    Then click on "Table_Refresh_Button" element on "Models" wizard
    And wait load page
    Then value in "name" column with "text" in "Models_Table" on "Models" wizard should contains "survival"

  @passive
  Scenario: Verify filtering by name on Real-Time Pipelines tab
    Given open url
    And wait load page
    And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "project" label should be equal "churn-project-admin" value
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
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
    And click on cell with value "getting-started-tutorial-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
    And wait load page
    Then type value "class" to "Table_Labels_Filter_Input" field on "Models" wizard
    Then click on "Table_Refresh_Button" element on "Jobs_Monitor_Tab" wizard
    And wait load page
    Then value in "labels" column with "dropdowns" in "Models_Table" on "Models" wizard should contains "class"
    Then type value "class=sklearn.linear_model.LogisticRegression" to "Table_Labels_Filter_Input" field on "Models" wizard
    Then click on "Table_Refresh_Button" element on "Models" wizard
    Then value in "labels" column with "dropdowns" in "Models_Table" on "Models" wizard should contains "class=sklearn.linear_model.LogisticRegression"

  @passive
  Scenario: Check all mandatory components on Register Model Popup
    Given open url
    And wait load page
    And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
    And wait load page
    Then click on "Register_Model_Button" element on "Models" wizard
    Then verify if "Register_Model_Popup" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "Register_Model_Popup" wizard
    Then verify "New_File_Name_Input" element visibility on "Register_Model_Popup" wizard
    Then verify "New_File_Name_Input" on "Register_Model_Popup" wizard should display "Input_Hint"."Artifact_Names_Unique"
    Then type value "   " to "New_File_Name_Input" field on "Register_Model_Popup" wizard
    Then verify "New_File_Name_Input" on "Register_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
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

  @passive
  Scenario: Check MLRun logo redirection
    Given open url
    And wait load page
    And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
    And wait load page
    And click on "MLRun_Logo" element on "commonPagesHeader" wizard
    And wait load page
    Then verify "Projects_Table" element visibility on "Projects" wizard

  @passive
  Scenario: Verify View YAML action
    Given open url
    And wait load page
    And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
    And wait load page
    Then select "View YAML" option in action menu on "Models" wizard in "Models_Table" table at row with "data_clean_model" value in "name" column
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

  @passive
  Scenario: Verify View YAML action in Item infopane
    Given open url
    And wait load page
    And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
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
    And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
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
  Scenario: Check expand sources Item infopane on Overview tab table
    Given open url
    And wait load page
    And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Models_Table" table on "Models" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "Models_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard should contains "Models_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Models_Info_Pane" wizard
    When click on "Expand_Sources" element on "Models_Info_Pane" wizard
    Then verify "Info_Sources_Table" element visibility on "Models_Info_Pane" wizard

  @passive
  Scenario: Check all mandatory components on Deploy Model Popup
    Given open url
    And wait load page
    And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
    And wait load page
    Then select "Deploy" option in action menu on "Models" wizard in "Models_Table" table at row with "data_clean_model" value in "name" column
    Then verify if "Deploy_Model_Popup" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "Deploy_Model_Popup" wizard
    Then verify "Serving_Function_Dropdown" element visibility on "Deploy_Model_Popup" wizard
    Then verify "Tag_Dropdown" element visibility on "Deploy_Model_Popup" wizard
    Then verify "Model_Name_Input" element visibility on "Deploy_Model_Popup" wizard
    Then verify "Model_Name_Input" on "Deploy_Model_Popup" wizard should display "Input_Hint"."Deploy_Model_Name_Hint"
    Then verify "Class_Name_Input" element visibility on "Deploy_Model_Popup" wizard
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
      | name1 |
      | name6 |
    Then verify values in "Key_Value_Table" table in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard
      | name  | value  |
      | name2 | value2 |
      | name4 | value4 |
    When add new volume rows to "Key_Value_Table" table in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard using nontable inputs
      | Class_Argument_Name_Input | Class_Argument_Value_Input | Add_New_Row_Button | Delete_New_Row_Button |
      |           name2           |            value2          | yes                |                       |
    Then verify "Class_Argument_Name_Input" element in "Deploy_Model_Table" on "Deploy_Model_Popup" wizard should display warning "Input_Hint"."Name_Already_Exists"
    Then verify "Cancel_Button" element visibility on "Deploy_Model_Popup" wizard
    Then "Cancel_Button" element on "Deploy_Model_Popup" should contains "Cancel" value
    Then verify "Deploy_Button" element visibility on "Deploy_Model_Popup" wizard
    Then "Deploy_Button" element on "Deploy_Model_Popup" should contains "Deploy" value


  @passive
  Scenario: Check all mandatory components on Real-Time Pipelines graf
    Given open url
    And wait load page
    And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "project" label should be equal "churn-project-admin" value
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Models" value
    And select "Real-Time Pipelines" tab in "Models_Tab_Selector" on "Models" wizard
    And wait load page
    Then verify "Real-Time Pipelines" tab is active in "Models_Tab_Selector" on "Models" wizard
    When click on cell with row index 1 in "name" column in "Real_Time_Pipelines_Table" table on "Real_Time_Pipelines" wizard
    And wait load page
    Then verify "Real_Time_Pipelines_Graph" element visibility on "Real_Time_Pipelines" wizard
    Then verify arrow lines position on "Real_Time_Pipelines_Graph" on "Real_Time_Pipelines" wizard
    When click on node with index 2 in "Real_Time_Pipelines_Graph" graf on "Real_Time_Pipelines" wizard
    Then verify "Header" element visibility on "Real_Time_Pipline_Pane" wizard
    Then verify "Cross_Close_Button" element visibility on "Real_Time_Pipline_Pane" wizard
    Then verify "Overview_Headers" on "Real_Time_Pipline_Pane" wizard should contains "Real_Time_Pipline_Pane"."Overview_Headers"
