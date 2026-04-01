import { PencilIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import NotFoundPage from "../../pages/404";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "~/lib/ThemeContext";
import { cn } from "~/lib/utils";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { api } from "~/utils/api";
import toast, { Toaster } from "react-hot-toast";
import Skeleton from "./skeleton";

export default function Configuracion() {
  const { data: sessionData, update: updateSessionData, status } = useSession();
  const router = useRouter();
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

      await router.replace(`/${tempUsername}`);
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
    updateUsername({
      user_id: sessionData?.user.id ?? "",
      username: tempUsername,
    });
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
    <>
      <div className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
        <div className="flex w-full flex-col gap-1">
          <h2 className="text-lg font-semibold text-gray-800">Editar perfil</h2>
          <p className="text-sm text-gray-500">
            Actualiza tu nombre de usuario
          </p>
        </div>
        <div className="flex w-full flex-col items-start justify-center gap-2">
          {editUsername ? (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <input
                ref={inputRef}
                type="text"
                value={tempUsername}
                onKeyDown={handleKeyDown}
                onChange={(e) => handleUsernameChange(e.target.value)}
                disabled={isUpdating}
                className={cn(
                  "w-full rounded-md border px-3 py-2 text-xl outline-none transition-colors sm:w-auto",
                  themeColor === "teal"
                    ? "border-teal text-teal"
                    : "border-orange-red text-orange-red",
                  validationError && "border-red-500",
                  isUpdating && "cursor-not-allowed opacity-50"
                )}
                style={{ width: `${Math.max(usernameWidth + 28, 220)}px` }}
                maxLength={20}
              />
              <div className="flex items-center gap-1">
                <button
                  className={cn(
                    "no-highlight transition-all duration-200",
                    isUpdating
                      ? "cursor-not-allowed opacity-50"
                      : "hover:scale-105 active:scale-95"
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
                  className="no-highlight transition-all duration-200 hover:scale-105 active:scale-95"
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
                "relative pr-8 text-2xl font-semibold text-gray-800 transition-colors sm:text-3xl",
                themeColor === "teal" ? "text-teal" : "text-orange-red"
              )}
            >
              {username}
              <PencilIcon
                onClick={handleStartEdit}
                className="hover:text-orange-600 absolute -right-8 bottom-1 h-6 w-6 cursor-pointer text-orange transition-colors"
              />
            </span>
          )}
          {validationError && (
            <span className="mt-1 text-sm text-red-500">{validationError}</span>
          )}
        </div>
        <Toaster />
      </div>
    </>
  );
}
