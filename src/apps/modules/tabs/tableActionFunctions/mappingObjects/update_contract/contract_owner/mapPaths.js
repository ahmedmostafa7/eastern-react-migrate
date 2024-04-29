export const paths = [
  {
    "ownerData.ownerData.owners": "owners_data.owners",
    groupBy: "id",
    fields: { main_id: "id", subtype_status: "status" },
    isUUID: true,
    copyAllFields: true,
  },
  {
    ownerData: "owners_data",
    fields: {
      issuerData: "issuers",
      "representerData.reps": "representer",
      "ownerData.owner_type": "owner_type",
      "ownerData.has_representer": "has_representer",
      "representData.image": "representative_image",
      "representData.sak_number": "representive_contract_number",
      "representData.sak_date": "issuer_date",
      "representData.issuer": "issuers.name",
      "representData.note": "issuers.remarks",
    },
  },
  // waseka
  {
    "waseka.waseka": "contracts_and_kroky_attach",
    fields: {
      image: "contract_image",
      kroky_image: "kroky_image",
    },
  },
  {
    "contract_commentments.contract_commentments": "approve_request",
    fields: {
      approved_accept: "approved_accept",
      approved_sak: "approved_sak",
      approved_sak_status: "approved_sak_status",
      owner_approval: "owner_approval",
    },
  },
  
];
