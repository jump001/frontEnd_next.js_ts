import React from 'react'
import { getShops} from "@/store/slice/productSlice";
import { useAppDispatch } from '@/store/store';

type Props = {}

export default function index({}: Props) {

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(getShops());
  }, [dispatch]);

  return (
    <div>index</div>
  )
}