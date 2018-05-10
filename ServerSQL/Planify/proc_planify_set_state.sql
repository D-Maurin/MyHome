CREATE OR REPLACE PROCEDURE `planify_set_state`
(
    IN p_GID INT UNSIGNED,
    IN p_State BOOL
)
BEGIN 
    UPDATE Rooms SET ProgEnable=p_State WHERE GID=p_GID;
END