import {BrowserRouter, Outlet, Route, Routes, useParams} from "react-router-dom";
import {Home} from "./Home";
import {Profile} from "./Profile";
import {LinearProgress, Typography} from "@mui/material";
import {ArrowBack, Downloading} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";

export function AppRouter(){
  return(
    <BrowserRouter>
      <div>
      </div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/locations" element={<LocationPage/>}>
          <Route path={":locationId"}  element={<LocationProfile/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function LocationProfile(){
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.REACT_APP_XRAPIDAPIKEY,
      'X-RapidAPI-Host': process.env.REACT_APP_XRAPIDAPIHOST
    }
  };

  let {locationId} = useParams();
  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    fetch(`https://spott.p.rapidapi.com/places/${locationId}`, options)
      .then(response => {
         return response.json()
      })
      .then(data => {
        console.log(data)
        setCityData(data);
        setLoading(false);
        setError(false);
      })
      .catch(error => {
        setError(true);
        setLoading(false);
      })
  }, []);

  console.log(cityData)
  if(loading && cityData!==null){
    return <LinearProgress/>
  } else if (error) {
     return <LinearProgress/>
  } else{
    return (
      <div>
        <Typography variant={"h3"}>{cityData?.name}</Typography>
        <Typography variant={"subtitle1"}>{cityData?.country.name}</Typography>
        <Outlet/>
      </div>
    );
  }

}

function LocationPage() {
  return (
    <div>
      <Typography variant={"overline"}>Location </Typography>
      <Outlet/>
    </div>
  );
}
