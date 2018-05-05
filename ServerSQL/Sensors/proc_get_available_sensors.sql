CREATE OR REPLACE PROCEDURE `get_available_sensors`
(
	IN p_GID INT UNSIGNED
)
BEGIN 
    SELECT 
        Sensors.SID,
        IF(Rooms.GID IS NULL, FALSE, TRUE) AS SEL
    FROM Sensors 
        LEFT JOIN Rooms 
            ON Sensors.SID = Rooms.Sensor
    WHERE Rooms.GID = p_GID OR Rooms.GID IS NULL
	ORDER BY Sensors.SID;
END