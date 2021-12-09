Feature: Files Page

  Testcases that verifies functionality on Files Page

  @passive
  Scenario: Check all mandatory components on Files tab
    Given open url
    And wait load page
    And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And click on cell with value "Files" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
    And wait load page
    Then verify "Table_Name_Filter_Input" element visibility on "Files" wizard
    Then verify "Table_Label_Filter_Input" element visibility on "Files" wizard
    Then verify "Table_Tree_Filter_Dropdown" element visibility on "Files" wizard
    Then verify "Show_Iterations_Checkbox" element visibility on "Files" wizard
    Then verify "Table_Refresh_Button" element visibility on "Files" wizard
    Then verify "Files_Table" element visibility on "Files" wizard

  @passive
  Scenario: verify filtering by file name on Files page
    Given open url
    And wait load page
    And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And click on cell with value "Files" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
    And wait load page
    Then verify "Table_Name_Filter_Input" element visibility on "Files" wizard
    Then type value "test" to "Table_Name_Filter_Input" field on "Files" wizard
    Then click on "Table_Refresh_Button" element on "Files" wizard
    And wait load page
    Then value in "name" column with "text" in "Files_Table" on "Files" wizard should contains "test"

  @passive
  @inProgress
  Scenario: Check all mandatory components on Register File Popup
    Given open url
    And wait load page
    And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And click on cell with value "Files" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
    And wait load page
    Then click on "Register_File_Button" element on "Files" wizard
    Then verify if "Register_File_Popup" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "Register_File_Popup" wizard
    Then verify "New_File_Name_Input" element visibility on "Register_File_Popup" wizard
    Then verify "New_File_Name_Input" on "Register_File_Popup" wizard should display "Input_Hint"."Artifact_Names_Unique"
    Then type value "   " to "New_File_Name_Input" field on "Register_File_Popup" wizard
    Then verify "New_File_Name_Input" on "Register_File_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
    Then verify "New_File_Target_Path_Input" element visibility on "Register_File_Popup" wizard
    Then type value "   " to "New_File_Target_Path_Input" field on "Register_File_Popup" wizard
    Then verify "New_File_Target_Path_Input" on "Register_File_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
    Then verify "New_File_Description_Input" element visibility on "Register_File_Popup" wizard
    Then type value "   " to "New_File_Description_Input" field on "Register_File_Popup" wizard
    Then verify "New_File_Description_Input" on "Register_File_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
    Then verify "New_File_Type_Dropdown" element visibility on "Register_File_Popup" wizard
    Then verify "Cancel_Button" element visibility on "Register_File_Popup" wizard
    Then verify "Register_Button" element visibility on "Register_File_Popup" wizard
#        TO DO: should refactor checking for input warnings

  @passive
  @inProgress
  Scenario: Check all mandatory components in Item infopane on Overview tab table
    Given open url
    And wait load page
    And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And click on cell with value "Files" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    Then verify "Info_Pane_Tab_Selector" element visibility on "Files_Info_Pane" wizard
    Then verify "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Tab_List"
    Then verify "Overview" tab is active in "Info_Pane_Tab_Selector" on "Files_Info_Pane" wizard
    Then verify "Header" element visibility on "Files_Info_Pane" wizard
    Then verify "Updated" element visibility on "Files_Info_Pane" wizard
    Then verify "Download_Button" element visibility on "Files_Info_Pane" wizard
    Then verify "Cross_Close_Button" element visibility on "Files_Info_Pane" wizard
    Then verify "Overview_General_Headers" on "Files_Info_Pane" wizard should contains "Files_Info_Pane"."Overview_General_Headers"
    Then verify "Overview_Hash_Header" on "Files_Info_Pane" wizard should display "Label_Hint"."Files_Hash"
    Then verify "Overview_UID_Header" on "Files_Info_Pane" wizard should display "Label_Hint"."Files_UID"

  @passive
  @inProgress
  Scenario: Check all mandatory components in Item infopane on Preview tab table
    Given open url
    And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And click on cell with value "Files" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    Then select "Preview" tab in "Info_Pane_Tab_Selector" on "Feature_Sets_Info_Pane" wizard
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
    And click on cell with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And click on cell with value "Files" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
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
    And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And click on cell with value "Files" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
    And wait load page
    And click on "MLRun_Logo" element on "commonPagesHeader" wizard
    And wait load page
    Then verify "Projects_Table" element visibility on "Projects" wizard

  @passive
  Scenario: Verify View YAML action
    Given open url
    And wait load page
    And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And click on cell with value "Files" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
    And wait load page
    Then select "View YAML" option in action menu on "Files" wizard in "Files_Table" table at row with "test-i" value in "name" column
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

  @passive
  Scenario: Verify View YAML action in Item infopane
    Given open url
    And wait load page
    And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And click on cell with value "Files" in "link" column in "General_Info_Quick_Links" table on "Project" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Files_Table" table on "Files" wizard
    Then verify "Action_Menu" element visibility on "Files_Info_Pane" wizard
    Then select "View YAML" option in action menu on "Files_Info_Pane" wizard
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard



