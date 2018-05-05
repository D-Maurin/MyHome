CREATE OR REPLACE PROCEDURE `report_temp` 
( 
    IN p_SID VARCHAR(10), 
    IN p_temp NUMERIC(4,2)
) 
BEGIN 
    IF (SELECT EXISTS (SELECT * FROM Sensors WHERE SID=p_SID)) THEN  
        UPDATE Sensors 
        SET Value=p_temp, LastUpdate=NOW()  
        WHERE SID=p_SID; 
    ELSE 
        INSERT INTO Sensors  
        VALUES (p_SID, p_temp, NOW()); 
    END IF;
    
    INSERT INTO SensorsHistory
    VALUES (p_SID, p_temp, NOW());
END