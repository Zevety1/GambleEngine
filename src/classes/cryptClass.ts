import { hash, compare } from 'bcrypt';


export async function hashPassword(password:string):Promise<string> {
    return await hash(password, Number(process.env.SALT));
}


export async function comaprePasswords(passwordInBody:string, passwordInDB:string):Promise<boolean> {
    return await compare(passwordInBody, passwordInDB);
}