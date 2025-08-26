"use client";
import ExpenseForm from "../template";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const Update = () => {
  const params = useParams();
  const expenseId = params.editForm;
  const [expenseData, setExpenseData] = useState(null);

  useEffect(() => {
    const storedData = getCookie(`expense_${expenseId}`);
    if (storedData) {
      const data = JSON.parse(storedData);
      setExpenseData(data);

      console.log("Stringified data:", JSON.stringify(data));
    }
  }, [expenseId]);

  return <ExpenseForm expenseId={expenseId} expenseData={expenseData} />;
};

export default Update;
