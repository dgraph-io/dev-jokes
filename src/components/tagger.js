import React from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Accordion,
  AccordionSummary,
} from "@material-ui/core";

import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: "80vh",
    overflow: "auto",
    paddingTop: "0",
  },
}));
export const Tagger = ({ tags, onChange, selected }) => {
  const classes = useStyles();
  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Filter by Tags</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.root}>
        <FormControl component="fieldset">
          <RadioGroup aria-label="gender" name="gender1" onChange={onChange}>
            {tags.map(({ name, value }) => (
              <FormControlLabel
                value={value}
                control={<Radio />}
                label={name}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </AccordionDetails>
    </Accordion>
  );
};
