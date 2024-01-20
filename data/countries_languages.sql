-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               11.2.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
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

-- Dumping structure for table regions.countries_languages
CREATE TABLE IF NOT EXISTS `countries_languages` (
  `id_language` int(11) NOT NULL,
  `id_country` int(11) NOT NULL,
  KEY `FK_countries` (`id_country`) USING BTREE,
  KEY `FK_languages` (`id_language`) USING BTREE,
  CONSTRAINT `FK_countries` FOREIGN KEY (`id_country`) REFERENCES `countries` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_languages` FOREIGN KEY (`id_language`) REFERENCES `languages` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table regions.countries_languages: ~222 rows (approximately)
INSERT INTO `countries_languages` (`id_language`, `id_country`) VALUES
	(2, 123),
	(2, 164),
	(3, 3),
	(3, 13),
	(3, 34),
	(3, 38),
	(3, 48),
	(3, 53),
	(3, 81),
	(3, 87),
	(3, 94),
	(3, 98),
	(3, 101),
	(3, 112),
	(3, 120),
	(3, 129),
	(3, 133),
	(3, 136),
	(3, 144),
	(3, 154),
	(3, 163),
	(3, 167),
	(3, 172),
	(3, 180),
	(3, 186),
	(3, 195),
	(4, 11),
	(5, 16),
	(6, 26),
	(7, 14),
	(8, 36),
	(9, 62),
	(10, 4),
	(10, 165),
	(11, 141),
	(12, 46),
	(13, 187),
	(14, 47),
	(15, 10),
	(15, 17),
	(15, 66),
	(15, 102),
	(15, 104),
	(15, 171),
	(16, 68),
	(19, 7),
	(19, 21),
	(19, 37),
	(19, 41),
	(19, 44),
	(19, 50),
	(19, 52),
	(19, 54),
	(19, 55),
	(19, 70),
	(19, 75),
	(19, 114),
	(19, 128),
	(19, 137),
	(19, 139),
	(19, 165),
	(19, 189),
	(19, 193),
	(20, 57),
	(21, 62),
	(21, 165),
	(22, 1),
	(22, 80),
	(23, 61),
	(24, 47),
	(25, 17),
	(25, 19),
	(25, 27),
	(25, 28),
	(25, 31),
	(25, 32),
	(25, 33),
	(25, 34),
	(25, 38),
	(25, 39),
	(25, 40),
	(25, 48),
	(25, 55),
	(25, 62),
	(25, 63),
	(25, 71),
	(25, 74),
	(25, 104),
	(25, 105),
	(25, 117),
	(25, 129),
	(25, 147),
	(25, 155),
	(25, 157),
	(25, 171),
	(25, 177),
	(25, 191),
	(26, 126),
	(27, 32),
	(27, 187),
	(28, 165),
	(29, 78),
	(30, 129),
	(30, 130),
	(31, 188),
	(32, 83),
	(33, 78),
	(34, 22),
	(34, 43),
	(35, 76),
	(36, 8),
	(37, 79),
	(38, 77),
	(39, 84),
	(39, 152),
	(39, 171),
	(39, 192),
	(40, 86),
	(41, 65),
	(42, 88),
	(43, 30),
	(44, 78),
	(45, 91),
	(45, 92),
	(46, 81),
	(47, 95),
	(48, 192),
	(49, 96),
	(50, 103),
	(51, 97),
	(52, 105),
	(53, 131),
	(54, 78),
	(55, 118),
	(56, 78),
	(57, 25),
	(57, 79),
	(57, 107),
	(57, 159),
	(58, 197),
	(59, 125),
	(60, 17),
	(60, 126),
	(60, 169),
	(61, 132),
	(62, 132),
	(63, 99),
	(63, 164),
	(63, 197),
	(64, 78),
	(65, 78),
	(65, 134),
	(66, 142),
	(67, 1),
	(68, 5),
	(68, 24),
	(68, 29),
	(68, 51),
	(68, 55),
	(68, 72),
	(68, 121),
	(68, 143),
	(68, 153),
	(69, 24),
	(70, 143),
	(71, 116),
	(71, 145),
	(72, 16),
	(72, 88),
	(72, 95),
	(72, 146),
	(73, 78),
	(74, 22),
	(74, 43),
	(74, 93),
	(74, 119),
	(74, 156),
	(75, 166),
	(76, 46),
	(76, 160),
	(77, 43),
	(77, 161),
	(78, 59),
	(78, 163),
	(79, 2),
	(79, 93),
	(79, 131),
	(80, 22),
	(80, 93),
	(80, 156),
	(81, 61),
	(81, 170),
	(82, 39),
	(82, 89),
	(82, 147),
	(82, 175),
	(82, 184),
	(83, 159),
	(83, 166),
	(84, 78),
	(85, 176),
	(86, 141),
	(88, 23),
	(88, 164),
	(88, 197),
	(89, 181),
	(90, 164),
	(91, 67),
	(92, 185),
	(93, 78),
	(93, 134),
	(94, 190),
	(95, 164),
	(95, 197),
	(96, 194),
	(97, 164),
	(97, 197),
	(98, 36),
	(98, 159),
	(98, 173),
	(99, 173),
	(100, 164);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
