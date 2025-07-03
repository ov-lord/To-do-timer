let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
  const name = document.getElementById('taskName').value.trim();
  const type = document.getElementById('taskType').value;
  if (!name) return alert('Please enter a task name.');

  const task = {
    id: Date.now(),
    name,
    type,
    createdAt: Date.now()
  };
  tasks.push(task);
  saveTasks();
  renderTasks();
  document.getElementById('taskName').value = '';
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  tasks.forEach(task => {
    const now = Date.now();
    const hours = Math.floor((now - task.createdAt) / (1000 * 60 * 60));

    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';
    if (hours >= 120) {
      taskDiv.classList.add('red');
    } else if (hours >= 50) {
      taskDiv.classList.add('yellow');
    }

    const info = document.createElement('div');
    info.className = 'task-info';
    info.innerHTML = `<strong>${task.name}</strong> — <em>${task.type}</em><span class="task-timer">${hours}h</span>`;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => deleteTask(task.id);

    taskDiv.appendChild(info);
    taskDiv.appendChild(delBtn);
    taskList.appendChild(taskDiv);
  });
}

// Update timers every 60 seconds
setInterval(renderTasks, 60 * 1000);
renderTasks();
