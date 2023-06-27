import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import AuthButton from "~/components/auth/authButton";
import { MdArrowBackIosNew } from "react-icons/md";
import Link from "next/link";
import Head from "next/head";
import Logo from "~/components/auth/logo";
import { api } from "~/utils/api";
import {useRouter} from "next/router"

export default function ReestablecerContraseña() {
    const router = useRouter()
    const {token} = router.query 
    const { data: userEmail } = api.resetPwd.getEmailByToken.useQuery(
        { token: token as string },
        { enabled: token !== undefined }
    );
    const { mutate: ResetPassword } = api.resetPwd.resetPwd.useMutation();
    const { mutate: deleteToken } = api.resetPwd.deletePwdResetToken.useMutation();
    const { data: checkToken } = api.resetPwd.checkValidToken.useQuery(
        { token: token as string },
        { enabled: token !== undefined }
    );

    return(
        <h1>resetPwd</h1>
    )
}