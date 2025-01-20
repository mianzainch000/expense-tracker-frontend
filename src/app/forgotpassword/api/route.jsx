import { apiConfig } from "@/config/apiConfig";
import axiosClient from "@/config/axiosClient";
export const postData = async (params) => {
  return await axiosClient.post(apiConfig.forgotpassword, params);
};

export async function POST(req) {
  const body = await req.json();
  const data = await postData(body);
  return Response.json(data?.data);
}
