CREATE OR REPLACE PROCEDURE `get_planify_room_plan`
(
	IN p_GID INT UNSIGNED
)
BEGIN 
    SELECT P_DAY, P_HOUR, P_TARGET
    FROM Planify
    WHERE GID=p_GID
	ORDER BY P_HOUR;
END