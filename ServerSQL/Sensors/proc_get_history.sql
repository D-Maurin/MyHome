CREATE OR REPLACE PROCEDURE `get_history`
(
    IN p_GID INT
)
BEGIN 
    DECLARE max_val, min_val NUMERIC(3,1);
    SET max_val = (SELECT MAX(Value) + 0.2 FROM SensorsHistory 
        INNER JOIN Rooms 
            ON SensorsHistory.SID = Rooms.Sensor
        WHERE
            VTime > DATE_ADD(DATE(NOW()), INTERVAL -1 DAY)
            AND
            (Rooms.GID = p_GID));
    SET min_val = (SELECT MIN(Value) - 0.2 FROM SensorsHistory 
        INNER JOIN Rooms 
            ON SensorsHistory.SID = Rooms.Sensor
        WHERE
            VTime > DATE_ADD(DATE(NOW()), INTERVAL -1 DAY)
            AND
            (Rooms.GID = p_GID));
    SELECT 
        Value,
        VTime,
        (max_val - Value)*100/(max_val - min_val) AS Formated,
        TIMESTAMPDIFF(MINUTE, DATE_ADD(DATE(NOW()), INTERVAL -1 DAY), VTime) AS TimeId
    FROM SensorsHistory 
    INNER JOIN Rooms 
        ON SensorsHistory.SID = Rooms.Sensor
    WHERE
        VTime > DATE_ADD(DATE(NOW()), INTERVAL -1 DAY)
        AND
        (Rooms.GID = p_GID)
	ORDER BY VTime ASC;
END