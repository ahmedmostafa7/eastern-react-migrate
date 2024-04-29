import React from "react";
import { filesHost } from "imports/config";
// let province_id = JSON.parse(localStorage.getItem("user"))?.province_id;
// export const  SignPics=({
//   committee_report_no,
//   is_paid,
//   province_id,
//   userId,
//   userIdMainObjd,
//   width = "150px",
// })=>{
//    return(
//   // let { committee_report_no, is_paid } = submission;

//     {committee_report_no && is_paid == 1 && province_id !== null &&
//       (
//       <div>
//         <img
//           src={`${filesHost}/users/${(userId ||= userIdMainObjd)}/sign.png`}
//           width={width}
//         />
//       </div>)
//     }
//   )

// }
// import React from 'react';

function SignPics({
  committee_report_no,
  is_paid,
  province_id,
  userId = "22",
  userIdMainObjd,
  width = "100px",
  planApproval,
  contract,
}) {
  return (
    <div>
      {planApproval ? (
        <div>
          {province_id !== null && (
            <div>
              <img
                src={`${filesHost}/users/${userId}/sign.png`}
                width={width}
              />
            </div>
          )}
        </div>
      ) : contract ? (
        <div>
          {committee_report_no && province_id !== null && userId && (
            <div>
              <img
                src={`${filesHost}/users/${userId}/sign.png`}
                width={width}
              />
            </div>
          )}
        </div>
      ) : (
        <div>
          {is_paid && province_id !== null && (
            <div>
              <img
                src={`${filesHost}/users/${userId}/sign.png`}
                width={width}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SignPics;
