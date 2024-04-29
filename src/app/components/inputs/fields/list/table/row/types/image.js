import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { last, map } from "lodash";
import ImagePreview from "./ImagePreview";
import Img from "app/helpers/components/image";

class fileUploaderComponent extends Component {
  state = { error: "", disabled: false, deleteVisible: false };

  renderThumb = (file = "", key) => {
    const type = last((file || "").split(".")).toLowerCase();

    return (
      <div onClick={this.handlePreview.bind(this, file)}>
        <Img type={type} file={file} />
      </div>
    );
  };
  handleCancel() {
    this.setState({ ...this.state, previewVisible: false });
  }
  handlePreview(file) {
    this.setState({
      ...this.state,
      previewImage: { url: file },
      previewVisible: true,
    });
  }

  render() {
    const {
      d,
      field: { multiple = true },
    } = this.props;
    const { previewImage, previewVisible } = this.state;
    const fileList = d && (multiple ? d : [d]);

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
