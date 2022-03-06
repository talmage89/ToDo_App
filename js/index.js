let app = (function(){
    let listsArray = new Array();
    return {
        addList:            function(list){
                                listsArray.push(list);
                            },
        addTaskToList:      function(listId, task){
                                let target = listsArray.find(e => e.id == listId);
                                target.addTask(task);
                            },

        removeList:         function(listId){
                                listsArray = listsArray.filter(e => e.id != listId);

                            },
        removeTaskFromList: function(listId, taskId){
                                let target = listsArray.find(e => e.id == listId);
                                target.removeTask(taskId);
                            },

        changeListName:     function(listId, newName) {
                                let target = listsArray.find(e => e.id == listId);
                                target.rename(newName);
                            },

        togTaskCompleted:   function(listId, taskId) {
                                let target = listsArray.find(e => e.id == listId);
                                target.taskToggle(taskId);
                            },
        getCompletedTasks:  function(listId){
                                let target = listsArray.find(e => e.id == listId);
                                return target.getCompletedTasks();
                            },

        renderLists:        function(listId){
                                let lists = document.getElementById('allLists');
                                lists.innerHTML = '<div class="list-group">'
                                for(let i = 0; i<listsArray.length; i++){
                                    const list = document.createElement('label');
                                    list.id = `${listsArray[i].id}`;
                                    list.className = "list-group-item list-group-item-action"
                                    list.innerHTML = listsArray[i].name;
                                    if (list.id == listId) {
                                        list.className = "list-group-item list-group-item-action list"
                                    }
                                    lists.appendChild(list);
                                }
                                lists.innerHTML += '</div>'

                                let regex = /.{4}\-.{4}\-.{4}\-.{4}/gm;
                                if (regex.exec(listId)) {
                                    this.renderListTasks(listId);
                                } else {
                                    let htmlContainer = document.getElementById('listItems');
                                    htmlContainer.innerHTML = "<p>Please select an existing list, or create a new one.</p>"
                                }
                            },
        renderListTasks:    function(listId){
                                let target = listsArray.find(e => e.id == listId);
                                target.renderTasks();
                            }
    }
})();

let currentListId = '';

app.addList(new List('First List'));
app.addList(new List('Second List'));
app.renderLists(currentListId);

let parentElement = document.querySelector('.main');
parentElement.addEventListener('click', e => {
    if (e.target !== e.currentTarget) {
        let regex = /list-group-item-action/gm;
        if (regex.exec(e.target.className)) {
            currentListId = e.target.id;
            app.renderLists(currentListId);
        }
        if (e.target.className == "form-check-input me-1") {
            let taskId = e.target.id;
            app.togTaskCompleted(currentListId, taskId);
        }
        if (e.target.id == 'add-task-button') {
            let input = document.getElementById('add-task-input');
            if(input.value != '' && currentListId != ''){
                app.addTaskToList(currentListId, input.value);
                app.renderLists(currentListId);
                input.value = '';
            } else if (currentListId != ''){
                alert('invalid task');
            } else {
                let htmlContainer = document.getElementById('listItems');
                htmlContainer.innerHTML = '<p>Please choose a list, or create a new one.</p>'
            }   
        }
        if (e.target.id == 'newListButton') {
            let newId = Utils.getNewId();
            app.addList(new List(`\n`, [], newId));
            app.renderLists(newId);
            editListText(newId);
        }
        if (e.target.id == 'clear-selected') {
            let tasks = app.getCompletedTasks(currentListId);
            tasks.forEach(task => {
                app.removeTaskFromList(currentListId, task.id);
            });
            app.renderLists(currentListId);
        } 
    }
    e.stopPropagation();
});

function deleteTaskEventHandler(e) {
    if (e.type == 'mouseover') {
        console.log('moused over');
        let deleteTask = document.getElementById(`delete-${e.target.firstChild.id}`);
        deleteTask.style.display = 'flex';
    }
    if (e.type == 'mouseout') {
        let deleteTask = document.getElementById(`delete-${e.relatedTarget.firstChild.id}`);
        deleteTask.style.display = 'none';
    }
}

function editListText(listId) {
    let listItem = document.getElementById(listId);
    listItem.contentEditable = 'true';
    listItem.focus();
    listItem.innerText = '';
    listItem.addEventListener('blur', () => {
        if (listItem.innerText != '') {
            app.changeListName(listId, listItem.innerText);
            listItem.contentEditable = 'false';
            currentListId = listId;
            app.renderLists(currentListId);
        } else {
            app.removeList(listId);
            app.renderLists();
        }
    })
    listItem.addEventListener('keydown', (e) => {
        if (e.code == "Enter") {
            listItem.blur();
        }
        console.log(e.code);
    })
}

