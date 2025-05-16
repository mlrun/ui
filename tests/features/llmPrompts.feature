Feature: LLM prompts Page

    Testcases that verifies functionality on LLM prompts Page
    
  @MLLP
  @smoke
  Scenario: MLLP001 - Check components on LLM prompts page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "default" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "LLM prompts" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify redirection to "projects/default/llm-prompts"
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Project monitoring" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    And wait load page
    And select "tab" with "LLM prompts" value in breadcrumbs menu
    And wait load page
    Then verify redirection to "projects/default/llm-prompts"
