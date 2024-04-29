import React, { Component } from "react";
import { apply_field_permission } from "app/helpers/functions";
import memoize from "memoize-one";
import { FormSection } from "redux-form";
import { Collapse } from "antd";
import { withTranslation } from "react-i18next";
import { map, get, last, isEqual, keys } from "lodash";
import { Icon } from "antd";
const Panel = Collapse.Panel;
import Collpasing from "./collapse";
import mapDispatchToProps from "main_helpers/actions/main";
import { connect } from "react-redux";
class CollapseInput extends Component {
  state = {
    keys: [],
  };
  filteringFields = memoize((values) => {
    return this.fields.filter((field) =>
      apply_field_permission(values, this.props.field, this.props)
    );
  });
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const newKeys = keys(nextProps.input.value);
    const oldKeys = keys(this.props.input.value);
    if (!isEqual(oldKeys, newKeys)) {
      this.state.keys = last(newKeys);
    }
    return !isEqual(
      { props: this.props, state: this.state },
      { props: nextProps, state: nextState }
    );
  }
  changeKeys = (keys) => {
    this.setState({ keys });
  };
  submit = (values) => {
    const { ok, onCancel } = this.props;
    ok(values, this.props).then((data) => {
      onCancel();
    });
  };
  genExtra = (data) => {
    const { extra = {}, values } = this.props;
    return (
      <>
        {map(extra, (d) => (
          <Icon
            type={d.icon}
            onClick={(event) => {
              event.stopPropagation();
              d.action(this.props, data, values);
            }}
          />
        ))}
      </>
    );
  };
  render() {
    const { input, show = "name", t, title } = this.props;
    const name = last(input.name.split("."));
    let number = 1;
    // console.log(this.props)

    return (
      <Collapse
        className="Collapse"
        activeKey={this.state.keys}
        onChange={this.changeKeys}
        key={get(
          map(input.value, (section, key) => key),
          "[0]"
        )}
      >
        {map(input.value, (data, key) => (
          <Panel
            key={key}
            header={t(get(data, show, t(title) + ` ${number++}`))}
            forceRender={true}
            extra={this.genExtra(data)}
          >
            <FormSection
              name={`${name}.${data.main_id || key}`}
              className="qrrr"
            >
              <Collpasing
                index={data.main_id || key}
                {...this.props}
                data={data}
              />
            </FormSection>
            {/* </Card> */}
          </Panel>
        ))}
      </Collapse>
    );
  }
}
export default connect(
  null,
  mapDispatchToProps
)(withTranslation("labels")(CollapseInput));
