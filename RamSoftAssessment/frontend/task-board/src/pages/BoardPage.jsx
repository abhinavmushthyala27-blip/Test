import { Container } from '@mui/material';
import TaskBoard from '../components/TaskBoard';

export default function BoardPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <TaskBoard />
    </Container>
  );
}
