CREATE OR REPLACE PROCEDURE `get_regulators`()
BEGIN 
    SELECT 
        Regulators.RID, 
        IF(GID IS NULL, FALSE, TRUE) AS USED, 
        IF(TIMESTAMPDIFF(MINUTE, Regulators.LastUpdate, NOW()) > 10, FALSE, TRUE) AS UPTODATE,
        (SELECT Name FROM Rooms WHERE GID = RegulatorsLinks.GID) AS RoomName
    FROM Regulators 
        LEFT JOIN RegulatorsLinks 
            ON RegulatorsLinks.RID = Regulators.RID
	ORDER BY Regulators.RID;
END