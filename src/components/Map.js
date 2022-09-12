import React, {useEffect} from "react";
import GoogleMapReact from 'google-map-react';
import {Avatar} from "@mui/material";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function SimpleMap(props){
  let [map, setMap] = React.useState(null);
  const defaultProps = {
    center: {
      lat: -34.603722,
      lng: -58.3819
    },
    zoom: 10
  };

  const place = props?.place;
  console.log(place);

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

        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => {
          setMap(map);
        }}
      >
        <Avatar  alt="Remy Sharp"  src="https://mui.com/static/images/avatar/1.jpg"  lat={-34.603722} lng={-58.3819}
          onClick={() => console.log("You clicked me!")}
        />

      </GoogleMapReact>
    </div>
  );
}
