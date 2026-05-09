---
name: svg-animations-pitfalls
description: Catálogo de bugs comuns ao animar SVGs — transform-box, animate r não-GPU, animateMotion em paths complexos, IDs colidindo, ARIA conflicts. Use SEMPRE junto com a skill svg-animations ao implementar animação SVG. Cada pitfall vem com sintoma, diagnóstico, fix e referência ao incidente real que originou a lição.
---

# SVG Animations — Common Pitfalls

Lições extraídas de bugs reais nos projetos `facioflow-v3` e `facioflow-agency`. Cada pitfall = bug visto em produção, com diagnóstico exato e fix testado.

**Use junto com `svg-animations`** — esta skill cobre o que NÃO fazer; `svg-animations` cobre o que fazer.

---

## Pitfall 1: `transform-box: fill-box` quebra origin em `<circle>` / `<path>`

**Sintoma:** A animação CSS roda mas o elemento "some" ou aparece offset, geralmente fora do viewport visível do SVG.

**Causa:** `transform-box: fill-box` faz o `transform-origin` ser relativo à bounding box DO ELEMENTO ANIMADO. Para `<circle r="80">` posicionado em `cx=100 cy=100`, com CSS `transform-origin: 100px 100px`, o origin cai FORA do círculo (fill-box do circle vai de -80 a 80 relativos ao próprio elemento, não ao viewBox do SVG).

**Fix:** usar `transform-box: view-box` (ou simplesmente remover o atributo — view-box é o default em SVG):

```css
/* ❌ ERRADO — origin fica offset */
.loader .ring {
  animation: pulse 2s linear infinite;
  transform-box: fill-box;
  transform-origin: 100px 100px;
}

/* ✅ CORRETO — origin no centro do viewBox */
.loader .ring {
  animation: pulse 2s linear infinite;
  transform-box: view-box;
  transform-origin: 100px 100px;
}
```

**Caso real:** `facioflow-v3` Concentric Pulse loader (Frontend stack) renderizou como círculo cinza estático em vez de 3 anéis pulsando. `fill-box` mandou os anéis pra fora do viewport. Mesmo bug afetou o Wavy Ring (Supabase loader).

---

## Pitfall 2: `<animate attributeName="r">` força reflow não-GPU

**Sintoma:** Animação roda mas página fica "pesada" — frames perdidos durante scroll, jank visível em mobile mid-tier.

**Causa:** SMIL `<animate attributeName="r">` ou `attributeName="stroke-width">` não é GPU-composited. Cada frame força reflow + repaint do SVG inteiro. Combinado com `<filter>` (especialmente `feGaussianBlur`) ou `<clipPath>` complexo, o custo multiplica.

**Fix:** trocar por animação CSS de `transform: scale()` num `<g>` envolvendo o `<circle>`. Performance: GPU layer, zero reflow.

```html
<!-- ❌ CARO — force reflow a cada frame -->
<circle cx="100" cy="100" r="20" stroke="cyan">
  <animate attributeName="r" from="20" to="80" dur="2s" repeatCount="indefinite"/>
  <animate attributeName="stroke-width" from="14" to="2" dur="2s" repeatCount="indefinite"/>
</circle>

<!-- ✅ GPU — transform-only, zero reflow -->
<g class="pulse">
  <circle cx="100" cy="100" r="80" stroke="cyan" stroke-width="2"/>
</g>
<style>
  @keyframes pulse {
    from { transform: scale(0.25); opacity: 1; }
    to   { transform: scale(1); opacity: 0; }
  }
  .pulse {
    animation: pulse 2s cubic-bezier(0.3, 0.6, 0.4, 1) infinite;
    transform-origin: 100px 100px;
    transform-box: view-box;
  }
</style>
```

**Caso real:** `facioflow-v3` hero F — pulse waves com `<animate attributeName="r">` em 3 circles + `<filter feGaussianBlur>` causou drop de fps em mobile mid-tier. Reescrita com `transform: scale()` resolveu.

---

## Pitfall 3: `animateMotion` em path com 80+ comandos é caro

**Sintoma:** Partícula seguindo path complexo causa jank, especialmente em browsers mid-tier.

**Causa:** `<animateMotion><mpath href="#complex"/></animateMotion>` recalcula posição em cada frame ao longo do path. Path de 80+ cubic béziers (ex: contorno de logo vetorizado) força milhões de operações de pathfinding por segundo.

**Fix:** três opções, em ordem de preferência:
1. **Simplificar o path original** com SVG path simplifier (Inkscape > Path > Simplify) — reduzir pra 10-20 comandos preservando a forma
2. **Criar path "trail" separado** simplificado seguindo a forma geral do logo (não precisa ser idêntico)
3. **Reduzir número de partículas** de 3-4 para 1

```html
<!-- ❌ CARO — partícula segue contorno complexo do logo -->
<path id="logoPath" d="M169.558 1153.17 C167.769 1161.72 ... [80 comandos] ..."/>
<circle r="5" fill="cyan">
  <animateMotion dur="5s" repeatCount="indefinite">
    <mpath href="#logoPath"/>
  </animateMotion>
</circle>

<!-- ✅ EFICIENTE — path simplificado -->
<path id="logoTrail" d="M 200 800 C 250 800 280 850 280 1000 L 280 1200 C 280 1250 230 1290 200 1290"/>
<circle r="5" fill="cyan">
  <animateMotion dur="5s" repeatCount="indefinite">
    <mpath href="#logoTrail"/>
  </animateMotion>
</circle>
```

**Caso real:** `facioflow-v3` hero F — 3 partículas em motion path do `#fv3Main` (path de contorno do F com ~80 comandos) flagrado pelo audit como caro em browsers mid-tier.

---

## Pitfall 4: IDs de SVG colidem entre múltiplos arquivos

**Sintoma:** Animação que funciona isolada quebra ao colocar 2+ SVGs animados na mesma página.

**Causa:** SVG `<defs>` com `id="clip"`, `id="filter"`, `id="orbit"` em arquivo A colide com mesmo id em arquivo B. O browser usa o primeiro `id` que encontra no DOM. Resultado: clipPath errado, filter aplicado no SVG errado, etc.

**Fix:** prefixo único por SVG/componente. Use o nome do componente como prefix.

```html
<!-- ❌ Genérico — colidirá -->
<svg>
  <defs>
    <clipPath id="clip">...</clipPath>
    <filter id="glow">...</filter>
  </defs>
</svg>

<!-- ✅ Prefixed — isolado -->
<svg>
  <defs>
    <clipPath id="hero-f-clip">...</clipPath>
    <filter id="hero-f-glow">...</filter>
  </defs>
</svg>
```

**Caso real:** `facioflow-v3` — hero F + service mockups precisariam ter colisões sem prefixos `fv3-` em todos os IDs (`fv3Main`, `fv3Clip`, `fv3Glow`, etc.). Auditor confirmou prevenção bem-sucedida.

---

## Pitfall 5: `<title>`/`<desc>` dentro de pai com `aria-hidden="true"`

**Sintoma:** Screen reader não anuncia o SVG, mesmo com `<title>` e `<desc>` corretos.

**Causa:** `aria-hidden="true"` no elemento pai (ex: `<div class="hero-visual" aria-hidden="true">`) suprime TODOS os filhos da árvore acessível, incluindo SVGs com a11y attributes próprios. `aria-labelledby` apontando pra IDs internos do SVG é ignorado.

**Fix:** decidir um padrão consistente:

**Padrão A — SVG decorativo (caso da maioria):**
```html
<div class="hero-visual" aria-hidden="true">
  <svg viewBox="...">
    <!-- SEM <title>, SEM <desc>, SEM role="img" -->
    <path d="..."/>
  </svg>
</div>
```

**Padrão B — SVG informativo (raro em LPs):**
```html
<div class="hero-visual">
  <svg viewBox="..." role="img" aria-labelledby="hero-svg-title hero-svg-desc">
    <title id="hero-svg-title">FacioFlow logo</title>
    <desc id="hero-svg-desc">F vetorizado em azul com partículas orbitais</desc>
    <path d="..."/>
  </svg>
</div>
```

**Não misture os dois** — pai com `aria-hidden` + filho com `<title>` é estado inconsistente.

**Caso real:** `facioflow-v3` audit — hero F com `aria-labelledby` no SVG mas `aria-hidden` no pai. Title nunca foi lido. Auditor flaggou em Alta prioridade.

---

## Pitfall 6: Animar `r` direto causa "snap" sem `keyTimes`

**Sintoma:** SMIL animation com `calcMode="spline"` mas o easing não funciona como esperado — animação parece linear ou tem "snaps" inesperados.

**Causa:** `<animate values="10;380">` sem `keyTimes` deixa o browser interpolar uniformemente. Adicionar `calcMode="spline"` SEM `keyTimes` matching causa comportamento inconsistente entre engines.

**Fix:** sempre forneça `keyTimes` matching o número de keyframes em `values`:

```html
<!-- ❌ Inconsistente -->
<animate attributeName="r" values="10;380" calcMode="spline" keySplines="0 0 0.58 1" dur="4s"/>

<!-- ✅ Consistente -->
<animate attributeName="r" values="10;380" keyTimes="0;1" calcMode="spline" keySplines="0 0 0.58 1" dur="4s"/>
```

**Caso real:** `facioflow-skills-landing` v2 audit — keyTimes ausente nos animates de pulse waves. Fix aplicado.

---

## Checklist antes de fazer commit de qualquer SVG animado

- [ ] Animação rotacional/scale usa `transform-box: view-box` (ou pai `<g>` com transform aplicado)?
- [ ] Sem `<animate attributeName="r">` ou `stroke-width` em loop infinito?
- [ ] `animateMotion` em path com <20 comandos?
- [ ] IDs com prefix do componente/seção?
- [ ] Decisão clara entre decorativo (sem title/desc, pai com aria-hidden) vs informativo (com title/desc, pai sem aria-hidden)?
- [ ] `prefers-reduced-motion` respeita (animação para ou reduz)?
- [ ] `keyTimes` presente em `<animate>` com `calcMode="spline"`?
- [ ] Console do browser sem warnings de SMIL (alguns browsers reclamam)?
