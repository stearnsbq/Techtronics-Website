USE 508_PROJECT;
DROP PROCEDURE search;
DELIMITER //
CREATE PROCEDURE search (IN media varchar(50), IN searchQuery varchar(50), IN queryVal varchar(60))
BEGIN
	SET @ID = CONCAT(media, '_ID');
    SET @SQL = CONCAT('SELECT DISTINCT Media.Name, Media.Platform, Media.User_rating, Media.Price, Media.Condition, ', media, '.*' ,' FROM ', media, ' LEFT JOIN Media ON Media.Media_ID=', @ID ,' WHERE ', searchQuery, '=', '\'', queryVal, '\'');
    PREPARE stmt FROM @SQL;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END//
DELIMITER ;


