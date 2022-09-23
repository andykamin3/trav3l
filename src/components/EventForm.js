import React from "react";
import {
    Tooltip,
    Paper,
    Stack,
    TextField,
    Button,
    IconButton,
    FormGroup,
    FormControl,
    InputLabel,
    Input,
    FormHelperText,
    DialogActions, DialogContent, LinearProgress, Box
} from '@mui/material';
//import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { HelpOutline, AddPhotoAlternate, DriveFileMoveRounded } from "@mui/icons-material";
import { width } from "@mui/system";
import {storeMetadata, uploadImage} from "./utils/upload-metadata";
import { logInWithWallet, web3Modal } from "./Web3Modal";
import { createPost } from "./utils/post";
import { login } from "./utils/lens/login";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {getProfiles} from "./utils/lens/get-user";
import {addEventToTable, defineTable} from "./utils/tableland-utils";

export function EventForm(props) {

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

    const [title, setTitle] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [description, setDescription] = React.useState("");
    const [file, setFile] = React.useState(null);
    const [link, setLink] = React.useState("");
    const [startDate, setStartDate] = React.useState(null);
    const [endDate, setEndDate] = React.useState(null);
    const submitForm = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const {provider, library, accounts, network, signer} = await logInWithWallet(web3Modal);
        const logging_in = await login(signer, await signer.getAddress());
        const profile = (await getProfiles(await signer.getAddress())).profiles.items[0];
        console.log(profile);

        try {
            const imageCid = await uploadImage(file, signer);
            const ipfs_url = `https://ipfs.io/ipfs/${imageCid}`;
            const message = {
                name: title,
                description,
                url: link,
                image: ipfs_url,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                ownedBy: profile.ownedBy,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                address: place.formatted_address,
                placeName: place.name,
            };

            const writeOp = await addEventToTable(message)
            console.log(message)//
            console.log(message, writeOp);
            setIsLoading(false);

        } catch (e) {
            setIsLoading(false);
            console.log(e);
        }



    }




    return (

        <div>

            <Button variant={"outlined"} onClick={defineTable} ></Button>
            <form id={'form-data'} onSubmit={submitForm}>
                <DialogContent>
                    <FormGroup>
                        <Stack spacing={3} sx={{ p: 2 }}>
                            <FormControl>
                                <InputLabel htmlFor="title">Event title</InputLabel>
                                <Input value={title} onChange={event => setTitle(event.target.value)} id="title" aria-describedby="title-helper-text" />
                                <FormHelperText id="title-helper-text">Complete name of the event</FormHelperText>
                            </FormControl>
                            <FormControl>
                                <TextField
                                    id="desc-helper-text"
                                    label="Description"
                                    multiline
                                    rows={4}
                                    placeholder="We are celebrating BTC Pizza Day in Buenos Aires like we've never done before..."
                                    value={description}
                                    onChange={event => setDescription(event.target.value)}
                                />
                                <FormHelperText id="desc-helper-text">What's the event about? Who can attend?</FormHelperText>
                            </FormControl>
                            <FormControl>
                                <InputLabel htmlFor="link">URL to website</InputLabel>
                                <Input value={link} onChange={event => setLink(event.target.value)} id="link" aria-describedby="link-helper-text" />
                                <FormHelperText id="link-helper-text">A website with further information of the event</FormHelperText>
                            </FormControl>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <Stack spacing={2}>
                                <DatePicker
                                  label="Start date"

                                  onChange={d=>setStartDate(d)}
                                  value={startDate}
                                  renderInput={(params) => <TextField {...params} />}
                                >

                                </DatePicker>
                                <DatePicker
                                  label="End date"
                                  onChange={d=>setEndDate(d)}
                                  value={endDate}
                                  renderInput={(params) => <TextField {...params} />}
                                >

                                </DatePicker>
                                </Stack>

                            </LocalizationProvider>
                            <Box>

                                <FormGroup>
                                    <FormControl>
                                        <InputLabel htmlFor="place">Place</InputLabel>
                                        <Input inputRef={inputRef}  id="place" aria-describedby="place-helper-text" />
                                    </FormControl>
                                </FormGroup>
                            </Box>
                            {/* <FormControl>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <StaticDateRangePicker
                                        displayStaticWrapperAs="desktop"
                                        value={value}
                                        onChange={(newValue) => {
                                            setValue(newValue);
                                        }}
                                        renderInput={(startProps, endProps) => (
                                            <React.Fragment>
                                                <TextField {...startProps} />
                                                <Box sx={{ mx: 2 }}> to </Box>
                                                <TextField {...endProps} />
                                            </React.Fragment>
                                        )}
                                    />
                                </LocalizationProvider>
                            </FormControl> */}
                            <div>
                                <FormControl>
                                    <Button sx={{ "width": "100%" }} variant="outlined" component="label">
                                        Upload media
                                        <AddPhotoAlternate />
                                        <input onChange={(event) => { setFile(event.target.files[0]) }} hidden accept="image/*,video/*" type="file" />
                                    </Button>
                                    <FormHelperText id="media-helper-text">Upload an image or a video with information.</FormHelperText>
                                </FormControl>
                            </div>
                        </Stack>
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose}>Close</Button>
                    <Button type={"submit"}>
                        Create
                    </Button>
                </DialogActions>
            </form>
            {isLoading && <LinearProgress />}
        </div >
    );
}
