// ============================================================
// FUNÇÕES DE CÁLCULO
// (equivalentes às funções Python que você já tinha)
// ============================================================

function calcularAreaCirculo(raio) {
  return Math.PI * (raio ** 2);
}

function calcularMedia(numeros) {
  if (numeros.length === 0) return 0;
  const soma = numeros.reduce((acc, n) => acc + n, 0);
  return soma / numeros.length;
}

function calcularDeltaBhaskara(a, b, c) {
  return b ** 2 - 4 * a * c;
}

function calcularRaizBhaskara(a, b, c) {
  const delta = calcularDeltaBhaskara(a, b, c);
  if (delta < 0) {
    throw new Error("Delta negativo: não existem raízes reais para esses valores.");
  }
  const x1 = (-b + Math.sqrt(delta)) / (2 * a);
  const x2 = (-b - Math.sqrt(delta)) / (2 * a);
  return [x1, x2];
}

function calcularDistanciaEntrePontos(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}


// ============================================================
// REGISTRO DE FÓRMULAS
// Mesmo padrão do Python: cada entrada diz o nome, quais campos
// pedir, e qual função chamar com os valores digitados.
// ============================================================

const FORMULAS = {
  "Área do Círculo": {
    variaveis: ["raio"],
    calcular: (v) => calcularAreaCirculo(v.raio),
  },
  "Média": {
    variaveis: ["numeros (separe por vírgula)"],
    calcular: (v) => {
      const lista = v["numeros (separe por vírgula)"]
        .split(",")
        .map((n) => parseFloat(n.trim()));
      return calcularMedia(lista);
    },
  },
  "Bhaskara (raízes)": {
    variaveis: ["a", "b", "c"],
    calcular: (v) => calcularRaizBhaskara(v.a, v.b, v.c),
  },
  "Distância entre Pontos": {
    variaveis: ["x1", "y1", "x2", "y2"],
    calcular: (v) => calcularDistanciaEntrePontos(v.x1, v.y1, v.x2, v.y2),
  },
};


// ============================================================
// LÓGICA DA PÁGINA (equivalente à classe Calculadora do Tkinter)
// ============================================================

const seletorFormula = document.getElementById("seletor-formula");
const camposDinamicos = document.getElementById("campos-dinamicos");
const botaoCalcular = document.getElementById("botao-calcular");
const divResultado = document.getElementById("resultado");

// Preenche o <select> com os nomes das fórmulas
function preencherSeletor() {
  Object.keys(FORMULAS).forEach((nome) => {
    const opcao = document.createElement("option");
    opcao.value = nome;
    opcao.textContent = nome;
    seletorFormula.appendChild(opcao);
  });
}

// Gera os campos de input de acordo com a fórmula escolhida
function gerarCampos() {
  camposDinamicos.innerHTML = "";
  divResultado.textContent = "";
  divResultado.className = "resultado";

  const nomeFormula = seletorFormula.value;
  const variaveis = FORMULAS[nomeFormula].variaveis;

  variaveis.forEach((nomeVar) => {
    const label = document.createElement("label");
    label.textContent = nomeVar;

    const input = document.createElement("input");
    input.type = "text";
    input.dataset.variavel = nomeVar;

    camposDinamicos.appendChild(label);
    camposDinamicos.appendChild(input);
  });
}

// Lê os valores digitados, calcula e mostra o resultado
function calcular() {
  const nomeFormula = seletorFormula.value;
  const inputs = camposDinamicos.querySelectorAll("input");

  try {
    const valores = {};
    inputs.forEach((input) => {
      const nomeVar = input.dataset.variavel;
      if (nomeVar.includes("numeros")) {
        valores[nomeVar] = input.value; // texto puro, a função separa por vírgula
      } else {
        const numero = parseFloat(input.value);
        if (Number.isNaN(numero)) {
          throw new Error(`Valor inválido em "${nomeVar}"`);
        }
        valores[nomeVar] = numero;
      }
    });

    const resultado = FORMULAS[nomeFormula].calcular(valores);

    divResultado.textContent = `Resultado: ${resultado}`;
    divResultado.className = "resultado ok";
  } catch (erro) {
    divResultado.textContent = `Erro: ${erro.message}`;
    divResultado.className = "resultado erro";
  }
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

preencherSeletor();
gerarCampos(); // gera os campos da primeira fórmula já na abertura

seletorFormula.addEventListener("change", gerarCampos);
botaoCalcular.addEventListener("click", calcular);
