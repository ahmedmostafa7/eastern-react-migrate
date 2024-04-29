import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { get, map } from "lodash";
import Owner from "./data";
import { Collapse } from "antd";
import { convertToArabic } from "../../../../../../../../inputs/fields/identify/Component/common/common_func";
const Panel = Collapse.Panel;

class collapse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keys: ["0"],
    };
  }
  changeKeys = (keys) => {
    this.setState({ keys });
  };
  render() {
    const { title, pTitle, t, owners, owner_type } = this.props;
    return (
      <>
        {title && <h4>{t(title)}</h4>}
        <Collapse
          className="Collapse"
          activeKey={this.state.keys}
          onChange={this.changeKeys}
          key={get(
            map(owners, (section, key) => key),
            "[0]"
          )}
        >
          {map(owners, (data, key) => (
            <Panel
              key={key}
              header={convertToArabic(
                t(pTitle) + ` ${owners.length > 1 ? key + 1 : ""}`
              )}
              forceRender={true}
            >
              <Owner
                index={(data && data.main_id) || key}
                {...this.props}
                data={data}
                owner_type={
                  (data.ssn && 1) ||
                  (data.code_regesteration && 2) ||
                  (data.commercial_registeration && 3) ||
                  4
                }
              />
              {/* </Card> */}
            </Panel>
          ))}
        </Collapse>
      </>
    );
  }
}

export default withTranslation("labels")(collapse);
