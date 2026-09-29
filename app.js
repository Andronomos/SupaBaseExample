const SUPABASE_URL = 'https://mfevyxlyjzjlrowbjwtv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_v25Fwjw-Z9DIgQyxkwZHBA_i7IBdj6n';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const fetchBtn = document.getElementById('fetch-btn');
const outputDiv = document.getElementById('output');

fetchBtn.addEventListener('click', async () => {
    outputDiv.innerText = "Loading data...";
    
    let { data: tasks, error } = await supabase
        .from('tasks')
        .select('*');

    if (error) {
        outputDiv.innerText = `Error: ${error.message}`;
        return;
    }

    // Display the results
    outputDiv.innerText = JSON.stringify(tasks, null, 2);
});