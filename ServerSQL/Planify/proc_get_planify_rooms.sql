CREATE OR REPLACE PROCEDURE `get_planify_rooms`()
BEGIN 
    SELECT GID, Name, ProgEnable
    FROM Rooms;
END