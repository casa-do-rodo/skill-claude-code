"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./sidebar.module.css";

const STORAGE_KEY = "facioflow_sidebar_collapsed";

type NavRoute = {
  href: string;
  label: string;
  icon: "overview" | "projetos" | "clientes";
};

const ROUTES: NavRoute[] = [
  { href: "/", label: "Overview", icon: "overview" },
  { href: "/projetos", label: "Projetos", icon: "projetos" },
  { href: "/clientes", label: "Clientes", icon: "clientes" },
];

/**
 * Atualiza a custom property que o shell (main wrapper) consome via padding-left.
 * Mantida no :root pra ser observada por qualquer descendente sem prop drilling.
 */
function setSidebarWidthVar(collapsed: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty(
    "--sidebar-current-width",
    collapsed ? "var(--sidebar-width-collapsed)" : "var(--sidebar-width-expanded)"
  );
  // data-attr no body permite overrides finos em CSS quando necessário
  document.body.dataset.sidebarCollapsed = collapsed ? "true" : "false";
}

export function Sidebar() {
  const pathname = usePathname();

  // Default expanded (false). useEffect aplica o valor real do localStorage no mount —
  // SSR-safe: server sempre renderiza expanded, client hidrata e ajusta.
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hidratação: lê localStorage 1x e seta a CSS var pro shell
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const initial = stored === "true";
      setCollapsed(initial);
      setSidebarWidthVar(initial);
    } catch {
      // localStorage bloqueado (private mode, etc) — usa default expanded
      setSidebarWidthVar(false);
    }
    setHydrated(true);
  }, []);

  // Persiste mudanças de collapsed após hidratar
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      // ignora — não vale a pena quebrar UX
    }
    setSidebarWidthVar(collapsed);
  }, [collapsed, hydrated]);

  // Fecha drawer mobile ao mudar de rota
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Bloqueia scroll do body quando drawer aberto no mobile
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Escuta evento custom disparado pelo Topbar (hamburger button)
  useEffect(() => {
    const handler = () => setMobileOpen(true);
    window.addEventListener("facioflow:sidebar-open", handler);
    return () => window.removeEventListener("facioflow:sidebar-open", handler);
  }, []);

  // Escape fecha drawer mobile (a11y — modal-like overlay precisa de saída por teclado)
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <nav
        className={styles.sidebar}
        data-collapsed={collapsed ? "true" : "false"}
        data-mobile-open={mobileOpen ? "true" : "false"}
        aria-label="Navegação principal"
      >
        <div className={styles.header}>
          <img
            src="/icone-branco.svg"
            alt=""
            className={styles.logo}
            aria-hidden="true"
          />
          <span className={styles.wordmark} aria-hidden={collapsed}>
            FacioFlow
          </span>
        </div>

        <div className={styles.nav}>
          {ROUTES.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={styles.navItem}
              data-active={isActive(route.href) ? "true" : "false"}
              title={collapsed ? route.label : undefined}
            >
              <NavIcon name={route.icon} />
              <span className={styles.navLabel}>{route.label}</span>
            </Link>
          ))}
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
            aria-expanded={!collapsed}
          >
            <ChevronIcon direction={collapsed ? "right" : "left"} />
          </button>
        </div>
      </nav>

      <div
        className={styles.backdrop}
        data-visible={mobileOpen ? "true" : "false"}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}

/* ============================================================
   Icons — SVG inline com paths exatos do briefing.
   Stroke/fill controlados via CSS (currentColor) pra herdar tema.
   ============================================================ */

function NavIcon({ name }: { name: NavRoute["icon"] }) {
  const common = {
    className: styles.navIcon,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
  };

  if (name === "overview") {
    return (
      <svg {...common}>
        <path d="M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z" />
      </svg>
    );
  }

  if (name === "projetos") {
    return (
      <svg {...common}>
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    );
  }

  // clientes
  return (
    <svg {...common}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg className={styles.toggleIcon} viewBox="0 0 24 24" aria-hidden="true">
      {direction === "left" ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  );
}

/**
 * Helper exportado para o Topbar abrir o drawer mobile sem prop drilling.
 * Dispara um CustomEvent que a Sidebar escuta no useEffect acima.
 */
export function openMobileSidebar() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("facioflow:sidebar-open"));
}
