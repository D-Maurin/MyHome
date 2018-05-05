CREATE OR REPLACE PROCEDURE `action_add_window` 
( 
    IN p_GID INT UNSIGNED, 
    IN p_WID VARCHAR(10)
) 
BEGIN 
    IF (SELECT EXISTS (SELECT * FROM Rooms WHERE GID=p_GID)) 
        AND (SELECT EXISTS (SELECT * FROM Windows WHERE WID=p_WID)) 
        AND NOT (SELECT EXISTS (SELECT * FROM WindowsLinks WHERE WID=p_WID)) THEN  
            INSERT INTO WindowsLinks VALUES (p_GID, p_WID);
    END IF; 
END