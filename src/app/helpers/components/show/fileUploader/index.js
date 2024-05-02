import React, { Component } from "react";
import { Upload, Icon, Modal } from "antd";
import { withTranslation } from "react-i18next";
import { get, isEmpty, words, remove } from "lodash";
import { host } from "configFiles/config";
import ImagePreview from "./ImagePreview";
import { PlusOutlined } from "@ant-design/icons";

const { confirm } = Modal;

class fileUploaderComponent extends Component {
  state = { error: "", disabled: false, deleteVisible: false };

  uploadButton = (
    <div>
      <div className="ant-upload-text">{this.props.label}</div>
      <PlusOutlined />
    </div>
  );

  beforeUpload(file) {
    const { fileType = "" } = this.props;

    const regex = new RegExp(words(fileType).join("|"));
    if (fileType == ".dwg") {
      let fileName = file.name.split(".");
      if (!(!isEmpty(fileName) && fileName[fileName.length - 1] == "dwg")) {
        this.setState({ error: "Invalid file type" });
        return false;
      }
    } else if (!regex.test(file.type)) {
      this.setState({ error: "Invalid file type" });
      return false;
    }

    this.setState({ error: "" });

    return true;
  }

  handleChange({ fileList }) {
    const {
      input: { onChange },
      maxNumOfFiles,
    } = this.props;
    if (fileList.length >= maxNumOfFiles) {
      this.setState({ disabled: true });
    } else {
      this.setState({ disabled: false });
    }
    console.log(fileList);
    const _fileList = fileList
      .slice(0 - maxNumOfFiles)
      .filter((file) => file.status)
      .map((file) => ({
        ...file,
        // url: `${host}/${get(file, 'response.data')}`,
        thumbUrl: window.filesHost + `${get(file, "response[0].data")}`,
        url: `${get(file, "response[0].data")}`,
        //thumbUrl: `${get(file, 'response.data')}`,
      }));

    onChange(_fileList);
  }

  handlePreview(file) {
    if (get(file, "type", "").includes("image")) {
      this.setState({
        ...this.state,
        previewImage: file,
        previewVisible: true,
      });
    } else {
      window.open(window.filesHost + `${get(file, "url")}`);
    }
  }

  handleCancel() {
    this.setState({ ...this.state, previewVisible: false });
  }

  onRemove(removItem) {
    const {
      input: { name, value },
      change,
      t,
    } = this.props;
    confirm({
      content: t("Are you sure you want to delete this item?"),
      title: t("labels:Delete"),
      onOk() {
        let newVals = remove([...value], (v) => v.uid != removItem.uid);
        change(name, newVals);
        return false;
      },
      onCancel() {
        return false;
      },
      okText: t("labels:Yes"),
      cancelText: t("labels:No"),
    });

    return false;
  }

  render() {
    const {
      val,
      t,
      fileType = "",
      uploadUrl,
      multiple = true,
      showUploadList = true,
    } = this.props;
    const { previewImage, previewVisible } = this.state;

    const Token = localStorage.getItem("token");

    return (
      <div>
        <Upload
          disabled={this.state.disabled}
          multiple={multiple}
          showUploadList={showUploadList}
          action={uploadUrl}
          headers={{ Authorization: `Bearer ${Token}` }}
          className="upload-section"
          // onRemove={this.onRemove.bind(this)}
          beforeUpload={this.beforeUpload.bind(this)}
          accept={fileType}
          fileList={val}
          // onChange={this.handleChange.bind(this)}
          // onPreview={this.handlePreview.bind(this)}
          listType="picture-card"
          locale={{ previewFile: t("labels:Preview File") }}
        >
          {/* <Button > <Icon type="upload" />{label}</Button> */}
          {this.state.error && (
            <span className="error"> {t(this.state.error)} </span>
          )}
          {!showUploadList && val.length && (
            <span>{t("Upload Successful")} </span>
          )}
          {this.uploadButton}
        </Upload>
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
