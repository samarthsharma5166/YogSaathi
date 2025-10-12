-- AlterTable
ALTER TABLE `ScheduledMessage` MODIFY `targetAudience` ENUM('ALL', 'ADMIN', 'SUBSCRIBERS', 'FREETRIAL') NOT NULL;
