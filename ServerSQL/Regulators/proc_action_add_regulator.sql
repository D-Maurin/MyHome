CREATE OR REPLACE PROCEDURE `action_add_regulator` 
( 
    IN p_GID INT UNSIGNED, 
    IN p_RID VARCHAR(10)
) 
BEGIN 
    IF (SELECT EXISTS (SELECT * FROM Rooms WHERE GID=p_GID)) 
        AND (SELECT EXISTS (SELECT * FROM Regulators WHERE RID=p_RID)) 
        AND NOT (SELECT EXISTS (SELECT * FROM RegulatorsLinks WHERE RID=p_RID)) THEN  
            INSERT INTO RegulatorsLinks VALUES (p_GID, p_RID);
    END IF; 
END