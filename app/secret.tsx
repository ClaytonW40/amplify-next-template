import { Authenticator } from "@aws-amplify/ui-react";

export default function SecretPage() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Welcome, {user?.username}</h1>
          <p>This is a protected page only visible when logged in.</p>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}
