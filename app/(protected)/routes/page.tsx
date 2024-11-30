import { RoutesTable } from "@/components/routes-table";

const RoutesPage = () => {
  return (
    <>
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl mx-auto">
        All delivery routes available
      </h1>
      <RoutesTable />
    </>
  );
};

export default RoutesPage;
