import React, { Component, useEffect } from "react";
import AppRouting from "../apps/routing/route";
import Loading from "./components/loading";
import Notification from "./components/notifications";
import { BrowserRouter } from "react-router-dom";
// import Popups from 'popups'
import { QueryClientProvider, QueryClient } from "react-query";
const queryClient = new QueryClient();
function App() {
  return (
    <section>
      <Notification />
      <Loading />
      <QueryClientProvider client={queryClient}>
        {/* <BrowserRouter> */}
        <AppRouting />
        {/* </BrowserRouter> */}
      </QueryClientProvider>
    </section>
  );
}

export default App;
