import { Charts } from "@/components/charts";
import { InternalMenu } from "@/components/internal-menu";
import { LinkButton } from "@/components/vital-link";
import { title } from "@/config.shared";
import { type MetaFunction, redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { parse } from "cookie";
import { useEffect, useState } from "react";

export interface Provider {
  logo: string;
  name: string;
  slug: string;
  status: string;
  availability?: {};
}

export interface UserInfo {
  userId: string;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  vitalUserId?: string;
  providers?: Provider[];
}

export interface LoaderData {
  userId: string;
  userInfo: UserInfo;
}

export const meta: MetaFunction = () => {
  return [
    { title: title() },
    {
      name: "description",
      content: "Login to BitFit!",
    },
  ];
};

export default function Dash() {
  const { userInfo } = useLoaderData<LoaderData>();

  return (
    <main>
      <InternalMenu>
        {userInfo?.providers && userInfo.providers.length > 0 ? (
          <Charts />
        ) : (
          <LinkButton userID={userInfo.vitalUserId as string} />
        )}
      </InternalMenu>
    </main>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");

  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const jwt = cookies.jwt;

  if (!jwt) {
    return redirect("/login");
  }

  const response = await fetch("http://localhost:8080/verify-token", {
    headers: {
      Cookie: `jwt=${jwt}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    return redirect("/login");
  }

  const { userId } = await response.json();

  const userResponse = await fetch(`http://localhost:8080/users/${userId}`, {
    headers: {
      Cookie: `jwt=${jwt}`,
    },
    credentials: "include",
  });

  if (!userResponse.ok) {
    return redirect("/login");
  }

  const userInfo: UserInfo = await userResponse.json();

  return { userId, userInfo };
};
