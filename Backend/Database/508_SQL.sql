CREATE SCHEMA 508_PROJECT;
USE 508_PROJECT;

CREATE TABLE `Person` (
  `Person_ID` INT PRIMARY KEY AUTO_INCREMENT,
  `Username` varchar(50) UNIQUE NOT NULL,
  `Password` char(60) NOT NULL,
  `Email` varchar(255) UNIQUE NOT NULL,
  `First_name` varchar(50) NOT NULL,
  `Last_name` varchar(50) NOT NULL,
  `Birth_date` date NOT NULL
);

CREATE TABLE `Phone_numbers` (
  `Person_ID` INT,
  `Phone_number` char(10),
  PRIMARY KEY (`Person_ID`, `Phone_number`),
  FOREIGN KEY (`Person_ID`) REFERENCES `Person` (`Person_ID`)
);

CREATE TABLE `Employee` (
  `Employee_ID` INT PRIMARY KEY,
  `Hire_date` date NOT NULL,
   FOREIGN KEY (`Employee_ID`) REFERENCES `Person` (`Person_ID`)
);

CREATE TABLE `Customer` (
  `Customer_ID` INT PRIMARY KEY,
  FOREIGN KEY (`Customer_ID`) REFERENCES `Person` (`Person_ID`)
);

CREATE TABLE `Company` (
  `Company_ID` INT PRIMARY KEY AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Number_of_products` INT NOT NULL
);

CREATE TABLE `Publisher` (
  `Publisher_ID` INT PRIMARY KEY,
  FOREIGN KEY (`Publisher_ID`) REFERENCES `Company` (`Company_ID`)
);

CREATE TABLE `Manufacturer` (
  `Manufacturer_ID` INT PRIMARY KEY,
  FOREIGN KEY (`Manufacturer_ID`) REFERENCES `Company` (`Company_ID`)
);

CREATE TABLE `Developer` (
  `Developer_ID` INT PRIMARY KEY,
  FOREIGN KEY (`Developer_ID`) REFERENCES `Company` (`Company_ID`)
);

CREATE TABLE `Media` (
  `Media_ID` INT PRIMARY KEY AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Platform` varchar(50) NOT NULL,
  `User_rating` float,
  `Price` float NOT NULL,
  `Condition` text NOT NULL
);

CREATE TABLE `Media_Images` (
  `Media_ID` INT PRIMARY KEY,
  `FileName` varchar(255) PRIMARY KEY,
FOREIGN KEY (`Media_ID`) REFERENCES `Media` (`Media_ID`)
);

CREATE TABLE `Hardware` (
  `Hardware_ID` INT PRIMARY KEY,
  `Type` varchar(255) NOT NULL,
  FOREIGN KEY (`Hardware_ID`) REFERENCES `Media` (`Media_ID`)
);

CREATE TABLE `Software` (
  `Software_ID` INT PRIMARY KEY,
  `Type` varchar(255) NOT NULL,
  FOREIGN KEY (`Software_ID`) REFERENCES `Media` (`Media_ID`)
);

CREATE TABLE `Video` (
  `Video_ID` INT PRIMARY KEY,
  `Genre` varchar(255) NOT NULL,
  `MPAA_Rating` varchar(5) NOT NULL,
  FOREIGN KEY (`Video_ID`) REFERENCES `Media` (`Media_ID`)
);

CREATE TABLE `Game` (
  `Game_ID` INT PRIMARY KEY,
  `Genre` varchar(255) NOT NULL,
  `ESRB_Rating` varchar(5) NOT NULL,
  FOREIGN KEY (`Game_ID`) REFERENCES `Media` (`Media_ID`)
);

CREATE TABLE `DLC` (
  `DLC_ID` INT PRIMARY KEY,
  `Game_ID` INT NOT NULL,
  FOREIGN KEY (`DLC_ID`) REFERENCES `Game` (`Game_ID`),
  FOREIGN KEY (`Game_ID`) REFERENCES `Game` (`Game_ID`)
);

CREATE TABLE `Media_Companies` (
  `Media` INT,
  `Company` INT,
  PRIMARY KEY (`Media`, `Company`),
  FOREIGN KEY (`Media`) REFERENCES `Media` (`Media_ID`),
  FOREIGN KEY (`Company`) REFERENCES `Company` (`Company_ID`)
);

CREATE TABLE `Order` (
  `Order_ID` INT PRIMARY KEY  AUTO_INCREMENT,
  `Customer` INT,
  `Media_Count` INT NOT NULL,
  `Address` varchar(255) NOT NULL,
  `Zip_code` char(5) NOT NULL,
  `State` varchar(50) NOT NULL,
  `Country` varchar(50) NOT NULL,
  FOREIGN KEY (`Customer`) REFERENCES `Customer` (`Customer_ID`)
);

CREATE TABLE `Order_Items` (
  `Order` INT,
  `Media` INT,
  PRIMARY KEY (`Order`, `Media`),
  FOREIGN KEY (`Order`) REFERENCES `Order` (`Order_ID`),
  FOREIGN KEY (`Media`) REFERENCES `Media` (`Media_ID`)
);
CREATE TABLE `Shipping` (
  `Shipping_ID` INT PRIMARY KEY AUTO_INCREMENT,
  `Carrier` varchar(50) NOT NULL,
  `Shipped_date` date NOT NULL,
);

CREATE TABLE `Shipped_Orders` (
  `Order` INT,
  `Shipping` INT,
  PRIMARY KEY (`Order`, `Shipping`),
  FOREIGN KEY (`Order`) REFERENCES `Order` (`Order_ID`),
  FOREIGN KEY (`Shipping`) REFERENCES `Shipping` (`Shipping_ID`)
);


CREATE TABLE `Specials` (
  `Specials_ID` INT PRIMARY KEY  AUTO_INCREMENT,
  `Percentage_off` float NOT NULL,
  `Start_date` date NOT NULL,
  `End_date` date NOT NULL
);

CREATE TABLE `Media_Specials` (
  `Special_ID` INT,
  `Media` INT,
  PRIMARY KEY (`Special_ID`, `Media`),
  FOREIGN KEY (`Special_ID`) REFERENCES `Specials` (`Specials_ID`),
  FOREIGN KEY (`Media`) REFERENCES `Media` (`Media_ID`)
);
