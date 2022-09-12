import React from "react";
import { Tooltip, Paper, Stack, TextField, Button, IconButton, FormGroup, FormControl, InputLabel, Input, FormHelperText } from '@mui/material';
import { HelpOutline, AddPhotoAlternate, DriveFileMoveRounded } from "@mui/icons-material";
import { width } from "@mui/system";

export function ContentForm() {
    return (
        <div>
            <Paper elevation={1}>
                <FormGroup>
                <Tooltip title={"Write a review. Tell the community how was your experience.\nWas it a restaurant? What did you order? How was the service?\nWas it a park? How crowded was it? Did you jog, walk or rested?"}>
                    <Button sx={{ m: 1, width:10 }}><HelpOutline/></Button>
                    </Tooltip>
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
                                <Button variant="outlined" component="label">
                                    <AddPhotoAlternate />
                                    <input hidden accept="image/*" multiple type="file" />
                                </Button>
                            </FormControl>
                            <FormControl>
                                <Button variant="contained" component="label">
                                    Upload
                                    <input hidden accept="image/*" multiple type="file" />
                                </Button>
                            </FormControl>
                        </div>
                    </Stack>
                </FormGroup>
            </Paper>
        </div>
    );
}