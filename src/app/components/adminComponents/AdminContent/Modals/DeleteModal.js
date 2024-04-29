import React from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";

export default function DeleteModal(props) {
  return (
    <Modal
      keyboard={false}
      onHide={props.closeDelete}
      show={props.showDelete}
      backdrop="static"
      className="adminModal"
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title>
          <h4> هل أنت متأكد من حذف {props.title}؟</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button className="cancelbtn" onClick={props.closeDelete}>
          لا
        </Button>
        <Button className="addbtn" id={props.id} onClick={props.onDelete}>
          نعم
        </Button>
      </Modal.Body>
    </Modal>
  );
}
