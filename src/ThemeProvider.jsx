
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        type: 'light',
        primary: {
          main: '#03a9f4',
        },
        secondary: {
          main: '#f50057',
        },
        background: {
          default: '#e0f7fa',
          paper: '#fffafa',
          card: '#fffafa',

        },
      },
      spacing: 8,
      shape: {
        borderRadius: 4,
      },
      overrides: {
        MuiSwitch: {
          root: {
            width: 42,
            height: 26,
            padding: 0,
            margin: 8,
          },
          switchBase: {
            padding: 1,
            '&$checked, &$colorPrimary$checked, &$colorSecondary$checked': {
              transform: 'translateX(16px)',
              color: '#fff',
              '& + $track': {
                opacity: 1,
                border: 'none',
              },
            },
          },
          thumb: {
            width: 24,
            height: 24,
          },
          track: {
            borderRadius: 13,
            border: '1px solid #bdbdbd',
            backgroundColor: '#fafafa',
            opacity: 1,
            transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          },
        },
      },
      props: {
        MuiButtonBase: {
          disableRipple: true,
        },
        MuiList: {
          dense: true,
        },
        MuiMenuItem: {
          dense: true,
        },
        MuiTable: {
          size: 'small',
        },
        MuiTooltip: {
          arrow: true,
        },
      },
});

export default theme;