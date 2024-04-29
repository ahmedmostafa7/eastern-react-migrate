// import React from "react";
import axios from "axios";
import qs from "qs";
export default function queryStringSearch(e, props, columns, req, filter) {
  if (e.target.value.length >= 2) {
    const str = qs.stringify({
      code: "utf-8",
      q: e.target.value,
      filter_key: filter,
      contain: "true",
      operand: "=",
      order: "desc",
      page: 0,
      pageSize: 30,
    });
    axios
      .get(window.host + `/api/${req}?${str}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        props.getTableData(columns, res.data, res.data.count);
        //  setCommitiesModal(true);
      });
  }
}
