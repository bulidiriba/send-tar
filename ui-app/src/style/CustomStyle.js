import {makeStyles} from '@material-ui/core';
import {createTheme} from '@material-ui/core/styles';

export const theme = createTheme({
    palette:{
        primary: {
            main: "#4791db",
            background: "#233655",
            text: "#b9bdc1",
            error: "#f44336",
            success: "#4caf50",
        },
        secondary:{
            main: '#2e9ad6'
        },
    }
})


export const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#233655',
        minHeight: '100vh',
    },
    fileUpload: {
        backgroundColor: '#0a2042',
    },
}));