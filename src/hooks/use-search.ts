import { searchUserInWorkspace } from "@/actions/user";
import { SubscriptionPlan } from "@/types/index.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useSearch = (key: string, type: "WORKSPACE") => {
  const [query, setQuery] = useState("");
  const [debounce, setDebounce] = useState("");
  // TODO: fix this type errprs
  // const [onUsers, setOnUsers] = useState<  | {
  //   id: string
  //   subscriptions: {
  //     plan: 'PRO' | 'FREE'
  //   } | null
  //   firstname: string | null
  //   lastname: string | null
  //   email: string | null
  //   image: string | null
  // }[] | undefined>(undefined);

  const [onUsers, setOnUsers] = useState<any>();

  const onSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  }

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebounce(query);
    }, 1000);
    return () => clearTimeout(delayInputTimeoutId);
  }, [query]);

  const { refetch, isFetching } = useQuery({
    queryKey: [key, debounce],
    queryFn: async ({ queryKey }) => {
      const [key, debounce] = queryKey;
      if (key === "WORKSPACE") {
        const workspace = await searchUserInWorkspace(queryKey[1] as string);
        console.log("🚀 ~ workspace :", workspace)
        if (workspace.data && workspace.data.workspaces && workspace.status === 200) {
          setOnUsers(workspace.data);
        }
        return [];
      }
    },
    enabled: false,
  });

  useEffect(() => {
    if (debounce) {
      refetch();
    }
    if (!debounce) {

      setOnUsers(undefined);
    }


  }, [debounce, refetch]);

  return {
    onSearchQuery,
    query,
    isFetching,
    onUsers,
  }
};