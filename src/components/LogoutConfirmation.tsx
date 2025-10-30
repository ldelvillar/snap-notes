import { useAuth } from "@/context/useGlobalContext";

interface LogoutConfirmationProps {
  setConfirmationOpen: (open: boolean) => void;
}

export default function LogoutConfirmation({
  setConfirmationOpen,
}: LogoutConfirmationProps) {
  const { handleLogout } = useAuth();

  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex items-center justify-center text-gray-900 bg-black/20 backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <p className="text-center text-lg font-medium mb-4">
          Do you really want to logout?
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setConfirmationOpen(false)}
            className="bg-white hover:bg-gray-100 transition-colors 
                                rounded-full px-6 py-2.5 text-lg text-black border border-black 
                                font-semibold focus:outline-none focus:ring-2 
                                focus:ring-gray-100 active:scale-95 transform"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="bg-primary hover:bg-primary/90 transition-colors 
                                rounded-full px-6 py-2.5 text-lg text-white 
                                font-semibold focus:outline-none focus:ring-2 
                                focus:ring-primary/50 active:scale-95 transform"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
