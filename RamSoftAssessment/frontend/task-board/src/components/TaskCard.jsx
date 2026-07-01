import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { TASK_COLUMNS, TASK_STATUS_LABELS } from '../constants/taskStatus';

export default function TaskCard({ task, onEdit, onDelete, onUpdate }) {
  const handleFavoriteClick = () => {
    onUpdate(task.id, { ...task, isFavorite: !task.isFavorite });
  };

  const handleStatusChange = (event) => {
    onUpdate(task.id, { ...task, status: Number(event.target.value) });
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Box>
            <Typography
              component={RouterLink}
              to={`/tasks/${task.id}`}
              variant="subtitle1"
              color="text.primary"
              sx={{ fontWeight: 700, textDecoration: 'none' }}
            >
              {task.name}
            </Typography>
            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {task.description}
              </Typography>
            )}
          </Box>
          <Tooltip title={task.isFavorite ? 'Remove favorite' : 'Mark favorite'}>
            <IconButton
              aria-label={task.isFavorite ? 'Remove favorite' : 'Mark favorite'}
              color={task.isFavorite ? 'warning' : 'default'}
              size="small"
              onClick={handleFavoriteClick}
            >
              {task.isFavorite ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 2 }}>
          <Chip size="small" label={TASK_STATUS_LABELS[task.status]} />
          {task.deadline && (
            <Typography variant="caption" color="text.secondary">
              Due {new Date(task.deadline).toLocaleDateString()}
            </Typography>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Select
          size="small"
          value={task.status}
          onChange={handleStatusChange}
          inputProps={{ 'aria-label': `Status for ${task.name}` }}
          sx={{ minWidth: 136 }}
        >
          {TASK_COLUMNS.map((status) => (
            <MenuItem key={status.value} value={status.value}>
              {status.label}
            </MenuItem>
          ))}
        </Select>
        <Box>
          <Tooltip title="Edit task">
            <IconButton aria-label={`Edit ${task.name}`} size="small" onClick={() => onEdit(task)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete task">
            <IconButton aria-label={`Delete ${task.name}`} size="small" onClick={() => onDelete(task)}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
}
