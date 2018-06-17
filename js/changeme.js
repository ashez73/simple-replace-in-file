const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
RegExp.escape = string => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
let answer = {};
let strings = {};

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
    //TODO: change to sync version for sake of consistency 
    let fileArray = (fs.readdirSync('../files'));
    let newString;
    let myString;
    console.log(`parsing following files: ${fileArray.toString()}`);

    //main loop: read data/replace data/write data

    for (let file of fileArray) {
        let myFile = `../files/${file}`;
        myString = new Promise(resolve => {
            fs.readFile(myFile, 'utf-8', (err, data) => {
                if (err) throw err;
                strings.old =data;
                strings.new = data.replace(answer.one, answer.two);
                resolve(strings);
            });
        })
        myString.then(strings => {
            if (strings.old != strings.new) {
            fs.writeFile(myFile, strings.new, (err) => {
                if (err) throw err;
                console.log(`${myFile} was updated!`);
            })}});
    }
});
