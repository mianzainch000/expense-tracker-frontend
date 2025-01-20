import { apiConfig } from "@/config/apiConfig";
import axiosClient from "@/config/axiosClient";

export const getData = async () => {
  return await axiosClient.get(apiConfig.dashboard);
};

export async function GET() {
  const data = await getData();

  return Response.json(data?.data);
}

export const postData = async (params) => {
  return await axiosClient.post(apiConfig.dashboard, params);
};

export async function POST(req) {
  const body = await req.json();
  const data = await postData(body);

  return Response.json(data?.data);
}
