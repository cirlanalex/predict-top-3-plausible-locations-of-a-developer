-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               11.2.2-MariaDB-1:11.2.2+maria~ubu2204 - mariadb.org binary distribution
-- Server OS:                    debian-linux-gnu
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table regions.timezones
CREATE TABLE IF NOT EXISTS `timezones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `start` int(11) NOT NULL,
  `end` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table regions.timezones: ~38 rows (approximately)
INSERT INTO `timezones` (`id`, `name`, `start`, `end`) VALUES
	(1, 'UTC -12:00', 20, 4),
	(2, 'UTC -11:00', 21, 5),
	(3, 'UTC -10:00', 22, 6),
	(4, 'UTC -09:30', 23, 7),
	(5, 'UTC -09:00', 23, 7),
	(6, 'UTC -08:00', 0, 8),
	(7, 'UTC -07:00', 1, 9),
	(8, 'UTC -06:00', 2, 10),
	(9, 'UTC -05:00', 3, 11),
	(10, 'UTC -04:00', 4, 12),
	(11, 'UTC -03:30', 5, 13),
	(12, 'UTC -03:00', 5, 13),
	(13, 'UTC -02:00', 6, 14),
	(14, 'UTC -01:00', 7, 15),
	(15, 'UTC +00:00', 8, 16),
	(16, 'UTC +01:00', 9, 17),
	(17, 'UTC +02:00', 10, 18),
	(18, 'UTC +03:00', 11, 19),
	(19, 'UTC +03:30', 12, 20),
	(20, 'UTC +04:00', 12, 20),
	(21, 'UTC +04:30', 13, 21),
	(22, 'UTC +05:00', 13, 21),
	(23, 'UTC +05:30', 14, 22),
	(24, 'UTC +05:45', 14, 22),
	(25, 'UTC +06:00', 14, 22),
	(26, 'UTC +06:30', 15, 23),
	(27, 'UTC +07:00', 15, 23),
	(28, 'UTC +08:00', 16, 0),
	(29, 'UTC +08:45', 17, 1),
	(30, 'UTC +09:00', 17, 1),
	(31, 'UTC +09:30', 18, 2),
	(32, 'UTC +10:00', 18, 2),
	(33, 'UTC +10:30', 19, 3),
	(34, 'UTC +11:00', 19, 3),
	(35, 'UTC +12:00', 20, 4),
	(36, 'UTC +12:45', 21, 5),
	(37, 'UTC +13:00', 21, 5),
	(38, 'UTC +14:00', 22, 6);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
