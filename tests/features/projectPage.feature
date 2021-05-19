Feature: MLRun Project Page

    Testcases that verifies functionality on MLRun Project Page

    @passive
    @sanity
    Scenario: Check all mandatory components
        Given open url
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then verify "Create_New" element visibility on "Project" wizard
        Then verify "Refresh_Button" element visibility on "Project" wizard
        Then verify "Dashbord_Realtime_Functions_Table" element visibility on "Project" wizard
        Then verify "Jobs_And_Workflows" element visibility on "Project" wizard
        Then verify "Mono_Values_Cards" element visibility on "Project" wizard
        Then verify "Jobs_Info_Card_Statistics" element visibility on "Project" wizard
        Then verify "Real_Time_Functions_Card_Statistics" element visibility on "Project" wizard
        Then verify "General_Info_Quick_Links" element visibility on "Project" wizard
