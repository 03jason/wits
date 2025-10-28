/* =========================================================
   SEED — USERS (démo)
   ========================================================= */
SET NAMES utf8mb4; SET FOREIGN_KEY_CHECKS=0;

INSERT INTO users (email, user_pseudo, password_hash, first_name, last_name, role) VALUES
    ('arthur@gmail.com', 'arty', 'arty123', 'Arthur', 'Morgan', 'admin'),
    ('nathan@hotmail.com', 'nate', 'nate123', 'Nathan', 'Drake', 'staff'),
    ('jason@gmail.com', 'jay', 'jay123', 'Jason', 'Jason', 'CEO');

SET FOREIGN_KEY_CHECKS=1;
