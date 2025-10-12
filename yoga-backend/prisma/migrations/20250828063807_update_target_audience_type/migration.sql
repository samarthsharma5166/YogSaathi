-- AlterTable
ALTER TABLE `ScheduledMessage` MODIFY `targetAudience` ENUM('ALL', 'SUBSCRIBERS', 'FREETRIAL') NOT NULL;
