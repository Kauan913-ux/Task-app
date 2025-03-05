import http from 'node:http';
import taskController from './controller/taskController.js';

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === 'POST' && url === '/tasks') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const { name } = JSON.parse(body);
      taskController.createTask(name)
        .then(task => {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(task));
        })
        .catch(err => {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        });
    });
  } else if (method === 'GET' && url.startsWith('/tasks')) {
    const urlObj = new URL(url, `http://${req.headers.host}`);
    const nameFilter = urlObj.searchParams.get('name');

    taskController.listTasks(nameFilter)
      .then(tasks => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));
      })
      .catch(err => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(3333)