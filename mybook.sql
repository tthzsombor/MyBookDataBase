-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 19, 2024 at 01:07 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mybook`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `bookname` varchar(191) NOT NULL,
  `release` int(11) NOT NULL,
  `writer` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `bookname`, `release`, `writer`) VALUES
(1, 'Bűn és Bűnhődés', 1866, 'Fjodor Mihajlovics Dosztojevszkij'),
(2, 'Fehér Éjszakák', 1848, 'Fjodor Mihajlovics Dosztojevszkij'),
(3, 'Ördögök', 1872, 'Fjodor Mihajlovics Dosztojevszkij'),
(4, 'A Karamazov testvérek', 1880, 'Fjodor Mihajlovics Dosztojevszkij'),
(5, 'A játékos', 1866, 'Fjodor Mihajlovics Dosztojevszkij'),
(6, 'Feljegyzések az egérlyukból', 1864, 'Fjodor Mihajlovics Dosztojevszkij'),
(7, 'Közöny', 1942, 'Albert Camus'),
(8, 'Pestis', 1947, 'Albert Camus'),
(9, 'Sziszüphosz Mítosza', 1942, 'Albert Camus'),
(10, 'Ház a Sziklán', 1932, 'Agatha Christie'),
(11, 'Gyilkosság az Orient expresszen', 1934, 'Agatha Christie'),
(12, 'Halál a Níluson', 1937, 'Agatha Christie'),
(13, 'Az Ackroyd-gyilkosság', 1926, 'Agatha Christie'),
(14, 'Halloween és halál', 1969, 'Agatha Christie'),
(15, 'A titokzatos stylesi eset', 1920, 'Agatha Christie'),
(16, 'Az ABC gyilkosságok', 1936, 'Agatha Christie'),
(17, 'A ferde ház', 1949, 'Agatha Christie'),
(18, 'Öt kismalac', 1942, 'Agatha Christie'),
(19, 'Örök éj', 1967, 'Agatha Christie'),
(20, 'Holttest a könyvtárszobában', 1942, 'Agatha Christie'),
(21, 'Gyilkosság meghirdetve', 1950, 'Agatha Christie'),
(22, 'Szunnyadó gyilkosság', 1976, 'Agatha Christie'),
(23, 'Bűbájos gyilkosok', 1961, 'Agatha Christie'),
(24, 'Hétvégi gyilkosság', 1946, 'Agatha Christie'),
(25, 'Nyaraló gyilkosok', 1941, 'Agatha Christie'),
(26, 'Gyilkosság a golfpályán', 1923, 'Agatha Christie'),
(27, 'Nyílt kártyákkal', 1936, 'Agatha Christie'),
(28, 'Gyilkosság a paplakban', 1930, 'Agatha Christie'),
(29, 'A kutya se látta', 1937, 'Agatha Christie'),
(30, 'A titokzatos kék vonat', 1928, 'Agatha Christie'),
(31, 'Az', 1986, 'Stephen King'),
(32, 'Ragyogás', 1977, 'Stephen King'),
(33, 'Tortúra', 1987, 'Stephen King'),
(34, 'Carrie', 1974, 'Stephen King'),
(35, 'Végítélet', 1978, 'Stephen King'),
(36, 'Állattemető', 1983, 'Stephen King'),
(37, 'A köd', 1980, 'Stephen King'),
(38, 'Mumus', 1980, 'Stephen King');

-- --------------------------------------------------------

--
-- Table structure for table `genres`
--

CREATE TABLE `genres` (
  `id` int(11) NOT NULL,
  `genrename` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `genres`
--

INSERT INTO `genres` (`id`, `genrename`) VALUES
(18, 'Abszurdizmus'),
(17, 'Egzisztencializmus'),
(12, 'Életrajz'),
(1, 'Fantasy'),
(8, 'Filozófia'),
(3, 'Horror'),
(7, 'Kaland'),
(5, 'Komédia'),
(4, 'Krimi'),
(13, 'Mese'),
(14, 'Novella'),
(6, 'Realizmus'),
(2, 'Romantikus'),
(9, 'Sci-fi'),
(11, 'Szép Irodalom'),
(10, 'Történelem'),
(16, 'Tragédia'),
(15, 'Vers');

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `id` int(11) NOT NULL,
  `statusname` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`id`, `statusname`) VALUES
(1, 'Tervben van'),
(2, 'Kiolvasva'),
(3, 'Most olvasom'),
(4, 'Szüneteltetem'),
(5, 'Abbahagytam');

-- --------------------------------------------------------

--
-- Table structure for table `token`
--

CREATE TABLE `token` (
  `token` varchar(191) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `token`
--

INSERT INTO `token` (`token`, `userId`) VALUES
('6112177164115a7aa32d05bdc484a00b0e694a0a57ed3c36d121f589ccf5e754', 1),
('be849bd760370ba03a7944913d468890414c5bb8e8d735981736dd151da83c90', 1),
('5daa83d29c0fd2e3fb45fc41861607fc28daff5eafe0eb94d2fecf39872ef1f4', 2),
('97ea282d4caf6bdedced102f909cbbc27dcc6065d5c3fdc22e64fc562fbfbc69', 2);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `password`, `role`) VALUES
(1, 'kaka', 'kaka@example.com', '$argon2id$v=19$m=65536,t=3,p=4$NRZmWr+nO4lpX8BwNJmotw$zKvzH9BX3sKhuf6THbrXbd4OhG7O1FM5PN3RYhm6RyY', 'user'),
(2, 'asder', 'asd@example.com', '$argon2id$v=19$m=65536,t=3,p=4$nzNka7adf5p5q+igAfPQYg$YubVAjWhmE7Vsyu2SEpv54kFq+5TycBaA1+18UQszmM', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `userbook`
--

CREATE TABLE `userbook` (
  `id` int(11) NOT NULL,
  `statusid` int(11) NOT NULL,
  `bookid` int(11) NOT NULL,
  `userid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `userbook`
--

INSERT INTO `userbook` (`id`, `statusid`, `bookid`, `userid`) VALUES
(1, 1, 1, 1),
(2, 1, 2, 1),
(3, 3, 3, 1),
(4, 2, 4, 1),
(5, 3, 5, 1),
(6, 3, 1, 2),
(7, 4, 3, 2),
(8, 5, 4, 2),
(9, 3, 8, 2);

-- --------------------------------------------------------

--
-- Table structure for table `_bookstogenres`
--

CREATE TABLE `_bookstogenres` (
  `A` int(11) NOT NULL,
  `B` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_bookstogenres`
--

INSERT INTO `_bookstogenres` (`A`, `B`) VALUES
(1, 6),
(2, 2),
(3, 6),
(4, 6),
(5, 6),
(6, 6),
(7, 17),
(8, 17),
(9, 18),
(10, 4),
(11, 4),
(12, 4),
(13, 4),
(14, 4),
(15, 4),
(16, 4),
(17, 4),
(18, 4),
(19, 4),
(20, 4),
(21, 4),
(22, 4),
(23, 4),
(24, 4),
(25, 4),
(26, 4),
(27, 4),
(28, 4),
(29, 4),
(30, 4),
(31, 3),
(32, 3),
(33, 3),
(34, 3),
(35, 3),
(36, 3),
(37, 3),
(38, 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `genres`
--
ALTER TABLE `genres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Genres_genrename_key` (`genrename`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`token`),
  ADD KEY `Token_userId_fkey` (`userId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `userbook`
--
ALTER TABLE `userbook`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UserBook_userid_bookid_key` (`userid`,`bookid`),
  ADD KEY `UserBook_statusid_fkey` (`statusid`),
  ADD KEY `UserBook_bookid_fkey` (`bookid`);

--
-- Indexes for table `_bookstogenres`
--
ALTER TABLE `_bookstogenres`
  ADD UNIQUE KEY `_BooksToGenres_AB_unique` (`A`,`B`),
  ADD KEY `_BooksToGenres_B_index` (`B`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `genres`
--
ALTER TABLE `genres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `userbook`
--
ALTER TABLE `userbook`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `token`
--
ALTER TABLE `token`
  ADD CONSTRAINT `Token_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `userbook`
--
ALTER TABLE `userbook`
  ADD CONSTRAINT `UserBook_bookid_fkey` FOREIGN KEY (`bookid`) REFERENCES `books` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `UserBook_statusid_fkey` FOREIGN KEY (`statusid`) REFERENCES `status` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `UserBook_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `_bookstogenres`
--
ALTER TABLE `_bookstogenres`
  ADD CONSTRAINT `_BooksToGenres_A_fkey` FOREIGN KEY (`A`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `_BooksToGenres_B_fkey` FOREIGN KEY (`B`) REFERENCES `genres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
