// AI development workflows and context management
export async function loadContext() {
  return {
    template: "default",
    metadata: {
      version: "1.0",
      generated: new Date().toISOString()
    }
  };
}