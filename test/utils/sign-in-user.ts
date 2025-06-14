import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { User } from "../../src/modules/auth/entities/User.entity";

export const signInUser = async (app: INestApplication, data: {email: string, password: string}) => {

    const res = await request(app.getHttpServer())
        .post('/v1/auth/sign-in')
        .send(data);

    console.log("RES", res);

    return res.body;
}

export const signUpUser = async (app: INestApplication, data: {email: string, password: string, name: string}) => {
    const res = await request(app.getHttpServer())
        .post('/v1/auth/sign-up')
        .send(data);

    return res.body;
}