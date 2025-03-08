let tasks = [];
let nextId = 1;

const createTask = (name) => {
  if (tasks.some(task => task.name === name)) {
    return Promise.reject(new Error('Task with the same name already exists'));
  }

  const task = { id: nextId++, name, isDone: false };
  tasks.push(task);
  return Promise.resolve(task);
};

const getTaskById = (id) => {
  const task = tasks.find(task => task.id === parseInt(id));
  if (!task) {
    return Promise.resolve(null);
  }
  return Promise.resolve(task);
};

const listTasks = (nameFilter) => {
  let filteredTasks = tasks;
  if (nameFilter) {
    filteredTasks = tasks.filter(task => task.name.includes(nameFilter));
  }
  return Promise.resolve(filteredTasks);
};

const toggleTaskStatus = (id) => {
  const task = tasks.find(task => task.id === parseInt(id));
  if (!task) {
    return Promise.reject(new Error('Task not found'));
  }
  task.isDone = !task.isDone;
  return Promise.resolve(task);
};

const deleteTask = (id) => {
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
  if (taskIndex === -1) {
    return Promise.reject(new Error('Task not found'));
  }
  const deletedTask = tasks.splice(taskIndex, 1)[0];
  return Promise.resolve(deletedTask);
};

export default {
  createTask,
  getTaskById,
  listTasks,
  toggleTaskStatus,
  deleteTask
};