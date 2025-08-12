export interface AllNodes {
  items: { id: string; entityName: string }[];
  pageIndex: number;
  totalItems: number;
  categoryName: string | null;
}

export interface Graph {
  nodes: { id: string; label: string }[];
  edges: { from: string; to: string; id: string }[];
}

export interface Account {
  id: string;
  entityName: string;
}
