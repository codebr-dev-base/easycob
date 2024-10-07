export function generateColorClasses() {
  const baseColor = [34, 105, 211]; // RGB para o azul forte
  const steps = 10; // Número de variações

  // Gera um array de cores, cada uma com maior transparência
  const colors = Array.from({ length: steps }, (_, index) => {
    const alpha = 1 - index * 0.08; // Transparência vai de 1 a 0.28
    return `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${alpha})`;
  });

  return colors;
}
