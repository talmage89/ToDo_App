class Task {
    constructor(text, completed = false, id = ''){
        this.text = text;
        this.completed = completed;
        id == '' ? this.id = Utils.getNewId() : this.id = id;
    }
    editText(newText) {
        this.text = newText;
    }
    toggleCompleted(){
        this.completed ? this.completed = false : this.completed = true;
    }
}