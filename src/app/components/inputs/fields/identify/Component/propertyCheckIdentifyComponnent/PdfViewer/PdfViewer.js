import React from "react";
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons'
import axios from "axios";

function PdfViewer(props) {
  const handleDowloadViewArchiveFile = (payload, type) => {
    console.log(payload);
    let token = localStorage.token;
    let fileId = payload.fileId ? payload.fileId.replaceAll('}', '').replaceAll('{', '') : '';
    let requestURL = "https://webgis.eamana.gov.sa/GISAPIV2" + `/GetCorrespondenceAttachment?fileId=${fileId}&fileName=${payload.fileName}&fileType=${payload.fileType}`;
    axios
      .get(requestURL,
        {
          headers: {

            Authorization: `Bearer ${token}`
          }, responseType: 'blob'
        })
      .then((res) => {
        if (type === 'view') window.open(URL.createObjectURL(res.data));
        else {
          let url = window.URL.createObjectURL(res.data)
          let a = document.createElement('a')
          a.href = url
          a.download = payload.fileName;
          a.click()
          a.remove()
          setTimeout(() => window.URL.revokeObjectURL(url), 100)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return <>

    <h2 className="text-center">
      {props.title}
    </h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', height: '30rem', overflowY: 'scroll', columnGap: '2rem', justifyContent: 'center' }}>
      {props?.data?.length
        ? props?.data?.map(
          (item, idx) => (
            <div key={"gArch" + idx} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', margin: '0 3rem' }}>
              <div class="ant-image css-nnuwmp" style={{ width: '100px' }}>
                <img class="ant-image-img css-nnuwmp" alt="thumbnail" src="images/adobeicon.png" width="100" />
                <div class="ant-image-mask">
                  <div class="ant-image-mask-info" onClick={() => handleDowloadViewArchiveFile(item, 'view')} style={{ display: 'flex', flexDirection: 'column' }}>
                    <span role="img" aria-label="eye" title={"عرض"} class="anticon anticon-eye">
                      <EyeOutlined />
                    </span>
                    {/* {t('view')} */}
                  </div>
                  <div class="ant-image-mask-info" onClick={() => handleDowloadViewArchiveFile(item, 'download')} style={{ display: 'flex', flexDirection: 'column' }}>
                    <span role="img" aria-label="eye" title={"تحميل"} class="anticon anticon-eye">
                      <DownloadOutlined />
                    </span>
                    {/* {t('download')} */}
                  </div>
                </div>
              </div>
              <span className="text-center" style={{ width: '100px', textWrap: 'wrap' }}>
                {item.fileName}
              </span>
            </div>)) : "لا توجد صور للعرض"}
    </div>
  </>

    ;
}

export default PdfViewer;
