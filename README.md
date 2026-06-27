# aes-128-gcm-cipher

```js
import {toAes128Gcm, deAes128Gcm} from "./aes128gcm.js"

toAes128Gcm("Hello World!")

/* result:
 Code: base64
 Key: fNaAvZ4cC6DTWIAXA81WiQ==
 Iv: acovia
 Algorithm: aes-128-gcm
 Info: sNo77w35IXtOLreZ
*/

deAes128Gcm("sNo77w35IXtOLreZ","fNaAvZ4cC6DTWIAXA81WiQ","acovia")

/* result:
 Hello World!
*/
```