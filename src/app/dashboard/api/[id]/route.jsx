import { apiConfig } from "@/config/apiConfig";
import axiosClient from "@/config/axiosClient";

export const deleteUser = async (id) => {
  return await axiosClient.delete(apiConfig.dashboard + `/${id}`);
};

export async function DELETE(req) {
  const body = await req.json();
  const data = await deleteUser(body.id);
  return Response.json(data?.data);
}

export const editUser = async (data) => {
  const editData = {
    date: data?.date,
    description: data?.description,
    amount: data?.amount,
    paymentType: data?.paymentType,
    type: data?.type,
  };
  return await axiosClient.put(apiConfig.dashboard + `/${data?._id}`, editData);
};

export async function PUT(req) {
  const body = await req.json();
  const data = await editUser(body);
  return Response.json(data?.data);
}
