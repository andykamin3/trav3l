import React, {useEffect} from "react";
import GoogleMapReact from 'google-map-react';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip
} from "@mui/material";
import {AddLocation, HelpOutline, Pin} from "@mui/icons-material";
import {pink} from "@mui/material/colors";
import {Link} from "react-router-dom";
import {ContentForm} from "./ContentForm";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function SimpleMap(props){
  const [createNewPin, setCreateNewPin] = React.useState(false);
  const [currentPosition, setCurrentPosition] = React.useState(null);



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
        <Avatar  alt="Remy Sharp"  src="https://mui.com/static/images/avatar/1.jpg"  lat={-34.603722} lng={-58.3819}
          onClick={() => console.log("You clicked me!")}
        />

      </GoogleMapReact>
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
