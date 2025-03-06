import DeliveryRouteForm from "@/components/delivery-route-form";

const CreateRoutesPage = () => {
  return (
    <div className="space-y-2">
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl mx-auto">
        Crear una nueva ruta
      </h1>
      <p className="text-sm text-muted-foreground mx-auto">
        Aquí puedes crear una nueva ruta.
      </p>
      <div className="pt-4">
        <DeliveryRouteForm />
      </div>
    </div>
  );
};

export default CreateRoutesPage;
