import http from 'node:http';
import taskController from './controller/taskController.js';
import { URL } from 'url';

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

    if (urlObj.pathname === '/tasks') {
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
      const id = urlObj.pathname.split('/')[2];
      taskController.getTaskById(id)
        .then(task => {
          if (!task) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Task not found' }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(task));
          }
        })
        .catch(err => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        });
    }
  } else if (method === 'PATCH' && url.startsWith('/tasks/')) {
    const id = url.split('/')[2];
    taskController.toggleTaskStatus(id)
      .then(task => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(task));
      })
      .catch(err => {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });
  } else if (method === 'DELETE' && url.startsWith('/tasks/')) {
    const id = url.split('/')[2];
    taskController.deleteTask(id)
      .then(task => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(task));
      })
      .catch(err => {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(3333);