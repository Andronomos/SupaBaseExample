const SUPABASE_URL = 'https://mfevyxlyjzjlrowbjwtv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_v25Fwjw-Z9DIgQyxkwZHBA_i7IBdj6n';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
        headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
    }
});

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

    outputDiv.innerText = JSON.stringify(tasks, null, 2);
});