import { useRouter } from "next/router";
import ProfileLayout from "~/components/layouts/profileLayout";
import { motion } from "framer-motion";
import NotFoundPage from "~/pages/404";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useTheme } from "~/lib/ThemeContext";
import { isString } from "~/lib/checkTypes";
import Header from "../../components/name/header";
import UserInfo from "../../components/name/userInfo";
import Configuracion from "../../components/name/configuracion";

export default function Profile() {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const { name } = router.query;
  const { themeColor } = useTheme();

  const { data: pointsData } = api.points.getPoints.useQuery(
    {
      user_id: sessionData?.user.id ?? "",
    },
    {
      enabled: !!sessionData?.user.id,
    }
  );

  const { data: completedTasks } = api.user.getCompletedTasks.useQuery(
    {
      user_id: sessionData?.user.id ?? "",
    },
    {
      enabled: !!sessionData?.user.id,
    }
  );

  const { data: joinedDate } = api.user.getJoinedDate.useQuery(
    {
      user_id: sessionData?.user.id ?? "",
    },
    {
      enabled: !!sessionData?.user.id,
    }
  );

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    void router.push("/signin");
    return null;
  }

  if (!sessionData) {
    return null;
  }

  if (
    !isString(sessionData?.user.name) ||
    !isString(name) ||
    sessionData?.user.name !== name
  ) {
    return <NotFoundPage />;
  }

  return (
    <ProfileLayout
      header={
        <Header
          username={sessionData.user.name}
          points={pointsData?.puntos ?? 0}
          currentLevelBasePoints={pointsData?.currentLevelPoints ?? 0}
        />
      }
      sessionData={sessionData}
    >
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="padding-footer-sm flex h-full w-full max-w-6xl flex-col gap-6 px-3 pb-28 pt-4 sm:px-6 lg:px-8"
      >
        <div className="glass-surface flex w-full flex-col gap-8 rounded-3xl p-4 pt-20 shadow-sm sm:p-6 sm:pt-24 md:pt-28">
          <UserInfo
            sessionData={sessionData}
            joinedDate={
              joinedDate
                ? {
                    month: joinedDate.month ?? "",
                    year: joinedDate.year ?? 0,
                  }
                : undefined
            }
            pointsData={
              pointsData && typeof pointsData === "object"
                ? {
                    puntos: pointsData.puntos,
                    nextLevelPoints: pointsData.nextLevelPoints ?? 0,
                    levelNumber: pointsData.levelNumber,
                  }
                : undefined
            }
            completedTasks={completedTasks ?? 0}
            themeColor={themeColor}
          />
          <Configuracion />
        </div>
      </motion.div>
    </ProfileLayout>
  );
}
