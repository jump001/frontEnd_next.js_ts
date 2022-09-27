import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import { TextField } from "formik-material-ui";
import { Formik, Form, Field, FormikProps } from "formik";
import Router, { useRouter } from "next/router";
import { Box, CardActionArea, Typography } from "@mui/material";
import { store, useAppDispatch } from "@/store/store";
import { signUp, userSelector } from "@/store/slice/userSlice";
import router from "next/router";
import { useSelector } from "react-redux";
import { blue, red } from "@mui/material/colors";


import Stack from "@mui/material/Stack";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type Props = {};

export default function Register({}: Props) {
  const dispatch = useAppDispatch();
  const user = useSelector(userSelector);
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
      <Form onSubmit={handleSubmit}  >
        <Field
          component={TextField}
          name="name"
          id="name"
          margin="normal"
          required
          fullWidth
          label="ชื่อ-สกุล"
          autoComplete="email"
          autoFocus
        />
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
          label="รหัสผ่านอย่างน้อย 3 ตัวอักษร"
          type="password"
          id="password"
          autoComplete="current-password"
        />

        <Button type="submit" fullWidth variant="contained" color="primary" onClick={handleClick}>
          Register
        </Button>
        <Button
          fullWidth
          size="small"
          color="primary"
          onClick={() => router.push("/login")}
        >
          Cancel
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
        <Card sx={{ maxWidth: 345 ,bgcolor:'#e3f2fd'}}>
          
          <CardMedia
            sx={{ height: 200 }}
            image="/static/img/bgr.jpg"
            title="Contemplative Reptile"
          />
          <CardContent>
          <Stack spacing={2} sx={{ width: '100%' }}>
         <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
         {user.error}
        </Alert>
         </Snackbar>
       </Stack>

            <Formik
              initialValues={{ name: "", email: "", password: "" }}
              onSubmit={async (values) => {            
                  const response = await dispatch(signUp(values))
                  if (response.meta.requestStatus === "fulfilled") {
                   // alert("ลงทะเบียนเรียบร้อย");
                    router.push("/login");
                   }
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

