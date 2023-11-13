BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Buyer" (
	"id"	INTEGER NOT NULL UNIQUE,
	"lastname"	TEXT NOT NULL,
	"firstname"	TEXT NOT NULL,
	"middlename"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
INSERT INTO "Buyer" VALUES (1,'Piodos','Aning','Tanudtanud');
INSERT INTO "Buyer" VALUES (2,'Swift','Taylor','Alisson');
INSERT INTO "Buyer" VALUES (3,'Posy','Beatrice','May');
COMMIT;
