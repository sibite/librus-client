# LibrusClient

This project is an independent Librus Diary app created for learning purposes.

## Working parts

- Grades
- Attendances
- Lessons plan (with everything working)
- Events and homeworks
- Timeline (grades, attendances, homeworks)
- Lucky number
- School and class details
- Current and next lesson

## Not existing parts (and not planned)

- Timeline (substitutions and canceled lessons)
- Announcements
- Messages
- Notes
- Homeworks

## Running

Run `ng serve` and `npm run proxy` then navigate to `http://localhost:4200/`

## Deployment

1. Duplicate app/environments/environment.prod.template.ts
2. Rename file to environment.prod.ts
3. Replace proxy url
4. In proxy_server/index.js under `Configuration` comment, replace needed constants with your configuration
5. Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory
6. Deploy files to your server

**Important note: proxy server is neccessary for API to work properly because of CORS**

## Screenshots

![Login page](/readme_assets/auth.jpg "Login page")
![Grades](/readme_assets/grades.jpg "Grades")
![Attendances](/readme_assets/attendances.jpg "Attendances")
![Lessons plan](/readme_assets/lessons_plan.jpg "Lessons plan")
![Timeline](/readme_assets/timeline.jpg "Timeline")
![Settings](/readme_assets/settings.jpg "Settings")


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
