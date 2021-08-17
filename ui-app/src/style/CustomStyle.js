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
            main: '#2e9ad6',
            hint: "#b9bdc1",
        },
        text: {
            primary: "#b9bdc1",
            secondary: "#808080",
            disabled: "#b9bdc1",
            hint: "#b9bdc1",
            
        }
    }
})


export const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#233655',
        minHeight: '100vh',
        overflow:'hidden'
    },
    fileUpload: {
        backgroundColor: '#0a2042',
    },
}));