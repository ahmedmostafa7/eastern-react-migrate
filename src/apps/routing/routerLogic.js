import React from 'react'

export default function routerLogic() {
     const urlParams = get(window.location.href.split("?"), "1");
  const params = qs.parse(urlParams, { ignoreQueryPrefix: true });
  const Token = get(params, "tk");
  if (Token) {
    // get user from token
    localStorage.setItem("token", Token);

    const url = "http://77.30.168.84/GISAPIDEVV2" + "/authenticate";
    let urlCheck = "http://77.30.168.84/GISAPIDEVV2" + "/checkEngCompCirculars";
    postItem(url)
      .then((res) => {
        addUser(res);
        // this.setState({ superAdmin: res.is_super_admin });
        let noTokenUser = Object.assign({}, res);
        noTokenUser["token"] = null;
        noTokenUser["esri_token"] = null;
        noTokenUser["esriToken"] = null;
        localStorage.setItem("user", JSON.stringify(noTokenUser));
        localStorage.setItem("token", res.token);
        localStorage.setItem("esri_token", res.esriToken);
        axios.get(urlCheck).then((res) => {
          if (res.data) {
            Modal.error({
              title: "تنبيه",
              content:
                "عذرا، يرجي قراءة وإنهاء التعميمات المرسلة لديكم حتي يتثني لكم التعامل على التطبيق",
            });
            Modal.closable = false;
            Modal.footer = null;
            Modal.okText = "تم";
            Modal.wrapClassName = "ss";
            Modal.onOk = () => {};
          }
        });
      })
      .catch((err = {}) => {
        console.log(err);
        if (get(err.response, "status") == 403) {
          message.error(err.response.data);
        } else {
          message.error("حدث خطأ");
        }
      });
  } else {
    const user = localStorage.getItem("user");
    if (user) {
      addUser(JSON.parse(user));
      // this.setState({ superAdmin: JSON.parse(user).is_super_admin });
    }
  }
}
  return (
    <div>
      
    </div>
  )
}
