import React, { Component } from "react";
import { Modal } from "antd";
import { get, last } from "lodash";
// import {host} from 'configFiles/config';
import Img from "app/helpers/components/image";
import ReactImageZoom from "react-image-zooom";
const isObject = (val) => {
  return val instanceof Object;
};
class ImagePreview extends Component {
  render() {
    const { image, onCancel } = this.props;
    console.log("ff", image);
    const url = get(image, "url", "");
    const type = last(
      (!isObject(url) && url.split(".")) || url.data.split(".")
    ).toLowerCase();
    return (
      <div className="eee">
        {
          <Modal visible={true} footer={null} onCancel={onCancel}>
            {((type.includes("pdf") ||
              type.includes("PDF") ||
              type.includes("dwg") ||
              type.includes("docx")) && <Img type={type} file={url} />) || (
              <ReactImageZoom src={filesHost + url} />
            )}
          </Modal>
        }
      </div>
    );
  }
}

export default ImagePreview;
