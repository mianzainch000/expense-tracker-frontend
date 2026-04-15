import { apiConfig } from "@/config/apiConfig";
import axiosClient from "@/config/axiosClient";

export const deleteUser = async (id) => {
  return await axiosClient.delete(apiConfig.expenseTable.delete + `/${id}`);
};

export async function DELETE(req) {
  try {
    const body = await req.json();

    if (!body?.id || body.id === "undefined") {
      return new Response(
        JSON.stringify({ message: "ID is invalid or missing" }),
        { status: 400 }
      );
    }

    const data = await deleteUser(body.id);

    return new Response(JSON.stringify(data?.data), {
      status: data?.status || 200,
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || error.message || "Server Error";

    return new Response(JSON.stringify({ message }), { status });
  }
}

export const updateExpense = async (id, data) => {
  return await axiosClient.put(`${apiConfig.expenseTable.update}/${id}`, data);
};

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!id || id === "undefined") {
      return new Response(
        JSON.stringify({ message: "ID is invalid or missing" }),
        { status: 400 },
      );
    }

    const response = await updateExpense(id, body);

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || error.message || "Server Error";

    return new Response(JSON.stringify({ message }), { status });
  }
}
