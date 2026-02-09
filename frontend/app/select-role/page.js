"use client";
import { useRouter } from "next/navigation";

export default function SelectRolePage() {
  const router = useRouter();

  const chooseRole = (role) => {
    localStorage.setItem("role", role);

    if (role === "sponsor") {
      router.replace("/sponsor/dashboard");
    } else {
      router.replace("/organizer/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="card max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-6">Choose your role</h1>

        <button
          onClick={() => chooseRole("sponsor")}
          className="w-full mb-4 py-2 rounded bg-white text-black"
        >
          Continue as Sponsor
        </button>

        <button
          onClick={() => chooseRole("organizer")}
          className="w-full py-2 rounded bg-white text-black"
        >
          Continue as Organizer
        </button>
      </div>
    </div>
  );
}
