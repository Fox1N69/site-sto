import { signIn } from "next-auth/react";

export default function SignIn() {
  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div>
      <h1>Sign In Page</h1>
      <button onClick={handleSignIn}>Sign In with Google</button>
    </div>
  );
}
