const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
RegExp.escape = string => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
let answer = {};
let strings = {};

async function simpleReplace() {

  //get user input

  function userInput() {
    return new Promise(resolve => {
      rl.question('What phrase should I look for? ', args => {
        answer.one = new RegExp(RegExp.escape(args), "g");
        rl.question('Phrase to replace with? : ', args => {
          answer.two = args;
          rl.close();
          resolve(answer);
        });
      });
    });
  }

  function readDir() {
    return new Promise(resolve => {
      fs.readdir('../files', (err, list) => {
        if (err) { throw err };
        //console.log(list)
        resolve(list);
      });
    });
  };
  await userInput();
  let list = await readDir();
  async function updateFiles() {
    for (let file of list) {
      let myFile = `../files/${file}`;
      myString = new Promise(resolve => {
        fs.readFile(myFile, 'utf-8', (err, data) => {
          if (err) throw err;
          strings.old = data;
          strings.new = data.replace(answer.one, answer.two);
          resolve(strings);
        });
      })
      strings = await myString;
      if (strings.old != strings.new) {
        fs.writeFile(myFile, strings.new, (err) => {
          if (err) throw err;
          console.log(`${myFile} was updated!`);
        })
      }
    }
  }
  updateFiles();

}
simpleReplace();