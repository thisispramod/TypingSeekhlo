-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 14, 2026 at 01:23 PM
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
(1, 'admin', '$2b$10$C8OG7w2j3bjHMIaW/uThfeNpDeO6eH7qULbUDgul6xUaw6D1/4ZI6', '2026-01-10 12:02:47');

-- --------------------------------------------------------

--
-- Table structure for table `custom_paragraphs`
--

CREATE TABLE `custom_paragraphs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `custom_paragraphs`
--

INSERT INTO `custom_paragraphs` (`id`, `user_id`, `title`, `content`, `created_at`) VALUES
(1, 1, 'Ramp', 'a part of a piece of writing that consists of one or more sentences. A paragraph always starts on a new line', '2026-01-14 11:34:22'),
(2, 2, 'Role', 'A paragraph is defined as “a group of sentences or a single sentence that forms a unit” (Lunsford and Connors 116). Length and appearance do not determine whether a section in a paper is a paragraph. For instance, in some styles of writing, particularly journalistic styles, a paragraph can be just one sentence long.', '2026-01-14 11:37:02'),
(3, 3, 'Para 1', 'especially in academic or formal writing where 100-200 words (about 6-8 sentences) is a common guideline, focusing on a single idea; however, paragraphs aren\'t strictly defined by word count but by the concept they contain, so it could be shorter or longer, depending on context like web content or storytelling', '2026-01-14 11:55:59');

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

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `created_at`) VALUES
(1, 'user', 'user@gmail.com', '$2b$10$d7RKJHI0XdTUONn7to97/u4tEIhCJyy30P7gT3vKHqc4emDLK7aVi', '2026-01-14 11:33:36'),
(2, 'deepesh', 'deepesh@gmail.com', '$2b$10$ZBHFlLWTJBtW9eNy6mtxbef9Xtr00YQqSk9Wd9/i6G6ND9cPtOlDK', '2026-01-14 11:36:27'),
(3, 'rohit', 'rohit@gmail.com', '$2b$10$8d4S1VcCQMiNXXocBdVS4uFkCkLGm.gVhZwucppKSXUf4zFUxZDT2', '2026-01-14 11:55:12');

-- --------------------------------------------------------

--
-- Table structure for table `user_reports`
--

CREATE TABLE `user_reports` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `wpm` int(11) NOT NULL,
  `accuracy` decimal(5,2) NOT NULL,
  `errors` int(11) DEFAULT 0,
  `duration` int(11) DEFAULT NULL,
  `test_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `source` enum('default','custom') DEFAULT 'default'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_reports`
--

INSERT INTO `user_reports` (`id`, `user_id`, `wpm`, `accuracy`, `errors`, `duration`, `test_date`, `source`) VALUES
(1, 1, 42, '83.30', 18, 60, '2026-01-14 11:34:54', 'custom'),
(2, 1, 34, '80.60', 21, 60, '2026-01-14 11:35:35', 'custom'),
(3, 2, 37, '92.80', 14, 60, '2026-01-14 11:38:14', 'custom');

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
-- Indexes for table `custom_paragraphs`
--
ALTER TABLE `custom_paragraphs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

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
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_reports`
--
ALTER TABLE `user_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `custom_paragraphs`
--
ALTER TABLE `custom_paragraphs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_reports`
--
ALTER TABLE `user_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `custom_paragraphs`
--
ALTER TABLE `custom_paragraphs`
  ADD CONSTRAINT `custom_paragraphs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_reports`
--
ALTER TABLE `user_reports`
  ADD CONSTRAINT `user_reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
