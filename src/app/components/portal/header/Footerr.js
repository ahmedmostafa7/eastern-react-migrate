import React from "react";

//Packages
import { toArabic } from "arabic-digits";

//Images

export default function Footerr() {
  return (
    <div className="smallfooter ">
      <p className="smallfooterYear m-auto py-2">
        جميع الحقوق محفوظة - لأمانة المنطقة الشرقية{" "}
        {toArabic(new Date().getFullYear())}
      </p>
    </div>
  );
}
