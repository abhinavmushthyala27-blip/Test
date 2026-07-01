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
  {
    value: TASK_STATUS.todo,
    label: TASK_STATUS_LABELS[TASK_STATUS.todo],
    accent: '#2563eb',
    background: '#eff6ff',
  },
  {
    value: TASK_STATUS.inProgress,
    label: TASK_STATUS_LABELS[TASK_STATUS.inProgress],
    accent: '#0891b2',
    background: '#ecfeff',
  },
  {
    value: TASK_STATUS.done,
    label: TASK_STATUS_LABELS[TASK_STATUS.done],
    accent: '#059669',
    background: '#ecfdf5',
  },
];

export const TASK_STATUS_META = TASK_COLUMNS.reduce((items, column) => ({
  ...items,
  [column.value]: column,
}), {});

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
