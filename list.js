const fs = require('fs');
const prompt = require('prompt-sync')();
const Task = require('./task.js');

class List {
    constructor(tasks = [],ids = [], idCounter = 0, highestId = 1) {
        this.tasks = tasks;
        this.ids = ids;
        this.idCounter = idCounter;
        this.highestId = highestId;
    }

    addTask() {
        console.log(`ADD NEW TASK`);
        let id = 0;
        if (this.ids.length === 0) {
            id = this.highestId;
            this.highestId ++;
        } else {
            id = this.ids[0];
        }
        this.idCounter ++;
        let title = prompt(`Title: `);
        let description = prompt(`Description: `);
        let completed = false;

        let newTask = new Task(id, title, description, completed);
        this.tasks.push(newTask);
        console.log();
    }

    deleteTask() {
        console.log(`DELETE TASK`);
        for (let task of this.tasks) {
            console.log(`ID: [${task.id}] Title: ${task.title}`);
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
        console.log();
    }

    markAsDone() {
        console.log(`MARK AS DONE`);
        for (let task of this.tasks) {
            console.log(`ID: [${task.id}] Title: ${task.title}`);
        }

        let markOption = parseInt(prompt(`Select task ID: `));
        while (isNaN(markOption) || markOption < 1 || markOption > this.idCounter) {
            markOption = parseInt(prompt(`Select options [1] to [${this.idCounter}]: `));
        }

        for (let task of this.tasks) {
            if (task.id === markOption) {
                task.completed = true;
            }
        }
        console.log();
    }

    showTasks() {
        console.log(`YOUR TASKS`);
        for (let task of this.tasks) {
            console.log(`ID: [${task.id}] Title: ${task.title}`);
            console.log(`Description: ${task.description}`);
            console.log(`Completed: ${task.completed}\n`);
        }
    }

    saveToFile(filename = './save.json') {
        const data = JSON.stringify(this.tasks, null, 4);
        try {
            fs.writeFileSync(filename, data, 'utf-8');
            console.log(`Tasks saved successfully to ${filename}!`);
        } catch (err) {
            console.error(`Error saving data:`, err);
        }
    }

    loadFromFile(filename = './save.json') {
        if (fs.existsSync(filename)) {
            try {
                const data = fs.readFileSync(filename, 'utf-8');
                const tasksArray = JSON.parse(data);
                this.tasks = tasksArray.map(
                    task => new Task(task.id, task.title, task.description, task.completed)
                );
                console.log(`Tasks loaded successfully from ${filename}!`);
            } catch (err) {
                console.error(`Error loading data:`, err);
            }
        } else {
            console.log(`Save file not found: ${filename}`);
        }
    }
}

module.exports = List;
