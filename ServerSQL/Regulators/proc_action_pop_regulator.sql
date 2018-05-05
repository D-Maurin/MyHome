CREATE OR REPLACE PROCEDURE `action_pop_regulator` 
( 
    IN p_GID INT UNSIGNED, 
    IN p_RID VARCHAR(10)
) 
BEGIN 
    DELETE FROM RegulatorsLinks
    WHERE GID=p_GID AND RID=p_RID;
END