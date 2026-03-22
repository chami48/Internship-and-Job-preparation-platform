the current repositary is internship  selection , this group project have 4 members and there are 4 modules in this project and i am doing AI Evaluation & Candidate Filtering Module and i am already done the front end pages which are 
Student Exam Result page
Student Evaluation Details page
Student Permission Status page
Filtered Candidates page for company/recruiter
Candidate Details page for recruiter/admin i did using claude opus model using prompt prompt is given below 



I am building only the frontend for the AI Evaluation & Candidate Filtering Module in a group project. Use the existing project structure and do not modify unrelated files or other team members’ modules. I only want frontend UI pages and reusable components for my module. Use Next.js, TypeScript, and Tailwind CSS. Keep the code clean, modern, responsive, and easy to connect to backend later using mock data for now. Create separate reusable components where appropriate.

Create a responsive student exam result page for an AI Evaluation & Candidate Filtering module using Next.js + TypeScript + Tailwind CSS. The page should include:
- a page title "Exam Result"
- summary cards for Total Score, Percentage, Status, and Cutoff
- a clear PASS or FAIL badge
- a feedback section with AI summary feedback
- a section showing whether CV upload is unlocked or locked
- a button to view detailed evaluation
Use clean card-based UI, modern spacing, rounded corners, and mock data. Do not connect backend yet.


Create a student evaluation details page in Next.js + TypeScript + Tailwind CSS. This page should show a list of evaluated questions. For each question show:
- question number
- question text
- student answer
- model/expected answer
- score received
- maximum marks
- AI feedback
Design it as clean stacked cards, mobile responsive, with good readability. Use mock data and reusable components. Do not modify other pages.


Create a responsive permission status page for students after AI evaluation using Next.js + TypeScript + Tailwind CSS. Show:
- a success state when the student passed and CV upload is unlocked
- a failure state when the student did not meet the cutoff
- a clear status message
- a progress/next-step section
- buttons for next actions
The UI should look modern, professional, and simple. Use mock data with conditional rendering for pass/fail.


Create a company/recruiter dashboard page for filtered candidates using Next.js + TypeScript + Tailwind CSS. The page should include:
- page title
- search bar
- filter dropdowns for status and score range
- a table or card layout of qualified candidates
- columns for candidate name, applied role, score, percentage, status, and action button
- responsive design for desktop and mobile
Use mock candidate data and keep the page ready for backend integration later.


Create a candidate details page for a recruiter dashboard using Next.js + TypeScript + Tailwind CSS. Show:
- candidate profile summary
- applied role
- final score
- percentage
- pass/fail status
- section-wise evaluation summary
- list of answers with AI feedback
- an action area for shortlist/review status display only
Use a professional admin dashboard style with clean cards and responsive layout. Use mock data and reusable UI components.


Create reusable frontend components for an AI Evaluation & Candidate Filtering module using Next.js + TypeScript + Tailwind CSS. Components needed:
- ScoreCard
- StatusBadge
- FeedbackBox
- QuestionReviewCard
- CandidateTable
- SearchFilterBar
Keep the components reusable, typed with interfaces, responsive, and styled consistently. Use mock props examples where useful.


Create a mock data file in TypeScript for the AI Evaluation & Candidate Filtering frontend module. Include sample data for:
- student exam result
- evaluated questions
- permission status
- filtered candidate list
- candidate detail page
Keep the data realistic and structured so it can later be replaced with API data easily.


Suggest a clean frontend folder structure for the AI Evaluation & Candidate Filtering Module only, inside an existing Next.js app. I need pages for student results, evaluation details, permission status, recruiter filtered candidates, and candidate details. Also include a components folder and mock data folder. Do not affect unrelated modules.

Only create new files for my module or update files that belong directly to my AI Evaluation & Candidate Filtering frontend. Do not edit shared layout, navbar, footer, header, home page, jobs page, or any unrelated files unless I explicitly ask. // 


and now i have to do the backend for this pages and , note that my part i only AI section which means D:\project\Internship-and-Job-preparation-platform\src\app\ai   , if want to edit anything or create only under this path sections

now i have to do the backend for my ai part which is Student Exam Result page
Student Evaluation Details page
Student Permission Status page
Filtered Candidates page for company/recruiter
Candidate Details page for recruiter/admin for this pages and , and if i want to do the ai evalution which means the 01 – Exam Submission Received

Answers Locked & Sent for Evaluation
Candidate ID Matched

02 – Intelligent AI Evaluation

Compares with Model Answers
Handles Wording Varies (Semantic Analysis)

03 – Scoring & Cutoff Check

Calculates Final Score
Compares to Job Cutoff

04 – Candidate Filtering

Marks Pass/Fail
Filters Best Candidates for Company View

05 – Result Generation & Permission

Generates Evaluation Result
Grants CV Upload Permission based on Pass/Fail    

 this is the structure of my part and and i am using gemini api key for this ai part and currently mock datas are i added as of now but i want real data machanism so i want details(database details and question bank and more ) from others module , then only i can evaluate using ai model for calculations 


