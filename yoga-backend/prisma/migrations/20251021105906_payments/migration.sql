-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'COMPLETED');

-- AlterTable
ALTER TABLE "public"."Subscription" ADD COLUMN     "paymentId" TEXT;

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "razorpay_order_id" TEXT,
    "razorpay_payment_id" TEXT,
    "razorpay_signature" TEXT,
    "userId" TEXT NOT NULL,
    "planId" TEXT,
    "startDate" TEXT,
    "subscriptionId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "paymentDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_razorpay_order_id_key" ON "public"."Payment"("razorpay_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_razorpay_payment_id_key" ON "public"."Payment"("razorpay_payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_subscriptionId_key" ON "public"."Payment"("subscriptionId");

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
