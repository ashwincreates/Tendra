export enum Source {
  POSTGRES = "POSTGRES",
  EXCEL = "EXCEL",
}

type SQLConfig = {
  uri: string;
};

type ExcelConfig = {
  data: string;
};

export type SourceConfig = SQLConfig | ExcelConfig;
