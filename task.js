// Task
class Task {
    constructor(id, title, dueDate, description, completed) {
        this.id = id;
        this.title = title;
        this.dueDate = dueDate;
        this.description = description;
        this.completed = completed;
    }
}

module.exports = Task;