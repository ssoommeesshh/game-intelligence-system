/* Run with: mongosh "$MONGODB_URI" database/mongodb-seed.js */
db = db.getSiblingDB("game_intelligence");
db.game_details.createIndex({ gameId: 1 }, { unique: true });

const games = [
  ["gam-001", "Cyberpunk 2077 is an open-world action RPG set in Night City, a dense metropolis shaped by technology, ambition, and body modification.", "Play as V, a mercenary seeking a way to survive an experimental implant and the personality preserved inside it.", ["Open-world Night City", "Build-driven RPG combat", "Multiple story paths"]],
  ["gam-002", "The Witcher 3: Wild Hunt is a story-rich fantasy RPG about a professional monster slayer crossing a war-torn continent.", "Geralt searches for Ciri while political conflict, ancient magic, and player decisions reshape the journey.", ["Branching narrative", "Monster contracts", "Expansive fantasy world"]],
  ["gam-003", "Elden Ring is an action RPG built around dangerous combat, open exploration, and deep character customization in the Lands Between.", "A Tarnished travels through shattered kingdoms to confront demigods and restore the Elden Ring.", ["Challenging boss combat", "Open-world discovery", "Flexible character builds"]],
  ["gam-004", "Red Dead Redemption 2 is a cinematic open-world western centered on outlaw life, survival, and an evolving frontier.", "Arthur Morgan and the Van der Linde gang flee lawmen and rival gangs as the modern world closes in.", ["Living open world", "Narrative missions", "Frontier exploration"]],
  ["gam-005", "Baldur's Gate 3 is a party-based fantasy RPG with tactical combat, companion relationships, and choices that change the world.", "A parasitic tadpole links a group of unlikely allies while they uncover a threat to the Forgotten Realms.", ["Turn-based tactical combat", "Co-op adventure", "Choice-driven quests"]],
  ["gam-006", "Hades is a fast roguelike dungeon crawler where each escape attempt mixes responsive action combat with evolving character stories.", "Zagreus battles out of the Underworld to reach the surface, aided and challenged by Olympian gods.", ["Replayable escape runs", "Godly boons", "Fast hack-and-slash combat"]],
  ["gam-007", "Hollow Knight is a hand-drawn metroidvania about exploration, precise combat, and secrets beneath a fallen insect kingdom.", "The Knight descends into Hallownest to uncover the source of a spreading infection.", ["Interconnected world", "Precision platforming", "Upgradeable abilities"]],
  ["gam-008", "Grand Theft Auto V is an open-world crime adventure with a large modern city, heists, driving, and three playable protagonists.", "Michael, Franklin, and Trevor are drawn into increasingly ambitious jobs across Los Santos and Blaine County.", ["Three protagonists", "Open-world activities", "Heist missions"]],
  ["gam-009", "Counter-Strike 2 is a competitive tactical shooter where two teams use teamwork, economy management, and precise gunplay to win rounds.", "Terrorists and Counter-Terrorists compete across objective-based maps with high-stakes elimination rounds.", ["Team-based competition", "Tactical economy", "Skill-focused gunplay"]],
  ["gam-010", "God of War is a cinematic action adventure combining brutal axe combat, Norse mythology, exploration, and character-driven storytelling.", "Kratos and his son Atreus undertake a personal journey through the realms of Norse gods and monsters.", ["Axe combat", "Norse mythology", "Father-and-son narrative"]],
  ["gam-011", "Portal 2 is a first-person puzzle adventure built around portals, physics, inventive test chambers, and dark humor.", "Chell returns to Aperture Science and works with familiar and unexpected allies to escape its dangerous facilities.", ["Portal-based puzzles", "Co-op campaign", "Physics challenges"]],
  ["gam-012", "Stardew Valley is a relaxed farming and life simulation with crop growing, friendships, exploration, fishing, and town events.", "A new farmer rebuilds an inherited plot while becoming part of a small rural community.", ["Farming and crafting", "Town relationships", "Relaxed exploration"]],
];

db.game_details.bulkWrite(games.map(([gameId, longDescription, story, features]) => ({
  replaceOne: {
    filter: { gameId },
    replacement: {
      gameId,
      longDescription,
      story,
      features,
      systemRequirements: { minimum: ["64-bit processor and operating system", "8 GB RAM", "DirectX-compatible graphics"], recommended: ["16 GB RAM", "SSD storage", "Dedicated graphics card"] },
      updatedAt: new Date(),
    },
    upsert: true,
  },
})));
