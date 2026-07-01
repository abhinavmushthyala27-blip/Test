import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { TASK_COLUMNS, TASK_STATUS } from '../constants/taskStatus';

const emptyForm = {
  name: '',
  description: '',
  deadline: '',
  status: TASK_STATUS.todo,
  isFavorite: false,
  imageUrl: '',
};

function toFormValue(task) {
  if (!task) {
    return emptyForm;
  }

  return {
    name: task.name ?? '',
    description: task.description ?? '',
    deadline: task.deadline ? task.deadline.slice(0, 10) : '',
    status: task.status,
    isFavorite: Boolean(task.isFavorite),
    imageUrl: task.imageUrl ?? '',
  };
}

export default function TaskDialog({ open, task, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm(toFormValue(task));
  }, [task, open]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      name: form.name.trim(),
      description: form.description.trim() || null,
      deadline: form.deadline ? new Date(`${form.deadline}T00:00:00`).toISOString() : null,
      status: Number(form.status),
      imageUrl: form.imageUrl.trim() || null,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{task ? 'Edit task' : 'Add task'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={handleChange('name')}
              required
              inputProps={{ maxLength: 100 }}
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={handleChange('description')}
              multiline
              minRows={3}
              inputProps={{ maxLength: 1000 }}
            />
            <TextField
              label="Deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange('deadline')}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl>
              <InputLabel id="task-status-label">Status</InputLabel>
              <Select
                labelId="task-status-label"
                label="Status"
                value={form.status}
                onChange={handleChange('status')}
              >
                {TASK_COLUMNS.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Image URL"
              value={form.imageUrl}
              onChange={handleChange('imageUrl')}
              placeholder="https://example.com/image.jpg"
            />
            <FormControlLabel
              control={<Switch checked={form.isFavorite} onChange={handleChange('isFavorite')} />}
              label="Favorite"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
