import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { subHours } from 'date-fns';
import { createId } from '@paralleldrive/cuid2';

const prisma = new PrismaClient();

let maleAvatars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let femaleAvatars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function getRandomItemAndRemove(array) {
  // Generate a random index
  const randomIndex = Math.floor(Math.random() * array.length);

  // Get the item at the random index
  const item = array[randomIndex];

  // Remove the item from the array
  array.splice(randomIndex, 1);

  // Return the removed item
  return item;
}

function generateRandomBoolean(probability) {
  // Generate a random number between 0 and 1
  const random = Math.random();

  // Calculate the threshold based on the probability rate
  const threshold = probability / 100;

  // Return true if the random number is less than the threshold, otherwise false
  return random < threshold;
}

function createRandomUser() {
  const gender = faker.person.sexType();
  const isGenderNonBinary = generateRandomBoolean(15); // 15% chance of being NONBINARY
  const firstName = faker.person.firstName(gender);
  const lastName = faker.person.lastName();
  const fullName = `${firstName} ${lastName}`;
  const id = createId();
  const username = faker.internet
    .userName({ firstName, lastName })
    .replace(/[.-]/g, '_')
    .toLowerCase();
  const email = faker.internet.email({ firstName, lastName });
  const birthDate = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
  const bio = faker.person.bio();
  const website = faker.internet.domainName();
  const phoneNumber = faker.phone.number();
  const address = faker.location.streetAddress({ useFullAddress: true });
  const relationshipStatus = faker.helpers.arrayElement([
    'SINGLE',
    'IN_A_RELATIONSHIP',
    'ENGAGED',
    'MARRIED',
  ]);

  // Get a random profile picture from maleAvatars or femaleAvatars
  // depending on gender, then, remove the returned profile picture
  const randomProfilePhoto = `${getRandomItemAndRemove(
    gender === 'male' ? maleAvatars : femaleAvatars,
  )}.png`;
  // Reset avatars array when all values are consumed
  if (maleAvatars.length === 0) maleAvatars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  if (femaleAvatars.length === 0)
    femaleAvatars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const profilePhotoPath = `seed-${gender}-avatars/${randomProfilePhoto}`;

  // Create fake posts
  const fakePosts = Array.from({ length: 3 }).map((item, i) => ({
    userId: id,
    content: faker.lorem.sentence(),
    createdAt: subHours(new Date(), i),
  }));

  return {
    user: {
      id,
      username,
      name: fullName,
      email,
      gender: isGenderNonBinary ? 'NONBINARY' : gender.toUpperCase(),
      birthDate,
      bio,
      website,
      phoneNumber,
      address,
      profilePhoto: profilePhotoPath,
      relationshipStatus,
    },
    posts: fakePosts,
  };
}

async function main() {
  const fakeUsers = Array.from({ length: 100 }, createRandomUser);

  for (const fakeUser of fakeUsers) {
    const user = await prisma.user.create({
      data: fakeUser.user,
    });
    const post = await prisma.post.createMany({
      data: fakeUser.posts,
    });

    console.log(user);
    console.log(post);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
