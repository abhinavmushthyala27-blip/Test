import { Box, Stack, Typography } from '@mui/material';
import TaskCard from './TaskCard';

export default function TaskColumn({ title, tasks, onEdit, onDelete, onUpdate }) {
  return (
    <Box
      component="section"
      aria-label={`${title} column`}
      sx={{
        bgcolor: 'grey.100',
        borderRadius: 2,
        minHeight: 360,
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        {title} ({tasks.length})
      </Typography>
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
          <Typography color="text.secondary" variant="body2">
            No tasks in this column.
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
