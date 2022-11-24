import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Key {
  static generatePrivate(){
    return randomBytes(16).toString('hex');
  }
  static async generatePublic(privateKey?:string) {
    const salt = (privateKey)?privateKey:randomBytes(16).toString('hex');
    const key = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(key, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${key}`;
  }
  static async checkAccess(publicKey:string,privateKey?:string ){
    if(!privateKey){
      return false
    }
    const [hashedPassword, key] = publicKey.split('.');
    const buf = (await scryptAsync(key, privateKey, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}
