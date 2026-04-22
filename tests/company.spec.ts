import { test, expect } from '@playwright/test';

test.describe('Company Module Testing', () => {

  // Registration
  test('Company Registration Form Works', async ({ page }) => {
    await page.goto('http://localhost:3000/company/register');

    await page.getByPlaceholder('Acme Corp').fill('Test Company');

    await page.getByPlaceholder('hr@company.com')
      .fill('demo@company.com');

    await page.getByPlaceholder('Min. 8 characters').fill('Demo123!');
    await page.getByPlaceholder('Re-enter your password').fill('Demo123!');

    await page.getByRole('button', { name: /create account/i }).click();

    await page.waitForTimeout(1500);

   const screenshot = await page.screenshot({ fullPage: true });

await test.info().attach('register', {
  body: screenshot,
  contentType: 'image/png',
});
  });

  // Login Success
test('Company Login Success', async ({ page }) => {
  await page.goto('http://localhost:3000/company/comlogin');

  await page.getByPlaceholder('hr@company.com')
    .fill('nilumidakshika5@gmail.com');

  await page.getByPlaceholder('Your password')
    .fill('Nilumi123#');

  await page.waitForTimeout(1500);

  const screenshot = await page.screenshot({ fullPage: true });

  await test.info().attach('login-success', {
    body: screenshot,
    contentType: 'image/png',
  });
});

  // Login Fail
  test('Company Login Fail', async ({ page }) => {
    await page.goto('http://localhost:3000/company/comlogin');

    await page.getByPlaceholder('hr@company.com')
      .fill('wrong@company.com');

    await page.getByPlaceholder('Your password')
      .fill('wrongpass');

    await page.getByRole('button', { name: /sign in/i }).click();

    await page.waitForTimeout(1500);

    const screenshot = await page.screenshot({ fullPage: true });

await test.info().attach('login-fail', {
  body: screenshot,
  contentType: 'image/png',
});
  });

  // Create Job Post
test('Create Job Post', async ({ page }) => {

  
  await page.goto('http://localhost:3000/company/create-job');

  await page.waitForTimeout(1500);

  // STEP 1: JOB BASICS
  await page.getByPlaceholder('e.g. Frontend Developer')
    .fill('Frontend Intern');

  await page.getByPlaceholder('e.g. Colombo, Sri Lanka')
    .fill('Colombo');

  await page.locator('select').nth(0).selectOption({ index: 1 }); // Role
  await page.locator('select').nth(1).selectOption({ index: 1 }); // Type
  await page.locator('select').nth(2).selectOption({ index: 1 }); // Level

  await page.getByPlaceholder('e.g. React, TypeScript, Node.js')
    .fill('React, Next.js');

  // Go to Step 2
  await page.getByRole('button', { name: 'Next' }).first().click();

  await page.waitForTimeout(1500);

  // STEP 2: JOB DETAILS
  await page.locator('textarea').nth(0)
    .fill('We are hiring a frontend intern with strong React knowledge and real-world project experience');

  await page.locator('textarea').nth(1)
    .fill('Develop user interfaces, collaborate with team members, fix bugs, and participate in code reviews');

  await page.locator('textarea').nth(2)
    .fill('Strong knowledge of React, JavaScript, problem solving, teamwork, and communication skills');

  await page.waitForTimeout(1500);

  const screenshot = await page.screenshot({ fullPage: true });

  await test.info().attach('job-created', {
    body: screenshot,
    contentType: 'image/png',
  });

});

  // Dashboard
  test('Dashboard Loads and Shows Data', async ({ page }) => {
    await page.goto('http://localhost:3000/company/dashboard');

    await page.waitForTimeout(1500);

    const screenshot = await page.screenshot({ fullPage: true });

await test.info().attach('dashboard', {
  body: screenshot,
  contentType: 'image/png',
});
  });

});