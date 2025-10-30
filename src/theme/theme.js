import { createTheme } from '@mui/material/styles';

/**
 * A custom theme for the Recruitment Management System.
 * This provides consistent styling across all MUI components.
 */
export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // A professional blue
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e', // A contrasting pink/red for accents
    },
    background: {
      default: '#f4f6f8', // A light grey background for the app
      paper: '#ffffff', // White for cards, sidebars, etc.
    },
    text: {
      primary: '#172b4d',
      secondary: '#6b778c',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // More modern buttons without all-caps
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'rgba(149, 157, 165, 0.1) 0px 8px 24px', // A subtle shadow
        },
      },
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: '#ffffff',
                color: '#172b4d',
                boxShadow: 'none',
                borderBottom: '1px solid #e0e0e0',
            }
        }
    }
  },
});