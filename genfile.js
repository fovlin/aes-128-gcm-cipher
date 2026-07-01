import { randomBytes } from "node:crypto";
import { stdin as input, stdout as output } from 'node:process';
import fs from "node:fs"
import readline from "node:readline/promises"

const rl = readline.createInterface({ input, output });

rl.question("Size: ").then(
    (size) => {
        if (size > 16 * 1024) {
            throw new Error("Size must < 24G!");
        }
        const chunk = randomBytes(1 * 1024 * 1024);
        var writeStream = fs.createWriteStream("entryfile");
        var i = 0;
        write(chunk,size,i,writeStream)
        rl.close()
    }
)

function write(chunk,size, i, writeStream) {
    if (i < size) {
        writeStream.write(chunk,(err) => {
            if (err) throw err;
            i++;
            process.stdout.write("Progress: " + Math.floor(i / size * 100) + "%\r")
            write(chunk,size, i, writeStream);
        })
    } else {
        console.log("\nDone!")
    }
}