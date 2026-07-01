import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { getTaskById } from '../api/tasksApi';
import { TASK_STATUS_LABELS } from '../constants/taskStatus';

export default function TaskDetailsPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadTask() {
      try {
        const data = await getTaskById(id);
        if (active) {
          setTask(data);
        }
      } catch {
        if (active) {
          setError('Unable to load task details.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadTask();

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
        Back to board
      </Button>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {task && (
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
              {task.name}
            </Typography>
            {task.isFavorite && <StarIcon color="warning" aria-label="Favorite task" />}
          </Stack>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {TASK_STATUS_LABELS[task.status]}
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle2">Description</Typography>
          <Typography sx={{ mb: 3 }}>{task.description || 'No description provided.'}</Typography>
          <Typography variant="subtitle2">Deadline</Typography>
          <Typography sx={{ mb: 3 }}>
            {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
          </Typography>
          {task.imageUrl && (
            <>
              <Typography variant="subtitle2">Image URL</Typography>
              <Typography sx={{ overflowWrap: 'anywhere' }}>{task.imageUrl}</Typography>
            </>
          )}
        </Box>
      )}
    </Container>
  );
}
