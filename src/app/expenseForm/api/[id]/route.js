import { apiConfig } from "@/config/apiConfig";
import axiosClient from "@/config/axiosClient";

export const updateExpense = async (id, data) => {
  return await axiosClient.put(`${apiConfig.expenseForm.update}/${id}`, data);
};

export async function PUT(req, { params }) {
  const body = await req.json();
  const response = await updateExpense(params.id, body);

  return new Response(JSON.stringify(response.data), {
    status: response.status,
  });
}
