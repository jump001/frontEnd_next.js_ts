import React from 'react'
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { doGetStockById } from '@/services/serverService';
import { DataMenu } from '@/models/menu.model';


type Props = {
  menu?: DataMenu
}

export default function Menu({menu}: Props) {
  return (
    <div>Menu{JSON.stringify(menu)}</div>
  )
}
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { id }: any = context.query;
  if (id) {
    const menu = await doGetStockById(id);
    return {
      props: {
        menu,
      },
    };
  } else {
    return { props: {} };
  }
};