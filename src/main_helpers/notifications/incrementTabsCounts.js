const incrementTabsCounts = (
  n,
  submissionCounts = { New: 0, Returned: 0 },
  setSubmissionsCount = () => null
) => {
  const p = JSON.parse(n.payload);
  switch (p.status) {
    case "new":
      setSubmissionsCount({
        ...submissionCounts,
        New: submissionCounts.New + 1,
      });
      break;
    case "returned":
      setSubmissionsCount({
        ...submissionCounts,
        Returned: submissionCounts.Returned + 1,
      });
      break;
    case "rejected":
      setSubmissionsCount({
        ...submissionCounts,
        "Rejected submissions": submissionCounts["Rejected submissions"] + 1,
      });
      break;
    case "exportNo":
      break;
    case "unPaid":
      setSubmissionsCount({
        ...submissionCounts,
        Unpaid: submissionCounts.Unpaid + 1,
      });
      break;
    default:
      break;
  }
};

export default incrementTabsCounts;
