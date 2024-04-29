import React, { Suspense } from "react";
import { Modal } from "antd";
import Img from "app/helpers/components/image";
import { connect } from "react-redux";
import { get, isEqual } from "lodash";
import * as popups from "./types";
import mapDispatchToProps from "main_helpers/actions/main";
import ReactImageZoom from "react-image-zooom";
const popup_text = {
  margin: "20px 0",
  textAlign: "center",
  fontWeight: "bolder",
  fontSize: "24px",
};
class popup extends React.Component {
  constructor(props) {
    super(props);
  }
  onCancel = () => {
    const { setMain } = this.props;
    setMain("Popup", { popup: {} });
  };

  render() {
    const {
      type,
      Component = get(popups, type),
      childProps,
      visable = type,
      imageModal,
      initialValues,
      imgUrl,
      title,
      className,
      ...props
    } = this.props;

    let ChildComponent;
    {
      !imageModal
        ? (ChildComponent = Component && (
            <Component {...childProps} onCancel={this.onCancel} />
          ))
        : (ChildComponent =
            (Component && imgUrl.includes(".pdf")) ||
            imgUrl.includes(".PDF") ? (
              <a href={imgUrl} download target="_blank">
                <img src="images/pdf.png" />
              </a>
            ) : (
              <ReactImageZoom src={imgUrl} />
            ));
    }
    return (
      <div>
        <Modal
          title=""
          visible={Boolean(visable)}
          onCancel={this.onCancel}
          footer={null}
          centered={true}
          className={className}
          // width={props.width || "50%"}
          bodyStyle={{
            border: props.border || "1px solid  #d73f7c",
            height: props.height || "100%",
          }}
        >
          <>
            {(props.lable || this.props.title) && (
              <div style={popup_text}>{props.lable || this.props.title}</div>
            )}
            <Suspense fallback={<div></div>}>{ChildComponent}</Suspense>
          </>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  ...get(state.popup, "popup", {}),
});
export default connect(mapStateToProps, mapDispatchToProps)(popup);
