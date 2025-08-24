# Pronunciation Trainer Admin Panel

A comprehensive admin panel for managing students, assignments, and grading for the pronunciation trainer application.

## Features

### Students Management
- **Student List**: View all registered students with their basic information
- **Student Portfolio**: Click on any student to view their detailed portfolio including:
  - **Radar Chart**: Visual representation of student strengths and weaknesses across 5 assignment types:
    - Pronunciation
    - Grammar
    - Vocabulary
    - Fluency
    - Comprehension
  - **Assignment List**: All assignments assigned to the student
  - **Performance Metrics**: 
    - Completion rate of assignments
    - Average grade across all assignments
    - Total assignments vs completed assignments

### Assignments Management
- **Assignment List**: View all assignments with a "Create New Assignment" button
- **Create Assignment**: Form to create new assignments with fields for:
  - Title and description
  - Assignment type (Pronunciation, Grammar, Vocabulary, Fluency, Comprehension)
  - Difficulty level (Beginner, Intermediate, Advanced)
  - Instructions and audio URL
  - Active status
- **Edit Assignment**: Modify existing assignments

### Grading System
- **Ungraded Assignments**: List of completed assignments ready for grading
- **Grade Button**: Direct access to grade individual assignments
- **Status Tracking**: Visual indicators for assignment completion status

## Technology Stack

- **React Admin**: For the admin interface
- **Material-UI**: For UI components
- **Recharts**: For data visualization (radar charts)
- **TypeScript**: For type safety
- **Vite**: For development and building

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173/`

## Data Structure

The admin panel currently uses mock data for development. In production, it would connect to a Supabase backend with the following main entities:

- **Students**: User information and performance data
- **Assignments**: Exercise definitions and metadata
- **Student Assignments**: Submission records and grades

## Future Enhancements

- Real-time data synchronization with Supabase
- Advanced filtering and search capabilities
- Bulk grading operations
- Export functionality for reports
- Student progress tracking over time
- Integration with the main pronunciation trainer application

