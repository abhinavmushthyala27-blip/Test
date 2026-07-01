import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { getTaskById } from '../api/tasksApi';
import { TASK_STATUS_LABELS, TASK_STATUS_META } from '../constants/taskStatus';

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
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
        Back to board
      </Button>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {task && (
        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            p: { xs: 3, md: 4 },
            bgcolor: 'rgba(255, 255, 255, 0.90)',
            boxShadow: '0 24px 70px rgba(15, 23, 42, 0.08)',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
              {task.name}
            </Typography>
            {task.isFavorite && <StarIcon color="warning" aria-label="Favorite task" />}
          </Stack>
          <Chip
            label={TASK_STATUS_LABELS[task.status]}
            sx={{
              mt: 2,
              bgcolor: TASK_STATUS_META[task.status]?.background,
              color: TASK_STATUS_META[task.status]?.accent,
              fontWeight: 800,
            }}
          />
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Description</Typography>
          <Typography sx={{ mb: 3 }}>{task.description || 'No description provided.'}</Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Deadline</Typography>
          <Typography sx={{ mb: 3 }}>
            {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
          </Typography>
          {task.imageUrl && (
            <>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Image URL</Typography>
              <Typography sx={{ overflowWrap: 'anywhere' }}>{task.imageUrl}</Typography>
            </>
          )}
        </Paper>
      )}
    </Container>
  );
}
