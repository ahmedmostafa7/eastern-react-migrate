import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import {
  max,
  map,
  isObject,
  mergeWith,
  isNumber,
  mapValues,
  get,
} from "lodash";
import Building from "./data";
import { Collapse } from "antd";
import { convertToArabic } from "../../../../../../../../inputs/fields/identify/Component/common/common_func";
import ShowField from "app/helpers/components/show";

const Panel = Collapse.Panel;
const img_fields = {
  side_image: {
    label: "Side Image",
    field: "simpleUploader",
    multiple: false,
  },
  top_image: {
    label: "Top Image",
    field: "simpleUploader",
    multiple: false,
  },
};
class collapse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keys: ["0", "total"],
    };
  }
  changeKeys = (keys) => {
    this.setState({ keys });
  };
  mappingFields = (obj, build, staticKey) => {
    return mapValues(obj, (d, k) => {
      if (isObject(d)) {
        return {
          ...this.mappingFields(d, build, staticKey),
          r_build: build.repeat,
        };
      }
      if (!this.keys.includes(k)) {
        if (staticKey.includes(k)) {
          return Number(d);
        }
        return Number(d) * Number(build.repeat);
      }
      return d;
    });
  };
  renderInfo = (field, key) => {
    const { buildingData } = this.props;
    return (
      <ShowField
        field={field}
        val={convertToArabic(get(buildingData, key))}
        key={key}
      />
    );
  };
  keys = [
    "floors",
    "height",
    "flats",
    "far",
    "type",
    "repeat",
    "name",
    "flat_name",
    "flat_repeat",
    "flat_use",
    "main_id",
    "use",
    "surround",
  ];
  staticKey = ["backward", "forward", "repeat", "flat_area", "fence", "warch"];
  maxKeys = ["height", "east", "west", "south", "north"];
  obKeys = ["floors", "surround"];
  render() {
    const { title, pTitle, t, buildings } = this.props;
    // const lands = get(state, params.lands, {})
    // const tot_area = sumBy(lands, d=>(d.attributes['PARCEL_AREA']))
    const merged = buildings.map((build) =>
      mapValues(build, (d, k) => {
        if (!this.keys.includes(k)) {
          if (this.staticKey.includes(k)) {
            return Number(d);
          }
          return Number(d) * Number(build.repeat);
        }
        if (isObject(d)) {
          return {
            ...this.mappingFields(d, build, this.staticKey),
            r_build: build.repeat,
          };
        }
        return d;
      })
    );
    const totals = mergeWith({}, ...merged, (objVal, srcVal, key) => {
      if (!isObject(objVal)) {
        // console.log(key)
        if (this.maxKeys.includes(key)) {
          return max([objVal, srcVal]);
        }
        return isNumber(objVal) ? Number(objVal) + Number(srcVal) : srcVal;
      }
      return { ...objVal, ...srcVal };
    });
    console.log("tooootals", totals);
    return (
      <>
        <h4>{t(title)}</h4>
        <Collapse
          className="Collapse"
          activeKey={this.state.keys}
          onChange={this.changeKeys}
          key={[...map(buildings, (section, key) => key), "total"]}
        >
          <>
            {map(buildings, (data, key) => (
              <Panel
                key={key}
                header={convertToArabic(t(pTitle) + ` ${key + 1}`)}
                forceRender={true}
              >
                <Building
                  r_build={1}
                  index={data.main_id || key}
                  {...this.props}
                  data={data}
                />
                {/* </Card> */}
              </Panel>
            ))}
            <Panel key="total" header={"المجموع الكلي"} forceRender={true}>
              <>
                <Building index={"total"} {...this.props} data={totals} />
                {/* </Card> */}
                {map(img_fields, this.renderInfo)}
              </>
            </Panel>
          </>
        </Collapse>
      </>
    );
  }
}

export default withTranslation("labels")(collapse);
