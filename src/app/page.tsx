import { SignedIn, SignedOut, SignOutButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
   <div>
    {/* HOME PAGE */}
    <SignedOut>
      <SignUpButton>
      <button
          className="p-2 px-2 text-s font-bold rounded-xl border-2 border-gray-400 hover:border-gray-600 hover:text-gray-600 transition duration-300 ease-in-out text-white "
        >
         Sign UP btn
        </button>
      </SignUpButton>
    </SignedOut>

    <SignedIn>
    <UserButton />
      <SignOutButton>
        <button
          className="p-2 px-2 text-s font-bold rounded-xl border-2 border-gray-400 hover:border-gray-600 hover:text-gray-600 transition duration-300 ease-in-out text-white "
        >
         Sign Out btn
        </button>
      </SignOutButton>
    </SignedIn>
   </div>
  );
}
