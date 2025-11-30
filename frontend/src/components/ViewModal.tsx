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
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    overflowY: 'visible',
                    backgroundColor: displayBackgroundOverlay ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
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
