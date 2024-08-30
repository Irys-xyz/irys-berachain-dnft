"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const CustomQueryClientProvider = (props: Props) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
};

export default CustomQueryClientProvider;
