const stepIds = [
  867, 1949, 1993, 2001, 2109, 2148, 2248, 2292, 2094, 2096, 2298, 2168, 2288,
  2308, 2317, 3094, 2471, 2546, 2631, 2655, 2532, 2975, 2977, 3014, 3150, 2994,
  3025, 3170
];

export const checkStepIsExcludedFromSummary = (stepId) => {
  return [...stepIds].indexOf(stepId) == -1;
};
