// Check if the browser supports notifications and request permission
if ('Notification' in window) {
    Notification.requestPermission();
}

const inputBox = document.getElementById("input-box");
const reminderInput = document.getElementById("reminder-input");
const listContainer = document.getElementById("list-container");

function addTask() {
    const taskText = inputBox.value.trim();
    const reminderTime = new Date(reminderInput.value);

    if (taskText === '' || isNaN(reminderTime)) {
        alert("You must enter a task and set a valid reminder time.");
        return;
    }

    const li = document.createElement("li");
    li.textContent = taskText;

    const reminderDisplay = document.createElement("span");
    reminderDisplay.className = "reminder";
    reminderDisplay.textContent = formatReminderTime(reminderTime);

    // Create a close button
    const span = document.createElement("span");
    span.innerHTML = "\u00d7";

    li.appendChild(reminderDisplay);
    li.appendChild(span);
    listContainer.appendChild(li);

    const now = new Date();
    const timeUntilReminder = reminderTime - now;

    if (timeUntilReminder <= 0) {
        alert("The reminder time must be in the future.");
        return;
    }

    if (Notification.permission === 'granted') {
        // Schedule a notification for the reminder time
        setTimeout(() => {
            const notification = new Notification('Reminder', {
                body: taskText
            });
        }, timeUntilReminder);
    }

    inputBox.value = "";
    reminderInput.value = "";
    saveData();
}

function formatReminderTime(reminderTime) {
    const options = {month: '2-digit', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return reminderTime.toLocaleDateString('en-US', options);
}


// Add click event listener for marking tasks as checked and removing them
listContainer.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }
}, false);

// Function to save task data in local storage
function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

// Function to show tasks retrieved from local storage
function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
}

// Initialize the task list from local storage
showTask();
