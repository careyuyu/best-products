import { createTheme, colors} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#01012b',
      contrastText: '#fff',
    },
    secondary: {
      main: '#894f93',
      contrastText: '#fff',
    },
  },
});

export default theme