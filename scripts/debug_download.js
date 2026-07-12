const https = require('https');
const url = 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1NjZiNmAwMjA3ZDcwNGU3NGQ2MmM1M2RhNzEwEgsSBxDq26qmkgEYAZIBIwoKcHJvamVjdF9pZBIVQhMyNzAxNzg2Nzc1OTI3ODMyMDAw&filename=&opi=89354086';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Headers:', res.headers);
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Body length:', body.length);
    console.log('First 200 chars:', body.slice(0, 200));
  });
}).on('error', err => {
  console.error('Error:', err);
});
