BEGIN;

INSERT INTO "role" ("name") VALUES
('user'),
('teacher'),
('admin'),
('super admin');

INSERT INTO "user"("login","email","password","role_id", "avatar_key") VALUES
('aviateur22','aviateur22@msn.com','$2b$10$x7U3SPvoeNVTKpLEBTC7UuXmn1BDg9AbeHjqDifDJ7efiTzjEMzq2','1', 'THUMBNAIL_DEFAULT_AVATAR.png'),
('aviateur21','aviateur22@hotmail.fr','$2b$10$x7U3SPvoeNVTKpLEBTC7UuXmn1BDg9AbeHjqDifDJ7efiTzjEMzq2','2', 'THUMBNAIL_DEFAULT_AVATAR.png'),
('aviateur23','aviateur22@gmail.com','$2b$10$x7U3SPvoeNVTKpLEBTC7UuXmn1BDg9AbeHjqDifDJ7efiTzjEMzq2','3', 'THUMBNAIL_DEFAULT_AVATAR.png');

INSERT INTO "image" ("name") VALUES
('default.png'),
('aws.png'),
('nodejs.png'),
('azur.png'),
('express.png'),
('heroku.png'),
('react.png'),
('sequelize.png'),
('sqitch.png'),
('vuejs.png'),
('postgresql.png'),
('github.png'),
('git.png'),
('vsc.png'),
('bracket.png'),
('mysql.png'),
('netlify.png');

INSERT INTO "tag" ("name","image_id") VALUES
('base de données',1),
('javascript',1),
('nodejs',3),
('html',1),
('orm',1),
('git',1),
('github',1),
('sequelize',8),
('aws',2),
('azur',4),
('microsoft',1),
('heroku',6),
('netlify',17),
('express',5),
('sqitch',9),
('vuejs',10),
('eslint',1),
('sql',1),
('postgresql',11),
('mysql',16),
('react',7),
('css',1),
('ejs',1),
('vsc',14),
('atom',1),
('axios',1),
('fetch',1),
('jest',1),
('cookie',1),
('poo',1),
('bracket',15);
('hook',1);

INSERT INTO "link" ("compagny_name","image_name") VALUES
('github', 'github.png'),
('facebook', 'facebook.png'),
('linkedin','linkedin.png');

INSERT INTO "thematic" ("name", "image_name") VALUES
('tutorial', 'tutorial.png'),
('lesson', 'lesson.png');
('conseil', 'lesson.png');
('astuce', 'lesson.png');

COMMIT;