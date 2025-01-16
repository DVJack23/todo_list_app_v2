const menu = require('./menu.js');
const List = require("./list");


let myTasks = new List();
myTasks.loadFromFile()
let launch = true;
while (launch) {
    launch = menu(myTasks);
}
myTasks.saveToFile()