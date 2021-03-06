-- Deploy mylesson:initdb to pg

BEGIN;

CREATE TABLE "role"(
    "id" integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE DEFAULT 'user',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "image"(
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,    
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "tag"(
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "image_id" INTEGER NOT NULL DEFAULT 1 REFERENCES "image"("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "user"(
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "login" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "token" TEXT NOT NULL DEFAULT '-',
    "avatar_key" TEXT NOT NULL DEFAULT 'THUMBNAIL-DEFAULT_AVATAR.png',
    "sex" TEXT,
    "role_id" INTEGER NOT NULL DEFAULT 1 REFERENCES "role"("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "thematic"(
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "image_name" TEXT NOT NULL DEFAULT 'unknow.png',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "lesson"(
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "title" TEXT NOT NULL UNIQUE,
    "content" TEXT NOT NULL DEFAULT 'empty',
    "slug" TEXT NOT NULL UNIQUE, 
    "summary" TEXT NOT NULL, 
    "user_id" INTEGER NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "thematic_id" INTEGER NOT NULL REFERENCES "thematic"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "link"(
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "compagny_name" TEXT NOT NULL UNIQUE,
    "image_name" TEXT NOT NULL DEFAULT 'unknow.png',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "lesson_has_tag"(
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "lesson_id" INTEGER NOT NULL REFERENCES "lesson"("id") ON DELETE CASCADE,
    "tag_id" INTEGER NOT NULL REFERENCES "tag"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "user_has_link"(
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,   
    "user_id" INTEGER NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "link_id" INTEGER NOT NULL REFERENCES "link"("id") ON DELETE CASCADE,
    "link_url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

COMMIT;
