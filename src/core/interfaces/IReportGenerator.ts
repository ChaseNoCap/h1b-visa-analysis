export interface IReportOptions {
  outputDir?: string;
  includeTimestamp?: boolean;
  format?: 'markdown' | 'html' | 'pdf';
}

export interface IReportResult {
  success: boolean;
  outputPath?: string;
  error?: Error;
  metadata?: {
    generatedAt: Date;
    duration: number;
    dependencies: string[];
  };
}

export interface IReportGenerator {
  generate(options?: IReportOptions): Promise<IReportResult>;
}
