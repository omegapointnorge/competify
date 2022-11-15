import React from "react";
import { Route } from "react-router";
import Layout from "./components/Layout";
// import Home from './components/Home';
// import Counter from './components/Counter';
// import FetchData from './components/FetchData';
// import Leagues from './components/Leagues';
import Home from "./components/Leagues";
import League from "./components/League";
import CompetitorStats from "./components/CompetitorStats";

export default () => (
  <Layout>
    <Route exact path="/" component={League} />
    <Route path="/l/:leagueId" component={League} />
    <Route path="/competitor/:id" component={CompetitorStats} />
    {/* <Route path='/counter' component={Counter} />
    <Route path='/fetchdata/:startDateIndex?' component={FetchData} />
    <Route path='/leagues/:leagueId/leaderboard' component={Leaderboard} />
    <Route exact path='/leagues' component={Leagues} /> */}
  </Layout>
);
