BEGIN;

INSERT INTO "role" ("name") VALUES
('user'),
('teacher'),
('admin'),
('super admin');

INSERT INTO "user"("login","email","password","role_id", "avatar_key") VALUES
('aviateur22','aviateur22@msn.com','$2b$10$x7U3SPvoeNVTKpLEBTC7UuXmn1BDg9AbeHjqDifDJ7efiTzjEMzq2','1', 'thumbnail-DEFAULT_AVATAR_MEN.png'),
('aviateur22','aviateur22@hotmail.fr','$2b$10$x7U3SPvoeNVTKpLEBTC7UuXmn1BDg9AbeHjqDifDJ7efiTzjEMzq2','2', 'thumbnail-DEFAULT_AVATAR_MEN.png'),
('aviateur22','aviateur22@gmail.com','$2b$10$x7U3SPvoeNVTKpLEBTC7UuXmn1BDg9AbeHjqDifDJ7efiTzjEMzq2','3', 'thumbnail-DEFAULT_AVATAR_MEN.png');

INSERT INTO "image" ("path","name") VALUES
('empty','/images/empty.png'),
('base de données','/images/database.png'),
('javascript','/images/javascript.png'),
('nodejs','/images/nodejs.png'),
('html','/images/html.png'),
('css','/images/css.png');

INSERT INTO "tag" ("name","image_id") VALUES
('base de données',2),
('javascript',3),
('nodejs',4),
('html',5),
('orm',1),
('git',1),
('github',1),
('sequelize',1),
('aws',1),
('express',1),
('sqitch',1),
('vuejs',1),
('eslint',1),
('sql',1),
('postgresql',1),
('mysql',1),
('react',1),
('css',6);
('ejs',6);
('VSC',6);
('visual studi code',6);
('atom',6);
('bracket',6);

INSERT INTO "link" ("compagny_name","picture_name") VALUES
('github', 'github.png'),
('linkedin','linkedin.png');
COMMIT;