import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { SeederOptions } from 'typeorm-extension';

dotenv.config();

function database() {
    const environment = process.env.APP_ENV || 'test';
    return environment === 'test' ? process.env.DB_NAME_TEST : process.env.DB_NAME;
}

const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    port: Number(process.env['DB_PORT']),
    host: process.env['DB_HOST'],
    username: process.env['DB_USER'],
    password: process.env['DB_PASSWORD'],
    database: database(),
    logging: false,
    entities: ['src/**/*.entity{.js,.ts}'],
    migrations: ['src/migrations/*.ts'],
    seeds: ['src/lib/typeorm/seeds/seeders/*{.ts,.js}'],
};

const dataSource = new DataSource(options);

export default dataSource;