import { ReactNode } from 'react';
import { Icon, IconButton, Theme, Typography, useMediaQuery, useTheme, Box, Alert } from '@mui/material';
import { useDrawerContext, useMessageContext } from '../contexts';

interface ILayoutBaseProps{
    titulo: string;
    children?: ReactNode;
    toolbar?: ReactNode | undefined;
}
export const LayoutBase: React.FC<ILayoutBaseProps> = ({ children, titulo, toolbar }) => {
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));  
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));  
  const theme = useTheme();
  const { toggleDrawerOpen } = useDrawerContext();
  const {message} = useMessageContext();

  return (
    <Box height="100%" display="flex" flexDirection="column" gap={1}>
      <Box padding={0} display="flex" alignItems="center" gap={1} height={theme.spacing(smDown ? 6 : mdDown ? 8 : 12)} >
        {smDown && (
          <IconButton onClick={toggleDrawerOpen} >
            <Icon>menu</Icon>
          </IconButton>
        )}
        <Typography 
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          paddingLeft={1}
          variant={smDown ? 'h6' : mdDown ?  'h3' : 'h2'}
        >
          {titulo}
        </Typography>
      </Box>
      {toolbar && (<Box>
        {toolbar}
        {message && (
          <Alert severity={message.level}>{message.message}</Alert>
        )}
      </Box>
      )}
      <Box flex={1} overflow="auto">
        {children}
      </Box>
    </Box>
  );
};