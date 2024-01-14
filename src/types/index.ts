export type DatabaseInfos = {
  host: string;
  localName: string;
  remoteName: string;
};

export type DocRecord = Record<string, number | string>;

export type Env = 'local' | 'remote';
