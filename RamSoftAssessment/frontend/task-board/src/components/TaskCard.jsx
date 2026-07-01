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
import { TASK_COLUMNS, TASK_STATUS_LABELS, TASK_STATUS_META } from '../constants/taskStatus';

export default function TaskCard({ task, onEdit, onDelete, onUpdate }) {
  const statusMeta = TASK_STATUS_META[task.status];

  const handleFavoriteClick = () => {
    onUpdate(task.id, { ...task, isFavorite: !task.isFavorite });
  };

  const handleStatusChange = (event) => {
    onUpdate(task.id, { ...task, status: Number(event.target.value) });
  };

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        bgcolor: 'rgba(255, 255, 255, 0.94)',
        boxShadow: '0 16px 36px rgba(15, 23, 42, 0.08)',
        transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 22px 48px rgba(15, 23, 42, 0.12)',
          borderColor: statusMeta?.accent ?? 'primary.main',
        },
      }}
    >
      <CardContent sx={{ pb: 1.5 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component={RouterLink}
              to={`/tasks/${task.id}`}
              variant="subtitle1"
              color="text.primary"
              sx={{
                display: 'inline-block',
                fontWeight: 800,
                textDecoration: 'none',
                overflowWrap: 'anywhere',
                '&:hover': { color: 'primary.main' },
              }}
            >
              {task.name}
            </Typography>
            {task.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.75,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
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
              sx={{
                bgcolor: task.isFavorite ? '#fffbeb' : 'transparent',
                '&:hover': { bgcolor: task.isFavorite ? '#fef3c7' : 'grey.100' },
              }}
            >
              {task.isFavorite ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 2, flexWrap: 'wrap', rowGap: 1 }}>
          <Chip
            size="small"
            label={TASK_STATUS_LABELS[task.status]}
            sx={{
              bgcolor: statusMeta?.background,
              color: statusMeta?.accent,
              fontWeight: 800,
            }}
          />
          {task.deadline && (
            <Typography variant="caption" color="text.secondary">
              Due {new Date(task.deadline).toLocaleDateString()}
            </Typography>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2, pt: 0 }}>
        <Select
          size="small"
          value={task.status}
          onChange={handleStatusChange}
          inputProps={{ 'aria-label': `Status for ${task.name}` }}
          sx={{
            minWidth: 136,
            bgcolor: 'grey.50',
            '& .MuiSelect-select': { py: 0.85 },
          }}
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
