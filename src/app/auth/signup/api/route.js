import { apiConfig } from "@/config/apiConfig";
import axiosClient from "@/config/axiosClient";
export const postData = async (params) => {
  return await axiosClient.post(apiConfig.signup, params);
};

export async function POST(req) {
  const body = await req.json();
  const data = await postData(body);
  // return Response.json(data?.data); this line set default status code
  // in this code to overide the status code
  return new Response(JSON.stringify(data?.data), {
    status: data?.status,
  });
}
