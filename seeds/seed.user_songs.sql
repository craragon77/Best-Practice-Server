BEGIN;
INSERT INTO user_songs(user_id, song_id, difficulty, instrument, desired_hours, comments)
VALUES
(
    1, 1, 'average', 'guitar', 10, 'a great piece!'
),
(
   2, 3, 'easy', 'piano', 13, 'a classic! one of my favorites!'
),
(
    3, 4, 'very easy', 'violin', 5, 'gotta learn this for my sisters wedding'
),
(
    2, 7, 'hard', 'piano', 20, 'pretty challenging, but im up for it'
),
(
    1, 2, 'very hard', 'guitar', 25, NULL
),
(
    1, 12, 'hard', 'guitar', 15, NULL
);

COMMIT;