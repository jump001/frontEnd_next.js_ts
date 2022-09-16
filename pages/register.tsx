import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import { TextField } from "formik-material-ui";
import { Formik, Form, Field, FormikProps } from "formik";
import Router from "next/router";
import { Box, CardActionArea, Typography } from "@mui/material";
import { store, useAppDispatch } from "@/store/store";
import { signUp, userSelector } from "@/store/slice/userSlice";
import router from "next/router";
import { useSelector } from "react-redux";
import { blue, red } from "@mui/material/colors";


type Props = {};

export default function register({}: Props) {
  const dispatch = useAppDispatch();
  const user = useSelector(userSelector);
     
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

        <Button type="submit" fullWidth variant="contained" color="primary">
          Register
        </Button>
        <Button
          fullWidth
          size="small"
          color="primary"
          onClick={() => Router.push("/login")}
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
          <Typography sx={{bgcolor:'#ef9a9a'}}>{user.error}</Typography>

            <Formik
              initialValues={{ name: "", email: "", password: "" }}
              onSubmit={async (values) => {
                
                  const response = await dispatch(signUp(values))
                  if (response.meta.requestStatus === "fulfilled") {
                    alert("ลงทะเบียนเรียบร้อย");
                    router.push("/login");
                   } else {  
                  alert("ข้อมูลที่รับมาไม่ถูกต้อง")
                   }
             
              }}
            >
              {(props) => showForm(props)}
            </Formik>
          </CardContent>
        </Card>

        <style jsx global>
          {`
            body {
              min-height: 100vh;
              position: relative;
              margin: 0;
              background-size: cover;
              background-image: url("/static/img/bgr.jpg");
              text-align: center;
            }
          `}
        </style>
      </Box>
    </React.Fragment>
  );
}

