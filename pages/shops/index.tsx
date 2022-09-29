import React from 'react'
import { getShops, shopSelector} from "@/store/slice/shopSlice";
import { useAppDispatch } from '@/store/store';
import { useSelector } from 'react-redux';
import Layout from '@/components/Layouts/Layout';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import { shopImageURL } from '@/utils/commonUtil';
import Zoom from "react-medium-image-zoom";
import Image from "next/image";
import "react-medium-image-zoom/dist/styles.css";
import { Shops } from '@/models/shop.model';
import { Stack, IconButton } from '@mui/material';
import router from 'next/router';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestaurantIcon from '@mui/icons-material/Restaurant';



type Props = {}

export default function Shop({}: Props) {

  const dispatch = useAppDispatch();
  const shopList = useSelector(shopSelector)
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] =
    React.useState<Shops | null>(null)

  React.useEffect(() => {
    dispatch(getShops());
  }, [dispatch]);


  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },  //fild ของ Id
    {
      field: "name",     //fild ของ name
      headerName: "Name",
      width: 350,
    },
    {
      field: "photo",   
      headerName: "Photo",
      width: 150,
      renderCell: ({ value }: GridRenderCellParams<string>) => (
        <Zoom>
         <Image
            height={1000}
            width={1000}
            objectFit="cover"
            alt="shop image"
            src={shopImageURL(value)}
            style={{ width: 70, height: 70, borderRadius: "5%" }}
          />
        </Zoom>
      )
    },
    {
      headerName: "MENU",
      field: ".",  //.คือแทนข้อมูลโปรดัค1ตัว ทั้งชุดเลย 
      width: 120,
      renderCell: ({ row }: GridRenderCellParams<string>) => (  //รอรับข้อมูลทั้ง row พอได้ข้อมูลมา จะ row. อะไรก็ได้
        <Stack direction="row">
          <IconButton
            aria-label="menu"
            size="large"
            onClick={() => router.push("/shops/menu?id=" + row.id)} //ถ้าต้องการแก้ไขให้วิ่งไปที่row.id
          >
            <RestaurantIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            aria-label="edit"
            size="large"
            onClick={() => router.push("/shops/edit?id=" + row.id)} 
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
          {/* <IconButton
            aria-label="delete"
            size="large"
            onClick={() => {
              setSelectedProduct(row);  //ทำการบันทึกสินค้าที่จะเลื่อก
              setOpenDialog(true);  //state เปิด Dialog อยู่ไหม ก่อนทำการลบ
            }}
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton> */}
        </Stack>
      ),
    
    },
    
  ];
  

  return (
    <Layout>
     <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={shopList??[]}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          //checkboxSelection
          disableSelectionOnClick
        />
      </div>
  </Layout>
  )
}