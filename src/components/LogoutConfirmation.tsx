import { useAuth } from '@/context/useGlobalContext';

interface LogoutConfirmationProps {
  setConfirmationOpen: (open: boolean) => void;
}

export default function LogoutConfirmation({
  setConfirmationOpen,
}: LogoutConfirmationProps) {
  const { handleLogout } = useAuth();

  return (
    <div className="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black/40 text-text-200 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-lg bg-bg-primary p-6 text-lg shadow-xl">
        <p className="mb-4 text-center font-medium">
          Do you really want to logout?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setConfirmationOpen(false)}
            className="transform rounded-full border border-black bg-white px-6 py-2.5 font-semibold text-black transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-gray-100 focus:outline-none active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="transform rounded-full bg-primary px-6 py-2.5 font-semibold text-white transition-colors hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:outline-none active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
