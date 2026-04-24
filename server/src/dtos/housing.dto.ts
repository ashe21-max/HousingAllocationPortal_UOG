import type {
  HousingCondition,
  HousingStatus,
  RoomType,
} from '../lib/db/schema/housing.js';

export type CreateHousingUnitDto = {
  buildingName: string;
  blockNumber: string;
  roomNumber: string;
  roomType: RoomType;
  condition: HousingCondition;
  status?: HousingStatus;
  location: string;
};

export type ListHousingUnitsQueryDto = {
  status?: HousingStatus;
  roomType?: RoomType;
};

export type UpdateHousingUnitDto = {
  id: string;
  buildingName?: string;
  blockNumber?: string;
  roomNumber?: string;
  roomType?: RoomType;
  status?: HousingStatus;
  condition?: HousingCondition;
  location?: string;
};
