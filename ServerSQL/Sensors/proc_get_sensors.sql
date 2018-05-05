CREATE OR REPLACE PROCEDURE `get_sensors`()
BEGIN 
    SELECT 
        SID, 
        IF(GID IS NULL, FALSE, TRUE) AS USED,
        IF(TIMESTAMPDIFF(MINUTE, Sensors.LastUpdate, NOW()) > 10, FALSE, TRUE) AS UPTODATE ,
        Rooms.Name
    FROM Sensors 
        LEFT JOIN Rooms 
            ON Sensors.SID = Rooms.Sensor
    ORDER BY SID;
END