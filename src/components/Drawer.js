import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Button, Chip} from "@mui/material";
import {AppRouter} from "./AppRouter";
import {Article, Bookmark, HomeSharp, QueryBuilderSharp} from "@mui/icons-material";
import {updateWallet, web3Modal} from "./Web3Modal";
import {login} from "./utils/LensUtils";

const drawerWidth = 240;

export default function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {['Home', 'Recent', 'Your content', 'Saved'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index === 0 ? <HomeSharp /> : index === 1 ? <QueryBuilderSharp /> : index === 2 ? <Article /> : <Bookmark />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;
  const [provider, setProvider] = React.useState(null);
  const [address, setAddress] = React.useState(null);
  const [library, setLibrary] = React.useState(null);
  const [chainId, setChainId] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [account, setAccount] = React.useState(null);




  // Connect wallet with web3 modal
    const connectWallet = async () => {
      try {
        await web3Modal.clearCachedProvider();
        const {provider, library, accounts, network, signer} = await updateWallet(web3Modal);
        setProvider(provider);
        setLibrary(library);
        console.log(signer);
        console.log(network.chainId);
        setChainId(network.chainId);
        let loginResult = await login(signer, accounts[0]);
        if (accounts) setAccount(accounts[0]);
        console.log(loginResult);
      } catch (error) {
        setError(error);
      }
    };


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar style={
                        {"justifyContent": "space-between","display": "flex"}
                      } >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}

            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            tibbi
          </Typography>

            {account ? <Chip variant={"filled"} label={account.substring(0,6)+"..."+account.substring(account.length-6,account.length-1)}></Chip> :<Button variant={"contained"} onClick={connectWallet}>Log in with Lens</Button>}

        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <AppRouter/>
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

