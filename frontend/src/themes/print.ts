import { createTheme } from "@mui/material";


const printTheme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#ffffffff",
            paper: "#ffffffff",
        },
        primary: {
            main: "#A7C080",
        },
        secondary: {
            main: "#293136",
        },
        text: {
            primary: "#000000ff",
            secondary: "#000000ff",
        },
        error: {
            main: "#E67E80",
        },
        warning: {
            main: "#E69875",
        },
        info: {
            main: "#7FBBB3",
        },
        success: {
            main: "#83C092",
        },
    },
    typography: {
        fontFamily: "'Fira Mono', monospace",
    },
})

export default printTheme;
