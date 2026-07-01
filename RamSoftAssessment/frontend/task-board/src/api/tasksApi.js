import axios from 'axios';
import { normalizeStatus } from '../constants/taskStatus';

const API_BASE_URL = globalThis.__TASK_API_BASE_URL__ ?? 'http://localhost:5143/api';

const client = axios.create({
  baseURL: API_BASE_URL,
});

function normalizeTask(task) {
  return {
    ...task,
    status: normalizeStatus(task.status),
  };
}

export async function getTasks() {
  const { data } = await client.get('/tasks');
  return data.map(normalizeTask);
}

export async function getTaskById(id) {
  const { data } = await client.get(`/tasks/${id}`);
  return normalizeTask(data);
}

export async function createTask(task) {
  const { data } = await client.post('/tasks', task);
  return normalizeTask(data);
}

export async function updateTask(id, task) {
  const { data } = await client.put(`/tasks/${id}`, task);
  return normalizeTask(data);
}

export async function deleteTask(id) {
  await client.delete(`/tasks/${id}`);
}
