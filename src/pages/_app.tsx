import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import React from "react";
import { firebaseConfig } from "../firebase";
import {getToken, onMessage} from "firebase/messaging";
import {toast} from "react-toastify";
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
  
}) => {  
  const activateNotifications = async () => {
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: "BP5uRjnZKgTEbIjvIZRcRbpP93jXilaxX9nfuZREoOZeUuz8hwMeXOa3MLgpxFenYTSoBCpClA4wVpqjNgiuzTg",
    }).catch((err) => console.log(err));
    if(token)console.log("token:", token);
    if(!token)console.log("no token");
  };

  React.useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
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
