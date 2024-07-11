import { init } from "@paralleldrive/cuid2";

export const genProfileId = init({
    random: Math.random,
    length: 20,
    fingerprint: 'profile-id-gen',
  });