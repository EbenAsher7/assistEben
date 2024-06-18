import InputDebounce from "@/components/UserAttendance/InputDebounce";

const Homepage = () => {
  return (
    <div className="w-full p-10 flex justify-center items-center flex-col mt-56">
      <h1 className="font-bold text-4xl sm:text-5xl">Registrar asistencia</h1>
      <h2 className="font-normal text-2xl sm:text-3xl mt-4">Ministerios Ebenezer</h2>
      <InputDebounce />
    </div>
  );
};

export default Homepage;
