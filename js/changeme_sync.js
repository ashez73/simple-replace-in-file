const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
RegExp.escape = string => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
let answer = {};
let string = {};

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
    let myFile;
    let data;

    //main loop: read data/replace data/write data

    for (let file of fileArray) {
        myFile = `../files/${file}`;
        //sync version directly returns file content
        data = fs.readFileSync(myFile,'utf-8');
        string.old = data;
        string.new = data.replace(answer.one, answer.two);
        if (string.old != string.new) {
          //yeah, nothing returned for sync version again
          fs.writeFileSync(myFile, string.new, 'utf-8');
          console.log(`${myFile} updated`);
        };  
    };   
});
