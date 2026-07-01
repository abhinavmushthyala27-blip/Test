export const TASK_STATUS = {
  todo: 0,
  inProgress: 1,
  done: 2,
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.todo]: 'Todo',
  [TASK_STATUS.inProgress]: 'In Progress',
  [TASK_STATUS.done]: 'Done',
};

export const TASK_COLUMNS = [
  { value: TASK_STATUS.todo, label: TASK_STATUS_LABELS[TASK_STATUS.todo] },
  { value: TASK_STATUS.inProgress, label: TASK_STATUS_LABELS[TASK_STATUS.inProgress] },
  { value: TASK_STATUS.done, label: TASK_STATUS_LABELS[TASK_STATUS.done] },
];

export function normalizeStatus(status) {
  if (typeof status === 'number') {
    return status;
  }

  const normalized = String(status).toLowerCase();
  if (normalized === 'todo') {
    return TASK_STATUS.todo;
  }

  if (normalized === 'inprogress') {
    return TASK_STATUS.inProgress;
  }

  if (normalized === 'done') {
    return TASK_STATUS.done;
  }

  return TASK_STATUS.todo;
}
