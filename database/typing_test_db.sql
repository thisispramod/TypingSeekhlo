-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 10, 2026 at 01:46 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.3.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `typing_test_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password_hash`, `created_at`) VALUES
(1, 'admin', '$2b$10$SMoHQ3r2v8mI1evCxKeYo.5JUkCahV1/yAHBfT/9l30FjDwYNzzaO', '2026-01-10 12:02:47');

-- --------------------------------------------------------

--
-- Table structure for table `typing_paragraphs`
--

CREATE TABLE `typing_paragraphs` (
  `id` int(11) NOT NULL,
  `paragraph_text` text NOT NULL,
  `language` enum('english','hindi') NOT NULL,
  `difficulty` enum('easy','medium','hard') DEFAULT 'medium',
  `status` enum('active','disabled') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `typing_paragraphs`
--

INSERT INTO `typing_paragraphs` (`id`, `paragraph_text`, `language`, `difficulty`, `status`, `created_at`) VALUES
(1, 'The quick brown fox jumps over the lazy dog. This is a classic typing test sentence used to practice touch typing skills.', 'english', 'medium', 'active', '2026-01-10 12:02:58'),
(2, 'भारत एक विशाल देश है। यहाँ विभिन्न धर्मों और संस्कृतियों के लोग रहते हैं।', 'hindi', 'medium', 'active', '2026-01-10 12:02:58'),
(3, 'India is a country of rich history, diverse culture, and remarkable unity. It is located in South Asia and is the seventh largest country in the world by land area and the most populous democracy. India is known for its ancient civilization, which has contributed greatly to science, mathematics, medicine, and philosophy. From the Indus Valley Civilization to the modern digital age, India has continuously evolved while preserving its traditions. The country is home to many religions, languages, and communities, making it a unique example of cultural harmony. Indian festivals such as Diwali, Holi, Eid, Christmas, and Gurpurab are celebrated with equal enthusiasm, reflecting the spirit of unity in diversity. Agriculture remains an important part of the Indian economy, while sectors like information technology, space research, and startups are growing rapidly. India has achieved significant progress in education, healthcare, and infrastructure over the past few decades. The Constitution of India guarantees fundamental rights and promotes equality among all citizens. With its young population, democratic values, and technological advancement, India continues to move forward with confidence and determination toward a stronger and more inclusive future.', 'english', 'medium', 'active', '2026-01-10 12:28:15');

-- --------------------------------------------------------

--
-- Table structure for table `typing_results`
--

CREATE TABLE `typing_results` (
  `id` int(11) NOT NULL,
  `wpm` decimal(5,2) DEFAULT NULL,
  `cpm` int(11) DEFAULT NULL,
  `accuracy` decimal(5,2) DEFAULT NULL,
  `correct_chars` int(11) DEFAULT NULL,
  `incorrect_chars` int(11) DEFAULT NULL,
  `language` enum('english','hindi') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `typing_paragraphs`
--
ALTER TABLE `typing_paragraphs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `typing_results`
--
ALTER TABLE `typing_results`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `typing_paragraphs`
--
ALTER TABLE `typing_paragraphs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `typing_results`
--
ALTER TABLE `typing_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
