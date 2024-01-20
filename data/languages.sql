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

-- Dumping structure for table regions.languages
CREATE TABLE IF NOT EXISTS `languages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `code` varchar(20) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table regions.languages: ~100 rows (approximately)
INSERT INTO `languages` (`id`, `name`, `code`) VALUES
	(1, 'Abkhazian', 'ab'),
	(2, 'Afrikaans', 'af'),
	(3, 'Arabic', 'ar'),
	(4, 'Azerbaijani', 'az'),
	(5, 'Belarusian', 'be'),
	(6, 'Bulgarian', 'bg'),
	(7, 'Bengali', 'bn'),
	(8, 'Tibetan', 'bo'),
	(9, 'Breton', 'br'),
	(10, 'Catalan, Valencian', 'ca'),
	(11, 'Cebuano', 'ceb'),
	(12, 'Czech', 'cs'),
	(13, 'Welsh', 'cy'),
	(14, 'Danish', 'da'),
	(15, 'German', 'de'),
	(16, 'Modern Greek', 'el'),
	(17, 'English', 'en'),
	(18, 'Esperanto', 'eo'),
	(19, 'Spanish, Castilian', 'es'),
	(20, 'Estonian', 'et'),
	(21, 'Basque', 'eu'),
	(22, 'Persian', 'fa'),
	(23, 'Finnish', 'fi'),
	(24, 'Faroese', 'fo'),
	(25, 'French', 'fr'),
	(26, 'Western Frisian', 'fy'),
	(27, 'Scottish Gaelic, Gaelic', 'gd'),
	(28, 'Galician', 'gl'),
	(29, 'Gujarati', 'gu'),
	(30, 'Hausa', 'ha'),
	(31, 'Hawaiian', 'haw'),
	(32, 'Hebrew', 'he'),
	(33, 'Hindi', 'hi'),
	(34, 'Croatian', 'hr'),
	(35, 'Hungarian', 'hu'),
	(36, 'Armenian', 'hy'),
	(37, 'Indonesian', 'id'),
	(38, 'Icelandic', 'is'),
	(39, 'Italian', 'it'),
	(40, 'Japanese', 'ja'),
	(41, 'Georgian', 'ka'),
	(42, 'Kazakh', 'kk'),
	(43, 'Central Khmer', 'km'),
	(44, 'Kannada', 'kn'),
	(45, 'Korean', 'ko'),
	(46, 'Kurdish', 'ku'),
	(47, 'Kirghiz, Kyrgyz', 'ky'),
	(48, 'Latin', 'la'),
	(49, 'Lao', 'lo'),
	(50, 'Lithuanian', 'lt'),
	(51, 'Latvian', 'lv'),
	(52, 'Malagasy', 'mg'),
	(53, 'Macedonian', 'mk'),
	(54, 'Malayalam', 'ml'),
	(55, 'Mongolian', 'mn'),
	(56, 'Marathi', 'mr'),
	(57, 'Malay (macrolanguage)', 'ms'),
	(58, 'North Ndebele', 'nd'),
	(59, 'Nepali', 'ne'),
	(60, 'Dutch, Flemish', 'nl'),
	(61, 'Norwegian Nynorsk', 'nn'),
	(62, 'Norwegian', 'no'),
	(63, 'Pedi, Northern Sotho, Sepedi', 'nso'),
	(64, 'Oriya', 'or'),
	(65, 'Panjabi, Punjabi', 'pa'),
	(66, 'Polish', 'pl'),
	(67, 'Pushto, Pashto', 'ps'),
	(68, 'Portuguese', 'pt'),
	(69, 'Portuguese (Brazil)', 'pt-BR'),
	(70, 'Portuguese (Portugal)', 'pt-PT'),
	(71, 'Romanian, Moldavian, Moldovan', 'ro'),
	(72, 'Russian', 'ru'),
	(73, 'Sanskrit', 'sa'),
	(74, 'Serbo-Croatian', 'sh'),
	(75, 'Sinhala, Sinhalese', 'si'),
	(76, 'Slovak', 'sk'),
	(77, 'Slovenian, Slovene', 'sl'),
	(78, 'Somali', 'so'),
	(79, 'Albanian', 'sq'),
	(80, 'Serbian', 'sr'),
	(81, 'Swedish', 'sv'),
	(82, 'Swahili (macrolanguage)', 'sw'),
	(83, 'Tamil', 'ta'),
	(84, 'Telugu', 'te'),
	(85, 'Thai', 'th'),
	(86, 'Tagalog', 'tl'),
	(87, 'Klingon, tlhIngan-Hol', 'tlh'),
	(88, 'Tswana, Setswana', 'tn'),
	(89, 'Turkish', 'tr'),
	(90, 'Tsonga', 'ts'),
	(91, 'Twi', 'tw'),
	(92, 'Ukrainian', 'uk'),
	(93, 'Urdu', 'ur'),
	(94, 'Uzbek', 'uz'),
	(95, 'Venda', 've'),
	(96, 'Vietnamese', 'vi'),
	(97, 'Xhosa', 'xh'),
	(98, 'Chinese', 'zh'),
	(99, 'Chinese (Taiwan)', 'zh-TW'),
	(100, 'Zulu', 'zu');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
