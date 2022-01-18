Feature: Models Page

  Testcases that verifies functionality on Models Page

  @passive
  Scenario: Check all mandatory components on Models tab
    Given open url
    And wait load page
    And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "project" label should be equal "default" value
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Models" value
    Then verify "Table_Name_Filter_Input" element visibility on "Models" wizard
    Then verify "Table_Labels_Filter_Input" element visibility on "Models" wizard
    Then verify "Table_Tree_Filter_Dropdown" element visibility on "Models" wizard
    Then verify "Show_Iterations_Checkbox" element visibility on "Models" wizard
    Then verify "Table_Refresh_Button" element visibility on "Models" wizard
    Then verify "Models_Table" element visibility on "Models" wizard
    Then verify "Register_Model_Button" element visibility on "Models" wizard
    Then "Register_Model_Button" element on "Models" should contains "Register Model" value

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
    Then verify "Deploy_Model_Table" element visibility on "Deploy_Model_Popup" wizard
    Then verify "Cancel_Button" element visibility on "Deploy_Model_Popup" wizard
    Then "Cancel_Button" element on "Deploy_Model_Popup" should contains "Cancel" value
    Then verify "Deploy_Button" element visibility on "Deploy_Model_Popup" wizard
    Then "Deploy_Button" element on "Deploy_Model_Popup" should contains "Deploy" value
