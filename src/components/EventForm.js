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
import { storeMetadata } from "./utils/upload-metadata";
import { logInWithWallet, web3Modal } from "./Web3Modal";
import { createPost } from "./utils/post";
import { login } from "./utils/lens/login";

export function EventForm(props) {
    const [title, setTitle] = React.useState("");
    const [link, setLink] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [description, setDescription] = React.useState("");
    const [file, setFile] = React.useState(null);
    const position = props.position;
    console.log(position);
    const submitForm = async (e) => {
        e.preventDefault();
        try {

            setIsLoading(true);
            ;

            const { provider, library, accounts, network, signer } = await logInWithWallet(web3Modal);
            const logging_in = await login(signer, await signer.getAddress());
            if (position.lat === undefined || position.lng === undefined) {
                throw Error("Undefine position");
            }
            const metadata = await storeMetadata({
                title: title,
                link: link,
                description: description,
                longitude: position.lng,
                latitude: position.lat
            }, file, signer);
            console.log(metadata);
            await createPost(signer, metadata);
            setIsLoading(false);
        } catch (e) {
            console.log(e);
            setIsLoading(false);
        }

    }

    console.log({
        title,
        description,
    }, {
        item: file,
    })

    return (
        <div>
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
                    {isLoading && <LinearProgress />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose}>Close</Button>
                    <Button type={"submit"}>
                        Create
                    </Button>
                </DialogActions>
            </form>
        </div >
    );
}
