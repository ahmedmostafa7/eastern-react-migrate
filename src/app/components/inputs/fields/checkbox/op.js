import React from "react";
import mainInput from "app/helpers/main/input";
import { Button } from "antd";

export default class op extends mainInput {
  render() {
    const {
      input: { value, ...input },
      type,
      options,
      className,
      qw,
      del,
      add,
    } = this.props;
    console.log("dd", qw, del, add);
    return (
      <div>
        <Button type="primary" onClick={add}>
          إضافة الأرض
        </Button>
        {qw && qw.length > 0 && (
          <table className="table table-bordered" style={{ width: "40vw" }}>
            <thead>
              <tr>
                <th>الرقم</th>
                <th> البلديه</th>
                <th>البلديه الفرعيه </th>
                <th>الحى </th>
                <th>الطبقات </th>
              </tr>
            </thead>
            <tbody>
              {qw &&
                qw.map((e, i) => {
                  return (
                    <tr key={i}>
                      <th>{i + 1}</th>
                      <td>{e.munic}</td>
                      <td>{e.sub}</td>
                      <td>{e.distrect}</td>
                      <td>{e.Layers}</td>
                      <td>
                        <Button type="danger" onClick={del}>
                          مسح
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}
