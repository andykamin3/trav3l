import {Button, Card, CardContent, CardMedia, Chip, LinearProgress, Typography} from "@mui/material";
import React, {useEffect} from "react";
import {getEvents} from "./utils/tableland-utils";
import {ButtonLink} from "./ButtonLink";
import {Add} from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import {pink} from "@mui/material/colors";
import Box from "@mui/material/Box";

const ID_INDEX = 0;
const TITLE_INDEX = 1;
const DESCRIPTION_INDEX = 2;
const LATITUDE_INDEX = 4;
const LONGITUDE_INDEX = 3;
const IMAGE_INDEX = 5;
const START_DATE_INDEX = 6;
const END_DATE_INDEX = 7;
const PROFILE_ID_INDEX = 8;
const ADDRESS_INDEX = 9;
const PLACE_NAME_INDEX = 10;
const URL_INDEX = 11;


export const Events =(props)=>{
    const [events, setEvents] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    //Use effect load on mounted
    useEffect(() => {
      const loadEvents = async () => {
        setIsLoading(true);
        const ev = await getEvents();
        console.log(ev.rows);
        setEvents(ev.rows);
        setIsLoading(false);
      }
      loadEvents().catch(console.error);
    },[]);
    return (<div>
      <Typography variant={"h5"}>Events      <ButtonLink to={"/new"}>Create an event <Add/></ButtonLink>
      </Typography>
      {isLoading && <LinearProgress/>}
      {events.length>0 && events.map((e) => <EventCard event={e}/>)}
    </div>)
}


function EventCard(props){
  const {event} = props;
  return(<Card>
    <CardMedia
      component="img"
      height="140"
      image={event[IMAGE_INDEX]}
      alt="event image"
    />
    <CardContent>
      <Typography variant={"overline"}>{event[PLACE_NAME_INDEX]}</Typography>
      <Typography variant={"h6"}>{event[TITLE_INDEX]}</Typography>
      <Typography variant={"body1"}>{event[DESCRIPTION_INDEX]}</Typography>
      <Stack direction={"column"} spacing={1}>
        <Box>
        <Chip variant={'outlined'} color={'primary'} label={event[ADDRESS_INDEX]}></Chip>
        <Chip variant={'outlined'} color={'primary'} label={`${event[START_DATE_INDEX]} - ${event[END_DATE_INDEX]}`}></Chip>
        </Box>
        <Button variant={'contained'} href={event[URL_INDEX]}>View more</Button>
      </Stack>

    </CardContent>
  </Card>)
}
// TODO: Click on event card to go to map focus
