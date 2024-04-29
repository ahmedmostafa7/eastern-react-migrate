const selectOperations = [
  {
    icon: "select",
    class: "btn-default btn-sm",
    btnFunctinality: "editSelect",
    content: "select",
    tooltip: "تحديد قطعة الأرض / قطع الأراضي",
    onClick: function (temp) {
      temp.selectOnMap();
    },
  },
];
const commonOperations = [
  {
    icon: "zoomStallite",
    class: "btn-default btn-sm",
    btnFunctinality: "zoomStallite",
    content: "zoomStallite",
    tooltip: "تقريب الي المصور الجغرافي",
    onClick: function (temp) {
      temp.zoomtoStallite();
    },
  },
  {
    icon: "splitLayer",
    class: "btn-default btn-sm",
    btnFunctinality: "swipeLayer",
    content: "splitLayer",
    tooltip: "مقارنة الطبقات",
    onClick: function (temp) {
      temp.openSwipeLayer();
    },
  },
  {
    icon: "fonts",
    class: "btn-default btn-sm",
    btnFunctinality: "editFonts",
    content: "fonts",
    tooltip: "التحكم في الخطوط",
    onClick: function (temp) {
      temp.resizeParcelNumberFont();
    },
  },
  {
    icon: "move",
    class: "btn-default btn-sm",
    btnFunctinality: "moveLine",
    content: "move",
    tooltip: "تحريك أطوال الأضلاع وأرقام الأراضي",
    onClick: function (temp) {
      temp.moveFeatures();
    },
  },
  {
    icon: "add",
    class: "btn-default btn-sm",
    btnFunctinality: "addLine",
    content: "add",
    tooltip: "إضافة طول ضلع",
    onClick: function (temp) {
      temp.addFeature();
    },
  },
  {
    icon: "delete",
    class: "btn-default btn-sm",
    btnFunctinality: "deleteLine",
    content: "delete",
    tooltip: "حذف طول ضلع",
    onClick: function (temp) {
      temp.deleteFeature();
    },
  },
];

export const selectionMapOperations = {
  operations: [...selectOperations],
};

export const surveyOperation = {
  operations: [{
    icon: "zoomStallite",
    class: "btn-default btn-sm",
    btnFunctinality: "zoomStallite",
    content: "zoomStallite",
    tooltip: "تقريب الي المصور الجغرافي",
    onClick: function (temp) {
      temp.zoomtoStallite();
    },
  },
  {
    icon: "splitLayer",
    class: "btn-default btn-sm",
    btnFunctinality: "swipeLayer",
    content: "splitLayer",
    tooltip: "مقارنة الطبقات",
    onClick: function (temp) {
      temp.openSwipeLayer();
    },
  },],
};

export const extraMapOperations = {
  resizableLayer: [
    "editlengthGraphicLayer",
    "PacrelNoGraphicLayer",
    "PacrelUnNamedGraphicLayer",
    "detailedGraphicLayer",
  ],
  moveLayer: [
    "editlengthGraphicLayer",
    "PacrelNoGraphicLayer",
    "PacrelUnNamedGraphicLayer",
    "detailedGraphicLayer",
  ],
  operations: [
    ...commonOperations,
    {
      icon: "resize",
      class: "btn-default btn-sm",
      btnFunctinality: "editHeight",
      content: "edit",
      tooltip: "تعديل أطوال الأضلاع",
      onClick: function (temp) {
        temp.editBoundries();
      },
    },
  ],
};

export const basicMapOperations = {
  // resizableLayer: [
  //   "editlengthGraphicLayer",
  //   "PacrelNoGraphicLayer",
  //   "PacrelUnNamedGraphicLayer",
  //   "detailedGraphicLayer",
  // ],
  // moveLayer: [
  //   "editlengthGraphicLayer",
  //   "PacrelNoGraphicLayer",
  //   "PacrelUnNamedGraphicLayer",
  //   "detailedGraphicLayer",
  // ],
  // operations: [...commonOperations],
  ...extraMapOperations,
};

export const extraMapOperationsInvest = {
  resizableLayer: [
    "editlengthGraphicLayer",
    "PacrelNoGraphicLayer",
    "PacrelUnNamedGraphicLayer",
    "detailedGraphicLayer",
  ],
  moveLayer: [
    "editlengthGraphicLayer",
    "PacrelNoGraphicLayer",
    "PacrelUnNamedGraphicLayer",
    "detailedGraphicLayer",
  ],
  operations: [
    ...commonOperations,
    {
      icon: "resize",
      class: "btn-default btn-sm",
      btnFunctinality: "editHeight",
      content: "edit",
      tooltip: "تعديل أطوال الأضلاع",
      onClick: function (temp) {
        temp.editBoundries();
      },
    },
    {
      icon: "select",
      class: "btn-default btn-sm",
      btnFunctinality: "editSelect",
      content: "select",
      tooltip: "تحديد قطعة الأرض / قطع الأراضي",
      onClick: function (temp) {
        temp.selectOnMap();
      },
    },
  ],
};
