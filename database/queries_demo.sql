-- =====================================================================
-- GAME INTELLIGENCE & MARKET ANALYTICS PLATFORM
-- Faculty Demonstration Queries (17 Requirements Evidence)
-- Author: Sreejith
-- =====================================================================

USE `game_intelligence_db`;

-- 1. DDL DEMONSTRATION: CREATE, ALTER, DROP
-- Create disposable demo table
CREATE TABLE IF NOT EXISTS `DEMO_DISPOSABLE` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `note` VARCHAR(100)
);

-- Alter table demonstration: add column, modify column
ALTER TABLE `DEMO_DISPOSABLE` ADD COLUMN `created_by` VARCHAR(50) DEFAULT 'admin';
ALTER TABLE `DEMO_DISPOSABLE` MODIFY COLUMN `note` VARCHAR(255);

-- Drop table demonstration
DROP TABLE IF EXISTS `DEMO_DISPOSABLE`;

-- 2. DML DEMONSTRATION: SELECT with JOIN, GROUP BY, HAVING, AGGREGATES
-- Query A: Multi-table join showing games with genres, developer, publisher and current prices
SELECT 
    g.title,
    p.name AS publisher,
    d.name AS developer,
    GROUP_CONCAT(DISTINCT gen.name ORDER BY gen.name SEPARATOR ', ') AS genres,
    g.base_price,
    cur.current_lowest_price,
    hist.historical_lowest_price
FROM `GAME` g
LEFT JOIN `PUBLISHER` p ON g.publisher_id = p.publisher_id
LEFT JOIN `GAME_DEVELOPER` gd ON g.game_id = gd.game_id
LEFT JOIN `DEVELOPER` d ON gd.developer_id = d.developer_id
LEFT JOIN `GAME_GENRE` gg ON g.game_id = gg.game_id
LEFT JOIN `GENRE` gen ON gg.genre_id = gen.genre_id
LEFT JOIN `view_game_current_lowest` cur ON g.game_id = cur.game_id
LEFT JOIN `view_game_historical_lowest` hist ON g.game_id = hist.game_id
GROUP BY g.game_id, g.title, p.name, d.name, g.base_price, cur.current_lowest_price, hist.historical_lowest_price
ORDER BY g.title;

-- Query B: Aggregation with HAVING - publishers having average game rating > 90
SELECT 
    p.name AS publisher_name,
    COUNT(g.game_id) AS game_count,
    ROUND(AVG(g.metacritic_score), 1) AS avg_score,
    ROUND(AVG(g.base_price), 2) AS avg_base_price
FROM `PUBLISHER` p
JOIN `GAME` g ON p.publisher_id = g.publisher_id
GROUP BY p.publisher_id, p.name
HAVING AVG(g.metacritic_score) >= 90
ORDER BY avg_score DESC;

-- Query C: Subquery Demonstration - Games priced lower than average catalog base price
SELECT 
    game_id,
    title,
    base_price
FROM `GAME`
WHERE base_price < (SELECT AVG(base_price) FROM `GAME`)
ORDER BY base_price DESC;

-- 3. ADVANCED SQL: VIEW WITH WINDOW FUNCTIONS (LATEST STORE PRICES)
SELECT * FROM `view_latest_store_prices` WHERE game_id = 'gam-001';

-- 4. ADVANCED SQL: STORED FUNCTION DEMONSTRATION
SELECT 
    title,
    base_price,
    fn_calculate_discounted_price(base_price, 33.33) AS price_at_33_percent_off
FROM `GAME`
LIMIT 5;

-- 5. ADVANCED SQL: STORED PROCEDURE WITH OUT PARAMETERS
CALL sp_record_price_observation('gam-002', 'str-002', 65.00, @out_id, @out_price);
SELECT @out_id AS generated_price_id, @out_price AS calculated_price;

-- 6. ADVANCED SQL: TRIGGER DEMONSTRATION (Inspect audit log for the above procedure call)
SELECT * FROM `PRICE_AUDIT_LOG` ORDER BY logged_at DESC LIMIT 3;

-- 7. ADVANCED SQL: TRANSACTION COMMIT & ROLLBACK DEMONSTRATION
-- Successful transaction
CALL sp_create_wishlist_with_first_game('wsh-demo-success', 'usr-001', 'Demo Tx Wishlist', 'gam-001', 1400.00, 'HIGH');
SELECT * FROM `WISHLIST` WHERE wishlist_id = 'wsh-demo-success';
SELECT * FROM `WISHLIST_GAME` WHERE wishlist_id = 'wsh-demo-success';
-- Cleanup demo row
DELETE FROM `WISHLIST` WHERE wishlist_id = 'wsh-demo-success';
