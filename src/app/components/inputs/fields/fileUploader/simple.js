import React, { Component } from "react";
import { Icon, Modal } from "antd";
import { withTranslation } from "react-i18next";
import {
  concat,
  reject,
  map,
  last,
  isFunction,
  isEqual,
  omit,
  isArray,
} from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { host } from "imports/config";
import ImagePreview from "./ImagePreview";
import axios from "axios";
import { input } from "../list/table/row/types";
import Img from "app/helpers/components/image";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { connect } from "react-redux";
import { withRouter } from "react-router";
const { confirm } = Modal;
const config = {
  headers: {
    "content-type": "multipart/form-data",
  },
};
const isObject = (val) => {
  return val instanceof Object;
};
class fileUploaderComponent extends Component {
  state = {
    error: "",
    disabled: false,
    deleteVisible: false,
    maxFileSize: 10 * 1024,
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props) {
      if (this.props.init) this.props.init(this.props);
    }
  }
  uploadButton = (
    <div>
      {/* <div className="ant-upload-text">
        {this.props.textTruncated
          ? this.props.label.substring(
              0,
              this.props.truncatedCharacterIndex || 10
            ) + "..."
          : this.props.label}
      </div> */}

      <FontAwesomeIcon
        icon={faCloudUploadAlt}
        className="fa-2x"
        style={{ color: "#00726f" }}
      />
    </div>
  );
  isObject = (val) => {
    return val instanceof Object;
  };
  renderThumb = (file, key) => {
    const { disabled, values } = this.props;
    console.log("file", file);
    file =
      (!this.isObject(file) && file) ||
      (isArray(file) && (file?.[0]?.data || file?.[0])) ||
      (!isArray(file) && (file?.data || file));
    let splitted = file;
    if (splitted && splitted.toLowerCase().includes("gisapi")) {
      file = `${splitted
        .toLowerCase()
        .split("gisapi")[1]
        .replace(/\\/g, "/")
        .replace("//", "/")}`;
    }

    const type = file && last(file.split(".")).toLowerCase();
    return (
      <div style={{ display: "grid" }}>
        <Img type={type} file={file} key={key} />
        <div className="overlay-img">
          <button
            type="button"
            className="btn btn_up_icon"
            onClick={this.handlePreview.bind(this, file, key, type)}
          >
            <i className="fa fa-eye" aria-hidden="true"></i>
          </button>
          <button
            type="button"
            className="btn btn_up_icon"
            disabled={
              isFunction(disabled) ? disabled(values, this.props) : disabled
            }
            onClick={this.onRemove.bind(this, file, key)}
          >
            <i className="fas fa-trash" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    );
  };
  handlePreview(file, key, type) {
    if (
      ["dwg", "pdf", "doc", "docx", "xlsx", "kmz", "shp", "xls"].includes(type)
    ) {
      return window.open(
        window.filesHost + `/${(isObject(file) && file.data) || file}`
      );
    }
    this.setState({
      ...this.state,
      previewImage: { url: file },
      previewVisible: true,
    });
    // } else {
    //   window.open(`${host}/${get(file, "url")}`);
    // }
  }

  handleCancel() {
    this.setState({ ...this.state, previewVisible: false });
  }

  uploadFile = (files, preRequestResults = null, event) => {
    const {
      t,
      input,
      multiple = true,
      uploadUrl,
      postRequest,
      preRequest = (props) => {
        return new Promise((resolve, reject) => {
          resolve(true);
        });
      },
    } = this.props;
    const formData = new window.FormData();
    for (let i = 0; i < this.files.length; i++) {
      formData.append("file" + i, this.files[i]);
    }
    return axios.post(uploadUrl, formData, config).then(
      ({ data }) => {
        event.target.value = "";
        input.onChange(
          multiple
            ? concat(
                input.value,
                data.map((d) => d.data)
              ).filter((d) => d)
            : data[0].data
        );
        if (postRequest) {
          postRequest(
            multiple
              ? concat(
                  input.value,
                  data.map((d) => d.data)
                ).filter((d) => d)
              : data[0].data,
            this.props,
            preRequestResults
          );
        }
      },
      (error) => {
        // "global.ERRORINWRITEFILE"
        event.target.value = "";
        window.notifySystem("error", t("messages:global.ERRORINWRITEFILE"));
      }
    );
  };

  onChangeFile(event) {
    debugger;
    const {
      preRequest = (props) => {
        return new Promise((resolve, reject) => {
          resolve(true);
        });
      },
    } = this.props;
    this.files = event.target.files;

    const { t, fileType } = this.props;

    let isNotValidExtension =
      (fileType &&
        _.values(this.files).filter((file) => {
          if (file.type) {
            var type =
              file.type.indexOf("/") != -1
                ? file.type.toLowerCase().split("/")[1]
                : file.type.toLowerCase().replace(".", "");
            if (
              fileType.toLowerCase().indexOf("image/*") != -1 &&
              ["jpg", "jpeg", "gif", "bmp", "png"].indexOf(type) != -1
            ) {
              return false;
            } else {
              if (
                file?.name?.indexOf("xlsx") != -1 &&
                fileType.indexOf("xlsx") != -1
              ) {
                return false;
              }
              if (
                file?.name?.indexOf("xls") != -1 &&
                fileType.indexOf("xls") != -1
              ) {
                return false;
              }
              if (
                file?.name?.indexOf("docx") != -1 &&
                fileType.indexOf("docx") != -1
              ) {
                return false;
              }
              if (
                file?.name?.indexOf("doc") != -1 &&
                fileType.indexOf("doc") != -1
              ) {
                return false;
              } else if (
                file?.name?.indexOf("zip") != -1 &&
                fileType.indexOf("zip") != -1
              ) {
                return false;
              } else if (
                file?.name?.indexOf("shp") != -1 &&
                fileType.indexOf("shp") != -1
              ) {
                return false;
              } else {
                return !(fileType.toLowerCase().indexOf(type) != -1);
              }
            }
          } else {
            return !(
              fileType.toLowerCase().indexOf("dwg") != -1 ||
              fileType.toLowerCase().indexOf("xlsx") != -1 ||
              fileType.toLowerCase().indexOf("xls") != -1
            );
          }
        }).length > 0) ||
      false;

    if (isNotValidExtension) {
      window.notifySystem("error", t("messages:WRONG_EXTENSION"));
      delete this.files;
      return false;
    }

    var sizeByKiloByte = 2 * 1024 * +this.state.maxFileSize;
    let isFileNotValid =
      _.values(this.files).filter((file) => {
        return file.size >= sizeByKiloByte;
      }).length > 0;

    if (isFileNotValid) {
      window.notifySystem("error", t("messages:ERRORFILESIZE"));
      delete this.files;
      return false;
    }

    let exception = 0;
    try {
      preRequest(this.props).then(
        (response) => {
          exception++;
          this.uploadFile(this.files, response, event);
          delete this.files;
          return true;
        },
        (response) => {
          return false;
        }
      );
    } catch (e) {
      if (exception == 0) {
        this.uploadFile(this.files, null, event);
        delete this.files;
        return true;
      }
    }
  }

  onRemove = (removItem) => {
    const {
      input,
      multiple = true,
      t,
      postRequest,
      values,
      change,
    } = this.props;

    var mythis = this;
    confirm({
      content: t("Are you sure you want to delete this item?"),
      title: t("labels:Delete"),
      onOk: () => {
        let newVals = multiple
          ? input.value
              ?.map((v, index) => {
                return (
                  (v.data && v) || {
                    data: v,
                    PrevFileName: v,
                    $id: index.toString(),
                    ignorResize: false,
                  }
                );
              })
              ?.filter((v) => v.data && v.data.indexOf(removItem) == -1)
          : "";
        input.onChange(newVals);
        mythis.setState({});
        if (postRequest) {
          postRequest("", this.props);
        }
        return false;
      },
      onCancel: () => {
        return false;
      },
      okText: t("labels:Yes"),
      cancelText: t("labels:No"),
    });

    return false;
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(nextProps.data, this.props.data) ||
      !isEqual(nextProps.input.value, this.props.input.value) ||
      !isEqual(nextProps.lang, this.props.lang) ||
      !isEqual(nextProps.forceUpdate, this.props.forceUpdate) ||
      true
    );
  }

  render() {
    const {
      input: { value },
      fileType = "",
      multiple = true,
      disabled,
      values,
      visible = true,
    } = this.props;

    const { previewImage, previewVisible } = this.state;
    const fileList = value && (multiple ? value : [value]);

    return (
      (isFunction(visible) ? visible(values, this.props) : visible) && (
        <div className="file_up">
          <button
            className="upload-button"
            type="button"
            disabled={
              isFunction(disabled) ? disabled(values, this.props) : disabled
            }
            onClick={() => {
              this.upload.click();
            }}
          >
            <>
              {this.uploadButton}

              <input
                type="file"
                id="file"
                ref={(ref) => (this.upload = ref)}
                style={{ display: "none" }}
                accept={fileType}
                multiple={multiple}
                onChange={this.onChangeFile.bind(this)}
              />
            </>
          </button>
          {map(fileList, this.renderThumb)}
          {previewVisible && (
            <ImagePreview
              image={previewImage}
              onCancel={this.handleCancel.bind(this)}
            />
          )}
        </div>
      )
    );
  }
}

// const connector = connect(mapStateToProps, mapDispatchToProps);
// export default connector(
//   withTranslation("messages", "labels")(fileUploaderComponent)
// );

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation("messages", "labels")(fileUploaderComponent))
);
