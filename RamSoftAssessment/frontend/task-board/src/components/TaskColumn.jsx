import { Box, Stack, Typography } from '@mui/material';
import TaskCard from './TaskCard';

export default function TaskColumn({ title, accent, background, tasks, onEdit, onDelete, onUpdate }) {
  return (
    <Box
      component="section"
      aria-label={`${title} column`}
      sx={{
        bgcolor: background,
        border: '1px solid',
        borderColor: 'rgba(148, 163, 184, 0.28)',
        borderRadius: 3,
        minHeight: 460,
        p: 2,
        boxShadow: '0 18px 45px rgba(15, 23, 42, 0.06)',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: accent,
              boxShadow: `0 0 0 4px ${background}`,
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {title} ({tasks.length})
          </Typography>
        </Stack>
      </Stack>
      <Stack spacing={2}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
        {tasks.length === 0 && (
          <Box
            sx={{
              border: '1px dashed',
              borderColor: 'rgba(100, 116, 139, 0.35)',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.55)',
            }}
          >
            <Typography color="text.secondary" variant="body2">
              No tasks in this column.
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
