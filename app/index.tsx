import { useAuthContext } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";

export default function Index() {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
