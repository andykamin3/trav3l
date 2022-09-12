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
    DialogActions, DialogContent
} from '@mui/material';
import { HelpOutline, AddPhotoAlternate, DriveFileMoveRounded } from "@mui/icons-material";
import { width } from "@mui/system";

export function ContentForm(props) {
    const position = props.position;
    console.log(position);
    return (
        <div>
            <DialogContent>
                <FormGroup>
                    <Stack spacing={3} sx={{ p: 2 }}>

                        <FormControl>
                            <InputLabel htmlFor="title">Title</InputLabel>
                            <Input id="title" aria-describedby="title-helper-text" />
                            <FormHelperText id="title-helper-text">Try writing something short and creative!</FormHelperText>
                        </FormControl>
                        <FormControl>
                            <TextField
                                id="desc-helper-text"
                                label="Description"
                                multiline
                                rows={4}
                                placeholder="⭐⭐⭐⭐⭐ great fries!"
                            />
                            <FormHelperText id="desc-helper-text">Make a review based on your experience and what you'd want others to know about this place.</FormHelperText>
                        </FormControl>
                        <div>
                            <FormControl>
                                <Button sx={{"width":"100%"}} variant="outlined" component="label">
                                    Upload media
                                    <AddPhotoAlternate />
                                    <input hidden accept="image/*" multiple type="file" />
                                </Button>
                                <FormHelperText id="media-helper-text">Upload an image or a video to share.</FormHelperText>
                            </FormControl>
                        </div>
                    </Stack>
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>Cancel</Button>
                <Button onClick={props.handleClose}>
                    Upload
                </Button>
            </DialogActions>
        </div>
    );
}
