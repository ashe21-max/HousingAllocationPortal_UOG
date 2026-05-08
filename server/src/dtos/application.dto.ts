export type SaveApplicationDraftDto = {
  roundId: string;
  preferredHousingUnitId?: string | null;
  notes?: string | null;
  scoreSnapshotId?: string | null;
};

export type SaveApplicationDraftInput = {
  roundId: string;
  preferredHousingUnitId: string | null;
  notes: string | null;
  scoreSnapshotId?: string | null;
};
