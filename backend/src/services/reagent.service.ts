import { reagentUsages, reagents } from "../prisma/seeds/seed.ts";
import { HazardLevel, StorageCondition } from "../types/enums.ts";
import type { Reagent } from "../types/interfaces.ts";
import { ApiError } from "../utils/response.ts";

export const EXPIRY_WARNING_DAYS = 30;

export function getDaysRemaining(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getExpiryStatus(expiryDate: string): "normal" | "warning" | "expired" {
  const days = getDaysRemaining(expiryDate);
  if (days < 0) return "expired";
  if (days <= EXPIRY_WARNING_DAYS) return "warning";
  return "normal";
}

export const reagentService = {
  list(lowOnly = false) {
    return lowOnly ? reagents.filter((item) => item.stock < item.minStock) : reagents;
  },
  detail(id: string) {
    const reagent = reagents.find((item) => item.id === id);
    if (!reagent) throw new ApiError(404, "REAGENT_NOT_FOUND", "试剂不存在");
    return {
      ...reagent,
      daysRemaining: getDaysRemaining(reagent.expiryDate),
      expiryStatus: getExpiryStatus(reagent.expiryDate),
      usageHistory: reagentUsages.filter((usage) => usage.reagentId === id)
    };
  },
  create(input: Partial<Reagent>) {
    const reagent: Reagent = {
      id: `rg-${Date.now()}`,
      name: input.name ?? "新试剂",
      casNo: input.casNo ?? "N/A",
      formula: input.formula ?? "N/A",
      purity: input.purity ?? "分析纯",
      hazardLevel: input.hazardLevel ?? HazardLevel.Safe,
      storageCondition: input.storageCondition ?? StorageCondition.RoomTemp,
      supplier: input.supplier ?? "待补充",
      stock: Number(input.stock ?? 0),
      unit: input.unit ?? "瓶",
      minStock: Number(input.minStock ?? 1),
      location: input.location ?? "未分配",
      expiryDate: input.expiryDate ?? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    };
    reagents.unshift(reagent);
    return reagent;
  },
  stockIn(id: string, quantity: number) {
    const reagent = reagents.find((item) => item.id === id);
    if (!reagent) throw new ApiError(404, "REAGENT_NOT_FOUND", "试剂不存在");
    reagent.stock += quantity;
    return reagent;
  }
};
