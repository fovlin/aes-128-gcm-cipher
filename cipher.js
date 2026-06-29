import crypto from "node:crypto"
import fs from "node:fs"

export function encrypt(algorithm, plaintext, keyLength, authTagLength) {
    const iv = crypto.randomBytes(12);
    crypto.generateKey("aes",{ length:keyLength },(err,key) => {
        if (err) throw err;
        var cipher = crypto.createCipheriv(algorithm,key,iv,{authTagLength:authTagLength});
        const ciphertext = cipher.update(plaintext, "utf-8", "hex") + cipher.final("hex"),
        tag = cipher.getAuthTag();
        console.log("Ciphertext: " + ciphertext);
        console.log("Algorithm: " + algorithm);
        console.log("Key: " + key.export().toString("hex"));
        console.log("Iv: " + iv.toString("hex"));
        console.log("Tag: " + tag.toString("hex"));
        console.log("AuthTagLength: " + authTagLength);
    })
}

export function decrypt(algorithm, ciphertext, key, iv, tag, authTagLength) {
    var deCiphertext = crypto.createDecipheriv(algorithm, Buffer.from(key,"hex"), Buffer.from(iv,"hex"), {authTagLength:authTagLength});
    deCiphertext.setAuthTag(Buffer.from(tag,"hex"));
    const context = deCiphertext.update(ciphertext, "hex", "utf-8") + deCiphertext.final("utf-8");
    console.log(context);
    return context;
}

export function encryptFile(algorithm, file, keyLength, authTagLength) {
    const fileData = fs.readFileSync(file),
    iv = crypto.randomBytes(12);
    crypto.generateKey("aes",{ length:keyLength },(err,key) => {
        if (err) throw err;
        var cipher = crypto.createCipheriv(algorithm,key,iv,{authTagLength:authTagLength});
        const cipherData = Buffer.concat([cipher.update(fileData), cipher.final()]);
        tag = cipher.getAuthTag();
        fs.writeFileSync(file + ".enc",cipherData);
        console.log("Algorithm: " + algorithm);
        console.log("Key: " + key.export().toString("hex"));
        console.log("Iv: " + iv.toString("hex"));
        console.log("Tag: " + tag.toString("hex"));
        console.log("AuthTagLength: " + authTagLength);
        const secData = Buffer.from(
            JSON.stringify(
                {
                    "algorithm": algorithm,
                    "key": key.export().toString("hex"),
                    "iv": iv.toString("hex"),
                    "tag": tag.toString("hex"),
                    "authTagLength": authTagLength
                }
            )
        )
        fs.writeFileSync(file + ".key", secData)
    })
}

export function decryptFile(file, keyFile) {
    const ciphertext = fs.readFileSync(file),
    secText = JSON.parse(fs.readFileSync(keyFile).toString()),
    algorithm = secText["algorithm"],
    key = secText["key"],
    iv = secText["iv"],
    tag = secText["tag"],
    authTagLength = secText["authTagLength"]
    var deCiphertext = crypto.createDecipheriv(algorithm, Buffer.from(key,"hex"), Buffer.from(iv,"hex"), {authTagLength:authTagLength});
    deCiphertext.setAuthTag(Buffer.from(tag,"hex"));
    const context = Buffer.concat([deCiphertext.update(ciphertext), deCiphertext.final()]);
    console.log(context);
    fs.writeFileSync(file.replace(".enc",""),context)
}
