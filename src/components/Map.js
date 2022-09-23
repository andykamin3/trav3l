import React, {useEffect} from "react";
import GoogleMapReact from 'google-map-react';
import {
  Avatar, AvatarGroup,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip, Typography
} from "@mui/material";
import {AddLocation, Favorite, HelpOutline, LibraryAdd, Pin, Place, Repeat} from "@mui/icons-material";
import {grey, pink} from "@mui/material/colors";
import {Link} from "react-router-dom";
import {ContentForm} from "./ContentForm";
import {explore} from "./utils/lens/fetch-posts";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import {login} from "./utils/lens/login";
import {logInWithWallet, web3Modal} from "./Web3Modal";
import {getProfiles} from "./utils/lens/get-user";
import {addReactionRequest} from "./utils/lens/reactions";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function SimpleMap(props){
  const [createNewPin, setCreateNewPin] = React.useState(false);
  const [currentPosition, setCurrentPosition] = React.useState(null);
  const [pins, setPins] = React.useState([]);

  let [map, setMap] = React.useState(null);
  const defaultProps = {
    center: {
      lat: -34.603722,
      lng: -58.3819
    },
    zoom: 10
  };

  const place = props?.place;

  useEffect(() => {
    if (place!==null && place!==undefined && map !== null) {
      if (place.geometry===undefined) {
        return;
      }
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      console.log(lat, lng);
      map.panTo({lat, lng});
    }
  }, [place]);

  //Use effect with async call
  useEffect(() => {
    async function fetchData() {
      const posts = await explore();
      //TODO: pagination
      const displayableItems = posts.explorePublications.items.filter((item) => item.metadata.attributes[0].value!=null && item.metadata.attributes[1].value!=null);
      setPins(displayableItems);
      console.log(displayableItems);
    }
    fetchData().then(r => console.log("Done")).catch(
      e => console.log(e)
    )
  },[]);



  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '60vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        onClick={(e) => {
            if(createNewPin){
              setCurrentPosition({lat: e.lat, lng: e.lng});
              setCreateNewPin(false);
            }
            else {
              setCreateNewPin(true);
              setCurrentPosition({lat: e.lat, lng: e.lng})
            }
          }
        }
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => {
          setMap(map);
        }}
      >
        {createNewPin && currentPosition!==null && <AlertDialog position={currentPosition} lat={currentPosition.lat} lng={currentPosition.lng} />}
        {pins.map((pin,o) => {
           return (<ModalPin key={o} id={pin.id} onClick={()=>setCreateNewPin(false)} profile={pin.profile} metadata={pin.metadata} lng={pin.metadata.attributes[0].value} lat={pin.metadata.attributes[1].value}></ModalPin>);
    })}


      </GoogleMapReact>

    </div>
  );
}

function ModalPin(props){
  const [open, setOpen] = React.useState(false);
  const [reaction, setReaction] = React.useState(null);
  const handleClickOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }

  const handleUpvote = async (reaction) => {
    const {signer} = await logInWithWallet(web3Modal);
    await login(signer, await signer.getAddress());
    const profiles = await getProfiles(await signer.getAddress());
    console.log(profiles.profiles.items[0]);
    const profileId = profiles.profiles.items[0].id;
    try {
      const req = await addReactionRequest(profileId, "UPVOTE", props.id);
      console.log(req);
    } catch (e) {
      console.log(e);
    }

    if (reaction!==null) {
      setReaction("UPVOTE");
    } else {
      setReaction(null);
    }

  }

  return (
    <div>
      <Tooltip title="Click to learn more">
        <Place sx={{ color: pink[500] }} lng={props.metadata.attributes[0].value} lat={props.metadata.attributes[1].value} onClick={handleClickOpen}>
        </Place>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogContent>
          <Stack spacing={1}>
          <Typography variant={'h3'}>
            {props.metadata.name}
          </Typography>
          <Box component={"img"} sx={{maxWidth:"560px"}} src={props.metadata.media[0].original.url}></Box>
          <Typography variant={'body1'}>
            {props.metadata.description}
          </Typography>
          <Divider/>
            <Stack direction={"row"} spacing={1}>
            {props.profile.picture && <Avatar src={props.profile.picture}/>}
            {props.profile.picture === null && <Avatar>{props.profile.handle[0]}</Avatar>}
          <Typography variant={'h6'}> @{props.profile.handle}</Typography>

              <IconButton onClick={handleUpvote}>
                <Favorite sx={{color: (reaction!==null ? pink[500] : '0xffffff')}}/>
              </IconButton>
              <IconButton>
                <LibraryAdd/>
              </IconButton>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>

        </DialogActions>
      </Dialog>
    </div>
  );
}

function AlertDialog(props) {

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Avatar sx={{ bgcolor: pink[500] }} onClick={handleClickOpen}>

        <AddLocation/>
      </Avatar>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Create new pin"} <Tooltip title={"Write a review. Tell the community how was your experience.\nWas it a restaurant? What did you order? How was the service?\nWas it a park? How crowded was it? Did you jog, walk or rested?"}>
          <HelpOutline/>
        </Tooltip>
        </DialogTitle>
        <ContentForm position={props.position} handleClose={handleClose}/>
      </Dialog>
    </div>
  );
}
