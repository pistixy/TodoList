const row= document.querySelector('.row');
const inputBox = document.querySelector('#input-box');
const reminderInput =document.querySelector('#reminder-input');
const msg =document.querySelector('.msg')
const listContainer =document.querySelector('#list-container');
row.addEventListener('submit', onSubmit);
const today = new Date();
const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
const dateTime = date+' '+time;

window.addEventListener('load', function () {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(function (task) {
        createTaskElement(task);
    });
});

function createTaskElement(taskText) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(taskText));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function () {
        listContainer.removeChild(li);
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const index = tasks.indexOf(taskText);
        if (index !== -1) {
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    });

    li.appendChild(deleteButton);
    listContainer.appendChild(li);
}

function onSubmit(e) {
    e.preventDefault();

    if (inputBox.value === '' || reminderInput.value === '') {
        msg.classList.add('error');
        msg.innerHTML = 'Please fill the fields!';
        setTimeout(() => msg.remove(), 3000);
    } else {
        const taskText = inputBox.value + ' task at: ' + reminderInput.value;
        createTaskElement(taskText);

        // Save the task to localStorage
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(taskText);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        inputBox.value = '';
        reminderInput.value = '';

        // Convert reminderInput value to a Date object in Budapest time
        const reminderTime = new Date(reminderInput.value);
        reminderTime.setTime(reminderTime.getTime() + (60 - reminderTime.getTimezoneOffset()) * 60 * 1000);

        // Calculate the time difference in milliseconds
        const currentTime = new Date();
        const timeDifference = reminderTime - currentTime;

        if (timeDifference > 0) {
            // Schedule an alert after the time difference has passed
            setTimeout(function () {
                alert('It is time to do the task: ' + taskText);
            }, timeDifference);
        }
    }
}

