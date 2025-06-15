// Clear require cache
Object.keys(require.cache).forEach(function(key) { delete require.cache[key] });

require('dotenv').config();

console.log('HF_API_KEY:', process.env.HF_API_KEY);
