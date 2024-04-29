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
    const { title, pTitle, sakData, t, saks } = this.props;
    return (
      <>
        <h4>{t(title)}</h4>
        <Collapse
          className="Collapse"
          activeKey={this.state.keys}
          onChange={this.changeKeys}
          key={get(
            map(saks, (section, key) => key),
            "[0]"
          )}
        >
          {map(saks, (data, key) => (
            <Panel
              key={key}
              header={convertToArabic(t(pTitle) + ` ${key + 1}`)}
              forceRender={true}
            >
              <Owner
                index={(data && data.main_id) || key}
                {...this.props}
                data={{ ...data, valid: sakData.valid }}
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
