import React, { Component } from "react";
import { host } from "configFiles/config";
import { get, toLower } from "lodash";
const types = {
  dwg: "images/cad.png",
  docs: "images/docs.png",
  docx: "images/docs.png",
  doc: "images/docs.png",
  pdf: "images/pdf.png",
  xlsx: "images/xlsx.png",
  xls: "images/xlsx.png",
  kmz: "images/kml.png",
  shp: "images/shape.png",
};
export default class Image extends Component {
  render() {
    const src = get(
      types,
      this.props.type,
      toLower(window.filesHost + `${this.props.file}`)
        .replace(/(gisapi\/+testgisapi?)/gm, "gisapi")
        .replace(/(gisapi\/+gisapi?)/gm, "gisapi")
    );
    console.log(src);
    return <img src={src} />;
  }
}
