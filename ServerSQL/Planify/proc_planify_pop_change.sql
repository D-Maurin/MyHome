CREATE OR REPLACE PROCEDURE `planify_pop_change`
(
    IN p_GID INT UNSIGNED,
	IN p_P_DAY SMALLINT UNSIGNED,
	IN p_P_HOUR SMALLINT UNSIGNED
)
BEGIN 
    DELETE FROM Planify WHERE GID=p_GID AND P_DAY=p_P_DAY AND P_HOUR=p_P_HOUR;
END