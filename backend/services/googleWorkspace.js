import { google } from 'googleapis';
import { oauth2Client } from './googleAuth.js';

export async function fetchWorkspaceData(tokens) {
  // If no tokens are provided (e.g., testing locally without login), return mock data
  if (!tokens) {
    console.log("No OAuth tokens found. Using mock workspace data.");
    return {
      calendar: [
        { summary: 'Team Sync', start: '10:00 AM', end: '10:30 AM' },
        { summary: 'Project Review', start: '1:00 PM', end: '2:00 PM' }
      ],
      gmail: [
        { snippet: 'Please review the Q3 marketing strategy doc by EOD.' },
        { snippet: 'Lunch is here at the front desk.' },
        { snippet: 'URGENT: Server outage on production.' }
      ],
      drive: [
        { name: 'Q3 Marketing Strategy', id: '1P2_example_id_marketing', mimeType: 'document' },
        { name: 'Server Outage Postmortem', id: '1X9_example_id_outage', mimeType: 'document' }
      ]
    };
  }

  oauth2Client.setCredentials(tokens);

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  try {
    // 1. Fetch next 3 upcoming Calendar events
    const now = new Date().toISOString();
    const calendarRes = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now,
      maxResults: 3,
      singleEvents: true,
      orderBy: 'startTime',
    });
    const calendarEvents = (calendarRes.data.items || []).map(e => ({
      summary: e.summary,
      start: e.start.dateTime || e.start.date,
      end: e.end.dateTime || e.end.date
    }));

    // 2. Fetch up to 5 recent unread primary emails
    const messagesRes = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread category:primary',
      maxResults: 5
    });
    
    const emails = [];
    if (messagesRes.data.messages) {
      for (const msg of messagesRes.data.messages) {
        const msgData = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'metadata',
          metadataHeaders: ['Subject', 'From']
        });
        emails.push({
          snippet: msgData.data.snippet,
          subject: msgData.data.payload.headers.find(h => h.name === 'Subject')?.value
        });
      }
    }

    // 3. Fetch 3 most recently modified Drive files
    const driveRes = await drive.files.list({
      pageSize: 3,
      fields: 'files(id, name, mimeType)',
      orderBy: 'modifiedByMeTime desc'
    });
    const driveFiles = driveRes.data.files || [];

    return {
      calendar: calendarEvents,
      gmail: emails,
      drive: driveFiles
    };
  } catch (error) {
    console.error("Error fetching live Workspace data:", error);
    throw error;
  }
}
