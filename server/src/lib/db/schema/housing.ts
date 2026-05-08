import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const roomTypeEnum = pgEnum('room_type', [
  'Studio',
  '1-Bedroom',
  '2-Bedroom',
  '3-Bedroom',
]);

export const housingConditionEnum = pgEnum('housing_condition', [
  'New',
  'Good',
  'Needs Repair',
  'Under Maintenance',
]);

export const housingStatusEnum = pgEnum('housing_status', [
  'Available',
  'Occupied',
  'Reserved',
]);

export const housingUnits = pgTable(
  'housing_units',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    buildingName: varchar('building_name', { length: 255 }).notNull(),
    blockNumber: varchar('block_number', { length: 100 }).notNull(),
    roomNumber: varchar('room_number', { length: 100 }).notNull(),
    roomType: roomTypeEnum('room_type').notNull(),
    condition: housingConditionEnum('condition').notNull(),
    status: housingStatusEnum('status').notNull().default('Available'),
    location: varchar('location', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('housing_units_building_location_block_room_unique').on(
      table.buildingName,
      table.location,
      table.blockNumber,
      table.roomNumber,
    ),
  ],
);

export type HousingUnit = InferSelectModel<typeof housingUnits>;
export type NewHousingUnit = InferInsertModel<typeof housingUnits>;
export type RoomType = (typeof roomTypeEnum.enumValues)[number];
export type HousingCondition =
  (typeof housingConditionEnum.enumValues)[number];
export type HousingStatus = (typeof housingStatusEnum.enumValues)[number];
