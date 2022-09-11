import Box from "@mui/material/Box";
import {Paper, Typography} from "@mui/material";
import React from "react";
import Stack from "@mui/material/Stack";
import SimpleMap from "./Map";
export function Home() {
  return (
    <div>
      <Paper elevation={3}>
        <Box sx={{p: 2}}>
          <Typography variant={'h5'}>trav3l</Typography>
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
  const options={
    "types": ["(cities)"],
  }
  const [place, setPlace] = React.useState(null);

  React.useEffect(() => {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );
    autoCompleteRef.current.addListener("place_changed", async function () {
      const place = await autoCompleteRef.current.getPlace();
      setPlace(place);
    });
  }, []);
  return (
    <Stack spacing={2}>
      <Box>
        <input style={{
          "width":"100%",
        }} label="Search"
          ref={inputRef}
        />
      </Box>

      <Box height={"100%"}>
        <SimpleMap place={place}/>
      </Box>
    </Stack>
  );
};
