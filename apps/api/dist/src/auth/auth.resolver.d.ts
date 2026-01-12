import { AuthService } from './auth.service';
import { AuthPayload } from './auth.types';
export declare class AuthResolver {
    private readonly auth;
    constructor(auth: AuthService);
    login(username: string, password: string): Promise<AuthPayload>;
}
