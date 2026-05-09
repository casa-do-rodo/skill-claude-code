// facioflow-dashboard/lib/clickup/client.ts
import type { ClickUpSpace, ClickUpFolder, ClickUpList, ClickUpTask } from "./types";

const BASE = "https://api.clickup.com/api/v2";

function headers(token: string) {
  return { Authorization: token, "Content-Type": "application/json" };
}

export async function getSpaces(token: string, teamId: string): Promise<ClickUpSpace[]> {
  const res = await fetch(`${BASE}/team/${teamId}/space?archived=false`, { headers: headers(token) });
  if (!res.ok) throw new Error(`ClickUp getSpaces failed: ${res.status}`);
  const data = await res.json();
  return data.spaces;
}

export async function getFolders(token: string, spaceId: string): Promise<ClickUpFolder[]> {
  const res = await fetch(`${BASE}/space/${spaceId}/folder?archived=false`, { headers: headers(token) });
  if (!res.ok) throw new Error(`ClickUp getFolders failed: ${res.status}`);
  const data = await res.json();
  return data.folders;
}

export async function getLists(token: string, folderId: string): Promise<ClickUpList[]> {
  const res = await fetch(`${BASE}/folder/${folderId}/list?archived=false`, { headers: headers(token) });
  if (!res.ok) throw new Error(`ClickUp getLists failed: ${res.status}`);
  const data = await res.json();
  return data.lists;
}

export async function getTasks(token: string, listId: string): Promise<ClickUpTask[]> {
  const tasks: ClickUpTask[] = [];
  let page = 0;
  while (true) {
    const res = await fetch(
      `${BASE}/list/${listId}/task?archived=false&include_closed=true&page=${page}`,
      { headers: headers(token) }
    );
    if (!res.ok) throw new Error(`ClickUp getTasks failed: ${res.status}`);
    const data = await res.json();
    tasks.push(...data.tasks);
    if (data.tasks.length < 100) break;
    page++;
  }
  return tasks;
}
