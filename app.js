const SUPABASE_URL = 'https://mfevyxlyjzjlrowbjwtv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_v25Fwjw-Z9DIgQyxkwZHBA_i7IBdj6n';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const outputDiv = document.getElementById('output');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');

async function loadTasks() {
    outputDiv.innerHTML = "<p class='loading'>Loading data...</p>";
    
    let { data: tasks, error } = await supabaseClient
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false }); // Optional: Puts newest tasks at the top!

    if (error) {
        outputDiv.innerHTML = `<p class='error'>Error: ${error.message}</p>`;
        return;
    }

    outputDiv.innerHTML = "";

    if (tasks.length === 0) {
        outputDiv.innerHTML = "<p class='empty-state'>No tasks found. Add a task above!</p>";
        return;
    }

    tasks.forEach(task => {
        const card = document.createElement('div');
        card.classList.add('task-card');

        const taskDate = new Date(task.created_at).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        card.innerHTML = `
            <div class="card-body">
                <h3 class="card-title">${task.title}</h3>
                <span class="card-date">Created on ${taskDate}</span>
            </div>
        `;

        outputDiv.appendChild(card);
    });

    document.addEventListener('DOMContentLoaded', loadTasks);
}

document.addEventListener('DOMContentLoaded', loadTasks);

taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const taskTitle = taskInput.value.trim();
    if (!taskTitle) return;

    // Change button status during network request
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerText = "Adding...";
    submitBtn.disabled = true;

    // 3. Send the insert query request to Supabase
    let { data, error } = await supabaseClient
        .from('tasks')
        .insert([
            { title: taskTitle }
        ])
        .select(); // Requesting select returns the newly created row data

    // Reset button status
    submitBtn.innerText = "Add Task";
    submitBtn.disabled = false;

    if (error) {
        alert(`Error adding task: ${error.message}`);
        return;
    }

    // 4. Success: Clear the text field and automatically refresh our visual card list
    taskInput.value = "";
    loadTasks();
});