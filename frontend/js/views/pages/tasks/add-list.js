import Component from '../../../views/component';

import Tasks from '../../../models/tasks';

import AddAndListTemplate from '../../../../templates/pages/tasks/add-list';
import TaskTemplate from '../../../../templates/pages/tasks/task';

class AddAndList extends Component {
    constructor() {
        super();

        this.model = new Tasks();
    }

    getData() {
        return new Promise(resolve => this.model.getTasksList().then(tasks => resolve(tasks)));
    }

    render(tasks) {
        return new Promise(resolve => resolve(AddAndListTemplate({tasks})));
    }

    afterRender() {
        this.setActions();

        this.countTasksAmount();
    }

    setActions() {
        const addTaskTitle = document.getElementsByClassName('task-add__title')[0],
            addTaskDescription = document.getElementsByClassName('task-add__description')[0],
            addTaskBtn = document.getElementsByClassName('task-add__btn-add')[0],
            tasksContainer = document.getElementsByClassName('tasks')[0],
            clearTasksListBtn = tasksContainer.getElementsByClassName('tasks__btn-clear')[0],
            tasksList = tasksContainer.getElementsByClassName('tasks__list')[0];

        addTaskTitle.addEventListener('keyup', () => addTaskBtn.disabled = !addTaskTitle.value.trim());
        addTaskBtn.addEventListener('click', () => this.addTask(addTaskTitle, addTaskDescription, addTaskBtn, clearTasksListBtn, tasksList));

        tasksContainer.addEventListener('click', event => {
            const target = event.target,
                targetClassList = target.classList;

            if (targetClassList.contains('tasks__btn-clear')) {
                this.clearTasksList(tasksList, clearTasksListBtn);
            }

            if (targetClassList.contains('task') || targetClassList.contains('task__title')) {
                this.redirectToTaskInfo(target.dataset.id);
            }

            if (targetClassList.contains('task__btn-done')) {
                this.changeTaskStatus(target.parentNode.parentNode, target.previousElementSibling, target);
            }

            if (targetClassList.contains('task__btn-remove')) {
                this.removeTask(tasksList, target.parentNode.parentNode, clearTasksListBtn);
            }
        });
    }

    addTask(addTaskTitle, addTaskDescription, addTaskBtn, clearTasksListBtn, tasksList) {
        const newTask = {
            title: addTaskTitle.value.trim(),
            description: addTaskDescription.value.trim()
        };

        this.model.addTask(newTask).then(task => {
            this.clearAddTask(addTaskTitle, addTaskDescription, addTaskBtn);
            clearTasksListBtn.disabled && (clearTasksListBtn.disabled = false);

            tasksList.insertAdjacentHTML('beforeEnd', TaskTemplate({task}));

            this.countTasksAmount();
        });
    }

    clearAddTask(addTaskTitle, addTaskDescription, addTaskBtn) {
        addTaskTitle.value = '';
        addTaskDescription.value = '';
        addTaskBtn.disabled = true;
    }

    countTasksAmount() {
        const tasksCounter = document.getElementsByClassName('tasks__counter')[0],
            totalAmount = document.getElementsByClassName('task').length,
            doneAmount = document.getElementsByClassName('task_done').length;

        tasksCounter.innerHTML = !totalAmount ?
            'Tasks list is empty' :
            `There are 
             <span class="tasks__counter-done">${doneAmount}</span>
              tasks of 
             <span class="tasks__counter-total">${totalAmount}</span>
              are done`;
    }

    clearTasksList(tasksList, clearTasksListBtn) {
        if (confirm('Are you sure?')) {
            this.model.removeAllTasks().then(() => {
                clearTasksListBtn.disabled = true;
                tasksList.innerHTML = '';

                this.countTasksAmount();
            });
        }
    }

    redirectToTaskInfo(id) {
        location.hash = `#/task/${id}`;
    }

    changeTaskStatus(taskContainer, editTaskBtn, doneTaskBtn) {
        this.model.changeTaskStatus(taskContainer.dataset.id).then(() => {
            taskContainer.classList.add('task_done');
            editTaskBtn.remove();
            doneTaskBtn.remove();

            this.countTasksAmount();
        });
    }

    removeTask(tasksList, taskContainer, clearTasksListBtn) {
        if (confirm('Are you sure?')) {
            this.model.removeTask(taskContainer.dataset.id).then(() => {
                taskContainer.remove();
                !tasksList.children.length && (clearTasksListBtn.disabled = true);

                this.countTasksAmount();
            });
        }
    }
}

export default AddAndList;