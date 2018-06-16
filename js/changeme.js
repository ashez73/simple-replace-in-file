const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
RegExp.escape = string => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
var answer = {};

//get user input

const userInput = new Promise(resolve => {
    rl.question('What phrase should I look for? ', args => {
        answer.one = new RegExp(RegExp.escape(args), "g");
        rl.question('Phrase to replace with? : ', args => {
            answer.two = args;
            rl.close();
            resolve(answer);
        });
    });
});
userInput.then(answer => {
    let fileArray = (fs.readdirSync('../files'));
    let newString;
    let myString;
    console.log(`parsing following files: ${fileArray.toString()}`);

    //main loop: read data/replace data/write data

    for (let file = 0; file < fileArray.length; file++) {
        let myFile = `../files/${fileArray[file]}`;
        myString = new Promise(resolve => {
            fs.readFile(myFile, 'utf-8', (err, data) => {
                if (err) throw err;
                newString = data.replace(answer.one, answer.two);
                resolve(newString);
            });
        })
        myString.then(newString => {
            fs.writeFile(myFile, newString, (err) => {
                if (err) throw err;
                console.log(`${myFile} was updated!`);
            })});
    }
});
