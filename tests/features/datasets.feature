Feature: Datasets Page

    Testcases that verifies functionality on Datasets Page

  @passive
  Scenario: Check all mandatory components on Datasets tab
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
    Then verify "Feature_Store_Tab_Selector" on "Feature_Store_Datasets_Tab" wizard should contains "Feature_Store"."Tab_List"
    Then verify "Register_Dataset_Button" element visibility on "Feature_Store_Datasets_Tab" wizard
    Then "Register_Dataset_Button" element on "Feature_Store_Datasets_Tab" should contains "Register Dataset" value
    Then verify "Table_Name_Filter_Input" element visibility on "Feature_Store_Datasets_Tab" wizard
    Then verify "Table_Label_Filter_Input" element visibility on "Feature_Store_Datasets_Tab" wizard
    Then verify "Table_Tree_Filter_Dropdown" element visibility on "Feature_Store_Datasets_Tab" wizard
    Then verify "Table_Tree_Filter_Dropdown" dropdown element on "Feature_Store_Datasets_Tab" wizard should contains "Dropdown_Options"."Tag_Filer_Options"
    Then verify "Table_Refresh_Button" element visibility on "Feature_Store_Datasets_Tab" wizard
    Then verify "Feature_Datasets_Table" element visibility on "Feature_Store_Datasets_Tab" wizard

  @passive
  @inProgress
  Scenario: Check all mandatory components in Item infopane on Overview tab table on Datasets tab
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Datasets" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And wait load page
    When click on cell with row index 1 in "name" column in "Feature_Vectors_Table" table on "Feature_Store_Features_Vectors_Tab" wizard
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
  Scenario: Check all mandatory components on Register Dataset form
    Given open url
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And select "tab" with "Datasets" value in breadcrumbs menu
    And wait load page
    Then "Register_Dataset_Button" element on "Feature_Store_Datasets_Tab" should contains "Register Dataset" value
    Then click on "Register_Dataset_Button" element on "Feature_Store_Datasets_Tab" wizard
    Then verify if "Register_Dataset" popup dialog appears
    Then verify "Name_Input" element visibility on "Register_Dataset" wizard
    Then verify "Name_Input" on "Register_Dataset" wizard should display "Input_Hint"."Artifact_Names_Unique"
    Then type value "   " to "Name_Input" field on "Register_Dataset" wizard
    Then verify "Name_Input" on "Register_Dataset" wizard should display options "Input_Hint"."Artifact_Name_Hint"
    Then verify "Name_Input" options rules on "Register_Dataset" wizard
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

  @passive
  Scenario: Check filtering by Name on Feature Store Datasets Tab
    Given open url
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And select "tab" with "Datasets" value in breadcrumbs menu
    And wait load page
    Then type value "ea" to "Table_Name_Filter_Input" field on "Feature_Store_Datasets_Tab" wizard
    Then click on "Table_Refresh_Button" element on "Feature_Store_Datasets_Tab" wizard
    And wait load page
    Then value in "name" column with "text" in "Feature_Datasets_Table" on "Feature_Store_Datasets_Tab" wizard should contains "ea"

  @passive
  Scenario: Verify View YAML action on Datasets tab
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And select "tab" with "Datasets" value in breadcrumbs menu
    And wait load page
    Then select "View YAML" option in action menu on "Feature_Store_Datasets_Tab" wizard in "Feature_Datasets_Table" table at row with "data_clean_cleaned-data" value in "name" column
    Then verify if "View_YAML" popup dialog appears
    Then verify "Cross_Cancel_Button" element visibility on "View_YAML" wizard
    Then verify "YAML_Modal_Container" element visibility on "View_YAML" wizard

  @passive
  Scenario: Check all mandatory components on Artifact Preview on Datasets tab
    Given open url
    And wait load page
    And click on row root with value "churn-project-admin" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    And select "tab" with "Datasets" value in breadcrumbs menu
    And wait load page
    When click on cell with row index 1 in "artifact_preview_btn" column in "Feature_Datasets_Table" table on "Feature_Store_Datasets_Tab" wizard
    Then verify "Preview_Header" element visibility on "Artifact_Preview_Popup" wizard
    Then verify "Cross_Cancel_Button" element visibility on "Artifact_Preview_Popup" wizard