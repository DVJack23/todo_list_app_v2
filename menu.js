// MENU
const prompt = require('prompt-sync')();
const chalk = require('chalk');
const { format } = require('date-fns');

function menu(myTasks) {
    console.clear();
    let currentDate = format(new Date(), 'yyyy-MM-dd');
    console.log(chalk.cyan.bold('╔══════════════════════════════════════╗'));
    console.log(chalk.cyan.bold('║') + chalk.yellow.bold('     PlanIt - Your TODO List App      ') + chalk.cyan.bold('║'));
    console.log(chalk.cyan.bold('║') + `        Today is ${chalk.green.bold(currentDate)}           ` + chalk.cyan.bold('║'));
    console.log(chalk.cyan.bold('╚══════════════════════════════════════╝'));
    console.log(chalk.blue.bold('[1]') + ' Show tasks');
    console.log(chalk.blue.bold('[2]') + ' Add new task');
    console.log(chalk.blue.bold('[3]') + ' Change Status');
    console.log(chalk.blue.bold('[4]') + ' Delete task');
    console.log(chalk.red.bold('[5]') + ' Exit application');
    console.log();
    const numberOfOptions = 5;
    let option = parseInt(prompt(chalk.magenta.bold(`Select: `)));
    while (isNaN(option) || option < 1 || option > numberOfOptions) {
        option = parseInt(prompt(`Select options [1] to [${numberOfOptions}]: `));
    }

    if (option === 1) {
        if (myTasks.tasks.length > 0) {
            myTasks.showTasks();
        } else {
            console.log(`No tasks to show.`)
        }
        return true;
    } else if (option === 2) {
        myTasks.addTask();
        return true;
    } else if (option === 3) {
        myTasks.markAsDone();
        return true;
    } else if (option === 4) {
        myTasks.deleteTask();
        return true;
    } else {
        return false;
    }
}

module.exports = menu;