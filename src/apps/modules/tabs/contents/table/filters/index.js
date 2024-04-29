import React, { Component } from "react";
import { map, uniq, get, set, isEqual } from "lodash";
import Filter from "./filter";
import { Button, Form, Tooltip, Row, Col } from "antd";
import { fetchData } from "app/helpers/apiMethods";
export default class index extends Component {
  constructor(props) {
    super(props);
    this.loadedControls = [];
    this.state = {
      controls: [],
    };

    const { filters } = this.props;
    if (filters) {
      Object.values(filters)?.forEach(this.renderFilter);
    }

    this.changed = false;
  }
  renderFilter = async (filter, index) => {
    const { dataSource, handleChange, values, t, filters } = this.props;
    let data = [];
    if (filter.apiUrl) {
      const { apiUrl } = filter;
      let result = await fetchData(workFlowUrl + apiUrl);

      let object = filter.name.split(".").reduce((o, i) => {
        if (!o[i]) {
          o[i] = {};
        }
        return o[i];
      }, {});
      data = uniq(
        map(
          result.map((r) =>
            set(JSON.parse(JSON.stringify(object)), filter.name, r)
          ),
          (d) => get(d, filter.name)
        ).filter((d) => d)
      );
    } else {
      data = uniq(map(dataSource, (d) => get(d, filter.name)).filter((d) => d));
    }

    filter.data = data;

    this.loadedControls = (this.loadedControls?.length && [
      ...this.loadedControls,
      { ...filter },
    ]) || [{ ...filter }];

    if (this.loadedControls?.length == Object.keys(filters)?.length) {
      this.setState({
        controls: this.loadedControls,
      });
    }
  };

  // shouldComponentUpdate(nextProps) {
  //   if (this.changed) {
  //     this.changed = false;
  //     const { filters } = this.props;
  //     if (filters) {
  //       Object.values(filters)?.forEach(this.renderFilter);
  //     }
  //   }
  //   return true;
  // }

  render() {
    const { handleChange, values, t } = this.props;
    const { controls } = this.state;
    return (
      <Form>
        {controls.map((r) => (
          <Row
            type="flex"
            style={{ alignItems: "right" }}
            justify="right"
            gutter={24}
          >
            <Col span={24} className="fullMobile">
              {r.label && <div>{t(r.label)}</div>}
              <Filter
                filter={r}
                values={values}
                data={r.data}
                handleChange={(fil, val) => {
                  handleChange(fil, val);
                }}
                t={t}
              />
            </Col>
          </Row>
        ))}
      </Form>
    );
  }
}
