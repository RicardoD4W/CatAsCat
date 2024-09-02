import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: import.meta.env.HOST,
  user: import.meta.env.USER,
  password: import.meta.env.PASS,
  database: import.meta.env.DB
});

