/* eslint-disable no-param-reassign */
export function resizeTextAreaHeight(textarea: HTMLTextAreaElement) {
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
}
