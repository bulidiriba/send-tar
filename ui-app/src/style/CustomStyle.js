import {makeStyles} from '@material-ui/core';
import {createTheme} from '@material-ui/core/styles';

export const theme = createTheme({
    palette:{
        primary: {
            main: "#4791db"
        },
        secondary:{
            main: '#2e9ad6'
        },
        error: {
            main: "#f44336",
        },
        info: {
            main: "#b9bdc1",
        },
        success: {
            main: "#4caf50",
        }
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
    info: {
        color: '#b9bdc1',
    },
    success: {
        color: "#4caf50",
    },
}));