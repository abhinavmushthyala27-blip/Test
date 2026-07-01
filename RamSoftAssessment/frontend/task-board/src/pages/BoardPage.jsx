import { Container } from '@mui/material';
import TaskBoard from '../components/TaskBoard';

export default function BoardPage() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <TaskBoard />
    </Container>
  );
}
