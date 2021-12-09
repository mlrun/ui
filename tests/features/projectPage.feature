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

    @passive
    @inProgress
    @enabledProjectMembership
    Scenario: Check all mandatory components on Project Owner Popup
        Given open url
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then click on "Owner_Link" element on "Project" wizard
        Then verify if "Change_Project_Owner_Popup" popup dialog appears
        Then verify "Cross_Cancel_Button" element visibility on "Change_Project_Owner_Popup" wizard
        Then verify "Title" element visibility on "Change_Project_Owner_Popup" wizard
        Then verify "Discard_Button" element visibility on "Change_Project_Owner_Popup" wizard
        Then verify "Apply_Button" element visibility on "Change_Project_Owner_Popup" wizard
        Then verify "Fotter_Annotation_Label" element visibility on "Change_Project_Owner_Popup" wizard

    @passive
    @inProgress
    @enabledProjectMembership
    Scenario: Check all mandatory components on Project Owner Popup
        Given open url
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        Then click on "Members_Link" element on "Project" wizard
        Then verify if "Project_Members_Popup" popup dialog appears
        Then verify "Member_Overview_Labels_Table" element visibility on "Project_Members_Popup" wizard
        Then verify "Member_Overview_Tooltip" on "Project_Members_Popup" wizard should display "Label_Hint"."Members_Hint"
        Then verify "Invate_New_Members_Button" element visibility on "Project_Members_Popup" wizard
        Then verify "Members_Filter_Input" element visibility on "Project_Members_Popup" wizard
        Then verify "Role_Filter_Dropdown" element visibility on "Project_Members_Popup" wizard
        Then verify "Members_Table" element visibility on "Project_Members_Popup" wizard
        Then verify "Notify_by_Email" element visibility on "Project_Members_Popup" wizard
        Then verify "Discard_Button" element visibility on "Project_Members_Popup" wizard
        Then verify "Apply_Button" element visibility on "Project_Members_Popup" wizard
        Then verify "Fotter_Annotation_Label" element visibility on "Project_Members_Popup" wizard

    @passive
    Scenario: Check MLRun logo redirection
        Given open url
        And wait load page
        And click on cell with value "default" in "name" column in "Projects_Table" table on "Projects" wizard
        And wait load page
        And click on "MLRun_Logo" element on "commonPagesHeader" wizard
        And wait load page
        Then verify "Projects_Table" element visibility on "Projects" wizard
