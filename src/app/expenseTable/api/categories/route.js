import { apiConfig } from "@/config/apiConfig";
import axiosClient from "@/config/axiosClient";

export async function GET() {
  try {
    const response = await axiosClient.get(apiConfig.category.get);
    return new Response(JSON.stringify(response.data), { status: response.status });
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message || "Server Error";
    return new Response(JSON.stringify({ message }), { status });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const response = await axiosClient.post(apiConfig.category.post, body);
    return new Response(JSON.stringify(response.data), { status: response.status });
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message || "Server Error";
    return new Response(JSON.stringify({ message }), { status });
  }
}
