ALTER TABLE practice_history
ALTER start_time SET DEFAULT now();

ALTER TABLE practice_history
ALTER COLUMN end_time SET DEFAULT now();