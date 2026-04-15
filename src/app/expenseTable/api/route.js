import { apiConfig } from "@/config/apiConfig";
import axiosClient from "@/config/axiosClient";

export const getData = async () => {
  return await axiosClient.get(apiConfig.expenseTable.get);
};

export async function GET() {
  const data = await getData();
  return new Response(JSON.stringify(data?.data), {
    status: data?.status,
  });
}

export const postData = async (params) => {
  return await axiosClient.post(apiConfig.expenseTable.post, params);
};

export async function POST(req) {
  try {
    const body = await req.json();

    const response = await postData(body);

    return new Response(JSON.stringify(response.data), {
      status: response.status,
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || error.message || "Server Error";

    return new Response(JSON.stringify({ message }), { status });
  }
}
