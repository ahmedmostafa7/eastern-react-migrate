import React, { useEffect, useState } from "react";
import QRCode from "./qr";
import { isEmpty } from "lodash";
export default function QrReader({ export_no }) {
  const { src, setSrc } = useState("");
  // useEffect(() => {
  // QRCode.toDataURL(export_no).then((data) => {
  // setSrc(data);
  // });
  // value={!isEmpty(export_no) && export_no}
  //   value={"اثغ"}
  //   text="رقم الصادر"
  // />;
  // });
  // console.log("ex", export_no);
  return (
    <div>
      <img src={src} />
    </div>
  );
}
