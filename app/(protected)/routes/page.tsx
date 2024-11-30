import DeliveryRouteForm from "@/components/delivery-route-form";

const RoutesPage = () => {
  return (
    <>
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl mx-auto">
        Create a new delivery route
      </h1>
      <DeliveryRouteForm />
    </>
  );
};

export default RoutesPage;
