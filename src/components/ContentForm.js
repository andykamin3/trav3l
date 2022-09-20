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
    DialogActions, DialogContent, LinearProgress
} from '@mui/material';
import { HelpOutline, AddPhotoAlternate, DriveFileMoveRounded } from "@mui/icons-material";
import { width } from "@mui/system";
import {storeMetadata} from "./utils/upload-metadata";
import {logInWithWallet, web3Modal} from "./Web3Modal";
import {createPost} from "./utils/post";
import {login} from "./utils/lens/login";

export function ContentForm(props) {
    const [title, setTitle] = React.useState("");
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

            const {provider, library, accounts, network, signer} = await logInWithWallet(web3Modal);
            const logging_in = await login(signer, await signer.getAddress());
            if (position.lat === undefined || position.lng === undefined) {
                throw Error("Undefine position");
            }
            const metadata = await storeMetadata({
                title: title,
                description: description,
                longitude: position.lng,
                latitude: position.lat
            }, file, signer);
            console.log( metadata);
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
                            <InputLabel htmlFor="title">Title</InputLabel>
                            <Input value={title} onChange={event => setTitle(event.target.value)} id="title" aria-describedby="title-helper-text" />
                            <FormHelperText id="title-helper-text">Try writing something short and creative!</FormHelperText>
                        </FormControl>
                        <FormControl>
                            <TextField
                                id="desc-helper-text"
                                label="Description"
                                multiline
                                rows={4}
                                placeholder="⭐⭐⭐⭐⭐ great fries!"
                                value={description}
                                onChange={event => setDescription(event.target.value)}
                            />
                            <FormHelperText id="desc-helper-text">Make a review based on your experience and what you'd want others to know about this place.</FormHelperText>
                        </FormControl>
                        <div>
                            <FormControl>
                                <Button sx={{"width":"100%"}} variant="outlined" component="label">
                                    Upload media
                                    <AddPhotoAlternate />
                                    <input onChange={(event)=>{setFile(event.target.files[0])}} hidden accept="image/*,video/*" type="file" />
                                </Button>
                                <FormHelperText id="media-helper-text">Upload an image or a video to share.</FormHelperText>
                            </FormControl>
                        </div>
                    </Stack>
                </FormGroup>
                {isLoading && <LinearProgress/>}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>Close</Button>
                <Button type={"submit"}>
                    Upload
                </Button>
            </DialogActions>
            </form>
        </div>
    );
}
