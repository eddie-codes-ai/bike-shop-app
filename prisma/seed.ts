import { auth } from "../lib/auth";

// Creates the very first OWNER account. There's no sign-up page in this
// app, so this script (or manually calling auth.api.signUpEmail from a
// future "invite staff" admin action) is the only way an account ever
// gets created.
//
// Run with real values set as environment variables, so credentials never
// get typed into or saved in this file itself:
//
//   $env:SEED_OWNER_EMAIL="you@example.com"
//   $env:SEED_OWNER_PASSWORD="something-long-and-random"
//   $env:SEED_OWNER_NAME="Your Name"
//   npx tsx prisma/seed.ts
//
// Safe to run only once per email — Better Auth will reject creating a
// second account with the same address.

async function main() {
  const email = process.env.SEED_OWNER_EMAIL;
  const password = process.env.SEED_OWNER_PASSWORD;
  const name = process.env.SEED_OWNER_NAME ?? "Owner";

  if (!email || !password) {
    throw new Error(
      "Set SEED_OWNER_EMAIL and SEED_OWNER_PASSWORD as environment " +
        "variables before running this script — see the comment at the " +
        "top of prisma/seed.ts for the exact commands."
    );
  }

  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      role: "OWNER",
    },
  });

  console.log(`✓ Created OWNER account: ${result.user.email}`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .then(() => process.exit(0));