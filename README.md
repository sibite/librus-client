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

<table>
  <tr>
    <td>Login page</td>
     <td>Grades</td>
     <td>Attendances</td>
  </tr>
  <tr>
    <td><img src="/readme_assets/auth.jpg" width=270></td>
    <td><img src="/readme_assets/grades.jpg" width=270></td>
    <td><img src="/readme_assets/attendances.jpg" width=270></td>
  </tr>
  <tr>
    <td>Lessons plan</td>
     <td>Timeline</td>
     <td>Settings</td>
  </tr>
  <tr>
    <td><img src="/readme_assets/lessons_plan.jpg" width=270></td>
    <td><img src="/readme_assets/timeline.jpg" width=270></td>
    <td><img src="/readme_assets/settings.jpg" width=270></td>
  </tr>
 </table>

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
