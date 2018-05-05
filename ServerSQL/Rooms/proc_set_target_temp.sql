CREATE OR REPLACE PROCEDURE `set_target_temp` 
( 
    IN p_GID INT UNSIGNED, 
    IN p_temp NUMERIC(4,2) 
) 
BEGIN 
    IF (SELECT EXISTS (SELECT * FROM Rooms WHERE GID=p_GID)) THEN  
        UPDATE Rooms
        SET TempTarget=p_temp  
        WHERE GID=p_GID; 
    ELSE 
        SELECT 'Error'; 
    END IF; 
END