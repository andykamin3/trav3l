import * as React from 'react';
import AppBar from '@mui/material/AppBar';

import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import {Button, Typography} from "@mui/material";

export default function Header(){

  return (
    <AppBar>
      <Container>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant={'h5'}>
            tibio
          </Typography>
          <Button
            edge={'end'}
            variant={'contained'}>
            Log in with Ethereum
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
