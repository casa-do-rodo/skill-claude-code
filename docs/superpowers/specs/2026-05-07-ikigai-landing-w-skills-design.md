# Ikigai Landing W/Skills — Design Spec

## Contexto

Terceira iteração da landing page institucional da Ikigai Brand, construída com o pipeline completo de skills incluindo `frontend-design`. O objetivo é demonstrar o salto de qualidade visual quando todas as skills estão presentes no fluxo de desenvolvimento.

**Versões anteriores:**
- `ikigai-landing/` — sem skills, código direto
- `ikigai-landing-refined/` — com brainstorming/writing-plans/executing-plans, sem frontend-design
- `ikigai-landing-w-skills/` — esta versão, pipeline completo

---

## Decisões de Design (validadas via visual companion)

### Direção Visual: Dark & Bold
Escolha do usuário via brainstorming visual. Fundo quase preto dominante, tipografia pesada tipo editorial de esporte de alto desempenho. Âmbar `#E8970A` como único acento cromático.

**Diferença fundamental vs. refined:** Esta versão **não tem dark/light toggle**. O dark não é um tema — é a identidade permanente da marca.

### Hero: Full-screen centrado
Headline gigante centralizada em 100vh. Glow radial âmbar atrás do texto. Impacto máximo, sem distrações laterais.

### Tipografia: Display / Impact (Bebas Neue)
Títulos em Bebas Neue (condensada ultra-pesada). Corpo em Inter. Energia de streetwear, pôster e campanha esportiva.

---

## Sistema de Tokens

```css
/* Cores */
--color-bg:          #080808;   /* fundo principal */
--color-bg-alt:      #0F0F0F;   /* seções alternadas */
--color-bg-card:     #141414;   /* cards e painéis */
--color-amber:       #E8970A;   /* acento primário */
--color-amber-light: #F5B83D;   /* acento secundário */
--color-amber-glow:  rgba(232, 151, 10, 0.15); /* glows */
--color-text:        #F5F5F5;   /* texto principal */
--color-text-muted:  rgba(255, 255, 255, 0.45); /* texto secundário */
--color-border:      rgba(255, 255, 255, 0.08); /* bordas */
--color-border-amber: rgba(232, 151, 10, 0.3); /* bordas de destaque */

/* Tipografia */
--font-display: 'Bebas Neue', 'Impact', sans-serif;
--font-body:    'Inter', system-ui, sans-serif;

/* Fontes carregadas via Google Fonts */
/* Bebas Neue: peso 400 (display condensado) */
/* Inter: pesos 300, 400, 500, 600 */
```

---

## Arquitetura de Arquivos

```
ikigai-landing-w-skills/
├── index.html
├── css/
│   ├── tokens.css       — custom properties: cores, tipo, espaçamentos, sombras
│   ├── base.css         — reset, body, tipografia global, animações de entrada
│   ├── components.css   — navbar, botões, cards, badges, forms, footer
│   └── sections.css     — estilos específicos de cada seção + responsivo
└── js/
    └── main.js          — IntersectionObserver, navbar scroll, menu mobile, form
```

Sem `theme.js` — não há toggle de tema nesta versão.

---

## Stack

- HTML5 + CSS3 + Vanilla JavaScript
- Google Fonts: Bebas Neue (400) + Inter (300, 400, 500, 600)
- Sem frameworks, sem build tools, sem dependências externas
- Abre direto via `file://` (sem servidor necessário)

---

## Feature Extra: Animações Cinematográficas

Diferencial desta versão frente às anteriores:

- **Clip-path reveal:** Títulos com letras surgindo de baixo — `clip-path: inset(100% 0 0 0)` → `inset(0)` via IntersectionObserver
- **Fade + slide:** Cards e elementos de conteúdo com `opacity` + `translateY` staggered
- **Glow pulse:** Badge do hero com animação de pulsação âmbar
- **Hover nos cards:** `translateY(-8px)` + `box-shadow` âmbar embaixo + borda âmbar

Nenhuma lib externa — tudo via CSS animations e IntersectionObserver.

---

## Design das Seções

### Navbar
- `position: fixed`, fundo `rgba(8,8,8,0.85)`, `backdrop-filter: blur(16px)`
- Borda inferior âmbar de 1px com `opacity: 0` → `1` ao scroll (classe `.scrolled`)
- Logo: texto "IKIGAI" em Bebas Neue + ícone SVG circular
- Links: Inter 500, espaçamento de letras, hover com cor âmbar
- CTA: botão âmbar sólido
- Mobile: hamburger → drawer lateral com overlay escuro

### Hero
- `min-height: 100vh`, fundo `#080808`
- Radial gradient âmbar atrás do texto: `radial-gradient(ellipse at 50% 40%, rgba(232,151,10,0.18) 0%, transparent 60%)`
- Badge superior: "✦ NOVA COLEÇÃO 2025" — Inter 500, letter-spacing 5px, cor âmbar
- Headline: Bebas Neue, `clamp(4rem, 10vw, 10rem)`, branco, letter-spacing `-0.02em`
- Subtítulo: Inter 300, `clamp(1rem, 2vw, 1.25rem)`, `rgba(255,255,255,0.55)`
- CTAs: botão âmbar sólido + botão fantasma com borda `rgba(255,255,255,0.25)`
- Scroll indicator: chevron animado na base (CSS keyframes)
- Wave divider: SVG com `fill: #0F0F0F` para transição suave para a próxima seção

### Sobre
- Fundo `#0F0F0F`, grid 2 colunas
- Elemento tipográfico: ano "2019" em Bebas Neue, `font-size: 8rem`, `opacity: 0.06`, posicionado em background do bloco de texto
- Linha vertical âmbar de 3px ao lado do texto destacado
- Imagem: `border-radius: 4px`, borda âmbar de 2px, `box-shadow` âmbar sutil

### Produtos
- Fundo `#080808`, grid 3 colunas
- Cards: fundo `#141414`, borda `rgba(255,255,255,0.08)`, `border-radius: 4px`
- Badge de categoria: AQUA (azul `#0EA5E9`), TRAIL (verde `#22C55E`), URBAN (roxo `#A855F7`)
- Hover: borda vira `rgba(232,151,10,0.6)` + `translateY(-8px)` + `box-shadow: 0 20px 40px rgba(232,151,10,0.12)`
- Preço em Bebas Neue, CTA "VER PRODUTO →" revelado no hover

### Diferenciais
- Fundo `#0F0F0F`, grid 3×2
- Cards: ícone SVG âmbar, título Bebas Neue, texto Inter 400
- Bordas sutis, hover com `border-color` âmbar

### Galeria
- Fundo `#080808`, CSS Grid 3 colunas, `grid-auto-rows: 280px`
- 2 itens com `grid-column: span 2` (wide)
- Overlay no hover: `rgba(8,8,8,0.75)` + texto branco + ícone zoom âmbar
- Responsivo: 2 colunas em tablet, 1 em mobile

### Depoimentos
- Fundo `#0F0F0F`, grid 3 colunas
- Aspas tipográficas: `"` em Bebas Neue, `font-size: 6rem`, `color: #E8970A`, `opacity: 0.3`
- Avatar: `border-radius: 50%`, borda âmbar 2px
- Estrelas: `color: #E8970A`

### Contato
- Fundo `#080808`, grid 2 colunas (info + formulário)
- Float labels: label sobe ao focar, fundo de linha âmbar ao focar
- Submit: botão âmbar full-width, texto Bebas Neue
- Ícones sociais com hover âmbar

### Footer
- Fundo `#040404` (mais escuro que o restante)
- Linha divisória topo: `1px solid rgba(232,151,10,0.2)`
- 4 colunas: brand, produtos, empresa, suporte
- Logo Ikigai + tagline

---

## Responsividade

| Breakpoint | Mudanças |
|---|---|
| `≤ 1024px` | Navbar mobile, grids de 3→2 colunas |
| `≤ 768px` | Hero headline menor, grids de 2→1 coluna, sobre stack vertical |
| `≤ 480px` | Hero ações em coluna, galeria 1 coluna, footer 1 coluna |

---

## Conteúdo

Mesmo conteúdo textual da versão refined (pt-BR) — produtos Aqua/Trail/Urban, 6 diferenciais, 3 depoimentos, dados de contato fictícios. Imagens via placeholders coloridos (sem dependência externa).

---

## Verificação

Após implementação, rodar `scripts/test_ikigai_refined.py` adaptado para os novos seletores, verificando:
1. Todas as seções presentes com IDs corretos
2. Animações de entrada disparando no scroll
3. Navbar ganha borda âmbar ao scroll
4. Menu mobile abre/fecha
5. Formulário exibe feedback ao submit
6. Responsivo em 768px e 480px
