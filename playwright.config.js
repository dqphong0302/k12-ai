import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir:'./tests/e2e',
  timeout:30000,
  fullyParallel:false,
  reporter:'line',
  use:{baseURL:'http://127.0.0.1:4173',trace:'retain-on-failure'},
  webServer:{command:'pnpm preview --host 127.0.0.1 --port 4173',url:'http://127.0.0.1:4173',reuseExistingServer:false},
  projects:[
    {name:'chromium',testIgnore:/mobile\.spec\.js/,use:{...devices['Desktop Chrome'],permissions:['camera'],launchOptions:{args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']}}},
    {name:'mobile',testMatch:/mobile\.spec\.js/,use:{...devices['Pixel 7']}},
    {name:'webkit',testIgnore:/mobile\.spec\.js/,use:{...devices['Desktop Safari']}}
  ]
})
