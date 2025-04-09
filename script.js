const API_URL = "http://localhost:3000/tasks";

async function fetchTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; 

    tasks.forEach(task => {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = task.task;
        li.appendChild(span);

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.style.backgroundColor = "#f39c12";
        editBtn.style.marginLeft = "10px";
        editBtn.onclick = async () => {
            const newTask = prompt("Edit your task:", task.task);
            if (newTask !== null && newTask.trim() !== "") {
                await updateTask(task.id, newTask.trim());
            }
        };
        li.appendChild(editBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = () => deleteTask(task.id);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });
}

async function addTask() {
    const taskInput = document.getElementById("taskInput");
    const task = taskInput.value.trim();
    if (task) {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task })
        });
        taskInput.value = ""; 
        fetchTasks(); 
    }
}

async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTasks(); 
}

async function updateTask(id, updatedTask) {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: updatedTask })
    });
    fetchTasks(); 
}

document.addEventListener("DOMContentLoaded", fetchTasks);
