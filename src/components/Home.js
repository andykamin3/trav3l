import Box from "@mui/material/Box";
import {Button, Chip, FormControl, Input, InputLabel, Paper, Typography} from "@mui/material";
import React from "react";
import Stack from "@mui/material/Stack";
import SimpleMap from "./Map";
import {Label} from "@mui/icons-material";
import {Events} from "./events";
import {logInWithWallet, web3Modal} from "./Web3Modal";
import {login} from "./utils/lens/login";
import {getProfiles} from "./utils/lens/get-user";
export function Home() {
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
      const {provider, library, accounts, network, signer} = await logInWithWallet(web3Modal);
      setProvider(provider);
      setLibrary(library);
      console.log(signer);
      setChainId(network.chainId);
      if(chainId !== 80001) {
        setError("Please connect to Mumbai Testnet");
        return;
      }
      let loginResult = await login(signer, accounts[0]);
      let profileData = await getProfiles(accounts[0]);
      console.log(profileData.profiles.items[0]);

      if (accounts) setAccount(accounts[0]);
      console.log(loginResult);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };
  return (
    <div>
      <Paper elevation={3}>
        <Box sx={{p: 2}}>
          <Box sx={{"justifyContent": "space-between","display": "flex"}}>
            {error && <Chip label={error} color="error"/>}
          <Typography variant={'h5'}>trav3l</Typography>
            {account ? <Chip variant={"filled"} label={account.substring(0,6)+"..."+account.substring(account.length-6,account.length-1)}></Chip> :<Button variant={"contained"} onClick={connectWallet}>Log in with Lens</Button>}
          </Box>
          <Typography variant={'body1'}>
            connect digital nomads with local communities. trav3l makes it easy to find unique spots & experiences about your next adventure.
          </Typography>
        </Box>
      </Paper>
      <Box sx={{p: 2}}>
        <LocationSearch></LocationSearch>
      </Box>
    </div>
  );
}

const LocationSearch = (props) => {
  const autoCompleteRef = React.useRef();
  const inputRef = React.useRef();
  const [place, setPlace] = React.useState(null);

  React.useEffect(() => {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
    );
    autoCompleteRef.current.addListener("place_changed", async function () {
      const place = await autoCompleteRef.current.getPlace();
      setPlace(place);
    });
  }, []);
  return (
    <Stack spacing={2}>
      <Box>
        <FormControl>
          <InputLabel htmlFor="place">Search for a location</InputLabel>
          <Input inputRef={inputRef}></Input>
        </FormControl>
      </Box>

      <Box height={"100%"}>
        <SimpleMap place={place}/>
      </Box>
    </Stack>
  );
};
