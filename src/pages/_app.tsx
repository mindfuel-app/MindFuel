import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import React from "react";
import {messaging} from "../firebase";
import {getToken, onMessage} from "firebase/messaging";
import {toast} from "react-toastify";


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
  
}) => {  
  const activateNotifications = async () => {
    const token = await getToken(messaging, {
      vapidKey: "BP5uRjnZKgTEbIjvIZRcRbpP93jXilaxX9nfuZREoOZeUuz8hwMeXOa3MLgpxFenYTSoBCpClA4wVpqjNgiuzTg",
    }).catch((err) => console.log(err));
    if(token)console.log("token:", token);
    if(!token)console.log("no token");
    toast.success("Notificaciones activadas");
  };

  React.useEffect(() => {
    onMessage(messaging, message=>{
      console.log(message);
      if(message.notification){
        toast(message.notification.title);
      }
    })
  }, []);

  return (
    activateNotifications(),
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>    
  );
};

export default api.withTRPC(MyApp);
