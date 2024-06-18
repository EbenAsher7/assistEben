import InputDebounce from "@/components/UserAttendance/InputDebounce";

const Homepage = () => {
  return (
    <div className="w-full p-10 flex justify-center items-center flex-col mt-40">
      <h1 className="font-bold text-4xl sm:text-5xl text-blue-700 dark:text-blue-500">Registrar asistencia</h1>
      <h2 className="font-normal text-2xl sm:text-3xl mt-4 text-blue-700 dark:text-blue-500">Ministerios Ebenezer</h2>
      <div className="sm:w-[700px] w-full">
        <InputDebounce />
      </div>
    </div>
  );
};

export default Homepage;
