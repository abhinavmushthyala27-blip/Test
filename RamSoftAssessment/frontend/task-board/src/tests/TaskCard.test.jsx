import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import { TASK_STATUS } from '../constants/taskStatus';

const baseTask = {
  id: 'task-1',
  name: 'Prepare assessment',
  description: 'Build the task board',
  deadline: null,
  status: TASK_STATUS.todo,
  isFavorite: true,
  imageUrl: null,
};

function renderCard(props = {}) {
  return render(
    <MemoryRouter>
      <TaskCard
        task={{ ...baseTask, ...props.task }}
        onEdit={props.onEdit ?? jest.fn()}
        onDelete={props.onDelete ?? jest.fn()}
        onUpdate={props.onUpdate ?? jest.fn()}
      />
    </MemoryRouter>,
  );
}

test('TaskCard renders task name and favorite state', () => {
  renderCard();

  expect(screen.getByText('Prepare assessment')).toBeInTheDocument();
  expect(screen.getByLabelText('Remove favorite')).toBeInTheDocument();
});

test('TaskCard calls update when status changes', () => {
  const onUpdate = jest.fn();
  renderCard({ onUpdate });

  fireEvent.mouseDown(screen.getByRole('combobox'));
  fireEvent.click(within(screen.getByRole('listbox')).getByText('Done'));

  expect(onUpdate).toHaveBeenCalledWith('task-1', expect.objectContaining({
    status: TASK_STATUS.done,
  }));
});
