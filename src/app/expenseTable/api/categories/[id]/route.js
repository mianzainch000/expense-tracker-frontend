import { apiConfig } from "@/config/apiConfig";
import axiosClient from "@/config/axiosClient";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const response = await axiosClient.put(
      `${apiConfig.category.update}/${id}`,
      body,
    );
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || error.message || "Server Error";
    return new Response(JSON.stringify({ message }), { status });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const response = await axiosClient.delete(
      `${apiConfig.category.delete}/${id}`,
    );
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || error.message || "Server Error";
    return new Response(JSON.stringify({ message }), { status });
  }
}
