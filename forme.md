The Recommended Flow
1. Housing Asset Module (The "What")
Before a lecturer can apply, the system must know which houses are available.

Action: Create a dashboard for the Housing Officer to register buildings, blocks, and room numbers.

Data needed: Room type (Studio, 1-bedroom, 2-bedroom), condition, and location.

Status: Every house should have a status (Available, Occupied, Under Maintenance).

2. Lecturer Profile & Criteria Module (The "Who")
The regulation documents you provided are very specific about the 100-point scale. A lecturer cannot simply "apply"; they must first have a verified profile that generates their score.

Action: Create a form where Lecturers enter their:

Academic Rank (Title)

Years of Service

Administrative Roles

Family Status

Tech Hint: Use your Next.js forms to upload proof (PDFs) for each claim. Use Drizzle to save these, but keep the "Total Score" as a calculated field or a column that only updates after an Officer verifies the documents.

3. The Application Module (The "Action")
Once the houses are in the system and the users have their scores ready, you build the Application flow.

The Flow:

Officer creates an "Application Round" (e.g., "Phase 1 - 2026").

Lecturer sees a list of "Available" houses.

Lecturer submits an application for a specific house or a general request.

System links their current "Verified Score" to that specific application.

4. The Allocation Engine (The "Result")
This is the most complex part where you write the logic to sort the applicants.

Action: Create a "Generate Rank" button for the Committee Member role.

Logic: The system should sort all applicants for a specific house by their Score.

Tie-Breaking: Apply the "Affirmative Action" rules from the doc (extra points for gender or disability) if two people have the same score.

Why this flow?
If you start with the Application now, you will realize later that you don't have the "Score" data to rank them, and you'll have to go back and rewrite your database schema.

My Suggestion:
Start by defining your Drizzle Schema for the Housing Units and the User Points. This ensures your PostgreSQL database is ready to handle the math required by the UoG regulations.

Would you like me to show you how to structure the Drizzle schema for the "Points" table based on the point values in your documents?


codex resume 019d454e-9dbc-73a1-8d3e-592abc98b71f

codex resume 019d6e9c-6bb6-7963-b169-0544b5cdff84

codex resume 019d8ba8-0fe9-7370-9e9e-159733f93a41