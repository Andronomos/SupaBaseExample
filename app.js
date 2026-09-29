const SUPABASE_URL = 'https://supabase.co';
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
        .order('created_at', { ascending: false });

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

        // UI matching your update containing action containers on the right
        card.innerHTML = `
            <div class="card-body">
                <h3 class="card-title">${task.title}</h3>
                <span class="card-date">Created on ${taskDate}</span>
            </div>
            <div class="card-actions">
                <button class="edit-btn" title="Edit Task">✏️</button>
                <button class="delete-btn" title="Delete Task">❌</button>
            </div>
        `;

        const editBtn = card.querySelector('.edit-btn');

        editBtn.addEventListener('click', async () => {
            const newTitle = prompt("Edit your task title:", task.title);
            if (newTitle === null) return; // User canceled the dialog prompt
            
            const cleanTitle = newTitle.trim();
            if (!cleanTitle) {
                alert("Task title cannot be blank.");
                return;
            }

            let { error: updateError } = await supabaseClient
                .from('tasks')
                .update({ title: cleanTitle })
                .eq('id', task.id);

            if (updateError) {
                alert(`Error updating task: ${updateError.message}`);
                return;
            }
            loadTasks(); // Reload container rows dynamically
        });

        const deleteBtn = card.querySelector('.delete-btn');

        deleteBtn.addEventListener('click', async () => {
            if (!confirm(`Are you sure you want to delete "${task.title}"?`)) return;

            let { error: deleteError } = await supabaseClient
                .from('tasks')
                .delete()
                .eq('id', task.id);

            if (deleteError) {
                alert(`Error deleting task: ${deleteError.message}`);
                return;
            }
            loadTasks(); // Reload container rows dynamically
        });

        outputDiv.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', loadTasks);

taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const taskTitle = taskInput.value.trim();
    if (!taskTitle) return;

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerText = "Adding...";
    submitBtn.disabled = true;

    let { error } = await supabaseClient
        .from('tasks')
        .insert([{ title: taskTitle }])
        .select();

    submitBtn.innerText = "Add Task";
    submitBtn.disabled = false;

    if (error) {
        alert(`Error adding task: ${error.message}`);
        return;
    }

    taskInput.value = "";
    loadTasks();
});
