CREATE OR REPLACE PROCEDURE `get_temps` 
( 
    IN p_RID VARCHAR(10)
) 
BEGIN
    IF NOT (SELECT EXISTS (SELECT * FROM Regulators WHERE RID=p_RID)) THEN 
        INSERT INTO Regulators  
        VALUES (p_RID, NOW());
    END IF; 
    
    SELECT 
        Sensors.Value,
        Rooms.TempTarget, 
        (SELECT COUNT(*) FROM WindowsLinks INNER JOIN Windows ON Windows.WID = WindowsLinks.WID WHERE GID=Rooms.GID AND Windows.State=0 AND TIMESTAMPDIFF(MINUTE, Windows.LastUpdate, NOW()) < 10) AS WOPEN
    FROM RegulatorsLinks 
    RIGHT JOIN Regulators
        ON RegulatorsLinks.RID = Regulators.RID
    LEFT JOIN Rooms
        ON RegulatorsLinks.GID = Rooms.GID
    LEFT JOIN Sensors
        ON Rooms.Sensor = Sensors.SID
    LEFT JOIN WindowsLinks
        ON Rooms.GID = WindowsLinks.GID
    WHERE Regulators.RID = p_RID;
    
    UPDATE Regulators SET LastUpdate=NOW() WHERE RID=p_RID;
END