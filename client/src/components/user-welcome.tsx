interface UserWelcomeProps {
  name: string;
}

export default function UserWelcome({ name }: UserWelcomeProps) {
  return (
    <div className="welcome-section mb-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-1">
        Hey, {name}! 👋
      </h1>
      <p className="text-gray-400">
        Continue learning finance today
      </p>
    </div>
  );
}