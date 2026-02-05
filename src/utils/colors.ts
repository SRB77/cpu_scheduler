export function generateRandomColor(): string {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 60 + Math.floor(Math.random() * 40); // 60-100%
  const lightness = 50 + Math.floor(Math.random() * 20); // 50-70%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function generateGradientColor(): string {
  const hue1 = Math.floor(Math.random() * 360);
  const hue2 = (hue1 + 60) % 360;
  const saturation = 60 + Math.floor(Math.random() * 40);
  const lightness = 50 + Math.floor(Math.random() * 20);
  return `linear-gradient(135deg, hsl(${hue1}, ${saturation}%, ${lightness}%), hsl(${hue2}, ${saturation}%, ${lightness}%))`;
}
