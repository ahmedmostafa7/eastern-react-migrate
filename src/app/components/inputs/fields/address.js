import React from "react";
import mainInput from "app/helpers/main/input";

export default class address extends mainInput {
  changeValue(num, e) {
    let {
      input: { value, onChange, onBlur },
    } = this.props;
    let values = (value || "").split("-");
    values[num] = e.target.value;
    const newVal = values.map((d) => d || "").join("-");
    onChange(newVal);
    if (values.length == 3) {
      onBlur(newVal);
    }
  }
  render() {
    let {
      input: { value },
    } = this.props;
    const values = (value || "").split("-");
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 20px 1fr 20px 1fr",
        }}
      >
        <div>
          <input
            name="input1"
            placeholder="0000"
            value={values[0]}
            className="form-control"
            onChange={this.changeValue.bind(this, 0)}
          />
        </div>

        <div className="dash">-</div>

        <div>
          <input
            name="input2"
            placeholder="00000"
            value={values[1]}
            className="form-control"
            onChange={this.changeValue.bind(this, 1)}
          />
        </div>
        <div className="dash">-</div>

        <div>
          <input
            value={values[2]}
            name="input3"
            placeholder="0000"
            className="form-control"
            // onBlur={onBlur}
            onChange={this.changeValue.bind(this, 2)}
          />
        </div>
      </div>
    );
  }
}
