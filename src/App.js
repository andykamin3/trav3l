import * as React from 'react';
import Container from '@mui/material/Container';


import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ResponsiveDrawer from "./components/Drawer";
import {QueryClient, QueryClientProvider, useQueryClient} from "@tanstack/react-query";
import SimpleMap from "./components/Map";
import {AppRouter} from "./components/AppRouter";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const queryClient = new QueryClient()
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container>
          <ResponsiveDrawer/>
        </Container>
        </ThemeProvider>
    </QueryClientProvider>
  );
}
