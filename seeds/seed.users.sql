BEGIN;
INSERT INTO users(username, password)
VALUES
('Guest-1', 'Password-1'),
('Guest-2', 'Password-2'),
('Guest-3', 'Password-3'),
('Hash-Guest-1', '$2a$10$9XdrJmR00nmN3YZdBMF/POOhTMhupMhpacWj2WRLCIpQ4GxxERBVW'),
('Hash-Guest-2', '$2a$10$.GByYnlIu.LUC2lzptIPPuG73UKJPSCEoyifnHPkqoiRw7TEILgBC');

COMMIT;

