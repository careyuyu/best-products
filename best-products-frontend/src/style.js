import { createTheme} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#01012b',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f44336',
      contrastText: '#000',
    },
  },
});

export default theme