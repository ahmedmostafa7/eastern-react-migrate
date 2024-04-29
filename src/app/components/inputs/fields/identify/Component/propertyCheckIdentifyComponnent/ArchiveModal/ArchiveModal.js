import React from "react";
import { Modal } from "antd";
// import ImageCarousel from "../../../components/ImageCarousel/ImageCarousel";
// import ImageViewer from "../../../components/ImageViewer/ImageViewer";

function ArchiveModal(props) {

  const handleOk = async () => { };

  return <>
    <Modal
      className="archiveGalleryModal"
      visible={props.isOpen}
      onOk={handleOk}
      onCancel={props.closeModal}
      style={{width: "75% !important"}}
      closable={true}
      //   title={'الصور المؤرشفة'}
      //    confirmLoading
      cancelText="إلغاء"
    //okText={'حسناً'}
    >

      {/* <ImageCarousel {...props} /> */}
      {props.children}
    </Modal></>;
}

export default ArchiveModal;
