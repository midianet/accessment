import { createTheme } from '@mui/material';
import { cyan, blue } from '@mui/material/colors';

export const LightTheme =  createTheme({
  palette: {
    primary: {
      main: blue[700],
      dark: blue[800],
      light: blue[500],
      contrastText: '#000000',
    },
    secondary: {
      main: cyan[500],
      dark: cyan[400],
      light: cyan[300],
      contrastText: '#ffffff',
    } ,      
    background: {
      paper: '#e6e7e8',
      default: '#f0f2f5'
    }
  }
});

