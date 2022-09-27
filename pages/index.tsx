import Layout from "@/components/Layouts/Layout";
import { userSelector } from "@/store/slice/userSlice";
import React from "react";
import { useSelector } from "react-redux";
import withAuth from '@/components/withAuth'

type Props = {};

const Index =({}: Props) =>{
  const user = useSelector(userSelector);

  return (
    <Layout>
      
    </Layout>
  );
}

export default withAuth(Index);