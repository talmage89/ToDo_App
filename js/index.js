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
        changeTaskName:     function(listId, taskId, newText) {
            let target = listsArray.find(e => e.id == listId);
            target.renameTask(taskId, newText);
        },
        

        
        getLists:           function() {
                                return listsArray;
                            },
        getListTasks:       function(listId){
                                let target = listsArray.find(e => e.id == listId);
                                return target.getTasks();
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
                                    list.innerHTML = `<span>${listsArray[i].name}<button class="delete-list" id="delete-${listsArray[i].id}">x</button></span>`;
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




let parentElement = document.querySelector('.main');
parentElement.addEventListener('click', e => {
    if (e.target !== e.currentTarget) {
        let listNameReg = /list-group-item-action/gm;
        if (listNameReg.exec(e.target.className)) {
            currentListId = e.target.id;
            app.renderLists(currentListId);
        }
        if (e.target.className == "form-check-input me-1") {
            let taskId = e.target.id;
            app.togTaskCompleted(currentListId, taskId);
        }



        if (e.target.id == 'newListButton') {
            let newId = Utils.getNewId();
            app.addList(new List(`\n`, [], newId));
            app.renderLists(newId);
            editListText(newId);
        }
        if (e.target.id == 'delete-lists-btn') {
            if (app.getLists().length != 0) {
                manageListDeleteBtns('show');
                document.getElementById('done-deleting-lists').style.display = 'inline-block';
                let deleteBtns = document.getElementsByClassName('delete-list');
            }
            
        }
        if (e.target.id == 'done-deleting-lists') {
            document.getElementById('done-deleting-lists').style.display = 'none';
            manageListDeleteBtns('hide');
        }
        if (e.target.id == 'add-task-button') {
            if (currentListId != '') {
                let newTaskId = Utils.getNewId();
                app.addTaskToList(currentListId, new Task('\n', false, newTaskId));
                app.renderLists(currentListId);
                editTaskText(newTaskId);
            } else {
                let htmlContainer = document.getElementById('listItems');
                htmlContainer.innerHTML = '<p>Please choose or create a list.</p>'
            }
        }
        if (e.target.id == 'clear-selected') {
            let tasks = app.getCompletedTasks(currentListId);
            tasks.forEach(task => {
                app.removeTaskFromList(currentListId, task.id);
            });
            app.renderLists(currentListId);
        } 
        if (e.target.id == 'delete-tasks-btn') {
            const doneBtn = document.getElementById('done-deleting-tasks');
            if (app.getListTasks(currentListId).length != 0) {
                manageTaskDeleteBtns('show');
                doneBtn.style.display = 'inline-block';
            } else {
                doneBtn.style.display = 'none';    
            }
        }
        if (e.target.className == 'delete-task') {
            let re = /.{4}\-.{4}\-.{4}\-.{4}$/m;
            let idToDel = re[Symbol.match](e.target.id);
            app.removeTaskFromList(currentListId, idToDel);
            app.renderLists(currentListId);
            if (app.getListTasks(currentListId).length != 0) {
                manageTaskDeleteBtns('show');
            } else {
                manageTaskDeleteBtns('hide');
                document.getElementById('done-deleting-tasks').style.display = 'none';
            }
        }
        if (e.target.id == 'done-deleting-tasks') {
            manageTaskDeleteBtns('hide');
            document.getElementById('done-deleting-tasks').style.display = 'none';
        }



        if (e.target.id == 'searchbar') {
            const searchbar = document.getElementById('searchbar');
            searchbar.addEventListener('input', (e) => {
                let lists = app.getLists();
                let listsHTML = document.getElementById('allLists');
                let regex = `${e.target.value}`;
                let regexTest = new RegExp(regex, 'mi');

                listsHTML.innerHTML = '<div class="list-group">'
                lists.forEach((el) => {
                    if (regexTest.exec(el.name)){
                        const list = document.createElement('label');
                        list.id = `${el.id}`;
                        list.className = "list-group-item list-group-item-action"
                        list.innerHTML = el.name;
                        listsHTML.appendChild(list);
                    }
                })
                listsHTML.innerHTML += '</div>';
            })
            searchbar.addEventListener('blur', (e) => {
                searchbar.value = '';
                app.renderLists(currentListId);
            });
        } 

        if (e.target.id == 'openBottomPanel') {
            let button = document.getElementById('openBottomPanel');
            let panel = document.getElementById('bottomPanel');
            if (panel.style.height == '225px') {
                panel.style.height = '0px';
                button.innerText = '^';
            } else {
                panel.style.height = '225px';
                button.innerText = '\u02C5';
            }
        }
    }
    e.stopPropagation();
});

let listTasks = parentElement.getElementsByClassName('form-check-input me-1');
Array.from(listTasks).forEach((task) => {
    console.log(task);
    task.addEventListener('mouseover', (e) => {
        let deleteTask = document.getElementById(`delete-${e.target.firstChild.id}`);
        deleteTask.style.display = 'flex';
    });
});

function manageTaskDeleteBtns(string) {
    const taskDeleteBtns = document.getElementsByClassName('delete-task');
    switch(string) {
        case 'show': 
            Array.from(taskDeleteBtns).forEach((btn) => {
                btn.style.display = 'flex';
            });
            break;
        case 'hide':
            Array.from(taskDeleteBtns).forEach((btn) => {
                btn.style.display = 'none';
            });
            break;
    }
}
function manageListDeleteBtns(string) {
    const listDeleteBtns = document.getElementsByClassName('delete-list');
    switch(string) {
        case 'show': 
            Array.from(listDeleteBtns).forEach((btn) => {
                btn.style.display = 'flex';
                btn.addEventListener('click', (el) => {
                    if (el.target.className == 'delete-list') {
                        let re = /.{4}\-.{4}\-.{4}\-.{4}$/m;
                        let idToDel = re[Symbol.match](el.target.id);
                        app.removeList(idToDel);
                        lists = app.getLists();
                        if (lists.length != 0) {
                            if (idToDel == currentListId) {
                                currentListId = lists[lists.length-1].id;
                            } 
                            app.renderLists(currentListId);
                            manageListDeleteBtns('show');
                        } else {
                            currentListId = '';
                            manageListDeleteBtns('hide');
                        }
                    } else {
                        manageListDeleteBtns('hide');
                    }
                });
            });
            break;
        case 'hide':
            Array.from(listDeleteBtns).forEach((btn) => {
                btn.style.display = 'none';
                document.getElementById('done-deleting-lists').style.display = 'none';
                app.renderLists(currentListId);
            });
            break;
    }
}


function editListText(listId) {
    let listItem = document.getElementById(listId);
    listItem.contentEditable = 'true';
    listItem.focus();
    listItem.scrollIntoView();
    listItem.innerText = '';
    listItem.addEventListener('blur', () => {
        if (listItem.innerText != '') {
            app.changeListName(listId, listItem.innerText);
            listItem.contentEditable = 'false';
            currentListId = listId;
            app.renderLists(currentListId);
        } else {
            app.removeList(listId);
            app.renderLists(currentListId);
        }
    })
    listItem.addEventListener('keydown', (e) => {
        if (e.code == "Enter") {
            listItem.blur();
        }
    })
}
function editTaskText(taskId) {
    let task = document.getElementById(`text-${taskId}`);
    task.contentEditable = 'true';
    task.focus();
    task.scrollIntoView();
    task.innerText = '';
    task.addEventListener('blur', () => {
        if (task.innerText != '') {
            app.changeTaskName(currentListId, taskId, task.innerText);
            task.contentEditable = 'false';
            app.renderLists(currentListId);
        } else {
            app.removeTaskFromList(currentListId, taskId);
            app.renderLists(currentListId);
        }
    })
    task.addEventListener('keydown', (e) => {
        if (e.code == "Enter") {
            task.blur();
        }
    })
}