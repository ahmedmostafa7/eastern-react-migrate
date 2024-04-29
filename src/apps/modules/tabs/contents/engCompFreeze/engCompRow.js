import React, { Component } from "react";
import style from "./style.less";
import { Button } from "antd";
import axios from "axios";
import { workFlowUrl } from "configFiles/config";
import { withNamespaces } from "react-i18next";
const statusApi = "engineercompany/SetStatus";
import { Popconfirm } from "antd";

class engCompRow extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props.data };
  }

  changeStatus(id) {
    const { status } = this.state;
    axios
      .post(`${workFlowUrl}/${statusApi}/${id}`, { appid: 1, status: !status })
      .then(() => {
        this.setState({ ...this.state, status: !status });
      });
  }
  render() {
    const { t } = this.props;
    const { status, name, id } = this.state;
    return (
      <div>
        <div className={style.eng_comp_names}>
          <label>{name}</label>
          <div className={style.eng_comp_buttons}>
            <Popconfirm
              title={t(
                `messages:Are you sure you want to ${
                  status ? "freeze" : "activate"
                } this account?`
              )}
              onConfirm={this.changeStatus.bind(this, id)}
              okText={t("Yes")}
              cancelText={t("No")}
            >
              <Button className={status ? style.freeze : style.activate}>
                {t(status ? "Freeze" : "Activate")}
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces("actions")(engCompRow);
