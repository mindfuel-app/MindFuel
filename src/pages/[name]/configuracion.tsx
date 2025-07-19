import { PencilIcon } from "@heroicons/react/24/solid";
import ProfileLayout from "~/components/layouts/profileLayout";
import { useSession } from "next-auth/react";
import NotFoundPage from "../404";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "~/lib/ThemeContext";
import { cn } from "~/lib/utils";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { api } from "~/utils/api";
import toast, { Toaster } from "react-hot-toast";
import Header from "./components/header";
import ThemeToggleButton from "../../components/inputs/themeToggleButton";
import Skeleton from "./components/skeleton";

export default function Configuracion() {
  const { data: sessionData, update: updateSessionData, status } = useSession();
  const { themeColor } = useTheme();

  const [username, setUsername] = useState("");
  const [tempUsername, setTempUsername] = useState("");
  const [editUsername, setEditUsername] = useState(false);
  const [usernameWidth, setUsernameWidth] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [validationError, setValidationError] = useState("");
  const elementRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: updateUsername } = api.user.editUsername.useMutation({
    onSuccess: async () => {
      setUsername(tempUsername);
      setIsUpdating(false);
      setEditUsername(false);
      toast.success("Nombre de usuario actualizado");
      
      // Update session data in the background without causing a refresh
      try {
        await updateSessionData({ name: tempUsername });
      } catch (error) {
        console.warn("Failed to update session data:", error);
        // Don't show error to user as the username was successfully updated in the database
      }
    },
    onError: (error) => {
      setTempUsername(username);
      toast.error(
        error.message == "Username already exists"
          ? "El nombre de usuario ya existe"
          : "Error al actualizar el nombre de usuario"
      );
      setIsUpdating(false);
    },
  });

  useEffect(() => {
    if (status === "authenticated" && sessionData?.user.name) {
      setUsername(sessionData.user.name);
      setTempUsername(sessionData.user.name);
    }
  }, [status, sessionData]);

  useEffect(() => {
    if (elementRef.current) {
      setUsernameWidth(elementRef.current.offsetWidth);
    }
  }, [elementRef.current?.offsetWidth]);

  useEffect(() => {
    if (editUsername && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editUsername]);

  const validateUsername = (value: string): string => {
    if (value.length < 3) {
      return "Mínimo 3 caracteres";
    }
    if (value.length > 20) {
      return "Máximo 20 caracteres";
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return "Solo letras, números, guiones y guiones bajos";
    }
    return "";
  };

  const handleUsernameChange = (value: string) => {
    setTempUsername(value);
    const error = validateUsername(value);
    setValidationError(error);
  };

  const handleStartEdit = () => {
    setEditUsername(true);
    setTempUsername(username);
    setValidationError("");
  };

  const handleCancelEdit = () => {
    setEditUsername(false);
    setTempUsername(username);
    setValidationError("");
  };

  const handleSubmit = () => {
    if (isUpdating) return;
    
    const error = validateUsername(tempUsername);
    if (error) {
      setValidationError(error);
      return;
    }

    if (tempUsername === username) {
      setEditUsername(false);
      return;
    }

    // Optimistically update the UI
    setIsUpdating(true);
    updateUsername({ user_id: sessionData!.user.id, username: tempUsername });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  if (status === "loading" || username === "") {
    return <Skeleton />;
  }

  if (status === "unauthenticated" || !sessionData?.user.name) {
    return <NotFoundPage />;
  }

  return (
    <ProfileLayout
      header={<Header themeColor={themeColor} userName={sessionData.user.name} />}
      sessionData={sessionData}
    >
      <div className="flex w-full flex-col items-center gap-4 pt-7">
        <div
          className={cn(
            "flex h-[100px] w-[100px] items-center justify-center rounded-full border-[3px] bg-[#d9d9d9] transition-colors",
            themeColor === "teal" ? "border-teal" : "border-orange-red"
          )}
        >
          <span
            className={cn(
              "text-6xl transition-colors",
              themeColor === "teal" ? "text-teal" : "text-orange-red"
            )}
          >
            {username[0]?.toUpperCase()}
          </span>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-2">
          {editUsername ? (
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={tempUsername}
                onKeyDown={handleKeyDown}
                onChange={(e) => handleUsernameChange(e.target.value)}
                disabled={isUpdating}
                className={cn(
                  "rounded-md border px-2 py-1 text-2xl outline-none transition-colors",
                  themeColor === "teal"
                    ? "border-teal text-teal"
                    : "border-orange-red text-orange-red",
                  validationError && "border-red-500",
                  isUpdating && "opacity-50 cursor-not-allowed"
                )}
                style={{ width: `${usernameWidth + 20}px` }}
                maxLength={20}
              />
              <div className="flex items-center gap-1">
                <button
                  className={cn(
                    "no-highlight transition-all duration-200",
                    isUpdating 
                      ? "opacity-50 cursor-not-allowed" 
                      : "active:scale-95 hover:scale-105"
                  )}
                  onClick={handleSubmit}
                  disabled={isUpdating || !!validationError}
                >
                  {isUpdating ? (
                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-300 border-t-current" />
                  ) : (
                    <CheckIcon
                      className={cn(
                        "h-7 w-7 transition-colors",
                        validationError 
                          ? "text-gray-400" 
                          : themeColor === "teal" 
                            ? "text-teal" 
                            : "text-orange-red"
                      )}
                    />
                  )}
                </button>
                <button
                  className="no-highlight active:scale-95 hover:scale-105 transition-all duration-200"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                >
                  <XMarkIcon className="h-7 w-7 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
            </div>
          ) : (
            <span
              ref={elementRef}
              className={cn(
                "relative cursor-pointer text-2xl transition-colors",
                themeColor === "teal" ? "text-teal" : "text-orange-red"
              )}
            >
              {username}
              <PencilIcon
                onClick={handleStartEdit}
                className="absolute -right-8 bottom-1 h-6 w-6 text-orange hover:text-orange-600 transition-colors cursor-pointer"
              />
            </span>
          )}
          {validationError && (
            <span className="text-sm text-red-500 mt-1">{validationError}</span>
          )}
        </div>
        <Toaster />
      </div>
      <div className="flex flex-col w-full p-7 gap-4">
        <div>
          <span className="mb-2 text-xl font-medium">Tu tema</span>
          <ThemeToggleButton />
        </div>
      </div>
    </ProfileLayout>
  );
}