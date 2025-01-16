const prompt = require('prompt-sync')();

function menu(myTasks) {
    console.log(`Welcome to Your TODO list!`)
    console.log(`[1] Show tasks`);
    console.log(`[2] Add new task`);
    console.log(`[3] Mark as done`);
    console.log(`[4] Delete task`);
    console.log(`[5] Exit application`);
    const numberOfOptions = 5;
    let option = parseInt(prompt(`Select: `));
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