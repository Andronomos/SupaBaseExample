const SUPABASE_URL = 'https://mfevyxlyjzjlrowbjwtv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_v25Fwjw-Z9DIgQyxkwZHBA_i7IBdj6n';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const fetchBtn = document.getElementById('fetch-btn');
const outputDiv = document.getElementById('output');

fetchBtn.addEventListener('click', async () => {
    outputDiv.innerText = "Loading data...";
    
    let { data: tasks, error } = await supabaseClient
        .from('tasks')
        .select('*');

    if (error) {
        outputDiv.innerText = `Error: ${error.message}`;
        return;
    }

    outputDiv.innerHTML = "";

    // 2. Handle empty table state safely
    if (tasks.length === 0) {
        outputDiv.innerHTML = "<p class='empty-state'>No tasks found. Add some in your database!</p>";
        return;
    }

    tasks.forEach(task => {
        const card = document.createElement('div');
        card.classList.add('task-card');

        // Parse a readable date string format
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
});