// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBm-z3hpxg5rciZ3JGLOCqlpBOs8IlmAyE",
  authDomain: "todo-timer-df95d.firebaseapp.com",
  projectId: "todo-timer-df95d",
  storageBucket: "todo-timer-df95d.appspot.com",
  messagingSenderId: "751788670704",
  appId: "1:751788670704:web:188701fc15172ad20e0c35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const tasksRef = collection(db, "tasks");

// DOM Elements
const addBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

// Add task to Firestore
addBtn.onclick = async () => {
  const name = document.getElementById('taskName').value.trim();
  const type = document.getElementById('taskType').value;
  if (!name) return alert("Enter a task name");

  await addDoc(tasksRef, {
    name,
    type,
    createdAt: Date.now()
  });

  document.getElementById('taskName').value = '';
};

// Render tasks
function renderTask(doc) {
  const data = doc.data();
  const now = Date.now();
  const hours = Math.floor((now - data.createdAt) / (1000 * 60 * 60));

  const taskDiv = document.createElement("div");
  taskDiv.className = "task";
  if (hours >= 120) {
    taskDiv.classList.add("red");
  } else if (hours >= 50) {
    taskDiv.classList.add("yellow");
  }

  const info = document.createElement("div");
  info.className = "task-info";
  info.innerHTML = `<strong>${data.name}</strong> — <em>${data.type}</em><span class="task-timer">${hours}h</span>`;

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.onclick = async () => {
    await deleteDoc(doc.ref);
  };

  taskDiv.appendChild(info);
  taskDiv.appendChild(delBtn);
  taskList.appendChild(taskDiv);
}

// Real-time updates
onSnapshot(tasksRef, (snapshot) => {
  taskList.innerHTML = "";
  snapshot.forEach(doc => renderTask(doc));
});

// Update timers every 1 min
setInterval(() => {
  const event = new Event("firestore-refresh");
  document.dispatchEvent(event);
}, 60000);
