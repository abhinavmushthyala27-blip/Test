import AddIcon from '@mui/icons-material/Add';
import { Alert, Box, Button, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { TASK_COLUMNS } from '../constants/taskStatus';
import { useTasks } from '../hooks/useTasks';
import ConfirmDialog from './ConfirmDialog';
import TaskColumn from './TaskColumn';
import TaskDialog from './TaskDialog';

export default function TaskBoard({ api }) {
  const { tasksByStatus, loading, error, addTask, editTask, removeTask } = useTasks(api);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [actionError, setActionError] = useState('');

  const openAddDialog = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleSubmit = async (task) => {
    setActionError('');
    try {
      if (editingTask) {
        await editTask(editingTask.id, task);
      } else {
        await addTask(task);
      }
      setDialogOpen(false);
      setEditingTask(null);
    } catch {
      setActionError('Unable to save task.');
    }
  };

  const handleUpdate = async (id, task) => {
    setActionError('');
    try {
      await editTask(id, task);
    } catch {
      setActionError('Unable to update task.');
    }
  };

  const handleDelete = async () => {
    if (!deletingTask) {
      return;
    }

    setActionError('');
    try {
      await removeTask(deletingTask.id);
      setDeletingTask(null);
    } catch {
      setActionError('Unable to delete task.');
    }
  };

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 360 }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
            Task Board
          </Typography>
          <Typography color="text.secondary">
            Favorites are sorted first, then tasks are ordered by name.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAddDialog}>
          Add task
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}

      <Grid container spacing={2}>
        {TASK_COLUMNS.map((column) => (
          <Grid item xs={12} md={4} key={column.value}>
            <TaskColumn
              title={column.label}
              tasks={tasksByStatus[column.value] ?? []}
              onEdit={(task) => {
                setEditingTask(task);
                setDialogOpen(true);
              }}
              onDelete={setDeletingTask}
              onUpdate={handleUpdate}
            />
          </Grid>
        ))}
      </Grid>

      <TaskDialog
        open={dialogOpen}
        task={editingTask}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        open={Boolean(deletingTask)}
        title="Delete task"
        message={`Delete "${deletingTask?.name ?? 'this task'}"? This action cannot be undone.`}
        onCancel={() => setDeletingTask(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
