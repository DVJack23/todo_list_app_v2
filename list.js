const fs = require('fs');
const prompt = require('prompt-sync')();
const Task = require('./task.js');
const { format, compareAsc, isValid, parseISO } = require('date-fns');

class List {
    constructor(tasks = [],ids = [], idCounter = 0, highestId = 1) {
        this.tasks = tasks;
        this.ids = ids;
        this.idCounter = idCounter;
        this.highestId = highestId;
        this.filter = 0;
    }

    // ADD NEW TASK
    addTask() {
        console.log(`ADD NEW TASK`);
        let id;
        if (this.ids.length === 0) {
            id = this.highestId;
            this.highestId ++;
        } else {
            id = this.ids[0];
            this.ids.splice(0,1);
        }
        this.idCounter ++;
        let title = prompt(`Title: `);
        let dueDate;
        while(true) {
            dueDate = prompt(`Due Date (YYYY-MM-DD): `);
            if (isValid(parseISO(dueDate))) {
                break;
            } else {
                console.log(`Invalid date format - use (YYYY-MM-DD).`);
            }
        }
        let description = prompt(`Description: `);
        let completed = false;

        let newTask = new Task(id, title, dueDate, description, completed);
        this.tasks.push(newTask);
        this.saveToFile();
        console.log();
    }

    // DELETE TASK
    deleteTask() {
        console.log(`DELETE TASK`);
        for (let task of this.tasks) {
            console.log(`ID: [${task.id}] Title: ${task.title}`);
            console.log(`Due Date: ${task.dueDate} Completed: ${task.completed}`);

        }

        let deleteOption = parseInt(prompt(`Select task ID: `));
        while (isNaN(deleteOption) || deleteOption < 1 || deleteOption > this.idCounter) {
            deleteOption = parseInt(prompt(`Select options [1] to [${this.idCounter}]: `));
        }

        let index = 1
        for (let task of this.tasks) {
            if (task.id !== deleteOption) {
                index ++;
            }
            if (task.id === deleteOption) {
                this.ids.push(task.id);
                this.tasks.splice(index - 1, 1);
                this.idCounter --;
            }
        }
        this.saveToFile();
        console.log();
    }

    // CHANGE TASK STATUS
    markAsDone() {
        console.log(`CHANGE TASK STATUS`);
        for (let task of this.tasks) {
            console.log(`ID: [${task.id}] Title: ${task.title}`);
            console.log(`Due Date: ${task.dueDate} Completed: ${task.completed}`);
        }

        let markOption = parseInt(prompt(`Select task ID: `));
        while (isNaN(markOption) || markOption < 1 || markOption > this.idCounter) {
            markOption = parseInt(prompt(`Select options [1] to [${this.idCounter}]: `));
        }

        for (let task of this.tasks) {
            if (task.id === markOption) {
                task.completed = task.completed === false;
            }
        }
        this.saveToFile();
        console.log();
    }

    // SHOW TASKS
    showTasks() {
        if (this.filter === 1) {
            this.showIncomplete()
        } else if (this.filter === 2) {
            this.showCompleted()
        } else {
            this.showAll()
        }
        let option = this.showOptions();
        if (option === 2) {
            this.sortByTitle();
            this.showTasks();
        } else if (option === 3) {
            this.sortById();
            this.showTasks();
        } else if (option === 1) {
            this.filter ++;
            if (this.filter > 2) {
                this.filter = 0;
            }
            this.showTasks();
        } else if (option === 4) {
            this.sortByDueDate()
            this.showTasks();
            // TODO - Order by Due Date
        } else {
            this.sortById()
            console.log();
        }
    }

    sortById() {
        this.tasks.sort((a, b) => a.id - b.id);
    }

    sortByTitle() {
        this.tasks.sort((a, b) => a.title.localeCompare(b.title));
    }

    sortByDueDate() {
        this.tasks.sort((a, b) => {
            const dateA = parseISO(a.dueDate);
            const dateB = parseISO(b.dueDate);

            return compareAsc(dateA, dateB);
        });
    }

    showAll() {
        console.log(`ALL TASKS`);
        for (let task of this.tasks) {
            console.log(`\nID: ${task.id} Title: ${task.title}`);
            console.log(`Due Date: ${task.dueDate}`);
            console.log(`Description: ${task.description}`);
            console.log(`Completed: ${task.completed}`);
        }
    }

    showCompleted() {
        console.log(`YOUR COMPLETED TASKS`);
        for (let task of this.tasks) {
            if (task.completed === true) {
                console.log(`\nID: ${task.id} Title: ${task.title}`);
                console.log(`Due Date: ${task.dueDate}`);
                console.log(`Description: ${task.description}`);
                console.log(`Completed: ${task.completed}`);
            }
        }
    }

    showIncomplete() {
        console.log(`YOUR INCOMPLETE TASKS`);
        for (let task of this.tasks) {
            if (task.completed === false) {
                console.log(`\nID: ${task.id} Title: ${task.title}`);
                console.log(`Due Date: ${task.dueDate}`);
                console.log(`Description: ${task.description}`);
                console.log(`Completed: ${task.completed}`);
            }
        }
    }

    showOptions() {
        console.log(`-------------------------------------`);
        console.log(`[1] - Filter complete/incomplete`)
        console.log(`[2] - order by Title`);
        console.log(`[3] - Order by ID`)
        console.log(`[4] - Order by Due Date`);
        console.log(`[5] - Back to menu`)
        let option = parseInt(prompt(`Select option: `));
        while (isNaN(option) || option < 1 || option > 5) {
            option = prompt(`Select option [1] to [5]: `);
        }
        return option;
    }

    // FILE OPERATIONS
    saveToFile(filename = './save.json') {
        this.sortById();
        const data = {
            tasks : this.tasks,
            ids : this.ids,
            idCounter : this.idCounter,
            highestId : this.highestId,
        };
        try {
            fs.writeFileSync(filename, JSON.stringify(data, null, 4), 'utf-8');
            // console.log(`Tasks saved successfully to ${filename}!`);
        } catch (err) {
            console.error(`Error saving data:`, err);
        }
    }

    loadFromFile(filename = './save.json') {
        if (fs.existsSync(filename)) {
            try {
                const data = JSON.parse(fs.readFileSync(filename, 'utf-8'));
                this.tasks = data.tasks.map(
                    task => new Task(task.id, task.title, task.dueDate, task.description, task.completed)
                );
                this.ids = data.ids || [];
                this.idCounter = data.idCounter || 0;
                this.highestId = data.highestId || 1;

                // console.log(`Tasks loaded successfully from ${filename}!`);
            } catch (err) {
                console.error(`Error loading data:`, err);
            }
        }
        // else {
        //     console.log(`Save file not found: ${filename}`);
        // }
    }
}

module.exports = List;
