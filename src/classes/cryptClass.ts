import * as bcrypt from 'bcrypt';

export async function hashPassword(password) {
    return await bcrypt.hash(password, process.env.SAULT);
}

export async function comaprePasswords(passwordInBody, passwordInDB) {
    return await bcrypt.compare(passwordInBody, passwordInDB)
}
