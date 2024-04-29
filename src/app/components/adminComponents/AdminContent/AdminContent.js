import React, { useEffect, useState } from "react";
import { Table, Pagination, ConfigProvider } from "antd";
import axios from "axios";

export default function AdminContent(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const handleChangePage = (page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
    if (
      (props.tableData.next !== "" && props.tableData.next !== undefined) ||
      (props.tableData.prevURL !== "" && props.tableData.prevURL !== undefined)
    ) {
      axios
        .get(
          window.host +
            `/api/${
              props.tableData.next.slice(
                14,
                props.tableData.next.indexOf("?")
              ) ||
              props.tableData.prevURL.slice(
                14,
                props.tableData.prevURL.indexOf("?")
              )
            }?page=${page - 1}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.token}`,
            },
          }
        )
        .then((res) =>
          props.getTableData(props.columns, res.data, res.data.count)
        );
    }
  };

  return (
    <div>
      {props.sideLinks.map((admin) =>
        props.selectedLink == admin.id ? (
          <div className="adminContent">
            <h3 style={{ padding: "15px", textAlign: "center" }}>
              {admin.name}
              <span className="adminBadge">{props.dataCount}</span>
            </h3>
            {admin.component}
            <Table
              columns={props.columns}
              dataSource={props.tableData.results}
              pagination={false}
            />
            {props.tableData.next == "" &&
            props.tableData.prevURL == "" ? null : (
              <ConfigProvider direction="ltr">
                <Pagination
                  className="mt-4"
                  current={currentPage}
                  defaultCurrent={currentPage}
                  pageSize={30}
                  total={props.tableData.count}
                  onChange={handleChangePage}
                  style={{ bottom: "0px" }}
                />
              </ConfigProvider>
            )}
          </div>
        ) : null
      )}
    </div>
  );
}
