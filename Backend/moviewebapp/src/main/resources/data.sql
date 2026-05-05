-- Seed data for MovieWebApp

INSERT INTO genre (id, name) VALUES
(1, 'Action'),
(2, 'Adventure'),
(3, 'Animation'),
(4, 'Comedy'),
(5, 'Crime'),
(6, 'Drama'),
(7, 'Fantasy'),
(8, 'Horror'),
(9, 'Mystery'),
(10, 'Romance'),
(11, 'Sci-Fi'),
(12, 'Thriller')
ON CONFLICT (name) DO NOTHING;

INSERT INTO actor (id, name, surname, avatar_path) VALUES
(1, 'Alex', 'Rowe', '/avatars/actors/actor-001.jpg'),
(2, 'Maya', 'Cruz', '/avatars/actors/actor-002.jpg'),
(3, 'Ethan', 'Park', '/avatars/actors/actor-003.jpg'),
(4, 'Lina', 'Stone', '/avatars/actors/actor-004.jpg'),
(5, 'Noah', 'Wells', '/avatars/actors/actor-005.jpg'),
(6, 'Iris', 'Khan', '/avatars/actors/actor-006.jpg'),
(7, 'Leo', 'Morgan', '/avatars/actors/actor-007.jpg'),
(8, 'Ava', 'Blake', '/avatars/actors/actor-008.jpg'),
(9, 'Owen', 'Price', '/avatars/actors/actor-009.jpg'),
(10, 'Zoe', 'Hale', '/avatars/actors/actor-010.jpg'),
(11, 'Mila', 'Reed', '/avatars/actors/actor-011.jpg'),
(12, 'Ryan', 'Cole', '/avatars/actors/actor-012.jpg'),
(13, 'Nora', 'Quinn', '/avatars/actors/actor-013.jpg'),
(14, 'Jack', 'Hayes', '/avatars/actors/actor-014.jpg'),
(15, 'Ella', 'Voss', '/avatars/actors/actor-015.jpg'),
(16, 'Finn', 'Adler', '/avatars/actors/actor-016.jpg'),
(17, 'Chloe', 'Bennett', '/avatars/actors/actor-017.jpg'),
(18, 'Caleb', 'Shaw', '/avatars/actors/actor-018.jpg'),
(19, 'Riley', 'North', '/avatars/actors/actor-019.jpg'),
(20, 'Sofia', 'Young', '/avatars/actors/actor-020.jpg'),
(21, 'Miles', 'Gray', '/avatars/actors/actor-021.jpg'),
(22, 'Aria', 'Fox', '/avatars/actors/actor-022.jpg'),
(23, 'Carter', 'Diaz', '/avatars/actors/actor-023.jpg'),
(24, 'Ruby', 'Hart', '/avatars/actors/actor-024.jpg')
ON CONFLICT (id) DO NOTHING;

INSERT INTO director (id, name, surname, avatar_path) VALUES
(1, 'Grace', 'Lam', '/avatars/directors/director-001.jpg'),
(2, 'Julian', 'Stone', '/avatars/directors/director-002.jpg'),
(3, 'Priya', 'Sato', '/avatars/directors/director-003.jpg'),
(4, 'Victor', 'Reed', '/avatars/directors/director-004.jpg'),
(5, 'Elena', 'Brooks', '/avatars/directors/director-005.jpg'),
(6, 'Marco', 'Silva', '/avatars/directors/director-006.jpg'),
(7, 'Harper', 'Cohen', '/avatars/directors/director-007.jpg'),
(8, 'Andre', 'Lopez', '/avatars/directors/director-008.jpg'),
(9, 'Tessa', 'Mori', '/avatars/directors/director-009.jpg'),
(10, 'Dylan', 'Price', '/avatars/directors/director-010.jpg'),
(11, 'Selena', 'Ward', '/avatars/directors/director-011.jpg'),
(12, 'Noel', 'Vega', '/avatars/directors/director-012.jpg')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (username, password, avatar_path)
SELECT
    'user' || LPAD(gs::text, 2, '0'),
    'password',
    '/avatars/users/user-' || LPAD(gs::text, 2, '0') || '.jpg'
FROM generate_series(1, 10) AS gs
ON CONFLICT (username) DO NOTHING;

INSERT INTO movie (id, title, description, release_date, duration_minutes, poster_url)
SELECT
    gs,
    'Fictional Movie ' || LPAD(gs::text, 5, '0'),
    'Fictional movie ' || LPAD(gs::text, 5, '0') || ' used for UI performance testing.',
    DATE '2000-01-01' + (gs * 17),
    85 + (gs % 55),
    '/posters/movie-' || LPAD(gs::text, 5, '0') || '.jpg'
FROM generate_series(1, 10000) AS gs
ON CONFLICT (id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT gs, ((gs - 1) % 12) + 1
FROM generate_series(1, 10000) AS gs
ON CONFLICT DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT gs, (gs % 12) + 1
FROM generate_series(1, 10000) AS gs
ON CONFLICT DO NOTHING;

INSERT INTO movie_actors (movie_id, actor_id)
SELECT gs, ((gs - 1) % 24) + 1
FROM generate_series(1, 10000) AS gs
ON CONFLICT DO NOTHING;

INSERT INTO movie_actors (movie_id, actor_id)
SELECT gs, ((gs + 7) % 24) + 1
FROM generate_series(1, 10000) AS gs
ON CONFLICT DO NOTHING;

INSERT INTO movie_directors (movie_id, director_id)
SELECT gs, ((gs - 1) % 12) + 1
FROM generate_series(1, 10000) AS gs
ON CONFLICT DO NOTHING;

INSERT INTO rating (id, rating, created_at, user_id, movie_id)
SELECT
    gs,
    1 + (gs % 10),
    NOW() - ((gs % 365) || ' days')::interval,
    ((gs - 1) % 10) + 1,
    gs
FROM generate_series(1, 10000) AS gs
ON CONFLICT (user_id, movie_id) DO NOTHING;

INSERT INTO review (id, content, created_at, user_id, movie_id)
SELECT
    gs,
    'Review for movie ' || LPAD(gs::text, 5, '0') || ' generated for performance testing.',
    NOW() - ((gs % 180) || ' days')::interval,
    ((gs + 3) % 10) + 1,
    gs
FROM generate_series(1, 5000) AS gs
ON CONFLICT (user_id, movie_id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('genre', 'id'), (SELECT COALESCE(MAX(id), 1) FROM genre));
SELECT setval(pg_get_serial_sequence('actor', 'id'), (SELECT COALESCE(MAX(id), 1) FROM actor));
SELECT setval(pg_get_serial_sequence('director', 'id'), (SELECT COALESCE(MAX(id), 1) FROM director));
SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval(pg_get_serial_sequence('movie', 'id'), (SELECT COALESCE(MAX(id), 1) FROM movie));
SELECT setval(pg_get_serial_sequence('rating', 'id'), (SELECT COALESCE(MAX(id), 1) FROM rating));
SELECT setval(pg_get_serial_sequence('review', 'id'), (SELECT COALESCE(MAX(id), 1) FROM review));
