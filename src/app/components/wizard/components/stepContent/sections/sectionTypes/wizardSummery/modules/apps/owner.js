export const ownerData = (stepItem, object, module) => {
  let summryObject = (stepItem.ownerData.owner_type == "2" && {
    label: "Owners",
    type: "summery",
    isRequestModule: true,
    data: { data: stepItem.ownerData, sectionName: "ownerData" },
  }) || {
    label: "Owners",
    type: "owner",
    isRequestModule: true,
  };

  return [{ ...summryObject }];
};
