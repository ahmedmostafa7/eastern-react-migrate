import React, { Component } from "react";

class Header extends Component {
  render() {
    const { name } = this.props;
    return (
      <div>
        <div
          className="container header-layout-ma7dar"
          // style={{ marginTop: "5%", height: "11vh" }}
        ></div>
        {/* <div style={{ display: "grid", marginTop: "5px" }}>
            <h5>المملكة العربية السعودية</h5>
            <h4>وزارة الشئون البلدية و القروية</h4>
            <h6>أمانة المنطقة الشرقية</h6>
          </div>
          <div className="big-logo-ma7dar">
            <img src="images/logo2.png" alt="" />
          </div>
          <div style={{ display: "grid" }}>
            <div>
              <span>الوقت</span>:<span>....</span>
            </div>
            <div>
              <span>التاريخ</span>:<span>...</span>
            </div>
            <div>
              <span>المرفقات</span>:<span>...</span>
            </div>
            <div></div>
          </div>*/}
      </div>
    );
  }
}

export default Header;
