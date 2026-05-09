// facioflow-dashboard/lib/clickup/types.ts
export type ClickUpSpace = {
  id: string;
  name: string;
};

export type ClickUpFolder = {
  id: string;
  name: string;
  space: { id: string; name: string };
};

export type ClickUpList = {
  id: string;
  name: string;
  orderindex: number | string;
  folder: { id: string; name: string };
  space: { id: string; name: string };
};

export type ClickUpTask = {
  id: string;
  name: string;
  status: { status: string };
  priority: { priority: string } | null;
  due_date: string | null;
  url: string;
  date_created: string;
  date_updated: string;
  list: { id: string };
};
