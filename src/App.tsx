
import './shared/forms/translateYup';

import { BrowserRouter } from 'react-router-dom';

import { AppRoutes } from './routes';
import { AuthProvider, MessageProvider } from './shared/contexts';
import { DrawerProvider } from './shared/contexts/DrawerContext';
import { AppThemeProvider } from './shared/contexts/ThemeContext';
import { Login, MenuLateral } from './shared/components';

export const App = () => {
  return (
    <AuthProvider>
      <AppThemeProvider>
        <Login>
          <MessageProvider>
            <DrawerProvider>
              <BrowserRouter>
                <MenuLateral>
                  <AppRoutes />
                </MenuLateral>
              </BrowserRouter>
            </DrawerProvider>
          </MessageProvider>
        </Login>
      </AppThemeProvider>
    </AuthProvider>
  );
};