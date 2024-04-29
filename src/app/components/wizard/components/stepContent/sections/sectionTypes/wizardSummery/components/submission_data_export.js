import React from "react";

const submission_data_export = ({ mainObject }) => {
  const data = mainObject?.submission_data_export?.submission_data_export;
  let imgSrc = data?.attachment;
  console.log(data);
  return (
    <div>
      <table className="table table-bordered">
        <tr>
          <td>رقم المعاملة</td>
          <td>{data?.submission_no}</td>
        </tr>
        <tr>
          <td>تاريخ المعاملة</td>
          <td>{data?.date}</td>
        </tr>
        <tr>
          <td>رقم الوارد</td>
          <td>{data?.import_no}</td>
        </tr>
        <tr>
          <td>رقم الصادر</td>
          <td>{data?.export_no}</td>
        </tr>
        <tr>
          <td>وصف المعاملة</td>
          <td>{data?.submission_text_area}</td>
        </tr>
        <tr>
          <td>المرفقات </td>
          <td style={{ display: "flex" }}>
            {imgSrc && imgSrc.length > 0
              ? imgSrc.map((d, k) => {
                  return (
                    <div key={k}>
                      {d.includes(".pdf") ? (
                        <a
                          href={window.filesHost + `${d}`}
                          target="_blank"
                          download
                        >
                          <img
                            src="images/pdf.png"
                            width="50px"
                            height="50px"
                          />
                        </a>
                      ) : d.includes(".dwg") ? (
                        <a
                          href={window.filesHost + `${d}`}
                          target="_blank"
                          download
                        >
                          <img
                            src="images/cad.png"
                            width="50px"
                            height="50px"
                          />
                        </a>
                      ) : (
                        <a
                          href={window.filesHost + `${d}`}
                          target="_blank"
                          download
                        >
                          <img
                            src={window.filesHost + `${d}`}
                            width="50px"
                            height="50px"
                          />
                        </a>
                        // remove_duplicate(d)
                      )}
                    </div>
                  );
                })
              : "لا يوجد"}
          </td>
        </tr>
      </table>
    </div>
  );
};

export default submission_data_export;
