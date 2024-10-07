// Função para mover o boneco conforme a meta
function updateGoalMeter(percentage) {
    const path = document.getElementById('mountain');
    const character = document.getElementById('character');
    const pathLength = path.getTotalLength();
  
    // Calcula a posição ao longo do caminho da montanha com base no percentual
    const position = (percentage / 100) * pathLength;
    const point = path.getPointAtLength(position);
  
    // Move o boneco ao longo da linha da montanha
    character.style.transform = `translate(${point.x - 20}px, ${point.y - 270}px)`;
  
    // Muda a cor de fundo conforme a meta
    if (percentage <= 33) {
      document.body.style.backgroundColor = 'red'; // Meta Baixa
    } else if (percentage <= 66) {
      document.body.style.backgroundColor = 'orange'; // Meta Regular
    } else {
      document.body.style.backgroundColor = 'green'; // Meta Ótima
    }
  }
  
  // Captura o evento de mudança no input de range
  const rangeInput = document.getElementById('goalRange');
  rangeInput.addEventListener('input', function () {
    const value = rangeInput.value; // Valor atual do range (0 a 100)
    updateGoalMeter(value);
  });
  
  // Inicializa com o valor do input
  updateGoalMeter(rangeInput.value);