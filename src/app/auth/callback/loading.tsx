import Loader from "@/components/global/loader";

const AuthLoading = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
    <Loader state={ true } color = "rgba(118, 57, 172, 1)" />
    </div>
  );
};

export default AuthLoading; 