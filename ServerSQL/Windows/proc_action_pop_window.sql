CREATE OR REPLACE PROCEDURE `action_pop_window` 
( 
    IN p_GID INT UNSIGNED, 
    IN p_WID VARCHAR(10)
) 
BEGIN 
    DELETE FROM WindowsLinks
    WHERE GID=p_GID AND WID=p_WID;
END