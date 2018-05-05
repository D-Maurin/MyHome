CREATE OR REPLACE PROCEDURE `get_available_regulators`
(
	IN p_GID INT UNSIGNED
)
BEGIN 
    SELECT 
        Regulators.RID,
        IF(RegulatorsLinks.GID IS NULL, FALSE, TRUE) AS SEL
    FROM Regulators 
        LEFT JOIN RegulatorsLinks 
            ON RegulatorsLinks.RID = Regulators.RID
    WHERE RegulatorsLinks.GID = p_GID OR RegulatorsLinks.GID IS NULL
	ORDER BY Regulators.RID;
END