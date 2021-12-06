Feature: Models Page

  Testcases that verifies functionality on Models Page

  @passive
  Scenario: Check all mandatory components on Models tab
    Given open url
    And wait load page
    And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And click on cell with value "Models" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
    And wait load page
    Then verify "Table_Name_Filter_Input" element visibility on "Models" wizard
    Then verify "Table_Label_Filter_Input" element visibility on "Models" wizard
    Then verify "Table_Tree_Filter_Dropdown" element visibility on "Models" wizard
    Then verify "Show_Iterations_Checkbox" element visibility on "Models" wizard
    Then verify "Table_Refresh_Button" element visibility on "Models" wizard
    Then verify "Models_Table" element visibility on "Models" wizard

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
#  TO DO: should be implemented mock requests for filters

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
    Then verify "Register_Button" element visibility on "Register_Model_Popup" wizard

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

