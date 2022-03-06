class List {
    constructor(name = '', tasks = [], id = ''){
        this.name = name;
        this.tasks = tasks;
        id == '' ? this.id = Utils.getNewId() : this.id = id;
        
    }
    addTask(text){
        const taskToAdd = new Task(text);
        this.tasks.push(taskToAdd);
    }
    removeTask(id){
        this.tasks = this.tasks.filter(task => task.id != id);
    }
    rename(newName){
        this.name = newName;
    }
    taskToggle(id){
        let target = this.tasks.find(task => task.id == id);
        target.toggleCompleted();
    }
    getCompletedTasks(){
        let completedTasks = [];
        this.tasks.forEach(task => {
            if (task.completed) {
                completedTasks.push(task);
            }
        });
        return completedTasks;
    }
    renderTasks(){
        let htmlContainer = document.getElementById('listItems');
        htmlContainer.innerHTML = `<h2>${this.name}</h2><div class="list-group">`;
        this.tasks.forEach(e => {
            const task = document.createElement('label');
            task.className = 'list-group-item';
            e.completed ?
                task.innerHTML = `<input class="form-check-input me-1" id="${e.id}" type="checkbox" value="" checked="true">${e.text}<button class='delete-task' id='delete-${e.id}'>x</button>`:
                task.innerHTML = `<input class="form-check-input me-1" id="${e.id}" type="checkbox" value="">${e.text}<button class='delete-task' id='delete-${e.id}'>x</button>`;
            htmlContainer.appendChild(task);
        });
        htmlContainer.innerHTML += "</div>"
    }
}