BEGIN;
INSERT INTO user_songs(user_id, song_id, difficulty, instrument, desired_hours, comments)
VALUES
(
    1, 13, 'average', 'guitar', 10, 'a great piece!'
),
(
   2, 15, 'easy', 'piano', 13, 'a classic! one of my favorites!'
),
(
    3, 16, 'very easy', 'violin', 5, 'gotta learn this for my sisters wedding'
),
(
    2, 19, 'hard', 'piano', 20, 'pretty challenging, but im up for it'
),
(
    1, 14, 'very hard', 'guitar', 25, NULL
),
(
    1, 17, 'hard', 'guitar', 15, NULL
);

COMMIT;