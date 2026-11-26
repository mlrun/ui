Feature: Project lifecycle and settings in ORIS mode

    The app runs as in ORIS (Module Federation): project changes go to the leader (Orca) and its authorization
    service, which the mock server serves (tests/mockServer/orcaMock.js). ORIS-5399: project settings after an owner
    change, and the leader's archive and unarchive states.

    Background:
        Given the app runs in ORIS mode

    @MLORIS
    @passive
    @smoke
    Scenario: MLORIS001 - Archive and unarchive request the leader's archived and online states
        * "oris-archive-project" project is created on the leader by "admin"
        Given open url
        And wait load page
        Then check "oris-archive-project" value in "name" column in "Projects_Table" table on "Projects" wizard
        Then select "Archive" option in action menu on "Projects" wizard in "Projects_Table" table at row with "oris-archive-project" value in "name" column
        Then verify if "Common_Popup" popup dialog appears
        Then click on "Confirm_Button" element on "Common_Popup" wizard
        Then the last update of "oris-archive-project" project requests the "archived" state from the leader
        And "oris-archive-project" project is "archived" on the leader
        Then check "oris-archive-project" value not in "name" column in "Projects_Table" table on "Projects" wizard
        Then click on "Archive_Projects_Button" element on "Projects" wizard
        Then check "oris-archive-project" value in "name" column in "Projects_Table" table on "Projects" wizard
        Then select "Unarchive" option in action menu on "Projects" wizard in "Projects_Table" table at row with "oris-archive-project" value in "name" column
        Then the last update of "oris-archive-project" project requests the "online" state from the leader
        And "oris-archive-project" project is "online" on the leader

    @MLORIS
    @passive
    @smoke @sanity
    Scenario: MLORIS002 - A settings edit after the owner changed on the leader keeps the new owner
        * "oris-edit-project" project is created on the leader by "admin"
        When open the "general" tab of "oris-edit-project" project settings
        And wait load page
        # the page has loaded the project with its first owner and op id
        Given the leader transfers "oris-edit-project" project to "bob"
        When change the project description to "Edited after the transfer"
        Then the last update of "oris-edit-project" project is accepted by the leader with "bob" owner
        And "oris-edit-project" project is owned by "bob" on the leader
        Then verify if "Notification_Popup" popup dialog appears
        Then "Notification_Popup" element on "Notification_Popup" should contain "Data was edited successfully" value

    @MLORIS
    @passive
    @smoke
    Scenario: MLORIS003 - Changing the owner in the owner box and then editing keeps the new owner
        * "oris-owner-box-project" project is created on the leader by "admin"
        When open the "general" tab of "oris-owner-box-project" project settings
        And wait load page
        Then the project owner in the owner box is "admin"
        When change the project owner to "bob" in the owner box
        Then verify if "Notification_Popup" popup dialog appears
        Then "Notification_Popup" element on "Notification_Popup" should contain "Owner updated successfully. It may take a few moments to synchronize changes." value
        Then the project owner in the owner box is "bob"
        When change the project description to "Edited after the owner box"
        Then the last update of "oris-owner-box-project" project is accepted by the leader with "bob" owner
        And "oris-owner-box-project" project is owned by "bob" on the leader

    @MLORIS
    @passive
    @smoke @sanity
    Scenario: MLORIS004 - Saving members keeps every role of the members the save did not touch
        * "oris-members-project" project is created on the leader by "admin"
        * the leader adds members to "oris-members-project" project:
            | role    | members     |
            | viewer  | admin,carol |
            | curator | carol       |
            | editor  | dave        |
        # admin, the previous owner, gets Admin on top of Viewer
        * the leader transfers "oris-members-project" project to "bob"
        When open the "members" tab of "oris-members-project" project settings
        And wait load page
        Then "bob" member is shown with the "Owner" role
        Then "admin" member is shown with the "Admin" role
        Then "carol" member is shown with the "Curator" role
        When remove "dave" member from project members
        And apply the project members changes
        Then verify if "Notification_Popup" popup dialog appears
        Then "Notification_Popup" element on "Notification_Popup" should contain "Members updated successfully" value
        Then the members of "oris-members-project" project on the leader are:
            | role    | members     |
            | Owner   | bob         |
            | Admin   | admin       |
            | Editor  |             |
            | Builder |             |
            | Curator | carol       |
            | Viewer  | admin,carol |
        Then "admin" member is shown with the "Admin" role
        Then "dave" member is not shown
