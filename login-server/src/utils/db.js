import { Sequelize } from 'sequelize';

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE_NAME } = process.env;

export const client = new Sequelize({
  host: DB_HOST,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE_NAME,
  dialect: 'postgres',
});
