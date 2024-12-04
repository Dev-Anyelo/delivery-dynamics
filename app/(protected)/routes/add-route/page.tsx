import DeliveryRouteForm from "@/components/delivery-route-form";

const CreateRoutesPage = () => {
  return (
    <>
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl mx-auto">
        Crear una nueva ruta
      </h1>
      <DeliveryRouteForm />
    </>
  );
};

export default CreateRoutesPage;
