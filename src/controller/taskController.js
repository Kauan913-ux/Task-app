let tasks = [];
let nextId = 1;

const createTask = async(name) => {
  if (tasks.some(task => task.name === name)) {
    return { error: 'Task with the same name already exists' };
  }

  const task = { id: nextId++, name, isDone: false };
  tasks.push(task);
  return task;
};

const getTaskById = (id) => {
  const task = tasks.find(task => task.id === parseInt(id));
  if (!task) {
    return { error: 'Task not found' };
  }
  return task;
};

const toggleTaskStatus = (id) => {
  const task = tasks.find(task => task.id === parseInt(id));
  if (!task) {
    return { error: 'Task not found' };
  }
  task.isDone = !task.isDone;
  return task;
};

const deleteTask = (id) => {
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
  if (taskIndex === -1) {
    return { error: 'Task not found' };
  }
  const deletedTask = tasks.splice(taskIndex, 1)[0];
  return deletedTask;
};

const listTasks = async(nameFilter) => {
  let filteredTasks = tasks;
  if (nameFilter) {
    filteredTasks = tasks.filter(task => task.name.includes(nameFilter));
  }
  return filteredTasks;
};

export default {
  createTask,
  getTaskById,
  toggleTaskStatus,
  deleteTask,
  listTasks
};