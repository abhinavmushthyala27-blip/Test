import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TaskBoard from '../components/TaskBoard';
import { TASK_STATUS } from '../constants/taskStatus';

function createApi(tasks = []) {
  return {
    getTasks: jest.fn().mockResolvedValue(tasks),
    createTask: jest.fn().mockImplementation(async (task) => ({ ...task, id: 'created-task' })),
    updateTask: jest.fn().mockImplementation(async (_id, task) => task),
    deleteTask: jest.fn().mockResolvedValue(undefined),
  };
}

function renderBoard(api) {
  return render(
    <MemoryRouter>
      <TaskBoard api={api} />
    </MemoryRouter>,
  );
}

test('TaskBoard renders columns', async () => {
  const api = createApi();

  renderBoard(api);

  expect(await screen.findByText('Todo (0)')).toBeInTheDocument();
  expect(screen.getByText('In Progress (0)')).toBeInTheDocument();
  expect(screen.getByText('Done (0)')).toBeInTheDocument();
});

test('Add task flow opens dialog', async () => {
  const api = createApi();

  renderBoard(api);

  fireEvent.click(await screen.findByRole('button', { name: /add task/i }));

  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /add task/i })).toBeInTheDocument();
});

test('Status change calls update API mock', async () => {
  const api = createApi([
    {
      id: 'task-1',
      name: 'Move me',
      description: '',
      deadline: null,
      status: TASK_STATUS.todo,
      isFavorite: false,
      imageUrl: null,
    },
  ]);

  renderBoard(api);

  await screen.findByText('Move me');
  fireEvent.mouseDown(screen.getByRole('combobox', { name: /status for move me/i }));
  fireEvent.click(within(screen.getByRole('listbox')).getByText('Done'));

  await waitFor(() => {
    expect(api.updateTask).toHaveBeenCalledWith('task-1', expect.objectContaining({
      status: TASK_STATUS.done,
    }));
  });
});
