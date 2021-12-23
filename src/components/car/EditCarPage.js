import Breadcrumb, { BreadcrumbIndicies } from "../breadcrumb/Breadcrumb";
import { useParams } from "react-router-dom";

export default function EditCarPage() {
  const params = useParams();
  console.log({ params });
  return (
    <>
      <Breadcrumb
        uriSegments={[
          BreadcrumbIndicies.home,
          BreadcrumbIndicies.cars,
          BreadcrumbIndicies.edit,
        ]}
      />
    </>
  );
}
