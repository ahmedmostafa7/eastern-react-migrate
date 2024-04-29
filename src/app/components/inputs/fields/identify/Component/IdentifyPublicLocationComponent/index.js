import React, { Component } from "react";
import { esriRequest } from "../common/esri_request";
import {
  queryTask,
  getInfo,
  highlightFeature,
  clearGraphicFromLayer,
  getFeatureDomainName,
  intersectQueryTask,
  project,
  addParcelNo,
  convertToEnglish,
} from "../common/common_func";
import axios from "axios";
import { LoadModules } from "../common/esri_loader";
import { mapUrl } from "../mapviewer/config/map";
import { Select, Button, Form, message } from "antd";
import "antd/dist/reset.css";
import MapComponent from "../MapComponent/MapComponent";
import MapBtnsComponent from "../MapBtnsComponent";
import { mapDispatchToProps, mapStateToProps } from "../mapping";
import { connect } from "react-redux";
import { StickyContainer, Sticky } from "react-sticky";
import { querySetting, selectDis } from "./Helpers";
var uniqid = require("uniqid");
import { slice, isEqual } from "lodash";
const { Option } = Select;

class IdentifyPublicLocationComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapLoaded: false,
    };
  }

  mapLoaded = (map) => {
    this.map = map;

    let {
      input: { value, onChange },
    } = this.props;

    if (value?.parcels) {
      highlightFeature(this.props.input.value.parcels, this.map, {
        layerName: "SelectLandsGraphicLayer",
        noclear: true,
        isZoom: true,
        attr: { isParcel: true },
        isHighlighPolygonBorder: true,
        zoomFactor: 70,
      });
    }

    setTimeout(() => {
      if (value?.publicLocation) {
        map.setExtent(value?.publicLocation);
      }
    }, 1000);

    this.setState({ mapLoaded: true });
    this.props.setCurrentMap(map);
  };

  captureMapExtent = (map) => {
    let {
      input: { value, onChange },
    } = this.props;

    onChange({
      ...value,
      publicLocation: map.extent,
    });
  };

  render() {
    return (
      <div>
        {/* <div>
          <MapBtnsComponent
            captureMapExtent={this.captureMapExtent}
            {...this.props}
          ></MapBtnsComponent>
        </div> */}
        <StickyContainer style={{ direction: "ltr" }}>
          <Sticky bottomOffset={80}>
            {({ style }) => (
              <MapBtnsComponent
                captureMapExtent={this.captureMapExtent}
                style={style}
                {...this.props}
              ></MapBtnsComponent>
            )}
          </Sticky>
        </StickyContainer>
        <div>
          <MapComponent
            captureMapExtent={this.captureMapExtent}
            mapload={this.mapLoaded.bind(this)}
            {...this.props}
          ></MapComponent>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IdentifyPublicLocationComponent);
