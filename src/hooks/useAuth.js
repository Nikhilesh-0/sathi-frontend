import { useApp } from "../context/AppContext";
import { signInWithGoogle, signOutUser } from "../lib/firebase";

export const useAuth = () => {
  const { user, loading } = useApp();
  return { user, loading, signIn: signInWithGoogle, signOut: signOutUser };
};
