import React, { ReactElement, useEffect, useState } from "react";

import { makeStyles } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TextField } from "formik-material-ui";
import { Formik, Form, Field, FormikProps } from "formik";
import Router, { useRouter } from "next/router";
import { Box } from "@mui/material";
import { useAppDispatch } from "@/store/store";
import router from "next/router";
import { erorMessage, signIn } from "@/store/slice/userSlice";
import { useSelector } from "react-redux";

import { GlobalStyles } from '@mui/material';


//import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import withAuth from "@/components/withAuth";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});




type Props = {};

const Login = ({}: Props) => {
  const dispatch = useAppDispatch();
  const errMessage = useSelector(erorMessage);
  const router = useRouter();

 
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  


  const showForm = ({
    values,
    setFieldValue,
    isValid,
    dirty,
    handleSubmit,
  }: FormikProps<any>) => {
    return (
      <Form onSubmit={handleSubmit}>
        <Field
          component={TextField}
          name="email"
          id="email"
          margin="normal"
          required
          fullWidth
          label="email"
          autoComplete="email"
          autoFocus
        />
        <Field
          component={TextField}
          name="password"
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />

        <Button type="submit" fullWidth variant="contained" color="primary" onClick={handleClick}>
          Login
        </Button>
        <Button
          fullWidth
          size="small"
          color="primary"
          onClick={() =>  router.push("/register")}
          
        >
          Register
        </Button>
      </Form>
    );
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            sx={{ height: 200 }}
            image="/static/img/bg.jpg"
            title="Contemplative Reptile"
          />
          <CardContent>
          <Stack spacing={2} sx={{ width: '100%' }}>
         <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
         {errMessage.error}
        </Alert>
         </Snackbar>
       </Stack>
            <Formik
              initialValues={{ email: "", password: "" }}
              onSubmit={async (values) => {
                const response = await dispatch(signIn(values)); //ต้องimportมาจากuserSlices     
                if (response.meta.requestStatus === "fulfilled") {
                 // alert("Login sucsess");
                  router.push("/");
                } 
                //alert(JSON.stringify(values));
              }}
            >
              {(props) => showForm(props)}
            </Formik>
          </CardContent>
        </Card>
        </Box>
       

    </React.Fragment>
  );
}
export default withAuth(Login);