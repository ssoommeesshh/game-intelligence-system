-- =====================================================================
-- GAME INTELLIGENCE & MARKET ANALYTICS PLATFORM
-- Authoritative Seed Data (MySQL 8.0)
-- 10+ Records per table matching course evaluation criteria
-- Author: Sreejith
-- =====================================================================

USE `game_intelligence_db`;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `PRICE_AUDIT_LOG`;
TRUNCATE TABLE `PRICE_HISTORY`;
TRUNCATE TABLE `WISHLIST_GAME`;
TRUNCATE TABLE `WISHLIST`;
TRUNCATE TABLE `GAME_PLATFORM`;
TRUNCATE TABLE `GAME_TAG`;
TRUNCATE TABLE `GAME_GENRE`;
TRUNCATE TABLE `GAME_DEVELOPER`;
TRUNCATE TABLE `GAME`;
TRUNCATE TABLE `STORE`;
TRUNCATE TABLE `PLATFORM`;
TRUNCATE TABLE `TAG`;
TRUNCATE TABLE `GENRE`;
TRUNCATE TABLE `DEVELOPER`;
TRUNCATE TABLE `PUBLISHER`;
TRUNCATE TABLE `USER`;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- 1. PUBLISHER (10+ records)
-- ---------------------------------------------------------------------
INSERT INTO `PUBLISHER` (`publisher_id`, `name`, `country`, `website`) VALUES
('pub-001', 'CD PROJEKT', 'Poland', 'https://cdprojekt.com'),
('pub-002', 'Bandai Namco Entertainment', 'Japan', 'https://bandainamcoent.com'),
('pub-003', 'Rockstar Games', 'United States', 'https://rockstargames.com'),
('pub-004', 'Larian Studios', 'Belgium', 'https://larian.com'),
('pub-005', 'Supergiant Games', 'United States', 'https://supergiantgames.com'),
('pub-006', 'Team Cherry', 'Australia', 'https://teamcherry.com.au'),
('pub-007', 'Valve', 'United States', 'https://valvesoftware.com'),
('pub-008', 'PlayStation Publishing', 'United States', 'https://playstation.com'),
('pub-009', 'ConcernedApe', 'United States', 'https://stardewvalley.net'),
('pub-010', 'Capcom', 'Japan', 'https://capcom.com'),
('pub-011', 'Electronic Arts', 'United States', 'https://ea.com');

-- ---------------------------------------------------------------------
-- 2. DEVELOPER (10+ records)
-- ---------------------------------------------------------------------
INSERT INTO `DEVELOPER` (`developer_id`, `name`, `country`, `website`) VALUES
('dev-001', 'CD PROJEKT RED', 'Poland', 'https://cdprojektred.com'),
('dev-002', 'FromSoftware Inc.', 'Japan', 'https://fromsoftware.jp'),
('dev-003', 'Rockstar Studios', 'United States', 'https://rockstargames.com'),
('dev-004', 'Larian Studios', 'Belgium', 'https://larian.com'),
('dev-005', 'Supergiant Games', 'United States', 'https://supergiantgames.com'),
('dev-006', 'Team Cherry', 'Australia', 'https://teamcherry.com.au'),
('dev-007', 'Valve', 'United States', 'https://valvesoftware.com'),
('dev-008', 'Santa Monica Studio', 'United States', 'https://sms.playstation.com'),
('dev-009', 'ConcernedApe', 'United States', 'https://stardewvalley.net'),
('dev-010', 'Capcom Dev Division', 'Japan', 'https://capcom.com'),
('dev-011', 'Respawn Entertainment', 'United States', 'https://respawn.com');

-- ---------------------------------------------------------------------
-- 3. GENRE (10+ records)
-- ---------------------------------------------------------------------
INSERT INTO `GENRE` (`genre_id`, `name`, `description`) VALUES
('gen-001', 'Action RPG', 'Role-playing with real-time combat mechanics'),
('gen-002', 'Open World', 'Expansive non-linear exploratory environments'),
('gen-003', 'Roguelike', 'Dungeon crawl with procedural levels and permadeath elements'),
('gen-004', 'Metroidvania', 'Non-linear guided exploration and progression gating'),
('gen-005', 'First-Person Shooter', 'Shooting games viewed through the eyes of the protagonist'),
('gen-006', 'Puzzle', 'Logic, pattern recognition, and problem-solving mechanics'),
('gen-007', 'Simulation', 'Real-world activity and life-management simulation'),
('gen-008', 'Adventure', 'Narrative-driven exploration and quest completion'),
('gen-009', 'Strategy', 'Tactical decision-making and resource management'),
('gen-010', 'Hack and Slash', 'Fast-paced melee combat against waves of adversaries');

-- ---------------------------------------------------------------------
-- 4. TAG (10+ records)
-- ---------------------------------------------------------------------
INSERT INTO `TAG` (`tag_id`, `name`, `description`) VALUES
('tag-001', 'Story Rich', 'Deep, engaging and character-driven plot'),
('tag-002', 'Atmospheric', 'Immersive visual and acoustic world design'),
('tag-003', 'Difficult', 'Demands precision, timing, and patience'),
('tag-004', 'Great Soundtrack', 'Acclaimed musical score'),
('tag-005', 'Cyberpunk', 'High-tech and low-life dystopian setting'),
('tag-006', 'Fantasy', 'Mythical, magical and swordplay universe'),
('tag-007', 'Singleplayer', 'Designed primarily for solo enjoyment'),
('tag-008', 'Co-op', 'Collaborative multiplayer gameplay'),
('tag-009', 'Relaxing', 'Peaceful, low-stress soothing mechanics'),
('tag-010', 'Competitive', 'Ranked skill-based player matches');

-- ---------------------------------------------------------------------
-- 5. PLATFORM (10+ records)
-- ---------------------------------------------------------------------
INSERT INTO `PLATFORM` (`platform_id`, `name`, `manufacturer`) VALUES
('plt-001', 'PC (Windows)', 'Microsoft'),
('plt-002', 'PlayStation 5', 'Sony Interactive Entertainment'),
('plt-003', 'PlayStation 4', 'Sony Interactive Entertainment'),
('plt-004', 'Xbox Series X/S', 'Microsoft'),
('plt-005', 'Xbox One', 'Microsoft'),
('plt-006', 'Nintendo Switch', 'Nintendo'),
('plt-007', 'Steam Deck', 'Valve'),
('plt-008', 'macOS', 'Apple'),
('plt-009', 'Linux', 'Linux Foundation'),
('plt-010', 'GeForce NOW', 'NVIDIA');

-- ---------------------------------------------------------------------
-- 6. STORE (10+ records)
-- ---------------------------------------------------------------------
INSERT INTO `STORE` (`store_id`, `name`, `country`) VALUES
('str-001', 'Steam', 'United States'),
('str-002', 'Epic Games Store', 'United States'),
('str-003', 'GOG.com', 'Poland'),
('str-004', 'PlayStation Store', 'United States'),
('str-005', 'Xbox Games Store', 'United States'),
('str-006', 'Nintendo eShop', 'Japan'),
('str-007', 'Humble Bundle', 'United States'),
('str-008', 'Fanatical', 'United Kingdom'),
('str-009', 'Green Man Gaming', 'United Kingdom'),
('str-010', 'Capcom Official Store', 'Japan');

-- ---------------------------------------------------------------------
-- 7. GAME (12 realistic catalog records with actual Steam IDs)
-- ---------------------------------------------------------------------
INSERT INTO `GAME` (`game_id`, `publisher_id`, `rawg_id`, `steam_app_id`, `title`, `description`, `release_date`, `age_rating`, `metacritic_score`, `base_price`, `created_at`) VALUES
('gam-001', 'pub-001', 41494, 1091500, 'Cyberpunk 2077', 'An open-world, action-adventure RPG set in the dark future of Night City, a dangerous megalopolis obsessed with power, glamour, and body modification.', '2020-12-10', 'ESRB M', 86, 2999.00, '2026-01-01 00:00:00'),
('gam-002', 'pub-001', 3328, 292030, 'The Witcher 3: Wild Hunt', 'Become monster slayer for hire Geralt of Rivia in a war-torn, monster-infested continent you can explore at will as you seek the child of prophecy.', '2015-05-18', 'ESRB M', 93, 1999.00, '2026-01-01 00:00:00'),
('gam-003', 'pub-002', 326243, 1245620, 'Elden Ring', 'A vast world where open fields with a variety of situations and huge dungeons with complex and three-dimensional designs are seamlessly connected.', '2022-02-24', 'ESRB M', 96, 3599.00, '2026-01-01 00:00:00'),
('gam-004', 'pub-003', 28, 1174180, 'Red Dead Redemption 2', 'Arthur Morgan and the Van der Linde gang are outlaws on the run, fighting to survive across the rugged heartland of America at the dawn of the modern age.', '2018-10-26', 'ESRB M', 97, 3199.00, '2026-01-01 00:00:00'),
('gam-005', 'pub-004', 452634, 1086940, 'Baldur''s Gate 3', 'Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.', '2023-08-03', 'ESRB M', 96, 2999.00, '2026-01-01 00:00:00'),
('gam-006', 'pub-005', 274755, 1145360, 'Hades', 'Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion and Transistor.', '2020-09-17', 'ESRB T', 93, 1100.00, '2026-01-01 00:00:00'),
('gam-007', 'pub-006', 9767, 367520, 'Hollow Knight', 'Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes.', '2017-02-24', 'ESRB E10+', 90, 690.00, '2026-01-01 00:00:00'),
('gam-008', 'pub-003', 3498, 271590, 'Grand Theft Auto V', 'When a young street hustler, a retired bank robber and a terrifying psychopath find themselves entangled with the criminal underworld, they must pull off dangerous heists.', '2013-09-17', 'ESRB M', 96, 1979.00, '2026-01-01 00:00:00'),
('gam-009', 'pub-007', 4200, 730, 'Counter-Strike 2', 'For over two decades, it has offered an elite competitive experience, one shaped by millions of players from across the globe.', '2023-09-27', 'ESRB M', 83, 0.00, '2026-01-01 00:00:00'),
('gam-010', 'pub-008', 58175, 1593500, 'God of War', 'His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters.', '2022-01-14', 'ESRB M', 94, 3299.00, '2026-01-01 00:00:00'),
('gam-011', 'pub-007', 4286, 620, 'Portal 2', 'The Perpetual Testing Initiative has been expanded to allow you to design co-op puzzles for you and your friends.', '2011-04-18', 'ESRB E10+', 95, 480.00, '2026-01-01 00:00:00'),
('gam-012', 'pub-009', 654, 413150, 'Stardew Valley', 'You''ve inherited your grandfather''s old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life.', '2016-02-26', 'ESRB E10+', 89, 479.00, '2026-01-01 00:00:00');

-- ---------------------------------------------------------------------
-- 8. GAME_DEVELOPER (M:N junction - 12+ records)
-- ---------------------------------------------------------------------
INSERT INTO `GAME_DEVELOPER` (`game_id`, `developer_id`, `role`) VALUES
('gam-001', 'dev-001', 'Lead Developer'),
('gam-002', 'dev-001', 'Lead Developer'),
('gam-003', 'dev-002', 'Lead Developer'),
('gam-004', 'dev-003', 'Lead Developer'),
('gam-005', 'dev-004', 'Lead Developer'),
('gam-006', 'dev-005', 'Lead Developer'),
('gam-007', 'dev-006', 'Lead Developer'),
('gam-008', 'dev-003', 'Lead Developer'),
('gam-009', 'dev-007', 'Lead Developer'),
('gam-010', 'dev-008', 'Lead Developer'),
('gam-011', 'dev-007', 'Lead Developer'),
('gam-012', 'dev-009', 'Sole Developer');

-- ---------------------------------------------------------------------
-- 9. GAME_GENRE (M:N junction - 20+ records)
-- ---------------------------------------------------------------------
INSERT INTO `GAME_GENRE` (`game_id`, `genre_id`) VALUES
('gam-001', 'gen-001'), ('gam-001', 'gen-002'),
('gam-002', 'gen-001'), ('gam-002', 'gen-002'),
('gam-003', 'gen-001'), ('gam-003', 'gen-002'),
('gam-004', 'gen-002'), ('gam-004', 'gen-008'),
('gam-005', 'gen-001'), ('gam-005', 'gen-009'),
('gam-006', 'gen-003'), ('gam-006', 'gen-010'),
('gam-007', 'gen-004'), ('gam-007', 'gen-008'),
('gam-008', 'gen-002'), ('gam-008', 'gen-005'),
('gam-009', 'gen-005'),
('gam-010', 'gen-001'), ('gam-010', 'gen-008'),
('gam-011', 'gen-006'),
('gam-012', 'gen-007');

-- ---------------------------------------------------------------------
-- 10. GAME_TAG (M:N junction - 25+ records)
-- ---------------------------------------------------------------------
INSERT INTO `GAME_TAG` (`game_id`, `tag_id`) VALUES
('gam-001', 'tag-001'), ('gam-001', 'tag-005'), ('gam-001', 'tag-002'),
('gam-002', 'tag-001'), ('gam-002', 'tag-004'), ('gam-002', 'tag-006'),
('gam-003', 'tag-003'), ('gam-003', 'tag-006'), ('gam-003', 'tag-002'),
('gam-004', 'tag-001'), ('gam-004', 'tag-002'), ('gam-004', 'tag-004'),
('gam-005', 'tag-001'), ('gam-005', 'tag-006'), ('gam-005', 'tag-008'),
('gam-006', 'tag-003'), ('gam-006', 'tag-004'), ('gam-006', 'tag-007'),
('gam-007', 'tag-002'), ('gam-007', 'tag-003'), ('gam-007', 'tag-004'),
('gam-008', 'tag-002'), ('gam-008', 'tag-008'),
('gam-009', 'tag-010'), ('gam-009', 'tag-008'),
('gam-010', 'tag-001'), ('gam-010', 'tag-002'),
('gam-011', 'tag-006'), ('gam-011', 'tag-008'),
('gam-012', 'tag-009'), ('gam-012', 'tag-008');

-- ---------------------------------------------------------------------
-- 11. GAME_PLATFORM (M:N junction - 25+ records)
-- ---------------------------------------------------------------------
INSERT INTO `GAME_PLATFORM` (`game_id`, `platform_id`) VALUES
('gam-001', 'plt-001'), ('gam-001', 'plt-002'), ('gam-001', 'plt-004'),
('gam-002', 'plt-001'), ('gam-002', 'plt-002'), ('gam-002', 'plt-003'), ('gam-002', 'plt-006'),
('gam-003', 'plt-001'), ('gam-003', 'plt-002'), ('gam-003', 'plt-004'),
('gam-004', 'plt-001'), ('gam-004', 'plt-003'), ('gam-004', 'plt-005'),
('gam-005', 'plt-001'), ('gam-005', 'plt-002'), ('gam-005', 'plt-004'), ('gam-005', 'plt-008'),
('gam-006', 'plt-001'), ('gam-006', 'plt-002'), ('gam-006', 'plt-006'), ('gam-006', 'plt-008'),
('gam-007', 'plt-001'), ('gam-007', 'plt-006'), ('gam-007', 'plt-008'), ('gam-007', 'plt-009'),
('gam-008', 'plt-001'), ('gam-008', 'plt-002'), ('gam-008', 'plt-004'),
('gam-009', 'plt-001'), ('gam-009', 'plt-009'),
('gam-010', 'plt-001'), ('gam-010', 'plt-002'), ('gam-010', 'plt-003'),
('gam-011', 'plt-001'), ('gam-011', 'plt-008'), ('gam-011', 'plt-009'),
('gam-012', 'plt-001'), ('gam-012', 'plt-006'), ('gam-012', 'plt-008');

-- ---------------------------------------------------------------------
-- 12. USER (10+ records with bcrypt hash for 'password123')
-- Hash: $2b$10$wN105/xT8B8zYQoN08KzreB5Vp8p.QnU/QYkL4u4/jS.rT8mZ9zWy
-- ---------------------------------------------------------------------
INSERT INTO `USER` (`user_id`, `name`, `email`, `password_hash`, `role`, `created_at`) VALUES
('usr-001', 'Sreejith (Admin)', 'sreejith@example.com', '$2b$10$wN105/xT8B8zYQoN08KzreB5Vp8p.QnU/QYkL4u4/jS.rT8mZ9zWy', 'ADMIN', '2026-01-01 10:00:00'),
('usr-002', 'Somesh (Admin)', 'somesh@example.com', '$2b$10$wN105/xT8B8zYQoN08KzreB5Vp8p.QnU/QYkL4u4/jS.rT8mZ9zWy', 'ADMIN', '2026-01-01 10:00:00'),
('usr-003', 'Aarav Patel (User 1)', 'aarav@example.com', '$2b$10$wN105/xT8B8zYQoN08KzreB5Vp8p.QnU/QYkL4u4/jS.rT8mZ9zWy', 'USER', '2026-01-02 11:00:00'),
('usr-004', 'Diya Sharma (User 2)', 'diya@example.com', '$2b$10$wN105/xT8B8zYQoN08KzreB5Vp8p.QnU/QYkL4u4/jS.rT8mZ9zWy', 'USER', '2026-01-03 12:00:00'),
('usr-005', 'Rohan Gupta', 'rohan@example.com', '$2b$10$wN105/xT8B8zYQoN08KzreB5Vp8p.QnU/QYkL4u4/jS.rT8mZ9zWy', 'USER', '2026-01-04 13:00:00'),
('usr-006', 'Ananya Iyer', 'ananya@example.com', '$2b$10$wN105/xT8B8zYQoN08KzreB5Vp8p.QnU/QYkL4u4/jS.rT8mZ9zWy', 'USER', '2026-01-05 14:00:00'),
('usr-007', 'Vikram Singh', 'vikram@example.com', '$2b$10$wN105/xT8B8zYQoN08KzreB5Vp8p.QnU/QYkL4u4/jS.rT8mZ9zWy', 'USER', '2026-01-06 15:00:00'),
('usr-008', 'Neha Reddy', 'neha@example.com', '$2b$10$wN105/xT8B8zYQoN08KzreB5Vp8p.QnU/QYkL4u4/jS.rT8mZ9zWy', 'USER', '2026-01-07 16:00:00'),
('usr-009', 'Kavita Nair', 'kavita@example.com', '$2b$10$wN105/xT8B8zYQoN08KzreB5Vp8p.QnU/QYkL4u4/jS.rT8mZ9zWy', 'USER', '2026-01-08 17:00:00'),
('usr-010', 'Rahul Verma', 'rahul@example.com', '$2b$10$wN105/xT8B8zYQoN08KzreB5Vp8p.QnU/QYkL4u4/jS.rT8mZ9zWy', 'USER', '2026-01-09 18:00:00');

-- ---------------------------------------------------------------------
-- 13. WISHLIST (10+ records)
-- ---------------------------------------------------------------------
INSERT INTO `WISHLIST` (`wishlist_id`, `user_id`, `name`, `created_at`) VALUES
('wsh-001', 'usr-001', 'Sreejith RPG Favorites', '2026-02-01 10:00:00'),
('wsh-002', 'usr-002', 'Somesh Top Picks', '2026-02-01 11:00:00'),
('wsh-003', 'usr-003', 'Aarav Steam Summer Watch', '2026-02-02 12:00:00'),
('wsh-004', 'usr-003', 'Aarav Indie Gems', '2026-02-02 13:00:00'),
('wsh-005', 'usr-004', 'Diya Budget Deal Alert', '2026-02-03 14:00:00'),
('wsh-006', 'usr-005', 'Rohan Action Backlog', '2026-02-04 15:00:00'),
('wsh-007', 'usr-006', 'Ananya Cozy Weekend', '2026-02-05 16:00:00'),
('wsh-008', 'usr-007', 'Vikram Souls-like Wishlist', '2026-02-06 17:00:00'),
('wsh-009', 'usr-008', 'Neha Open World Collection', '2026-02-07 18:00:00'),
('wsh-010', 'usr-009', 'Kavita Co-op Play', '2026-02-08 19:00:00');

-- ---------------------------------------------------------------------
-- 14. WISHLIST_GAME (M:N junction - 15+ records with priorities & targets)
-- ---------------------------------------------------------------------
INSERT INTO `WISHLIST_GAME` (`wishlist_id`, `game_id`, `target_price`, `priority`, `added_at`) VALUES
-- Sreejith's wishlist (wsh-001)
('wsh-001', 'gam-001', 1600.00, 'HIGH', '2026-02-01 10:10:00'), -- Cyberpunk target 1600 (currently 1499 - MATCH!)
('wsh-001', 'gam-003', 2500.00, 'HIGH', '2026-02-01 10:15:00'), -- Elden Ring target 2500 (currently 2519 - NOT YET)
('wsh-001', 'gam-005', 2000.00, 'MEDIUM', '2026-02-01 10:20:00'), -- BG3 target 2000 (currently 2399 - NOT YET)
-- Somesh's wishlist (wsh-002)
('wsh-002', 'gam-002', 800.00, 'HIGH', '2026-02-01 11:05:00'),  -- Witcher 3 target 800 (currently 499 - MATCH!)
('wsh-002', 'gam-006', 600.00, 'MEDIUM', '2026-02-01 11:10:00'),
-- Aarav's wishlist (wsh-003 & wsh-004)
('wsh-003', 'gam-004', 1500.00, 'HIGH', '2026-02-02 12:05:00'), -- RDR2 target 1500 (currently 1055 - MATCH!)
('wsh-003', 'gam-008', 900.00, 'MEDIUM', '2026-02-02 12:10:00'),
('wsh-004', 'gam-007', 350.00, 'HIGH', '2026-02-02 13:05:00'),  -- Hollow Knight target 350 (currently 345 - MATCH!)
('wsh-004', 'gam-012', 400.00, 'LOW', '2026-02-02 13:10:00'),
-- Diya's wishlist (wsh-005)
('wsh-005', 'gam-011', 200.00, 'HIGH', '2026-02-03 14:05:00'),  -- Portal 2 target 200 (currently 96 - MATCH!)
('wsh-005', 'gam-007', 300.00, 'MEDIUM', '2026-02-03 14:10:00'),
-- Other wishlists
('wsh-006', 'gam-010', 1800.00, 'HIGH', '2026-02-04 15:05:00'),
('wsh-007', 'gam-012', 300.00, 'HIGH', '2026-02-05 16:05:00'),
('wsh-008', 'gam-003', 2000.00, 'HIGH', '2026-02-06 17:05:00'),
('wsh-009', 'gam-001', 1200.00, 'MEDIUM', '2026-02-07 18:05:00'),
('wsh-010', 'gam-011', 150.00, 'LOW', '2026-02-08 19:05:00');

-- ---------------------------------------------------------------------
-- 15. PRICE_HISTORY (35+ observations demonstrating history and stores)
-- Demonstrates:
-- 1. Historical low cheaper than current latest price
-- 2. Multi-store comparison (Steam vs Epic vs GOG)
-- 3. Clear chronological progression
-- ---------------------------------------------------------------------
INSERT INTO `PRICE_HISTORY` (`price_id`, `game_id`, `store_id`, `price`, `currency`, `discount_percentage`, `recorded_at`) VALUES
-- Cyberpunk 2077 (Base: 2999.00)
-- Older historical low at 1199.00 on Steam, now current is 1499.00
('prc-001', 'gam-001', 'str-001', 2999.00, 'INR', 0.00, '2026-01-05 10:00:00'),
('prc-002', 'gam-001', 'str-001', 1199.00, 'INR', 60.02, '2026-01-15 10:00:00'), -- HISTORICAL LOW on Steam!
('prc-003', 'gam-001', 'str-001', 1499.00, 'INR', 50.02, '2026-02-01 10:00:00'), -- LATEST on Steam
('prc-004', 'gam-001', 'str-002', 1799.00, 'INR', 40.01, '2026-02-01 10:00:00'), -- LATEST on Epic
('prc-005', 'gam-001', 'str-003', 1499.00, 'INR', 50.02, '2026-02-01 10:00:00'), -- LATEST on GOG

-- The Witcher 3: Wild Hunt (Base: 1999.00)
('prc-006', 'gam-002', 'str-001', 1999.00, 'INR', 0.00, '2026-01-05 10:00:00'),
('prc-007', 'gam-002', 'str-001', 399.00, 'INR', 80.04, '2026-01-10 10:00:00'),  -- HISTORICAL LOW!
('prc-008', 'gam-002', 'str-001', 499.00, 'INR', 75.04, '2026-02-01 10:00:00'),  -- LATEST on Steam
('prc-009', 'gam-002', 'str-003', 499.00, 'INR', 75.04, '2026-02-01 10:00:00'),  -- LATEST on GOG

-- Elden Ring (Base: 3599.00)
('prc-010', 'gam-003', 'str-001', 3599.00, 'INR', 0.00, '2026-01-05 10:00:00'),
('prc-011', 'gam-003', 'str-001', 2159.00, 'INR', 40.01, '2026-01-20 10:00:00'), -- HISTORICAL LOW!
('prc-012', 'gam-003', 'str-001', 2519.00, 'INR', 30.01, '2026-02-01 10:00:00'), -- LATEST on Steam
('prc-013', 'gam-003', 'str-004', 2879.00, 'INR', 20.01, '2026-02-01 10:00:00'), -- LATEST on PS Store

-- Red Dead Redemption 2 (Base: 3199.00)
('prc-014', 'gam-004', 'str-001', 3199.00, 'INR', 0.00, '2026-01-05 10:00:00'),
('prc-015', 'gam-004', 'str-001', 1055.00, 'INR', 67.02, '2026-02-01 10:00:00'), -- LATEST on Steam
('prc-016', 'gam-004', 'str-002', 1279.00, 'INR', 60.02, '2026-02-01 10:00:00'), -- LATEST on Epic

-- Baldur's Gate 3 (Base: 2999.00)
('prc-017', 'gam-005', 'str-001', 2999.00, 'INR', 0.00, '2026-01-05 10:00:00'),
('prc-018', 'gam-005', 'str-001', 2399.00, 'INR', 20.01, '2026-02-01 10:00:00'), -- LATEST on Steam
('prc-019', 'gam-005', 'str-003', 2399.00, 'INR', 20.01, '2026-02-01 10:00:00'), -- LATEST on GOG

-- Hades (Base: 1100.00)
('prc-020', 'gam-006', 'str-001', 1100.00, 'INR', 0.00, '2026-01-05 10:00:00'),
('prc-021', 'gam-006', 'str-001', 550.00, 'INR', 50.00, '2026-02-01 10:00:00'),  -- LATEST on Steam
('prc-022', 'gam-006', 'str-002', 550.00, 'INR', 50.00, '2026-02-01 10:00:00'),  -- LATEST on Epic

-- Hollow Knight (Base: 690.00)
('prc-023', 'gam-007', 'str-001', 690.00, 'INR', 0.00, '2026-01-05 10:00:00'),
('prc-024', 'gam-007', 'str-001', 345.00, 'INR', 50.00, '2026-02-01 10:00:00'),  -- LATEST on Steam
('prc-025', 'gam-007', 'str-003', 345.00, 'INR', 50.00, '2026-02-01 10:00:00'),  -- LATEST on GOG

-- Grand Theft Auto V (Base: 1979.00)
('prc-026', 'gam-008', 'str-001', 1979.00, 'INR', 0.00, '2026-01-05 10:00:00'),
('prc-027', 'gam-008', 'str-001', 989.00, 'INR', 50.03, '2026-02-01 10:00:00'),  -- LATEST on Steam
('prc-028', 'gam-008', 'str-002', 989.00, 'INR', 50.03, '2026-02-01 10:00:00'),  -- LATEST on Epic

-- Counter-Strike 2 (Free to play Base: 0.00)
('prc-029', 'gam-009', 'str-001', 0.00, 'INR', 0.00, '2026-01-01 10:00:00'),

-- God of War (Base: 3299.00)
('prc-030', 'gam-010', 'str-001', 3299.00, 'INR', 0.00, '2026-01-05 10:00:00'),
('prc-031', 'gam-010', 'str-001', 1649.00, 'INR', 50.02, '2026-02-01 10:00:00'), -- LATEST on Steam
('prc-032', 'gam-010', 'str-004', 1979.00, 'INR', 40.01, '2026-02-01 10:00:00'), -- LATEST on PS Store

-- Portal 2 (Base: 480.00)
('prc-033', 'gam-011', 'str-001', 480.00, 'INR', 0.00, '2026-01-05 10:00:00'),
('prc-034', 'gam-011', 'str-001', 96.00, 'INR', 80.00, '2026-02-01 10:00:00'),   -- LATEST on Steam

-- Stardew Valley (Base: 479.00)
('prc-035', 'gam-012', 'str-001', 479.00, 'INR', 0.00, '2026-01-05 10:00:00'),
('prc-036', 'gam-012', 'str-001', 383.00, 'INR', 20.04, '2026-02-01 10:00:00'),  -- LATEST on Steam
('prc-037', 'gam-012', 'str-003', 383.00, 'INR', 20.04, '2026-02-01 10:00:00');  -- LATEST on GOG
