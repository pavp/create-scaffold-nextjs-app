export const openICSBase64 = (base64Data: string, fileName: string = 'event.ics') => {
  try {
    const byteCharacters = atob(base64Data);
    const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: 'text/calendar' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error opening ICS file:', error);
  }
};
