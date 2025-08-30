import { apiConfig } from "@/config/apiConfig";
import axiosClient from "@/config/axiosClient";

export const deleteUser = async (id) => {
  return await axiosClient.delete(apiConfig.expenseTable.delete + `/${id}`);
};

export async function DELETE(req) {
  const body = await req.json();
  const data = await deleteUser(body.id);
  return new Response(JSON.stringify(data?.data), {
    status: data?.status,
  });
}
