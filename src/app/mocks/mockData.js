import { faker } from '@faker-js/faker';

export const generateMockItem = () => {
  const type = faker.helpers.arrayElement(['jpg', 'fig', 'pdf', 'mp4', 'docx', 'aep']);

  return {
    id: faker.string.uuid(),
    name: `${faker.string.alpha(8)}.${type}`,
    type,
    status: faker.helpers.arrayElement(['Connected', 'Uploaded', 'Error']),
    date: faker.date.between({ from: '2022-01-01', to: new Date() }),
    createdBy: faker.internet.email(),
  };
};
