Feature: MLRun Project Home Page

    Testcases that verifies functionality on MLRun Project Home Page

    @MLPH
    Scenario: MLPH001 - Check all mandatory components on Project Home
        * set tear-down property "project" created with "automation-test-1002" value
        * create "automation-test-1002" MLRun Project with code 201
        Given open url
        And click on row root with value "automation-test-1002" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify breadcrumbs "project" label should be equal "automation-test-1002" value
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Quick actions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Quick actions" value
        Then click on breadcrumbs "project" label on "commonPagesHeader" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Quick actions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "tab" with "Project monitoring" value in breadcrumbs menu
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Quick actions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        Then verify "Header_Name_Label" element visibility on "Demo_Project" wizard
        Then verify "Header_Created_Time" element visibility on "Demo_Project" wizard
        Then verify "Header_Project_Description" element visibility on "Demo_Project" wizard
        Then verify value should equal "automation-test-1002" in "Header_Name_Label" on "Demo_Project" wizard
        Then verify value should equal "automation test description" in "Header_Project_Description" on "Demo_Project" wizard
        Then verify value should equal "Ingest and process data" in "Data_Collection_Header" on "Demo_Project" wizard
        Then verify value should equal "Project"."Data_Collection_Description" in "Data_Collection_Description" on "Demo_Project" wizard
        Then verify "Data_Collection_Additional_Actions_Button" element visibility on "Demo_Project" wizard
        Then verify "Data_Collection_Actions_Table" element visibility on "Demo_Project" wizard
        Then verify "Data_Collection_Links_Table" element visibility on "Demo_Project" wizard
        Then verify value should equal "Develop and train model" in "Development_Header" on "Demo_Project" wizard
        Then verify value should equal "Project"."Development_Description" in "Development_Description" on "Demo_Project" wizard
        Then verify "Development_Actions_Table" element visibility on "Demo_Project" wizard
        Then verify "Development_Links_Table" element visibility on "Demo_Project" wizard
        Then verify value should equal "Deploy and monitor" in "Deployment_Header" on "Demo_Project" wizard
        Then verify value should equal "Project"."Deployment_Description" in "Deployment_Description" on "Demo_Project" wizard
        Then verify "Deployment_Actions_Table" element visibility on "Demo_Project" wizard
        Then verify "Deployment_Links_Table" element visibility on "Demo_Project" wizard
        Then click on "Data_Collection_Additional_Actions_Button" element on "Demo_Project" wizard
        Then verify values in "Data_Collection_Actions_Table" table on "Demo_Project" wizard
            |          name           |
            |    Create feature set   |
            |     Register dataset    |
            |     Register artifact   |
            |  Create feature vector  |
        Then verify values in "Development_Actions_Table" table on "Demo_Project" wizard
            |     name    |
            |  Batch run  |
            | Train model |
        Then verify values in "Deployment_Actions_Table" table on "Demo_Project" wizard
            |           name            |
            | Create real-time function |
            |      Batch inference      |
        Then verify values in "Data_Collection_Links_Table" table on "Demo_Project" wizard
            |      name       |
            |   Feature Sets  |
            |    Artifacts    |
            |    Datasets     |
            | Feature Vectors |
        Then verify values in "Development_Links_Table" table on "Demo_Project" wizard
            |     name     |
            | ML Functions |
            |     Jobs     |
            |    Models    |
            |   Workflows  |
        Then verify values in "Deployment_Links_Table" table on "Demo_Project" wizard
            |        name         |
            |   Model Endpoints   |
            |     RT Pipelines    |
            |  Nuclio Functions   |
            |     Monitoring      |
    
    @MLPH
    @FAILED_TODO
    #TODO: Register_Model_Button hidden from 1.4.0, running on demo mode
    Scenario: MLPH002 - Verify behaviour on Register Model Popup on Project Home Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Quick actions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page
        And select "tab" with "Project monitoring" value in breadcrumbs menu
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        And click on cell with value "Quick actions" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
        And hover "MLRun_Logo" component on "commonPagesHeader" wizard
        And wait load page

        When click on "name" in "Development_Actions_Table" table on "Demo_Project" wizard with offset "false"
            |          name           |
            |      Register model     |
        And wait load page
        Then "Title" element on "Register_Model_Popup" should contains "Register Model" value
        Then verify "Cross_Cancel_Button" element visibility on "Register_Model_Popup" wizard
        Then verify "New_File_Name_Input" element visibility on "Register_Model_Popup" wizard
        Then verify "New_File_Name_Input" on "Register_Model_Popup" wizard should display "Input_Hint"."Artifacts_Names_Unique"
        Then verify options in "Path_Scheme_Combobox" combobox in "Target_Path" on "Register_Model_Popup" wizard should contains "Models"."Combobox_Options"
        Then verify "New_File_Description_Input" element visibility on "Register_Model_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Register_Model_Popup" wizard
        Then verify "Register_Button" element visibility on "Register_Model_Popup" wizard
        Then click on "Register_Button" element on "Register_Model_Popup" wizard
        Then verify "Path_Scheme_Combobox" element in "Target_Path" on "Register_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Require"
        Then type value "   " to "New_File_Name_Input" field on "Register_Model_Popup" wizard
        Then verify "New_File_Name_Input" on "Register_Model_Popup" wizard should display options "Input_Hint"."Artifact_Name_Hint"
        When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_Model_Popup" wizard
        When type value "  " to "Path_Scheme_Combobox" field on "Target_Path" on "Register_Model_Popup" wizard
        Then verify "Path_Scheme_Combobox" element in "Target_Path" on "Register_Model_Popup" wizard should display warning "Input_Hint"."V3IO_Path_Hint"
        Then type value "   " to "New_File_Description_Input" field on "Register_Model_Popup" wizard
        Then verify "New_File_Description_Input" on "Register_Model_Popup" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then type value "new-model" to "New_File_Name_Input" field on "Register_Model_Popup" wizard
        When select "V3IO" option in "Path_Scheme_Combobox" combobox on "Target_Path" accordion on "Register_Model_Popup" wizard
        When type value "target/path" to "Path_Scheme_Combobox" field on "Target_Path" on "Register_Model_Popup" wizard
        Then type value "test-description" to "New_File_Description_Input" field on "Register_Model_Popup" wizard
        Then click on "Register_Button" element on "Register_Model_Popup" wizard
        And wait load page
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Models" value
        Then click on cell with value "new-model" in "name" column in "Models_Table" table on "Models" wizard
        Then "Header" element on "Models_Info_Pane" should contains "new-model" value
        Then check "new-model" value in "key" column in "Overview_Table" table on "Models_Info_Pane" wizard
        Then check "latest" value in "tag" column in "Overview_Table" table on "Models_Info_Pane" wizard
        Then check "v3io:///target/" value in "path" column in "Overview_Table" table on "Models_Info_Pane" wizard
    
    @FAILED_TODO
    #TODO: click on "name" in "Data_Collection_Actions_Table" table on "Demo_Project" - component was changed on project home
    @passive
    @demo
    Scenario: MLPH003 - Check all mandatory components on Create New Feature Set on Project Home Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Data_Collection_Actions_Table" table on "Demo_Project" wizard with offset "false"
            |          name           |
            |   Create Features Set   |
        And wait load page
        Then verify "Cross_Close_Button" element visibility on "New_Feature_Set" wizard
        Then verify "Feature_Set_Name_Input" element visibility on "New_Feature_Set" wizard
        Then verify "Version_Input" element visibility on "New_Feature_Set" wizard
        Then verify "Description_Input" element visibility on "New_Feature_Set" wizard
        Then verify "Labels_Table" element visibility on "New_Feature_Set" wizard
        Then verify "Accordion_Header" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Collapse_Button" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "URL_Combobox" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Attributes_Input" element visibility in "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then type value "   " to "Attributes_Input" field on "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Attributes_Input" element in "Data_Source_Accordion" on "New_Feature_Set" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        When collapse "Data_Source_Accordion" on "New_Feature_Set" wizard
        Then verify "Data_Source_Accordion" is collapsed on "New_Feature_Set" wizard
        Then verify "Accordion_Header" element visibility in "Schema_Accordion" on "New_Feature_Set" wizard
        Then verify "Collapse_Button" element visibility in "Schema_Accordion" on "New_Feature_Set" wizard
        Then verify "Entities_Input" element visibility in "Schema_Accordion" on "New_Feature_Set" wizard
        Then verify "Timestamp_Input" element visibility in "Schema_Accordion" on "New_Feature_Set" wizard
        When collapse "Schema_Accordion" on "New_Feature_Set" wizard
        Then verify "Schema_Accordion" is collapsed on "New_Feature_Set" wizard
        Then verify "Accordion_Header" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Collapse_Button" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Online_Checkbox" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Offline_Checkbox" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "External_Offline_Checkbox" element visibility in "Target_Store_Accordion" on "New_Feature_Set" wizard
        When collapse "Target_Store_Accordion" on "New_Feature_Set" wizard
        Then verify "Target_Store_Accordion" is collapsed on "New_Feature_Set" wizard
        Then verify "Access_Key_Checkbox" element visibility on "New_Feature_Set" wizard
        Then verify "Cancel_Button" element visibility on "New_Feature_Set" wizard
        Then verify "Save_Button" element visibility on "New_Feature_Set" wizard
        Then verify "Save_And_Ingest_Button" element visibility on "New_Feature_Set" wizard
    
    @FAILED_TODO
    #TODO: "New_File_Target_Path_Input" - component was changed
    @passive
    @demo
    Scenario: MLPH004 - Check all mandatory components on Register Dataset Popup on Project Home Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Data_Collection_Actions_Table" table on "Demo_Project" wizard with offset "false"
            |          name           |
            |     Register dataset    |
        And wait load page
        Then "Title" element on "Register_Dataset" should contains "Register Dataset" value
        Then "Form_Text" component on "Register_Dataset" should be equal "Register_Artifact"."Form_Text"
        Then "Form_Subtext" component on "Register_Dataset" should contains "Register_Dataset"."Form_Subtext"
        Then verify "Name_Input" element visibility on "Register_Dataset" wizard
        Then verify "Name_Input" on "Register_Dataset" wizard should display "Input_Hint"."Dataset_Names_Unique"
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
        Then verify "Register_Button" element on "Register_Dataset" wizard is enabled
        Then click on "Cancel_Button" element on "Register_Dataset" wizard
        Then verify if "Common_Popup" popup dialog appears
        Then click on "Cancel_Button" element on "Common_Popup" wizard
        Then verify if "Register_Dataset" popup dialog appears
        Then verify "Name_Input" input should contains "dataset" value on "Register_Dataset" wizard
        Then verify "Target_Path_Input" input should contains "target/path" value on "Register_Dataset" wizard
        Then verify "Description_Input" input should contains "new dataset description" value on "Register_Dataset" wizard
        Then click on "Register_Button" element on "Register_Dataset" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Datasets" value
        Then click on cell with value "dataset" in "name" column in "Datasets_Table" table on "Datasets" wizard
        Then "Header" element on "Datasets_Info_Pane" should contains "dataset" value
        Then check "dataset" value in "key" column in "Overview_Table" table on "Datasets_Info_Pane" wizard
        Then check "latest" value in "tag" column in "Overview_Table" table on "Datasets_Info_Pane" wizard
        Then check "target/path" value in "path" column in "Overview_Table" table on "Datasets_Info_Pane" wizard
    
    @FAILED_TODO
    #TODO: click on "name" in "Development_Actions_Table" table on "Demo_Project" - component was changed on project home 
    @passive
    @demo
    Scenario: MLPH005 - Check all mandatory components on Create ML Function on Project Home Page
        * set tear-down property "project" created with "automation-test-1003" value
        * create "automation-test-1003" MLRun Project with code 201
        Given open url
        * turn on demo mode
        And click on row root with value "automation-test-1003" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Development_Actions_Table" table on "Demo_Project" wizard with offset "false"
            |          name           |
            |   Create New Function   |
        And wait load page
        Then verify "Cross_Cancel_Button" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Name_Input" element visibility on "Create_ML_Function_Popup" wizard
        Then type value "   " to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Name_Input" on "Create_ML_Function_Popup" wizard should display options "Input_Hint"."Function_Name_Hint"
        Then verify "New_Function_Name_Input" options rules on "Create_ML_Function_Popup" wizard
        Then type value "   " to "New_Function_Tag_Input" field on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Tag_Input" on "Create_ML_Function_Popup" wizard should display options "Input_Hint"."Function_Tag_Hint"
        Then verify "New_Function_Tag_Input" options rules on "Create_ML_Function_Popup" wizard
        Then verify "New_Function_Runtime_Dropdown" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "Cancel_Button" element visibility on "Create_ML_Function_Popup" wizard
        Then verify "Continue_Button" element visibility on "Create_ML_Function_Popup" wizard
        And type value "demo-function-02" to "New_Function_Name_Input" field on "Create_ML_Function_Popup" wizard

    @FAILED_TODO
    #TODO: click on "name" in "Development_Actions_Table" table on "Demo_Project" - component was changed on project home
    @passive
    @demo
    Scenario: MLPH006 - Check all mandatory components on Create New Job on Project Home Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Development_Actions_Table" table on "Demo_Project" wizard with offset "false"
            |          name           |
            |      Create New Job     |
        And wait load page
        Then verify "Back_Arrow_Button" element visibility on "Create_Job" wizard
        Then verify "Create_Job_Header" element visibility on "Create_Job" wizard
        Then verify "Search_Input" element visibility on "Create_Job" wizard

    @FAILED_TODO
    #TODO: "New_File_Target_Path_Input" - component was changed
    @passive
    @demo
    Scenario: MLPH007 - Check all mandatory components on Register File Popup on Project Home Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Data_Collection_Actions_Table" table on "Demo_Project" wizard with offset "false"
            |          name           |
            |    Register artifact    |
        And wait load page
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
        Then verify if "Register_Dataset" popup dialog appears
        Then verify "New_File_Name_Input" input should contains "artifact" value on "Register_File_Popup" wizard
        Then verify "New_File_Target_Path_Input" input should contains "target/path" value on "Register_File_Popup" wizard
        Then verify "New_File_Description_Input" input should contains "new artifact description" value on "Register_File_Popup" wizard
        Then verify "New_File_Type_Dropdown" dropdown on "Register_File_Popup" wizard selected option value "Table"
        Then click on "Register_Button" element on "Register_File_Popup" wizard
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Artifacts" value
        Then click on cell with value "artifact" in "name" column in "Files_Table" table on "Files" wizard
        Then "Header" element on "Files_Info_Pane" should contains "artifact" value
        Then check "artifact" value in "key" column in "Overview_Table" table on "Files_Info_Pane" wizard
        Then check "latest" value in "tag" column in "Overview_Table" table on "Files_Info_Pane" wizard
        Then check "target/path" value in "path" column in "Overview_Table" table on "Files_Info_Pane" wizard
    
    
    @FAILED_TODO
    #TODO: click on "name" in "Data_Collection_Additional_Actions_Table" table on "Demo_Project" - component was changed on project home
    @passive
    @demo
    Scenario: MLPH008 - Check all mandatory components on Create a Feature Vector Popup on Project Home Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then click on "Data_Collection_Additional_Actions_Button" element on "Demo_Project" wizard
        And wait load page
        When click on "name" in "Data_Collection_Additional_Actions_Table" table on "Demo_Project" wizard with offset "false"
            |          name           |
            | Create a Feature Vector |
        And wait load page
        Then "Title" element on "Create_Feature_Vector_Popup" should contains "Create feature vector" value
        Then verify "Cross_Cancel_Button" element visibility on "Create_Feature_Vector_Popup" wizard
        Then verify "Name_Input" element visibility on "Create_Feature_Vector_Popup" wizard
        Then type value "   " to "Name_Input" field on "Create_Feature_Vector_Popup" wizard
        Then verify "Name_Input" options rules on "Create_Feature_Vector_Popup" wizard
        Then verify "Tag_Input" element visibility on "Create_Feature_Vector_Popup" wizard
        Then verify "Description_Input" element visibility on "Create_Feature_Vector_Popup" wizard
        Then verify "Labels_Table" element visibility on "Create_Feature_Vector_Popup" wizard

    @passive
    @demo
    Scenario: MLPH009 - Check all mandatory components on Feature Set tab on Project Home Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Data_Collection_Links_Table" table on "Demo_Project" wizard with offset "false"
            |     name     |
            | Feature Sets |
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Feature Store" value
        Then verify "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard should contains "Feature_Store"."Tab_List"
        Then verify "Feature Sets" tab is active in "Feature_Store_Tab_Selector" on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Tag_Filter_Dropdown" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Tag_Filter_Dropdown" dropdown element on "Feature_Store_Feature_Sets_Tab" wizard should contains "Dropdown_Options"."Tag_Filer_Options"
        Then type value "   " to "Table_Name_Filter_Input" field on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Name_Filter_Input" on "Feature_Store_Feature_Sets_Tab" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "Table_Label_Filter_Input" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then type value "   " to "Table_Label_Filter_Input" field on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Table_Label_Filter_Input" on "Feature_Store_Feature_Sets_Tab" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then verify "Feature_Sets_Table" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Feature_Store_Tab_Selector" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then verify "Create_Set_Button" element visibility on "Feature_Store_Feature_Sets_Tab" wizard
        Then "Create_Set_Button" element on "Feature_Store_Feature_Sets_Tab" should contains "Create Set" value

    @passive
    Scenario: MLPH010 - Check all mandatory components on Files tab on Project Home Page
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Data_Collection_Links_Table" table on "Demo_Project" wizard with offset "false"
            |   name    |
            | Artifacts |
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

    @passive
    Scenario: MLPH011 - Check all mandatory components on Datasets tab on Project Home Page
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Data_Collection_Links_Table" table on "Demo_Project" wizard with offset "false"
            |   name   |
            | Datasets |
        And wait load page
        Then verify breadcrumbs "tab" label should be equal "Datasets" value
        Then verify "Register_Dataset_Button" element visibility on "Datasets" wizard
        Then "Register_Dataset_Button" element on "Datasets" should contains "Register Dataset" value
        Then verify "Table_Name_Filter_Input" element visibility on "Datasets" wizard
        Then click on "Table_FilterBy_Button" element on "Datasets" wizard
        Then verify "Table_Label_Filter_Input" element visibility on "Artifacts_FilterBy_Popup" wizard
        Then verify "Table_Tree_Filter_Dropdown" element visibility on "Artifacts_FilterBy_Popup" wizard
        Then verify "Table_Tree_Filter_Dropdown" dropdown element on "Artifacts_FilterBy_Popup" wizard should contains "Dropdown_Options"."Tag_Filer_Options"
        Then verify "Table_Refresh_Button" element visibility on "Datasets" wizard

    @passive
    Scenario: MLPH012 - Check all mandatory components on Feature Vectors tab on Project Home Page
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Data_Collection_Links_Table" table on "Demo_Project" wizard with offset "false"
            |       name      |
            | Feature Vectors |
        And wait load page
        Then verify "Table_Name_Filter_Input" element visibility on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify "Table_Label_Filter_Input" element visibility on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify "Table_Tag_Filter_Dropdown" element visibility on "Feature_Store_Features_Vectors_Tab" wizard
        Then verify "Table_Tag_Filter_Dropdown" dropdown element on "Feature_Store_Features_Vectors_Tab" wizard should contains "Dropdown_Options"."Tag_Filer_Options"
        Then verify "Table_Refresh_Button" element visibility on "Feature_Store_Features_Vectors_Tab" wizard

    @passive
    Scenario: MLPH013 - Check all mandatory components on ML Functions tab on Project Home Page
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Development_Links_Table" table on "Demo_Project" wizard with offset "false"
            |     name     |
            | ML Functions |
        And wait load page
        Then verify "Table_Name_Filter_Input" element visibility on "ML_Functions" wizard
        Then verify "Show_Untagged_Functions_Checkbox" element visibility on "ML_Functions" wizard
        Then verify "New_Function_Button" element visibility on "ML_Functions" wizard
        Then "New_Function_Button" element on "ML_Functions" should contains "New" value
        Then verify "Table_Refresh_Button" element visibility on "ML_Functions" wizard
        Then verify "Table_Expand_Rows_Button" element visibility on "ML_Functions" wizard

    @passive
    @demo
    Scenario: MLPH014 - Check all mandatory components on Jobs tab on Project Home Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Development_Links_Table" table on "Demo_Project" wizard with offset "false"
            | name |
            | Jobs |
        And wait load page
        Then verify "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard should contains "Jobs_And_Workflows"."Tab_List"
        Then verify "Monitor Jobs" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard
        Then verify "New_Job_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then "New_Job_Button" element on "Jobs_Monitor_Tab" should contains "Batch Run" value
        Then verify "Resource_Monitoring_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Table_Refresh_Button" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Status_Filter_Dropdown" element visibility on "Jobs_Monitor_Tab" wizard
        Then verify "Status_Filter_Dropdown" dropdown element on "Jobs_Monitor_Tab" wizard should contains "Dropdown_Options"."Status_Filter_Options"

    @passive
    @demo
    #TODO: Register_Model_Button - in demo mode
    Scenario: MLPH015 - Check all mandatory components on Models tab on Project Home Page
        Given open url
        * turn on demo mode
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Development_Links_Table" table on "Demo_Project" wizard with offset "false"
            |  name  |
            | Models |
        And wait load page
        Then verify "Models_Tab_Selector" on "Models" wizard should contains "Models"."Tab_List"
        Then verify "Table_Name_Filter_Input" element visibility on "Models" wizard
        Then click on "Table_FilterBy_Button" element on "Models" wizard
        Then verify "Table_Label_Filter_Input" element visibility on "Artifacts_FilterBy_Popup" wizard
        Then verify "Table_Tree_Filter_Dropdown" element visibility on "Artifacts_FilterBy_Popup" wizard
        Then verify "Show_Iterations_Checkbox" element visibility on "Artifacts_FilterBy_Popup" wizard
        Then verify "Table_Refresh_Button" element visibility on "Models" wizard
        Then verify "Models_Table" element visibility on "Models" wizard
        Then verify "Register_Model_Button" element visibility on "Models" wizard
        Then "Register_Model_Button" element on "Models" should contains "Register Model" value

    @passive
    Scenario: MLPH016 - Check all mandatory components on Monitor Workflows tab on Project Home Page
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Development_Links_Table" table on "Demo_Project" wizard with offset "false"
            |    name   |
            | Workflows |
        And wait load page
        Then verify "Monitor Workflows" tab is active in "Jobs_Tab_Selector" on "Jobs_Monitor_Tab" wizard

    @passive
    Scenario: MLPH017 - Check all mandatory components on Models Endpoint tab on Project Home Page
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Deployment_Links_Table" table on "Demo_Project" wizard with offset "false"
            |      name       |
            | Model Endpoints |
        And wait load page
        Then verify "Model Endpoints" tab is active in "Models_Tab_Selector" on "Models" wizard

    @passive
    Scenario: MLPH018 - Check all mandatory components on Real-Time Piplines tab on Project Home Page
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Deployment_Links_Table" table on "Demo_Project" wizard with offset "false"
            |        name         |
            |     RT Pipelines    |
        And wait load page
        Then verify "Real-Time Pipelines" tab is active in "Models_Tab_Selector" on "Models" wizard

    @passive
    Scenario: MLPH019 - Check all mandatory components on Monitoring tab on Project Home Page
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        When click on "name" in "Deployment_Links_Table" table on "Demo_Project" wizard with offset "false"
            |    name    |
            | Monitoring |
        And wait load page
        Then verify breadcrumbs "project" label should be equal "default" value
        Then verify "Create_New" element visibility on "Project" wizard
        Then verify "Refresh_Button" element visibility on "Project" wizard
        Then verify "Dashboard_Realtime_Functions_Table" element visibility on "Project" wizard
        Then verify "Jobs_And_Workflows" element visibility on "Project" wizard
        Then verify "Mono_Values_Cards" element visibility on "Project" wizard
        Then verify "Jobs_Info_Card_Statistics" element visibility on "Project" wizard
        Then verify "Real_Time_Functions_Card_Statistics" element visibility on "Project" wizard
        When hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then verify "General_Info_Quick_Links" element visibility on "commonPagesHeader" wizard
    
    Scenario: MLPH020 - Check all mandatory components on Batch inference in Advanced section
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on "Quick_actions_Button" element on "commonPagesHeader" wizard
        And wait load page
        Then verify "Deployment_Actions_Table" element visibility on "Demo_Project" wizard
        Then verify values in "Deployment_Actions_Table" table on "Demo_Project" wizard
            |           name            |
            | Create real-time function |
            |      Batch inference      |
        When click on "name" in "Deployment_Actions_Table" table on "Demo_Project" wizard with offset "false"
            |      name       |
            | Batch inference |
        And wait load page
        Then verify "Next_Button" element on "Batch_Inference" wizard is enabled
        Then verify "Back_Button" element on "Batch_Inference" wizard is disabled
        Then "Next_Button" element on "Batch_Inference" should contains "Next" value
        Then "Back_Button" element on "Batch_Inference" should contains "Back" value
        And click on "Next_Button" element on "Batch_Inference" wizard
        And click on "Next_Button" element on "Batch_Inference" wizard
        And click on "Next_Button" element on "Batch_Inference" wizard
        And click on "Next_Button" element on "Batch_Inference" wizard
        Then verify "Next_Button" element on "Batch_Inference" wizard is enabled
        Then verify "Back_Button" element on "Batch_Inference" wizard is enabled
        Then "Next_Button" element on "Batch_Inference" should contains "Infer now" value
        Then "Back_Button" element on "Batch_Inference" should contains "Schedule Infer" value
        Then verify "Accordion_Header" element visibility in "Advanced_Accordion" on "Batch_Inference" wizard
        Then "Accordion_Header" element in "Advanced_Accordion" on "Batch_Inference" should contains "Advanced" value
        Then verify "Accordion_Subheader" element visibility in "Advanced_Accordion" on "Batch_Inference" wizard
        Then "Accordion_Subheader" element in "Advanced_Accordion" on "Batch_Inference" should contains "Environment variables" value
        Then verify "Advanced_Environment_Variables_Table" element visibility on "Batch_Inference" wizard              
        When add data to "Advanced_Environment_Variables_Table" table on "Batch_Inference" wizard with several inputs
            | name_input | type_dropdown |  value_input | value_input_key |
            |    name1   |     Value     |    value1    |                 |
            |    name2   |     Secret    | sectretName1 |   sectretKey1   |
            |    name3   |     Secret    | sectretName2 |   sectretKey2   |
            |    name4   |     Value     |    value2    |                 |
            |    name5   |     Secret    | sectretName3 |   sectretKey3   |
            |    name6   |     Value     |    value3    |                 |
            |    name7   |     Secret    | sectretName4 |   sectretKey4   |
            |    name8   |     Value     |    value4    |                 |
        Then verify data in "Advanced_Environment_Variables_Table" table on "Batch_Inference" wizard
            | name_verify | type_dropdown_verify |       value_verify       |
            |    name1    |        value         |          value1          |
            |    name2    |        secret        | sectretName1:sectretKey1 | 
            |    name3    |        secret        | sectretName2:sectretKey2 |
            |    name4    |        value         |          value2          |
            |    name5    |        secret        | sectretName3:sectretKey3 |
            |    name6    |        value         |          value3          |
            |    name7    |        secret        | sectretName4:sectretKey4 |
            |    name8    |        value         |          value4          |
        When click on "delete_btn" in "Advanced_Environment_Variables_Table" table on "Batch_Inference" wizard with offset "false"
            | name_verify |
            |    name1    |
            |    name3    |
            |    name6    |
        Then verify data in "Advanced_Environment_Variables_Table" table on "Batch_Inference" wizard
            | name_verify | type_dropdown_verify |       value_verify       |
            |    name2    |        secret        | sectretName1:sectretKey1 | 
            |    name4    |        value         |          value2          |
            |    name5    |        secret        | sectretName3:sectretKey3 |
            |    name7    |        secret        | sectretName4:sectretKey4 |
            |    name8    |        value         |          value4          |
        Then edit 1 row in "Advanced_Environment_Variables_Table" key-value table on "Batch_Inference" wizard
            | name_input | value_input | 
            |   edited   |    edited   |
        Then verify data in "Advanced_Environment_Variables_Table" table on "Batch_Inference" wizard
            | name_verify | type_dropdown_verify |          value_verify          |
            | name2edited |        secret        | sectretName1edited:sectretKey1 | 
            |    name4    |        value         |             value2             |
            |    name5    |        secret        |    sectretName3:sectretKey3    |
            |    name7    |        secret        |    sectretName4:sectretKey4    |
            |    name8    |        value         |             value4             |
        Then edit 5 row in "Advanced_Environment_Variables_Table" key-value table on "Batch_Inference" wizard
            | name_input | value_input | 
            |   edited   |    edited   |
        Then verify data in "Advanced_Environment_Variables_Table" table on "Batch_Inference" wizard
            | name_verify | type_dropdown_verify |          value_verify          |
            | name2edited |        secret        | sectretName1edited:sectretKey1 | 
            |    name4    |        value         |             value2             |
            |    name5    |        secret        |    sectretName3:sectretKey3    |
            |    name7    |        secret        |    sectretName4:sectretKey4    |
            | name8edited |        value         |          value4edited          |
        Then verify "Default_Input_Path_Input" element visibility in "Advanced_Accordion" on "Batch_Inference" wizard
        Then type value "test" to "Default_Input_Path_Input" field on "Advanced_Accordion" on "Batch_Inference" wizard
        Then verify "Default_Artifact_Path_Input" element visibility in "Advanced_Accordion" on "Batch_Inference" wizard
        Then "Default_Artifact_Path_Input" element in "Advanced_Accordion" on "Batch_Inference" should contains "v3io:///projects/{{run.project}}/artifacts/{{run.uid}}" attribute value
        Then verify "Access_Key_Checkbox" element visibility on "Batch_Inference" wizard
        Then uncheck "Access_Key_Checkbox" element on "Batch_Inference" wizard
        Then verify "Access_Key_Input" element visibility on "Batch_Inference" wizard
        Then type value "  @" to "Access_Key_Input" field on "Batch_Inference" wizard
        Then verify "Access_Key_Input" on "Batch_Inference" wizard should display warning "Input_Hint"."Input_Field_Invalid"
        Then type value "" to "Access_Key_Input" field on "Batch_Inference" wizard
        Then verify "Access_Key_Input" on "Batch_Inference" wizard should display warning "Input_Hint"."Input_Field_Require"
    
    Scenario: MLPH023 - Check components - batch inference_v2, preview text, model path type store
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on "Quick_actions_Button" element on "commonPagesHeader" wizard
        And wait load page
        Then verify "Deployment_Actions_Table" element visibility on "Demo_Project" wizard
        Then verify values in "Deployment_Actions_Table" table on "Demo_Project" wizard
            |           name            |
            | Create real-time function |
            |      Batch inference      |
        When click on "name" in "Deployment_Actions_Table" table on "Demo_Project" wizard with offset "false"
            |      name       |
            | Batch inference |
        And wait load page
        Then "Function_Title" element on "Batch_Inference" should contains "batch-inference-v2" value
        Then "Preview_text" element on "Batch_Inference" should contains "Tech Preview" value
        And click on "Next_Button" element on "Batch_Inference" wizard
        Then "Form_Header_Batch_Run" element on "Batch_Inference" should contains "Data Inputs" value
        And hover "Edit_Button" component on "Batch_Inference" wizard
        And click on "Edit_Button" element on "Batch_Inference" wizard
        Then verify "Data_Inputs_Path_Dropdown" dropdown element on "Batch_Inference" wizard should contains "Batch_Inference"."Model_Path_Type_Store"

    @MLPH
    Scenario: MLPH024 - Check Train model wizard opens up
        Given open url
        And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
        Then click on "Quick_actions_Button" element on "commonPagesHeader" wizard
        And wait load page
        Then verify "Development_Actions_Table" element visibility on "Demo_Project" wizard
        Then verify values in "Development_Actions_Table" table on "Demo_Project" wizard
            |     name    |
            |  Batch run  |
            | Train model |
        When click on "name" in "Development_Actions_Table" table on "Demo_Project" wizard with offset "false"
            |    name     |
            | Train model |
        And wait load page
        Then verify "Title" element visibility on "Train_Model" wizard
        Then "Title" element on "Train_Model" should contains "Train Model" value
        Then verify "Cross_Cancel_Button" element visibility on "Train_Model" wizard
        Then "Function_Title" element on "Train_Model" should contains "auto-trainer" value
        Then "Form_Header_Run_Details" element on "commonPagesHeader" should contains "Run Details" value
        Then "Hyperparameter_Checkbox" element should be unchecked on "Train_Model" wizard
        Then verify "Step_1_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_2_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_3_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_4_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Step_5_Button" element on "commonPagesHeader" wizard is enabled
        Then verify "Next_Button" element on "Train_Model" wizard is enabled
        Then "Next_Button" element on "Train_Model" should contains "Next" value
        Then verify "Run_Training_Now_Button" element on "Train_Model" wizard is enabled
        Then "Run_Training_Now_Button" element on "Train_Model" should contains "Run training now" value
        Then verify "Schedule_Training_Job_Button" element on "Train_Model" wizard is enabled
        Then "Schedule_Training_Job_Button" element on "Train_Model" should contains "Schedule training job" value
        Then verify "Back_Button" element not exists on "Train_Model" wizard
