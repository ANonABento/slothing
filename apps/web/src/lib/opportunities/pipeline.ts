export function getPipelineCount(
  jobsByStatus: Record<string, number>,
  status: string,
): number {
  if (status === "saved") {
    return (jobsByStatus.saved || 0) + (jobsByStatus.pending || 0);
  }
  // Accept both legacy `offered` and canonical `offer` so a freshly-migrated
  // DB and an in-memory tally that hasn't been swept yet both resolve.
  if (status === "offer") {
    return (jobsByStatus.offer || 0) + (jobsByStatus.offered || 0);
  }
  return jobsByStatus[status] || 0;
}

export function getPipelineTotal(jobsByStatus: Record<string, number>): number {
  return (
    getPipelineCount(jobsByStatus, "saved") +
    getPipelineCount(jobsByStatus, "applied") +
    getPipelineCount(jobsByStatus, "interviewing") +
    getPipelineCount(jobsByStatus, "offer")
  );
}
