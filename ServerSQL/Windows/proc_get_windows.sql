CREATE OR REPLACE PROCEDURE `get_windows`()
BEGIN 
    SELECT 
        Windows.WID, 
        IF(GID IS NULL, FALSE, TRUE) AS USED, 
        IF(TIMESTAMPDIFF(MINUTE, Windows.LastUpdate, NOW()) > 10, FALSE, TRUE) AS UPTODATE,
        (SELECT Name FROM Rooms WHERE GID = WindowsLinks.GID) AS RoomName
    FROM Windows 
        LEFT JOIN WindowsLinks 
            ON WindowsLinks.WID = Windows.WID
	ORDER BY Windows.WID;
END