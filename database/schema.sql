-- =====================================================================
-- GAME INTELLIGENCE & MARKET ANALYTICS PLATFORM
-- Authoritative Relational Database Schema (MySQL 8.0)
-- 15 Relational Tables matching ER diagram baseline exactly
-- Author: Sreejith
-- =====================================================================

DROP DATABASE IF EXISTS `game_intelligence_db`;
CREATE DATABASE `game_intelligence_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE `game_intelligence_db`;

-- Disable foreign key checks during schema re-creation
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `PRICE_HISTORY`;
DROP TABLE IF EXISTS `PRICE_AUDIT_LOG`;
DROP TABLE IF EXISTS `WISHLIST_GAME`;
DROP TABLE IF EXISTS `WISHLIST`;
DROP TABLE IF EXISTS `GAME_PLATFORM`;
DROP TABLE IF EXISTS `GAME_TAG`;
DROP TABLE IF EXISTS `GAME_GENRE`;
DROP TABLE IF EXISTS `GAME_DEVELOPER`;
DROP TABLE IF EXISTS `GAME`;
DROP TABLE IF EXISTS `STORE`;
DROP TABLE IF EXISTS `PLATFORM`;
DROP TABLE IF EXISTS `TAG`;
DROP TABLE IF EXISTS `GENRE`;
DROP TABLE IF EXISTS `DEVELOPER`;
DROP TABLE IF EXISTS `PUBLISHER`;
DROP TABLE IF EXISTS `USER`;
DROP TABLE IF EXISTS `DISPOSABLE_DEMO_TABLE`;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- 1. PUBLISHER
-- ---------------------------------------------------------------------
CREATE TABLE `PUBLISHER` (
    `publisher_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `country` VARCHAR(80) NULL,
    `website` VARCHAR(255) NULL,
    PRIMARY KEY (`publisher_id`),
    INDEX `idx_publisher_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 2. DEVELOPER
-- ---------------------------------------------------------------------
CREATE TABLE `DEVELOPER` (
    `developer_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `country` VARCHAR(80) NULL,
    `website` VARCHAR(255) NULL,
    PRIMARY KEY (`developer_id`),
    INDEX `idx_developer_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 3. GAME (Authoritative game identity)
-- ---------------------------------------------------------------------
CREATE TABLE `GAME` (
    `game_id` VARCHAR(36) NOT NULL,
    `publisher_id` VARCHAR(36) NULL,
    `rawg_id` INT NULL,
    `steam_app_id` INT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NOT NULL,
    `release_date` DATE NULL,
    `age_rating` VARCHAR(20) NULL,
    `metacritic_score` INT NULL CHECK (`metacritic_score` >= 0 AND `metacritic_score` <= 100),
    `base_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (`base_price` >= 0),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`game_id`),
    INDEX `idx_game_title` (`title`),
    INDEX `idx_game_release_date` (`release_date`),
    INDEX `idx_game_steam_app_id` (`steam_app_id`),
    CONSTRAINT `fk_game_publisher` FOREIGN KEY (`publisher_id`)
        REFERENCES `PUBLISHER` (`publisher_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 4. GAME_DEVELOPER (M:N junction)
-- ---------------------------------------------------------------------
CREATE TABLE `GAME_DEVELOPER` (
    `game_id` VARCHAR(36) NOT NULL,
    `developer_id` VARCHAR(36) NOT NULL,
    `role` VARCHAR(80) NOT NULL DEFAULT 'Lead Developer',
    PRIMARY KEY (`game_id`, `developer_id`),
    CONSTRAINT `fk_gd_game` FOREIGN KEY (`game_id`)
        REFERENCES `GAME` (`game_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_gd_developer` FOREIGN KEY (`developer_id`)
        REFERENCES `DEVELOPER` (`developer_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 5. GENRE
-- ---------------------------------------------------------------------
CREATE TABLE `GENRE` (
    `genre_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(80) NOT NULL UNIQUE,
    `description` VARCHAR(255) NULL,
    PRIMARY KEY (`genre_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 6. GAME_GENRE (M:N junction)
-- ---------------------------------------------------------------------
CREATE TABLE `GAME_GENRE` (
    `game_id` VARCHAR(36) NOT NULL,
    `genre_id` VARCHAR(36) NOT NULL,
    PRIMARY KEY (`game_id`, `genre_id`),
    CONSTRAINT `fk_gg_game` FOREIGN KEY (`game_id`)
        REFERENCES `GAME` (`game_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_gg_genre` FOREIGN KEY (`genre_id`)
        REFERENCES `GENRE` (`genre_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 7. TAG
-- ---------------------------------------------------------------------
CREATE TABLE `TAG` (
    `tag_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(80) NOT NULL UNIQUE,
    `description` VARCHAR(255) NULL,
    PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 8. GAME_TAG (M:N junction)
-- ---------------------------------------------------------------------
CREATE TABLE `GAME_TAG` (
    `game_id` VARCHAR(36) NOT NULL,
    `tag_id` VARCHAR(36) NOT NULL,
    PRIMARY KEY (`game_id`, `tag_id`),
    CONSTRAINT `fk_gt_game` FOREIGN KEY (`game_id`)
        REFERENCES `GAME` (`game_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_gt_tag` FOREIGN KEY (`tag_id`)
        REFERENCES `TAG` (`tag_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 9. PLATFORM
-- ---------------------------------------------------------------------
CREATE TABLE `PLATFORM` (
    `platform_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(80) NOT NULL UNIQUE,
    `manufacturer` VARCHAR(100) NULL,
    PRIMARY KEY (`platform_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 10. GAME_PLATFORM (M:N junction)
-- ---------------------------------------------------------------------
CREATE TABLE `GAME_PLATFORM` (
    `game_id` VARCHAR(36) NOT NULL,
    `platform_id` VARCHAR(36) NOT NULL,
    PRIMARY KEY (`game_id`, `platform_id`),
    CONSTRAINT `fk_gp_game` FOREIGN KEY (`game_id`)
        REFERENCES `GAME` (`game_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_gp_platform` FOREIGN KEY (`platform_id`)
        REFERENCES `PLATFORM` (`platform_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 11. USER
-- ---------------------------------------------------------------------
CREATE TABLE `USER` (
    `user_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(180) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`),
    INDEX `idx_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 12. WISHLIST
-- ---------------------------------------------------------------------
CREATE TABLE `WISHLIST` (
    `wishlist_id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`wishlist_id`),
    INDEX `idx_wishlist_user` (`user_id`),
    CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`user_id`)
        REFERENCES `USER` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 13. WISHLIST_GAME (M:N junction)
-- ---------------------------------------------------------------------
CREATE TABLE `WISHLIST_GAME` (
    `wishlist_id` VARCHAR(36) NOT NULL,
    `game_id` VARCHAR(36) NOT NULL,
    `target_price` DECIMAL(10, 2) NULL CHECK (`target_price` >= 0),
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    `added_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`wishlist_id`, `game_id`),
    CONSTRAINT `fk_wg_wishlist` FOREIGN KEY (`wishlist_id`)
        REFERENCES `WISHLIST` (`wishlist_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_wg_game` FOREIGN KEY (`game_id`)
        REFERENCES `GAME` (`game_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 14. STORE
-- ---------------------------------------------------------------------
CREATE TABLE `STORE` (
    `store_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `country` VARCHAR(80) NULL,
    PRIMARY KEY (`store_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 15. PRICE_HISTORY
-- ---------------------------------------------------------------------
CREATE TABLE `PRICE_HISTORY` (
    `price_id` VARCHAR(36) NOT NULL,
    `game_id` VARCHAR(36) NOT NULL,
    `store_id` VARCHAR(36) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL CHECK (`price` >= 0),
    `currency` VARCHAR(10) NOT NULL DEFAULT 'INR',
    `discount_percentage` DECIMAL(5, 2) NOT NULL DEFAULT 0.00 CHECK (`discount_percentage` >= 0 AND `discount_percentage` <= 100),
    `recorded_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`price_id`),
    INDEX `idx_ph_game_time` (`game_id`, `recorded_at` DESC),
    INDEX `idx_ph_store` (`store_id`),
    CONSTRAINT `fk_ph_game` FOREIGN KEY (`game_id`)
        REFERENCES `GAME` (`game_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_ph_store` FOREIGN KEY (`store_id`)
        REFERENCES `STORE` (`store_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- AUDIT TABLE: For Trigger Demonstration
-- ---------------------------------------------------------------------
CREATE TABLE `PRICE_AUDIT_LOG` (
    `log_id` INT AUTO_INCREMENT PRIMARY KEY,
    `price_id` VARCHAR(36) NOT NULL,
    `game_id` VARCHAR(36) NOT NULL,
    `store_id` VARCHAR(36) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `discount_percentage` DECIMAL(5, 2) NOT NULL,
    `action_type` VARCHAR(20) NOT NULL,
    `logged_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- DISPOSABLE DEMO TABLE: For required DDL DROP demonstration
-- ---------------------------------------------------------------------
CREATE TABLE `DISPOSABLE_DEMO_TABLE` (
    `demo_id` INT PRIMARY KEY,
    `demo_note` VARCHAR(100)
) ENGINE=InnoDB;

-- =====================================================================
-- ADVANCED SQL CATEGORIES (Required for evaluation)
-- =====================================================================

-- CATEGORY 1: VIEWS (with window functions and latest observations)

-- View 1: Latest price observation for each (game, store) pair
CREATE OR REPLACE VIEW `view_latest_store_prices` AS
WITH RankedPrices AS (
    SELECT 
        ph.price_id,
        ph.game_id,
        ph.store_id,
        s.name AS store_name,
        ph.price,
        ph.currency,
        ph.discount_percentage,
        ph.recorded_at,
        ROW_NUMBER() OVER (
            PARTITION BY ph.game_id, ph.store_id 
            ORDER BY ph.recorded_at DESC, ph.price_id DESC
        ) AS rn
    FROM `PRICE_HISTORY` ph
    JOIN `STORE` s ON ph.store_id = s.store_id
)
SELECT 
    price_id,
    game_id,
    store_id,
    store_name,
    price,
    currency,
    discount_percentage,
    recorded_at
FROM RankedPrices
WHERE rn = 1;

-- View 2: Current lowest price per game across all stores
CREATE OR REPLACE VIEW `view_game_current_lowest` AS
SELECT 
    game_id,
    MIN(price) AS current_lowest_price,
    currency
FROM `view_latest_store_prices`
GROUP BY game_id, currency;

-- View 3: Observed all-time historical minimum price per game
CREATE OR REPLACE VIEW `view_game_historical_lowest` AS
SELECT 
    game_id,
    MIN(price) AS historical_lowest_price,
    currency
FROM `PRICE_HISTORY`
GROUP BY game_id, currency;

-- View 4: Comprehensive catalog summary view
CREATE OR REPLACE VIEW `view_game_catalog_summary` AS
SELECT 
    g.game_id,
    g.title,
    g.description,
    g.base_price,
    g.steam_app_id,
    g.metacritic_score,
    g.release_date,
    p.name AS publisher_name,
    cur.current_lowest_price,
    hist.historical_lowest_price,
    COALESCE(cur.currency, 'INR') AS currency
FROM `GAME` g
LEFT JOIN `PUBLISHER` p ON g.publisher_id = p.publisher_id
LEFT JOIN `view_game_current_lowest` cur ON g.game_id = cur.game_id
LEFT JOIN `view_game_historical_lowest` hist ON g.game_id = hist.game_id;

-- ---------------------------------------------------------------------
-- CATEGORY 2: STORED ROUTINES (Functions and Procedures)
-- ---------------------------------------------------------------------

DELIMITER $$

-- Function: Compute derived selling price given base price and discount %
DROP FUNCTION IF EXISTS `fn_calculate_discounted_price`$$
CREATE FUNCTION `fn_calculate_discounted_price`(
    p_base_price DECIMAL(10, 2),
    p_discount_percentage DECIMAL(5, 2)
) 
RETURNS DECIMAL(10, 2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_selling_price DECIMAL(10, 2);
    IF p_base_price <= 0 THEN
        RETURN 0.00;
    END IF;
    IF p_discount_percentage < 0 THEN
        SET p_discount_percentage = 0.00;
    ELSEIF p_discount_percentage > 100 THEN
        SET p_discount_percentage = 100.00;
    END IF;
    SET v_selling_price = ROUND(p_base_price * (1.0 - (p_discount_percentage / 100.0)), 2);
    RETURN v_selling_price;
END$$

-- Procedure: Admin recording of new price observation with validation
DROP PROCEDURE IF EXISTS `sp_record_price_observation`$$
CREATE PROCEDURE `sp_record_price_observation`(
    IN p_game_id VARCHAR(36),
    IN p_store_id VARCHAR(36),
    IN p_discount_percentage DECIMAL(5, 2),
    OUT p_new_price_id VARCHAR(36),
    OUT p_calculated_price DECIMAL(10, 2)
)
BEGIN
    DECLARE v_base_price DECIMAL(10, 2);
    DECLARE v_game_exists INT DEFAULT 0;
    DECLARE v_store_exists INT DEFAULT 0;

    -- Validate game existence and retrieve base price
    SELECT COUNT(*), COALESCE(MAX(base_price), 0.00)
    INTO v_game_exists, v_base_price
    FROM `GAME` WHERE `game_id` = p_game_id;

    IF v_game_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Game does not exist';
    END IF;

    -- Validate store existence
    SELECT COUNT(*) INTO v_store_exists
    FROM `STORE` WHERE `store_id` = p_store_id;

    IF v_store_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Store does not exist';
    END IF;

    -- Validate discount range
    IF p_discount_percentage < 0.00 OR p_discount_percentage > 100.00 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Discount must be between 0 and 100';
    END IF;

    -- Derive selling price
    SET p_calculated_price = fn_calculate_discounted_price(v_base_price, p_discount_percentage);
    SET p_new_price_id = UUID();

    -- Insert into PRICE_HISTORY
    INSERT INTO `PRICE_HISTORY` (
        `price_id`, `game_id`, `store_id`, `price`, `currency`, `discount_percentage`, `recorded_at`
    ) VALUES (
        p_new_price_id, p_game_id, p_store_id, p_calculated_price, 'INR', p_discount_percentage, UTC_TIMESTAMP()
    );
END$$

-- Procedure: Multi-step transaction creating wishlist with first game
DROP PROCEDURE IF EXISTS `sp_create_wishlist_with_first_game`$$
CREATE PROCEDURE `sp_create_wishlist_with_first_game`(
    IN p_wishlist_id VARCHAR(36),
    IN p_user_id VARCHAR(36),
    IN p_name VARCHAR(100),
    IN p_game_id VARCHAR(36),
    IN p_target_price DECIMAL(10, 2),
    IN p_priority VARCHAR(10)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Step 1: Insert wishlist
        INSERT INTO `WISHLIST` (`wishlist_id`, `user_id`, `name`, `created_at`)
        VALUES (p_wishlist_id, p_user_id, p_name, UTC_TIMESTAMP());

        -- Step 2: Add first game membership
        INSERT INTO `WISHLIST_GAME` (`wishlist_id`, `game_id`, `target_price`, `priority`, `added_at`)
        VALUES (p_wishlist_id, p_game_id, p_target_price, p_priority, UTC_TIMESTAMP());
    COMMIT;
END$$

-- ---------------------------------------------------------------------
-- CATEGORY 3: TRIGGERS (Automated audit and consistency)
-- ---------------------------------------------------------------------

DROP TRIGGER IF EXISTS `trg_after_price_history_insert`$$
CREATE TRIGGER `trg_after_price_history_insert`
AFTER INSERT ON `PRICE_HISTORY`
FOR EACH ROW
BEGIN
    INSERT INTO `PRICE_AUDIT_LOG` (
        `price_id`, `game_id`, `store_id`, `price`, `discount_percentage`, `action_type`, `logged_at`
    ) VALUES (
        NEW.price_id, NEW.game_id, NEW.store_id, NEW.price, NEW.discount_percentage, 'INSERT', UTC_TIMESTAMP()
    );
END$$

DELIMITER ;
