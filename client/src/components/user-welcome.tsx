import { BellIcon } from "lucide-react";

interface UserWelcomeProps {
  name: string;
}

export default function UserWelcome({ name }: UserWelcomeProps) {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center">
        <h1 className="font-poppins font-semibold text-2xl text-gray-800">
          Hi, {name || 'Learner'}!
        </h1>
        <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
          <BellIcon className="text-gray-600" size={18} />
        </button>
      </div>
      <p className="text-gray-600 text-sm">Ready to continue your financial journey?</p>
    </div>
  );
}
