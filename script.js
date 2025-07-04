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

// 🔌 Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔧 Config
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
const tasksQuery = query(tasksRef, orderBy("createdAt", "asc")); // oldest first

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
    info.innerHTML = `<strong>${data.name}</strong> — <span class="task-timer">${hours}h</span>`;

    // 🛠️ Update Dropdown
    const typeSelect = document.createElement("select");
    const options = [
      "Acouplement", "To Sereniter", "From Sereniter", "To Sereniter Bébé",
      "From Sereniter Bébé", "To Water Bébé", "To Énergie", "XP",
      "Certificat", "Problem"
    ];
    options.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      if (opt === data.type) option.selected = true;
      typeSelect.appendChild(option);
    });

    typeSelect.onchange = async () => {
      await updateDoc(doc(tasksRef, docSnapshot.id), {
        type: typeSelect.value
      });
    };

    // ❌ Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = async () => {
      await deleteDoc(doc(tasksRef, docSnapshot.id));
    };

    taskDiv.appendChild(info);
    taskDiv.appendChild(typeSelect);
    taskDiv.appendChild(delBtn);
    taskList.appendChild(taskDiv);
  }

  // 🔁 Real-time + ordered by time
  onSnapshot(tasksQuery, (snapshot) => {
    taskList.innerHTML = "";
    snapshot.forEach(renderTask);
  });

  // 🔄 Update timers every 60s
  setInterval(() => {
    taskList.innerHTML = "";
    onSnapshot(tasksQuery, (snapshot) => {
      snapshot.forEach(renderTask);
    });
  }, 60000);
}
