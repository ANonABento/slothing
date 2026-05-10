export function getPipelineCount(
  jobsByStatus: Record<string, number>,
  status: string,
): number {
  if (status === "saved") {
    return (jobsByStatus.saved || 0) + (jobsByStatus.pending || 0);
  }
  return jobsByStatus[status] || 0;
}

export function getPipelineTotal(jobsByStatus: Record<string, number>): number {
  return (
    getPipelineCount(jobsByStatus, "saved") +
    getPipelineCount(jobsByStatus, "applied") +
    getPipelineCount(jobsByStatus, "interviewing") +
    getPipelineCount(jobsByStatus, "offered")
  );
}
