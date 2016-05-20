// Predefined to impose presentation order.
export const studyFields = [
  'seen1',
  'seen2',
  'seen3',
  'seen7',
  'installed',
  'completed',
  'ineligible',
  'left_study'
];

const fadedFields = [
  'ineligible',
  'left_study'
];

// Should the study field be treated as visually unimportant?
export function isFieldFaded(field) {
  return fadedFields.indexOf(field) !== -1;
}