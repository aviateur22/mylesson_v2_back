BEGIN;

INSERT INTO "role" ("name") VALUES
('user'),
('teacher'),
('admin'),
('super admin');

INSERT INTO "user"("login","email","password","role_id") VALUES
('aviateur22','aviateur22@msn.com','$2b$10$x7U3SPvoeNVTKpLEBTC7UuXmn1BDg9AbeHjqDifDJ7efiTzjEMzq2','1'),
('aviateur22','aviateur22@hotmail.fr','$2b$10$x7U3SPvoeNVTKpLEBTC7UuXmn1BDg9AbeHjqDifDJ7efiTzjEMzq2','2'),
('aviateur22','aviateur22@gmail.com','$2b$10$x7U3SPvoeNVTKpLEBTC7UuXmn1BDg9AbeHjqDifDJ7efiTzjEMzq2','3');

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

COMMIT;