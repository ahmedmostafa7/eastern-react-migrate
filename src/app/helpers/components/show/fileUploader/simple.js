import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { map, last, isArray } from "lodash";
import { host } from "imports/config";
import ImagePreview from "./ImagePreview";
import Img from "app/helpers/components/image";
const isObject = (val) => {
  return val instanceof Object;
};
class fileUploaderComponent extends Component {
  state = { error: "", disabled: false, deleteVisible: false };

  renderThumb = (file, key) => {
    // console.log("file", file);
    //const type = last((file.data || file).split(".")).toLowerCase();
    file =
      (!isObject(file) && file) ||
      (isArray(file) && file[0].data) ||
      (!isArray(file) && file.data);
    let splitted = file;
    if (splitted && splitted.toLowerCase().includes("gisapi")) {
      file = `${splitted
        .toLowerCase()
        .split("gisapi")[1]
        .replace(/\\/g, "/")
        .replace("//", "/")}`;
    }

    const type = last((file || "").split(".")).toLowerCase();
    console.log("d", file);
    return (
      <div onClick={this.handlePreview.bind(this, file, key, type)}>
        <Img type={type} file={file} />
      </div>
    );
  };
  handleCancel() {
    this.setState({ ...this.state, previewVisible: false });
  }
  handlePreview(file, key, type) {
    console.log("file", file);

    if (["dwg", "pdf", "doc", "docx"].includes(type)) {
      return window.open(
        window.filesHost + `/${(isObject(file) && file.data) || file}`
      );
    }
    this.setState({
      ...this.state,
      previewImage: { url: file },
      previewVisible: true,
    });
  }

  render() {
    const {
      val,
      field: { multiple = true },
    } = this.props;
    const { previewImage, previewVisible } = this.state;
    const fileList = val && (multiple ? val : [val]);

    return (
      <div className="ss">
        {map(fileList, this.renderThumb)}
        {previewVisible && (
          <ImagePreview
            image={previewImage}
            onCancel={this.handleCancel.bind(this)}
          />
        )}
      </div>
    );
  }
}
export default withTranslation("messages", "labels")(fileUploaderComponent);
