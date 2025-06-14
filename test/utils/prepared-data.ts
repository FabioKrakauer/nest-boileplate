import { INestApplication } from "@nestjs/common";
import { signInUser, signUpUser } from "./sign-in-user";

export const prepareData = async ({app}: {app: INestApplication}) => {
    
    await signUpUser(app, {email: 'test@test.com', password: 'test', name: 'Test'});
    const signIn = await signInUser(app, {email: 'test@test.com', password: 'test'});
    return {
        accessToken: signIn.access_token,
        refreshToken: signIn.refresh_token,
    };
}