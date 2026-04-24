import type { HousingCondition, HousingStatus, RoomType } from '../lib/db/schema/housing.js';

export type HousingUnitRecord = {
  id: string;
  buildingName: string;
  blockNumber: string;
  roomNumber: string;
  roomType: RoomType;
  condition: HousingCondition;
  status: HousingStatus;
  location: string;
  createdAt: Date;
  updatedAt: Date;
};
