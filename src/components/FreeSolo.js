import * as React from "react";
import {useQuery} from "@tanstack/react-query";
import {Button, Typography, useMediaQuery, useTheme} from "@mui/material";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import {LocationCard} from "./LocationCard";

export default function FreeSolo() {
  const [cities, setCities] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [textFieldValue, setTextFieldValue] = React.useState("");
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.REACT_APP_XRAPIDAPIKEY,
      'X-RapidAPI-Host': process.env.REACT_APP_XRAPIDAPIHOST
    }
  };

  const gridContainerBig = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)"
  };
  const gridContainerSmall = {
    display: "block"
  };


  const emulateFetch = (_) => {
    console.log("Fetching from the internet ...");

    // Emulates an async request with fetch/axios (useQuery expects a Promise)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({response: "ok"});
        console.log("... done");
      }, 500);
    });
  };

  const handleClick = () => {
    let url = 'https://spott.p.rapidapi.com/places/autocomplete?limit=10&skip=0&type=CITY&q=' + textFieldValue
    console.log(url)
    console.log()
    fetch(url, options)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setCities(data)
      })
      .catch(err => {
        console.error(err);
      });
    // (!) manually refetch on click event
  };

  const {isLoading, isRefetching, data, refetch} = useQuery(
    "myKey",
    emulateFetch,
    {
      refetchOnWindowFocus: false,
      enabled: false // (!) handle refetchs manually
    }
  );
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Stack spacing={2}>
      <TextField variant={"outlined"} label="Search for a city" value={textFieldValue} onChange={(e) => {
        setTextFieldValue(e.target.value)
      }}/>
      <Button variant="contained" onClick={handleClick}>
        Search
      </Button>
      <Box sx={matches ? gridContainerBig : gridContainerSmall}>
        {cities.length === 0 ? <Typography variant={'body1'}>No results</Typography> : cities.map((city) =>
          <LocationCard key={city.id} city={city}/>)}
      </Box>
    </Stack>
  );
}
