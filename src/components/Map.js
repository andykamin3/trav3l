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
import {AddLocation, HelpOutline, Pin, Place} from "@mui/icons-material";
import {pink} from "@mui/material/colors";
import {Link} from "react-router-dom";
import {ContentForm} from "./ContentForm";
import {explore} from "./utils/lens/fetch-posts";
import Box from "@mui/material/Box";

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
        {pins.map((pin) => {
           return (<ModalPin onClick={()=>setCreateNewPin(false)} metadata={pin.metadata} lng={pin.metadata.attributes[0].value} lat={pin.metadata.attributes[1].value}></ModalPin>);
    })}


      </GoogleMapReact>

    </div>
  );
}

function ModalPin(props){
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }

  return (
    <div>
      <Tooltip title="Click to learn more">
        <Avatar lng={props.metadata.attributes[0].value} lat={props.metadata.attributes[1].value} onClick={handleClickOpen}>
          <Place/>
        </Avatar>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Place Information</DialogTitle>
        <DialogContent>
          <Typography variant={'h3'}>
            {props.metadata.name}
          </Typography>
          <Box component={"img"} sx={{maxWidth:"560px"}} src={props.metadata.media[0].original.url}></Box>
          <Typography variant={'body1'}>
            {props.metadata.description}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
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
