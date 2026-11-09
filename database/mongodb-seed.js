/* Run with: mongosh "$MONGODB_URI" database/mongodb-seed.js */
db = db.getSiblingDB("game_intelligence");
db.game_details.createIndex({ gameId: 1 }, { unique: true });
db.game_details.bulkWrite([
  { replaceOne: { filter: { gameId: "gam-001" }, replacement: { gameId: "gam-001", longDescription: "Cyberpunk 2077 is an open-world action RPG set in Night City, where ambition and augmentation define survival.", story: "Step into the role of V, a mercenary chasing an implant that holds the key to immortality.", features: ["Open-world Night City", "Build-driven RPG combat", "Multiple story paths"], systemRequirements: { minimum: ["64-bit processor and OS", "12 GB RAM", "70 GB storage"], recommended: ["16 GB RAM", "SSD storage", "DirectX 12 GPU"] }, updatedAt: new Date() }, upsert: true } },
  { replaceOne: { filter: { gameId: "gam-002" }, replacement: { gameId: "gam-002", longDescription: "The Witcher 3: Wild Hunt is a story-rich fantasy RPG following professional monster slayer Geralt of Rivia.", story: "Track Ciri across a war-torn continent while choices shape the fate of kingdoms and companions.", features: ["Branching narrative", "Monster contracts", "Expansive fantasy world"], updatedAt: new Date() }, upsert: true } }
]);
