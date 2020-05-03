USE project_2;

CREATE TABLE IF NOT EXISTS `Person` (
  `Person_ID` INT PRIMARY KEY AUTO_INCREMENT,
  `Username` varchar(50) UNIQUE NOT NULL,
  `Password` char(60) NOT NULL,
  `Email` varchar(255) UNIQUE NOT NULL,
  `First_name` varchar(50) NOT NULL,
  `Last_name` varchar(50) NOT NULL,
  `Birth_date` date NOT NULL,
  `active`     varchar(3)
);

CREATE TABLE IF NOT EXISTS `Phone_numbers` (
  `Person_ID` INT,
  `Phone_number` char(10),
  PRIMARY KEY (`Person_ID`, `Phone_number`),
  FOREIGN KEY (`Person_ID`) REFERENCES `Person` (`Person_ID`)
);

CREATE TABLE IF NOT EXISTS `Employee` (
  `Employee_ID` INT PRIMARY KEY,
  `Hire_date` date NOT NULL,
   FOREIGN KEY (`Employee_ID`) REFERENCES `Person` (`Person_ID`)
);

CREATE TABLE IF NOT EXISTS `Customer` (
  `Customer_ID` INT PRIMARY KEY,
  FOREIGN KEY (`Customer_ID`) REFERENCES `Person` (`Person_ID`)
);

CREATE TABLE IF NOT EXISTS `Company` (
  `Company_ID` INT PRIMARY KEY AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Number_of_products` INT NOT NULL
);

CREATE TABLE IF NOT EXISTS `Publisher` (
  `Publisher_ID` INT PRIMARY KEY,
  FOREIGN KEY (`Publisher_ID`) REFERENCES `Company` (`Company_ID`)
);

CREATE TABLE IF NOT EXISTS `Manufacturer` (
  `Manufacturer_ID` INT PRIMARY KEY,
  FOREIGN KEY (`Manufacturer_ID`) REFERENCES `Company` (`Company_ID`)
);

CREATE TABLE IF NOT EXISTS `Developer` (
  `Developer_ID` INT PRIMARY KEY,
  FOREIGN KEY (`Developer_ID`) REFERENCES `Company` (`Company_ID`)
);

CREATE TABLE IF NOT EXISTS `Media` (
  `Media_ID` INT PRIMARY KEY AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Platform` varchar(50) NOT NULL,
  `User_rating` float,
  `Type` varchar(25) CHECK (`Type` IN ('Game', 'Hardware', 'Software', 'Video')) NOT NULL,
  `Price` float NOT NULL,
  `Condition` text NOT NULL,
  `Quantity` INT DEFAULT 0,
  `deleted` date,
   UNIQUE KEY `id_media_info` (`Name`, `Platform`, `Condition`(255), `Type`)
);

CREATE TABLE IF NOT EXISTS `Media_Images` (
  `Media_ID` INT ,
  `FileName` varchar(255) ,
  PRIMARY KEY (`Media_ID`, `FileName`),
  FOREIGN KEY (`Media_ID`) REFERENCES `Media` (`Media_ID`)
);

CREATE TABLE IF NOT EXISTS `Hardware` (
  `Hardware_ID` INT PRIMARY KEY,
  `Type` varchar(255) NOT NULL,
  FOREIGN KEY (`Hardware_ID`) REFERENCES `Media` (`Media_ID`)
);

CREATE TABLE IF NOT EXISTS `Software` (
  `Software_ID` INT PRIMARY KEY,
  `Type` varchar(255) NOT NULL,
  FOREIGN KEY (`Software_ID`) REFERENCES `Media` (`Media_ID`)
);

CREATE TABLE IF NOT EXISTS `Video` (
  `Video_ID` INT PRIMARY KEY,
  `Genre` varchar(255) NOT NULL,
  `MPAA_Rating` varchar(5) NOT NULL,
  FOREIGN KEY (`Video_ID`) REFERENCES `Media` (`Media_ID`)
);

CREATE TABLE IF NOT EXISTS `Game` (
  `Game_ID` INT PRIMARY KEY,
  `Genre` varchar(255) NOT NULL,
  `ESRB_Rating` varchar(5) NOT NULL,
  FOREIGN KEY (`Game_ID`) REFERENCES `Media` (`Media_ID`)
);

CREATE TABLE IF NOT EXISTS `DLC` (
  `DLC_ID` INT PRIMARY KEY,
  `Game_ID` INT NOT NULL,
  FOREIGN KEY (`DLC_ID`) REFERENCES `Game` (`Game_ID`),
  FOREIGN KEY (`Game_ID`) REFERENCES `Game` (`Game_ID`)
);

CREATE TABLE IF NOT EXISTS `Media_Companies` (
  `Media`	INT,
  `Company` INT,
  `type`   	varchar(50) CHECK (`type` IN ('Publisher', 'Developer', 'Manufacturer')),
  PRIMARY KEY (`Media`, `Company`),
  FOREIGN KEY (`Media`) REFERENCES `Media` (`Media_ID`),
  FOREIGN KEY (`Company`) REFERENCES `Company` (`Company_ID`)
);

CREATE TABLE IF NOT EXISTS `Order` (
  `Order_ID`     INT PRIMARY KEY  AUTO_INCREMENT,
  `Customer`     INT,
  `Media_Count`  INT NOT NULL,
  `Address`      varchar(255) NOT NULL,
  `Zip_code`     char(5) NOT NULL,
  `State`        varchar(50) NOT NULL,
  `Country`      varchar(50) NOT NULL,
  `Price`        FLOAT NOT NULL DEFAULT(0),
  `Ordered_date` date NOT NULL,
  FOREIGN KEY (`Customer`) REFERENCES `Customer` (`Customer_ID`)
);

CREATE TABLE IF NOT EXISTS `Order_Items` (
  `Order` INT,
  `Media` INT,
  `Price` FLOAT DEFAULT 0 NOT NULL,
  PRIMARY KEY (`Order`, `Media`),
  FOREIGN KEY (`Order`) REFERENCES `Order` (`Order_ID`),
  FOREIGN KEY (`Media`) REFERENCES `Media` (`Media_ID`)
);
CREATE TABLE IF NOT EXISTS `Shipping` (
  `Shipping_ID`     INT PRIMARY KEY AUTO_INCREMENT,
  `Carrier`         varchar(50) NOT NULL,
  `Shipped_date`    date NOT NULL,
  `Tracking_Number` varchar(255)
);

CREATE TABLE IF NOT EXISTS `Shipped_Orders` (
  `Order` INT,
  `Shipping` INT,
  PRIMARY KEY (`Order`, `Shipping`),
  FOREIGN KEY (`Order`) REFERENCES `Order` (`Order_ID`),
  FOREIGN KEY (`Shipping`) REFERENCES `Shipping` (`Shipping_ID`)
);


CREATE TABLE IF NOT EXISTS `Specials` (
  `Specials_ID` INT PRIMARY KEY  AUTO_INCREMENT,
  `Percentage_off` float NOT NULL,
  `Start_date` date NOT NULL,
  `End_date` date NOT NULL
);

CREATE TABLE IF NOT EXISTS `Media_Specials` (
  `Special_ID` INT,
  `Media` INT,
  PRIMARY KEY (`Special_ID`, `Media`),
  FOREIGN KEY (`Special_ID`) REFERENCES `Specials` (`Specials_ID`),
  FOREIGN KEY (`Media`) REFERENCES `Media` (`Media_ID`)
);


CREATE TABLE IF NOT EXISTS `verify_email_tokens`(
`email`   varchar(255) NOT NULL ,
`token`   varchar(255) NOT NULL,
`expiry`  DATETIME NOT NULL,
PRIMARY KEY (email)
)





DELIMITER //
CREATE TRIGGER update_dlc_before BEFORE UPDATE ON DLC
BEGIN

  IF EXISTS(SELECT * FROM DLC WHERE DLC.Game_ID = new.Game_ID) THEN

    UPDATE DLC SET DLC_ID = new.DLC_ID AND Game_ID = new.Game_ID;

  ELSE

    INSERT INTO DLC (DLC_ID, Game_ID) VALUES (new.Game_ID, new.Game_ID);

  END IF;


END//
DELIMITER ;




DELIMITER //
CREATE TRIGGER update_media_quantity BEFORE UPDATE ON MEDIA
BEGIN


  IF old.Quantity == 0 THEN

    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'No stock to order!';

  END IF;




END//
DELIMITER ;