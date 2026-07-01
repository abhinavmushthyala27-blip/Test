import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { AppBar, Box, CssBaseline, Toolbar, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BoardPage from './pages/BoardPage';
import TaskDetailsPage from './pages/TaskDetailsPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1d4ed8',
      dark: '#1e3a8a',
    },
    secondary: {
      main: '#0891b2',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: [
      'Inter',
      'Segoe UI',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      letterSpacing: 0,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderColor: '#e2e8f0',
        },
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box
          sx={{
            minHeight: '100vh',
            background:
              'radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 32rem), linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
          }}
        >
          <AppBar
            position="sticky"
            elevation={0}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.84)',
              color: 'text.primary',
              borderBottom: '1px solid',
              borderColor: 'divider',
              backdropFilter: 'blur(16px)',
            }}
          >
            <Toolbar sx={{ gap: 1.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  display: 'grid',
                  placeItems: 'center',
                  color: 'white',
                  bgcolor: 'primary.main',
                }}
              >
                <CheckCircleOutlineIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                  RamSoft Task Board
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Assessment
                </Typography>
              </Box>
            </Toolbar>
          </AppBar>
          <Routes>
            <Route path="/" element={<BoardPage />} />
            <Route path="/tasks/:id" element={<TaskDetailsPage />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}
