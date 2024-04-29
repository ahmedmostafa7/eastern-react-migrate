import React, { Component } from "react";
import AppRouting from "../apps/routing/route";
import Loading from "./components/loading";
import Notification from "./components/notifications";
// import Popups from 'popups'
import { QueryClientProvider, QueryClient } from "react-query";
const queryClient = new QueryClient();
class App extends Component {
  render() {
    return (
      <section>
        <Notification />
        <Loading />
        <QueryClientProvider client={queryClient}>
          <AppRouting />
        </QueryClientProvider>
      </section>
    );
  }
}

export default App;
