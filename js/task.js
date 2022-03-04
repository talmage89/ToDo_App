class Task {
    constructor(text, completed = false){
        this.text = text;
        this.completed = completed;
        this.id = Utils.getNewId();
    }
    editText(newText) {
        this.text = newText;
    }
    toggleCompleted(){
        this.completed ? this.completed = false : this.completed = true;
    }
}