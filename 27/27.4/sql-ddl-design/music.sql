-- In this improved structure, we have separate tables for artists and producers, and the songs table references them using foreign keys. This provides a more normalized structure.

DROP DATABASE IF EXISTS music;

CREATE DATABASE music;

\c music


CREATE TABLE artists
(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE producers
(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE songs
(
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  duration_in_seconds INTEGER NOT NULL,
  release_date DATE NOT NULL,
  album TEXT NOT NULL,
  artist_id INTEGER REFERENCES artists(id),
  producer_id INTEGER REFERENCES producers(id)
);

INSERT INTO artists (name) VALUES
  ('Hanson'),
  ('Queen'),
  ('Mariah Carey'),
  ('Boyz II Men'),
  ('Lady Gaga'),
  ('Bradley Cooper'),
  ('Nickelback'),
  ('Jay Z'),
  ('Alicia Keys'),
  ('Katy Perry'),
  ('Juicy J'),
  ('Maroon 5'),
  ('Christina Aguilera'),
  ('Avril Lavigne'),
  ('Destiny''s Child');

INSERT INTO producers (name) VALUES
  ('Dust Brothers'),
  ('Stephen Lironi'),
  ('Roy Thomas Baker'),
  ('Walter Afanasieff'),
  ('Benjamin Rice'),
  ('Rick Parashar'),
  ('Al Shux'),
  ('Max Martin'),
  ('Cirkut'),
  ('Shellback'),
  ('Benny Blanco'),
  ('The Matrix'),
  ('Darkchild');

INSERT INTO songs
  (title, duration_in_seconds, release_date, album, artist_id, producer_id)
VALUES
  ('MMMBop', 238, '1997-04-15', 'Middle of Nowhere', 1, 1),
  ('Bohemian Rhapsody', 355, '1975-10-31', 'A Night at the Opera', 2, 2),
  ('One Sweet Day', 282, '1995-11-14', 'Daydream', 3, 3),
  ('Shallow', 216, '2018-09-27', 'A Star Is Born', 4, 4),
  ('How You Remind Me', 223, '2001-08-21', 'Silver Side Up', 5, 5),
  ('New York State of Mind', 276, '2009-10-20', 'The Blueprint 3', 6, 6),
  ('Dark Horse', 215, '2013-12-17', 'Prism', 7, 7),
  ('Moves Like Jagger', 201, '2011-06-21', 'Hands All Over', 8, 8),
  ('Complicated', 244, '2002-05-14', 'Let Go', 9, 9),
  ('Say My Name', 240, '1999-11-07', 'The Writing''s on the Wall', 10, 10);