import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  async getOptions() {
    const [cities, categories, venues] = await Promise.all([
      this.prisma.city.findMany({
        select: { id: true, name: true, slug: true, countryCode: true, timezone: true },
        orderBy: { name: 'asc' },
      }),
      this.prisma.eventCategory.findMany({
        select: { id: true, slug: true, name: true, icon: true },
        orderBy: { name: 'asc' },
      }),
      this.prisma.venue.findMany({
        select: {
          id: true,
          cityId: true,
          name: true,
          addressLine: true,
          latitude: true,
          longitude: true,
        },
        orderBy: { name: 'asc' },
        take: 200,
      }),
    ]);

    return {
      cities,
      categories,
      venues: venues.map((venue) => ({
        ...venue,
        latitude: this.decimalToNumber(venue.latitude),
        longitude: this.decimalToNumber(venue.longitude),
      })),
    };
  }

  private decimalToNumber(value: Prisma.Decimal | null) {
    if (value === null) {
      return null;
    }
    return Number(value);
  }
}
