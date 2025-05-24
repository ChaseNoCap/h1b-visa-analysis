import type { IResult } from 'di-framework';

export interface IReportOptions {
  outputDir?: string;
  includeTimestamp?: boolean;
  format?: 'markdown' | 'html' | 'pdf';
}

export interface IReportData {
  outputPath: string;
  metadata: {
    generatedAt: Date;
    duration: number;
    dependencies: string[];
  };
}

export type IReportResult = IResult<IReportData>;

export interface IReportGenerator {
  generate(options?: IReportOptions): Promise<IReportResult>;
}
