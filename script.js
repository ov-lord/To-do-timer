// 🔐 Login protection
const ACCESS_CODE = "Mhd";
const savedCode = localStorage.getItem("access_code");

if (savedCode !== ACCESS_CODE) {
  document.getElementById("mainApp").style.display = "none";
  document.getElementById("loginScreen").style.display = "block";

  window.checkPassword = () => {
    const input = document.getElementById("passwordInput").value;
    if (input === ACCESS_CODE) {
      localStorage.setItem("access_code", input);
      document.getElementById("loginScreen").style.display = "none";
      document.getElementById("mainApp").style.display = "block";
      initializeAppLogic();
    } else {
      alert("Incorrect password");
    }
  };
} else {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
  initializeAppLogic();
}

// 🔌 Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔧 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBm-z3hpxg5rciZ3JGLOCqlpBOs8IlmAyE",
  authDomain: "todo-timer-df95d.firebaseapp.com",
  projectId: "todo-timer-df95d",
  storageBucket: "todo-timer-df95d.appspot.com",
  messagingSenderId: "751788670704",
  appId: "1:751788670704:web:188701fc15172ad20e0c35"
};

// 🔥 Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const tasksRef = collection(db, "tasks");

// ✅ App logic
function initializeAppLogic() {
  const addBtn = document.getElementById("addTask");
  const taskList = document.getElementById("taskList");

  addBtn.onclick = async () => {
    const name = document.getElementById("taskName").value.trim();
    const type = document.getElementById("taskType").value;
    if (!name) return alert("Enter a task name");

    await addDoc(tasksRef, {
      name,
      type,
      createdAt: Date.now()
    });

    document.getElementById("taskName").value = "";
  };

  function renderTask(docSnapshot) {
    const data = docSnapshot.data();
    const now = Date.now();
    const hours = Math.floor((now - data.createdAt) / (1000 * 60 * 60));

    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    if (hours >= 120) taskDiv.classList.add("red");
    else if (hours >= 50) taskDiv.classList.add("yellow");

    const info = document.createElement("div");
    info.className = "task-info";
    info.innerHTML = `<strong>${data.name}</strong> — <em>${data.type}</em><span class="task-timer">${hours}h</span>`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = async () => {
      await deleteDoc(doc(tasksRef, docSnapshot.id));
    };

    taskDiv.appendChild(info);
    taskDiv.appendChild(delBtn);
    taskList.appendChild(taskDiv);
  }

  onSnapshot(tasksRef, (snapshot) => {
    taskList.innerHTML = "";
    snapshot.forEach(renderTask);
  });

  setInterval(() => {
    taskList.innerHTML = "";
    onSnapshot(tasksRef, (snapshot) => {
      snapshot.forEach(renderTask);
    });
  }, 60000);
}
