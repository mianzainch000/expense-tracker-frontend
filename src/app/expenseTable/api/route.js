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
