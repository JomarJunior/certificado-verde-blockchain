import { createTheme } from "@mui/material";


const defaultTheme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#333C43",
            paper: "#3A464C",
        },
        primary: {
            main: "#A7C080",
        },
        secondary: {
            main: "#293136",
        },
        text: {
            primary: "#D3C6AA",
            secondary: "#AFA39D",
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



// const defaultTheme = createTheme({
//     palette: {
//         mode: "dark",
//         background: {
//             default: "#1b1b1e",
//             paper: "#373F51",
//         },
//         primary: {
//             main: "#58a4b0",
//         },
//         secondary: {
//             main: "#a9bcd0",
//         },
//         text: {
//             primary: "#D8DBE2",
//         },
//     },
//     typography: {
//         fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
//     },
// });

export default defaultTheme;
