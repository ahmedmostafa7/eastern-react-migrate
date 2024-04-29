import React, { Component } from "react";
import { Select, Divider, Icon, Button } from "antd";
import { withTranslation } from "react-i18next";
import { get, isEqual, includes } from "lodash";

const Option = Select.Option;

class selectComponent extends Component {
  state = {
    values: [],
    currentVal: "",
  };

  shouldComponentUpdate(prevProps) {
    return true;
    // return (
    //   !isEqual(prevProps.actionVals, this.props.actionVals)
    //  // !isEqual(prevProps.forceUpdate, this.props.forceUpdate)
    // );
  }

  confirmMulti = (menu) => {
    const {
      actionVals: { name },
      onClick,
    } = this.props;
    const multi = includes(name, "ASSIGNMULTI") ? true : false;
    return multi ? (
      <div>
        {menu}
        <Divider style={{ margin: "4px 0" }} />
        <Button
          onFocus={onClick.bind(this, this.state.values)}
          style={{ width: "100%" }}
        >
          <Icon type="check" /> Confirm
        </Button>
      </div>
    ) : (
      <div>{menu}</div>
    );
  };

  onChange = (value) => {
    const {
      actionVals: { name },
      t,
      onClick,
    } = this.props;
    const multi = includes(name, "ASSIGNMULTI") ? true : false;
    return !multi ? onClick(value) : this.setState({ values: value });
  };

  render() {
    const {
      actionVals: { steps, users, label, name },
      t,
      onClick,
    } = this.props;
    let data = steps || users || [];
    const mode = includes(name, "ASSIGNMULTI") ? "multiple" : "default";

    return (
      <div className="hey">
        <Select
          getPopupContainer={(trigger) => trigger.parentNode}
          allowClear
          showArrow={false}
          className={`buttonSelect`}
          showSearch={false}
          mode={mode}
          value={undefined}
          // style={{width: '200px', margin:'10px'}}
          onChange={this.onChange.bind(this)}
          placeholder={t(label)}
          dropdownRender={this.confirmMulti.bind(this)}
        >
          {data.map((d) => (
            <Option value={get(d, "id")} data={d} key={get(d, "id")}>
              {t(get(d, "name"))}
            </Option>
          ))}
        </Select>
      </div>
    );
  }
}

export const select = withTranslation("labels")(selectComponent);
