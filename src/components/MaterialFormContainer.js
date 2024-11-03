import MaterialForm from "./MaterialForm";

function MaterialFormContainer({ connected }) {
  return (
    <div className="flex lg:m-10 items-center justify-center ">
      <div className="w-full md:w-2/3 xl:w-1/2 h-1/2 p-4 ">
        <MaterialForm connected={connected} />
      </div>
    </div>
  );
}

export default MaterialFormContainer;