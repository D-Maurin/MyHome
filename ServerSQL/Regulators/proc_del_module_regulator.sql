CREATE OR REPLACE PROCEDURE `del_module_regulator` 
( 
    IN p_RID VARCHAR(10)
) 
BEGIN 
    DELETE FROM Regulators WHERE RID=p_RID;
END