import { scrypt, randomBytes, createCipheriv, createDecipheriv } from 'crypto';
const algorithm = process.env.ALGORITHM;
const secretKey = process.env.SECRETKEY;
const iv = randomBytes(16);

const encrypt = (text:any) => {

    const cipher = createCipheriv(algorithm as any, secretKey as any, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

const decrypt = (hash:any) => {

    const decipher = createDecipheriv(algorithm as any, secretKey as any, Buffer.from(hash.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

export { encrypt, decrypt };