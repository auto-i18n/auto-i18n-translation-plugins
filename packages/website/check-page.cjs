const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log(`响应头: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n页面HTML长度:', data.length);
    console.log('包含 #app div:', data.includes('<div id="app">'));
    console.log('包含 main.js:', data.includes('/src/main.js'));
    
    const hasViteClient = data.includes('@vite/client');
    const statusMessage = hasViteClient ? '✅ Vite 开发服务器正常运行' : '❌ Vite 客户端未加载';
    console.log(statusMessage);
  });
});

req.on('error', (e) => {
  console.error(`请求出错: ${e.message}`);
});

req.end();
