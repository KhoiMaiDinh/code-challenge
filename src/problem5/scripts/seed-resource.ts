import dotenv from 'dotenv';
import ResourceModel from '../src/models/resource.model';
import { ResourceType } from '../src/enums/resource.enum';
import { faker } from '@faker-js/faker';

dotenv.config();

export async function seedResources() {
  await ResourceModel.deleteMany({});

  const resources = Array.from({ length: 30 }).map(() => {
    const type = faker.helpers.arrayElement([ResourceType.A, ResourceType.B]);

    const now = faker.date.past({ years: 2 });

    let data: any;
    switch (type) {
      case ResourceType.A:
        data = {
          url: faker.internet.url() + '/video.mp4',
          duration: faker.number.int({ min: 60, max: 600 }),
        };
        break;
      case ResourceType.B:
        data = {
          url: faker.internet.url() + '/document.pdf',
          pages: faker.number.int({ min: 1, max: 50 }),
        };
        break;
    }

    return {
      name: faker.lorem.words({ min: 2, max: 5 }),
      type,
      data,
      createdAt: now,
      updatedAt: now,
    };
  });

  await ResourceModel.insertMany(resources);

  console.log('30 resources seeded successfully');
}
