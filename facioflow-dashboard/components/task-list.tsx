import styles from "./task-list.module.css";

/**
 * Shape do task que vem do Supabase com nested relationships.
 *
 * IMPORTANTE: Supabase retorna relationships como ARRAY ou OBJECT dependendo
 * da inferência do schema (foreign keys 1-N retornam array; 1-1 retornam
 * object). Como nosso `lib/supabase/types.ts` declara as relationships sem
 * `isOneToOne: true`, o supabase-js vai tipar como array. Por isso aceitamos
 * ambos os formatos e normalizamos no `resolveBreadcrumb`.
 */
type NestedSpace = { name: string };
type NestedFolder = { name: string; spaces: NestedSpace | NestedSpace[] | null };
type NestedList = { name: string; folders: NestedFolder | NestedFolder[] | null };

export type TaskListItem = {
  id: string;
  name: string;
  status: string;
  priority?: string | null;
  url?: string | null;
  date_updated?: string | null;
  lists: NestedList | NestedList[] | null;
};

export type TaskListProps = {
  title: string;
  tasks: TaskListItem[];
  emptyText: string;
};

/**
 * TaskList — bloco lista vertical da overview.
 *
 * Server Component (sem `"use client"`): só recebe data já filtrada e
 * renderiza HTML. Status badge e priority dot são helpers internos
 * — também SC, sem estado.
 */
export function TaskList({ title, tasks, emptyText }: TaskListProps) {
  return (
    <div className={styles.listContainer}>
      <h3 className={styles.listTitle}>{title}</h3>
      {tasks.length === 0 ? (
        <p className={styles.empty}>{emptyText}</p>
      ) : (
        <ul className={styles.list}>
          {tasks.map((task) => {
            const breadcrumb = resolveBreadcrumb(task.lists);

            return (
              <li key={task.id} className={styles.item}>
                <div className={styles.itemMain}>
                  {task.url ? (
                    <a
                      href={task.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.itemName}
                    >
                      {task.name}
                    </a>
                  ) : (
                    <span className={styles.itemName}>{task.name}</span>
                  )}
                  <span className={styles.itemBreadcrumb} title={breadcrumb}>
                    {breadcrumb}
                  </span>
                </div>
                <div className={styles.itemMeta}>
                  <StatusBadge status={task.status} />
                  {task.priority && <PriorityDot priority={task.priority} />}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/**
 * Normaliza array | object | null das nested relationships e devolve
 * "Space › Folder › List". Falha silenciosa em "?" se algo faltar
 * (defensive — não queremos crashar a overview por uma task órfã).
 */
function resolveBreadcrumb(lists: TaskListItem["lists"]): string {
  const list = pickFirst(lists);
  const folder = pickFirst(list?.folders ?? null);
  const space = pickFirst(folder?.spaces ?? null);

  const spaceName = space?.name ?? "?";
  const folderName = folder?.name ?? "?";
  const listName = list?.name ?? "?";
  return `${spaceName} › ${folderName} › ${listName}`;
}

function pickFirst<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

/**
 * StatusBadge — chip pequeno com background tintado da cor do status.
 *
 * Cor passa via CSS custom property (--status-color) — o CSS module aplica
 * a cor e a transparência. Mantém centralizada a tabela de cores aqui
 * (consistente com o que app/page.tsx usa no donut).
 */
function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] ?? "var(--text-muted)";
  return (
    <span
      className={styles.statusBadge}
      style={{ "--status-color": color } as React.CSSProperties}
    >
      {status}
    </span>
  );
}

function PriorityDot({ priority }: { priority: string }) {
  const color = PRIORITY_COLORS[priority] ?? "var(--text-muted)";
  return (
    <span
      className={styles.priorityDot}
      style={{ background: color }}
      title={`Prioridade: ${priority}`}
      aria-label={`Prioridade ${priority}`}
    />
  );
}

const STATUS_COLORS: Record<string, string> = {
  complete: "var(--supabase)",
  pendente: "var(--accent)",
  "to do": "var(--cyan)",
  "update required": "#FBBF24",
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "var(--n8n)",
  high: "#FBBF24",
  normal: "var(--cyan)",
  low: "var(--text-faint)",
};
