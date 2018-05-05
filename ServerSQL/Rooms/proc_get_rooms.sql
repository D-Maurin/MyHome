CREATE OR REPLACE PROCEDURE `get_rooms`()
BEGIN 
    SELECT 
        GID,Name, Value, TempTarget,
        IF(TIMESTAMPDIFF(MINUTE, Sensors.LastUpdate, NOW()) > 10, FALSE, TRUE) AS UPTODATE,
        (SELECT COUNT(*) FROM RegulatorsLinks WHERE GID=Rooms.GID) AS RCOUNT,
        (SELECT COUNT(*) FROM RegulatorsLinks INNER JOIN Regulators ON Regulators.RID = RegulatorsLinks.RID WHERE GID=Rooms.GID AND TIMESTAMPDIFF(MINUTE, Regulators.LastUpdate, NOW()) < 10) AS RUTD,
        (SELECT COUNT(*) FROM WindowsLinks WHERE GID=Rooms.GID) AS WCOUNT,
        (SELECT COUNT(*) FROM WindowsLinks INNER JOIN Windows ON Windows.WID = WindowsLinks.WID WHERE GID=Rooms.GID AND TIMESTAMPDIFF(MINUTE, Windows.LastUpdate, NOW()) < 10) AS WUTD,
        (SELECT COUNT(*) FROM WindowsLinks INNER JOIN Windows ON Windows.WID = WindowsLinks.WID WHERE GID=Rooms.GID AND Windows.State=1) AS WOPEN
    FROM Rooms 
    INNER JOIN Sensors 
        ON Sensors.SID = Rooms.Sensor
	ORDER BY GID;
END