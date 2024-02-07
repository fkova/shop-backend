import { config } from 'dotenv';
config();

console.log(Buffer.from(`fkova:${process.env.fkova}`).toString('base64'));