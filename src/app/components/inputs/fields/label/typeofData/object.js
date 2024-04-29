import React, { Component } from "react";
import { get, isEmpty } from "lodash";
import { fileUploader } from "app/helpers/fieldValues";

export class object extends Component {
  render() {
    const { data, t } = this.props;
    let files =
      data && data.length
        ? data.filter((singleData) =>
            get(singleData, "uid", null) ? singleData : null
          )
        : null;

    return (
      <div>
        {!isEmpty(files) ? (
          <div>{fileUploader(data)}</div>
        ) : (
          <div style={{ display: "flex" }}>
            {data.map((val, index) => (
              <div style={{ padding: "5px" }} key={index}>
                {index == 0 ? ` ${t(val)} ` : ` - ${t(val)} `}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
