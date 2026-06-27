import crypto from "node:crypto"

export function toAes128Ccm(string) {
    const iv = "AcoviaStudio"
    const algorithm = "aes-128-ccm"
    crypto.generateKey("aes", {length:128}, (err,key) => {
        if (err) throw err;
        var result = crypto.createCipheriv(algorithm,key,iv,{authTagLength:16})
        const context = result.update(string,"utf-8","base64").toString()
        result.final()
        const authTag = result.getAuthTag().toString("base64")
        console.log("Info: " + context)
        console.log("Key: " + key.export().toString("base64"))
        console.log("Iv: " + iv)
        console.log("AuthTag: " + authTag)
        console.log("AuthTagLength: 16")
        console.log("Algorithm: " + algorithm)
    })
}

export function deAes128Ccm(info, key, iv, tag, length) {
    const algorithm = "aes-128-ccm"
    const deKey = Buffer.from(key, "base64")
    const deTag = Buffer.from(tag, "base64")
    const deAuthTagLength = {authTagLength:length}
    var result = crypto.createDecipheriv(algorithm, deKey, iv, deAuthTagLength)
    result.setAuthTag(deTag)
    const context = result.update(info,"base64","utf-8")
    try {
        result.final("utf-8")
    } catch(err) {
        throw new Error('Authentication failed!');
    }
    console.log("Context: " + context)
}