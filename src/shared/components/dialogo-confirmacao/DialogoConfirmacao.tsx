
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Icon, Box, Grid } from '@mui/material';

interface DialogData {
    text: string,
    isOpen: boolean,
    handleYes: () => void, 
    handleNo?: (isOpenDelete: boolean) => void,
}
export const DialogoConfirmacao: React.FC<DialogData> = ({text, isOpen, handleYes ,handleNo}) => {

  const onNo = () =>{
    if(handleNo) handleNo(false);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={isOpen}
    >
      <DialogTitle></DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="vertical">
          <Grid item container spacing={2}  display="flex" justifyContent="space-between">
            <Grid item>
              <DialogContentText>{text}</DialogContentText>
            </Grid>
            <Grid item>
              <Icon fontSize="large">help</Icon>
            </Grid>
          </Grid>
        </Box>
        <Divider/>
        <DialogActions>
          <Button onClick={handleYes}>Sim</Button>
          <Button onClick={() => onNo()} autoFocus>Não</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );

};