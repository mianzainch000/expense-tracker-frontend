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

export const updateExpense = async (id, data) => {
  return await axiosClient.put(`${apiConfig.expenseTable.update}/${id}`, data);
};

export async function PUT(req, { params }) {
  const body = await req.json();
  const response = await updateExpense(params.id, body);

  return new Response(JSON.stringify(response.data), {
    status: response.status,
  });
}
