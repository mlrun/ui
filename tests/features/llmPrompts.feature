Feature: LLM prompts Page

    Testcases that verifies functionality on LLM prompts Page
    
  @MLLP
  @smoke
  Scenario: MLLP001 - Check components on LLM prompts page
    Given open url
    And wait load page
    When turn on demo mode with query params "false"
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "default" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "LLM prompts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "LLM prompts" value
    Then verify redirection to "projects/default/llm-prompts?bePage=1&fePage=1"
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Project monitoring" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    And wait load page
    And select "tab" with "LLM prompts" value in breadcrumbs menu
    And wait load page
    Then verify redirection to "projects/default/llm-prompts?bePage=1&fePage=1"
    Then verify breadcrumbs "tab" label should be equal "LLM prompts" value
    Then verify "Search_By_Name_Filter_Input" element visibility on "LLM_Prompts" wizard
    Then verify "LLMPrompts_Table" element visibility on "LLM_Prompts" wizard
    Then verify "Table_FilterBy_Button" element visibility on "LLM_Prompts" wizard
    Then verify "Table_FilterBy_Button" element on "LLM_Prompts" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button"
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    And wait load page
    Then verify "Table_Label_Filter_Input" element visibility on "FilterBy_Popup" wizard
    Then verify "Table_Tree_Filter_Dropdown" element visibility on "FilterBy_Popup" wizard
    Then verify "Table_Tree_Filter_Dropdown" dropdown on "FilterBy_Popup" wizard selected attribute option value "latest"
    Then verify "Show_Iterations_Checkbox" element visibility on "FilterBy_Popup" wizard
    Then "Show_Iterations_Checkbox" element should be checked on "FilterBy_Popup" wizard
    Then verify "Clear_Button" element visibility on "FilterBy_Popup" wizard
    Then verify "Clear_Button" element on "FilterBy_Popup" wizard is disabled
    Then verify "Apply_Button" element visibility on "FilterBy_Popup" wizard
    Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
    Then uncheck "Show_Iterations_Checkbox" element on "FilterBy_Popup" wizard
    And wait load page
    Then verify "Apply_Button" element on "FilterBy_Popup" wizard is enabled
    Then verify "Clear_Button" element on "FilterBy_Popup" wizard is enabled
    Then click on "Apply_Button" element on "FilterBy_Popup" wizard
    And wait load page
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    And wait load page
    Then "Show_Iterations_Checkbox" element should be unchecked on "FilterBy_Popup" wizard
    Then verify "Apply_Button" element on "FilterBy_Popup" wizard is disabled
    Then verify "Clear_Button" element on "FilterBy_Popup" wizard is enabled
    Then click on "Table_FilterBy_Button" element on "LLM_Prompts" wizard
    And wait load page
    Then verify "LLMPrompts_Table" element visibility on "LLM_Prompts" wizard
    Then verify "Refresh_Button" element visibility on "LLM_Prompts" wizard
    Then verify "Refresh_Button" element on "LLM_Prompts" wizard should display hover tooltip "Common_Tooltips"."Refresh_Button"
    Then verify "Table_FilterBy_Button" element on "LLM_Prompts" wizard should display hover tooltip "Common_Tooltips"."FilterBy_Button_1"
    Then verify "BE_Pagination_Navigate_Prev" element visibility on "Pagination_Info_Pane" wizard
    Then verify "BE_Pagination_Navigate_Prev" element on "Pagination_Info_Pane" wizard is disabled
    Then verify "BE_Pagination_Navigate_Next" element visibility on "Pagination_Info_Pane" wizard
    Then verify "BE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is disabled
    Then verify "FE_Pagination_Navigate_Next" element visibility on "Pagination_Info_Pane" wizard
    Then verify "FE_Pagination_Navigate_Next" element on "Pagination_Info_Pane" wizard is disabled
    Then verify "FE_Pagination_Navigate_Prev" element visibility on "Pagination_Info_Pane" wizard
    Then verify "FE_Pagination_Navigate_Prev" element on "Pagination_Info_Pane" wizard is disabled
    Then verify "Pagination_Page_Number" element visibility on "Pagination_Info_Pane" wizard
    Then "Pagination_Page_Number" element on "Pagination_Info_Pane" should contains "1" value
    Then verify "Pagination_Count" element visibility on "Pagination_Info_Pane" wizard
    Then "Pagination_Count" element on "Pagination_Info_Pane" should contains "Showing 1 - 3" value
