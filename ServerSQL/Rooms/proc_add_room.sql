CREATE OR REPLACE PROCEDURE `add_room` 
( 
    IN p_name VARCHAR(50), 
    IN p_SID VARCHAR(10),
    OUT p_GID INT
) 
BEGIN 
    IF (SELECT EXISTS (SELECT * FROM Sensors WHERE SID=p_SID)) 
        AND NOT (SELECT EXISTS (SELECT * FROM Rooms WHERE Sensor=p_SID)) THEN  
            INSERT INTO Rooms(Name, Sensor, TempTarget) VALUES (p_name, p_SID, 20);
            SELECT GID INTO p_GID FROM Rooms WHERE Sensor=p_SID;
    ELSE 
        SET p_GID=0;
    END IF; 
END