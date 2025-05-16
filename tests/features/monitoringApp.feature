Feature: Monitoring app Page

    Testcases that verifies functionality on Monitoring app Page
    
  @MLMA
  @smoke
  Scenario: MLMA001 - Check components on Monitoring app page
    Given open url
    And wait load page
    And click on row root with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "default" value
    And hover "Project_Navigation_Toggler" component on "commonPagesHeader" wizard
    And click on cell with value "Monitoring app" in "link" column in "General_Info_Quick_Links" table on "commonPagesHeader" wizard
    And hover "MLRun_Logo" component on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
    And wait load page
    Then click on breadcrumbs "project" label on "commonPagesHeader" wizard
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Project monitoring" value
    Then verify breadcrumbs "project" label should be equal "default" value
    And select "tab" with "Monitoring app" value in breadcrumbs menu
    And wait load page
    Then verify breadcrumbs "tab" label should be equal "Monitoring app" value
    And wait load page
    Then verify "Date_Picker_Filter_Dropdown" element visibility on "Monitoring_App" wizard
    Then verify "Date_Picker_Filter_Dropdown" dropdown on "Monitoring_App" wizard selected option value "Past 24 hours"
    Then verify "Date_Picker_Filter_Dropdown" dropdown element on "Monitoring_App" wizard should contains "Dropdown_Options"."Date_Picker_Filter_Options_Endpoint"
    Then verify "Refresh_Button" element visibility on "Monitoring_App" wizard
    Then verify "Refresh_Button" element on "Monitoring_App" wizard should display hover tooltip "Common_Tooltips"."Refresh_Button"
