CREATE OR REPLACE PROCEDURE `get_available_windows`
(
	IN p_GID INT UNSIGNED
)
BEGIN 
    SELECT 
        Windows.WID,
        IF(WindowsLinks.GID IS NULL, FALSE, TRUE) AS SEL
    FROM Windows 
        LEFT JOIN WindowsLinks 
            ON WindowsLinks.WID = Windows.WID
    WHERE WindowsLinks.GID = p_GID OR WindowsLinks.GID IS NULL
	ORDER BY Windows.WID;
END