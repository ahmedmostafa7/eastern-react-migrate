import React, { Component } from "react";

import style from "./style.less";
import axios from "axios";
import { workFlowUrl } from "imports/config";
import EngCompRow from "./engCompRow";
export class EngComp extends Component {
  state = {
    results: [],
  };
  componentDidMount() {
    const { apiUrl } = this.props;
    axios.get(`${workFlowUrl}/${apiUrl}?`).then(({ data }) => {
      this.setState({ results: data.results });
    });
  }

  render() {
    const { results } = this.state;
    return (
      <div className={style.eng_comp_layout}>
        {[] && results.map((d, i) => <EngCompRow data={d} key={i} />)}
      </div>
    );
  }
}
