-- Створити базу flora_db (запускай під користувачем postgres).
-- Якщо база вже є — команда завершиться з помилкою, це нормально.

CREATE DATABASE flora_db
    WITH
    OWNER = postgres
    ENCODING = 'UTF8';
