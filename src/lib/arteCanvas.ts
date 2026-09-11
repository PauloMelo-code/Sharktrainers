/**
 * Desenha a arte da vaga em 1080×1600 para download (WhatsApp e Instagram).
 * As medidas são as mesmas da pré-visualização em HTML, para o PNG sair igual
 * ao que a Vanessa vê na tela.
 */
export type DadosArte = {
  cargo: string;
  cidades: string[];
  destaques: string[];
  telefone: string;
  /** Data URL da foto escolhida, quando houver. */
  foto?: string | null;
};

const LARGURA = 1080;
const ALTURA = 1600;

function carregarImagem(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const imagem = new Image();
    imagem.crossOrigin = "anonymous";
    imagem.onload = () => resolve(imagem);
    imagem.onerror = () => resolve(null);
    imagem.src = src;
  });
}

export async function gerarArtePng(dados: DadosArte): Promise<string> {
  // Sem esperar as fontes, o canvas desenharia com a fonte de sistema.
  await Promise.all([
    document.fonts.load('700 86px "Playfair Display"'),
    document.fonts.load('800 50px "Barlow"'),
    document.fonts.load('800 124px "Barlow Condensed"'),
  ]).catch(() => undefined);

  const canvas = document.createElement("canvas");
  canvas.width = LARGURA;
  canvas.height = ALTURA;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Não foi possível gerar a arte neste navegador.");

  const fundo = dados.foto ? await carregarImagem(dados.foto) : null;
  if (fundo) {
    const escala = Math.max(LARGURA / fundo.width, ALTURA / fundo.height);
    ctx.drawImage(
      fundo,
      (LARGURA - fundo.width * escala) / 2,
      0,
      fundo.width * escala,
      fundo.height * escala,
    );
  } else {
    const gradiente = ctx.createLinearGradient(0, 0, LARGURA, ALTURA);
    gradiente.addColorStop(0, "#4a4a4a");
    gradiente.addColorStop(0.55, "#1a1a1a");
    gradiente.addColorStop(1, "#000");
    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, LARGURA, ALTURA);
  }

  const sombra = ctx.createLinearGradient(0, 0, 0, ALTURA);
  sombra.addColorStop(0.3, "rgba(0,0,0,0)");
  sombra.addColorStop(0.56, "rgba(0,0,0,.85)");
  sombra.addColorStop(0.72, "#000");
  ctx.fillStyle = sombra;
  ctx.fillRect(0, 0, LARGURA, ALTURA);

  const logo = await carregarImagem("/assets/logo-t.png");
  if (logo) ctx.drawImage(logo, LARGURA - 40 - 260, 30, 260, 260);

  const linhas = [dados.cargo, ...dados.cidades].filter(Boolean).map((linha) => linha.toUpperCase());
  ctx.font = '700 86px "Playfair Display", serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const alturaLinha = 100;
  const larguraCaixa = Math.min(
    LARGURA * 0.84,
    Math.max(...linhas.map((linha) => ctx.measureText(linha).width)) + 108,
  );
  const alturaCaixa = linhas.length * alturaLinha + 64;
  const x = (LARGURA - larguraCaixa) / 2;
  const y = ALTURA * 0.47 - alturaCaixa / 2;

  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.roundRect(x, y, larguraCaixa, alturaCaixa, 28);
  ctx.fill();

  ctx.fillStyle = "#fff";
  linhas.forEach((linha, indice) => {
    ctx.fillText(linha, LARGURA / 2, y + 32 + alturaLinha * indice + alturaLinha / 2);
  });

  ctx.font = "800 50px Barlow, sans-serif";
  ctx.fillStyle = "#F4C01C";
  dados.destaques.slice(0, 2).forEach((destaque, indice) => {
    ctx.fillText(destaque.toUpperCase(), LARGURA / 2, ALTURA * 0.7 + 36 + indice * 72);
  });

  ctx.font = '800 124px "Barlow Condensed", sans-serif';
  ctx.fillStyle = "#fff";
  ctx.fillText(dados.telefone, LARGURA / 2, ALTURA * 0.83 + 62);

  return canvas.toDataURL("image/png");
}

/** Dispara o download do PNG no navegador. */
export function baixarPng(dataUrl: string, nomeArquivo: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = nomeArquivo;
  link.click();
}
