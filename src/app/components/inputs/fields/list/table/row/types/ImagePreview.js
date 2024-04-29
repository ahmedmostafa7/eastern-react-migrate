import React, { Component } from "react";
import { Modal } from "antd";
import { get, last } from "lodash";
// import {host} from 'configFiles/config';
import Img from "app/helpers/components/image";
const isObject = (val) => {
  return val instanceof Object;
};
class ImagePreview extends Component {
  render() {
    const { image, onCancel } = this.props;
    const url = get(image, "url", "");
    const type = last(
      (!isObject(url) && url.split(".")) || url.data.split(".")
    ).toLowerCase();
    return (
      <div className="eee">
        {
          <Modal visible={true} footer={null} onCancel={onCancel}>
            {<Img type={type} file={url} />}
          </Modal>
        }
      </div>
    );
  }
}

export default ImagePreview;
