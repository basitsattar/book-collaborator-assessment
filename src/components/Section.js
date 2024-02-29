import React from "react";
import {
  Button,
  TextField,
  TextareaAutosize,
  Box,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  sectionContainer: {
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    minWidth: "200px",
  },
  subsectionContainer: {
    marginLeft: theme.spacing(5),
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    minWidth: "200px",
  },
  removeButton: {
    marginTop: theme.spacing(1),
  },
  addButton: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  textarea: {
    width: "100%",
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.primary.main}`,
    fontSize: "16px",
    fontFamily: "inherit",
    resize: "vertical", // Allow vertical resizing
    "&:hover": {
      borderColor: theme.palette.primary.main,
    },
    "&:focus": {
      outline: "none", // Remove focus outline
      borderColor: theme.palette.primary.main,
    },
  },
}));

export default function Section({
  sectionData,
  onChange,
  onRemove,
  onAddSubsection,
  hierarchy = "",
  isAuthor,
}) {
  const classes = useStyles();

  return (
    <Box>
      <Box
        className={
          sectionData.level > 0
            ? classes.subsectionContainer
            : classes.sectionContainer
        }
      >
        <Typography variant="subtitle1" className="hierarchy">
          {hierarchy}
        </Typography>
        <TextField
          label="Title"
          value={sectionData.title}
          onChange={(e) => onChange(sectionData.id, "title", e.target.value)}
          fullWidth
          required
          variant="outlined"
          margin="normal"
        />
        {/* <TextField
          label="Description"
          value={sectionData.description}
          onChange={(e) =>
            onChange(sectionData.id, "description", e.target.value)
          }
          fullWidth
          variant="outlined"
          margin="normal"
        /> */}
        <TextareaAutosize
          rowsMin={5}
          placeholder="Description"
          value={sectionData.description}
          onChange={(e) =>
            onChange(sectionData.id, "description", e.target.value)
          }
          className={classes.textarea}
        />
        {isAuthor && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              color="primary"
              className={classes.addButton}
              onClick={() => onAddSubsection(sectionData.id)}
            >
              Add Subsection
            </Button>
            <Button
              color="secondary"
              className={classes.removeButton}
              onClick={() => onRemove(sectionData.id)}
            >
              Remove {sectionData.level > 0 ? "Subsection" : "Section"}
            </Button>
          </div>
        )}

        {sectionData.subsections.map((subSection, index) => {
          return (
            <Section
              key={subSection.id}
              sectionData={subSection}
              onChange={onChange}
              onRemove={onRemove}
              onAddSubsection={onAddSubsection}
              hierarchy={`${hierarchy}.${index + 1}`}
              isAuthor={isAuthor}
            />
          );
        })}
      </Box>
    </Box>
  );
}
