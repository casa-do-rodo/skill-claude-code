---
name: brand-aware-defaults
description: Tabela de cores e identidade visual de marcas conhecidas (n8n, Supabase, GitHub, Vercel, Stripe, Anthropic, etc.). Use ao especificar LPs ou apps que mencionem serviços de terceiros — defaults para a cor de marca real em vez de assumir azul genérico. Quando o spec mencionar um serviço conhecido, consultar esta skill antes de definir o accent color.
---

# Brand-Aware Defaults

Quando um spec menciona um serviço conhecido (n8n, Supabase, GitHub, etc.), use a cor de marca real, **não** um accent genérico do projeto. Isso é regra, não preferência.

## Por quê

- **Reconhecimento imediato** — visitantes que conhecem n8n associam vermelho com n8n. Pintar o card do n8n de azul quebra essa associação
- **Evita o anti-pattern** "todo logo de tech vira azul porque azul é seguro"
- **Brand consistency** com a comunidade do serviço
- **Diferenciação visual** quando há múltiplos stacks na mesma view (cyan + azul + verde + vermelho cria hierarquia natural)

## Tabela de marcas

| Serviço | Cor primária | Hex | Notas de uso |
|---|---|---|---|
| **n8n** | red/coral | `#EA4B48` | brand red oficial |
| **Supabase** | green | `#3ECF8E` | brand green oficial |
| **GitHub** | preto | `#181717` | usar `#fff` em dark theme |
| **GitLab** | orange | `#FC6D26` | brand orange |
| **Vercel** | preto | `#000` | minimalismo total |
| **Netlify** | teal | `#00C7B7` | brand teal |
| **Stripe** | purple/blue | `#635BFF` | gradient roxo-azul comum |
| **OpenAI** | preto/verde | `#10A37F` | preto base + accent verde |
| **Anthropic** | terracotta | `#CC785C` | warm orange-brown |
| **Cloudflare** | orange | `#F38020` | brand orange |
| **AWS** | orange | `#FF9900` | orange icônico |
| **Google Cloud** | multicolor | `#4285F4` | azul base, multicolor opcional |
| **Azure** | blue | `#0078D4` | azul institucional |
| **Notion** | preto/cinza | `#37352F` | quase preto |
| **Figma** | multicolor | `#F24E1E` | orange laranja primário |
| **Linear** | indigo | `#5E6AD2` | indigo característico |
| **Slack** | aubergine | `#4A154B` | aubergine principal |
| **Discord** | blurple | `#5865F2` | "blurple" oficial |
| **WhatsApp** | green | `#25D366` | brand green |
| **Telegram** | blue | `#26A5E4` | azul telegram |
| **Tailwind** | cyan | `#06B6D4` | cyan-500 |
| **Next.js** | preto | `#000` | minimalist preto |
| **Nuxt** | green | `#00DC82` | brand green |
| **React** | cyan | `#61DAFB` | cyan claro |
| **Vue** | green | `#42B883` | brand green |
| **Svelte** | orange | `#FF3E00` | brand orange |
| **Solid** | blue | `#2C4F7C` | azul institucional |
| **MongoDB** | green | `#00ED64` | brand green |
| **PostgreSQL** | blue | `#336791` | azul institucional |
| **MySQL** | blue/orange | `#4479A1` | azul (orange é decorativo) |
| **Redis** | red | `#DC382D` | brand red |
| **Docker** | blue | `#2496ED` | azul docker |
| **Kubernetes** | blue | `#326CE5` | azul k8s |
| **Twilio** | red | `#F22F46` | brand red |
| **Sendgrid** | blue | `#1A82E2` | azul institucional |
| **HubSpot** | orange | `#FF7A59` | brand orange |
| **Mailchimp** | yellow | `#FFE01B` | yellow icônico |
| **Zapier** | orange | `#FF4A00` | brand orange |
| **Make (Integromat)** | purple | `#6D00CC` | brand purple |
| **Airtable** | yellow/red | `#FFBF00` | yellow primário |

## Regras de aplicação

1. **Identificadores de stack** (badge, label, ícone do loader): cor da marca direta
2. **Categoria/section accent**: cor da marca dim (alpha 0.12) + border (alpha 0.3)
3. **Texto sobre dark**: cor da marca pode falhar WCAG — testar contraste, criar variant clarificada se necessário (ex: `--n8n-text` com luminosidade +20%)
4. **Múltiplas marcas na mesma view**: respeitar diversidade. NÃO forçar paleta unificada
5. **CTAs/botões principais do produto**: usar cor da marca DO CLIENTE, não do serviço terceiro

## Pattern de tokens (CSS)

```css
:root {
  /* Cliente — accent principal */
  --accent: #2463EB;        /* azul do cliente */

  /* Serviços terceiros — branded */
  --n8n:           #EA4B48;
  --n8n-dim:       rgba(234, 75, 72, 0.12);
  --border-n8n:    rgba(234, 75, 72, 0.3);

  --supabase:      #3ECF8E;
  --supabase-dim:  rgba(62, 207, 142, 0.12);
  --border-supabase: rgba(62, 207, 142, 0.3);
}
```

## Pattern de uso (HTML + CSS)

```html
<span class="stack-label stack-label--n8n">n8n</span>
<span class="stack-label stack-label--supabase">Supabase</span>
```

```css
.stack-label--n8n {
  color: var(--n8n);
  background: var(--n8n-dim);
  border: 1px solid var(--border-n8n);
}
.stack-label--supabase {
  color: var(--supabase);
  background: var(--supabase-dim);
  border: 1px solid var(--border-supabase);
}
```

## Quando NÃO usar a cor da marca

- **LP do próprio cliente** que tem brand identity próprio — use a cor do CLIENTE, não de serviços terceiros mencionados
- **Casos onde o accent precisa ser monocromático** (newsletter, email, print)
- **Quando há 5+ serviços listados num grid** — caos visual. Use grid neutro com logos ao invés de blocks coloridos
- **Audit de a11y falhar** — clarificar a cor pra atender WCAG é OK, mas mantenha o hue. NÃO troque vermelho do n8n por azul

## Workflow de validação

1. Spec menciona serviço conhecido (ex: "card pra n8n")
2. Consultar tabela acima → cor primária
3. Adicionar 3 tokens em `tokens.css`: `--service`, `--service-dim`, `--border-service`
4. Validar contraste do texto sobre dark (WebAIM Contrast Checker ou ferramenta equivalente)
5. Se contraste < 4.5:1 para texto pequeno: criar variant `--service-text` clarificada

## Quando a marca não está na tabela

- Buscar oficial brand assets (geralmente `<service>.com/brand` ou `<service>.com/press`)
- Verificar simpleicons.org como fallback (cores + SVG dos logos)
- Confirmar com o usuário antes de assumir cor genérica
- **Adicionar à tabela** se for serviço relevante para o ecossistema (PR pro skills repo)

## Caso real

`facioflow-v3` — primeira versão usou azul accent (`--accent`) para o n8n stack identifier. Audit visual flagrou: "n8n é vermelho, não azul." Corrigido na iteração seguinte adicionando tokens `--n8n` e clarificando que a regra é seguir brand color quando serviço conhecido é referenciado.
