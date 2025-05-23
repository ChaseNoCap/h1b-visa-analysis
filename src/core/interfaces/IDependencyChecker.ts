export interface IDependencyStatus {
  name: string;
  available: boolean;
  version?: string;
  path?: string;
  error?: string;
}

export interface IDependencyChecker {
  checkDependency(name: string): Promise<IDependencyStatus>;
  checkAllDependencies(): Promise<IDependencyStatus[]>;
}