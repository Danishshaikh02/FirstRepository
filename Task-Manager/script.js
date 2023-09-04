const tasks = [];
const editModal = document.getElementById('editModal');
const subtaskModal = document.getElementById('subtaskModal');
let editedTaskId = '';
let currentTaskId = '';
let lastSubtaskId = 0;


const addTask = () => {
    const taskId = document.getElementById('taskId').value;
    const taskName = document.getElementById('taskName').value;
    const taskStartDate = new Date(document.getElementById('taskStartDate').value);
    const taskEndDate = new Date(document.getElementById('taskEndDate').value);
    const taskStatus = document.getElementById('taskStatus').value;

    if (isNaN(taskId) || taskId <= 0) {
        alert("Task ID must be a valid positive number.");
        return;
    }
    if (!taskId || !taskName || !taskStartDate || !taskEndDate || !taskStatus) {
        alert('All fields are mandatory');
        return;
    }
    if (findTaskById(taskId)) {
        alert('Task ID must be unique');
        return;
    }
    if (taskStartDate > taskEndDate) {
        alert('End Date cannot be before Start Date');
        return;
    }
    if (taskId && taskName && taskStartDate && taskEndDate && taskStatus) {
        const newTask = {
            id: taskId,
            name: taskName,
            startDate: taskStartDate,
            endDate: taskEndDate,
            status: taskStatus,
            subTasks: [] // Initialize an empty array for sub-tasks
        };
        tasks.push(newTask);
        displayTask();
        clearFormFields();
    }
};


function addSubTask() {
    const subTaskName = document.getElementById('subTaskName').value;
    const subStartDate = new Date(document.getElementById('subStartDate').value);
    const subEndDate = new Date(document.getElementById('subEndDate').value);
    const subStatus = document.getElementById('subStatus').value;

    if (!currentTaskId || !subTaskName || !subStartDate || !subEndDate || !subStatus) {
        alert('All fields are mandatory');
        return;
    }

    const parentTask = findTaskById(currentTaskId);

    if (!parentTask) {
        alert('Invalid Task ID');
        return;
    }

    if (subStartDate > subEndDate) {
        alert('End Date cannot be before Start Date');
        return;
    }

    if (currentTaskId && subTaskName && subStartDate && subEndDate && subStatus) {
        const parentTask = findTaskById(currentTaskId);

        if (parentTask) {
            const newSubTask = {
                id: generateSubTaskId(),
                name: subTaskName,
                startDate: subStartDate,
                endDate: subEndDate,
                status: subStatus
            };

            parentTask.subTasks.push(newSubTask);
            displayTask();
            closeSubtaskModal();
            clearFormFields();
        }
    }
}

function generateSubTaskId() {
    lastSubtaskId++;
    return `${currentTaskId}.${lastSubtaskId}`;
}

// strt
// ... (Your existing code)

// Search function
function searchTasks() {
    const searchCriteria = document.getElementById('searchCriteria').value.toLowerCase();
    const searchValue = document.getElementById('searchValue').value.toLowerCase();

    const filteredTasks = tasks.filter(task => {
        if (searchCriteria === 'id') {
            return task.id.toLowerCase().includes(searchValue);
        } else if (searchCriteria === 'taskname') {
            return task.name.toLowerCase().includes(searchValue);
        } else if (searchCriteria === 'date') {
            const formattedStartDate = task.startDate.toISOString().split('T')[0].toLowerCase();
            const formattedEndDate = task.endDate.toISOString().split('T')[0].toLowerCase();
            return formattedStartDate.includes(searchValue) || formattedEndDate.includes(searchValue);
        } else if (searchCriteria === 'status') {
            return task.status.toLowerCase().includes(searchValue);
        }
    });

    displayFilteredTasks(filteredTasks);
}

// Display filtered tasks
function displayFilteredTasks(filteredTasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    filteredTasks.forEach(task => {
        const listItem = createTaskListItem(task, false); // Task
        taskList.appendChild(listItem);

        if (task.subTasks) {
            task.subTasks.forEach(subTask => {
                const subListItem = createTaskListItem(subTask, true); // Subtask
                listItem.appendChild(subListItem);
            });
        }
    });
}

// ... (Your existing code)

// Clear form fields function

// ... (Your existing code)


// end
function displayTask() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear the existing list

    tasks.forEach(task => {
        const listItem = createTaskListItem(task, false); // Task
        taskList.appendChild(listItem);

        if (task.subTasks) {
            task.subTasks.forEach(subTask => {
                const subListItem = createTaskListItem(subTask, true); // Subtask
                listItem.appendChild(subListItem);
            });
        }
    });
}

function createTaskListItem(task, isSubtask = false) {
    const listItem = document.createElement('li');
    listItem.classList.add(getStatusClass(task.status));

    const taskDetails = document.createElement('div');
    taskDetails.innerHTML = `
        <strong>ID:</strong> ${task.id} &nbsp;&nbsp;<br>
        <strong>Name:</strong> ${task.name}&nbsp;&nbsp;<br>
        <strong>Start Date:</strong> ${task.startDate.toISOString().split('T')[0]}&nbsp;&nbsp;<br>
        <strong>End Date:</strong> ${task.endDate.toISOString().split('T')[0]}&nbsp;&nbsp;<br>
        <strong>Status:</strong> ${task.status}<br>
    `;

    const actions = document.createElement('div');
    actions.innerHTML = `
        <button id= "editBtn" onclick="editTask('${task.id}', ${isSubtask})">Edit</button><br>
        <button id= "deleteBtn" onclick="deleteTask('${task.id}')">Delete</button><br>
        <button id= "addSubBtn" onclick="openSubtaskModal('${task.id}')">Add Subtask</button><br>
    `;

    listItem.appendChild(taskDetails);
    listItem.appendChild(actions);

    return listItem;
}


function getStatusClass(status) {
    if (status === 'Due-Passed') {
        return 'bg-due-passed';
    } else if (status === 'Completed') {
        return 'bg-completed';
    } else if (status === 'Canceled') {
        return 'bg-canceled';
    } else if (status === 'In-Progress') {
        return 'bg-in-progress';
    } else {
        return '';
    }
}

function findSubtaskById(subtaskId, task) {
    return task.subTasks.find(subTask => subTask.id === subtaskId);
}
function editTask(taskId, isSubtask) {
    editedTaskId = taskId;
    const taskToEdit = findTaskById(taskId);

    if (!taskToEdit) {
        return;
    }

    const editTaskNameInput = document.getElementById('editTaskName');
    const editTaskStartDateInput = document.getElementById('editTaskStartDate');
    const editTaskEndDateInput = document.getElementById('editTaskEndDate');
    const editTaskStatusInput = document.getElementById('editTaskStatus');

    if (isSubtask) {
        const subtaskToEdit = findSubtaskById(taskId, taskToEdit);

        if (subtaskToEdit) {
            editTaskNameInput.value = subtaskToEdit.name;
            editTaskStartDateInput.value = subtaskToEdit.startDate.toISOString().split('T')[0];
            editTaskEndDateInput.value = subtaskToEdit.endDate.toISOString().split('T')[0];
            editTaskStatusInput.value = subtaskToEdit.status;
        }
    } else {
        editTaskNameInput.value = taskToEdit.name;
        editTaskStartDateInput.value = taskToEdit.startDate.toISOString().split('T')[0];
        editTaskEndDateInput.value = taskToEdit.endDate.toISOString().split('T')[0];
        editTaskStatusInput.value = taskToEdit.status;
    }

    editModal.style.display = 'block';
}

function openSubtaskModal(taskId) {
    currentTaskId = taskId;
    subtaskModal.style.display = 'block';
}

function closeSubtaskModal() {
    subtaskModal.style.display = 'none';
}

function saveEditedTask() {
    const editedName = document.getElementById('editTaskName').value;
    const editedStartDate = new Date(document.getElementById('editTaskStartDate').value);
    const editedEndDate = new Date(document.getElementById('editTaskEndDate').value);
    const editedStatus = document.getElementById('editTaskStatus').value;

    const editedTask = findTaskById(editedTaskId);

    if (editedTask) {
        if (editedTaskId.startsWith('Subtask')) {
            const parentTask = findParentTaskContaining(editedTaskId);

            if (parentTask) {
                const editedSubtask = findSubtaskById(editedTaskId, parentTask);

                if (editedSubtask) {
                    editedSubtask.name = editedName;
                    editedSubtask.startDate = editedStartDate;
                    editedSubtask.endDate = editedEndDate;
                    editedSubtask.status = editedStatus;

                    displayTask();
                    editModal.style.display = 'none';
                }
            }
        } else {
            editedTask.name = editedName;
            editedTask.startDate = editedStartDate;
            editedTask.endDate = editedEndDate;
            editedTask.status = editedStatus;

            displayTask();
            editModal.style.display = 'none';
        }
    }
}

function closeEditedTask() {
    editModal.style.display = 'none';
}

function deleteTask(taskId) {
    const taskToDelete = findTaskById(taskId);

    if (taskToDelete) {
        const parentTask = findParentTaskContaining(taskId);

        if (parentTask) {
            parentTask.subTasks = parentTask.subTasks.filter(subTask => subTask.id !== taskId);
        } else {
            tasks.splice(tasks.indexOf(taskToDelete), 1);
        }

        displayTask();
    }
}



function findTaskById(taskId) {
    return tasks.find(task => task.id === taskId) ||
        tasks.find(parentTask => parentTask.subTasks && parentTask.subTasks.find(subTask => subTask.id === taskId));
}

function findParentTaskContaining(taskId) {
    return tasks.find(parentTask => parentTask.subTasks && parentTask.subTasks.find(subTask => subTask.id === taskId));
}

// function clearFormFields() {
//     document.getElementById('taskId').value = '';
//     document.getElementById('taskName').value = '';
//     document.getElementById('taskStartDate').value = '';
//     document.getElementById('taskEndDate').value = '';
//     document.getElementById('taskStatus').value = '';
//     document.getElementById('subTaskName').value = '';
//     document.getElementById('subStartDate').value = '';
//     document.getElementById('subEndDate').value = '';
//     document.getElementById('subStatus').value = '';
// }
function clearFormFields() {
    document.getElementById('taskId').value = '';
    document.getElementById('taskName').value = '';
    document.getElementById('taskStartDate').value = '';
    document.getElementById('taskEndDate').value = '';
    document.getElementById('taskStatus').value = '';
    document.getElementById('subTaskName').value = '';
    document.getElementById('subStartDate').value = '';
    document.getElementById('subEndDate').value = '';
    document.getElementById('subStatus').value = '';
    document.getElementById('searchCriteria').value = ''; // Clear search criteria
    document.getElementById('searchValue').value = ''; // Clear search value
}

