import crypto from "node:crypto"
import fs from "node:fs"

export function encrypt(algorithm, ciphertext, keyLength, authTagLength) {
    const iv = crypto.randomBytes(12);
    crypto.generateKey("aes",{ length:keyLength },(err,key) => {
        if (err) throw err;
        var cipher = crypto.createCipheriv(algorithm,key,iv,{authTagLength:authTagLength});
        const result = cipher.update(ciphertext, "utf-8", "hex");
        cipher.final();
        const tag = cipher.getAuthTag();
        console.log("Ciphertext: " + result);
        outPut(algorithm, result, key, iv, tag, authTagLength)
    })
}

export function decrypt(algorithm, ciphertext, key, iv, tag, authTagLength) {
    var deCiphertext = crypto.createDecipheriv(algorithm, Buffer.from(key,"hex"), Buffer.from(iv,"hex"), {authTagLength:authTagLength});
    deCiphertext.setAuthTag(Buffer.from(tag,"hex"));
    const context = deCiphertext.update(ciphertext, "hex", "utf-8");
    deCiphertext.final();
    console.log(context);
    return context;
}

function outPut(algorithm, result, key, iv, tag, authTagLength) {
    console.log("Algorithm: " + algorithm);
    console.log("Key: " + key.export().toString("hex"));
    console.log("Iv: " + iv.toString("hex"));
    console.log("Tag: " + tag.toString("hex"));
    console.log("AuthTagLength: " + authTagLength);
}

export function encryptFile(algorithm, file, keyLength, authTagLength) {
    const context = fs.readFileSync(file).toString()
    const iv = crypto.randomBytes(12);
    crypto.generateKey("aes",{ length:keyLength },(err,key) => {
        if (err) throw err;
        var cipher = crypto.createCipheriv(algorithm,key,iv,{authTagLength:authTagLength});
        const result = cipher.update(context, "utf-8", "hex");
        cipher.final();
        const tag = cipher.getAuthTag();
        outPut(algorithm, result, key, iv, tag, authTagLength);
        fs.writeFileSync("cipher.sec",result);
    })
}

export function decipherFile(algorithm, file, key, iv, tag, authTagLength) {
    const ciphertext = fs.readFileSync(file).toString()
    const context = decrypt(algorithm, ciphertext, key, iv, tag, authTagLength);
    fs.writeFileSync("output",context)
}
