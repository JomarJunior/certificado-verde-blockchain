import { Dialog, DialogTitle } from "@mui/material";

interface ViewModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    displayBackgroundOverlay?: boolean;
    children: React.ReactNode;
};

const ViewModal: React.FC<ViewModalProps> = ({ open, onClose, title, displayBackgroundOverlay = false, children }) => {
    if (!open) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xl"
            fullWidth
            fullScreen={false}
            scroll="paper"
            sx={{
                '& .MuiDialog-paper': {
                    overflowY: 'auto',
                    backgroundColor: displayBackgroundOverlay ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
                    maxHeight: { xs: '90vh', sm: '90vh', md: 'calc(100vh - 64px)' },
                    margin: { xs: 2, sm: 3 },
                },
                '& .MuiDialogContent-root': {
                    overflowY: 'auto',
                },
            }}
            slotProps={{
                paper: {
                    elevation: displayBackgroundOverlay ? 24 : 0,
                }
            }}
        >
            {title && <DialogTitle>{title}</DialogTitle>}
            {children}
        </Dialog>
    );
}

export default ViewModal;
