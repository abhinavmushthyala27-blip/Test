import { useCallback, useEffect, useMemo, useState } from 'react';
import * as tasksApi from '../api/tasksApi';

function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1;
    }

    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
  });
}

export function useTasks(api = tasksApi) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await api.getTasks();
      setTasks(sortTasks(data));
    } catch {
      setError('Unable to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = useCallback(async (task) => {
    const created = await api.createTask(task);
    setTasks((current) => sortTasks([...current, created]));
    return created;
  }, [api]);

  const editTask = useCallback(async (id, task) => {
    const updated = await api.updateTask(id, task);
    setTasks((current) => sortTasks(current.map((item) => (item.id === id ? updated : item))));
    return updated;
  }, [api]);

  const removeTask = useCallback(async (id) => {
    await api.deleteTask(id);
    setTasks((current) => current.filter((task) => task.id !== id));
  }, [api]);

  const tasksByStatus = useMemo(() => tasks.reduce((groups, task) => {
    groups[task.status] = [...(groups[task.status] ?? []), task];
    return groups;
  }, {}), [tasks]);

  return {
    tasks,
    tasksByStatus,
    loading,
    error,
    reload: loadTasks,
    addTask,
    editTask,
    removeTask,
  };
}
