const ACCESS_CODE = "Mhd";

window.checkPassword = () => {
  const input = document.getElementById("passwordInput").value;
  if (input === ACCESS_CODE) {
    localStorage.setItem("access_code", input);
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
  } else {
    alert("Incorrect password.");
  }
};

const savedCode = localStorage.getItem("access_code");
if (savedCode === ACCESS_CODE) {
  window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
  });
}

// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBm-z3hpxg5rciZ3JGLOCqlpBOs8IlmAyE",
  authDomain: "todo-timer-df95d.firebaseapp.com",
  projectId: "todo-timer-df95d",
  storageBucket: "todo-timer-df95d.appspot.com",
  messagingSenderId: "751788670704",
  appId: "1:751788670704:web:188701fc15172ad20e0c35"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const tasksRef = collection(db, "tasks");

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addTask");
  if (addBtn) {
    addBtn.onclick = async () => {
      const name = document.getElementById('taskName').value.trim();
      const type = document.getElementById('taskType').value;
      if (!name) return alert("Enter a task name");
      await addDoc(tasksRef, { name, type, createdAt: Date.now() });
      document.getElementById('taskName').value = '';
    };
  }

  function renderTask(docSnapshot) {
    const data = docSnapshot.data();
    const now = Date.now();
    const hours = Math.floor((now - data.createdAt) / (1000 * 60 * 60));
    const days = Math.floor((now - data.createdAt) / (1000 * 60 * 60 * 24));
    const timeDisplay = data.type.toLowerCase() === "certificat" ? `${days}d` : `${hours}h`;

    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    if (hours >= 120) taskDiv.classList.add("red");
    else if (hours >= 50) taskDiv.classList.add("yellow");

    const info = document.createElement("div");
    info.className = "task-info";
    info.innerHTML = `<strong>${data.name}</strong> — <span class="task-timer">${timeDisplay}</span>`;

    const typeSelect = document.createElement("select");
    const options = [
      "Acouplement", "To Sereniter", "From Sereniter", "To Sereniter Bébé", "From Sereniter Bébé",
      "To Water Bébé", "To Énergie", "XP", "Certificat", "Problem"
    ];
    options.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      if (opt === data.type) option.selected = true;
      typeSelect.appendChild(option);
    });
    typeSelect.onchange = async () => {
      await updateDoc(doc(tasksRef, docSnapshot.id), { type: typeSelect.value });
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = async () => {
      await deleteDoc(doc(tasksRef, docSnapshot.id));
    };

    taskDiv.appendChild(info);
    taskDiv.appendChild(typeSelect);
    taskDiv.appendChild(deleteBtn);

    document.getElementById("taskList").appendChild(taskDiv);
  }

  onSnapshot(tasksRef, (snapshot) => {
    const taskList = document.getElementById("taskList");
    if (taskList) {
      taskList.innerHTML = "";
      snapshot.forEach(renderTask);
    }
  });

  setInterval(() => {
    const taskList = document.getElementById("taskList");
    if (taskList) {
      taskList.innerHTML = "";
      onSnapshot(tasksRef, (snapshot) => {
        snapshot.forEach(renderTask);
      });
    }
  }, 60000);
});
