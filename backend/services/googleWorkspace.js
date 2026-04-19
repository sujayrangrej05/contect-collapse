/**
 * Mocking the Google Workspace data for demonstration purposes,
 * since actual API access requires an active OAuth session.
 * 
 * In a fully deployed version, this would use googleapis package:
 * - google.calendar({ version: 'v3', auth })
 * - google.gmail({ version: 'v1', auth })
 * - google.drive({ version: 'v3', auth })
 */

export async function fetchWorkspaceData() {
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    calendar: [
      { summary: 'Team Sync', start: '10:00 AM', end: '10:30 AM' },
      { summary: 'Project Review', start: '1:00 PM', end: '2:00 PM' },
      { summary: 'Dentist Appointment', start: '4:00 PM', end: '5:00 PM' }
    ],
    gmail: [
      { snippet: 'Please review the Q3 marketing strategy doc by EOD.' },
      { snippet: 'Lunch is here at the front desk.' },
      { snippet: 'URGENT: Server outage on production.' },
      { snippet: 'Newsletter: Top 10 productivity hacks.' },
      { snippet: 'Following up on the design assets for the new landing page.' }
    ],
    drive: [
      { name: 'Q3 Marketing Strategy', id: '1P2_example_id_marketing', mimeType: 'document' },
      { name: 'Server Outage Postmortem', id: '1X9_example_id_outage', mimeType: 'document' },
      { name: 'Design Assets V2', id: '1Y7_example_id_design', mimeType: 'folder' }
    ]
  };
}
