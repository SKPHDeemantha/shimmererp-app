-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 27, 2025 at 03:02 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shimmerserp`
--

-- --------------------------------------------------------

--
-- Table structure for table `certification_expiry_notification`
--

CREATE TABLE `certification_expiry_notification` (
  `Notification_ID` varchar(10) NOT NULL,
  `Reg_Id` varchar(25) NOT NULL,
  `Certification_Name` varchar(50) DEFAULT NULL,
  `Expiry_Date` date NOT NULL,
  `Notification_Status` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certification_report`
--

CREATE TABLE `certification_report` (
  `Reg_Id` varchar(25) NOT NULL,
  `Certificate_Name` varchar(50) DEFAULT NULL,
  `Item_Code` varchar(10) DEFAULT NULL,
  `Item_Name` varchar(25) DEFAULT NULL,
  `Expiry_Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certification_report`
--

INSERT INTO `certification_report` (`Reg_Id`, `Certificate_Name`, `Item_Code`, `Item_Name`, `Expiry_Date`) VALUES
('REG001', 'PMP', 'ITM005', 'TAPE02', '0000-00-00'),
('REG002', 'PMP', 'ITM005', 'TAPE02', '1899-11-29');

-- --------------------------------------------------------

--
-- Table structure for table `customer_data`
--

CREATE TABLE `customer_data` (
  `Customer_ID` varchar(10) NOT NULL,
  `Name` varchar(25) DEFAULT NULL,
  `Email` varchar(25) DEFAULT NULL,
  `Phone` varchar(10) DEFAULT NULL,
  `Address` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_data`
--

INSERT INTO `customer_data` (`Customer_ID`, `Name`, `Email`, `Phone`, `Address`) VALUES
('CUST001', 'Heshan Deemantha', 'heshan@example.com', '2147483647', 123);

-- --------------------------------------------------------

--
-- Table structure for table `customer_invoice_data`
--

CREATE TABLE `customer_invoice_data` (
  `In_No` varchar(10) NOT NULL,
  `Customer_Id` varchar(15) DEFAULT NULL,
  `Customer_Name` varchar(15) DEFAULT NULL,
  `Created_Date` date NOT NULL,
  `Item_Code` varchar(15) DEFAULT NULL,
  `Item_Name` varchar(15) DEFAULT NULL,
  `Pack_Size` int(11) DEFAULT NULL,
  `Unit_Price` double DEFAULT NULL,
  `Total_Amount` double DEFAULT NULL,
  `User_ID` varchar(11) DEFAULT NULL,
  `User_Name` varchar(25) DEFAULT NULL,
  `Customer_Address` varchar(100) DEFAULT NULL,
  `User_Address` varchar(100) DEFAULT NULL,
  `User_Phone` int(11) DEFAULT NULL,
  `Fax` int(11) DEFAULT NULL,
  `SR_No` int(11) DEFAULT NULL,
  `MF_Date` date NOT NULL,
  `Ex_Date` date NOT NULL,
  `Batch_No` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deliver_data`
--

CREATE TABLE `deliver_data` (
  `Deliver_Id` varchar(10) NOT NULL,
  `So_Id` varchar(10) DEFAULT NULL,
  `Item_Code` varchar(10) DEFAULT NULL,
  `Item_Name` varchar(25) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Date` date NOT NULL,
  `Status` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deliver_data`
--

INSERT INTO `deliver_data` (`Deliver_Id`, `So_Id`, `Item_Code`, `Item_Name`, `Quantity`, `Date`, `Status`) VALUES
('D001', 'SO001', 'ITM002', 'Tape02', 10, '0000-00-00', 'sent');

-- --------------------------------------------------------

--
-- Table structure for table `expiry_notification_data`
--

CREATE TABLE `expiry_notification_data` (
  `Notification_ID` varchar(10) NOT NULL,
  `Item_Code` varchar(10) DEFAULT NULL,
  `Item_Name` varchar(25) DEFAULT NULL,
  `Quantity` int(11) NOT NULL DEFAULT 0,
  `Expiry_Date` date NOT NULL,
  `Notification_Status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expiry_notification_data`
--

INSERT INTO `expiry_notification_data` (`Notification_ID`, `Item_Code`, `Item_Name`, `Quantity`, `Expiry_Date`, `Notification_Status`) VALUES
('NTF001', 'ITM005', 'Tape02', 25, '2025-08-10', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `good_issues_data`
--

CREATE TABLE `good_issues_data` (
  `Good_Issue_Id` varchar(25) NOT NULL,
  `Item_Code` varchar(10) DEFAULT NULL,
  `Item_Name` varchar(25) DEFAULT NULL,
  `Quantity` int(11) NOT NULL DEFAULT 0,
  `Date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `good_receipts_data`
--

CREATE TABLE `good_receipts_data` (
  `GRN_ID` varchar(10) NOT NULL,
  `Po_Id` varchar(10) DEFAULT NULL,
  `Item_Code` varchar(10) DEFAULT NULL,
  `Item_Name` varchar(25) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Unit_Price` double DEFAULT NULL,
  `Total_Amount` double DEFAULT NULL,
  `MF_Date` date DEFAULT NULL,
  `Status` varchar(25) DEFAULT NULL,
  `Ex_Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `good_receipts_data`
--

INSERT INTO `good_receipts_data` (`GRN_ID`, `Po_Id`, `Item_Code`, `Item_Name`, `Quantity`, `Unit_Price`, `Total_Amount`, `MF_Date`, `Status`, `Ex_Date`) VALUES
('GR001', 'PO001', 'ITM002', NULL, NULL, NULL, NULL, '2022-04-04', 'good condition', '2028-02-18');

-- --------------------------------------------------------

--
-- Table structure for table `item_master_data`
--

CREATE TABLE `item_master_data` (
  `Item_Code` varchar(10) NOT NULL,
  `Item_Name` varchar(25) DEFAULT NULL,
  `Brand` varchar(10) DEFAULT NULL,
  `Size` varchar(10) DEFAULT NULL,
  `Available_Stock` int(10) NOT NULL DEFAULT 0,
  `Price` double NOT NULL DEFAULT 0,
  `Country` varchar(15) DEFAULT NULL,
  `Created_Date` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_master_data`
--

INSERT INTO `item_master_data` (`Item_Code`, `Item_Name`, `Brand`, `Size`, `Available_Stock`, `Price`, `Country`, `Created_Date`) VALUES
('ITM0003', 'Women\'s T-Shirt', 'Nike', 'L', 150, 2999.99, 'India', '2025-07-25'),
('ITM005', 'Tape02', 'Hero', '18*15', 100, 2500.25, 'Argentina', '2025-07-25');

-- --------------------------------------------------------

--
-- Table structure for table `item_movement_report`
--

CREATE TABLE `item_movement_report` (
  `Report_Id` varchar(10) NOT NULL,
  `Item_Code` varchar(10) DEFAULT NULL,
  `Deliver_Id` varchar(25) DEFAULT NULL,
  `Item_Name` varchar(100) DEFAULT NULL,
  `Total_Movement` int(11) DEFAULT NULL,
  `Last_Movement_Date` date DEFAULT NULL,
  `Days_Since_Movement` int(11) DEFAULT NULL,
  `Category` enum('Fast','Slow') DEFAULT NULL,
  `Report_Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_movement_report`
--

INSERT INTO `item_movement_report` (`Report_Id`, `Item_Code`, `Deliver_Id`, `Item_Name`, `Total_Movement`, `Last_Movement_Date`, `Days_Since_Movement`, `Category`, `Report_Date`) VALUES
('RPT001', 'ITM005', 'D001', 'TAPE02', 100, '2024-07-20', 5, 'Fast', '2024-07-25');

-- --------------------------------------------------------

--
-- Table structure for table `low_stock_notification_data`
--

CREATE TABLE `low_stock_notification_data` (
  `Notification_Id` varchar(11) NOT NULL,
  `Item_Code` varchar(25) NOT NULL,
  `Item_Name` varchar(25) DEFAULT NULL,
  `Current_Qty` int(11) NOT NULL DEFAULT 0,
  `Reorder_level` int(11) DEFAULT NULL,
  `Notification_Status` varchar(100) DEFAULT NULL,
  `Notification_Date` date NOT NULL,
  `Email` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order`
--

CREATE TABLE `purchase_order` (
  `Po_Id` varchar(10) NOT NULL,
  `Created_Date` date NOT NULL,
  `Location` varchar(15) DEFAULT NULL,
  `Supplier_Id` varchar(10) DEFAULT NULL,
  `Supplier_Name` varchar(15) DEFAULT NULL,
  `Item_Code` varchar(10) DEFAULT NULL,
  `Item_Name` varchar(15) DEFAULT NULL,
  `Price` double DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `DisValue` double DEFAULT NULL,
  `TotValue` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_order`
--

INSERT INTO `purchase_order` (`Po_Id`, `Created_Date`, `Location`, `Supplier_Id`, `Supplier_Name`, `Item_Code`, `Item_Name`, `Price`, `Quantity`, `DisValue`, `TotValue`) VALUES
('PO20250719', '2025-07-19', 'Colombo Warehou', 'SUP001', 'ABC Trading Co.', 'ITM001', 'Premium Basmati', 450, 100, 0, 45000);

-- --------------------------------------------------------

--
-- Table structure for table `quatation_data`
--

CREATE TABLE `quatation_data` (
  `Quatation_Id` varchar(10) NOT NULL,
  `Customer_Id` varchar(15) DEFAULT NULL,
  `Customer_Name` varchar(25) DEFAULT NULL,
  `Date_Created` date NOT NULL,
  `Valid_Until` date NOT NULL,
  `Status` varchar(100) NOT NULL,
  `Total_Amount` double NOT NULL,
  `Discount` double NOT NULL,
  `Grand_Total` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `return_customer_order_data`
--

CREATE TABLE `return_customer_order_data` (
  `return_order_id` varchar(10) NOT NULL,
  `Customer_Id` varchar(10) DEFAULT NULL,
  `Customer_Name` varchar(20) DEFAULT NULL,
  `Status` varchar(100) NOT NULL,
  `return_Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales_order_data`
--

CREATE TABLE `sales_order_data` (
  `So_Id` varchar(10) NOT NULL,
  `Customer_Id` varchar(10) DEFAULT NULL,
  `Customer_Name` varchar(25) DEFAULT NULL,
  `Order_Date` date NOT NULL,
  `Order_Status` varchar(100) DEFAULT NULL,
  `Delivery_Date` date DEFAULT NULL,
  `Payment_Status` varchar(10) DEFAULT NULL,
  `Total_Qty` int(11) DEFAULT NULL,
  `Discount` double DEFAULT NULL,
  `Total_Amount` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier_data`
--

CREATE TABLE `supplier_data` (
  `Supplier_Id` varchar(10) NOT NULL,
  `Supplier_Name` varchar(25) DEFAULT NULL,
  `Country` varchar(15) DEFAULT NULL,
  `Email` varchar(25) DEFAULT NULL,
  `Phone` int(11) DEFAULT NULL,
  `Address` varchar(100) DEFAULT NULL,
  `Status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplier_data`
--

INSERT INTO `supplier_data` (`Supplier_Id`, `Supplier_Name`, `Country`, `Email`, `Phone`, `Address`, `Status`) VALUES
('SUP001', 'Heshan', 'Sri lanka', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `supplier_invoice_data`
--

CREATE TABLE `supplier_invoice_data` (
  `In_No` varchar(25) NOT NULL,
  `Po_Id` varchar(10) DEFAULT NULL,
  `Supplier_ID` varchar(25) DEFAULT NULL,
  `Supplier_Name` varchar(25) DEFAULT NULL,
  `Date` date NOT NULL,
  `Item_Code` varchar(15) DEFAULT NULL,
  `Item_Name` int(11) NOT NULL,
  `Pack_Size` int(11) DEFAULT NULL,
  `Total_Amount` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_data`
--

CREATE TABLE `user_data` (
  `User_ID` varchar(10) NOT NULL,
  `Name` varchar(25) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Password` varchar(10) NOT NULL DEFAULT '1234',
  `Profile_Picture` varchar(10000) DEFAULT NULL,
  `User_Address` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_data`
--

INSERT INTO `user_data` (`User_ID`, `Name`, `Email`, `Password`, `Profile_Picture`, `User_Address`) VALUES
('USR002', 'ffgghhjjkl', 'heshandeemantha99@gmail.com', '$2b$10$Pnd', 'https://example.com/images/profile/heshan.jpg', NULL),
('USR003', 'mnbvcxz', '1122', '$2b$10$7Er', 'https://example.com/images/profile/heshan.jpg', NULL),
('USR004', 'Heshan Deemantha', 'heshan@example.com', '$2b$10$f0J', 'https://example.com/images/profile/usr002.jpg', '123, Main Street, Colombo, Sri Lanka');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `certification_expiry_notification`
--
ALTER TABLE `certification_expiry_notification`
  ADD PRIMARY KEY (`Notification_ID`),
  ADD UNIQUE KEY `Cerificate_Id` (`Reg_Id`(10)),
  ADD KEY `Reg_Id` (`Reg_Id`);

--
-- Indexes for table `certification_report`
--
ALTER TABLE `certification_report`
  ADD PRIMARY KEY (`Reg_Id`),
  ADD KEY `Item_Code` (`Item_Code`);

--
-- Indexes for table `customer_data`
--
ALTER TABLE `customer_data`
  ADD PRIMARY KEY (`Customer_ID`);

--
-- Indexes for table `customer_invoice_data`
--
ALTER TABLE `customer_invoice_data`
  ADD PRIMARY KEY (`In_No`),
  ADD UNIQUE KEY `User_ID` (`User_ID`),
  ADD KEY `fk_customer` (`Customer_Id`),
  ADD KEY `fk_item` (`Item_Code`);

--
-- Indexes for table `deliver_data`
--
ALTER TABLE `deliver_data`
  ADD PRIMARY KEY (`Deliver_Id`);

--
-- Indexes for table `expiry_notification_data`
--
ALTER TABLE `expiry_notification_data`
  ADD PRIMARY KEY (`Notification_ID`),
  ADD KEY `Item_Code` (`Item_Code`);

--
-- Indexes for table `good_issues_data`
--
ALTER TABLE `good_issues_data`
  ADD PRIMARY KEY (`Good_Issue_Id`(10)),
  ADD KEY `Item_Code` (`Item_Code`);

--
-- Indexes for table `good_receipts_data`
--
ALTER TABLE `good_receipts_data`
  ADD PRIMARY KEY (`GRN_ID`),
  ADD UNIQUE KEY `Po_Id` (`Po_Id`) USING BTREE,
  ADD UNIQUE KEY `Item_Code` (`Item_Code`);

--
-- Indexes for table `item_master_data`
--
ALTER TABLE `item_master_data`
  ADD PRIMARY KEY (`Item_Code`);

--
-- Indexes for table `item_movement_report`
--
ALTER TABLE `item_movement_report`
  ADD PRIMARY KEY (`Report_Id`),
  ADD KEY `Item_Code` (`Item_Code`),
  ADD KEY `fk_deliver_id` (`Deliver_Id`);

--
-- Indexes for table `low_stock_notification_data`
--
ALTER TABLE `low_stock_notification_data`
  ADD PRIMARY KEY (`Notification_Id`),
  ADD KEY `Item_Code` (`Item_Code`);

--
-- Indexes for table `purchase_order`
--
ALTER TABLE `purchase_order`
  ADD PRIMARY KEY (`Po_Id`),
  ADD UNIQUE KEY `Item_Code` (`Item_Code`),
  ADD KEY `Supplier_Id` (`Supplier_Id`);

--
-- Indexes for table `quatation_data`
--
ALTER TABLE `quatation_data`
  ADD PRIMARY KEY (`Quatation_Id`),
  ADD KEY `fk_Customer_Id` (`Customer_Id`);

--
-- Indexes for table `return_customer_order_data`
--
ALTER TABLE `return_customer_order_data`
  ADD PRIMARY KEY (`return_order_id`),
  ADD UNIQUE KEY `return_order_id` (`return_order_id`),
  ADD UNIQUE KEY `return_order_id_2` (`return_order_id`),
  ADD KEY `Customer_Id` (`Customer_Id`);

--
-- Indexes for table `sales_order_data`
--
ALTER TABLE `sales_order_data`
  ADD PRIMARY KEY (`So_Id`),
  ADD KEY `Customer_Id` (`Customer_Id`);

--
-- Indexes for table `supplier_data`
--
ALTER TABLE `supplier_data`
  ADD PRIMARY KEY (`Supplier_Id`);

--
-- Indexes for table `supplier_invoice_data`
--
ALTER TABLE `supplier_invoice_data`
  ADD PRIMARY KEY (`In_No`(10)),
  ADD KEY `Supplier_ID` (`Supplier_ID`),
  ADD KEY `Item_Code` (`Item_Code`);

--
-- Indexes for table `user_data`
--
ALTER TABLE `user_data`
  ADD PRIMARY KEY (`User_ID`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `certification_expiry_notification`
--
ALTER TABLE `certification_expiry_notification`
  ADD CONSTRAINT `certification_expiry_notification_ibfk_1` FOREIGN KEY (`Reg_Id`) REFERENCES `certification_report` (`Reg_Id`);

--
-- Constraints for table `certification_report`
--
ALTER TABLE `certification_report`
  ADD CONSTRAINT `certification_report_ibfk_1` FOREIGN KEY (`Item_Code`) REFERENCES `item_master_data` (`Item_Code`);

--
-- Constraints for table `customer_invoice_data`
--
ALTER TABLE `customer_invoice_data`
  ADD CONSTRAINT `customer_invoice_data_ibfk_1` FOREIGN KEY (`Customer_Id`) REFERENCES `customer_data` (`Customer_ID`),
  ADD CONSTRAINT `customer_invoice_data_ibfk_2` FOREIGN KEY (`Item_Code`) REFERENCES `item_master_data` (`Item_Code`),
  ADD CONSTRAINT `fk_customer` FOREIGN KEY (`Customer_Id`) REFERENCES `customer_data` (`Customer_ID`),
  ADD CONSTRAINT `fk_item` FOREIGN KEY (`Item_Code`) REFERENCES `item_master_data` (`Item_Code`),
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`User_ID`) REFERENCES `user_data` (`User_ID`);

--
-- Constraints for table `expiry_notification_data`
--
ALTER TABLE `expiry_notification_data`
  ADD CONSTRAINT `expiry_notification_data_ibfk_1` FOREIGN KEY (`Item_Code`) REFERENCES `item_master_data` (`Item_Code`);

--
-- Constraints for table `good_issues_data`
--
ALTER TABLE `good_issues_data`
  ADD CONSTRAINT `good_issues_data_ibfk_1` FOREIGN KEY (`Item_Code`) REFERENCES `item_master_data` (`Item_Code`);

--
-- Constraints for table `item_movement_report`
--
ALTER TABLE `item_movement_report`
  ADD CONSTRAINT `fk_deliver_id` FOREIGN KEY (`Deliver_Id`) REFERENCES `deliver_data` (`Deliver_Id`),
  ADD CONSTRAINT `item_movement_report_ibfk_1` FOREIGN KEY (`Item_Code`) REFERENCES `item_master_data` (`Item_Code`);

--
-- Constraints for table `low_stock_notification_data`
--
ALTER TABLE `low_stock_notification_data`
  ADD CONSTRAINT `low_stock_notification_data_ibfk_1` FOREIGN KEY (`Item_Code`) REFERENCES `item_master_data` (`Item_Code`);

--
-- Constraints for table `purchase_order`
--
ALTER TABLE `purchase_order`
  ADD CONSTRAINT `purchase_order_ibfk_1` FOREIGN KEY (`Supplier_Id`) REFERENCES `supplier_data` (`Supplier_Id`);

--
-- Constraints for table `quatation_data`
--
ALTER TABLE `quatation_data`
  ADD CONSTRAINT `fk_Customer_Id` FOREIGN KEY (`Customer_Id`) REFERENCES `customer_data` (`Customer_ID`);

--
-- Constraints for table `return_customer_order_data`
--
ALTER TABLE `return_customer_order_data`
  ADD CONSTRAINT `return_customer_order_data_ibfk_1` FOREIGN KEY (`Customer_Id`) REFERENCES `customer_data` (`Customer_ID`);

--
-- Constraints for table `sales_order_data`
--
ALTER TABLE `sales_order_data`
  ADD CONSTRAINT `sales_order_data_ibfk_1` FOREIGN KEY (`Customer_Id`) REFERENCES `customer_data` (`Customer_ID`);

--
-- Constraints for table `supplier_invoice_data`
--
ALTER TABLE `supplier_invoice_data`
  ADD CONSTRAINT `supplier_invoice_data_ibfk_1` FOREIGN KEY (`Supplier_ID`) REFERENCES `supplier_data` (`Supplier_Id`),
  ADD CONSTRAINT `supplier_invoice_data_ibfk_2` FOREIGN KEY (`Item_Code`) REFERENCES `item_master_data` (`Item_Code`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
