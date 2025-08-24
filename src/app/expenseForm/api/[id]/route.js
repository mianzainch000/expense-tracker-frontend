import { apiConfig } from "@/config/apiConfig";
import axiosClient from "@/config/axiosClient";

export const editUser = async (data) => {
  const editData = {
    _id: data?._id,
    date: data?.date,
    description: data?.description,
    amount: data?.amount,
    paymentType: data?.paymentType,
    type: data?.type,
  };

  return await axiosClient.put(
    `${apiConfig.expenseForm.update}/${data._id}`,
    editData,
  );
};

// Route handler

// Route handler
export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    body._id = params.id;

    const response = await editUser(body);

    return Response.json(
      { data: response.data },
      { status: response.status }, // 👈 backend ka status forward kar do
    );
  } catch (err) {
    console.error("API error:", err.message);

    if (err.response) {
      // Agar backend ne error bheja (e.g. 400, 404)
      return Response.json(
        { message: err.response.data?.data?.message || "Server error" },
        { status: err.response.status }, // 👈 same status preserve karo
      );
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
