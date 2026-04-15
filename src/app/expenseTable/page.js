import ExpenseTable from "./template";

const Table = () => {
  return <ExpenseTable />;
};

export default Table;

export function generateMetadata() {
  return { title: "Expense Table" };
}
