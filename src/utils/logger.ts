export const logError = (title: string, error: string, color?: string): void => {
  console.log(`%c\n${title}\n${error}\n`, `color: ${color || '#ff9800'}; font-size: 14px; line-height: 1.8;`);
  console.error('Error Stack: \n', error);
};
