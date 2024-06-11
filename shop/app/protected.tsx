// pages/protected.tsx
import { GetServerSideProps } from "next";
import jwt from "jsonwebtoken";

export default function Protected() {
  return <h1>Protected Page</h1>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = context.req.cookies;

  if (!token) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  try {
    jwt.verify(token, "my_secret_key");
    return { props: {} };
  } catch (error) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
};
