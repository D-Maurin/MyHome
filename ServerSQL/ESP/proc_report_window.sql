CREATE OR REPLACE PROCEDURE `report_window` 
( 
    IN p_WID VARCHAR(10), 
    IN p_state BOOL
) 
BEGIN 
    IF (SELECT EXISTS (SELECT * FROM Windows WHERE WID=p_WID)) THEN  
        UPDATE Windows 
        SET State=p_state, LastUpdate=NOW()  
        WHERE WID=p_WID; 
    ELSE 
        INSERT INTO Windows  
        VALUES (p_WID, NOW(), p_state); 
    END IF;
END