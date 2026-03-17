import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type OnboardingInput = {
  cityId: string;
  interestCategoryIds: string[];
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async updateOnboarding(userId: string, input: OnboardingInput) {
    if (!input.cityId) {
      throw new BadRequestException('cityId is required');
    }

    if (!Array.isArray(input.interestCategoryIds)) {
      throw new BadRequestException('interestCategoryIds must be an array');
    }

    const city = await this.prisma.city.findUnique({ where: { id: input.cityId } });
    if (!city) {
      throw new NotFoundException('City not found');
    }

    const uniqueIds = [...new Set(input.interestCategoryIds)].filter(Boolean);
    const categories = uniqueIds.length
      ? await this.prisma.eventCategory.findMany({
          where: { id: { in: uniqueIds } },
          select: { id: true },
        })
      : [];

    if (categories.length !== uniqueIds.length) {
      throw new BadRequestException('One or more categories are invalid');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          cityId: input.cityId,
          timezone: city.timezone,
        },
      }),
      this.prisma.userInterest.deleteMany({ where: { userId } }),
      ...(uniqueIds.length
        ? [
            this.prisma.userInterest.createMany({
              data: uniqueIds.map((categoryId) => ({
                userId,
                categoryId,
              })),
            }),
          ]
        : []),
    ]);

    return this.getProfile(userId);
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        timezone: true,
        city: {
          select: {
            id: true,
            name: true,
            slug: true,
            countryCode: true,
            timezone: true,
          },
        },
        interests: {
          select: {
            category: {
              select: { id: true, name: true, slug: true, icon: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      timezone: user.timezone,
      city: user.city,
      interests: user.interests.map((item) => item.category),
    };
  }
}
