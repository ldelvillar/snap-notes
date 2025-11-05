import { useAuth } from "@/context/useGlobalContext";

interface LogoutConfirmationProps {
  setConfirmationOpen: (open: boolean) => void;
}

export default function LogoutConfirmation({
  setConfirmationOpen,
}: LogoutConfirmationProps) {
  const { handleLogout } = useAuth();

  return (
    <div className="w-screen h-screen fixed top-0 left-0 z-50 flex items-center justify-center text-text-200 bg-black/40 backdrop-blur-sm">
      <div className="p-6 mx-4 max-w-sm w-full text-lg bg-bg-primary rounded-lg shadow-xl">
        <p className="mb-4 text-center font-medium">
          Do you really want to logout?
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setConfirmationOpen(false)}
            className="px-6 py-2.5 text-black font-semibold bg-white transition-colors rounded-full border border-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-100 active:scale-95 transform"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 text-white font-semibold bg-primary transition-colors rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95 transform"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
