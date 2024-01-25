-- Tables like passengers, seats, airlines, cities, and flights have been placed in separate tables.
-- Relationships between entities are established using foreign keys.
-- The tickets table now references passengers, seats, and flights using foreign keys.

DROP DATABASE IF EXISTS air_traffic;

CREATE DATABASE air_traffic;

\c air_traffic

CREATE TABLE passengers
(
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL
);

CREATE TABLE seats
(
  id SERIAL PRIMARY KEY,
  seat_number TEXT NOT NULL
);

CREATE TABLE airlines
(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE cities
(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL
);

CREATE TABLE flights
(
  id SERIAL PRIMARY KEY,
  departure TIMESTAMP NOT NULL,
  arrival TIMESTAMP NOT NULL,
  airline_id INTEGER REFERENCES airlines(id),
  from_city_id INTEGER REFERENCES cities(id),
  to_city_id INTEGER REFERENCES cities(id)
);

CREATE TABLE tickets
(
  id SERIAL PRIMARY KEY,
  passenger_id INTEGER REFERENCES passengers(id),
  seat_id INTEGER REFERENCES seats(id),
  flight_id INTEGER REFERENCES flights(id)
);

INSERT INTO passengers (first_name, last_name)
VALUES
  ('Jennifer', 'Finch'),
  ('Thadeus', 'Gathercoal'),
  ('Sonja', 'Pauley'),
  ('Waneta', 'Skeleton'),
  ('Berkie', 'Wycliff'),
  ('Alvin', 'Leathes'),
  ('Cory', 'Squibbes');

INSERT INTO seats (seat_number)
VALUES
  ('33B'),
  ('8A'),
  ('12F'),
  ('20A'),
  ('23D'),
  ('18C'),
  ('9E'),
  ('1A'),
  ('32B'),
  ('10D');

INSERT INTO airlines (name)
VALUES
  ('United'),
  ('British Airways'),
  ('Delta'),
  ('TUI Fly Belgium'),
  ('Air China'),
  ('American Airlines'),
  ('Avianca Brasil');

INSERT INTO cities (name, country)
VALUES
  ('Washington DC', 'United States'),
  ('Tokyo', 'Japan'),
  ('Los Angeles', 'United States'),
  ('Seattle', 'United States'),
  ('Paris', 'France'),
  ('Dubai', 'UAE'),
  ('New York', 'United States'),
  ('Cedar Rapids', 'United States'),
  ('Charlotte', 'United States'),
  ('Sao Paolo', 'Brazil'),
  ('Chicago', 'United States'),
  ('New Orleans', 'United States'),
  ('Mexico City', 'Mexico'),
  ('Casablanca', 'Morocco'),
  ('Beijing', 'China'),
  ('Santiago', 'Chile');

INSERT INTO flights (departure, arrival, airline_id, from_city_id, to_city_id)
VALUES
  ('2018-04-08 09:00:00', '2018-04-08 12:00:00', 1, 1, 4),
  ('2018-12-19 12:45:00', '2018-12-19 16:15:00', 2, 11, 6),
  ('2018-01-02 07:00:00', '2018-01-02 08:03:00', 3, 3, 10),
  ('2018-04-15 16:50:00', '2018-04-15 21:00:00', 3, 4, 13),
  ('2018-08-01 18:30:00', '2018-08-01 21:50:00', 4, 5, 14),
  ('2018-10-31 01:15:00', '2018-10-31 12:55:00', 5, 6, 15),
  ('2019-02-06 06:00:00', '2019-02-06 07:47:00', 1, 7, 8),
  ('2018-12-22 14:42:00', '2018-12-22 15:56:00', 6, 9, 12),
  ('2019-02-06 16:28:00', '2019-02-06 19:18:00', 6, 8, 11),
  ('2019-01-20 19:30:00', '2019-01-20 22:45:00', 7, 14, 16);

INSERT INTO tickets (passenger_id, seat_id, flight_id)
VALUES
  (1, 1, 1),
  (2, 2, 2),
  (3, 3, 3),
  (1, 4, 4),
  (4, 5, 5),
  (2, 6, 6),
  (5, 7, 7),
  (6, 8, 8),
  (5, 9, 9),
  (7, 10, 10);

  -- Example Query for finding all flight information about Alvin Leathes -> 
  
  -- SELECT
--   t.id AS ticket_id,
--   p.first_name,
--   p.last_name,
--   t.seat_id,
--   a.name AS airline,
--   dep_city.name AS departure_city,
--   dep_city.country AS departure_country,
--   dest_city.name AS destination_city,
--   dest_city.country AS destination_country,
--   t.flight_id
-- FROM
--   tickets t
-- JOIN
--   passengers p ON t.passenger_id = p.id
-- JOIN
--   flights f ON t.flight_id = f.id
-- JOIN
--   airlines a ON f.airline_id = a.id
-- JOIN
--   cities dep_city ON f.from_city_id = dep_city.id
-- JOIN
--   cities dest_city ON f.to_city_id = dest_city.id
-- WHERE
--   p.first_name = 'Alvin' AND p.last_name = 'Leathes';