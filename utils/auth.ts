import cryptojs from "crypto-js";

export function decrypt(encryptedString: string) {
    return cryptojs.AES.decrypt(encryptedString, process.env.ENCRYPTION_KEY!).toString(cryptojs.enc.Utf8);
}

export function encrypt(string: string) {
    return cryptojs.AES.encrypt(string, process.env.ENCRYPTION_KEY!).toString();
}