import exceljs from "exceljs";

export interface DownloadExcel {
  fileName: string;
  nameWorksheet: string;
  columns: Partial<exceljs.Column>[];
  data: unknown[];
}