import { hashPassword } from "./src/classes/cryptClass"



async function run() {
    const hashed = await hashPassword('123');
    console.log(hashed);
  }
run()