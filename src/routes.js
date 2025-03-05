import { taskController } from './controller/taskController';

function setRoutes(app) {
  app.post('/tasks', (req, res) => {
    const { name } = req.body;
    const result = taskController.createTask(name);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.status(201).json(result);
  });

  app.get('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const result = taskController.getTaskById(id);

    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    res.status(200).json(result);
  });

  app.patch('/tasks/:id/toggle', (req, res) => {
    const { id } = req.params;
    const result = taskController.toggleTaskStatus(id);

    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    res.status(200).json(result);
  });

  app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const result = taskController.deleteTask(id);

    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    res.status(200).json(result);
  });
}