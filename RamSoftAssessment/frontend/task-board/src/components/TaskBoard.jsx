import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { TASK_COLUMNS } from '../constants/taskStatus';
import { useTasks } from '../hooks/useTasks';
import ConfirmDialog from './ConfirmDialog';
import TaskColumn from './TaskColumn';
import TaskDialog from './TaskDialog';

export default function TaskBoard({ api }) {
  const { tasks, tasksByStatus, loading, error, addTask, editTask, removeTask } = useTasks(api);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [actionError, setActionError] = useState('');
  const favoriteCount = tasks.filter((task) => task.isFavorite).length;

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
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 460 }}>
        <CircularProgress size={44} thickness={4} />
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Loading your task board...
        </Typography>
      </Stack>
    );
  }

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          mb: 3,
          bgcolor: 'rgba(255, 255, 255, 0.88)',
          boxShadow: '0 24px 70px rgba(15, 23, 42, 0.08)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 'auto -5rem -7rem auto',
            width: 260,
            height: 260,
            borderRadius: '50%',
            bgcolor: 'rgba(37, 99, 235, 0.10)',
          }}
        />
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'stretch', md: 'center' }}
          justifyContent="space-between"
          spacing={3}
          sx={{ position: 'relative' }}
        >
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <Chip
                icon={<ViewKanbanOutlinedIcon />}
                label="Live board"
                size="small"
                sx={{ bgcolor: '#eff6ff', color: 'primary.dark', fontWeight: 700 }}
              />
              <Chip
                icon={<StarIcon />}
                label={`${favoriteCount} favorites`}
                size="small"
                sx={{ bgcolor: '#fffbeb', color: '#92400e', fontWeight: 700 }}
              />
            </Stack>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 900, maxWidth: 720, lineHeight: 1.15 }}
            >
              Plan, prioritize, and move work.
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 680 }}>
              Favorites stay at the top, tasks remain alphabetized, and every update is synced with the API.
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={openAddDialog}
            sx={{ px: 3, alignSelf: { xs: 'stretch', md: 'center' } }}
          >
            Add task
          </Button>
        </Stack>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}

      <Grid container spacing={2.5}>
        {TASK_COLUMNS.map((column) => (
          <Grid item xs={12} md={4} key={column.value}>
            <TaskColumn
              title={column.label}
              accent={column.accent}
              background={column.background}
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
