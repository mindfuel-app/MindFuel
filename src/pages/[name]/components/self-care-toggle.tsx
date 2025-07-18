import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

const optionLabels: Record<string, string> = {
  greetings: "Agradecimientos",
  diarie: "Diario",
  calories: "Calorías",
  breathing: "Respiración",
};

export default function SelfCareToggleList() {
  const { data: sessionData } = useSession();
  const userId = sessionData?.user?.id;

  const { data: userData, refetch } = api.user.get.useQuery(
    { user_id: userId ?? "" },
    { enabled: !!userId }
  );

  const { mutate: updateOptions, isLoading } = api.user.updateSelfCareOptions.useMutation();

  const [options, setOptions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (userData?.selfCareOptions && typeof userData.selfCareOptions === "object" && !Array.isArray(userData.selfCareOptions)) {
      const filteredOptions: Record<string, boolean> = {};
      Object.entries(userData.selfCareOptions).forEach(([k, v]) => {
        if (typeof v === "boolean") filteredOptions[k] = v;
      });
      setOptions(filteredOptions);
    }
  }, [userData?.selfCareOptions]);

  const handleToggle = (key: string) => {
    if (isLoading || !userId) return;

    const currentValue = options[key] ?? false; // Default to false if undefined
    const newValue = !currentValue;

    // Optimistic update
    setOptions((prev) => ({ ...prev, [key]: newValue }));

    updateOptions(
      {
        userId,
        updates: {
          [key]: newValue,
        },
      },
      {
        onError: (error) => {
          console.error('Failed to update self-care options:', error);
          // Revert to previous state
          setOptions((prev) => ({ ...prev, [key]: currentValue }));
        },
        onSuccess: (data) => {
          console.log('Successfully updated self-care options:', data);
          refetch();
        },
      }
    );
  };


  return (
    <div className="space-y-4">
      {Object.entries(optionLabels).map(([key, label]) => (
        <label key={key} className="flex items-center justify-between gap-4">
          <span className="text-lg">{label}</span>
          <button
            onClick={() => handleToggle(key)}
            disabled={isLoading}
            className={`relative h-6 w-12 rounded-full transition-colors duration-300 shadow-inner ${options[key] ? "bg-teal" : "bg-gray-300"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${options[key] ? "translate-x-6" : ""
                }`}
            />
          </button>
        </label>
      ))}
    </div>
  );
}
