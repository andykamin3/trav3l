import {Link} from "react-router-dom";
import {Button} from "@mui/material";
import * as React from "react";

export function ButtonLink(props) {
  const {text, to} = props;
  const CustomLink = (props) => <Link to={to} {...props} />;
  return (
    <Button component={CustomLink}>{props.children}</Button>
  );
}
